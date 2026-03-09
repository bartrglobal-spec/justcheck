/**
 * externalSignals.js
 * -------------------
 * Context-Aware External Signal Engine (v6)
 * DuckDuckGo search + Firecrawl page crawling + caching
 */

import dotenv from "dotenv";
dotenv.config();

import axios from "axios";
import * as cheerio from "cheerio";
import FirecrawlApp from "firecrawl";

console.log("externalSignals.js LOADED (Context-Aware v6)");
console.log("Firecrawl key:", process.env.FIRECRAWL_API_KEY ? "YES" : "NO");

const firecrawl = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY
});

/* ---------------- CACHE ---------------- */

const CACHE_TTL = 1000 * 60 * 10; // 10 minutes
const signalCache = new Map();

/* ---------------- CONFIG ---------------- */

const PROXIMITY_WINDOW = 200;
const MAX_CRAWL_PAGES = 5;

const STRONG_TERMS = [
  "scam",
  "scammer",
  "fraud",
  "fraudster",
  "ripoff",
  "con artist",
  "criminal",
  "phishing",
  "fake",
  "blacklist",
];

const WEAK_TERMS = [
  "suspicious",
  "avoid",
  "be careful",
  "complaint",
  "reported",
  "warning",
  "review",
  "unsafe",
];

const GENERIC_EXCLUSION_PHRASES = [
  "how to avoid scams",
  "tips to prevent fraud",
  "what is phishing",
  "stay safe online",
  "how to protect yourself",
  "general scam advice",
];

/* ---------------- MAIN EXPORT ---------------- */

export default async function fetchExternalSignals(identifier, identifierType) {

  console.log("fetchExternalSignals CALLED with:", identifier);

  const cacheKey = `${identifier}_${identifierType}`;
  const cached = signalCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log("CACHE HIT:", identifier);
    return cached.data;
  }

  const normalized = normalizeIdentifier(identifier, identifierType);

  const duckHTML = await duckSearch(identifier);

  if (!duckHTML) {
    return buildEmptyResult(identifier);
  }

  const { texts, urls } = extractDuckResults(duckHTML);

  const firecrawlTexts = [];

  /* ---------------- FIRECRAWL PAGE CRAWL ---------------- */

  for (const url of urls.slice(0, MAX_CRAWL_PAGES)) {

    try {

      console.log("Firecrawl crawling:", url);

      const result = await firecrawl.scrape(url, {
        formats: ["markdown"]
      });

      if (result?.markdown) {
        firecrawlTexts.push(result.markdown.toLowerCase());
      }

    } catch (err) {

      console.log("Firecrawl crawl failed:", err.message);

    }

  }

  const combinedTexts = [...texts, ...firecrawlTexts];

  /* ---------------- ANALYSIS ---------------- */

  let totalScore = 0;
  let contextualHits = 0;
  let warningHits = 0;

  for (const text of combinedTexts) {

    const lowerText = text.toLowerCase();

    if (isGenericScamContent(lowerText) && !lowerText.includes(normalized)) {
      continue;
    }

    const analysis = analyzeContext(normalized, lowerText);

    if (analysis.score > 0) {
      contextualHits++;
      totalScore += analysis.score;
    }

    if (analysis.warning === true) {
      warningHits++;
    }

  }

  const severity = determineSeverity(totalScore);

  const result = {
    identifier,
    score: totalScore,
    severity,
    contextual_hits: contextualHits,
    source: "duckduckgo+firecrawl_pages",
    has_web_presence: contextualHits > 0,
    discussion_mentions_count: contextualHits,
    warning_mentions_count: warningHits
  };

  signalCache.set(cacheKey, {
    data: result,
    timestamp: Date.now()
  });

  return result;

}

/* ---------------- DUCK SEARCH ---------------- */

async function duckSearch(query) {

  try {

    const response = await axios.get(
      "https://html.duckduckgo.com/html/",
      {
        params: { q: `"${query}"` },
        headers: { "User-Agent": "Mozilla/5.0" },
        timeout: 8000
      }
    );

    return response.data;

  } catch (err) {

    console.log("Duck search failed:", err.message);
    return null;

  }

}

/* ---------------- RESULT EXTRACTION ---------------- */

function extractDuckResults(html) {

  const $ = cheerio.load(html);

  const texts = [];
  const urls = [];

  $(".result").each((_, el) => {

    const title = $(el).find(".result__title").text();
    const snippet = $(el).find(".result__snippet").text();
    const link = $(el).find(".result__url").attr("href");

    const combined = `${title} ${snippet}`.trim();

    if (combined.length > 20) {
      texts.push(combined.toLowerCase());
    }

    if (link && link.startsWith("http")) {
      urls.push(link);
    }

  });

  return { texts, urls };

}

/* ---------------- CONTEXT ANALYSIS ---------------- */

function analyzeContext(identifier, text) {

  let score = 0;
  let warning = false;

  const occurrences = countOccurrences(text, identifier);

  if (occurrences === 0) {
    return { score: 0, warning: false };
  }

  score += 5;

  if (occurrences >= 3) {
    score += 20;
  }

  for (const term of STRONG_TERMS) {

    if (isWithinProximity(identifier, term, text)) {
      score += 60;
      warning = true;
    }

  }

  for (const term of WEAK_TERMS) {

    if (isWithinProximity(identifier, term, text)) {
      score += 40;
      warning = true;
    }

  }

  return { score, warning };

}

/* ---------------- HELPERS ---------------- */

function normalizeIdentifier(id, type) {

  if (!id) return "";

  switch (type) {

    case "phone":
      return id.replace(/\D/g, "");

    case "email":
      return id.toLowerCase();

    case "name":
    case "business":
      return id
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .replace(/\s+/g, " ")
        .trim();

    default:
      return id.toLowerCase();

  }

}

function countOccurrences(text, target) {

  const regex = new RegExp(target, "g");
  const matches = text.match(regex);

  return matches ? matches.length : 0;

}

function isWithinProximity(identifier, term, text) {

  const idIndex = text.indexOf(identifier);
  const termIndex = text.indexOf(term);

  if (idIndex === -1 || termIndex === -1) return false;

  return Math.abs(idIndex - termIndex) <= PROXIMITY_WINDOW;

}

function isGenericScamContent(text) {

  return GENERIC_EXCLUSION_PHRASES.some((phrase) =>
    text.includes(phrase)
  );

}

function determineSeverity(score) {

  if (score >= 80) return "red";
  if (score >= 50) return "amber";
  if (score >= 20) return "light_amber";

  return "none";

}

function buildEmptyResult(identifier) {

  return {
    identifier,
    score: 0,
    severity: "none",
    contextual_hits: 0,
    source: "duckduckgo+firecrawl_pages",
    has_web_presence: false,
    discussion_mentions_count: 0,
    warning_mentions_count: 0
  };

}
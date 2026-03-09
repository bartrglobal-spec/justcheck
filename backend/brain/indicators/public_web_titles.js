/**
 * public_web_titles.js
 * --------------------
 * Hybrid public web signal collector.
 *
 * Sources:
 *  - Firecrawl API (structured search)
 *  - DuckDuckGo HTML scrape (fallback + merge)
 *
 * Indicator Output:
 * {
 *   triggered: boolean,
 *   score: number,
 *   level: string,
 *   code: string,
 *   message: string
 * }
 */

const FIRECRAWL_ENDPOINT = "https://api.firecrawl.dev/v1/search";
const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;

const FIRECRAWL_WEIGHT = 1.0;
const DUCK_WEIGHT = 0.7;

const WARNING_KEYWORDS = [
  "scam",
  "fraud",
  "fake",
  "ripoff",
  "abuse"
];

const DISCUSSION_KEYWORDS = [
  "complaint",
  "review",
  "warning",
  "spam"
];

/* -------------------------
   Keyword Counters
--------------------------*/

function countHits(text, keywords) {

  const lower = text.toLowerCase();
  let hits = 0;

  for (const word of keywords) {

    const regex = new RegExp(`\\b${word}\\b`, "g");
    const match = lower.match(regex);

    if (match) {
      hits += match.length;
    }

  }

  return hits;

}

/* -------------------------
   Strip HTML
--------------------------*/

function stripHTML(html) {

  return html.replace(/<[^>]*>?/gm, " ");

}

/* -------------------------
   Firecrawl
--------------------------*/

async function queryFirecrawl(identifier) {

  if (!FIRECRAWL_API_KEY) {

    console.log("Firecrawl API key missing.");

    return {
      detected: false,
      discussionHits: 0,
      warningHits: 0,
      score: 0
    };

  }

  try {

    const query = `${identifier} scam fraud complaint review`;

    const response = await fetch(FIRECRAWL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${FIRECRAWL_API_KEY}`
      },
      body: JSON.stringify({
        query,
        limit: 5
      })
    });

    const data = await response.json();

    if (!data.results || data.results.length === 0) {

      return {
        detected: false,
        discussionHits: 0,
        warningHits: 0,
        score: 0
      };

    }

    let combinedText = "";

    for (const result of data.results) {

      combinedText += " " + (result.title || "");
      combinedText += " " + (result.snippet || "");

    }

    const warningHits = countHits(combinedText, WARNING_KEYWORDS);
    const discussionHits = countHits(combinedText, DISCUSSION_KEYWORDS);

    const score = (warningHits * 3) + discussionHits;

    return {
      detected: true,
      discussionHits,
      warningHits,
      score
    };

  } catch (err) {

    console.log("Firecrawl error:", err.message);

    return {
      detected: false,
      discussionHits: 0,
      warningHits: 0,
      score: 0
    };

  }

}

/* -------------------------
   DuckDuckGo
--------------------------*/

async function queryDuckDuckGo(identifier) {

  try {

    const query = encodeURIComponent(
      `${identifier} scam fraud complaint review`
    );

    const url = `https://html.duckduckgo.com/html/?q=${query}`;

    const response = await fetch(url);
    const html = await response.text();

    if (!html || html.length < 500) {

      return {
        detected: false,
        discussionHits: 0,
        warningHits: 0,
        score: 0
      };

    }

    const cleanText = stripHTML(html);

    const warningHits = countHits(cleanText, WARNING_KEYWORDS);
    const discussionHits = countHits(cleanText, DISCUSSION_KEYWORDS);

    const score = (warningHits * 3) + discussionHits;

    return {
      detected: true,
      discussionHits,
      warningHits,
      score
    };

  } catch (err) {

    console.log("Duck scrape error:", err.message);

    return {
      detected: false,
      discussionHits: 0,
      warningHits: 0,
      score: 0
    };

  }

}

/* -------------------------
   Merge
--------------------------*/

function mergeSignals(firecrawl, duck) {

  const discussionHits =
    (firecrawl.discussionHits * FIRECRAWL_WEIGHT) +
    (duck.discussionHits * DUCK_WEIGHT);

  const warningHits =
    (firecrawl.warningHits * FIRECRAWL_WEIGHT) +
    (duck.warningHits * DUCK_WEIGHT);

  const score =
    (firecrawl.score * FIRECRAWL_WEIGHT) +
    (duck.score * DUCK_WEIGHT);

  return {
    detected: firecrawl.detected || duck.detected,
    discussionHits: Math.round(discussionHits),
    warningHits: Math.round(warningHits),
    score: Math.round(score)
  };

}

/* -------------------------
   Indicator Runner
--------------------------*/

async function collectSignals(identifier) {

  const [firecrawlResult, duckResult] = await Promise.all([
    queryFirecrawl(identifier),
    queryDuckDuckGo(identifier)
  ]);

  return mergeSignals(firecrawlResult, duckResult);

}

/* -------------------------
   Indicator Export
--------------------------*/

export default {

  id: "public_web_titles",

  order: 30,

  async run(brain) {

    const identifier = brain.identifier;

    const result = await collectSignals(identifier);

    console.log("---- PUBLIC WEB TITLES SIGNAL ----");
    console.log(JSON.stringify(result, null, 2));

    if (!result.detected) {

      return {
        triggered: false,
        score: 0,
        level: "info",
        code: "NO_PUBLIC_WEB_SIGNAL",
        message: "No meaningful public web discussion detected."
      };

    }

    let level = "info";

    if (result.warningHits >= 3) {
      level = "high";
    } else if (result.warningHits >= 1) {
      level = "medium";
    }

    return {
      triggered: true,
      score: Math.min(result.score, 30),
      level,
      code: "PUBLIC_WEB_DISCUSSION",
      message: "Public web discussions referencing this identifier were detected."
    };

  }

};
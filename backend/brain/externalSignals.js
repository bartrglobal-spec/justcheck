import dotenv from "dotenv";
dotenv.config();

import axios from "axios";
import * as cheerio from "cheerio";

/* Scam seeder */
import scamSignalSeeder from "./signal/scamSignalSeeder.js";

console.log("externalSignals.js LOADED (v29 STABILITY FIX)");

/* ---------------- CACHE ---------------- */

const CACHE_TTL = 1000 * 60 * 10;
const signalCache = new Map();

/* ---------------- CONFIG ---------------- */

const MAX_REDDIT_POSTS = 10;

const DIRECTORY_SITES = [
"truecaller","tellows","numlookup","whocalledme","unknownphone",
"sync.me","syncme","hitta","whocalled","shouldianswer",
"callerr","numberguru","phoneowner","phone-directory",
"reversephone","whitepages","yellowpages"
];

const STRONG_TERMS = [
"scam","scammer","fraud","fraudster","ripoff","con artist",
"criminal","phishing","fake","blacklist","stole","stolen",
"steal","thief","theft","extortion","spoofing"
];

const WEAK_TERMS = [
"suspicious","avoid","be careful","complaint","reported",
"warning","review","unsafe","spam","harassment",
"unknown caller","blocked"
];

/* ---------------- MAIN FUNCTION ---------------- */

export default async function fetchExternalSignals(identifier, identifierType, options = {}) {

const paid = options.paid === true;

const cacheKey = `${identifier}_${identifierType}_${paid}`;
const cached = signalCache.get(cacheKey);

if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
return cached.data;
}

const variants = buildVariants(identifier, identifierType);

console.log("External search variants:", variants);

/* ---------------- SEARCH QUERIES ---------------- */

const queries = [
identifier,
`${identifier} scam`,
`${identifier} fraud`,
`${identifier} warning`,
`site:reddit.com ${identifier}`
];

let texts = [];
let urls = [];

/* ---------------- DUCK SEARCH ---------------- */

for (const q of queries) {

const duckHTML = await duckSearch(q);
if (!duckHTML) continue;

const extracted = extractDuckResults(duckHTML);

texts.push(...extracted.texts);
urls.push(...extracted.urls);

}

console.log("Duck texts:", texts.length);
console.log("Duck urls:", urls.length);

/* ---------------- FILTER DIRECTORY SITES ---------------- */

const filteredTexts = [];
const filteredUrls = [];

for (let i = 0; i < urls.length; i++) {

const url = (urls[i] || "").toLowerCase();
const text = texts[i];

const isDirectory = DIRECTORY_SITES.some(site => url.includes(site));

if (isDirectory) continue;

// 🔒 HARD GUARD (prevent undefined text)
if (!text || typeof text !== "string") continue;

filteredUrls.push(urls[i]);
filteredTexts.push(text.toLowerCase());

}

console.log("Filtered texts:", filteredTexts.length);

/* ---------------- REDDIT SEARCH ---------------- */

const redditResults = await redditSearch(variants);

console.log("Reddit results:", redditResults.length);

for (const r of redditResults) {
if (r && typeof r.text === "string") {
filteredTexts.push(r.text.toLowerCase());
}
}

/* ---------------- SEEDER ---------------- */

try {
if (typeof scamSignalSeeder === "function") {
scamSignalSeeder(filteredTexts, "duckduckgo+reddit");
}
} catch (e) {
console.log("Seeder error:", e.message);
}

/* ---------------- CONTEXT ANALYSIS ---------------- */

let totalScore = 0;
let contextualHits = 0;
let warningHits = 0;

const signals = [];

for (const text of filteredTexts) {

// 🔒 HARD GUARD (double safety)
if (!text || typeof text !== "string") continue;

const analysis = analyzeContext(variants, text);

if (analysis.score > 0) {

contextualHits++;
totalScore += analysis.score;

signals.push({
text,
strength: analysis.score >= 80 ? "high" : "medium"
});

}

if (analysis.warning) {
warningHits++;
}

}

/* ---------------- UNIQUE DOMAIN COUNT ---------------- */

const domains = new Set();

for (const url of filteredUrls) {

try {
const hostname = new URL(url).hostname.replace("www.", "");
domains.add(hostname);
} catch {}

}

/* ---------------- UNIQUE REDDIT THREAD COUNT ---------------- */

const redditThreads = new Set();

for (const r of redditResults) {
if (r.url) redditThreads.add(r.url);
}

/* ---------------- TOTAL DISCUSSION COUNT ---------------- */

const mentions = domains.size + redditThreads.size;

/* ---------------- VOLUME SIGNAL ---------------- */

if (mentions > 50) totalScore += 40;
else if (mentions > 25) totalScore += 20;
else if (mentions > 10) totalScore += 10;

/* ---------------- RISK BUCKET ---------------- */

let risk = "green";

if (totalScore > 200) risk = "red";
else if (totalScore > 80) risk = "amber";

/* ---------------- SIGNAL STRENGTH ---------------- */

let signalStrength = "none";

if (contextualHits === 0) signalStrength = "none";
else if (contextualHits < 3) signalStrength = "low";
else if (contextualHits < 7) signalStrength = "medium";
else signalStrength = "high";

/* ---------------- RESULT ---------------- */

const result = {

identifier,

score: totalScore,
risk,

signals,

contextual_hits: contextualHits,

has_web_presence: mentions > 0,

discussion_mentions_count: mentions,
warning_mentions_count: warningHits,

identifier_mentions_total: mentions,

signal_strength: signalStrength,

source: "duckduckgo+reddit"

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
params: { q: query },
headers: { "User-Agent": "Mozilla/5.0" },
timeout: 12000
}
);

return response.data;

} catch (e) {

console.log("Duck search error:", e.message);
return null;

}

}

/* ---------------- REDDIT SEARCH ---------------- */

async function redditSearch(variants) {

const collected = [];

try {

for (const variant of variants.slice(0, 8)) {

const response = await axios.get(
"https://www.reddit.com/search.json",
{
params: {
q: variant,
limit: MAX_REDDIT_POSTS,
sort: "relevance"
},
headers: { "User-Agent": "JustCheckItBot/1.0" },
timeout: 8000
}
);

const posts = response.data?.data?.children || [];

for (const p of posts) {

const title = p.data.title || "";
const body = p.data.selftext || "";
const permalink = p.data.permalink || "";

const url = permalink
? `https://reddit.com${permalink}`
: null;

const combined = `${title} ${body}`.trim();

if (combined.length > 0) {
collected.push({
text: combined.toLowerCase(),
url
});
}

}

}

} catch (e) {

console.log("Reddit search error:", e.message);

}

return collected;

}

/* ---------------- DUCK PARSER ---------------- */

function extractDuckResults(html) {

const $ = cheerio.load(html);

const texts = [];
const urls = [];

$(".result").each((_, el) => {

const title = $(el).find(".result__a").text();
const snippet = $(el).find(".result__snippet").text();
let link = $(el).find(".result__a").attr("href");

const combined = `${title} ${snippet}`.trim();

if (combined.length > 20) {
texts.push(combined.toLowerCase());
} else {
texts.push(null); // keep index alignment
}

if (link) {

if (link.includes("uddg=")) {
urls.push(decodeURIComponent(link.split("uddg=")[1]));
} else if (link.startsWith("http")) {
urls.push(link);
} else {
urls.push(null);
}

} else {
urls.push(null);
}

});

return { texts, urls };

}

/* ---------------- CONTEXT ANALYSIS ---------------- */

function analyzeContext(variants, text) {

if (!text || typeof text !== "string") {
return { score: 0, warning: false };
}

let score = 0;
let warning = false;

const normalized = text.toLowerCase();
const digitsOnly = normalized.replace(/\D/g, "");

for (const variant of variants) {

if (!variant) continue;

const v = variant.toLowerCase();
const vDigits = v.replace(/\D/g, "");

if (!normalized.includes(v) && !digitsOnly.includes(vDigits)) continue;

for (const term of STRONG_TERMS) {
if (normalized.includes(term)) {
score += 80;
warning = true;
break;
}
}

for (const term of WEAK_TERMS) {
if (normalized.includes(term)) {
score += 40;
warning = true;
break;
}
}

break;

}

return { score, warning };

}

/* ---------------- PHONE VARIANTS ---------------- */

function buildVariants(id, type) {

if (type !== "phone") return [id.toLowerCase()];

const digits = id.replace(/\D/g, "");

const variants = new Set();

variants.add(id);
variants.add(digits);

if (digits.length >= 10) {
variants.add(digits.replace(/(\d{3})(\d{3})(\d+)/, "$1 $2 $3"));
variants.add(digits.replace(/(\d{3})(\d{3})(\d+)/, "$1-$2-$3"));
}

if (id.startsWith("+")) {

const withoutCountry = digits.slice(-10);

variants.add("0" + withoutCountry.slice(1));
variants.add(`${withoutCountry.slice(0,3)} ${withoutCountry.slice(3,6)} ${withoutCountry.slice(6)}`);
variants.add(`${withoutCountry.slice(0,3)}-${withoutCountry.slice(3,6)}-${withoutCountry.slice(6)}`);

}

return [...variants];

}
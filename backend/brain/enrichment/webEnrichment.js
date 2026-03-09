import fetch from "node-fetch";

/**
 * webEnrichment (v3 - diagnostic mode)
 * ------------------------------------
 * DuckDuckGo HTML enrichment with terminal diagnostics.
 * This version logs raw response length and preview
 * so we can confirm what DuckDuckGo is returning.
 */

const DUCK_ENDPOINT = "https://duckduckgo.com/html/";

const WARNING_KEYWORDS = [
  "scam",
  "fraud",
  "complaint",
  "review",
  "warning",
  "ripoff",
  "blacklist"
];

function cleanText(text = "") {
  return text
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function countKeywordNearIdentifier(text, identifier) {
  let count = 0;

  for (const word of WARNING_KEYWORDS) {
    const regex = new RegExp(
      `${identifier}.{0,80}${word}|${word}.{0,80}${identifier}`,
      "gi"
    );
    const matches = text.match(regex);
    if (matches) {
      count += matches.length;
    }
  }

  return count;
}

export default async function webEnrichment(identifier = "") {
  if (!identifier) {
    return null;
  }

  const query = `"${identifier}"`;
  const url = `${DUCK_ENDPOINT}?q=${encodeURIComponent(query)}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36"
      }
    });

    clearTimeout(timeout);

    if (!response.ok) {
      console.log("DuckDuckGo response not OK:", response.status);
      return null;
    }

    const html = await response.text();

    // 🔎 DIAGNOSTICS
    console.log("---------- DUCK RESPONSE ----------");
    console.log("HTML LENGTH:", html.length);
    console.log("HTML PREVIEW:");
    console.log(html.slice(0, 1000));
    console.log("-----------------------------------");

    const snippetMatches = html.match(
      /result__body[\s\S]*?result__snippet/g
    );

    const snippets = snippetMatches || [];

    let contextualWarnings = 0;

    for (const snippet of snippets) {
      const clean = cleanText(snippet);
      contextualWarnings += countKeywordNearIdentifier(
        clean,
        identifier.toLowerCase()
      );
    }

    return {
      has_web_presence: snippets.length > 0,
      discussion_mentions_count: snippets.length,
      warning_mentions_count: contextualWarnings
    };
  } catch (err) {
    console.log("DuckDuckGo fetch error:", err.message);
    return null;
  }
}
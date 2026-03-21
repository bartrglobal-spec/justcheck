import FirecrawlApp from "firecrawl";

/*
Initialize Firecrawl once
*/
const firecrawl = process.env.FIRECRAWL_API_KEY
  ? new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY })
  : null;


/*
Web / discussion presence signal
*/
export async function webPresenceSignal(input) {

  // 🔴 STEP 1 FIX: BLOCK IN FREE MODE
  if (!input?.paid) {
    return {
      id: "web_presence",
      status: "neutral",
      score: 0,
      reason: "skipped_free_mode"
    };
  }

  if (!input?.url) {
    return {
      id: "web_presence",
      status: "neutral",
      score: 0,
      reason: "no_url_provided"
    };
  }

  if (!firecrawl) {
    return {
      id: "web_presence",
      status: "neutral",
      score: 0,
      reason: "missing_api_key"
    };
  }

  try {

    const result = await firecrawl.scrape(input.url, {
      formats: ["markdown"]
    });

    const statusCode = result?.metadata?.statusCode || 0;
    const title = result?.metadata?.title || null;
    const markdown = result?.markdown || "";
    const contentLength = markdown.length;

    let score = 0;

    if (statusCode === 200) score += 1;
    if (title) score += 1;
    if (contentLength > 400) score += 1;

    /*
    Scam keyword detection
    */

    const text = markdown.toLowerCase();

    const scamKeywords = [
      "scam",
      "fraud",
      "fake",
      "beware",
      "spam caller",
      "scammer",
      "phishing",
      "do not trust",
      "suspicious"
    ];

    let warningMentions = 0;

    for (const word of scamKeywords) {
      if (text.includes(word)) {
        warningMentions++;
      }
    }

    if (warningMentions > 0) {
      score += 1;
    }

    /*
    Count identifier mentions
    */

    const identifier = input.identifier || "";

    let discussionMentions = 0;

    if (identifier) {
      const regex = new RegExp(identifier, "g");
      const matches = text.match(regex);
      discussionMentions = matches ? matches.length : 0;
    }

    /*
    Determine status
    */

    let status = "neutral";

    if (score >= 4) status = "supporting";
    if (score === 0) status = "risk";

    return {
      id: "web_presence",
      status,
      score,
      statusCode,
      title,
      contentLength,
      warning_mentions_count: warningMentions,
      discussion_mentions_count: discussionMentions
    };

  } catch (err) {

    return {
      id: "web_presence",
      status: "risk",
      score: 0,
      reason: "crawl_failed"
    };

  }
}
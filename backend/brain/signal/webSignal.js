import fetch from "node-fetch";

export default async function webSignal(query) {
  if (!query) {
    return {
      resultCount: 0,
      presenceTier: "none",
      anomalyHits: 0,
      anomalyModifier: 0
    };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000); // 2 second timeout

    const apiKey = process.env.GOOGLE_API_KEY;
    const cx = process.env.GOOGLE_CX;

    if (!apiKey || !cx) {
      throw new Error("Missing Google API credentials");
    }

    const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${apiKey}&cx=${cx}`;

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error("Google API error");
    }

    const data = await response.json();

    // -----------------------------
    // Result Count
    // -----------------------------
    const resultCount = parseInt(
      data?.searchInformation?.totalResults || "0",
      10
    );

    // -----------------------------
    // Presence Tier Logic
    // -----------------------------
    let presenceTier = "none";

    if (resultCount >= 1 && resultCount <= 2) {
      presenceTier = "very_low";
    } else if (resultCount >= 3 && resultCount <= 20) {
      presenceTier = "low";
    } else if (resultCount >= 21 && resultCount <= 200) {
      presenceTier = "moderate";
    } else if (resultCount > 200) {
      presenceTier = "strong";
    }

    // -----------------------------
    // Title Extraction (Top 3 Only)
    // -----------------------------
    const titles = (data.items || [])
      .slice(0, 3)
      .map(item => (item.title || "").toLowerCase());

    // -----------------------------
    // Anomaly Keyword Scan
    // -----------------------------
    const keywords = [
      "scam",
      "fraud",
      "complaint",
      "arrest",
      "warning",
      "blacklist",
      "exposed"
    ];

    let anomalyHits = 0;

    for (const title of titles) {
      if (keywords.some(word => title.includes(word))) {
        anomalyHits++;
      }
    }

    // Apply modifier ONLY if 2+ hits (your locked rule B)
    const anomalyModifier = anomalyHits >= 2 ? -0.08 : 0;

    return {
      resultCount,
      presenceTier,
      anomalyHits,
      anomalyModifier
    };

  } catch (err) {
    console.error("WEB SIGNAL ERROR:", err);

    return {
      resultCount: 0,
      presenceTier: "error",
      anomalyHits: 0,
      anomalyModifier: 0
    };
  }
}

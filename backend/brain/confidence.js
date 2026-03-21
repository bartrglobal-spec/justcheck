/**
 * confidence (Risk Engine v10 - External Truth Integration)
 * --------------------------------------------------------
 * FIXED:
 * - External score properly used
 * - Frontend compatibility restored (riskScore)
 */

export default function buildConfidence(
  indicators = [],
  publicSignals = {},
  identifierType = "unknown",
  externalSignals = {}
) {

  // ZERO BASE
  let score = 0;

  // -----------------------------------
  // Public Signals
  // -----------------------------------

  const {
    warning_mentions_count = 0,
    has_web_presence = false,
    has_business_profile = false,
    first_seen_at
  } = publicSignals;

  // -----------------------------------
  // External Signals
  // -----------------------------------

  const {
    score: externalScore = 0,
    discussion_mentions_count = 0,
    warning_mentions_count: externalWarningCount = 0,
    contextual_hits = 0,
    texts = []
  } = externalSignals;

  // -----------------------------------
  // 🔴 PRIMARY: External Score (FIXED)
  // -----------------------------------

  if (externalScore > 0) {
    score += externalScore * 0.8;
  }

  // -----------------------------------
  // Indicator Adjustments
  // -----------------------------------

  for (const ind of indicators) {
    if (ind && ind.triggered === true && typeof ind.score === "number") {
      score += ind.score;
    }
  }

  // -----------------------------------
  // HARD RED FLAGS
  // -----------------------------------

  if (externalWarningCount >= 5) {
    score += 30;
  }

  if (externalWarningCount >= 10) {
    score += 50;
  }

  if (contextual_hits >= 5 && externalWarningCount >= 3) {
    score += 25;
  }

  // -----------------------------------
  // DISCUSSION WITHOUT WARNINGS
  // -----------------------------------

  if (discussion_mentions_count >= 10 && externalWarningCount === 0) {
    score += 15;
  }

  if (discussion_mentions_count >= 20 && externalWarningCount === 0) {
    score += 25;
  }

  // -----------------------------------
  // Reddit / Language Signals
  // -----------------------------------

  let scamLanguageHits = 0;

  const scamKeywords = [
    "scam",
    "fraud",
    "beware",
    "avoid",
    "do not trust",
    "fake",
    "spam",
    "phishing"
  ];

  if (Array.isArray(texts)) {
    for (const t of texts) {
      const lower = (t || "").toLowerCase();

      for (const keyword of scamKeywords) {
        if (lower.includes(keyword)) {
          scamLanguageHits++;
          break;
        }
      }
    }
  }

  if (scamLanguageHits >= 3) score += 20;
  if (scamLanguageHits >= 6) score += 35;

  // -----------------------------------
  // Email Scam Patterns
  // -----------------------------------

  let emailScamHits = 0;

  const emailPatterns = [
    "urgent",
    "act now",
    "verify your account",
    "click here",
    "payment required",
    "confirm your details"
  ];

  if (Array.isArray(texts)) {
    for (const t of texts) {
      const lower = (t || "").toLowerCase();

      for (const keyword of emailPatterns) {
        if (lower.includes(keyword)) {
          emailScamHits++;
          break;
        }
      }
    }
  }

  if (emailScamHits >= 3) score += 15;
  if (emailScamHits >= 6) score += 25;

  // -----------------------------------
  // Public Warning Adjustment
  // -----------------------------------

  if (warning_mentions_count > 0) {
    score += Math.min(warning_mentions_count * 10, 30);
  }

  // -----------------------------------
  // Identifier Context
  // -----------------------------------

  if (identifierType === "phone_business") {

    if (!has_web_presence) score += 10;
    if (!has_business_profile) score += 10;

  }

  // -----------------------------------
  // Time Stabilization
  // -----------------------------------

  if (first_seen_at) {

    const daysObserved =
      (Date.now() - new Date(first_seen_at).getTime()) /
      (1000 * 60 * 60 * 24);

    if (daysObserved > 30) score -= 5;
    if (daysObserved > 90) score -= 5;
    if (daysObserved > 180) score -= 5;

  }

  // -----------------------------------
  // Clamp
  // -----------------------------------

  if (score < 0) score = 0;
  if (score > 100) score = 100;

  // -----------------------------------
  // Risk Level
  // -----------------------------------

  let riskLevel = "green";

  if (score >= 70) {
    riskLevel = "red";
  } else if (score >= 40) {
    riskLevel = "amber";
  }

  return {
    score,        // backend internal
    riskScore: score, // 🔴 REQUIRED for frontend
    riskLevel
  };

}
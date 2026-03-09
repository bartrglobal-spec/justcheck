/**
 * confidence (Risk Engine v7 - External Aligned)
 * -----------------------------------------------
 * Produces unified risk score and level.
 * Aligns with enrichment-first architecture.
 */

export default function buildConfidence(
  indicators = [],
  publicSignals = {},
  identifierType = "unknown",
  externalSignals = {}
) {

  let score = 50;

  // -----------------------------------
  // Public Signals
  // -----------------------------------

  const {
    warning_mentions_count = 0,
    has_web_presence = false,
    has_business_profile = false,
    first_seen_at,
    last_checked_at
  } = publicSignals;

  // -----------------------------------
  // External Signals (Enrichment Layer)
  // -----------------------------------

  const {
    score: externalScore = 0,
    severity: externalSeverity = "none",
    discussion_mentions_count = 0,
    warning_mentions_count: externalWarningCount = 0
  } = externalSignals;

  // -----------------------------------
  // Indicator Adjustments
  // -----------------------------------

  for (const ind of indicators) {

    if (ind && ind.triggered === true && typeof ind.score === "number") {
      score += ind.score;
    }

  }

  // -----------------------------------
  // External Context Adjustment
  // -----------------------------------

  if (externalScore > 0) {

    const normalizedImpact = Math.min(externalScore / 3, 30);
    score += normalizedImpact;

  }

  if (externalSeverity === "red") {
    score += 15;
  }

  if (externalSeverity === "amber") {
    score += 8;
  }

  // -----------------------------------
  // External Discussion Signals
  // -----------------------------------

  if (discussion_mentions_count > 0) {

    const discussionImpact = Math.min(discussion_mentions_count * 3, 15);
    score += discussionImpact;

  }

  if (externalWarningCount > 0) {

    const warningImpact = Math.min(externalWarningCount * 10, 30);
    score += warningImpact;

  }

  // -----------------------------------
  // Public Warning Adjustment
  // -----------------------------------

  if (warning_mentions_count > 0) {

    score += Math.min(warning_mentions_count * 10, 30);

  }

  // -----------------------------------
  // Identifier Context Logic
  // -----------------------------------

  if (identifierType === "phone_business") {

    if (!has_web_presence) {
      score += 10;
    }

    if (!has_business_profile) {
      score += 10;
    }

  }

  // -----------------------------------
  // Time-Based Stabilization
  // -----------------------------------

  if (first_seen_at) {

    const daysObserved =
      (Date.now() - new Date(first_seen_at).getTime()) /
      (1000 * 60 * 60 * 24);

    if (daysObserved > 7) score -= 5;
    if (daysObserved > 30) score -= 5;
    if (daysObserved > 90) score -= 5;
    if (daysObserved > 180) score -= 5;

  }

  if (first_seen_at && last_checked_at) {

    const hoursBetweenChecks =
      (new Date(last_checked_at).getTime() -
        new Date(first_seen_at).getTime()) /
      (1000 * 60 * 60);

    if (hoursBetweenChecks > 24 && warning_mentions_count === 0) {
      score -= 5;
    }

    if (hoursBetweenChecks > 72 && warning_mentions_count === 0) {
      score -= 5;
    }

  }

  // -----------------------------------
  // Clamp Score
  // -----------------------------------

  if (score < 0) score = 0;
  if (score > 100) score = 100;

  // -----------------------------------
  // Risk Level Mapping
  // -----------------------------------

  let riskLevel = "green";

  if (score >= 70) {
    riskLevel = "red";
  } else if (score >= 40) {
    riskLevel = "amber";
  }

  return {
    riskScore: score,
    riskLevel
  };

}
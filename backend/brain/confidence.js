/**
 * confidence
 * ----------
 * Produces a confidence level and score based on:
 * - indicator severity
 * - public signal accumulation
 * - time observed
 * - stability over repeated checks
 * - identifier context (business vs personal)
 *
 * This module NEVER asserts wrongdoing.
 */

export default function buildConfidence(
  indicators = [],
  publicSignals = {},
  identifierType = "unknown"
) {
  let score = 50; // neutral baseline

  const {
    warning_mentions_count = 0,
    discussion_mentions_count = 0,
    has_web_presence = false,
    has_business_profile = false,
    first_seen_at,
    last_checked_at
  } = publicSignals;

  // -----------------------------------
  // Indicator-based adjustment
  // -----------------------------------
  for (const ind of indicators) {
    if (ind.level === "red") score += 20;
    if (ind.level === "amber") score += 10;
  }

  // -----------------------------------
  // Public warning language
  // -----------------------------------
  if (warning_mentions_count > 0) {
    score += Math.min(warning_mentions_count * 10, 30);
  }

  // -----------------------------------
  // Identifier context logic
  // -----------------------------------
  if (identifierType === "phone_business") {
    // Business numbers are expected to leave trails
    if (!has_web_presence) score += 10;
    if (!has_business_profile) score += 10;
  }

  if (identifierType === "phone_personal") {
    // Personal numbers are often quiet by design
    if (!has_web_presence) score += 0;
  }

  // -----------------------------------
  // Time-based stabilization
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

  // -----------------------------------
  // Confidence drift (repeat checks)
  // -----------------------------------
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
  // Clamp score
  // -----------------------------------
  if (score < 0) score = 0;
  if (score > 100) score = 100;

  // -----------------------------------
  // Confidence level
  // -----------------------------------
  let level = "medium";

  if (score >= 70) level = "high";
  else if (score <= 30) level = "low";

  return {
    level,
    score
  };
}

/**
 * Signal Mapper — V1
 *
 * Purpose:
 * Convert brain score into user-facing signal.
 *
 * IMPORTANT:
 * - NO indicators here
 * - NO input inspection
 * - NO guesses
 * - PURE mapping only
 *
 * LOCKED LABELS:
 * Green  → Low Risk Indicators
 * Amber  → Some Risk Indicators
 * Red    → Elevated Risk Indicators
 */

function mapSignal(brainResult) {
  const score = typeof brainResult?.score === "number"
    ? brainResult.score
    : 0;

  if (score === 0) {
    return {
      level: "green",
      summary: "Low Risk Indicators"
    };
  }

  if (score <= 2) {
    return {
      level: "amber",
      summary: "Some Risk Indicators"
    };
  }

  return {
    level: "red",
    summary: "Elevated Risk Indicators"
  };
}

module.exports = { mapSignal };

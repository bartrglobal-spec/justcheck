/**
 * Pure internal confidence derivation engine
 * Deterministic, no side effects
 */

module.exports = function deriveConfidence({ count, firstSeen }) {
  if (!count || count === 0) {
    return "low";
  }

  if (count < 3) {
    return "medium";
  }

  return "high";
};

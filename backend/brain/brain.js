/**
 * Pure internal confidence derivation engine
 * No IO, no DB, deterministic only
 */

function deriveConfidence({ count, firstSeen }) {
  if (!count || count === 0) {
    return "low";
  }

  if (count < 3) {
    return "medium";
  }

  return "high";
}

module.exports = {
  deriveConfidence,
};

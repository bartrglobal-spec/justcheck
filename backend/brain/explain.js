// backend/brain/explain.js

/**
 * Explanation Assembler
 * ---------------------
 * Builds a calm, human explanation from
 * registry-backed indicators.
 *
 * This layer adds perceived value without
 * adding risk, judgment, or advice.
 */

function assembleExplanation({ signal, indicators }) {
  // Absolute fallback (should be rare)
  if (!indicators) {
    return "This check completed successfully.";
  }

  // Group indicators by level
  const byLevel = {
    green: [],
    amber: [],
    red: []
  };

  for (const ind of indicators) {
    if (byLevel[ind.level]) {
      byLevel[ind.level].push(ind);
    }
  }

  // 🔴 RED — elevated indicators dominate
  if (byLevel.red.length > 0) {
    return (
      "Some elevated risk indicators were detected. " +
      byLevel.red.map(i => i.user_text).join(" ")
    );
  }

  // 🟠 AMBER — cautionary indicators
  if (byLevel.amber.length > 0) {
    return (
      "Some cautionary indicators were observed. " +
      byLevel.amber.map(i => i.user_text).join(" ")
    );
  }

  // 🟢 GREEN — explicit positive confirmation
  if (byLevel.green.length > 0) {
    return (
      "No concerning indicators were found during this check. " +
      byLevel.green.map(i => i.user_text).join(" ")
    );
  }

  // 🟢 GREEN (silent pass) — nothing triggered
  return (
    "This check did not surface any notable indicators. " +
    "The identifier passed basic format, consistency, and availability checks."
  );
}

module.exports = {
  assembleExplanation
};

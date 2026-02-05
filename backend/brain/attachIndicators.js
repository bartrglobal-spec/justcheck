/**
 * attachIndicators
 * ----------------
 * Attaches indicator metadata to the brain result
 * WITHOUT affecting scoring, confidence, or output.
 *
 * IMPORTANT GUARANTEES:
 * - No mutation of existing fields
 * - No logic execution
 * - Indicators are INTERNAL ONLY
 */

const { loadIndicators } = require("./indicators/loader");

function attachIndicators(brainResult, options = {}) {
  const {
    includePremium = false
  } = options;

  // Defensive clone (do not mutate original result)
  const result = {
    ...brainResult
  };

  // Load indicators (free or full set)
  const indicators = loadIndicators({ includePremium });

  // Attach under a NON-EXPORTED, INTERNAL key
  Object.defineProperty(result, "__indicators", {
    value: indicators,
    enumerable: false, // 🔐 critical: will not appear in JSON
    writable: false
  });

  return result;
}

module.exports = {
  attachIndicators
};

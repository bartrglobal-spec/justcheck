/**
 * runPaidBrain
 * ------------
 * Executes the brain with premium indicators enabled.
 *
 * IMPORTANT:
 * - Does NOT replace runBrain
 * - Does NOT affect free checks
 * - Explicit opt-in only
 */

const runBrain = require("./brain");
const { attachIndicators } = require("./attachIndicators");

function runPaidBrain(input) {
  // Run normal brain first (free-safe path)
  const baseResult = runBrain(input);

  // Re-attach indicators with premium enabled
  return attachIndicators(baseResult, { includePremium: true });
}

module.exports = runPaidBrain;

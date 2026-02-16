/**
 * Guard Layer — Brain Access Controller
 *
 * PURPOSE:
 * - Single control point between requests and the brain
 * - Controls premium indicator visibility
 *
 * GUARANTEES:
 * - Does NOT change brain logic
 * - Does NOT re-run indicators
 * - Default state is ALWAYS non-premium
 */

const { runBrain } = require("./index");
const { attachIndicators } = require("./attachIndicators");

/**
 * guardRun
 *
 * @param {Object} input
 * @param {Object} context
 *   {
 *     paid: Boolean
 *   }
 */
async function guardRun(input, context = {}) {
  const { paid = false } = context;

  // ✅ ALWAYS await brain execution
  const brainResult = await runBrain(input);

  // Free path — no premium visibility
  if (paid !== true) {
    return brainResult;
  }

  // Paid path — reattach indicators with premium visibility
  return attachIndicators(brainResult, { includePremium: true });
}

module.exports = {
  guardRun
};

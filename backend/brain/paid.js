/**
 * Paid Brain — Full Indicator Expansion
 *
 * RULES:
 * - No verdicts
 * - Deterministic output
 * - Premium indicators allowed
 */

const deriveConfidence = require("./confidence");
const runSignalEngine = require("./signalEngine");
const indicatorRegistry = require("./indicators");

function runPaidBrain(input) {
  try {
    const indicators = [];

    const indicatorSet = indicatorRegistry.v1;

    for (const indicator of indicatorSet) {
      const result = indicator(input);

      if (result && result.triggered === true) {
        indicators.push(result);
      }
    }

    const signal = runSignalEngine(indicators);
    const confidence = deriveConfidence(indicators);

    return {
      signal,
      indicators,
      confidence,
      meta: {
        brain_version: "paid-v1",
        disclosure:
          "This paid report provides additional risk indicators for informational purposes only."
      }
    };
  } catch (err) {
    return {
      signal: {
        level: "amber",
        summary: "Some Risk Indicators"
      },
      indicators: [],
      meta: {
        brain_version: "error-safe",
        note: "Paid report system error"
      }
    };
  }
}

module.exports = {
  runPaidBrain
};

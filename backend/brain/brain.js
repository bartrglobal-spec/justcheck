/**
 * Brain — Core Orchestrator
 *
 * RULES:
 * - No verdicts
 * - Deterministic output
 * - Error-safe by default
 */

const runSignalEngine = require("./signalEngine");
const indicatorRegistry = require("./indicators");
const { attachIndicators } = require("./attachIndicators");

function runBrain(input) {
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

    const brainResult = {
      signal,
      indicators,
      meta: {
        brain_version: "v1",
        note: "This check was completed using conservative system safeguards."
      }
    };

    // 🔒 Dark attach — invisible, non-enumerable
    return attachIndicators(brainResult, { includePremium: false });

  } catch (err) {
    const errorResult = {
      signal: {
        level: "green",
        summary: "Low Risk Indicators",
        note_code: "LOW_RISK"
      },
      indicators: [],
      meta: {
        brain_version: "error-safe",
        note: "This check was completed using conservative system safeguards."
      }
    };

    // 🔒 Dark attach even in error-safe mode
    return attachIndicators(errorResult, { includePremium: false });
  }
}

module.exports = runBrain;

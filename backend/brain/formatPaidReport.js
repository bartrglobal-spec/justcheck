/**
 * formatPaidReport
 * ----------------
 * Converts internal brain output into a paid-safe report.
 *
 * RULES:
 * - No verdicts
 * - No accusations
 * - No irreversible claims
 * - Explanatory, not judgmental
 */

function formatPaidReport(brainResult) {
  const internalIndicators = brainResult.__indicators || [];

  return {
    signal: brainResult.signal,
    indicators: internalIndicators.map(ind => ({
      code: ind.code,
      level: ind.level,
      description: ind.description,
      weight: ind.weight
    })),
    meta: {
      brain_version: brainResult.meta.brain_version,
      disclosure:
        "This paid report provides additional risk indicators for informational purposes only."
    }
  };
}

module.exports = {
  formatPaidReport
};

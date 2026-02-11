/**
 * formatPaidReport
 * ----------------
 * Converts a rendered free brain report into a paid-safe expanded report.
 *
 * RULES:
 * - No verdicts
 * - No accusations
 * - No irreversible claims
 * - Does NOT re-run logic
 * - Does NOT alter confidence
 */

function formatPaidReport(freeReport) {
  const indicators = Array.isArray(freeReport.indicators)
    ? freeReport.indicators
    : [];

  // Count indicators by level
  const indicator_summary = {
    green: 0,
    amber: 0,
    red: 0
  };

  indicators.forEach(ind => {
    if (ind.level === "green") indicator_summary.green++;
    if (ind.level === "amber") indicator_summary.amber++;
    if (ind.level === "red") indicator_summary.red++;
  });

  return {
    report_version: "1.0",

    identifier: freeReport.identifier,
    identifier_type: freeReport.identifier_type,

    confidence: freeReport.confidence,
    risk_color: freeReport.risk_color,
    headline: freeReport.headline,

    indicator_summary,

    indicators: indicators.map(ind => ({
      code: ind.code,
      level: ind.level,
      description: ind.description
    })),

    system_notes: freeReport.system_notes || [],

    what_this_means: [
      "This paid report expands on the indicators detected during the initial check.",
      "Indicators highlight observable risk signals and do not represent conclusions or accusations.",
      "Risk indicators may change over time as new information becomes available."
    ],

    meta: {
      total_checks: freeReport.meta?.total_checks ?? 0,
      first_seen: freeReport.meta?.first_seen ?? null,
      generated_at: freeReport.meta?.generated_at
    },

    disclaimer:
      "This report provides informational risk indicators only and should not be treated as factual determination or advice."
  };
}

module.exports = {
  formatPaidReport
};

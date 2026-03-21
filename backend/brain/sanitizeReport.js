/**
 * sanitizeReport
 * --------------
 * Final safety gate before any report leaves the brain.
 * Ensures shape stability and removes internal-only data.
 */

export default function sanitizeReport(report) {
  return {

    identifier: report.identifier,
    identifier_type: report.identifier_type,

    confidence: report.confidence,
    risk_color: report.risk_color,
    headline: report.headline,
    explanation: report.explanation,

    indicators: Array.isArray(report.indicators)
      ? report.indicators
      : [],

    publicSignals: report.publicSignals ?? {},

    externalSignalSummary: report.externalSignalSummary ?? {
      has_web_presence: false,
      discussion_mentions_count: 0,
      warning_mentions_count: 0
    },

    system_notes: Array.isArray(report.system_notes)
      ? report.system_notes
      : [],

    meta: {
      total_checks: report.meta?.total_checks ?? 0,
      first_seen: report.meta?.first_seen ?? null,
      generated_at:
        report.meta?.generated_at ?? new Date().toISOString()
    }

  };
}
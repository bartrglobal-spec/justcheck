function sanitizeReport(report) {
  return {
    identifier: report.identifier,
    identifier_type: report.identifier_type,
    confidence: report.confidence,
    risk_color: report.risk_color,
    headline: report.headline,
    indicators: Array.isArray(report.indicators) ? report.indicators : [],
    system_notes: Array.isArray(report.system_notes) ? report.system_notes : [],
    meta: {
      total_checks: report.meta?.total_checks ?? 0,
      first_seen: report.meta?.first_seen ?? null,
      generated_at: new Date().toISOString()
    }
  };
}

module.exports = { sanitizeReport };

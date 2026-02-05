function renderReport({
  identifier,
  identifier_type,
  confidence,
  indicators = [],
  meta = {},
  context = {}
}) {
  const risk_color =
    confidence === "HIGH" ? "Red" :
    confidence === "MEDIUM" ? "Amber" :
    "Green";

  const headline =
    confidence === "HIGH"
      ? "Elevated risk indicators were detected at the time of this check."
      : confidence === "MEDIUM"
      ? "Some risk indicators were detected at the time of this check."
      : "No significant risk indicators were detected at the time of this check.";

  const system_notes = [];

  if (context.limitedSources) {
    system_notes.push("Some data sources were temporarily unavailable at the time of this check.");
  }

  if (context.conservativeMode) {
    system_notes.push("This check was completed using conservative system safeguards.");
  }

  if (context.outdatedSignals) {
    system_notes.push("Some indicators may be based on outdated signals.");
  }

  return {
    identifier,
    identifier_type,
    confidence,
    risk_color,
    headline,
    indicators,
    system_notes,
    meta: {
      total_checks: meta.total_checks ?? 0,
      first_seen: meta.first_seen ?? null,
      generated_at: new Date().toISOString()
    }
  };
}

module.exports = { renderReport };

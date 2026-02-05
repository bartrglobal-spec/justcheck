const { deriveRiskColor } = require("./riskColor");
const { deriveHeadline } = require("./headline");
const { deriveSystemNotes } = require("./notes");
const { sanitizeReport } = require("./sanitize");

function renderReport({
  identifier,
  identifier_type,
  confidence,
  indicators,
  meta,
  context
}) {
  const report = {
    identifier,
    identifier_type,
    confidence,
    risk_color: deriveRiskColor(confidence),
    headline: deriveHeadline(confidence),
    indicators,
    system_notes: deriveSystemNotes(context),
    meta
  };

  return sanitizeReport(report);
}

module.exports = { renderReport };

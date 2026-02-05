// brain/render.js
// 🔒 Canonical Report Renderer — LOCKED STEP 18

function renderReport({ identifier, identifier_type, confidence, context }) {
  // Map internal confidence to public contract
  let level = "green";
  let summary = "Low Risk Indicators";
  let note_code = null;

  if (confidence === "MEDIUM") {
    level = "amber";
    summary = "Some Risk Indicators";
    note_code = "LIMITED_PROCESSING";
  }

  if (confidence === "HIGH") {
    level = "red";
    summary = "Elevated Risk Indicators";
    note_code = "ELEVATED_RISK";
  }

  // Force conservative note if sources were limited
  if (context?.limitedSources && level === "green") {
    level = "amber";
    summary = "Some Risk Indicators";
    note_code = "LIMITED_PROCESSING";
  }

  return {
    identifier,
    identifier_type,
    confidence: {
      level,
      summary,
      note_code
    }
  };
}

module.exports = { renderReport };

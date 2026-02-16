// guard.js
// This is the core risk evaluation brain

function guardRun({ identifier, identifier_type }) {
  if (!identifier || !identifier_type) {
    return {
      confidence: "UNKNOWN",
      risk_color: "Amber",
      headline: "Not enough information to complete this check.",
      indicators: ["Missing identifier data"]
    };
  }

  // Simple deterministic rules for now (safe MVP logic)
  const indicators = [];

  if (identifier.includes("test")) {
    indicators.push("Identifier contains test pattern");
  }

  if (identifier_type === "email" && !identifier.includes("@")) {
    indicators.push("Email format appears invalid");
  }

  let confidence = "LOW";
  let risk_color = "Green";
  let headline = "No significant risk indicators were detected.";

  if (indicators.length > 0) {
    confidence = "MEDIUM";
    risk_color = "Amber";
    headline = "Some risk indicators were detected at the time of this check.";
  }

  return {
    confidence,
    risk_color,
    headline,
    indicators
  };
}

module.exports = {
  guardRun
};

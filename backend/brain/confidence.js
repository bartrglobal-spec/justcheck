console.log("🧠 confidence.js loaded");

function deriveConfidence(indicators = []) {
  if (!Array.isArray(indicators)) {
    return {
      level: "amber",
      summary: "Some Risk Indicators",
      note_code: "LIMITED_PROCESSING"
    };
  }

  const hasRed = indicators.some(i => i.level === "red");
  const hasAmber = indicators.some(i => i.level === "amber");

  if (hasRed) {
    return {
      level: "red",
      summary: "Elevated Risk Indicators",
      note_code: "ELEVATED_RISK"
    };
  }

  if (hasAmber) {
    return {
      level: "amber",
      summary: "Some Risk Indicators",
      note_code: "SOME_RISK"
    };
  }

  return {
    level: "green",
    summary: "Low Risk Indicators",
    note_code: "LOW_RISK"
  };
}

module.exports = {
  deriveConfidence
};

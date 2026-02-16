function formatPaidReport(brainResult = {}) {
  const {
    confidence,
    indicators = [],
    explanation = "",
    identifier,
    identifier_type
  } = brainResult;

  // Defensive defaults
  const level = confidence?.level || "unknown";
  const score = confidence?.score ?? null;

  let summary;

  if (level === "low") {
    summary =
      "There is a healthy amount of publicly observable information connected to this identifier. Nothing immediately stands out as unusual, but this is not a guarantee of safety.";
  } else if (level === "medium") {
    summary =
      "There is a mix of available information and uncertainty connected to this identifier. Some signals are present, but they are not conclusive.";
  } else if (level === "high") {
    summary =
      "Very little reliable public information could be found for this identifier. This does not mean something is wrong, but it does mean caution is reasonable.";
  } else {
    summary =
      "There is not enough information available to confidently describe this identifier.";
  }

  return {
    identifier,
    identifier_type,

    confidence: {
      level,
      score
    },

    summary,

    explanation,

    indicators: indicators.map(i => ({
      label: i.label,
      description: i.description
    })),

    disclaimer:
      "This report provides informational context only. It is not a recommendation, judgment, or guarantee. Always use your own judgment before sending money."
  };
}

module.exports = { formatPaidReport };

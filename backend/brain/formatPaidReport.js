function formatPaidReport(freeReport) {
  const confidenceMap = {
    LOW: "LOW",
    MEDIUM: "MEDIUM",
    HIGH: "HIGH"
  };

  const confidence =
    confidenceMap[freeReport.confidence] || "MEDIUM";

  const indicators = (freeReport.indicators || []).map(i => {
    if (typeof i === "string") {
      return {
        description: i
      };
    }

    return {
      description: i.description || "Unspecified indicator"
    };
  });

  return {
    confidence,
    headline:
      freeReport.headline ||
      "Risk indicators were observed for this identifier.",
    indicators
  };
}

module.exports = { formatPaidReport };

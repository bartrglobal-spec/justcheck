function deriveRiskColor(confidence) {
  switch (confidence) {
    case "LOW":
      return "Green";
    case "MEDIUM":
      return "Amber";
    case "HIGH":
      return "Red";
    default:
      return "Amber";
  }
}

module.exports = { deriveRiskColor };

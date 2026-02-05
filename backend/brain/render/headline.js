function deriveHeadline(confidence) {
  switch (confidence) {
    case "LOW":
      return "No significant risk indicators detected at the time of this check.";
    case "MEDIUM":
      return "Some risk indicators were detected at the time of this check.";
    case "HIGH":
      return "Multiple risk indicators were detected at the time of this check.";
    default:
      return "This check returned limited system signals.";
  }
}

module.exports = { deriveHeadline };

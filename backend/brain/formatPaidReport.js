export default function formatPaidReport(brainResult = {}) {

  const {
    confidence = {},
    indicators = [],
    explanation = "",
    identifier,
    identifier_type
  } = brainResult;

  const level = confidence?.riskLevel || "amber";
  const score = confidence?.riskScore ?? 50;

  let summary;

  if (level === "green") {
    summary =
      "A healthy amount of publicly observable information appears to be connected to this identifier. Nothing immediately stands out as unusual, but this is not a guarantee of safety.";
  }

  else if (level === "amber") {
    summary =
      "A mix of available information and uncertainty appears to be connected to this identifier. Some signals are present, but the overall picture remains unclear.";
  }

  else if (level === "red") {
    summary =
      "Multiple public signals referencing this identifier were observed across publicly available sources. Some patterns may warrant additional caution before sending money.";
  }

  else {
    summary =
      "There is not enough publicly observable information available to confidently describe this identifier.";
  }

  const publicMentions = score;
  const contactSignals = Math.max(15, Math.min(100, score * 0.9));
  const identityScore = Math.max(15, Math.min(100, score * 0.75));

  return {

    identifier,
    identifier_type,

    confidence: {
      riskLevel: level,
      riskScore: score
    },

    summary,

    explanation,

    indicators: indicators
      .filter(i => i && i.message)
      .map(i => ({
        level: i.level,
        message: i.message
      })),

    public_mentions: publicMentions,
    contact_signals: contactSignals,
    identity_score: identityScore,

    disclaimer:
      "This report provides informational context only. It is not a recommendation, judgment, or guarantee. Always use your own judgment before sending money."

  };
}
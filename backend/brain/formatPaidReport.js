export default function formatPaidReport(brainResult = {}) {

  const {
    confidence = {},
    indicators = [],
    explanation = "",
    identifier,
    identifier_type,

    // enrichment signals (if present)
    contextual_hits = 0,
    discussion_mentions_count = 0,
    warning_mentions_count = 0,
    has_web_presence = false

  } = brainResult;

  const level = confidence?.riskLevel || "amber";
  const score = confidence?.riskScore ?? 50;

  let summary;

  if (level === "green") {
    summary =
      "Publicly visible information connected to this identifier appears relatively consistent across observed sources. No strong warning patterns were detected, though this is not a guarantee of safety.";
  }

  else if (level === "amber") {
    summary =
      "Some publicly observable signals referencing this identifier were detected across indexed web sources. The available information presents a mixed or incomplete picture, which may warrant additional verification before sending money.";
  }

  else if (level === "red") {
    summary =
      "Multiple public signals referencing this identifier were detected across indexed sources. Some discussion patterns include cautionary or warning language that may warrant increased care before sending payment.";
  }

  else {
    summary =
      "Limited publicly observable information is connected to this identifier, making it difficult to draw meaningful context from available sources.";
  }

  const publicMentions = score;
  const contactSignals = Math.max(15, Math.min(100, score * 0.9));
  const identityScore = Math.max(15, Math.min(100, score * 0.75));

  /* Build signal observations */

  const signalObservations = [];

  if (contextual_hits > 0) {
    signalObservations.push(
      `${contextual_hits} contextual web signal${contextual_hits > 1 ? "s were" : " was"} detected across indexed sources.`
    );
  }

  if (discussion_mentions_count > 0) {
    signalObservations.push(
      `${discussion_mentions_count} public discussion reference${discussion_mentions_count > 1 ? "s were" : " was"} observed online.`
    );
  }

  if (warning_mentions_count > 0) {
    signalObservations.push(
      `${warning_mentions_count} discussion reference${warning_mentions_count > 1 ? "s include" : " includes"} cautionary or warning language.`
    );
  }

  if (has_web_presence === true) {
    signalObservations.push(
      "This identifier appears across publicly accessible web pages or indexed sources."
    );
  }

  const combinedExplanation =
    explanation +
    (signalObservations.length
      ? "\n\nSignal observations:\n• " + signalObservations.join("\n• ")
      : "");

  return {

    identifier,
    identifier_type,

    confidence: {
      riskLevel: level,
      riskScore: score
    },

    summary,

    explanation: combinedExplanation,

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
      "This report provides informational context only. It is not a recommendation, judgment, or guarantee. Observations are based on publicly accessible information and automated analysis. Always use your own judgment before sending money."

  };
}
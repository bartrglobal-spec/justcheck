export default function formatPaidReport(brainResult = {}) {

  const {
    confidence = {},
    indicators = [],
    explanation = "",
    identifier,
    identifier_type,

    contextual_hits = 0,
    externalSignalSummary = {}
  } = brainResult;

  const {
    discussion_mentions_count = 0,
    warning_mentions_count = 0,
    has_web_presence = false,
    identifier_mentions_total = 0,
    signal_strength = "none"
  } = externalSignalSummary;

  const level = confidence?.riskLevel || "amber";
  const score = confidence?.riskScore ?? 50;

  // =========================
  // SUMMARY (TOP LEVEL)
  // =========================

  let summary;

  if (level === "green") {
    summary =
      "No strong warning indicators were found in available public data. This is a positive sign, but it does not guarantee safety.";
  }

  else if (level === "amber") {
    summary =
      "Some risk indicators were found across publicly available data. The information is mixed or incomplete, which means you should take extra care before sending money.";
  }

  else if (level === "red") {
    summary =
      "Multiple risk indicators were found across public sources. This pattern is often associated with scams or repeated issues.";
  }

  else {
    summary =
      "Limited publicly available information was found, making it difficult to assess this identifier with confidence.";
  }

  // =========================
  // 🔥 PUBLIC ACTIVITY (FACT-BASED)
  // =========================

  let public_activity;

  if (identifier_mentions_total > 0) {
    public_activity =
      `This ${identifier_type} appears ${identifier_mentions_total} time${identifier_mentions_total > 1 ? "s" : ""} across public sources. ` +
      `${discussion_mentions_count} reference${discussion_mentions_count !== 1 ? "s" : ""} are general discussions, and ${warning_mentions_count} include cautionary or warning signals.`;
  } else {
    public_activity =
      `No public references to this ${identifier_type} were found in indexed sources. This may be normal, but it also means there is limited information available to verify who you are dealing with.`;
  }

  // =========================
  // COMMUNITY DISCUSSIONS
  // =========================

  let discussions_text;

  if (discussion_mentions_count === 0) {
    discussions_text =
      "No meaningful public discussions were found linked to this identifier.";
  }

  if (discussion_mentions_count > 0 && discussion_mentions_count <= 3) {
    discussions_text =
      `A small number (${discussion_mentions_count}) of public discussions reference this identifier. The volume is limited, so context may be incomplete.`;
  }

  if (discussion_mentions_count > 3) {
    discussions_text =
      `This identifier is actively discussed online, with ${discussion_mentions_count} references found across public sources.`;
  }

  // =========================
  // WARNING MENTIONS
  // =========================

  let warnings_text;

  if (warning_mentions_count === 0) {
    warnings_text =
      "No warning-related references were found in available public data.";
  }

  if (warning_mentions_count > 0 && warning_mentions_count <= 2) {
    warnings_text =
      `${warning_mentions_count} reference${warning_mentions_count > 1 ? "s include" : " includes"} cautionary or warning language. This may indicate isolated concerns.`;
  }

  if (warning_mentions_count > 2) {
    warnings_text =
      `${warning_mentions_count} warning-related references were found linked to this identifier. Repeated warnings are often associated with elevated risk.`;
  }

  // =========================
  // WHAT TO DO
  // =========================

  let what_to_do;

  if (level === "green") {
    what_to_do =
      "Even when no issues are found, always confirm key details directly with the person or business before sending money.";
  }

  if (level === "amber") {
    what_to_do =
      "Verify this identifier through independent channels. Confirm details outside of the current conversation, and do not rely on a single source before sending money.";
  }

  if (level === "red") {
    what_to_do =
      "Do NOT send money until you have verified everything independently. If there is pressure to act quickly, unusual payment requests, or attempts to move off-platform, treat this as a serious risk.";
  }

  // =========================
  // RISK ADVICE
  // =========================

  let risk_advice = "";

  if (level === "amber" || level === "red") {
    risk_advice =
      "Be cautious of urgency, emotional pressure, or requests to bypass normal payment protections. These tactics are commonly used in scam scenarios.";
  }

  // =========================
  // SIGNAL OBSERVATIONS (ENHANCED)
  // =========================

  const signalObservations = [];

  if (identifier_mentions_total > 0) {
    signalObservations.push(
      `${identifier_mentions_total} total public reference${identifier_mentions_total > 1 ? "s were" : " was"} identified.`
    );
  }

  if (discussion_mentions_count > 0) {
    signalObservations.push(
      `${discussion_mentions_count} discussion-based reference${discussion_mentions_count > 1 ? "s were" : " was"} observed.`
    );
  }

  if (warning_mentions_count > 0) {
    signalObservations.push(
      `${warning_mentions_count} reference${warning_mentions_count > 1 ? "s include" : " includes"} warning-related language.`
    );
  }

  if (signal_strength !== "none") {
    signalObservations.push(
      `Overall signal strength is assessed as ${signal_strength}.`
    );
  }

  const combinedExplanation =
    explanation +
    (signalObservations.length
      ? "\n\nObservations:\n• " + signalObservations.join("\n• ")
      : "");

  // =========================
  // RETURN FINAL STRUCTURE
  // =========================

  return {

    identifier,
    identifier_type,

    confidence: {
      riskLevel: level,
      riskScore: score
    },

    summary,
    explanation: combinedExplanation,

    narrative: {
      what_we_found: summary,
      what_this_means: discussions_text + " " + warnings_text,
      what_to_do
    },

    externalSignalNarrative: {
      public_activity,
      discussions: discussions_text,
      warnings: warnings_text,
      what_to_do,
      risk_advice
    },

    indicators: indicators
      .filter(i => i && i.message)
      .map(i => ({
        level: i.level,
        message: i.message
      })),

    public_mentions: discussion_mentions_count,
    contact_signals: warning_mentions_count,
    identity_score: contextual_hits,

    externalSignalSummary: {
      discussion_mentions_count,
      warning_mentions_count,
      identifier_mentions_total,
      signal_strength,
      has_web_presence
    },

    disclaimer:
      "This report provides informational context only. It does not make accusations or guarantees. Always use your own judgment before sending money."

  };
}
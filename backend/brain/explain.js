export default function explain(brain = {}) {

  const riskLevel = brain.confidence?.riskLevel || "amber";
  const indicators = brain.indicators || [];
  const external = brain.externalSignalSummary || {};

  const discussionCount = external.discussion_mentions_count || 0;
  const warningCount = external.warning_mentions_count || 0;
  const hasPresence = external.has_web_presence || false;

  let explanationParts = [];

  // Base context

  explanationParts.push(
    "This result is based on publicly observable information and system-level pattern analysis. It does not represent a judgment about intent or behavior."
  );

  // Risk interpretation

  if (riskLevel === "green") {

    explanationParts.push(
      "The available public signals appear relatively stable and consistent. No obvious cautionary indicators were detected in the reviewed sources."
    );

  }

  if (riskLevel === "amber") {

    explanationParts.push(
      "The available information contains a mix of signals and uncertainty. Some information is present, but it does not form a completely clear pattern."
    );

  }

  if (riskLevel === "red") {

    explanationParts.push(
      "Multiple cautionary signals were observed during analysis. These signals may reflect patterns that sometimes appear in disputed or cautionary online discussions."
    );

  }

  // External signals

  if (hasPresence && discussionCount > 0) {

    explanationParts.push(
      "Several public discussions referencing this identifier were detected across online sources."
    );

  }

  if (warningCount > 0) {

    explanationParts.push(
      "Some public references include language commonly associated with cautionary or warning discussions."
    );

  }

  // Indicators

  if (indicators.length > 0) {

    explanationParts.push(
      "System-level indicators were detected during analysis that may influence how cautiously someone chooses to engage with this identifier."
    );

  }

  // Guidance

  explanationParts.push(
    "When sending money to someone you do not know well, it can be helpful to verify their identity through an additional channel and take time to review available information before completing a transaction."
  );

  // Closing

  explanationParts.push(
    "Public information can change over time, and the absence or presence of signals today does not guarantee future outcomes."
  );

  return explanationParts.join(" ");

}
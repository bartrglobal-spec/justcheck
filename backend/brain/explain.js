/**
 * explain
 * -------
 * Generates a human-readable explanation that aligns with:
 * - confidence (certainty of signals)
 * - risk_summary (user-facing posture)
 *
 * This text is informational, neutral, and non-accusatory.
 */

export default function explain(brain = {}) {
  const confidenceLevel = brain.confidence?.level || "medium";
  const riskLevel = brain.risk_summary?.level || "neutral";
  const indicators = brain.indicators || [];
  const publicSignals = brain.publicSignals || {};

  let explanationParts = [];

  // -----------------------------------
  // Base context (always shown)
  // -----------------------------------
  explanationParts.push(
    "This result is based on publicly observable patterns and system-level signals. It does not represent a judgment about intent or behavior."
  );

  // -----------------------------------
  // Confidence interpretation (certainty)
  // -----------------------------------
  if (confidenceLevel === "high") {
    explanationParts.push(
      "The available information forms a relatively clear and consistent signal pattern, meaning the system has higher certainty about what is visible."
    );
  }

  if (confidenceLevel === "medium") {
    explanationParts.push(
      "The available information is mixed or incomplete, resulting in moderate certainty. Some signals are present, but gaps remain."
    );
  }

  if (confidenceLevel === "low") {
    explanationParts.push(
      "Very little stable or consistent public information is available. This increases uncertainty and makes interpretation less reliable."
    );
  }

  // -----------------------------------
  // Indicator-based explanation
  // -----------------------------------
  if (indicators.length > 0) {
    explanationParts.push(
      "Certain indicators were observed that may influence how cautious someone chooses to be when interacting with this identifier."
    );
  }

  // -----------------------------------
  // Public signal explanation
  // -----------------------------------
  if (publicSignals.warning_mentions_count > 0) {
    explanationParts.push(
      "This identifier has appeared in public discussions that include cautionary or warning-style language. Such mentions do not confirm a problem, but they can justify closer attention."
    );
  }

  // -----------------------------------
  // Risk posture interpretation (IMPORTANT)
  // -----------------------------------
  if (riskLevel === "stable") {
    explanationParts.push(
      "Overall, no cautionary signals were detected, and the publicly visible information appears relatively stable at this time."
    );
  }

  if (riskLevel === "neutral") {
    explanationParts.push(
      "Overall, the signals observed do not strongly point in either a reassuring or concerning direction. This result should be treated as informational."
    );
  }

  if (riskLevel === "caution") {
    explanationParts.push(
      "Overall, some signals suggest that extra care or verification may be appropriate before proceeding. This does not imply wrongdoing."
    );
  }

  // -----------------------------------
  // Closing disclaimer
  // -----------------------------------
  explanationParts.push(
    "Situations can change over time, and the absence or presence of signals today does not guarantee future outcomes."
  );

  return explanationParts.join(" ");
}

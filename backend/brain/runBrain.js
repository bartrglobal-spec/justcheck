import { guardInput } from "./guard/index.js";
import attachIndicators from "./attachIndicators.js";
import buildConfidence from "./confidence.js";
import explain from "./explain.js";
import { getPublicSignals } from "./signal/signalEngine.js";

/**
 * runBrain
 * --------
 * Core brain execution (free tier).
 * Separates:
 * - signal confidence (certainty)
 * - user-facing risk posture (interpretation)
 *
 * NEVER asserts wrongdoing.
 */
export default async function runBrain(input = {}) {
  // -----------------------------------
  // Guard input
  // -----------------------------------
  const guard = guardInput(input);

  if (!guard.allowed) {
    return {
      error: "INPUT_NOT_ALLOWED",
      reason: guard.reason
    };
  }

  // -----------------------------------
  // Base brain object
  // -----------------------------------
  const brain = {
    identifier: guard.identifier,
    identifier_type: guard.identifier_type,
    indicators: [],
    publicSignals: {},
    system_notes: []
  };

  // -----------------------------------
  // Load persistent public signals
  // -----------------------------------
  brain.publicSignals = getPublicSignals(brain.identifier);

  brain.system_notes.push(
    "No external enrichment sources connected yet",
    "Public signal structure initialized"
  );

  // -----------------------------------
  // Attach indicators
  // -----------------------------------
  brain.indicators = await attachIndicators(brain);

  // -----------------------------------
  // Build confidence (certainty)
  // -----------------------------------
  brain.confidence = buildConfidence(
    brain.indicators,
    brain.publicSignals,
    brain.identifier_type
  );

  // -----------------------------------
  // Risk summary (user-facing meaning)
  // -----------------------------------
  const hasWarningSignals =
    brain.indicators.some(i => i.level === "red") ||
    brain.publicSignals.warning_mentions_count > 0;

  let risk_summary = {
    level: "neutral",
    message:
      "No strong positive or negative risk signals are currently visible. This result should be considered informational only."
  };

  if (hasWarningSignals) {
    risk_summary = {
      level: "caution",
      message:
        "Some public signals suggest increased risk or caution may be appropriate. This does not confirm wrongdoing, but it may be sensible to verify details carefully before proceeding."
    };
  }

  if (
    !hasWarningSignals &&
    brain.confidence.level === "high" &&
    brain.publicSignals.has_web_presence
  ) {
    risk_summary = {
      level: "stable",
      message:
        "Public information for this identifier appears relatively stable and consistent. No cautionary signals were observed at this time."
    };
  }

  brain.risk_summary = risk_summary;

  // -----------------------------------
  // Human explanation (narrative)
  // -----------------------------------
  brain.explanation = explain(brain);

  return brain;
}

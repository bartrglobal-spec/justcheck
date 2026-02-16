import { guardInput } from "./guard/index.js";
import attachIndicators from "./attachIndicators.js";
import buildConfidence from "./confidence.js";
import explain from "./explain.js";

export default async function runBrain(input = {}) {
  // Guard again for safety (idempotent)
  const guard = guardInput(input);

  if (!guard.allowed) {
    return {
      error: "INPUT_NOT_ALLOWED",
      reason: guard.reason
    };
  }

  // Base brain object
  const brain = {
    identifier: guard.identifier,
    identifier_type: guard.identifier_type,
    indicators: []
  };

  // Attach indicators
  brain.indicators = attachIndicators(brain);

  // Build confidence
  brain.confidence = buildConfidence(brain.indicators);

  // Human explanation
  brain.explanation = explain(brain);

  return brain;
}

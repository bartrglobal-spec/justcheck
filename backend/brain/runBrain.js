/**
 * runBrain (Unified v2)
 * ---------------------
 * Enrichment-first architecture.
 * Single source of truth for risk level.
 */

import { guardInput } from "./guard/index.js";
import attachIndicators from "./attachIndicators.js";
import buildConfidence from "./confidence.js";
import explain from "./explain.js";
import { getPublicSignals } from "./signal/signalEngine.js";
import fetchExternalSignals from "./externalSignals.js";
import sanitizeReport from "./sanitizeReport.js";

export default async function runBrain(input = {}) {

  console.log("RUN BRAIN EXECUTED");

  // -----------------------------------
  // Guard
  // -----------------------------------
  const guard = guardInput(input);
  console.log("Guard result:", guard);

  if (!guard.allowed) {
    return {
      error: "INPUT_NOT_ALLOWED",
      reason: guard.reason
    };
  }

  const brain = {
    identifier: guard.identifier,
    identifier_type: guard.identifier_type,
    indicators: [],
    publicSignals: {},

    // Correct schema matching enrichment engine
    externalSignalSummary: {
      has_web_presence: false,
      discussion_mentions_count: 0,
      warning_mentions_count: 0
    },

    system_notes: []
  };

  // -----------------------------------
  // Persistent signals
  // -----------------------------------
  brain.publicSignals = getPublicSignals(brain.identifier);

  // -----------------------------------
  // External signals
  // -----------------------------------
  console.log("About to call fetchExternalSignals");

  brain.externalSignalSummary = await fetchExternalSignals(
    brain.identifier,
    brain.identifier_type
  );

  console.log("ENRICHMENT RESULT:", brain.externalSignalSummary);

  // -----------------------------------
  // Indicators
  // -----------------------------------
  brain.indicators = await attachIndicators(brain);

  // -----------------------------------
  // Risk Engine (Single Source of Truth)
  // -----------------------------------
  brain.confidence = buildConfidence(
    brain.indicators,
    brain.publicSignals,
    brain.identifier_type,
    brain.externalSignalSummary
  );

  // -----------------------------------
  // Risk Color (UI Layer)
  // -----------------------------------
  brain.risk_color = brain.confidence.riskLevel;

  // -----------------------------------
  // Headline
  // -----------------------------------
  brain.headline =
    brain.indicators.length === 0
      ? "No significant risk indicators detected"
      : "Potential risk indicators detected";

  // -----------------------------------
  // Explanation
  // -----------------------------------
  brain.explanation = explain(brain);

  // -----------------------------------
  // Metadata
  // -----------------------------------
  brain.meta = {
    generated_at: new Date().toISOString()
  };

  return sanitizeReport(brain);
}
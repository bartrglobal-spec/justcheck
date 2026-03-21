/**
 * runBrain (Unified v3)
 * ---------------------
 * Enrichment-first architecture.
 * Single source of truth for risk level.
 */

import { guardInput } from "./guard/index.js";
import attachIndicators from "./attachIndicators.js";
import buildConfidence from "./confidence.js";
import explain from "./explain.js";
import runSignalEngine from "./signal/signalEngine.js";
import fetchExternalSignals from "./externalSignals.js";
import sanitizeReport from "./sanitizeReport.js";
import { detectPhoneCountry } from "./utils/phoneCountry.js";

export default async function runBrain(input = {}) {

  console.log("=================================");
  console.log("RUN BRAIN EXECUTED");
  console.log("INPUT RECEIVED:", input);

  const paid = input.paid === true;

  const guard = guardInput(input);

  console.log("GUARD RESULT:", guard);

  if (!guard.allowed) {
    return {
      error: "INPUT_NOT_ALLOWED",
      reason: guard.reason
    };
  }

  console.log("IDENTIFIER AFTER GUARD:", guard.identifier);

  let phoneCountry = null;

  if (guard.identifier_type === "phone") {
    phoneCountry = detectPhoneCountry(guard.identifier);
  }

  const brain = {
    identifier: guard.identifier,
    identifier_type: guard.identifier_type,

    phone_country: phoneCountry,

    indicators: [],
    publicSignals: {},

    externalSignalSummary: {
      has_web_presence: false,
      discussion_mentions_count: 0,
      warning_mentions_count: 0,

      identifier_mentions_total: 0,
      signal_strength: "none"
    },

    system_notes: []
  };

  // -----------------------------------
  // Persistent signals
  // -----------------------------------

  brain.publicSignals = await runSignalEngine(brain);

  // -----------------------------------
  // External signals
  // -----------------------------------

  console.log("About to call fetchExternalSignals");
  console.log("Paid mode:", paid);
  console.log("IDENTIFIER SENT TO EXTERNAL:", brain.identifier);

  const searchIdentifier =
    brain.identifier_type === "phone"
      ? brain.identifier.replace(/^\+/, "")
      : brain.identifier;

  console.log("IDENTIFIER USED FOR SEARCH:", searchIdentifier);

  const external = await fetchExternalSignals(
    searchIdentifier,
    brain.identifier_type,
    { paid }
  );

  console.log("ENRICHMENT RESULT:", {
    identifier: external.identifier,
    score: external.score,
    warning_mentions_count: external.warning_mentions_count,
    discussion_mentions_count: external.discussion_mentions_count
  });

  // -----------------------------------
  // 🔴 FIX: DO NOT OVERRIDE SIGNAL LOGIC
  // -----------------------------------

  const {
    texts, // strip heavy field only
    ...safeExternal
  } = external;

  // 🔴 USE BACKEND VALUES DIRECTLY
  brain.externalSignalSummary = {
    ...safeExternal
  };

  // -----------------------------------
  // Indicators
  // -----------------------------------

  brain.indicators = await attachIndicators(brain);

  // -----------------------------------
  // Risk Engine
  // -----------------------------------

  brain.confidence = buildConfidence(
    brain.indicators,
    brain.publicSignals,
    brain.identifier_type,
    brain.externalSignalSummary
  );

  // -----------------------------------
  // Risk Color
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
    generated_at: new Date().toISOString(),
    paid_mode: paid
  };

  brain.score = brain.confidence.riskScore;
  brain.severity = brain.confidence.riskLevel;
  brain.contextual_hits = brain.indicators.length;

  console.log("FINAL IDENTIFIER IN RESULT:", brain.identifier);
  console.log("=================================");

  return sanitizeReport(brain);

}
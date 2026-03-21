// ---------------------------------------------------
// JustCheckIt Signal Engine
// Runs all detection signals and returns results
// ---------------------------------------------------

import usernamePatternSignals from "./usernamePatternSignals.js";
import paymentReferenceSignals from "./paymentReferenceSignals.js";
import domainPatternSignals from "./domainPatternSignals.js";
import emailPatternSignals from "./emailPatternSignals.js";
import phonePatternSignals from "./phonePatternSignals.js";
import crossIdentifierSignals from "./crossIdentifierSignals.js";
import urlStructureSignals from "./urlStructureSignals.js";
import randomStringSignals from "./randomStringSignals.js";
import messageUrgencySignals from "./messageUrgencySignals.js";
import courierPickupSignals from "./courierPickupSignals.js";
import webPresenceSignal from "./webPresenceSignal.js";
import webSignal from "./webSignal.js";

// ---------------------------------------------------
// Helper: safely run signal modules
// ---------------------------------------------------

async function runModule(moduleFn, input) {

  try {

    const result = await moduleFn(input);

    if (Array.isArray(result)) {
      return result;
    }

    return [];

  } catch (err) {

    console.error("Signal Module Error:", err);
    return [];

  }

}

// ---------------------------------------------------
// Remove duplicate signals
// ---------------------------------------------------

function dedupeSignals(signals) {

  const seen = new Set();

  return signals.filter(signal => {

    const key = signal.type + signal.title;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;

  });

}

// ---------------------------------------------------
// Multi Signal Escalation
// ---------------------------------------------------

function applyMultiSignalEscalation(signals) {

  const amberSignals = signals.filter(s => s.level === "amber");
  const redSignals = signals.filter(s => s.level === "red");

  const hasCluster = signals.some(s => s.type === "multi_signal_cluster");

  if (!hasCluster) {

    if (amberSignals.length >= 3) {

      signals.push({
        type: "multi_signal_cluster",
        level: "red",
        title: "Multiple Risk Patterns Detected",
        explanation:
          "Several independent pattern signals were detected for this identifier.",
        confidence: 0.72
      });

    }

    if (amberSignals.length >= 2 && redSignals.length >= 1) {

      signals.push({
        type: "multi_signal_cluster",
        level: "red",
        title: "Clustered Risk Indicators",
        explanation:
          "Multiple different signal types were detected together for this identifier.",
        confidence: 0.75
      });

    }

  }

  return signals;

}

// ---------------------------------------------------
// Run Signal Engine
// ---------------------------------------------------

async function runSignalEngine(input) {

  const signals = [];

  const moduleResults = await Promise.all([

    runModule(usernamePatternSignals, input),
    runModule(paymentReferenceSignals, input),
    runModule(domainPatternSignals, input),
    runModule(emailPatternSignals, input),
    runModule(phonePatternSignals, input),
    runModule(crossIdentifierSignals, input),
    runModule(urlStructureSignals, input),
    runModule(randomStringSignals, input),
    runModule(messageUrgencySignals, input),
    runModule(courierPickupSignals, input),
    runModule(webPresenceSignal, input),
    runModule(webSignal, input)

  ]);

  moduleResults.forEach(result => {
    signals.push(...result);
  });

  const uniqueSignals = dedupeSignals(signals);

  const escalatedSignals = applyMultiSignalEscalation(uniqueSignals);

  if (process.env.DEBUG_SIGNALS === "true") {

    console.log("---- JustCheckIt Signal Engine ----");
    console.log("Input:", input);
    console.log("Signals detected:", escalatedSignals.length);
    console.log(escalatedSignals);
    console.log("-----------------------------------");

  }

  return escalatedSignals;

}

// ---------------------------------------------------
// EXPORT (THIS FIXES YOUR ERROR)
// ---------------------------------------------------

export default runSignalEngine;
/**
 * phone_intel indicator
 * ---------------------
 * Uses phoneIntel module to detect VOIP and burner patterns.
 */

import phoneIntel from "../../intel/phoneIntel.js";

export default async function phone_intel(brain) {

  if (brain.identifier_type !== "phone") {
    return null;
  }

  const intel = phoneIntel(brain.identifier);

  if (!intel || !intel.valid) {
    return null;
  }

  const indicators = [];

  for (const signal of intel.signals) {

    indicators.push({

      id: "phone_intel_" + signal.type,

      type: "risk",

      severity: signal.severity,

      title: "Phone Intelligence Signal",

      description: signal.message,

      source: "phone_intel"

    });

  }

  return indicators;

}
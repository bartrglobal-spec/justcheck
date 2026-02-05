// backend/brain/indicators/registry.js

/**
 * Indicator Registry
 * ------------------
 * This file defines every indicator that JustCheck is allowed to emit.
 * Indicators are atomic, explainable facts — not verdicts.
 *
 * If an indicator is not defined here, it must never appear in output.
 */

const INDICATOR_REGISTRY = {
  // ===== EXISTENCE INDICATORS =====

  FIRST_SEEN_RECENT: {
    code: "FIRST_SEEN_RECENT",
    category: "existence",
    level: "green",
    weight: 1,
    user_text: "This identifier has been seen recently in the system.",
    internal_reason: "First seen timestamp within recent threshold"
  },

  FIRST_SEEN_LONG_AGO: {
    code: "FIRST_SEEN_LONG_AGO",
    category: "existence",
    level: "green",
    weight: 2,
    user_text: "This identifier has been present in the system for some time.",
    internal_reason: "First seen timestamp exceeds stability threshold"
  },

  NEVER_SEEN_BEFORE: {
    code: "NEVER_SEEN_BEFORE",
    category: "existence",
    level: "amber",
    weight: 1,
    user_text: "This identifier has not been seen in the system before.",
    internal_reason: "No prior records found"
  },

  // ===== CONTEXT / DATA AVAILABILITY INDICATORS =====

  LIMITED_DATA_AVAILABLE: {
    code: "LIMITED_DATA_AVAILABLE",
    category: "context",
    level: "amber",
    weight: 0,
    user_text: "Some information sources were unavailable at the time of this check.",
    internal_reason: "One or more data sources did not respond"
  },

  NO_PUBLIC_FOOTPRINT: {
    code: "NO_PUBLIC_FOOTPRINT",
    category: "context",
    level: "amber",
    weight: 1,
    user_text: "No public presence could be found for this identifier.",
    internal_reason: "Public lookup sources returned no results"
  },

  // ===== PHONE FORMAT / PATTERN INDICATORS =====

  PHONE_TOO_SHORT: {
    code: "PHONE_TOO_SHORT",
    category: "pattern",
    level: "amber",
    weight: 1,
    user_text: "The phone number appears shorter than expected for a valid number.",
    internal_reason: "Digit length below minimum threshold"
  },

  PHONE_FORMAT_PLAUSIBLE: {
    code: "PHONE_FORMAT_PLAUSIBLE",
    category: "pattern",
    level: "green",
    weight: 0,
    user_text: "The phone number format appears consistent with a typical number.",
    internal_reason: "Basic length and structure checks passed"
  }

  // Future indicators will be added here
};

module.exports = {
  INDICATOR_REGISTRY
};

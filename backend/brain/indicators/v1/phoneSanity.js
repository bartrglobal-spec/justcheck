// brain/indicators/v1/phoneSanity.js

/**
 * PHONE SANITY INDICATOR — REGISTRY-FIRST
 * --------------------------------------
 * Performs basic phone format validation.
 * Emits ONLY registry-backed indicator codes.
 * No free text. No verdicts.
 */

module.exports = function phoneSanity(context = {}) {
  const { identifier, identifier_type } = context;

  // Defensive guard
  if (!identifier || identifier_type !== "phone") {
    return null;
  }

  // Normalize to digits only
  const digits = identifier.replace(/\D/g, "");

  // 🔒 Rule: Very short phone numbers are unusual
  if (digits.length < 8) {
    return {
      code: "PHONE_TOO_SHORT",
      level: "amber",
      order: 10
    };
  }

  // 🔒 Rule: Format appears plausible
  return {
    code: "PHONE_FORMAT_PLAUSIBLE",
    level: "green",
    order: 10
  };
};

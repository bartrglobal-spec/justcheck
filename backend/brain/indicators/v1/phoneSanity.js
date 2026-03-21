/**
 * Indicator: phone_sanity
 * -----------------------
 * Performs basic structural validation of phone identifiers.
 * Structural analysis only. No verdicts.
 */

export default {
  id: "phone_sanity",
  order: 40,

  run(brain) {
    const { identifier, identifier_type } = brain;

    // Only applies to phone identifiers
    if (!identifier || identifier_type !== "phone") {
      return null;
    }

    // Normalize to digits only
    const digits = identifier.replace(/\D/g, "");

    // Rule: Very short numbers are unusual
    if (digits.length < 8) {
      return {
        level: "amber",
        code: "PHONE_TOO_SHORT"
      };
    }

    // Format looks structurally plausible
    return {
      level: "green",
      code: "PHONE_FORMAT_PLAUSIBLE"
    };
  }
};
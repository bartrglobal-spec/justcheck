/**
 * PHONE SANITY INDICATOR — v1
 * ---------------------------
 * Performs basic structural phone validation.
 * Structural only. No verdicts.
 */

export default {
  id: "phone_sanity",
  type: "signal",
  weight: 4,

  evaluate(context = {}) {
    const { identifier, identifier_type } = context;

    // Only applies to phone identifiers
    if (!identifier || identifier_type !== "phone") {
      return null;
    }

    // Normalize to digits only
    const digits = identifier.replace(/\D/g, "");

    // Rule: Very short numbers are unusual
    if (digits.length < 8) {
      return {
        triggered: true,
        score: this.weight,
        reason: "Phone number unusually short"
      };
    }

    // Format looks structurally plausible → no signal
    return null;
  }
};
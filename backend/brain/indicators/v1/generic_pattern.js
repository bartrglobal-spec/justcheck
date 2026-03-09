/**
 * GENERIC PATTERN — v1
 * --------------------
 * Lightweight structural pattern presence signal.
 * Neutral informational signal.
 */

export default {
  id: "generic_pattern",
  type: "signal",
  weight: 1,

  evaluate(context = {}) {
    const { identifier } = context;

    if (typeof identifier !== "string") return null;

    const normalized = identifier.trim();

    if (normalized.length === 0) return null;

    // Very weak generic presence signal
    if (normalized.length > 6) {
      return {
        triggered: true,
        score: 0, // neutral (does not affect risk score)
        reason: "Public pattern presence observed"
      };
    }

    return null;
  }
};
/**
 * BASIC PRESENCE INDICATOR — v1
 * -----------------------------
 * Minimal structural presence check.
 * Ensures identifier is non-empty after trimming.
 */

export default {
  id: "basic_presence",
  type: "signal",
  weight: 1,

  evaluate(context = {}) {
    const { identifier } = context;

    if (typeof identifier !== "string") return null;

    const trimmed = identifier.trim();

    if (trimmed.length === 0) {
      return {
        triggered: true,
        score: this.weight,
        reason: "Identifier is empty after trimming"
      };
    }

    // Valid presence → no signal
    return null;
  }
};
/**
 * consistency_mismatch — v1
 *
 * Structural-only heuristic.
 * RAW input only.
 * Boolean output.
 * Non-judgmental.
 */

export default {
  id: "consistency_mismatch",
  type: "signal",        // explicit type for clarity
  weight: 2,

  evaluate(context) {
    const { identifier } = context;

    if (typeof identifier !== "string") return null;

    const normalized = identifier.toLowerCase().trim();

    const hasLetters = /[a-z]/.test(normalized);
    const hasNumbers = /[0-9]/.test(normalized);

    // Weak mismatch signal: mixed tokens in short identifiers
    const triggered =
      normalized.length < 12 && hasLetters && hasNumbers;

    if (!triggered) return null;

    return {
      triggered: true,
      score: this.weight,
      reason: "Short identifier contains mixed letters and numbers"
    };
  }
};
/**
 * Indicator: consistency_mismatch
 * --------------------------------
 * Structural heuristic detecting mixed letters and numbers
 * in unusually short identifiers.
 */

export default {
  id: "consistency_mismatch",
  order: 35,

  run(brain) {
    const { identifier } = brain;

    if (typeof identifier !== "string") return null;

    const normalized = identifier.toLowerCase().trim();

    const hasLetters = /[a-z]/.test(normalized);
    const hasNumbers = /[0-9]/.test(normalized);

    // Weak mismatch signal: mixed tokens in short identifiers
    const triggered =
      normalized.length < 12 && hasLetters && hasNumbers;

    if (!triggered) return null;

    return {
      level: "amber",
      code: "NEVER_SEEN_BEFORE"
    };
  }
};
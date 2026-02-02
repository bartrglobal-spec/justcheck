/**
 * consistency_mismatch — v1
 *
 * Structural-only heuristic.
 * RAW input only.
 * Boolean output.
 * Non-judgmental.
 */

module.exports = {
  id: "consistency_mismatch",
  weight: 2,

  run(value) {
    if (typeof value !== "string") return false;

    const normalized = value.toLowerCase().trim();

    const hasLetters = /[a-z]/.test(normalized);
    const hasNumbers = /[0-9]/.test(normalized);

    // Weak mismatch signal: mixed tokens in short identifiers
    return normalized.length < 12 && hasLetters && hasNumbers;
  }
};

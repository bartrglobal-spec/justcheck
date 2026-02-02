/**
 * JustCheck — Indicators V1 (LOCKED)
 * Each indicator must:
 * - have id (string)
 * - have weight (number)
 * - expose run(input) => boolean
 */

module.exports = [
  {
    id: "basic_presence",
    weight: 1,
    run(input) {
      // Fires ONLY when input exists but is meaningless (whitespace)
      if (typeof input !== "string") return false;
      return input.trim().length === 0;
    }
  },

  {
    id: "short_identifier",
    weight: 1,
    run(input) {
      if (typeof input !== "string") return false;
      return input.length > 0 && input.length < 5;
    }
  },

  {
    id: "generic_pattern",
    weight: 1,
    run(input) {
      if (typeof input !== "string") return false;
      return /^[0-9]+$/.test(input);
    }
  },

  {
    id: "consistency_mismatch",
    weight: 1,
    run(input) {
      // Placeholder — always false in V1
      return false;
    }
  }
];

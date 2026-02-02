/**
 * generic_pattern — v1
 * Structural-only heuristic
 * RAW value in, boolean out
 */

module.exports = {
  id: "generic_pattern",
  weight: 1,

  run(value) {
    if (typeof value !== "string") return false;

    // Numeric-only identifiers
    if (/^[0-9]+$/.test(value)) return true;

    // Repeated characters (e.g. 1111, aaaa)
    if (/(.)\1{3,}/.test(value)) return true;

    return false;
  }
};

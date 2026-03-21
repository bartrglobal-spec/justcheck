/**
 * Indicator: generic_pattern
 * --------------------------
 * Lightweight structural pattern presence indicator.
 * Neutral informational observation about identifier structure.
 */

export default {
  id: "generic_pattern",
  order: 30,

  run(brain) {
    const { identifier } = brain;

    if (typeof identifier !== "string") return null;

    const normalized = identifier.trim();

    if (normalized.length === 0) return null;

    // Very weak structural observation
    if (normalized.length > 6) {
      return {
        level: "green",
        code: "FIRST_SEEN_RECENT"
      };
    }

    return null;
  }
};
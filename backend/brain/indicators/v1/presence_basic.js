/**
 * Indicator: basic_presence
 * -------------------------
 * Minimal structural presence check.
 * Ensures identifier is not empty after trimming.
 */

export default {
  id: "basic_presence",
  order: 1,

  run(brain) {
    const { identifier } = brain;

    if (typeof identifier !== "string") return null;

    const trimmed = identifier.trim();

    if (trimmed.length === 0) {
      return {
        level: "amber",
        code: "LIMITED_DATA_AVAILABLE"
      };
    }

    return null;
  }
};
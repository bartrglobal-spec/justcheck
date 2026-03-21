/**
 * Indicator: short_identifier
 * ---------------------------
 * Flags identifiers that are unusually short for their type.
 * Structural pattern only.
 */

export default {
  id: "short_identifier",
  order: 20,

  run(brain) {
    const { identifier, identifier_type } = brain;

    if (typeof identifier !== "string") return null;

    const length = identifier.trim().length;

    if (length === 0) return null;

    // Type-aware short thresholds
    const thresholds = {
      username: 3,
      name: 3,
      website: 6,
      email: 6,
      phone: 7
    };

    const minLength = thresholds[identifier_type] ?? 4;

    if (length < minLength) {
      return {
        level: "amber",
        code: "PHONE_TOO_SHORT"
      };
    }

    return null;
  }
};
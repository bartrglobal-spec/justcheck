/**
 * SHORT IDENTIFIER INDICATOR — v1
 * --------------------------------
 * Flags unusually short identifiers.
 * Structural only.
 */

export default {
  id: "short_identifier",
  type: "signal",
  weight: 2,

  evaluate(context = {}) {
    const { identifier, identifier_type } = context;

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
        triggered: true,
        score: this.weight,
        reason: "Identifier unusually short for its type"
      };
    }

    return null;
  }
};
// brain/indicators/v1/firstSeen.js

/**
 * FIRST SEEN INDICATOR — v1
 * -------------------------
 * Emits age-based signals using persistence lookup data.
 * Read-only. Does NOT write.
 */

export default {
  id: "first_seen",
  type: "signal",
  weight: 3,

  evaluate(context = {}) {
    const { persistence } = context;

    if (!persistence) return null;

    // Never seen before (stronger signal)
    if (persistence.never_seen === true) {
      return {
        triggered: true,
        score: this.weight,
        reason: "Identifier has never been seen before"
      };
    }

    // Seen within last 7 days
    const oneWeekMs = 1000 * 60 * 60 * 24 * 7;

    if (
      typeof persistence.first_seen_age_ms === "number" &&
      persistence.first_seen_age_ms < oneWeekMs
    ) {
      return {
        triggered: true,
        score: 1,
        reason: "Identifier first seen recently"
      };
    }

    // Older presence = neutral (do not trigger)
    return null;
  }
};
// backend/brain/indicators/v1/firstSeen.js

/**
 * Indicator: first_seen
 * ---------------------
 * Emits time-based indicators using persistence lookup data.
 * Read-only. Does NOT write.
 */

export default {
  id: "first_seen",
  order: 10,

  run(brain) {
    const { persistence } = brain;

    if (!persistence) return null;

    // Identifier never seen before
    if (persistence.never_seen === true) {
      return {
        level: "amber",
        code: "NEVER_SEEN_BEFORE"
      };
    }

    const oneWeekMs = 1000 * 60 * 60 * 24 * 7;

    if (typeof persistence.first_seen_age_ms === "number") {
      // Seen recently
      if (persistence.first_seen_age_ms < oneWeekMs) {
        return {
          level: "green",
          code: "FIRST_SEEN_RECENT"
        };
      }

      // Seen long ago (stable identifier)
      return {
        level: "green",
        code: "FIRST_SEEN_LONG_AGO"
      };
    }

    return null;
  }
};
// brain/indicators/v1/firstSeen.js

/**
 * FIRST SEEN INDICATOR
 * -------------------
 * Emits existence-based indicators using
 * persistence lookup data.
 *
 * This indicator does NOT write data.
 */

module.exports = function firstSeen(context = {}) {
  const { persistence } = context;

  if (!persistence) return null;

  if (persistence.never_seen === true) {
    return {
      code: "NEVER_SEEN_BEFORE",
      level: "amber",
      order: 50
    };
  }

  if (persistence.first_seen_age_ms < 1000 * 60 * 60 * 24 * 7) {
    return {
      code: "FIRST_SEEN_RECENT",
      level: "green",
      order: 50
    };
  }

  return {
    code: "FIRST_SEEN_LONG_AGO",
    level: "green",
    order: 50
  };
};

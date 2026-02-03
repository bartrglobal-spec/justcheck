// backend/brain/signalEngine.js

/**
 * Derive risk signal purely from internal database facts.
 * NO external calls. NO side effects.
 *
 * @param {Object} stats
 * @param {number} stats.count
 * @param {string|Date} stats.first_seen
 * @returns {Object}
 */
function deriveSignal(stats) {
  const { count, first_seen } = stats;

  if (!count || count === 0) {
    return {
      level: "green",
      reason_code: "NO_ACTIVITY"
    };
  }

  if (count === 1) {
    return {
      level: "green",
      reason_code: "LOW_ACTIVITY"
    };
  }

  if (count >= 2 && count <= 4) {
    return {
      level: "amber",
      reason_code: "REPEATED_ACTIVITY"
    };
  }

  return {
    level: "red",
    reason_code: "HIGH_ACTIVITY"
  };
}

module.exports = {
  deriveSignal
};

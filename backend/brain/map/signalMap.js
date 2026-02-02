/**
 * Signal Map
 * The ONLY place where user-visible signals are defined
 *
 * LOCKED:
 * - Wording
 * - Levels
 * - Meaning
 */

const SIGNAL_MAP = Object.freeze({
  green: Object.freeze({
    level: "green",
    summary: "Low Risk Indicators"
  }),

  amber: Object.freeze({
    level: "amber",
    summary: "Some Risk Indicators"
  })
});

/**
 * Get a safe signal for user exposure
 * Red is intentionally downgraded to amber
 */
function getSignal(level) {
  if (level === "amber" || level === "red") {
    return SIGNAL_MAP.amber;
  }

  return SIGNAL_MAP.green;
}

module.exports = {
  getSignal
};

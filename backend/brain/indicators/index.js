/**
 * Indicator Registry (Versioned)
 *
 * RULES:
 * - Indicators return facts only
 * - No verdict language
 * - No user-facing claims
 * - Internal use only
 */

/**
 * v1 indicators
 */

/**
 * Checks whether any identifier was provided at all
 * Presence-only signal, no interpretation
 */
function basicPresenceSignal(input) {
  const hasInput =
    input &&
    typeof input === "object" &&
    Object.values(input).some(
      value => value !== null && value !== undefined && value !== ""
    );

  return {
    key: "basic_presence_signal",
    description: "Basic identifier presence detected",
    weight: 1,
    triggered: Boolean(hasInput)
  };
}

/**
 * Placeholder (kept for baseline stability)
 */
function placeholderIndicator(input) {
  return {
    key: "placeholder_indicator",
    description: "Internal placeholder indicator",
    weight: 0,
    triggered: false
  };
}

module.exports = {
  v1: [
    basicPresenceSignal,
    placeholderIndicator
  ]
};

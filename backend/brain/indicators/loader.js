/**
 * Indicator Loader
 * ----------------
 * Loads the indicator catalog into memory.
 *
 * IMPORTANT:
 * - Does NOT evaluate indicators
 * - Does NOT score indicators
 * - Does NOT expose indicators to users
 *
 * This exists so future steps can selectively
 * include / exclude premium indicators.
 */

const catalog = require("./catalog");

function loadIndicators(options = {}) {
  const {
    includePremium = false
  } = options;

  if (!includePremium) {
    return catalog.filter(indicator => indicator.premium === false);
  }

  return catalog;
}

module.exports = {
  loadIndicators
};

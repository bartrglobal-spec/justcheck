/**
 * INDICATOR REGISTRY — V1 (LOCKED)
 *
 * Loads indicators and enforces contract validation.
 */

const { validateIndicator } = require("../validate");

// Individual indicators
const basicPresence = require("./presence_basic");
const shortIdentifier = require("./shortId");
const genericPattern = require("./generic_pattern");
const consistencyMismatch = require("./consistency_mismatch");

// Normalize all indicators into ONE flat list
const rawIndicators = [
  basicPresence,
  shortIdentifier,
  ...genericPattern,
  consistencyMismatch
];

const indicators = [];

for (const indicator of rawIndicators) {
  try {
    validateIndicator(indicator);
    indicators.push(indicator);
  } catch (err) {
    console.error(
      `❌ Indicator rejected: ${indicator?.id || "unknown"} —`,
      err.message
    );
  }
}

module.exports = indicators;

/**
 * Central Indicator Entry Point
 *
 * RULES:
 * - Must export a flat array
 * - Must not execute indicator logic
 * - Must not infer identifier types
 * - Versioned indicators are authoritative
 */

const { loadIndicators } = require("./loader");

// Default to v1 indicator set
const indicators = loadIndicators({ includePremium: true });

module.exports = indicators;

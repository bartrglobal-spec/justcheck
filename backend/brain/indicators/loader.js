/**
 * Indicator Loader
 * ----------------
 * Loads executable indicator modules.
 * No evaluation, no scoring, no filtering logic.
 */

const path = require("path");
const fs = require("fs");

function loadIndicators({ includePremium = false } = {}) {
  const indicatorsDir = path.join(__dirname, "v1");

  const files = fs
    .readdirSync(indicatorsDir)
    .filter(f => f.endsWith(".js") && !f.startsWith("_") && f !== "index.js");

  const indicators = [];

  for (const file of files) {
    const mod = require(path.join(indicatorsDir, file));

    if (!mod || typeof mod.run !== "function") continue;
    if (mod.premium === true && !includePremium) continue;

    indicators.push(mod);
  }

  return indicators;
}

module.exports = {
  loadIndicators
};

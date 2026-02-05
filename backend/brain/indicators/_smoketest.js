/**
 * Indicator Loader Smoke Test
 * ---------------------------
 * This file is for manual verification only.
 * It is NOT imported anywhere in production.
 */

const { loadIndicators } = require("./loader");

console.log("=== FREE INDICATORS ===");
const free = loadIndicators({ includePremium: false });
console.log(free);

console.log("\n=== ALL INDICATORS (PREMIUM INCLUDED) ===");
const all = loadIndicators({ includePremium: true });
console.log(all);

/**
 * Brain (Free Tier)
 * -----------------
 * Orchestrates indicator loading, execution, aggregation,
 * and sanitization into a stable public report.
 */

const sanitizeReport = require("./sanitizeReport");
const { loadIndicators } = require("./indicators/loader");

async function runBrain(input) {
  const indicators = loadIndicators({ includePremium: false });

  const results = [];

  for (const indicator of indicators) {
    try {
      if (typeof indicator.run !== "function") continue;

      const outcome = await indicator.run(input);

      if (outcome) {
        results.push({
          id: indicator.id,
          level: outcome.level,
          code: outcome.code,
          order: indicator.order ?? 100
        });
      }
    } catch (err) {
      // Silent fail — indicators must never break the brain
    }
  }

  const riskLevels = results.map(r => r.level);

  let risk_color = "green";
  let confidence = "low";

  if (riskLevels.includes("red")) {
    risk_color = "red";
    confidence = "high";
  } else if (riskLevels.includes("amber")) {
    risk_color = "amber";
    confidence = "medium";
  }

  const headline =
    results.length === 0
      ? "No significant risk indicators detected"
      : "Potential risk indicators detected";

  const report = {
    identifier: input.identifier,
    identifier_type: input.identifier_type,

    confidence,
    risk_color,
    headline,

    indicators: results.sort((a, b) => a.order - b.order),
    system_notes: [],

    meta: {
      total_checks: indicators.length,
      first_seen: null,
      generated_at: new Date().toISOString()
    }
  };

  return sanitizeReport(report);
}

module.exports = {
  runBrain
};

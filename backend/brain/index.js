/**
 * Brain (Free Tier)
 * -----------------
 * Orchestrates indicator loading, execution, aggregation,
 * and sanitization into a stable public report.
 */

import { loadIndicators } from "./indicators/loader.js";
import sanitizeReport from "./sanitizeReport.js";

export async function runBrain(input) {

  const indicators = await loadIndicators({ includePremium: false });

  console.log("Loaded indicators:", indicators.length);

  const indicatorRuns = indicators.map(async (indicator) => {

    try {

      if (typeof indicator.run !== "function") return null;

      const outcome = await indicator.run(input);

      if (!outcome) return null;

      return {
        id: indicator.id,
        category: indicator.category ?? "general",
        level: outcome.level,
        code: outcome.code,
        order: indicator.order ?? 100
      };

    } catch (err) {

      console.error("Indicator error:", indicator.id, err);
      return null;

    }

  });

  const rawResults = await Promise.all(indicatorRuns);

  const results = rawResults.filter(Boolean);

  // ---------------------------------------------------
  // Risk calculation
  // ---------------------------------------------------

  const riskLevels = results.map(r => r.level);

  let risk_color = "green";
  let confidence = "low";

  if (riskLevels.includes("red")) {
    risk_color = "red";
    confidence = "strong";
  } else if (riskLevels.includes("amber")) {
    risk_color = "amber";
    confidence = "moderate";
  }

  const headline =
    results.length === 0
      ? "No significant risk indicators detected"
      : "Potential risk indicators detected";

  // ---------------------------------------------------
  // Group indicators by category
  // ---------------------------------------------------

  const groupedIndicators = {};

  for (const indicator of results) {

    if (!groupedIndicators[indicator.category]) {
      groupedIndicators[indicator.category] = [];
    }

    groupedIndicators[indicator.category].push(indicator);

  }

  // ---------------------------------------------------
  // Build report
  // ---------------------------------------------------

  const report = {

    identifier: input?.identifier ?? null,
    identifier_type: input?.identifier_type ?? null,

    confidence,
    risk_color,
    headline,

    indicators: results.sort((a, b) => a.order - b.order),

    indicator_groups: groupedIndicators,

    system_notes: [],

    meta: {

      total_checks: indicators.length,
      indicators_triggered: results.length,
      generated_at: new Date().toISOString()

    }

  };

  return sanitizeReport(report);

}
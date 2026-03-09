/**
 * Brain (Free Tier)
 * -----------------
 * Orchestrates indicator loading, execution, aggregation,
 * and sanitization into a stable public report.
 */

import { loadIndicators } from "./indicators/loader.js";
import sanitizeReport from "./sanitizeReport.js";

export async function runBrain(input) {
  // 🔥 FIX: Await indicator loading
  const indicators = await loadIndicators({ includePremium: false });

  console.log("Loaded indicators:", indicators.length);

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
      console.error("Indicator error:", indicator.id, err);
    }
  }

  const riskLevels = results.map(r => r.level);

  let risk_color = "green";
  let confidence = "low";

  if (riskLevels.includes("red")) {
    risk_color = "red";
    confidence = "strong"; // 🔥 changed wording (not "high")
  } else if (riskLevels.includes("amber")) {
    risk_color = "amber";
    confidence = "moderate";
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
import { loadIndicators } from "./indicators/loader.js";

/**
 * attachIndicators
 * ----------------
 * Executes v1 indicator engine and returns normalized results
 * for the brain to reason about.
 */
export default async function attachIndicators(brain = {}) {
  const results = [];

  if (!brain || !brain.identifier || !brain.identifier_type) {
    return results;
  }

  // STEP 6: Initialize / update public signals (memory-safe)
  const now = new Date().toISOString();

  if (!brain.publicSignals) {
    brain.publicSignals = {
      has_web_presence: false,
      has_business_profile: false,
      warning_mentions_count: 0,
      discussion_mentions_count: 0,
      first_seen_at: now,
      last_checked_at: now
    };
  } else {
    brain.publicSignals.first_seen_at =
      brain.publicSignals.first_seen_at ?? now;

    brain.publicSignals.last_checked_at = now;
  }

  // System notes (idempotent)
  brain.system_notes = brain.system_notes || [];
  if (!brain.system_notes.includes("Public signal structure initialized")) {
    brain.system_notes.push("Public signal structure initialized");
  }
  if (!brain.system_notes.includes("No external enrichment sources connected yet")) {
    brain.system_notes.push("No external enrichment sources connected yet");
  }

  // Load indicators
  const indicators = await loadIndicators({ includePremium: false });

  for (const indicator of indicators) {
    try {
      if (typeof indicator.run !== "function") continue;

      const outcome = indicator.run(brain);

      if (outcome && outcome.level) {
        results.push({
          id: indicator.id,
          level: outcome.level,
          code: outcome.code,
          message: outcome.message,
          order: indicator.order ?? 100
        });
      }
    } catch {
      // Indicators must never break the brain
    }
  }

  return results.sort((a, b) => a.order - b.order);
}

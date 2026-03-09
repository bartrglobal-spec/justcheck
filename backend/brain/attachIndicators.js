import { loadIndicators } from "./indicators/loader.js";

/**
 * attachIndicators
 * ----------------
 * Executes indicator engine using
 * already-collected brain signals.
 */
export default async function attachIndicators(brain = {}) {

  const results = [];

  if (!brain || !brain.identifier || !brain.identifier_type) {
    return results;
  }

  const now = new Date().toISOString();

  // -----------------------------------
  // Initialize publicSignals structure
  // -----------------------------------

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

  brain.system_notes = brain.system_notes || [];

  // -----------------------------------
  // Sync external signals
  // -----------------------------------

  const external = brain.externalSignalSummary || {};

  brain.publicSignals.has_web_presence =
    external.has_web_presence ?? false;

  brain.publicSignals.discussion_mentions_count =
    external.discussion_mentions_count ?? 0;

  brain.publicSignals.warning_mentions_count =
    external.warning_mentions_count ?? 0;

  if (!brain.system_notes.includes("External web enrichment connected")) {
    brain.system_notes.push("External web enrichment connected");
  }

  // -----------------------------------
  // Load indicators
  // -----------------------------------

  const indicators = await loadIndicators({ includePremium: false });

  for (const indicator of indicators) {

    try {

      if (typeof indicator.run !== "function") {
        continue;
      }

      const outcome = indicator.run(brain);

      if (!outcome) {
        continue;
      }

      const triggered = outcome.triggered === true;

      const score =
        typeof outcome.score === "number"
          ? outcome.score
          : 0;

      results.push({
        id: indicator.id,

        triggered,

        score,

        level: outcome.level ?? "info",
        code: outcome.code ?? null,
        message: outcome.message ?? null,

        order: indicator.order ?? 100
      });

    } catch {

      // Indicators must never break the brain

    }

  }

  return results.sort((a, b) => a.order - b.order);

}
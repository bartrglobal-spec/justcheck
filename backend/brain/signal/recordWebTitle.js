/**
 * recordWebTitle
 * --------------
 * Records a discovered public web page title for an identifier.
 * Titles are stored as lightweight evidence only (no URLs, no content).
 */

import { savePublicSignals } from "./signalEngine.js";

export function recordWebTitle(identifier, title) {
  if (!identifier || !title || typeof title !== "string") return;

  savePublicSignals(identifier, (signals) => {
    // Defensive init (future-proof)
    if (!Array.isArray(signals.web_titles)) {
      signals.web_titles = [];
    }

    const cleanTitle = title.trim();

    if (!cleanTitle) return;

    if (!signals.web_titles.includes(cleanTitle)) {
      signals.web_titles.push(cleanTitle);
    }

    // Presence inference
    signals.has_web_presence = true;
  });
}

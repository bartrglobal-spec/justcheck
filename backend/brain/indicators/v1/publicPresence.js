/**
 * Indicator: public_presence_summary
 * ----------------------------------
 * Summarises publicly observable signal structure.
 */

import { getPublicSignals } from "../../signal/signalEngine.js";

export default {
  id: "public_presence_summary",
  order: 5,

  run(brain) {
    const signals = getPublicSignals(brain.identifier);
    brain.publicSignals = signals;

    const {
      has_web_presence,
      warning_mentions_count,
      discussion_mentions_count,
      web_titles = []
    } = signals;

    // 🚩 Warning language present
    if (warning_mentions_count > 0) {
      return {
        level: "amber",
        code: "PUBLIC_WARNING_LANGUAGE",
        message:
          "This identifier has appeared in public discussions that include cautionary or warning-style language. This does not confirm wrongdoing, but it may justify extra care."
      };
    }

    // 🌐 Web titles observed
    if (web_titles.length > 0) {
      return {
        level: "green",
        code: "WEB_PRESENCE_TITLES",
        message:
          "This identifier appears on publicly visible pages with descriptive titles, suggesting some level of external visibility."
      };
    }

    // ⚠️ No footprint
    if (!has_web_presence && discussion_mentions_count === 0) {
      return {
        level: "amber",
        code: "NO_PUBLIC_FOOTPRINT",
        message:
          "No meaningful public footprint could be observed for this identifier. A lack of external references can increase uncertainty when transacting."
      };
    }

    return null;
  }
};

/**
 * Indicator: public_presence_summary
 * ----------------------------------
 * Uses external enrichment signals to determine whether
 * an identifier appears in public web discussion.
 */

export default {
  id: "public_presence_summary",
  order: 5,

  run(brain) {
    const signals = brain.externalSignalSummary || {};

    console.log("PUBLIC PRESENCE USING:", signals);

    const hasPresence = signals.has_web_presence || false;
    const discussionHits = signals.discussion_mentions_count || 0;
    const warningHits = signals.warning_mentions_count || 0;

    // 🔴 Strong warning presence
    if (warningHits >= 5) {
      return {
        level: "red",
        code: "MULTIPLE_PUBLIC_WARNINGS",
        message:
          "This identifier appears repeatedly in public sources alongside strong warning or scam-related language. Extra caution is strongly advised."
      };
    }

    // 🟠 Some warning presence
    if (warningHits >= 3) {
      return {
        level: "amber",
        code: "PUBLIC_WARNING_LANGUAGE",
        message:
          "This identifier appears in public contexts that include cautionary or warning-style language. Additional care may be appropriate."
      };
    }

    // 🟢 Web presence detected but low warning density
    if (hasPresence || discussionHits > 0) {
      return {
        level: "green",
        code: "PUBLIC_MENTIONS_PRESENT",
        message:
          "This identifier appears in public search results online, indicating some observable external visibility."
      };
    }

    // 🟠 No presence at all
    return {
      level: "amber",
      code: "NO_PUBLIC_FOOTPRINT",
      message:
        "No meaningful public footprint could be observed for this identifier. A lack of external references can increase uncertainty when transacting."
    };
  }
};
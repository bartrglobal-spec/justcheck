/**
 * Indicator: public_absence_time
 * --------------------------------
 * Flags increased uncertainty when an identifier
 * has no public footprint over time.
 */

export default {
  id: "public_absence_time",
  order: 6,

  run(brain) {
    const ps = brain.publicSignals;
    if (!ps) return null;

    const {
      has_web_presence,
      has_business_profile,
      warning_mentions_count,
      discussion_mentions_count,
      first_seen_at
    } = ps;

    // Any presence cancels this indicator
    if (
      has_web_presence ||
      has_business_profile ||
      warning_mentions_count > 0 ||
      discussion_mentions_count > 0
    ) {
      return null;
    }

    if (!first_seen_at) return null;

    const firstSeen = new Date(first_seen_at).getTime();
    const now = Date.now();
    const daysObserved = Math.floor(
      (now - firstSeen) / (1000 * 60 * 60 * 24)
    );

    // Too early to judge
    if (daysObserved < 1) return null;

    return {
      level: "amber",
      code: "NO_PUBLIC_PRESENCE_OVER_TIME",
      message:
        "This identifier has shown no meaningful public presence over time. While not evidence of wrongdoing, prolonged absence of external references can increase uncertainty when transacting."
    };
  }
};

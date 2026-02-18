// backend/brain/signal/initPublicSignals.js

export function initPublicSignals() {
  const now = new Date().toISOString();

  return {
    first_seen_at: now,
    last_checked_at: now,

    // Presence flags
    has_web_presence: false,
    has_business_profile: false,

    // Mention counters
    warning_mentions_count: 0,
    discussion_mentions_count: 0,

    // Web intelligence
    web_titles: []
  };
}

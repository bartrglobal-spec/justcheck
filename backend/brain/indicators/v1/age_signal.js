// backend/brain/indicators/v1/age_signal.js
export default {
  id: "identifier_age_signal",
  order: 2,

  async run({ publicSignals }) {
    const firstSeen = publicSignals?.first_seen_at;

    // If we have never seen this identifier before, do nothing
    if (!firstSeen) return null;

    const firstSeenDate = new Date(firstSeen);
    const now = new Date();
    const ageInDays =
      (now.getTime() - firstSeenDate.getTime()) / (1000 * 60 * 60 * 24);

    // Threshold: 90 days of history = stabilizing signal
    if (ageInDays >= 90) {
      return {
        id: "identifier_age_signal",
        level: "green",
        code: "ESTABLISHED_IDENTIFIER",
        message:
          "This identifier has been observed consistently over time, which is generally associated with lower transactional uncertainty.",
        order: 2
      };
    }

    // Too new to be meaningful → stay silent
    return null;
  }
};

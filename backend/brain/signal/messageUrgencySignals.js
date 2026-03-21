function messageUrgencySignals(input) {

  const signals = [];

  if (!input || typeof input !== "string") {
    return signals;
  }

  const text = input.toLowerCase();

  const urgencyWords = [
    "urgent",
    "immediately",
    "act now",
    "limited time",
    "respond quickly",
    "final notice",
    "within 24 hours",
    "payment required now"
  ];

  let matches = 0;

  for (const word of urgencyWords) {
    if (text.includes(word)) {
      matches++;
    }
  }

  if (matches >= 2) {
    signals.push({
      type: "urgency_language_pattern",
      level: "amber",
      title: "Urgency Language Detected",
      explanation:
        "Multiple urgency phrases appear in this message. Pressure tactics are commonly used in fraudulent payment or delivery requests.",
      confidence: 0.56
    });
  }

  if (matches >= 4) {
    signals.push({
      type: "high_urgency_language_pattern",
      level: "red",
      title: "High Pressure Language Detected",
      explanation:
        "Several urgency phrases appear in this message, indicating strong pressure to act quickly.",
      confidence: 0.71
    });
  }

  return signals;
}

module.exports = messageUrgencySignals;
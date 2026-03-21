// ---------------------------------------------------
// Courier Pickup Pattern Signals
// Detects common third-party collection scam language
// ---------------------------------------------------

function courierPickupSignals(input) {

  const signals = [];

  if (!input || typeof input !== "string") {
    return signals;
  }

  const text = input.toLowerCase();

  const pickupPatterns = [
    "courier will collect",
    "courier will pick up",
    "driver will collect",
    "delivery agent will collect",
    "delivery agent will pick up",
    "friend will collect",
    "friend will pick up",
    "brother will collect",
    "brother will pick up",
    "someone will collect",
    "someone will pick up"
  ];

  let matches = 0;

  for (const phrase of pickupPatterns) {

    if (text.includes(phrase)) {
      matches++;
    }

  }

  // ---------------------------------------------------
  // Moderate detection
  // ---------------------------------------------------

  if (matches >= 1) {

    signals.push({
      type: "third_party_collection_pattern",
      level: "amber",
      title: "Third-Party Collection Pattern",
      explanation:
        "The message references someone else collecting the item. This pattern appears frequently in marketplace scams.",
      confidence: 0.58
    });

  }

  // ---------------------------------------------------
  // Strong detection
  // ---------------------------------------------------

  if (matches >= 2) {

    signals.push({
      type: "multiple_third_party_collection_references",
      level: "red",
      title: "Repeated Third-Party Collection References",
      explanation:
        "Multiple references to third-party pickup were detected. This behaviour is commonly associated with fraudulent marketplace transactions.",
      confidence: 0.72
    });

  }

  return signals;

}

module.exports = courierPickupSignals;
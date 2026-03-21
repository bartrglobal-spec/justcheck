// ---------------------------------------------------
// Payment Reference Pattern Signals
// Detects suspicious patterns in payment references
// ---------------------------------------------------

function analyzeReference(reference) {

  const signals = [];

  if (!reference || typeof reference !== "string") {
    return signals;
  }

  const value = reference.toLowerCase();

  // ---------------------------------------------------
  // Keyword detection
  // ---------------------------------------------------

  const riskyKeywords = [
    "deposit",
    "urgent",
    "transfer",
    "payment",
    "order",
    "invoice",
    "crypto",
    "btc",
    "usdt"
  ];

  for (const keyword of riskyKeywords) {

    if (value.includes(keyword)) {

      signals.push({
        type: "payment_reference_pattern",
        level: "amber",
        title: "Common Payment Keyword",
        explanation:
          "This payment reference contains commonly used transaction keywords.",
        confidence: 0.52
      });

      break;

    }

  }

  // ---------------------------------------------------
  // High digit usage
  // Example: order928374
  // ---------------------------------------------------

  const digitMatches = value.match(/[0-9]/g) || [];

  if (digitMatches.length >= 5) {

    signals.push({
      type: "payment_reference_pattern",
      level: "amber",
      title: "Number-Heavy Payment Reference",
      explanation:
        "This payment reference contains a high number of digits.",
      confidence: 0.54
    });

  }

  // ---------------------------------------------------
  // Repeating characters
  // Example: 1111 / aaa
  // ---------------------------------------------------

  if (/(.)\1{3,}/.test(value)) {

    signals.push({
      type: "payment_reference_pattern",
      level: "amber",
      title: "Repeating Character Pattern",
      explanation:
        "This payment reference contains repeating characters.",
      confidence: 0.50
    });

  }

  // ---------------------------------------------------
  // Very short reference
  // ---------------------------------------------------

  if (value.length <= 3) {

    signals.push({
      type: "payment_reference_pattern",
      level: "amber",
      title: "Very Short Payment Reference",
      explanation:
        "This payment reference is unusually short.",
      confidence: 0.46
    });

  }

  return signals;

}

// ---------------------------------------------------
// Export module
// ---------------------------------------------------

module.exports = function paymentReferenceSignals(input) {

  let reference = "";

  if (typeof input === "string") {
    reference = input;
  }

  if (typeof input === "object" && input.value) {
    reference = input.value;
  }

  return analyzeReference(reference);

};
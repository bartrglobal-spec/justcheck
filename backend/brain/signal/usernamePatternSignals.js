// ---------------------------------------------
// Username / Identifier Pattern Signals
// Detects machine-generated identifier patterns
// ---------------------------------------------

function analyzeIdentifier(identifier) {

  const signals = [];

  if (!identifier || typeof identifier !== "string") {
    return signals;
  }

  const value = identifier.toLowerCase();

  // ---------------------------------------------
  // Count digits
  // ---------------------------------------------
  const digitMatches = value.match(/[0-9]/g) || [];
  const digitCount = digitMatches.length;

  // ---------------------------------------------
  // Long numeric tail
  // example: seller983742
  // ---------------------------------------------
  if (/[a-z]+[0-9]{4,}$/.test(value)) {

    signals.push({
      type: "identifier_pattern",
      level: "amber",
      title: "Numeric Identifier Pattern",
      explanation:
        "This identifier ends with a long numeric sequence which is commonly seen in automatically generated usernames.",
      confidence: 0.52
    });

  }

  // ---------------------------------------------
  // Very high digit ratio
  // example: john8723648723
  // ---------------------------------------------
  if (digitCount >= 6) {

    signals.push({
      type: "identifier_pattern",
      level: "amber",
      title: "High Number Usage in Identifier",
      explanation:
        "This identifier contains a large number of digits which may indicate an automatically generated username.",
      confidence: 0.55
    });

  }

  // ---------------------------------------------
  // Repeating digits
  // example: 1111 2222
  // ---------------------------------------------
  if (/(.)\1{3,}/.test(value)) {

    signals.push({
      type: "identifier_pattern",
      level: "amber",
      title: "Repeating Character Pattern",
      explanation:
        "This identifier contains repeating characters which are sometimes seen in generated usernames.",
      confidence: 0.50
    });

  }

  // ---------------------------------------------
  // Excessive underscores
  // example: crypto_fast__deal
  // ---------------------------------------------
  const underscoreCount = (value.match(/_/g) || []).length;

  if (underscoreCount >= 2) {

    signals.push({
      type: "identifier_pattern",
      level: "amber",
      title: "Multiple Underscore Pattern",
      explanation:
        "This identifier contains multiple underscores which can appear in automatically generated handles.",
      confidence: 0.48
    });

  }

  // ---------------------------------------------
  // Very short identifiers
  // example: x12
  // ---------------------------------------------
  if (value.length <= 3) {

    signals.push({
      type: "identifier_pattern",
      level: "amber",
      title: "Very Short Identifier",
      explanation:
        "This identifier is extremely short which sometimes appears in temporary or newly created usernames.",
      confidence: 0.46
    });

  }

  return signals;
}

// ---------------------------------------------
// Export signal module
// ---------------------------------------------
module.exports = function usernamePatternSignals(input) {

  let identifier = "";

  if (typeof input === "string") {
    identifier = input;
  }

  if (typeof input === "object" && input.value) {
    identifier = input.value;
  }

  return analyzeIdentifier(identifier);
};
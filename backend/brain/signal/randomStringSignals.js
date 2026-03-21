// ---------------------------------------------------
// Random String Signals
// Detects identifiers that look randomly generated
// ---------------------------------------------------

function analyzeRandomness(value) {

  const signals = [];

  if (!value || typeof value !== "string") {
    return signals;
  }

  let v = value.toLowerCase().trim();

  // Remove email domain if present
  if (v.includes("@")) {
    v = v.split("@")[0];
  }

  // Remove domain extension
  v = v.replace(/\.(com|net|org|co|io|app|biz|info)$/, "");

  // Remove non alphanumeric
  v = v.replace(/[^a-z0-9]/g, "");

  if (v.length < 8) {
    return signals;
  }

  // ---------------------------------------------------
  // Low vowel ratio
  // ---------------------------------------------------

  const vowels = v.match(/[aeiou]/g) || [];
  const vowelRatio = vowels.length / v.length;

  if (vowelRatio < 0.2) {

    signals.push({
      type: "random_string_pattern",
      level: "amber",
      title: "Low Vowel Ratio",
      explanation:
        "This identifier contains an unusually low number of vowels.",
      confidence: 0.50
    });

  }

  // ---------------------------------------------------
  // High digit concentration
  // ---------------------------------------------------

  const digits = v.match(/[0-9]/g) || [];

  if (digits.length >= v.length * 0.4) {

    signals.push({
      type: "random_string_pattern",
      level: "amber",
      title: "High Digit Concentration",
      explanation:
        "This identifier contains a high proportion of digits.",
      confidence: 0.52
    });

  }

  // ---------------------------------------------------
  // Repeating random blocks
  // ---------------------------------------------------

  if (/(.{3,})\1/.test(v)) {

    signals.push({
      type: "random_string_pattern",
      level: "amber",
      title: "Repeating Character Blocks",
      explanation:
        "This identifier contains repeating character sequences.",
      confidence: 0.49
    });

  }

  // ---------------------------------------------------
  // Very long random string
  // ---------------------------------------------------

  if (v.length >= 20) {

    signals.push({
      type: "random_string_pattern",
      level: "amber",
      title: "Very Long Identifier String",
      explanation:
        "This identifier contains an unusually long character string.",
      confidence: 0.48
    });

  }

  return signals;

}

// ---------------------------------------------------
// Export module
// ---------------------------------------------------

module.exports = function randomStringSignals(input) {

  let value = "";

  if (typeof input === "string") {
    value = input;
  }

  if (typeof input === "object" && input.value) {
    value = input.value;
  }

  return analyzeRandomness(value);

};
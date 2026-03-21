// ---------------------------------------------------
// Phone Pattern Signals
// Detects unusual patterns in phone numbers
// ---------------------------------------------------

function analyzePhone(value) {

  const signals = [];

  if (!value || typeof value !== "string") {
    return signals;
  }

  // remove spaces, brackets, hyphens
  const cleaned = value.replace(/[\s\-\(\)]/g, "");

  // must contain mostly digits
  const digits = cleaned.match(/[0-9]/g) || [];

  if (digits.length < 7) {
    return signals;
  }

  const digitString = digits.join("");

  // ---------------------------------------------------
  // Very long number
  // ---------------------------------------------------

  if (digitString.length >= 13) {

    signals.push({
      type: "phone_pattern",
      level: "amber",
      title: "Very Long Phone Number",
      explanation:
        "This phone number contains an unusually high number of digits.",
      confidence: 0.51
    });

  }

  // ---------------------------------------------------
  // Repeating digits
  // ---------------------------------------------------

  if (/(.)\1{4,}/.test(digitString)) {

    signals.push({
      type: "phone_pattern",
      level: "amber",
      title: "Repeating Digit Pattern",
      explanation:
        "This phone number contains repeating digit sequences.",
      confidence: 0.50
    });

  }

  // ---------------------------------------------------
  // Sequential digits
  // ---------------------------------------------------

  const sequences = [
    "012345",
    "123456",
    "234567",
    "345678",
    "456789",
    "987654",
    "876543",
    "765432"
  ];

  for (const seq of sequences) {

    if (digitString.includes(seq)) {

      signals.push({
        type: "phone_pattern",
        level: "amber",
        title: "Sequential Digit Pattern",
        explanation:
          "This phone number contains sequential digit patterns.",
        confidence: 0.49
      });

      break;

    }

  }

  // ---------------------------------------------------
  // Digit heavy pattern
  // ---------------------------------------------------

  if (digitString.length >= 10) {

    const uniqueDigits = new Set(digitString.split(""));

    if (uniqueDigits.size <= 4) {

      signals.push({
        type: "phone_pattern",
        level: "amber",
        title: "Low Digit Diversity",
        explanation:
          "This phone number uses a limited variety of digits.",
        confidence: 0.48
      });

    }

  }

  return signals;

}

// ---------------------------------------------------
// Export module
// ---------------------------------------------------

module.exports = function phonePatternSignals(input) {

  let value = "";

  if (typeof input === "string") {
    value = input;
  }

  if (typeof input === "object" && input.value) {
    value = input.value;
  }

  return analyzePhone(value);

};
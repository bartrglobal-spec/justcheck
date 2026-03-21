// ---------------------------------------------------
// Email Pattern Signals
// Detects suspicious patterns in email identifiers
// ---------------------------------------------------

function analyzeEmail(email) {

  const signals = [];

  if (!email || typeof email !== "string") {
    return signals;
  }

  const value = email.toLowerCase();

  if (!value.includes("@")) {
    return signals;
  }

  const parts = value.split("@");
  const username = parts[0];

  // ---------------------------------------------------
  // Keyword stacking
  // ---------------------------------------------------

  const riskyKeywords = [
    "crypto",
    "pay",
    "payment",
    "secure",
    "transfer",
    "wallet",
    "deal",
    "bonus",
    "fast",
    "profit"
  ];

  let keywordHits = 0;

  for (const keyword of riskyKeywords) {
    if (username.includes(keyword)) {
      keywordHits++;
    }
  }

  if (keywordHits >= 2) {

    signals.push({
      type: "email_pattern",
      level: "amber",
      title: "Multiple Transaction Keywords",
      explanation:
        "This email username contains multiple transaction-related keywords.",
      confidence: 0.54
    });

  }

  // ---------------------------------------------------
  // Number-heavy usernames
  // ---------------------------------------------------

  const digits = username.match(/[0-9]/g) || [];

  if (digits.length >= 4) {

    signals.push({
      type: "email_pattern",
      level: "amber",
      title: "Number-Heavy Email Username",
      explanation:
        "This email username contains a high number of digits.",
      confidence: 0.52
    });

  }

  // ---------------------------------------------------
  // Repeating characters
  // ---------------------------------------------------

  if (/(.)\1{3,}/.test(username)) {

    signals.push({
      type: "email_pattern",
      level: "amber",
      title: "Repeating Character Pattern",
      explanation:
        "This email username contains repeating characters.",
      confidence: 0.50
    });

  }

  // ---------------------------------------------------
  // Very long username
  // ---------------------------------------------------

  if (username.length >= 25) {

    signals.push({
      type: "email_pattern",
      level: "amber",
      title: "Very Long Email Username",
      explanation:
        "This email username is unusually long.",
      confidence: 0.48
    });

  }

  return signals;

}

// ---------------------------------------------------
// Export module
// ---------------------------------------------------

module.exports = function emailPatternSignals(input) {

  let email = "";

  if (typeof input === "string") {
    email = input;
  }

  if (typeof input === "object" && input.value) {
    email = input.value;
  }

  return analyzeEmail(email);

};
// ---------------------------------------------------
// Cross Identifier Pattern Signals
// Detects reuse of the same identifier base
// across username / email / domain formats
// ---------------------------------------------------

function normalize(value) {

  if (!value || typeof value !== "string") {
    return "";
  }

  let v = value.toLowerCase().trim();

  // remove protocol
  v = v.replace(/^https?:\/\//, "");

  // remove www
  v = v.replace(/^www\./, "");

  // remove domain extension
  v = v.replace(/\.(com|net|org|co|io|app|biz|info)$/, "");

  // remove email domain
  if (v.includes("@")) {
    v = v.split("@")[0];
  }

  // remove non alphanumeric
  v = v.replace(/[^a-z0-9]/g, "");

  return v;
}

// ---------------------------------------------------
// Analyze identifier reuse
// ---------------------------------------------------

function analyzeCrossIdentifier(input) {

  const signals = [];

  let value = "";

  if (typeof input === "string") {
    value = input;
  }

  if (typeof input === "object" && input.value) {
    value = input.value;
  }

  if (!value) {
    return signals;
  }

  const base = normalize(value);

  if (!base) {
    return signals;
  }

  // ---------------------------------------------------
  // Detect mixed format reuse patterns
  // ---------------------------------------------------

  const looksLikeEmail = value.includes("@");
  const looksLikeDomain = value.includes(".") && !value.includes("@");

  if (base.length >= 8 && (looksLikeEmail || looksLikeDomain)) {

    signals.push({
      type: "identifier_reuse_pattern",
      level: "amber",
      title: "Reusable Identifier Base",
      explanation:
        "This identifier contains a base pattern that may be reused across usernames, emails, or domains.",
      confidence: 0.47
    });

  }

  // ---------------------------------------------------
  // Long base identifier
  // ---------------------------------------------------

  if (base.length >= 18) {

    signals.push({
      type: "identifier_reuse_pattern",
      level: "amber",
      title: "Long Identifier Base",
      explanation:
        "This identifier contains a long base string often reused across multiple accounts.",
      confidence: 0.46
    });

  }

  return signals;

}

// ---------------------------------------------------
// Export module
// ---------------------------------------------------

module.exports = function crossIdentifierSignals(input) {

  return analyzeCrossIdentifier(input);

};
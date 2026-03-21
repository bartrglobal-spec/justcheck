// ---------------------------------------------------
// URL Structure Signals
// Detects suspicious patterns in URLs and domains
// ---------------------------------------------------

function analyzeURL(value) {

  const signals = [];

  if (!value || typeof value !== "string") {
    return signals;
  }

  let url = value.toLowerCase().trim();

  // remove protocol
  url = url.replace(/^https?:\/\//, "");

  // remove www
  url = url.replace(/^www\./, "");

  // isolate domain
  const domain = url.split("/")[0];

  // ---------------------------------------------------
  // Hyphen chain detection
  // ---------------------------------------------------

  const hyphenCount = (domain.match(/-/g) || []).length;

  if (hyphenCount >= 3) {

    signals.push({
      type: "url_structure",
      level: "amber",
      title: "Hyphen-Heavy Domain Structure",
      explanation:
        "This domain contains an unusually high number of hyphens.",
      confidence: 0.53
    });

  }

  // ---------------------------------------------------
  // Keyword stacking
  // ---------------------------------------------------

  const riskyKeywords = [
    "secure",
    "verify",
    "update",
    "login",
    "account",
    "wallet",
    "crypto",
    "payment",
    "pay",
    "transfer"
  ];

  let keywordHits = 0;

  for (const keyword of riskyKeywords) {

    if (domain.includes(keyword)) {
      keywordHits++;
    }

  }

  if (keywordHits >= 3) {

    signals.push({
      type: "url_structure",
      level: "amber",
      title: "Multiple Transaction Keywords",
      explanation:
        "This domain contains several transaction or verification related keywords.",
      confidence: 0.55
    });

  }

  // ---------------------------------------------------
  // Long domain structure
  // ---------------------------------------------------

  if (domain.length >= 30) {

    signals.push({
      type: "url_structure",
      level: "amber",
      title: "Very Long Domain Name",
      explanation:
        "This domain name is unusually long.",
      confidence: 0.49
    });

  }

  // ---------------------------------------------------
  // Security themed wording
  // ---------------------------------------------------

  const securityWords = [
    "secure",
    "verify",
    "update",
    "login",
    "account"
  ];

  let securityHits = 0;

  for (const word of securityWords) {

    if (domain.includes(word)) {
      securityHits++;
    }

  }

  if (securityHits >= 2) {

    signals.push({
      type: "url_structure",
      level: "amber",
      title: "Security-Style Domain Wording",
      explanation:
        "This domain contains wording often associated with account or verification pages.",
      confidence: 0.52
    });

  }

  return signals;

}

// ---------------------------------------------------
// Export module
// ---------------------------------------------------

module.exports = function urlStructureSignals(input) {

  let value = "";

  if (typeof input === "string") {
    value = input;
  }

  if (typeof input === "object" && input.value) {
    value = input.value;
  }

  return analyzeURL(value);

};
// ---------------------------------------------------
// Domain Pattern Signals
// Detects suspicious patterns in domain names
// ---------------------------------------------------

function analyzeDomain(domain) {

  const signals = [];

  if (!domain || typeof domain !== "string") {
    return signals;
  }

  const value = domain.toLowerCase();

  // ---------------------------------------------------
  // Extract domain name without protocol
  // ---------------------------------------------------

  const cleaned = value
    .replace("http://", "")
    .replace("https://", "")
    .split("/")[0];

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
    if (cleaned.includes(keyword)) {
      keywordHits++;
    }
  }

  if (keywordHits >= 2) {

    signals.push({
      type: "domain_pattern",
      level: "amber",
      title: "Multiple Transaction Keywords",
      explanation:
        "This domain contains multiple transaction-related keywords.",
      confidence: 0.55
    });

  }

  // ---------------------------------------------------
  // Number-heavy domains
  // Example: shop247-deal99.com
  // ---------------------------------------------------

  const digits = cleaned.match(/[0-9]/g) || [];

  if (digits.length >= 4) {

    signals.push({
      type: "domain_pattern",
      level: "amber",
      title: "Number-Heavy Domain",
      explanation:
        "This domain contains a high number of digits.",
      confidence: 0.53
    });

  }

  // ---------------------------------------------------
  // Excessive hyphens
  // Example: fast-crypto-pay-now.com
  // ---------------------------------------------------

  const hyphens = cleaned.match(/-/g) || [];

  if (hyphens.length >= 3) {

    signals.push({
      type: "domain_pattern",
      level: "amber",
      title: "Multiple Hyphen Domain",
      explanation:
        "This domain contains multiple hyphens which can appear in automatically generated domains.",
      confidence: 0.52
    });

  }

  // ---------------------------------------------------
  // Very long domain
  // ---------------------------------------------------

  if (cleaned.length >= 30) {

    signals.push({
      type: "domain_pattern",
      level: "amber",
      title: "Unusually Long Domain",
      explanation:
        "This domain name is unusually long.",
      confidence: 0.50
    });

  }

  return signals;

}

// ---------------------------------------------------
// Export module
// ---------------------------------------------------

module.exports = function domainPatternSignals(input) {

  let domain = "";

  if (typeof input === "string") {
    domain = input;
  }

  if (typeof input === "object" && input.value) {
    domain = input.value;
  }

  return analyzeDomain(domain);

};
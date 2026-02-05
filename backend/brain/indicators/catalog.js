/**
 * Indicator Catalog
 * -----------------
 * Static definition of all possible indicators.
 *
 * IMPORTANT:
 * - No logic
 * - No execution
 * - No scoring
 * - Pure data only
 */

module.exports = [
  {
    code: "PHONE_FORMAT_VALID",
    description: "Phone number format is valid",
    weight: 0,
    level: "green",
    premium: false
  },
  {
    code: "PHONE_SEEN_BEFORE",
    description: "Identifier has appeared in prior checks",
    weight: 1,
    level: "amber",
    premium: false
  },
  {
    code: "PHONE_RAPID_REUSE",
    description: "Identifier reused unusually frequently",
    weight: 2,
    level: "amber",
    premium: true
  },
  {
    code: "PHONE_ASSOCIATED_WITH_REPORTS",
    description: "Identifier associated with user-submitted reports",
    weight: 3,
    level: "red",
    premium: true
  },
  {
    code: "NETWORK_CLUSTER_RISK",
    description: "Identifier appears in a high-risk network cluster",
    weight: 4,
    level: "red",
    premium: true
  }
];

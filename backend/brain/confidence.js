export default function buildConfidence(indicators = []) {
  // Very simple v1 confidence model
  // This is intentionally conservative and non-judgmental

  let level = "medium";
  let score = 50;

  if (!Array.isArray(indicators) || indicators.length === 0) {
    level = "high";
    score = 75;
  }

  if (indicators.length >= 2) {
    level = "low";
    score = 25;
  }

  return {
    level,
    score
  };
}

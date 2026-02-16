import indicators from "./indicators.js";

export default function attachIndicators(brain = {}) {
  const results = [];

  if (!brain || !brain.identifier || !brain.identifier_type) {
    return results;
  }

  for (const indicator of indicators) {
    try {
      const res = indicator(brain);
      if (res) {
        results.push(res);
      }
    } catch (err) {
      // Indicator failures are ignored by design
    }
  }

  return results;
}

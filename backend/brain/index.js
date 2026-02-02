console.log("🔥🔥🔥 NEW BRAIN FILE LOADED 🔥🔥🔥");

const normalizeInput = require("./normalize/input");
const indicators = require("./indicators/v1");
const { guardInput } = require("./guard/index");

function runBrain(rawInput) {
  const input = normalizeInput(rawInput);

  const triggered = [];
  let score = 0;

  for (const indicator of indicators) {
    if (!indicator || typeof indicator.run !== "function") {
      throw new Error("Invalid indicator contract");
    }

    const weight = Number(indicator.weight) || 0;
    const result = indicator.run(input);

    if (result === true) {
      triggered.push(indicator.id);
      score += weight;
    }
  }

  return { triggered, score };
}

module.exports = { runBrain };

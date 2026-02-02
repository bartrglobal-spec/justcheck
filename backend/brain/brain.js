console.log("🔥🔥🔥 NEW BRAIN FILE LOADED 🔥🔥🔥");

const normalizeInput = require("./normalize/input");
const indicators = require("./indicators/v1");

function runBrain(rawInput) {
  console.log("🧠 Brain started — V1");

  const input = normalizeInput(rawInput);

  let triggeredCount = 0;
  let score = 0;

  for (const indicator of indicators) {
    if (!indicator || typeof indicator.run !== "function") {
      throw new Error("Invalid indicator contract");
    }

    const weight = Number(indicator.weight) || 0;
    const result = indicator.run(input);

    if (result === true) {
      triggeredCount += 1;
      score += weight;
    }
  }

  console.log("🧠 Brain completed", {
    triggeredCount,
    scoreComputed: true
  });

  return { triggeredCount, score };
}

module.exports = { runBrain };

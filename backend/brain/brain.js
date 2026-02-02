console.log("🔥🔥🔥 NEW BRAIN FILE LOADED 🔥🔥🔥");

const normalizeInput = require("./normalize/input");
const indicators = require("./indicators/v1");

function runBrain(rawInput) {
  console.log("🧠 Brain started — V1");

  const input = normalizeInput(rawInput);
  console.log("Normalized input:", input);

  const triggered = [];
  let score = 0;

  for (const indicator of indicators) {
    if (!indicator || typeof indicator.run !== "function") {
      throw new Error("Invalid indicator contract");
    }

    const weight = Number(indicator.weight) || 0;

    console.log(`➡️ Checking indicator: ${indicator.id}`);
    const result = indicator.run(input);
    console.log(`   Result for ${indicator.id}:`, result);

    if (result === true) {
      triggered.push(indicator.id);
      score += weight;
    }
  }

  console.log("Final score:", score);

  return { triggered, score };
}

module.exports = { runBrain };

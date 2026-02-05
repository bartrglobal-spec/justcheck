console.log("⚙️ signalEngine.js loaded");

const { deriveConfidence } = require("./confidence");

function runSignalEngine(indicators) {
  return deriveConfidence(indicators);
}

module.exports = {
  runSignalEngine
};

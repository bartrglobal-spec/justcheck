const { runBrain } = require("./brain");
const buildSignal = require("./signal");

/**
 * Public brain entrypoint
 * Enforces output contract (D4 + D5 locked)
 */
function executeBrain(rawInput) {
  const { triggered, score } = runBrain(rawInput);

  const signal = buildSignal(score);

  return {
    signal,
    indicators: triggered
  };
}

module.exports = executeBrain;

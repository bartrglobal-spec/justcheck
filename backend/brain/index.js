/**
 * Brain Entry Point
 * Public interface for JustCheck brain execution
 */

const { runBrain } = require("./brain");

/**
 * executeBrain
 * Stable wrapper to isolate internal brain logic
 *
 * @param {Object} input - Raw request payload
 * @returns {Object} - Brain result
 */
function executeBrain(input) {
  return runBrain(input);
}

module.exports = {
  executeBrain
};

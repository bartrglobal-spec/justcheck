/**
 * INDICATOR CONTRACT VALIDATOR — V1 (LOCKED)
 *
 * Enforces:
 * - id: string
 * - weight: number >= 0
 * - run: function(input) => boolean
 *
 * Any violation throws a HARD error (caught by brain).
 */

function validateIndicator(indicator) {
  if (typeof indicator !== "object" || indicator === null) {
    throw new Error("Indicator is not an object");
  }

  if (typeof indicator.id !== "string" || indicator.id.trim() === "") {
    throw new Error("Indicator missing valid id");
  }

  if (typeof indicator.weight !== "number" || indicator.weight < 0) {
    throw new Error(`Indicator ${indicator.id} has invalid weight`);
  }

  if (typeof indicator.run !== "function") {
    throw new Error(`Indicator ${indicator.id} missing run()`);
  }

  return true;
}

module.exports = { validateIndicator };

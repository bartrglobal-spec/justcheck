/**
 * Brain Contract Self-Test — v1
 * Purpose:
 * - Validate indicator registry shape at startup
 * - NEVER crash the app
 * - Log loudly if contract is broken
 */

function runBrainSelfTest(indicators) {
  try {
    if (!Array.isArray(indicators)) {
      console.error("❌ Brain self-test failed: indicators is NOT an array");
      return false;
    }

    indicators.forEach((indicator, index) => {
      if (
        !indicator ||
        typeof indicator.key !== "string" ||
        typeof indicator.weight !== "number" ||
        typeof indicator.run !== "function"
      ) {
        console.error(
          `❌ Brain self-test failed at index ${index}:`,
          indicator
        );
        throw new Error("Invalid indicator contract");
      }
    });

    console.log(
      `✅ Brain v1 loaded: ${indicators.length} indicators (contract OK)`
    );
    return true;
  } catch (err) {
    console.error("❌ Brain self-test error:", err.message);
    return false;
  }
}

module.exports = {
  runBrainSelfTest
};

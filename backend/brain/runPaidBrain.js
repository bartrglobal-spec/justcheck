import runBrain from "./runBrain.js";

export default async function runPaidBrain(input = {}) {
  // Paid report uses the exact same brain.
  // No re-formatting.
  // No re-mapping.
  // No confidence rebuilding.
  return await runBrain(input);
}
/**
 * Indicator Test Harness (v1)
 *
 * PURPOSE:
 * - Load all v1 indicators via the registry
 * - Run them against sample inputs
 * - Log ONLY emitted indicators
 *
 * RULES:
 * - Indicators may return null
 * - Only non-null results are printed
 */

const indicators = require("./index");

// Sanity check
console.log("Loaded indicators:", indicators.map(i => i.id));

// Test inputs
const testInputs = [
  { identifier: "1111", identifier_type: "phone" },
  { identifier: "0647470911", identifier_type: "phone" },
  { identifier: "test@example.com", identifier_type: "email" },
  { identifier: "aaaaaa", identifier_type: "generic" }
];

for (const input of testInputs) {
  console.log("\nINPUT:", input);

  for (const indicator of indicators) {
    try {
      const result = indicator.run(input);

      if (result) {
        console.log("✔", indicator.id, result);
      }
    } catch (err) {
      console.error("✖", indicator.id, err.message);
    }
  }
}

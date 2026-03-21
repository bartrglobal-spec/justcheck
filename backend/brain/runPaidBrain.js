import runBrain from "./runBrain.js";

function normalizeIdentifier(identifier = "") {
  if (typeof identifier !== "string") return identifier;

  // Trim spaces
  let clean = identifier.trim();

  // If it starts with a number but no +
  if (/^\d/.test(clean)) {
    clean = "+" + clean;
  }

  return clean;
}

export default async function runPaidBrain(input = {}) {

  console.log("=================================");
  console.log("PAID FLOW START");

  // -----------------------------------
  // Normalize identifier FIRST
  // -----------------------------------

  const normalizedIdentifier = normalizeIdentifier(input.identifier);

  const paidInput = {
    ...input,
    identifier: normalizedIdentifier,
    paid: true
  };

  console.log("PAID INPUT RECEIVED:", input);
  console.log("PAID INPUT NORMALIZED:", paidInput);

  // -----------------------------------
  // Run same brain as free
  // -----------------------------------

  const result = await runBrain(paidInput);

  console.log("PAID RESULT IDENTIFIER:", result.identifier);
  console.log("=================================");

  return result;
}
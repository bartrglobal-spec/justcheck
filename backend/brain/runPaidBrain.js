import { guardInput } from "./guard/index.js";
import { formatPaidReport } from "./formatPaidReport.js";
import runBrain from "./runBrain.js";

export default async function runPaidBrain(input = {}) {
  // 1. Guard input
  const guard = guardInput(input);

  if (!guard.allowed) {
    return {
      error: "INPUT_NOT_ALLOWED",
      reason: guard.reason
    };
  }

  // 2. Run core brain
  const brainResult = await runBrain({
    identifier: guard.identifier,
    identifier_type: guard.identifier_type,
    paid: true
  });

  // 3. Format paid report
  const paidReport = formatPaidReport({
    ...brainResult,
    identifier: guard.identifier,
    identifier_type: guard.identifier_type
  });

  return paidReport;
}

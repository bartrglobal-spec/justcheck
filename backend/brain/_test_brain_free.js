const runBrain = require("./runBrain").default;

function cleanReport(report) {
  return {
    identifier: report.identifier,
    score: report.score,
    risk: report.severity,
    indicators: report.contextual_hits,

    external: {
      warning_mentions: report.externalSignalSummary?.warning_mentions_count || 0,
      discussion_mentions: report.externalSignalSummary?.discussion_mentions_count || 0,
      strength: report.externalSignalSummary?.signal_strength || "none"
    }
  };
}

async function run() {

  const input = {
    identifier: "1 (866) 738-0691",
    identifier_type: "phone",
    paid: false
  };

  const result = await runBrain(input);

  console.log("\n========== CLEAN RESULT ==========");
  console.log(cleanReport(result));
  console.log("=================================\n");

}

run();
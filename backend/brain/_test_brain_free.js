const { runBrain } = require("./index");

async function test(input) {
  const report = await runBrain(input);
  console.log("\n==============================");
  console.log("INPUT:", input);
  console.log("OUTPUT:");
  console.log(JSON.stringify(report, null, 2));
}

(async () => {
  await test({ identifier: "0647470911", identifier_type: "phone" });
  await test({ identifier: "1111", identifier_type: "phone" });
  await test({ identifier: "test@example.com", identifier_type: "email" });
})();

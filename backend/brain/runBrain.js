const indicators = require("./indicators");

module.exports = async function runBrain({ identifier, identifier_type }) {
  console.log("🧠 runBrain input:", { identifier, identifier_type });

  const resolved = [];

  for (const indicator of indicators) {
    try {
      const result = await indicator({ identifier, identifier_type });
      if (result) resolved.push(result);
    } catch (e) {
      // Silent failure by design
    }
  }

  let level = "green";
  if (resolved.some(r => r.level === "red")) level = "red";
  else if (resolved.length > 0) level = "amber";

  return {
    level,
    indicators: resolved
  };
};

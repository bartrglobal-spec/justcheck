const path = require("path");
const { renderReport } = require("./render");

const PG_DISABLED = process.env.PG_DISABLED === "true";

// 🔒 Persistence (may be disabled)
let lookupIdentifier = null;
let recordFirstSeen = null;
let recordCheck = null;

if (!PG_DISABLED) {
  const persistence = require("./persistence");
  lookupIdentifier = persistence.lookupIdentifier;
  recordFirstSeen = persistence.recordFirstSeen;
  recordCheck = persistence.recordCheck;
} else {
  console.log("🧠 Brain running in STATELESS mode (no persistence hooks)");
}

const indicatorRegistry = [];

// 🔒 HARD-RESOLVED INDICATOR LOAD
const indicatorsPath = path.join(__dirname, "indicators", "index.js");

console.log("🧠 Resolving indicators from:", indicatorsPath);

try {
  const indicators = require(indicatorsPath);

  if (!Array.isArray(indicators)) {
    throw new Error("Indicators export is not an array");
  }

  indicators.sort((a, b) => {
    const aOrder = typeof a.order === "number" ? a.order : 1000;
    const bOrder = typeof b.order === "number" ? b.order : 1000;
    return aOrder - bOrder;
  });

  indicatorRegistry.push(...indicators);
} catch (err) {
  console.error("❌ FAILED TO LOAD INDICATORS");
  console.error(err.message);
}

async function runBrain(context = {}) {
  console.log("🧠 runBrain input:", context);

  const indicators = [];
  let executionError = false;
  let history = null;

  let total_checks = 0;
  let first_seen = null;

  if (!PG_DISABLED && lookupIdentifier) {
    try {
      history = await lookupIdentifier(context.identifier);
      total_checks = history?.total_checks ?? 0;
      first_seen = history?.first_seen ?? null;
    } catch (err) {
      executionError = true;
    }
  }

  if (indicatorRegistry.length === 0) {
    executionError = true;
  }

  for (const indicator of indicatorRegistry) {
    try {
      const result = indicator({ ...context, history });
      if (result) {
        indicators.push({ ...result });
      }
    } catch (err) {
      executionError = true;
    }
  }

  let confidence = "LOW";

  if (indicators.some(i => i.level === "red")) {
    confidence = "HIGH";
  } else if (indicators.some(i => i.level === "amber")) {
    confidence = "MEDIUM";
  }

  if (executionError && confidence === "LOW") {
    confidence = "MEDIUM";
  }

  if (!PG_DISABLED && recordCheck) {
    try {
      await recordCheck(context);
    } catch (err) {}
  }

  return renderReport({
    identifier: context.identifier,
    identifier_type: context.identifier_type,
    confidence,
    indicators,
    meta: {
      total_checks,
      first_seen
    },
    context: {
      limitedSources: executionError,
      conservativeMode: true,
      outdatedSignals: false
    }
  });
}

module.exports = { runBrain };

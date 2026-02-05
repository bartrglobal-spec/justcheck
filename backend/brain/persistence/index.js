// backend/brain/persistence/index.js

const PG_DISABLED = process.env.PG_DISABLED === "true";

/**
 * recordCheck
 * -----------
 * Records a completed check to persistence.
 * When persistence is disabled, this is a safe no-op.
 */
async function recordCheck(context, result) {
  if (PG_DISABLED) {
    // 🔒 Stateless mode — do nothing, never throw
    return;
  }

  // Lazy-load real persistence only when enabled
  const { recordCheckToDb } = require("./recordCheck");

  return recordCheckToDb(context, result);
}

module.exports = {
  recordCheck
};

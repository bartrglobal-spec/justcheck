/**
 * Unlock Token Utility — One-Time Tokens (DEV)
 *
 * RULES:
 * - Single use
 * - Time-bound
 * - In-memory only (DEV)
 * - Easy to swap for DB / Stripe later
 */

const crypto = require("crypto");

// In-memory token store (DEV ONLY)
const tokenStore = new Map();

// Token lifetime (seconds)
const TOKEN_TTL_SECONDS = 300; // 5 minutes

function mintUnlockToken() {
  const token = crypto.randomBytes(16).toString("hex");
  const expiresAt = Date.now() + TOKEN_TTL_SECONDS * 1000;

  tokenStore.set(token, {
    used: false,
    expiresAt
  });

  return {
    token,
    expiresAt
  };
}

function isValidUnlockToken(token) {
  if (!token) return false;

  const record = tokenStore.get(token);
  if (!record) return false;

  if (record.used) return false;
  if (Date.now() > record.expiresAt) {
    tokenStore.delete(token);
    return false;
  }

  // 🔒 single-use
  record.used = true;
  tokenStore.set(token, record);

  return true;
}

module.exports = {
  mintUnlockToken,
  isValidUnlockToken
};

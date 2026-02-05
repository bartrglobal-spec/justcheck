// backend/brain/persistence.js

const PG_DISABLED = process.env.PG_DISABLED === "true";

/**
 * Persistence Layer
 * -----------------
 * This module is responsible for reading/writing identifier history.
 * When PG_DISABLED=true, this layer becomes a no-op by design.
 */

let pool = null;

if (!PG_DISABLED) {
  const { Pool } = require("pg");

  pool = new Pool({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    ssl: process.env.PG_SSL === "true" ? { rejectUnauthorized: false } : false
  });

  console.log("🗄️ Persistence ENABLED (Postgres)");
} else {
  console.log("🧪 Persistence DISABLED (stateless mode)");
}

/**
 * Lookup identifier history
 */
async function lookupIdentifier(identifier) {
  if (PG_DISABLED) {
    return null; // ← explicit, intentional, neutral
  }

  const res = await pool.query(
    "SELECT first_seen FROM identifiers WHERE identifier = $1 LIMIT 1",
    [identifier]
  );

  return res.rows[0] || null;
}

/**
 * Record first seen timestamp
 */
async function recordFirstSeen(identifier) {
  if (PG_DISABLED) {
    return; // ← no-op
  }

  await pool.query(
    `
    INSERT INTO identifiers (identifier, first_seen)
    VALUES ($1, NOW())
    ON CONFLICT (identifier) DO NOTHING
    `,
    [identifier]
  );
}

module.exports = {
  lookupIdentifier,
  recordFirstSeen
};

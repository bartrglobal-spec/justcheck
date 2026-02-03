const { Pool } = require("pg");

/**
 * Single, explicit Postgres pool
 * This file is the ONLY place that knows about pg
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL
    ? { rejectUnauthorized: false }
    : false,
});

/**
 * Guaranteed query interface
 */
module.exports = {
  query: (text, params) => pool.query(text, params),
};

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

/**
 * Database connection pool
 * Uses DATABASE_URL provided by Render
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false,
});

/**
 * Initialize database schema on startup
 * This runs exactly once per deploy
 */
async function initDatabase() {
  const client = await pool.connect();

  try {
    const schemaPath = path.join(
      __dirname,
      '..',
      'database',
      '001_initial_schema.sql'
    );

    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    await client.query(schemaSql);
    console.log('Database schema initialized');
  } finally {
    client.release();
  }
}

module.exports = {
  pool,
  initDatabase,
};

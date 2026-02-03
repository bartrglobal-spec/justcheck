const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

let client;

/**
 * Initialize database connection and schema
 */
async function initDb() {
  if (client) return client;

  client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();

    const schemaPath = path.join(
      __dirname,
      'database',
      '001_initial_schema.sql'
    );

    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    await client.query(schemaSql);

    console.log('[db] Database connected and schema initialized');
    return client;
  } catch (err) {
    console.error('[db] Database initialization failed');
    console.error(err);
    process.exit(1);
  }
}

/**
 * Get active database client
 */
function getDb() {
  if (!client) {
    throw new Error('Database not initialized');
  }
  return client;
}

module.exports = {
  initDb,
  getDb,
};

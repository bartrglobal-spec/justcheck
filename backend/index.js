const express = require('express');
const bodyParser = require('body-parser');

const { initDatabase } = require('./db');
const { normalizeIdentifier } = require('./utils');

const app = express();
app.use(bodyParser.json());

/**
 * Health check (required by Render)
 */
app.get('/', (req, res) => {
  res.status(200).send('OK');
});

/**
 * POST /checks
 * Creates a new check entry
 */
app.post('/checks', async (req, res) => {
  try {
    const { identifier, identifier_type } = req.body;

    if (!identifier || !identifier_type) {
      return res.status(400).json({ error: 'Missing identifier or identifier_type' });
    }

    const normalized = normalizeIdentifier(identifier, identifier_type);

    const result = await global.db.query(
      `INSERT INTO checks (identifier, identifier_type)
       VALUES ($1, $2)
       RETURNING id`,
      [normalized, identifier_type]
    );

    res.json({ id: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * GET /checks
 * Lookup existing checks
 */
app.get('/checks', async (req, res) => {
  try {
    const { identifier, identifier_type } = req.query;

    if (!identifier || !identifier_type) {
      return res.status(400).json({ error: 'Missing identifier or identifier_type' });
    }

    const normalized = normalizeIdentifier(identifier, identifier_type);

    const result = await global.db.query(
      `SELECT
         identifier,
         identifier_type,
         COUNT(*) AS count,
         MIN(created_at) AS first_seen
       FROM checks
       WHERE identifier = $1 AND identifier_type = $2
       GROUP BY identifier, identifier_type`,
      [normalized, identifier_type]
    );

    if (result.rows.length === 0) {
      return res.json({
        identifier: normalized,
        identifier_type,
        count: 0,
        first_seen: null
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * Bootstrap server
 */
async function start() {
  await initDatabase();

  const PORT = process.env.PORT || 10000;
  app.listen(PORT);
}

start();

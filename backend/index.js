const express = require('express');
const bodyParser = require('body-parser');

console.log('[BOOT] Starting JustCheck backend…');

const { initDatabase } = require('./db');
const { normalizeIdentifier } = require('./utils');

console.log('[BOOT] Imports loaded');

const app = express();
app.use(bodyParser.json());

app.get('/', (_req, res) => {
  res.status(200).send('OK');
});

console.log('[BOOT] Express initialized');

/**
 * POST /checks
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
    console.error('[POST /checks ERROR]', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * GET /checks
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
         COUNT(*) as count,
         MIN(created_at) as first_seen
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
    console.error('[GET /checks ERROR]', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * Bootstrap
 */
async function start() {
  try {
    console.log('[BOOT] Initializing database…');
    await initDatabase();
    console.log('[BOOT] Database ready');

    const PORT = process.env.PORT;
    console.log('[BOOT] Starting server on port', PORT);

    app.listen(PORT, () => {
      console.log('[BOOT] Server listening on port', PORT);
    });
  } catch (err) {
    console.error('[BOOT FATAL]', err);
    process.exit(1);
  }
}

start();

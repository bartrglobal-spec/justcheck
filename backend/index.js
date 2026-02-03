const express = require('express');
const cors = require('cors');
const { initDatabase, pool } = require('./db');

const app = express();

/**
 * Middleware
 */
app.use(cors());
app.use(express.json());

/**
 * Health check
 */
app.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

/**
 * READ-ONLY: lookup checks by identifier
 */
app.get('/checks', async (req, res) => {
  const { identifier, identifier_type } = req.query;

  if (!identifier || !identifier_type) {
    return res.status(400).json({
      error: 'identifier and identifier_type are required',
    });
  }

  try {
    const result = await pool.query(
      `
      SELECT
        COUNT(*)::int AS count,
        MIN(created_at) AS first_seen
      FROM checks
      WHERE identifier = $1
        AND identifier_type = $2
      `,
      [identifier, identifier_type]
    );

    res.json({
      identifier,
      identifier_type,
      count: result.rows[0].count,
      first_seen: result.rows[0].first_seen,
    });
  } catch (err) {
    console.error('Failed to lookup checks:', err);
    res.status(500).json({ error: 'internal_error' });
  }
});

/**
 * WRITE: create a check (unchanged)
 */
app.post('/checks', async (req, res) => {
  const { identifier, identifier_type } = req.body;

  if (!identifier || !identifier_type) {
    return res.status(400).json({
      error: 'identifier and identifier_type are required',
    });
  }

  try {
    const result = await pool.query(
      `
      INSERT INTO checks (identifier, identifier_type)
      VALUES ($1, $2)
      RETURNING id
      `,
      [identifier, identifier_type]
    );

    res.status(201).json({
      id: result.rows[0].id,
    });
  } catch (err) {
    console.error('Failed to create check:', err);
    res.status(500).json({ error: 'internal_error' });
  }
});

/**
 * Start server only after DB is ready
 */
async function start() {
  try {
    await initDatabase();

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Backend listening on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start backend:', err);
    process.exit(1);
  }
}

start();

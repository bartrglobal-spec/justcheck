const express = require('express');
const { initDb, getDb } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Allow JSON bodies
app.use(express.json());

/**
 * Health check
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

/**
 * Create a new check
 * Minimal version: saves only the check event
 */
app.post('/check', async (req, res) => {
  const { query_input, amount_cents, currency } = req.body;

  // Basic validation (nothing fancy)
  if (!query_input || !amount_cents || !currency) {
    return res.status(400).json({
      error: 'Missing required fields',
    });
  }

  try {
    const db = getDb();

    const result = await db.query(
      `
      INSERT INTO checks (query_input, amount_cents, currency, risk_band)
      VALUES ($1, $2, $3, $4)
      RETURNING id
      `,
      [query_input, amount_cents, currency, 'Amber']
    );

    res.status(201).json({
      check_id: result.rows[0].id,
    });
  } catch (err) {
    console.error('[check] Failed to create check', err);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

/**
 * Start server only after DB is ready
 */
async function start() {
  await initDb();

  app.listen(PORT, () => {
    console.log(`[server] Listening on port ${PORT}`);
  });
}

start();

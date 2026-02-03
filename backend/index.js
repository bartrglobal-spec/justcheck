const express = require('express');
const cors = require('cors');
const { initDatabase } = require('./db');

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

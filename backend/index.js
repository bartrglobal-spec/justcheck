// backend/index.js

const express = require("express");
const bodyParser = require("body-parser");

const { initDatabase, pool } = require("./db");
const { normalizeIdentifier } = require("./utils/identifierNormalization");
const { deriveSignal } = require("./brain/signalEngine");

const app = express();
app.use(bodyParser.json());

async function start() {
  try {
    await initDatabase();
    console.log("Database initialized");
  } catch (err) {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  }

  /**
   * Create a new check (POST)
   */
  app.post("/checks", async (req, res) => {
    const { identifier, identifier_type } = req.body;

    if (!identifier || !identifier_type) {
      return res.status(400).json({ error: "Missing identifier or identifier_type" });
    }

    const normalized = normalizeIdentifier(identifier, identifier_type);

    const result = await pool.query(
      `INSERT INTO checks (identifier, identifier_type)
       VALUES ($1, $2)
       RETURNING id`,
      [normalized, identifier_type]
    );

    res.json({ id: result.rows[0].id });
  });

  /**
   * Fetch check stats + signal (GET)
   */
  app.get("/checks", async (req, res) => {
    const { identifier, identifier_type } = req.query;

    if (!identifier || !identifier_type) {
      return res.status(400).json({ error: "Missing identifier or identifier_type" });
    }

    const normalized = normalizeIdentifier(identifier, identifier_type);

    const result = await pool.query(
      `
      SELECT
        identifier,
        identifier_type,
        COUNT(*)::int AS count,
        MIN(created_at) AS first_seen
      FROM checks
      WHERE identifier = $1 AND identifier_type = $2
      GROUP BY identifier, identifier_type
      `,
      [normalized, identifier_type]
    );

    if (result.rows.length === 0) {
      const signal = deriveSignal({ count: 0 });

      return res.json({
        identifier: normalized,
        identifier_type,
        count: 0,
        signal
      });
    }

    const row = result.rows[0];
    const signal = deriveSignal({
      count: row.count,
      first_seen: row.first_seen
    });

    res.json({
      identifier: row.identifier,
      identifier_type: row.identifier_type,
      count: row.count,
      first_seen: row.first_seen,
      signal
    });
  });

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`JustCheck backend listening on port ${port}`);
  });
}

start();

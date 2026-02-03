const express = require("express");
const bodyParser = require("body-parser");

const normalizeIdentifier = require("./utils");
const db = require("./db");

const app = express();
app.use(bodyParser.json());

/**
 * Fingerprint / Health check
 */
app.get("/", (req, res) => {
  res.status(200).send("JUSTCHECK BACKEND v1.0 — RENDER CONFIRMED");
});

/**
 * Core check endpoint
 */
app.get("/checks", async (req, res) => {
  try {
    const { identifier, identifier_type } = req.query;

    if (!identifier || !identifier_type) {
      return res.status(400).json({
        error: "Missing identifier or identifier_type",
      });
    }

    const normalized = normalizeIdentifier(identifier, identifier_type);

    const result = await db.query(
      `
      SELECT
        COUNT(*)::int AS count,
        MIN(created_at) AS first_seen
      FROM checks
      WHERE identifier = $1
        AND identifier_type = $2
      `,
      [normalized, identifier_type]
    );

    res.json({
      identifier: normalized,
      identifier_type,
      count: result.rows[0].count,
      first_seen: result.rows[0].first_seen,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
      stack: err.stack,
    });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`[BOOT] Server listening on port ${PORT}`);
});

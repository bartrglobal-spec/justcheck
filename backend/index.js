const express = require("express");
const bodyParser = require("body-parser");

const normalizeIdentifier = require("./utils");
const db = require("./db");
const classifyConfidence = require("./confidence");

const app = express();
app.use(bodyParser.json());

/**
 * Health check
 */
app.get("/", (req, res) => {
  res.status(200).send("OK");
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

    const count = result.rows[0].count;
    const firstSeen = result.rows[0].first_seen;

    const confidence = classifyConfidence({
      count,
      firstSeen,
    });

    res.json({
      identifier: normalized,
      identifier_type,
      total_checks: count,
      first_seen: firstSeen,
      confidence,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`[BOOT] Server listening on port ${PORT}`);
});

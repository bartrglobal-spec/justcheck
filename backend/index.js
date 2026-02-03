const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const normalizeIdentifier = require("./utils");
const db = require("./db");
const deriveConfidence = require("./brain");

const app = express();

/**
 * CORS — allow browser-based frontend
 */
app.use(
  cors({
    origin: "*",
    methods: ["GET"],
  })
);

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
        COUNT(*)::int AS total_checks,
        MIN(created_at) AS first_seen
      FROM checks
      WHERE identifier = $1
        AND identifier_type = $2
      `,
      [normalized, identifier_type]
    );

    const confidence = deriveConfidence({
      count: result.rows[0].total_checks,
      firstSeen: result.rows[0].first_seen,
    });

    res.json({
      identifier: normalized,
      identifier_type,
      total_checks: result.rows[0].total_checks,
      first_seen: result.rows[0].first_seen,
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

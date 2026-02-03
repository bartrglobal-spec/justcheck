const express = require("express");
const bodyParser = require("body-parser");

const db = require("./db");

const app = express();
app.use(bodyParser.json());

/**
 * Health check / fingerprint
 */
app.get("/", (req, res) => {
  res.status(200).send("JUSTCHECK BACKEND v1.1 — DB SANITY CHECK");
});

/**
 * Database sanity endpoint (READ-ONLY)
 */
app.get("/db-check", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        COUNT(*)::int AS total_checks,
        MIN(created_at) AS first_seen,
        MAX(created_at) AS last_seen
      FROM checks
    `);

    res.json({
      status: "ok",
      total_checks: result.rows[0].total_checks,
      first_seen: result.rows[0].first_seen,
      last_seen: result.rows[0].last_seen,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      error: err.message,
    });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`[BOOT] Server listening on port ${PORT}`);
});

const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const { runBrain } = require("./brain");
const { guardInput } = require("./brain/guard/index");

const app = express();

// 🔐 Environment awareness
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";
const DATABASE_URL = process.env.DATABASE_URL;

// ---- DATABASE CONNECTION (READ-ONLY TEST) ----
let dbReady = false;

if (DATABASE_URL) {
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  pool
    .query("SELECT 1")
    .then(() => {
      dbReady = true;
      console.log("✅ Database connection test passed");
    })
    .catch((err) => {
      console.error("❌ Database connection test failed");
      console.error(err.message);
    });
} else {
  console.log("⚠️ DATABASE_URL not set");
}
// --------------------------------------------

app.use(bodyParser.json());

app.post("/check", (req, res) => {
  const guard = guardInput(req.body);

  if (!guard.allowed) {
    return res.json({
      signal: {
        level: "green",
        summary: "Low Risk Indicators"
      },
      indicators: [],
      meta: {
        brain_version: "v1",
        guard: guard.reason
      }
    });
  }

  const result = runBrain(req.body);

  return res.json({
    signal: result.signal,
    indicators: result.indicators,
    meta: {
      brain_version: "v1"
    }
  });
});

app.get("/", (req, res) => {
  res.send("JustCheck backend running");
});

app.listen(PORT, () => {
  console.log("🔥🔥🔥 NEW BRAIN FILE LOADED 🔥🔥🔥");
  console.log(`Environment: ${NODE_ENV}`);
  console.log(`JustCheck backend running on port ${PORT}`);
});

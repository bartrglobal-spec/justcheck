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

// ---- DATABASE INIT ----
let pool = null;

async function initDB() {
  if (!DATABASE_URL) {
    console.log("⚠️ DATABASE_URL not set — running without DB");
    return;
  }

  pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  await pool.query("SELECT 1");
  console.log("✅ Database connection test passed");
}
// -----------------------

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

// ---- CONTROLLED STARTUP ----
async function startServer() {
  try {
    await initDB();

    app.listen(PORT, () => {
      console.log("🔥🔥🔥 NEW BRAIN FILE LOADED 🔥🔥🔥");
      console.log(`Environment: ${NODE_ENV}`);
      console.log(`JustCheck backend running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server");
    console.error(err.message);
    process.exit(1);
  }
}

startServer();
// ----------------------------

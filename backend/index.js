require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const { runBrain } = require("./brain");
const { guardInput } = require("./brain/guard");

const app = express();

/* 🔥 STEP 20.2 — GLOBAL ERROR HARDENING */
process.on("uncaughtException", (err) => {
  console.error("🔥 Uncaught Exception:", err.message);
});

process.on("unhandledRejection", (reason) => {
  console.error("🔥 Unhandled Rejection:", reason);
});

app.use(bodyParser.json());

// 🔒 STATIC FRONTEND
app.use(
  express.static(
    path.join(__dirname, "..", "frontend", "public")
  )
);

// 🔒 PORT
const PORT = process.env.PORT || 10000;

/* 🔒 STEP 20.5 — BASIC RATE LIMITING (IN-MEMORY) */
const rateMap = new Map();
const RATE_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT = 60;           // 60 checks per IP per minute

function isRateLimited(ip) {
  const now = Date.now();

  if (!rateMap.has(ip)) {
    rateMap.set(ip, []);
  }

  const timestamps = rateMap
    .get(ip)
    .filter(ts => now - ts < RATE_WINDOW_MS);

  timestamps.push(now);
  rateMap.set(ip, timestamps);

  return timestamps.length > RATE_LIMIT;
}

// 🔒 CHECK ENDPOINT (SAFE FALLBACK + RATE LIMIT)
app.get("/check", async (req, res) => {
  const identifier = req.query.identifier || null;
  const identifier_type = req.query.identifier_type || null;
  const ip = req.ip || "unknown";

  // 🔒 RATE LIMIT DEGRADATION
  if (isRateLimited(ip)) {
    return res.json({
      identifier,
      identifier_type,
      confidence: "MEDIUM",
      risk_color: "Amber",
      headline: "Some risk indicators were detected at the time of this check.",
      indicators: [],
      system_notes: [
        "This check was rate-limited due to high request volume.",
        "Results were generated using conservative system safeguards."
      ],
      meta: {
        total_checks: 0,
        first_seen: null,
        generated_at: new Date().toISOString()
      }
    });
  }

  try {
    const guarded = guardInput({
      identifier,
      identifier_type
    });

    const result = await runBrain(guarded);

    res.set("X-JustCheck-Contract", "report:v1.0.0");
    return res.json(result);

  } catch (err) {
    console.error("⚠️ SAFE FALLBACK TRIGGERED:", err.message);

    return res.json({
      identifier,
      identifier_type,
      confidence: "MEDIUM",
      risk_color: "Amber",
      headline: "Some risk indicators were detected at the time of this check.",
      indicators: [],
      system_notes: [
        "Some data sources were temporarily unavailable at the time of this check.",
        "This check was completed using conservative system safeguards."
      ],
      meta: {
        total_checks: 0,
        first_seen: null,
        generated_at: new Date().toISOString()
      }
    });
  }
});

// 🔒 CONTRACT ROUTES
app.get("/contract/report", (req, res) => {
  res.sendFile(path.join(__dirname, "contract", "reportContract.json"));
});

app.get("/contract/report/v1", (req, res) => {
  res.sendFile(
    path.join(__dirname, "contract", "versions", "reportContract.v1.json")
  );
});

// 🔒 BOOT
app.listen(PORT, () => {
  console.log(`[BOOT] Server listening on port ${PORT}`);
});

require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const { guardRun } = require("./brain/guard");
const { formatPaidReport } = require("./brain/formatPaidReport"); // ✅ ADD
const { initPayment, confirmPayment } = require("./payments/mock");

const app = express();

/* 🔥 GLOBAL ERROR HARDENING */
process.on("uncaughtException", (err) => {
  console.error("🔥 Uncaught Exception:", err.message);
});

process.on("unhandledRejection", (reason) => {
  console.error("🔥 Unhandled Rejection:", reason);
});

app.use(bodyParser.json());

/* 🔒 STATIC FRONTEND */
app.use(
  express.static(
    path.join(__dirname, "..", "frontend", "public")
  )
);

/* 🔒 PORT */
const PORT = process.env.PORT || 10000;

/* 🔒 BASIC RATE LIMITING (IN-MEMORY) */
const rateMap = new Map();
const RATE_WINDOW_MS = 60 * 1000;
const RATE_LIMIT = 60;

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

/* ✅ FREE CHECK */
app.post("/check", async (req, res) => {
  const { identifier, identifier_type } = req.body || {};
  const ip = req.ip || "unknown";

  const safeFallbackReport = {
    confidence: "MEDIUM",
    risk_color: "Amber",
    headline: "Some risk indicators were detected at the time of this check.",
    indicators: []
  };

  if (isRateLimited(ip)) {
    return res.json({ report: safeFallbackReport });
  }

  try {
    const result = await guardRun(
      { identifier, identifier_type },
      { paid: false }
    );

    res.set("X-JustCheck-Contract", "report:v1.0.0");

    return res.json({ report: result });

  } catch (err) {
    console.error("⚠️ SAFE FALLBACK:", err.message);
    return res.json({ report: safeFallbackReport });
  }
});

/* 💳 PAYMENT INIT (MOCK) */
app.post("/pay/init", (req, res) => {
  try {
    const { identifier, identifier_type } = req.body || {};

    const payment = initPayment({
      identifier,
      identifier_type
    });

    return res.json(payment);

  } catch (err) {
    console.error("💥 PAYMENT INIT ERROR:", err.message);
    return res.status(400).json({
      error: "Unable to initiate payment"
    });
  }
});

/* 💳 PAYMENT CONFIRM — PAID REPORT */
app.get("/pay/confirm", async (req, res) => {
  try {
    const { ref, identifier, identifier_type } = req.query;

    const confirmation = confirmPayment(ref);

    const freeStyleReport = await guardRun(
      { identifier, identifier_type },
      { paid: true }
    );

    // ✅ PAID EXPANSION HAPPENS HERE
    const paidReport = formatPaidReport(freeStyleReport);

    return res.json({
      payment: confirmation,
      report: paidReport
    });

  } catch (err) {
    console.error("💥 PAYMENT CONFIRM ERROR:", err.message);
    return res.status(400).json({
      error: "Payment confirmation failed"
    });
  }
});

/* 🔒 CONTRACT ROUTES */
app.get("/contract/report", (req, res) => {
  res.sendFile(path.join(__dirname, "contract", "reportContract.json"));
});

app.get("/contract/report/v1", (req, res) => {
  res.sendFile(
    path.join(__dirname, "contract", "versions", "reportContract.v1.json")
  );
});

/* 🔒 BOOT */
app.listen(PORT, () => {
  console.log(`[BOOT] Server listening on port ${PORT}`);
});

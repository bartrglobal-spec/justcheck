const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * Middleware
 */
app.use(express.json());

// HARD-LOCKED CORS (JustCheck principle: browser-safe, platform-agnostic)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

/**
 * Root health check
 */
app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "justcheck-backend"
  });
});

/**
 * LOCKED /check API CONTRACT
 * Pre-payment signal only — no judgment
 */
app.post("/check", (req, res) => {
  const { input_type, input_value } = req.body;

  // Contract validation
  if (!input_type || !input_value) {
    return res.status(400).json({
      error: {
        code: "INVALID_REQUEST",
        message: "input_type and input_value are required"
      }
    });
  }

  // Stubbed signal response (brain placeholder)
  return res.status(200).json({
    signal: {
      level: "green",
      confidence_score: 0.15,
      summary: "Limited signals available at this time."
    },
    indicators: {
      positive: [],
      neutral: [],
      negative: []
    },
    meta: {
      version: "v1",
      checked_at: new Date().toISOString(),
      input_type: input_type
    }
  });
});

/**
 * Start server
 */
app.listen(PORT, () => {
  console.log(`JustCheck backend listening on port ${PORT}`);
});

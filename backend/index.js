const express = require("express");
const bodyParser = require("body-parser");

const { runBrain } = require("./brain");
const { guardInput } = require("./brain/guard/index");

const app = express();

// 🔐 Environment awareness (no logic branching)
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

app.use(bodyParser.json());

/**
 * POST /check
 * Entry point for JustCheck
 */
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

/**
 * Health check
 */
app.get("/", (req, res) => {
  res.send("JustCheck backend running");
});

app.listen(PORT, () => {
  console.log("🔥🔥🔥 NEW BRAIN FILE LOADED 🔥🔥🔥");
  console.log(`Environment: ${NODE_ENV}`);
  console.log(`JustCheck backend running on port ${PORT}`);
});

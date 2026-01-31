const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

/**
 * HARD CORS HEADERS — FORCE ON EVERY REQUEST
 */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight immediately
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

/**
 * Middleware
 */
app.use(express.json());

/**
 * Root health check
 */
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "justcheck-backend",
  });
});

/**
 * Health endpoint
 */
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

/**
 * Render PORT
 */
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

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
 * Explicit health endpoint
 */
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

/**
 * Render injects PORT
 * Local fallback = 3000
 */
const PORT = process.env.PORT || 3000;

/**
 * IMPORTANT:
 * Bind to 0.0.0.0 or Render will kill the process
 */
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

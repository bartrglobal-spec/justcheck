const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

/**
 * STEP 1: CORS — MUST BE FIRST
 * Explicitly allow Cloudflare Pages frontend
 */
app.use(
  cors({
    origin: "https://justcheck.pages.dev",
    methods: ["GET", "POST", "OPTIONS"],
  })
);

/**
 * STEP 2: Body parsing middleware
 */
app.use(express.json());

/**
 * STEP 3: Root health check
 */
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "justcheck-backend",
  });
});

/**
 * STEP 4: Explicit health endpoint
 */
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

/**
 * STEP 5: Start server
 * Render injects PORT
 * Bind to 0.0.0.0 or Render will kill the process
 */
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

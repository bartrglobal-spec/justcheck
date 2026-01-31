const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

/**
 * CORS — explicit and early
 */
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

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
 * Render PORT
 */
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

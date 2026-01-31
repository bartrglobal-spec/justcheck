const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

/**
 * STEP 1: FORCE CORS HEADERS (NO LIBRARIES)
 * This runs on EVERY request
 */
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://justcheck.pages.dev"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  // Handle preflight explicitly
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

/**
 * STEP 2: JSON parsing
 */
app.use(express.json());

/**
 * STEP 3: Root endpoint
 */
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "justcheck-backend",
  });
});

/**
 * STEP 4: Health endpoint
 */
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

/**
 * STEP 5: Start server
 */
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

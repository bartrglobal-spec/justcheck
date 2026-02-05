require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const { runBrain } = require("./brain");
const { guardInput } = require("./brain/guard");

const app = express();

app.use(bodyParser.json());

// 🔒 STATIC FRONTEND
app.use(express.static(
  path.join(__dirname, "..", "frontend", "public")
));

// 🔒 PORT
const PORT = process.env.PORT || 10000;

// 🔒 CHECK ENDPOINT
app.get("/check", async (req, res) => {
  try {
    const guarded = guardInput({
      identifier: req.query.identifier,
      identifier_type: req.query.identifier_type
    });

    const result = await runBrain(guarded);
    res.set("X-JustCheck-Contract", "report:v1.0.0");
    res.json(result);
  } catch (err) {
    res.status(400).json({
      error: "Invalid request",
      message: err.message
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

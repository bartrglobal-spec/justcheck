import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import FirecrawlApp from "firecrawl";

import runBrain from "./brain/runBrain.js";
import runPaidBrain from "./brain/runPaidBrain.js";
import formatPaidReport from "./brain/formatPaidReport.js";
import payRoutes from "./routes/pay.js";

dotenv.config();

console.log("Firecrawl key loaded:", process.env.FIRECRAWL_API_KEY ? "YES" : "NO");

const firecrawl = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

/**
 * SERVE FRONTEND
 */
app.use(express.static(path.join(__dirname, "public")));

/**
 * PAYMENT ROUTES
 */
app.use("/pay", payRoutes);

/**
 * PREVIEW CHECK
 */
app.post("/check", async (req, res) => {
  try {

    const { identifier, identifier_type } = req.body;

    if (!identifier) {
      return res.status(400).json({ error: "Identifier required" });
    }

    const brainResult = await runBrain({
      identifier,
      identifier_type,
      paid: false
    });

    return res.json(brainResult);

  } catch (err) {

    console.error("CHECK ERROR:", err);
    return res.status(500).json({ error: "Internal server error" });

  }
});

/**
 * PAID REPORT
 */
app.get("/report", async (req, res) => {
  try {

    const { identifier, identifier_type } = req.query;

    if (!identifier) {
      return res.status(400).json({ error: "Identifier required" });
    }

    const brainResult = await runPaidBrain({
      identifier,
      identifier_type,
      paid: true
    });

    const report = formatPaidReport(brainResult);

    return res.json(report);

  } catch (err) {

    console.error("REPORT ERROR:", err);
    return res.status(500).json({ error: "Internal server error" });

  }
});

/**
 * FIRECRAWL TEST
 */
app.get("/firecrawl-test", async (req, res) => {

  try {

    console.log("🔥 Firecrawl test starting");

    const result = await firecrawl.scrape("https://example.com", {
      formats: ["markdown"]
    });

    console.log("🔥 Firecrawl success");

    res.json({
      success: true,
      scraped_length: result?.markdown?.length || 0
    });

  } catch (err) {

    console.error("🔥 Firecrawl error:", err.message);

    res.status(500).json({
      success: false,
      error: err.message
    });

  }

});

app.listen(PORT, () => {
  console.log(`JustCheckIt running on port ${PORT}`);
});
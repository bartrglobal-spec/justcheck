import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { guardInput } from "./brain/guard/index.js";
import runPaidBrain from "./brain/runPaidBrain.js";
import { formatPaidReport } from "./brain/formatPaidReport.js";

dotenv.config();

const app = express();
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* FREE PREVIEW */
app.post("/check", (req, res) => {
  res.json({
    ok: true,
    report: {
      confidence: { level: "medium", score: 50 }
    }
  });
});

/* PAID REPORT */
app.get("/report", async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: "MISSING_TOKEN" });
    }

    // ⚠️ Token validation comes later — for now we trust it
    const brainResult = await runPaidBrain({
      identifier: "paid_user",
      identifier_type: "unknown"
    });

    const report = formatPaidReport(brainResult);
    res.json(report);

  } catch (err) {
    console.error("REPORT ERROR:", err);
    res.status(500).json({
      confidence: { level: "medium", score: 50 },
      indicators: [],
      system_notes: ["Fallback report used"]
    });
  }
});

/* PAYPAL TOKEN */
async function getPayPalAccessToken() {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch(
    `${process.env.PAYPAL_BASE_URL}/v1/oauth2/token`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: "grant_type=client_credentials"
    }
  );

  const data = await res.json();
  return data.access_token;
}

/* CREATE PAYPAL ORDER */
app.post("/pay/create", async (req, res) => {
  const token = await getPayPalAccessToken();
  const baseUrl = process.env.APP_BASE_URL || "http://localhost:3000";

  const response = await fetch(
    `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          { amount: { currency_code: "USD", value: "1.49" } }
        ],
        application_context: {
          return_url: `${baseUrl}/?paid=1&token=ok`,
          cancel_url: `${baseUrl}/`
        }
      })
    }
  );

  const order = await response.json();
  res.json(order);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

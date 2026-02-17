import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Brain imports
import { guardInput } from "./brain/guard/index.js";
import runPaidBrain from "./brain/runPaidBrain.js";
import { formatPaidReport } from "./brain/formatPaidReport.js";

dotenv.config();

const app = express();
app.use(express.json());

/* =========================
   STATIC FRONTEND
========================= */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* =========================
   PREVIEW CHECK (FREE)
========================= */
app.post("/check", (req, res) => {
  const { identifier } = req.body;

  if (!identifier) {
    return res.status(400).json({
      ok: false,
      error: "MISSING_IDENTIFIER"
    });
  }

  return res.json({
    ok: true,
    report: {
      confidence: "Moderate"
    }
  });
});

/* =========================
   PAID CHECK ENDPOINT
========================= */
app.post("/check/paid", async (req, res) => {
  try {
    // 1. Guard input
    const guard = guardInput(req.body);

    if (!guard.allowed) {
      return res.json({
        ok: false,
        reason: guard.reason
      });
    }

    // 2. Run paid brain
    const brainResult = await runPaidBrain({
      identifier: guard.identifier,
      identifier_type: guard.identifier_type
    });

    // 3. Format paid report
    const report = formatPaidReport(brainResult);

    // 4. Return to frontend
    return res.json({
      ok: true,
      report
    });

  } catch (err) {
    console.error("PAID CHECK ERROR:", err);
    return res.status(500).json({
      ok: false,
      error: "INTERNAL_ERROR"
    });
  }
});

/* =========================
   PAYPAL TOKEN
========================= */
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

/* =========================
   CREATE PAYPAL ORDER
========================= */
app.post("/pay/create", async (req, res) => {
  try {
    const token = await getPayPalAccessToken();

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
            {
              amount: {
                currency_code: "USD",
                value: "1.49"
              }
            }
          ],
          application_context: {
            return_url: "http://localhost:3000/?paid=1",
            cancel_url: "http://localhost:3000/?cancel=1"
          }
        })
      }
    );

    const order = await response.json();
    res.json(order);

  } catch (err) {
    console.error("PAYPAL ERROR:", err);
    res.status(500).json({ error: "PayPal failed" });
  }
});

/* =========================
   SERVER
========================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

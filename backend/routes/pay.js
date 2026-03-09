/**
 * PayPal Payment Routes (Sandbox)
 */

import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const PAYPAL_BASE = process.env.PAYPAL_BASE_URL;
const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

/**
 * Get PayPal Access Token
 */
async function getAccessToken() {
  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

  const response = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
  });

  if (!response.ok) {
    const txt = await response.text();
    console.error("PayPal token error:", txt);
    throw new Error("PayPal token request failed");
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * CREATE PAYMENT
 */
router.post("/create", async (req, res) => {
  try {
    const { identifier } = req.body;

    if (!identifier) {
      return res.status(400).json({ error: "Missing identifier" });
    }

    const accessToken = await getAccessToken();

    const orderResponse = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: "1.49"
            },
            description: `JustCheckIt report for ${identifier}`
          }
        ],
        application_context: {
          return_url: `${process.env.BASE_URL}/?paid=1&identifier=${encodeURIComponent(identifier)}`,
          cancel_url: `${process.env.BASE_URL}`
        }
      })
    });

    const orderData = await orderResponse.json();

    if (!orderResponse.ok) {
      console.error("PayPal order error:", orderData);
      return res.status(500).json({ error: "Failed to create order" });
    }

    res.json(orderData);

  } catch (err) {
    console.error("PAY CREATE ERROR:", err);
    res.status(500).json({ error: "Internal payment error" });
  }
});

export default router;
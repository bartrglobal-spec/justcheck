const express = require("express");
const router = express.Router();
const mockStore = require("../payments/mockStore");

// INIT PAYMENT
router.post("/init", (req, res) => {
  const { check_id } = req.body;

  if (!check_id) {
    return res.status(400).json({ error: "Missing check_id" });
  }

  const reference = mockStore.create({ check_id });

  res.json({
    payment: {
      ref: reference
    },
    payment_url: `/mock-pay?ref=${reference}`
  });
});

// CONFIRM PAYMENT (GET for frontend compatibility)
router.get("/confirm", (req, res) => {
  const { ref, identifier, identifier_type } = req.query;

  if (!ref) {
    return res.status(400).json({ error: "Missing payment reference" });
  }

  const payment = mockStore.markPaid(ref);

  if (!payment) {
    return res.status(400).json({ error: "Payment confirmation failed" });
  }

  // 🔐 MOCK PAID REPORT (SCREEN 5)
  res.json({
    status: "PAID",
    result: "AMBER",
    explanation: [
      "This identifier appears in limited third-party contexts.",
      "No verified fraud reports were found.",
      "Patterns observed require contextual judgement."
    ],
    disclaimer:
      "This report provides informational signals only and does not constitute an accusation or factual claim."
  });
});

module.exports = router;

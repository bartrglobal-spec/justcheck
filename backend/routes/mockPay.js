const express = require("express");
const router = express.Router();
const mockStore = require("../payments/mockStore");

router.get("/", (req, res) => {
  const { ref } = req.query;
  const payment = mockStore.get(ref);

  if (!payment) {
    return res.status(404).send("Invalid payment reference");
  }

  res.send(`
    <html>
      <body style="font-family:system-ui;background:#111;color:#fff;padding:40px">
        <h2>Mock Payment Gateway</h2>
        <p>Check ID: ${payment.check_id}</p>
        <form method="POST" action="/pay/confirm">
          <input type="hidden" name="reference" value="${ref}" />
          <button style="padding:12px 20px;font-size:16px">
            Pay $1.25 (Mock)
          </button>
        </form>
      </body>
    </html>
  `);
});

module.exports = router;

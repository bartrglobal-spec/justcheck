/**
 * Report Route
 * ------------
 * Generates the PAID report after successful payment.
 */

import express from "express";
import { runPaidBrain } from "../brain/runPaidBrain.js";
import formatPaidReport from "../brain/formatPaidReport.js";

const router = express.Router();

/**
 * GET /report
 * Called after PayPal redirect
 */
router.get("/", async (req, res) => {
  try {
    const { token, identifier } = req.query;

    if (!token || !identifier) {
      return res.status(400).json({
        error: "Missing required parameters"
      });
    }

    const input = {
      identifier,
      identifier_type: "unknown"
    };

    const rawReport = await runPaidBrain(input);

    const report = formatPaidReport(rawReport);

    res.json({
      report
    });

  } catch (err) {
    console.error("REPORT ERROR:", err);

    res.status(500).json({
      error: "Report generation failed"
    });
  }
});

export default router;
export default function formatPaidReport(brainResult = {}) {

  const riskLevel =
    brainResult?.confidence?.riskLevel ||
    brainResult?.confidence?.level ||
    "amber";

  const riskScore =
    brainResult?.confidence?.riskScore ??
    brainResult?.confidence?.score ??
    50;

  return {
    identifier: brainResult.identifier,
    identifier_type: brainResult.identifier_type,

    confidence: {
      riskLevel: riskLevel,
      riskScore: riskScore
    },

    indicators: brainResult.indicators || [],
    explanation: brainResult.explanation || "",
    headline: brainResult.headline || "",
    meta: brainResult.meta || {}
  };
}
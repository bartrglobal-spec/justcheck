/**
 * payment_reference_intelligence
 * ------------------------------
 * Evaluates the quality and uniqueness of a payment reference.
 * Weak or generic references increase uncertainty but do NOT imply wrongdoing.
 */

export default {
  id: "payment_reference_intelligence",
  order: 4,

  run(brain = {}) {
    if (brain.identifier_type !== "payment_ref") return null;

    const ref = String(brain.identifier || "").trim();

    if (!ref) return null;

    const upper = ref.toUpperCase();

    // Very short references are weak
    if (ref.length < 6) {
      return {
        level: "amber",
        code: "WEAK_PAYMENT_REFERENCE",
        message:
          "This payment reference is very short and may not uniquely identify a transaction. Short or generic references can increase uncertainty when resolving issues."
      };
    }

    // Common generic patterns
    const genericPatterns = [
      "PAYMENT",
      "TRANSFER",
      "INVOICE",
      "INV",
      "REF",
      "ORDER",
      "TEST",
      "123",
      "000"
    ];

    for (const pattern of genericPatterns) {
      if (upper === pattern || upper.startsWith(pattern)) {
        return {
          level: "amber",
          code: "GENERIC_PAYMENT_REFERENCE",
          message:
            "This payment reference appears generic or reusable. Non-unique references can make transaction verification and dispute resolution more difficult."
        };
      }
    }

    // Low entropy (same character repeated)
    if (/^(.)\1+$/.test(ref)) {
      return {
        level: "amber",
        code: "LOW_ENTROPY_REFERENCE",
        message:
          "This payment reference has very low variation, which may reduce its usefulness as a unique transaction identifier."
      };
    }

    // Otherwise: no issue detected
    return null;
  }
};

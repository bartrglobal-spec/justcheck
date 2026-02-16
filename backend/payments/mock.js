/**
 * MOCK PAYMENT PROVIDER
 * ---------------------
 * Canonical contract:
 * - initPayment()  -> { payment }
 * - confirmPayment() -> { payment }
 * - payment.status: PENDING | PAID
 */

const payments = new Map();

/* =========================
   INIT PAYMENT
========================= */
function initPayment({ identifier, identifier_type }) {
  if (!identifier || !identifier_type) {
    throw new Error("Missing identifier data");
  }

  const ref = `MOCK-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

  const payment = {
    ref,
    provider: "mock",
    status: "PENDING",
    identifier,
    identifier_type,
    createdAt: Date.now()
  };

  payments.set(ref, payment);

  return {
    payment
  };
}

/* =========================
   CONFIRM PAYMENT
========================= */
function confirmPayment(ref) {
  if (!ref || !payments.has(ref)) {
    return null;
  }

  const payment = payments.get(ref);

  payment.status = "PAID";
  payment.confirmedAt = Date.now();

  payments.set(ref, payment);

  return {
    payment
  };
}

module.exports = {
  initPayment,
  confirmPayment
};

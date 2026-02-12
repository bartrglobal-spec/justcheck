/**
 * MOCK PAYMENT PROVIDER
 * ---------------------
 * Purpose:
 * - Allow backend to boot
 * - Simulate payment init + confirm
 * - No external services
 * - No environment variables
 */

const payments = new Map();

function initPayment({ identifier, identifier_type }) {
  if (!identifier || !identifier_type) {
    throw new Error("Missing identifier data");
  }

  const ref = `MOCK-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

  payments.set(ref, {
    ref,
    status: "PENDING",
    identifier,
    identifier_type,
    createdAt: Date.now()
  });

  return {
    payment: {
      ref,
      provider: "mock",
      status: "PENDING"
    }
  };
}

function confirmPayment(ref) {
  if (!ref || !payments.has(ref)) {
    throw new Error("Invalid payment reference");
  }

  const payment = payments.get(ref);
  payment.status = "PAID";
  payment.confirmedAt = Date.now();

  payments.set(ref, payment);

  return {
    ref: payment.ref,
    provider: "mock",
    status: "PAID"
  };
}

module.exports = {
  initPayment,
  confirmPayment
};

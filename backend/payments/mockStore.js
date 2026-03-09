/**
 * Mock payment store (in-memory)
 * DO NOT use in production
 */

const payments = new Map();

function create({ check_id }) {
  const reference =
    "mock_" +
    Date.now() +
    "_" +
    Math.random().toString(36).slice(2);

  payments.set(reference, {
    check_id,
    status: "pending"
  });

  return reference;
}

function markPaid(reference) {
  const p = payments.get(reference);
  if (!p) return false;

  p.status = "paid";
  return p;
}

function get(reference) {
  return payments.get(reference);
}

export default {
  create,
  markPaid,
  get
};
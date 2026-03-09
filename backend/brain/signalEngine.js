const fs = require("fs");
const path = require("path");

const STORE_PATH = path.resolve(__dirname, "publicSignals.json");

// -----------------------------
// Load store
// -----------------------------
function loadStore() {
  if (!fs.existsSync(STORE_PATH)) {
    return {};
  }

  const raw = fs.readFileSync(STORE_PATH);
  return JSON.parse(raw);
}

// -----------------------------
// Save store
// -----------------------------
function saveStore(store) {
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
}

// -----------------------------
// Get + Update Signals
// -----------------------------
function getPublicSignals(identifier) {
  const store = loadStore();

  const now = Date.now();

  if (!store[identifier]) {
    store[identifier] = {
      total_checks: 0,
      first_seen: now,
      last_seen: now,
      history: []
    };
  }

  // Update counters
  store[identifier].total_checks += 1;
  store[identifier].last_seen = now;
  store[identifier].history.push(now);

  // Clean history older than 24h
  const DAY = 24 * 60 * 60 * 1000;
  store[identifier].history = store[identifier].history.filter(
    ts => now - ts <= DAY
  );

  const checks_last_24h = store[identifier].history.length;

  saveStore(store);

  return {
    total_checks: store[identifier].total_checks,
    first_seen: store[identifier].first_seen,
    last_seen: store[identifier].last_seen,
    checks_last_24h
  };
}

module.exports = {
  getPublicSignals
};
/**
 * signalEngine
 * ------------
 * Persistent public signal storage (safe metadata only).
 */

import fs from "fs";
import path from "path";

const STORE_PATH = path.resolve("./brain/persistence/signals.json");

function loadStore() {
  if (!fs.existsSync(STORE_PATH)) {
    fs.mkdirSync(path.dirname(STORE_PATH), { recursive: true });
    fs.writeFileSync(STORE_PATH, JSON.stringify({}), "utf8");
  }

  try {
    return JSON.parse(fs.readFileSync(STORE_PATH, "utf8"));
  } catch {
    return {};
  }
}

function saveStore(store) {
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

export function getPublicSignals(identifier) {
  const store = loadStore();
  const now = new Date().toISOString();

  if (!store[identifier]) {
    store[identifier] = {
      first_seen_at: now,
      last_checked_at: now,

      has_web_presence: false,
      has_business_profile: false,

      warning_mentions_count: 0,
      discussion_mentions_count: 0,

      web_titles: [] // 👈 NEW (titles only)
    };
  } else {
    store[identifier].last_checked_at = now;
  }

  saveStore(store);
  return store[identifier];
}

export function savePublicSignals(identifier, updater) {
  const store = loadStore();
  const now = new Date().toISOString();

  if (!store[identifier]) {
    store[identifier] = {
      first_seen_at: now,
      last_checked_at: now,
      has_web_presence: false,
      has_business_profile: false,
      warning_mentions_count: 0,
      discussion_mentions_count: 0,
      web_titles: []
    };
  }

  updater(store[identifier]);
  store[identifier].last_checked_at = now;

  saveStore(store);
}

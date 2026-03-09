/**
 * signalEngine
 * ------------
 * Persistent public signal storage (safe metadata only).
 */

import fs from "fs";
import path from "path";

const STORE_PATH = path.resolve("./brain/persistence/signals.json");

/* -------------------- STORE LOAD -------------------- */

function loadStore() {

  if (!fs.existsSync(STORE_PATH)) {

    fs.mkdirSync(path.dirname(STORE_PATH), { recursive: true });
    fs.writeFileSync(STORE_PATH, JSON.stringify({}, null, 2), "utf8");

  }

  try {

    const raw = fs.readFileSync(STORE_PATH, "utf8");
    return JSON.parse(raw);

  } catch {

    return {};

  }

}

/* -------------------- STORE SAVE -------------------- */

function saveStore(store) {

  fs.writeFileSync(
    STORE_PATH,
    JSON.stringify(store, null, 2),
    "utf8"
  );

}

/* -------------------- GET SIGNALS -------------------- */

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

      web_titles: []
    };

  } else {

    store[identifier].last_checked_at = now;

  }

  saveStore(store);

  return store[identifier];

}

/* -------------------- UPDATE SIGNALS -------------------- */

export function updatePublicSignals(identifier, externalSignals = {}) {

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

  const entry = store[identifier];

  const {
    discussion_mentions_count = 0,
    warning_mentions_count = 0,
    web_titles = []
  } = externalSignals;

  if (discussion_mentions_count > 0) {

    entry.has_web_presence = true;

    entry.discussion_mentions_count =
      Math.max(entry.discussion_mentions_count, discussion_mentions_count);

  }

  if (warning_mentions_count > 0) {

    entry.warning_mentions_count =
      Math.max(entry.warning_mentions_count, warning_mentions_count);

  }

  if (Array.isArray(web_titles) && web_titles.length > 0) {

    const merged = new Set([
      ...entry.web_titles,
      ...web_titles
    ]);

    entry.web_titles = Array.from(merged).slice(0, 20);

  }

  entry.last_checked_at = now;

  saveStore(store);

}

/* -------------------- SAFE UPDATE HOOK -------------------- */

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
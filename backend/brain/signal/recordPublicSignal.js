/**
 * recordPublicSignal
 * ------------------
 * Safely increments public signal counters.
 * This function is NEVER automatic.
 * It must be called deliberately after human or trusted verification.
 */

import fs from "fs";
import path from "path";

const STORE_PATH = path.resolve("./brain/persistence/signals.json");

function loadStore() {
  if (!fs.existsSync(STORE_PATH)) {
    return {};
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

/**
 * Increment warning-style public mentions
 */
export function recordPublicWarning(identifier) {
  const store = loadStore();
  const now = new Date().toISOString();

  if (!store[identifier]) {
    store[identifier] = {
      first_seen_at: now,
      last_checked_at: now,
      has_web_presence: false,
      has_business_profile: false,
      warning_mentions_count: 1,
      discussion_mentions_count: 0
    };
  } else {
    store[identifier].warning_mentions_count += 1;
    store[identifier].last_checked_at = now;
  }

  saveStore(store);
}

/**
 * Increment neutral discussion mentions
 */
export function recordPublicDiscussion(identifier) {
  const store = loadStore();
  const now = new Date().toISOString();

  if (!store[identifier]) {
    store[identifier] = {
      first_seen_at: now,
      last_checked_at: now,
      has_web_presence: false,
      has_business_profile: false,
      warning_mentions_count: 0,
      discussion_mentions_count: 1
    };
  } else {
    store[identifier].discussion_mentions_count += 1;
    store[identifier].last_checked_at = now;
  }

  saveStore(store);
}


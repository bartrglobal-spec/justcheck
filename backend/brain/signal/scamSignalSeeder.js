/**
 * scamSignalSeeder.js
 * -------------------
 * Extracts scam identifiers from public scam lists
 * and seeds them into the signal system.
 *
 * IMPORTANT:
 * This file does NOT automatically run yet.
 * It will be called later from externalSignals.
 */

console.log("scamSignalSeeder LOADED");

import { addIdentifier } from "../intel/scamMemory.js";

const seeded = new Set();

/* ----------------------------- */
/* SCAM CONTEXT DETECTION        */
/* ----------------------------- */

const SCAM_CONTEXT_TERMS = [
  "scam list",
  "scammer list",
  "scam numbers",
  "scammer numbers",
  "fraud list",
  "known scam numbers",
  "scammer phone numbers",
  "phone scam list"
];

/* ----------------------------- */
/* PHONE EXTRACTION REGEX        */
/* ----------------------------- */

const PHONE_REGEX =
  /(\+?\d[\d\s\-\(\)]{7,}\d)/g;

/* ----------------------------- */
/* NORMALIZE PHONE NUMBER        */
/* ----------------------------- */

function normalizePhone(number) {

  if (!number) return null;

  const digits = number.replace(/\D/g, "");

  // too short
  if (digits.length < 8) return null;

  // too long (filters tracking IDs and garbage)
  if (digits.length > 15) return null;

  // block obvious garbage numbers (1111111111, 999999999 etc)
  if (/^(\d)\1{7,}$/.test(digits)) return null;

  return digits;
}

/* ----------------------------- */
/* SCAM LIST DETECTOR            */
/* ----------------------------- */

function isScamListContext(text) {

  const lower = text.toLowerCase();

  for (const term of SCAM_CONTEXT_TERMS) {
    if (lower.includes(term)) {
      return true;
    }
  }

  return false;
}

/* ----------------------------- */
/* PHONE NUMBER EXTRACTOR        */
/* ----------------------------- */

function extractPhones(text) {

  const matches = text.match(PHONE_REGEX);

  if (!matches) return [];

  const results = [];

  for (const m of matches) {

    const normalized = normalizePhone(m);

    if (normalized) {
      results.push(normalized);
    }

  }

  return results;
}

/* ----------------------------- */
/* SEED SIGNAL                   */
/* ----------------------------- */

function seedSignal(identifier, source) {

  if (!identifier) return;

  if (seeded.has(identifier)) return;

  seeded.add(identifier);

  console.log("SCAM SEED DETECTED:", {
    identifier,
    source
  });

  addIdentifier(identifier);

  /*
  Future integration point:

  signalEngine.addSignal({
      identifier,
      type: "public_scam_list",
      confidence: "medium",
      source
  });

  */

}

/* ----------------------------- */
/* MAIN EXPORT                   */
/* ----------------------------- */

export default function scamSignalSeeder(texts = [], source = "external") {

  if (!Array.isArray(texts)) return;

  for (const text of texts) {

    if (!text || text.length < 30) continue;

    if (!isScamListContext(text)) continue;

    const phones = extractPhones(text);

    if (phones.length < 2) continue;

    console.log("SCAM LIST CONTEXT DETECTED");

    for (const phone of phones) {
      seedSignal(phone, source);
    }

  }

}
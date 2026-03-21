/**
 * scamMemory
 * ----------
 * Very lightweight persistent memory for discovered scam identifiers.
 * Stores numbers discovered by the scamSignalSeeder.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

console.log("scamMemory module LOADED");

/* ------------------------------------------------ */
/* SAFE PATH RESOLUTION (prevents backend/backend)  */
/* ------------------------------------------------ */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const memoryFile = path.join(__dirname, "scam_memory.json");

/* ------------------------------------------------ */

function ensureMemoryFile() {

  if (!fs.existsSync(memoryFile)) {

    fs.writeFileSync(
      memoryFile,
      JSON.stringify(
        { identifiers: [] },
        null,
        2
      )
    );

    console.log("Created scam memory file");

  }

}

function loadMemory() {

  ensureMemoryFile();

  const raw = fs.readFileSync(memoryFile, "utf8");
  const data = JSON.parse(raw);

  return data.identifiers || [];

}

function saveMemory(list) {

  fs.writeFileSync(
    memoryFile,
    JSON.stringify(
      { identifiers: list },
      null,
      2
    )
  );

}

export function addIdentifier(identifier) {

  const memory = loadMemory();

  if (!memory.includes(identifier)) {

    memory.push(identifier);

    saveMemory(memory);

    console.log("SCAM MEMORY STORED:", identifier);

  }

}

export function isKnownScam(identifier) {

  const memory = loadMemory();

  return memory.includes(identifier);

}
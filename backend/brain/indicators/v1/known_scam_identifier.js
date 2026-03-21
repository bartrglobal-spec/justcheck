/**
 * known_scam_identifier
 * ---------------------
 * Checks whether the identifier already exists
 * inside the persistent scam memory.
 */

import { isKnownScam } from "../../intel/scamMemory.js";

export default function known_scam_identifier(input, context) {

  const identifier = input.identifier;

  if (!identifier) return null;

  const normalized = identifier.replace(/\D/g, "");

  if (!normalized) return null;

  const known = isKnownScam(normalized);

  if (!known) return null;

  return {
    id: "known_scam_identifier",
    level: "red",
    title: "Known Scam Identifier",
    message: "This identifier appears in previously detected scam reports.",
    confidence: 0.9
  };

}
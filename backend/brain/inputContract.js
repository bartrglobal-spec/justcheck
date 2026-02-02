/**
 * Brain Input Contract
 * Defines exactly what the Brain is allowed to see
 */

function applyInputContract(rawInput) {
  if (!rawInput || typeof rawInput !== "object") {
    return {};
  }

  return {
    identifier: normalizeIdentifier(rawInput.identifier),
    context: normalizeContext(rawInput.context)
  };
}

function normalizeIdentifier(identifier) {
  if (typeof identifier !== "string") return null;

  const trimmed = identifier.trim();
  if (trimmed.length === 0) return null;

  return trimmed;
}

function normalizeContext(context) {
  if (!context || typeof context !== "object") return {};

  return {
    source: normalizeString(context.source),
    country: normalizeString(context.country),
    channel: normalizeString(context.channel)
  };
}

function normalizeString(value) {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  if (trimmed.length === 0) return null;

  return trimmed;
}

module.exports = {
  applyInputContract
};

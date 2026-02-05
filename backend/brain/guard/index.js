function guardInput(input = {}) {
  const identifier = input.identifier;
  const identifier_type = input.identifier_type;

  // Base shape (never throw)
  const response = {
    allowed: false,
    identifier: null,
    identifier_type: null,
    reason: null
  };

  // Presence checks
  if (!identifier || !identifier_type) {
    response.reason = "MISSING_IDENTIFIER_OR_TYPE";
    return response;
  }

  // Type checks
  if (typeof identifier !== "string" || typeof identifier_type !== "string") {
    response.reason = "INVALID_INPUT_TYPE";
    return response;
  }

  // Length limits
  if (identifier.length > 64) {
    response.reason = "IDENTIFIER_TOO_LONG";
    return response;
  }

  // Allowed identifier types
  const allowedTypes = ["phone", "business", "payment_ref"];

  if (!allowedTypes.includes(identifier_type)) {
    response.reason = "UNSUPPORTED_IDENTIFIER_TYPE";
    return response;
  }

  // Normalized, safe pass-through
  response.allowed = true;
  response.identifier = identifier.trim();
  response.identifier_type = identifier_type.trim();

  return response;
}

module.exports = { guardInput };

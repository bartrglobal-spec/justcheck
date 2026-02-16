export function guardInput(input = {}) {
  const identifier = input.identifier;
  const identifier_type = input.identifier_type;

  // Base response (never throw)
  const response = {
    allowed: false,
    identifier: null,
    identifier_type: null,
    reason: null
  };

  // Presence
  if (!identifier || !identifier_type) {
    response.reason = "MISSING_IDENTIFIER_OR_TYPE";
    return response;
  }

  // Primitive type safety
  if (typeof identifier !== "string" || typeof identifier_type !== "string") {
    response.reason = "INVALID_INPUT_TYPE";
    return response;
  }

  const value = identifier.trim();
  const type = identifier_type.trim();

  // Length guard (global)
  if (value.length === 0 || value.length > 64) {
    response.reason = "INVALID_IDENTIFIER_LENGTH";
    return response;
  }

  // Allowed v1 types
  const allowedTypes = ["phone", "email", "username", "website", "name"];

  if (!allowedTypes.includes(type)) {
    response.reason = "UNSUPPORTED_IDENTIFIER_TYPE";
    return response;
  }

  // ── TYPE-SPECIFIC HARD RULES ──

  if (type === "phone") {
    if (!/^[0-9]{7,15}$/.test(value)) {
      response.reason = "INVALID_PHONE_FORMAT";
      return response;
    }
  }

  if (type === "email") {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      response.reason = "INVALID_EMAIL_FORMAT";
      return response;
    }
  }

  if (type === "username") {
    if (!/^[a-zA-Z0-9_.-]{3,32}$/.test(value)) {
      response.reason = "INVALID_USERNAME_FORMAT";
      return response;
    }
  }

  if (type === "website") {
    if (!/^(https?:\/\/)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
      response.reason = "INVALID_WEBSITE_FORMAT";
      return response;
    }
  }

  if (type === "name") {
    if (!/^[a-zA-Z\s.'-]{2,64}$/.test(value)) {
      response.reason = "INVALID_NAME_FORMAT";
      return response;
    }
  }

  // Passed ALL gates
  response.allowed = true;
  response.identifier = value;
  response.identifier_type = type;

  return response;
}

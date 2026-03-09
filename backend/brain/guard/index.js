export function guardInput(input = {}) {
  let identifier = input.identifier;
  let identifier_type = input.identifier_type;

  const response = {
    allowed: false,
    identifier: null,
    identifier_type: null,
    reason: null
  };

  // Presence check
  if (!identifier) {
    response.reason = "MISSING_IDENTIFIER";
    return response;
  }

  if (typeof identifier !== "string") {
    response.reason = "INVALID_IDENTIFIER_TYPE";
    return response;
  }

  let value = identifier.trim();

  if (value.length === 0 || value.length > 64) {
    response.reason = "INVALID_IDENTIFIER_LENGTH";
    return response;
  }

  // ─────────────────────────────
  // AUTO-DETECT TYPE IF MISSING
  // ─────────────────────────────
  if (!identifier_type) {

    // Remove spaces for detection
    const compact = value.replace(/\s+/g, "");

    // Phone detection (digits + optional +)
    if (/^\+?[0-9]{7,15}$/.test(compact)) {
      identifier_type = "phone";
      value = compact.replace(/^\+/, ""); // remove leading +
    }

    // Email
    else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      identifier_type = "email";
    }

    // Website
    else if (/^(https?:\/\/)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
      identifier_type = "website";
    }

    // Username fallback
    else if (/^[a-zA-Z0-9_.-]{3,32}$/.test(value)) {
      identifier_type = "username";
    }

    else {
      response.reason = "UNABLE_TO_DETECT_IDENTIFIER_TYPE";
      return response;
    }
  }

  const type = identifier_type.trim();

  const allowedTypes = ["phone", "email", "username", "website", "name"];

  if (!allowedTypes.includes(type)) {
    response.reason = "UNSUPPORTED_IDENTIFIER_TYPE";
    return response;
  }

  // ─────────────────────────────
  // TYPE-SPECIFIC VALIDATION
  // ─────────────────────────────

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

  response.allowed = true;
  response.identifier = value;
  response.identifier_type = type;

  return response;
}
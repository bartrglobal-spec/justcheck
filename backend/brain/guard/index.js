/**
 * JUSTCHECK GUARD — INPUT SAFETY LAYER
 * Version: v1
 * Status: LOCKED
 *
 * Purpose:
 * - Block undefined, null, malformed, or abusive input
 * - Never throw
 * - Never score
 * - Fail SAFE (green)
 */

function guardInput(rawInput) {
  // Completely missing body
  if (!rawInput) {
    return { allowed: true };
  }

  // Must be an object
  if (typeof rawInput !== "object") {
    return { allowed: false, reason: "non_object_body" };
  }

  // Explicitly allowed empty object {}
  if (Object.keys(rawInput).length === 0) {
    return { allowed: true };
  }

  // Value field checks (if present)
  if ("value" in rawInput) {
    const v = rawInput.value;

    // Null / undefined value
    if (v === null || v === undefined) {
      return { allowed: false, reason: "null_value" };
    }

    // Only strings allowed for v1
    if (typeof v !== "string") {
      return { allowed: false, reason: "non_string_value" };
    }

    // Hard length cap (abuse prevention)
    if (v.length > 256) {
      return { allowed: false, reason: "value_too_long" };
    }
  }

  return { allowed: true };
}

module.exports = { guardInput };

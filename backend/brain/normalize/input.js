function normalizeInput(raw) {
  if (!raw) return null;

  // If raw is a string
  if (typeof raw === "string") {
    return raw.trim();
  }

  // If raw is an object like { value: "something" }
  if (typeof raw === "object" && raw.value) {
    return String(raw.value).trim();
  }

  return null;
}

module.exports = normalizeInput;
function normalizeInput(raw) {
  if (!raw) return null;

  if (typeof raw === "string") {
    return raw.trim().toLowerCase();
  }

  if (typeof raw === "object" && raw.value) {
    return String(raw.value).trim().toLowerCase();
  }

  return null;
}

module.exports = normalizeInput;

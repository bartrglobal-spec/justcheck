function guardInput(input = {}) {
  const identifier = input.identifier;
  const identifier_type = input.identifier_type;

  if (!identifier || !identifier_type) {
    throw new Error("Missing identifier or identifier_type");
  }

  return {
    identifier,
    identifier_type,
    allowed: true
  };
}

module.exports = { guardInput };

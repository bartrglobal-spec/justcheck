module.exports = {
  id: "short_identifier",
  weight: 1,

  run(value) {
    if (typeof value !== "string") return false;
    return value.length > 0 && value.length < 5;
  }
};

module.exports = {
  id: "basic_presence",
  weight: 1,

  run(input) {
    if (!input || typeof input.value !== "string") return false;
    return input.value.trim().length > 0;
  }
};

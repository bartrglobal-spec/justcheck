const { guardInput } = require("./index");

const tests = [
  { identifier: "0647470911", identifier_type: "phone" },
  { identifier: "test@example.com", identifier_type: "email" },
  { identifier: "1111", identifier_type: "phone" },
  { identifier: "", identifier_type: "phone" },
  { identifier: "abc", identifier_type: "unknown" }
];

for (const t of tests) {
  console.log(t, "=>", guardInput(t));
}

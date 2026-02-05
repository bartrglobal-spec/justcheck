// brain/indicators/index.js

const phoneSanity = require("./v1/phoneSanity");
const firstSeen = require("./v1/firstSeen");

module.exports = [
  phoneSanity,
  firstSeen
];

/**
 * Environment Variable Contract
 * This file is the single source of truth for backend env usage.
 *
 * Do NOT read process.env directly outside this file.
 */

function getEnv() {
  const env = {
    PORT: process.env.PORT || "3000",
    NODE_ENV: process.env.NODE_ENV || "development"
  };

  return Object.freeze(env);
}

module.exports = {
  getEnv
};

/**
 * RATE LIMIT GUARD — V1 (LOCKED)
 *
 * Purpose:
 * - Prevent obvious abuse
 * - No user accounts
 * - In-memory only
 * - Deterministic behavior
 *
 * Limits:
 * - Max 60 requests per IP per minute
 */

const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 60;

const store = new Map();

function rateLimiter(req, res, next) {
  const ip =
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "unknown";

  const now = Date.now();

  if (!store.has(ip)) {
    store.set(ip, { count: 1, start: now });
    return next();
  }

  const record = store.get(ip);

  if (now - record.start > WINDOW_MS) {
    record.count = 1;
    record.start = now;
    return next();
  }

  record.count += 1;

  if (record.count > MAX_REQUESTS) {
    return res.json({
      signal: {
        level: "green",
        summary: "Low Risk Indicators"
      },
      indicators: [],
      meta: {
        brain_version: "v1",
        note: "rate_limited"
      }
    });
  }

  next();
}

module.exports = { rateLimiter };

/**
 * Best-effort, in-memory rate limiting for form APIs.
 *
 * LIMITATION: this store lives in the Node process serving the API. It resets
 * on redeploy and is not shared across multiple replicas (fine for a single
 * Render instance). A durable store (Redis/DB) should replace this if the
 * service is ever horizontally scaled.
 */

const buckets = new Map();
const MAX_BUCKETS = 10_000;

export function rateLimit(key, limit = 5, windowMs = 60_000) {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);

  if (hits.length >= limit) {
    buckets.set(key, hits);
    return false;
  }

  hits.push(now);
  buckets.set(key, hits);

  if (buckets.size > MAX_BUCKETS) buckets.clear();

  return true;
}

export function clientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }
  return req.ip || "unknown";
}

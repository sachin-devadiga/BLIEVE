/**
 * Best-effort, in-memory rate limiting for form APIs.
 *
 * LIMITATION: this store lives in the Node process serving the site. It
 * resets on redeploy and is not shared across multiple instances. It protects
 * against naive spam, not a determined distributed attacker. A durable store
 * (Redis/DB) should replace this when a backend is added.
 */

const buckets = new Map<string, number[]>();
const MAX_BUCKETS = 10_000;

export function rateLimit(
  key: string,
  limit = 5,
  windowMs = 60_000
): boolean {
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

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}

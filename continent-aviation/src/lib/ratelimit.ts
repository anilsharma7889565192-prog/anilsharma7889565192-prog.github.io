import "server-only";

/**
 * Best-effort in-memory rate limiter (per server instance).
 * On serverless platforms instances are short-lived and not shared, so treat this as a
 * first line of defence only; for strict limits put Vercel Firewall rate limiting or
 * Upstash Redis in front (see README).
 */
const hits = new Map<string, number[]>();

export function rateLimit(key: string, limit = 5, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) for (const [k, v] of hits) if (v.every((t) => now - t >= windowMs)) hits.delete(k);
  return true;
}

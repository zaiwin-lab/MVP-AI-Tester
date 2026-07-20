import crypto from "node:crypto";

/**
 * In-memory fixed-window rate limiter. Adequate for a single-node MVP; swap
 * for a shared store (Redis / Upstash) when running multiple instances.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit: number, windowMs: number): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }
  if (bucket.count >= limit) {
    return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  bucket.count += 1;
  return { ok: true, retryAfter: 0 };
}

/** One-way hash of an IP for audit/rate-limit without storing raw addresses. */
export function hashIp(ip: string): string {
  const salt = process.env.SESSION_SECRET || "cap-ip-salt";
  return crypto.createHmac("sha256", salt).update(ip).digest("hex").slice(0, 24);
}

export function clientIp(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return headers.get("x-real-ip") || "0.0.0.0";
}

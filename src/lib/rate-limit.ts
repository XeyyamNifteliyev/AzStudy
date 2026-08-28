/**
 * Rate limiter with a pluggable backend.
 *
 * - When `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` are set (Vercel
 *   production), limits are enforced in Upstash Redis — shared across all
 *   serverless function instances, so the effective limit is exactly `max`.
 * - Otherwise it falls back to an in-memory sliding window (local dev, single
 *   instance). In a multi-instance deploy without Redis the effective limit is
 *   `max * instance_count` — acceptable first line of defence; Redis removes
 *   that caveat.
 *
 * `check()` is async because the Redis path performs a network round-trip.
 */
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

interface Limiter {
  /** Returns true when the request is under the limit (allowed). */
  check(key: string): Promise<boolean>;
}

const redisConfigured =
  !!process.env.UPSTASH_REDIS_REST_URL &&
  !!process.env.UPSTASH_REDIS_REST_TOKEN;

export function rateLimit(opts: { windowMs: number; max: number }): Limiter {
  const { windowMs, max } = opts;

  // Redis-backed sliding window (Upstash supports slidingWindow on the edge).
  if (redisConfigured) {
    const redis = Redis.fromEnv();
    const ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(max, `${windowMs} ms`),
      analytics: false,
      prefix: "rl",
    });
    return {
      async check(key: string): Promise<boolean> {
        const { success } = await ratelimit.limit(key);
        return success;
      },
    };
  }

  // In-memory sliding window fallback (local dev / single instance).
  const hits = new Map<string, number[]>();
  return {
    async check(key: string): Promise<boolean> {
      const now = Date.now();
      const since = now - windowMs;
      const arr = hits.get(key);
      const recent = arr ? arr.filter((t) => t > since) : [];
      if (recent.length >= max) {
        hits.set(key, recent);
        return false;
      }
      recent.push(now);
      hits.set(key, recent);
      return true;
    },
  };
}

/**
 * Resolve the caller IP from request headers. Both `x-forwarded-for` and
 * `x-real-ip` are client-spoofable, so we only trust them when the app is
 * explicitly configured to sit behind a trusted proxy (`TRUST_PROXY=1` — e.g.
 * Vercel, where the platform overwrites these headers). Otherwise we fall back
 * to a fixed string so the limiter still has a key.
 */
export function getIpFromHeaders(
  headerLookup: (name: string) => string | null,
): string {
  const trustProxy = process.env.TRUST_PROXY === "1";
  if (trustProxy) {
    const forwarded = headerLookup("x-forwarded-for");
    if (forwarded) {
      // "client, proxy1, proxy2" — take the first (the original client).
      return forwarded.split(",")[0].trim();
    }
    const realIp = headerLookup("x-real-ip");
    if (realIp) return realIp;
  }
  return "unknown";
}

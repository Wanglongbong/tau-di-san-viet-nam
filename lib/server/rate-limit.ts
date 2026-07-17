type RateLimitScope = "guide" | "transcribe";

type Bucket = {
  count: number;
  windowStartedAt: number;
  lastSeenAt: number;
};

export type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  retryAfterSeconds: number;
};

const buckets = new Map<string, Bucket>();
const WINDOW_MS = 60_000;
const MAX_BUCKETS = 5_000;
const STALE_AFTER_MS = WINDOW_MS * 2;

function pruneBuckets(now: number) {
  for (const [key, bucket] of buckets) {
    if (now - bucket.lastSeenAt >= STALE_AFTER_MS) buckets.delete(key);
  }

  if (buckets.size <= MAX_BUCKETS) return;

  const oldest = [...buckets.entries()]
    .sort((left, right) => left[1].lastSeenAt - right[1].lastSeenAt)
    .slice(0, buckets.size - MAX_BUCKETS);
  oldest.forEach(([key]) => buckets.delete(key));
}

/**
 * Best-effort limiter for a single Node/Workers isolate. It deliberately has no
 * durable state dependency; production platform rate limiting can be layered on
 * later without changing either API contract.
 */
export function takeRateLimit(
  scope: RateLimitScope,
  sessionId: string,
  limit: number,
  now = Date.now(),
): RateLimitResult {
  if (buckets.size >= MAX_BUCKETS || buckets.size % 127 === 0) pruneBuckets(now);

  const key = `${scope}:${sessionId}`;
  const current = buckets.get(key);
  const bucket = !current || now - current.windowStartedAt >= WINDOW_MS
    ? { count: 0, windowStartedAt: now, lastSeenAt: now }
    : current;

  bucket.lastSeenAt = now;
  if (bucket.count >= limit) {
    buckets.set(key, bucket);
    return {
      allowed: false,
      limit,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.windowStartedAt + WINDOW_MS - now) / 1_000)),
    };
  }

  bucket.count += 1;
  buckets.set(key, bucket);
  return {
    allowed: true,
    limit,
    remaining: Math.max(0, limit - bucket.count),
    retryAfterSeconds: 0,
  };
}

export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    "cache-control": "no-store",
    "x-ratelimit-limit": String(result.limit),
    "x-ratelimit-remaining": String(result.remaining),
  };
  if (!result.allowed) headers["retry-after"] = String(result.retryAfterSeconds);
  return headers;
}

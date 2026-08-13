type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

export type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
};

/**
 * Simple in-memory fixed-window rate limiter.
 * Suitable for single-instance / dev. Replace with Redis for multi-instance production.
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { success: true, limit, remaining: limit - 1, resetAt };
  }

  if (existing.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      resetAt: existing.resetAt,
    };
  }

  existing.count += 1;
  buckets.set(key, existing);
  return {
    success: true,
    limit,
    remaining: Math.max(0, limit - existing.count),
    resetAt: existing.resetAt,
  };
}

/** Best-effort cleanup to avoid unbounded growth in long-lived processes. */
export function pruneRateLimitBuckets(now = Date.now()) {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

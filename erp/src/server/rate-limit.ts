import { prisma } from "@/server/db";

export type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
};

type MemoryBucket = {
  count: number;
  resetAt: number;
};

const memoryBuckets = new Map<string, MemoryBucket>();

function memoryRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  const existing = memoryBuckets.get(key);

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + windowMs;
    memoryBuckets.set(key, { count: 1, resetAt });
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
  memoryBuckets.set(key, existing);
  return {
    success: true,
    limit,
    remaining: Math.max(0, limit - existing.count),
    resetAt: existing.resetAt,
  };
}

/**
 * Postgres-backed fixed-window rate limiter with in-memory fallback.
 * Prefer this for multi-instance production; memory path covers local/dev
 * when the RateLimitBucket table is unavailable.
 */
export async function rateLimitDistributed(
  key: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult> {
  const now = Date.now();
  const windowStart = new Date(Math.floor(now / windowMs) * windowMs);
  const resetAt = windowStart.getTime() + windowMs;

  try {
    const updated = await prisma.$transaction(async (tx) => {
      const row = await tx.rateLimitBucket.upsert({
        where: {
          key_windowStart: { key, windowStart },
        },
        create: { key, windowStart, count: 1 },
        update: { count: { increment: 1 } },
      });
      return row;
    });

    if (updated.count > limit) {
      return { success: false, limit, remaining: 0, resetAt };
    }

    return {
      success: true,
      limit,
      remaining: Math.max(0, limit - updated.count),
      resetAt,
    };
  } catch {
    return memoryRateLimit(key, limit, windowMs);
  }
}

/**
 * Sync wrapper kept for existing call sites. Uses memory buckets.
 * Prefer `rateLimitDistributed` on hot public endpoints.
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  return memoryRateLimit(key, limit, windowMs);
}

export function pruneRateLimitBuckets(now = Date.now()) {
  for (const [key, bucket] of memoryBuckets) {
    if (bucket.resetAt <= now) memoryBuckets.delete(key);
  }
}

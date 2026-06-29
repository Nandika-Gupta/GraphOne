/**
 * Node-Cache singleton. Wraps trending companies, the feed, and stats
 * with a 10-minute TTL (configurable via CACHE_TTL).
 */
import NodeCache from "node-cache";

const ttl = Number(process.env.CACHE_TTL ?? 600);

export const cache = new NodeCache({ stdTTL: ttl, checkperiod: 120, useClones: false });

export const CacheKeys = {
  trendingCompanies: "companies:trending",
  feed: "feed:global",
  stats: "stats:global",
} as const;

/** get-or-compute helper. */
export async function cached<T>(key: string, producer: () => Promise<T>, ttlSec?: number): Promise<{ value: T; hit: boolean }> {
  const existing = cache.get<T>(key);
  if (existing !== undefined) return { value: existing, hit: true };
  const value = await producer();
  cache.set(key, value, ttlSec ?? ttl);
  return { value, hit: false };
}

/** Invalidate the cached rankings (used by the hourly cron job). */
export function invalidateRankings(): void {
  cache.del([CacheKeys.trendingCompanies, CacheKeys.feed, CacheKeys.stats]);
}

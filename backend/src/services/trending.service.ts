/**
 * TrendingService — orchestrates the pure TrendingScoreService over all
 * companies. Used by GET /companies/trending (read path, cached) and by the
 * hourly cron (write path: persists scores + invalidates cache).
 */
import { CompanyRepository } from "../repositories/company.repository";
import { TrendingScoreService } from "./trendingScore.service";
import { cache, CacheKeys, invalidateRankings } from "./cache";

export const TrendingService = {
  /** Recompute + persist trendingScore for every company. Returns count. */
  async recalculateAll(now = new Date()): Promise<number> {
    const inputs = await CompanyRepository.trendingInputs();
    await Promise.all(
      inputs.map(({ id, input }) => {
        const { score } = TrendingScoreService.compute(input, now);
        return CompanyRepository.updateTrendingScore(id, score);
      }),
    );
    invalidateRankings();
    return inputs.length;
  },

  /** Cached top-N trending companies with computed score field. */
  async top(limit: number) {
    const key = `${CacheKeys.trendingCompanies}:${limit}`;
    const hit = cache.get(key);
    if (hit) return { rows: hit as unknown[], cached: true };
    const rows = await CompanyRepository.topTrending(limit);
    cache.set(key, rows);
    return { rows, cached: false };
  },
};

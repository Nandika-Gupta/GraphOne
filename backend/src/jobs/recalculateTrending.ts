/**
 * Hourly background job:
 *   1. Recalculate trending scores for every company
 *   2. Persist them
 *   3. Invalidate stale cached rankings (trending, feed, stats)
 *
 * Scheduled from server.ts via node-cron ("0 * * * *"). Can also be run
 * standalone:  npm run jobs:trending
 */
import { TrendingService } from "../services/trending.service";
import { invalidateRankings } from "../services/cache";

export async function recalculateTrending(): Promise<void> {
  const startedAt = Date.now();
  const count = await TrendingService.recalculateAll();
  invalidateRankings();
  // eslint-disable-next-line no-console
  console.log(
    `[cron] trending recalculated for ${count} companies in ${Date.now() - startedAt}ms; rankings cache cleared`,
  );
}

// Allow `ts-node src/jobs/recalculateTrending.ts`
if (require.main === module) {
  recalculateTrending()
    .then(() => process.exit(0))
    .catch((e) => {
      // eslint-disable-next-line no-console
      console.error("[cron] trending job failed:", e);
      process.exit(1);
    });
}

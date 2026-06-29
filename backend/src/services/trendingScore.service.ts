/**
 * ──────────────────────────────────────────────────────────────
 *  TrendingScoreService
 * ──────────────────────────────────────────────────────────────
 *  Produces a 0–100 "trending" score for a company by combining
 *  eight normalized signals. Every signal is mapped to [0,1] before
 *  weighting, so no single raw magnitude (e.g. a $10B round) can
 *  dominate. Weights sum to 1.0. See README for the rationale.
 *
 *  The service is PURE: it takes a plain `TrendingInput` and returns
 *  a score + breakdown. No DB access here — the repository hydrates
 *  the inputs. That keeps the formula unit-testable and swappable.
 */

export interface TrendingInput {
  // Funding
  lastFundingAt: Date | null;
  lastFundingAmountUsd: number | null;
  totalRaisedUsd: number | null;
  // Momentum
  employeeGrowthPct: number | null; // trailing-12-mo, e.g. 0.45 = +45%
  newsMentions90d: number;          // count in the last 90 days
  productUpvotes: number;           // summed across the company's products
  // Quality / context
  dataConfidenceScore: number;      // 0–1
  foundedYear: number | null;
  isUnicorn: boolean;
}

export interface TrendingBreakdown {
  fundingRecency: number;
  fundingAmount: number;
  employeeGrowth: number;
  newsMentions: number;
  productUpvotes: number;
  dataConfidence: number;
  companyAge: number;
  unicornBonus: number;
}

export interface TrendingResult {
  score: number;                 // 0–100, rounded to 1 dp
  breakdown: TrendingBreakdown;  // each already weighted (sums to score/100)
}

/** Tunable weights. Must sum to 1.0 (asserted at module load). */
export const WEIGHTS = {
  fundingRecency: 0.22,
  fundingAmount: 0.18,
  employeeGrowth: 0.16,
  newsMentions: 0.14,
  productUpvotes: 0.12,
  dataConfidence: 0.08,
  companyAge: 0.06,
  unicornBonus: 0.04,
} as const;

const sumWeights = Object.values(WEIGHTS).reduce((a, b) => a + b, 0);
if (Math.abs(sumWeights - 1) > 1e-9) {
  throw new Error(`TrendingScore weights must sum to 1.0 (got ${sumWeights})`);
}

const clamp01 = (n: number): number => (n < 0 ? 0 : n > 1 ? 1 : n);

/** Log-compress a magnitude into [0,1] against a reference ceiling. */
const logNorm = (value: number, ceiling: number): number => {
  if (value <= 0) return 0;
  return clamp01(Math.log10(1 + value) / Math.log10(1 + ceiling));
};

/** Exponential time decay → [0,1]; `halfLifeDays` is where the signal halves. */
const recencyDecay = (date: Date | null, halfLifeDays: number, now: Date): number => {
  if (!date) return 0;
  const ageDays = Math.max(0, (now.getTime() - date.getTime()) / 86_400_000);
  return clamp01(Math.pow(0.5, ageDays / halfLifeDays));
};

export class TrendingScoreService {
  /** Reference ceilings used to normalize heavy-tailed magnitudes. */
  private static readonly FUNDING_CEILING_USD = 5_000_000_000; // $5B single round
  private static readonly NEWS_CEILING = 60;                   // 60 mentions / 90d
  private static readonly UPVOTE_CEILING = 25_000;
  private static readonly GROWTH_CAP = 2.0;                    // +200% → 1.0

  static compute(input: TrendingInput, now: Date = new Date()): TrendingResult {
    // 1. Funding recency — decays over a ~180-day half-life.
    const fundingRecency = recencyDecay(input.lastFundingAt, 180, now);

    // 2. Funding amount — log-normalized last round (falls back to total raised).
    const amount = input.lastFundingAmountUsd ?? input.totalRaisedUsd ?? 0;
    const fundingAmount = logNorm(amount, this.FUNDING_CEILING_USD);

    // 3. Employee growth — linear, capped at +200%.
    const employeeGrowth = clamp01((input.employeeGrowthPct ?? 0) / this.GROWTH_CAP);

    // 4. News mentions — log-normalized 90-day count.
    const newsMentions = logNorm(input.newsMentions90d, this.NEWS_CEILING);

    // 5. Product upvotes — log-normalized.
    const productUpvotes = logNorm(input.productUpvotes, this.UPVOTE_CEILING);

    // 6. Data confidence — already 0–1; gates noisy/incomplete records.
    const dataConfidence = clamp01(input.dataConfidenceScore);

    // 7. Company age — favors younger companies (a 1-yr-old = 1.0, 12-yr = 0.0).
    const age = input.foundedYear ? now.getFullYear() - input.foundedYear : 12;
    const companyAge = clamp01(1 - age / 12);

    // 8. Unicorn — small flat bonus.
    const unicornBonus = input.isUnicorn ? 1 : 0;

    const breakdown: TrendingBreakdown = {
      fundingRecency: fundingRecency * WEIGHTS.fundingRecency,
      fundingAmount: fundingAmount * WEIGHTS.fundingAmount,
      employeeGrowth: employeeGrowth * WEIGHTS.employeeGrowth,
      newsMentions: newsMentions * WEIGHTS.newsMentions,
      productUpvotes: productUpvotes * WEIGHTS.productUpvotes,
      dataConfidence: dataConfidence * WEIGHTS.dataConfidence,
      companyAge: companyAge * WEIGHTS.companyAge,
      unicornBonus: unicornBonus * WEIGHTS.unicornBonus,
    };

    const raw = Object.values(breakdown).reduce((a, b) => a + b, 0); // 0–1
    const score = Math.round(raw * 1000) / 10; // 0–100, 1 dp

    return { score, breakdown };
  }
}

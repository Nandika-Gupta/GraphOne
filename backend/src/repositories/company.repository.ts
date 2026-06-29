/**
 * CompanyRepository — all company data access. Controllers/services never
 * touch Prisma directly; they call the repository. Keeps queries in one place.
 */
import type { Prisma } from "@prisma/client";
import { prisma } from "../db/prisma";
import type { TrendingInput } from "../services/trendingScore.service";

const NINETY_DAYS_MS = 90 * 86_400_000;

export const CompanyRepository = {
  list(args: {
    limit: number;
    cursor?: string | undefined;
    category?: string | undefined;
    unicorn?: boolean | undefined;
    sort: "trending" | "growth" | "raised" | "newest";
  }) {
    const orderBy: Prisma.CompanyOrderByWithRelationInput =
      args.sort === "growth"
        ? { growthScore: "desc" }
        : args.sort === "raised"
          ? { totalRaisedUsd: "desc" }
          : args.sort === "newest"
            ? { createdAt: "desc" }
            : { trendingScore: "desc" };

    return prisma.company.findMany({
      take: args.limit + 1, // +1 to detect next page
      ...(args.cursor ? { cursor: { id: args.cursor }, skip: 1 } : {}),
      where: {
        ...(args.category ? { category: { slug: args.category } } : {}),
        ...(args.unicorn !== undefined ? { isUnicorn: args.unicorn } : {}),
      },
      orderBy,
      include: { category: true, tags: { include: { tag: true } } },
    });
  },

  bySlug(slug: string) {
    return prisma.company.findUnique({
      where: { slug },
      include: {
        category: true,
        tags: { include: { tag: true } },
        founders: { include: { founder: true } },
        products: { orderBy: { upvotes: "desc" } },
      },
    });
  },

  funding(slug: string) {
    return prisma.fundingRound.findMany({
      where: { company: { slug } },
      orderBy: { announcedAt: "desc" },
      include: { investors: { include: { investor: true } } },
    });
  },

  products(slug: string) {
    return prisma.product.findMany({
      where: { company: { slug } },
      orderBy: { upvotes: "desc" },
    });
  },

  async graph(slug: string) {
    const company = await prisma.company.findUnique({
      where: { slug },
      include: {
        relationsFrom: { include: { to: true } },
        products: true,
        founders: { include: { founder: true } },
        fundingRounds: { include: { investors: { include: { investor: true } } } },
      },
    });
    return company;
  },

  /** Hydrate the inputs the TrendingScoreService needs, for every company. */
  async trendingInputs(): Promise<Array<{ id: string; input: TrendingInput }>> {
    const since = new Date(Date.now() - NINETY_DAYS_MS);
    const companies = await prisma.company.findMany({
      include: {
        fundingRounds: { orderBy: { announcedAt: "desc" }, take: 1 },
        products: { select: { upvotes: true } },
        _count: { select: { newsArticles: { where: { publishedAt: { gte: since } } } } },
      },
    });

    return companies.map((c) => ({
      id: c.id,
      input: {
        lastFundingAt: c.fundingRounds[0]?.announcedAt ?? null,
        lastFundingAmountUsd: c.fundingRounds[0] ? Number(c.fundingRounds[0].amountUsd) : null,
        totalRaisedUsd: c.totalRaisedUsd ? Number(c.totalRaisedUsd) : null,
        employeeGrowthPct: c.employeeGrowthPct,
        newsMentions90d: c._count.newsArticles,
        productUpvotes: c.products.reduce((sum, p) => sum + p.upvotes, 0),
        dataConfidenceScore: c.dataConfidenceScore,
        foundedYear: c.foundedYear,
        isUnicorn: c.isUnicorn,
      },
    }));
  },

  topTrending(limit: number) {
    return prisma.company.findMany({
      orderBy: { trendingScore: "desc" },
      take: limit,
      include: { category: true },
    });
  },

  updateTrendingScore(id: string, score: number) {
    return prisma.company.update({ where: { id }, data: { trendingScore: score } });
  },

  create(data: Prisma.CompanyCreateInput) {
    return prisma.company.create({ data });
  },
};

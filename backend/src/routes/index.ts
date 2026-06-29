/**
 * Aggregate router. Investors / products / news / feed / search / stats /
 * founders follow the SAME controller→service→repository pattern as companies.
 * Their controllers are omitted from this handoff slice for brevity but the
 * routes + contracts are declared here so the surface is complete.
 */
import { Router } from "express";
import companies from "./companies.routes";
import { asyncH } from "../shared/asyncH";
import { ok } from "../shared/types";
import { cache, CacheKeys } from "../services/cache";
import { prisma } from "../db/prisma";
import { searchQuery, paginationSchema } from "../validators";

const api = Router();

api.use("/companies", companies);

// ── Investors ────────────────────────────────────────────────
api.get("/investors", asyncH(async (req, res) => {
  const q = paginationSchema.parse(req.query);
  const rows = await prisma.investor.findMany({ take: q.limit, orderBy: { name: "asc" } });
  res.json(ok(rows, { count: rows.length }));
}));
api.get("/investors/most-active", asyncH(async (_req, res) => {
  const rows = await prisma.investor.findMany({
    take: 12,
    orderBy: { investments: { _count: "desc" } },
    include: { _count: { select: { investments: true } } },
  });
  res.json(ok(rows, { count: rows.length }));
}));
api.get("/investors/:slug", asyncH(async (req, res) => {
  const { slug } = req.params as { slug: string };
  const inv = await prisma.investor.findUnique({
    where: { slug },
    include: {
      investments: {
        orderBy: { round: { announcedAt: "desc" } },
        include: {
          round: {
            include: { company: { include: { category: true } } },
          },
        },
      },
    },
  });
  res.json(ok(inv));
}));
api.get("/investors/:slug/investments", asyncH(async (req, res) => {
  const { slug } = req.params as { slug: string };
  const rows = await prisma.fundingRoundInvestor.findMany({
    where: { investor: { slug } },
    include: { round: { include: { company: true } } },
    orderBy: { round: { announcedAt: "desc" } },
  });
  res.json(ok(rows, { count: rows.length }));
}));
api.get("/investors/:slug/co-investors", asyncH(async (req, res) => {
  const { slug } = req.params as { slug: string };
  const rounds = await prisma.fundingRoundInvestor.findMany({
    where: { investor: { slug } },
    select: { roundId: true },
  });
  const ids = rounds.map((r) => r.roundId);
  const co = await prisma.fundingRoundInvestor.findMany({
    where: { roundId: { in: ids }, NOT: { investor: { slug } } },
    select: { investorId: true, investor: true },
  });
  const counts = new Map<string, { investor: unknown; count: number }>();
  for (const row of co) {
    const k = row.investorId;
    counts.set(k, { investor: row.investor, count: (counts.get(k)?.count ?? 0) + 1 });
  }
  res.json(ok([...counts.values()].sort((a, b) => b.count - a.count)));
}));

// ── Products ─────────────────────────────────────────────────
api.get("/products", asyncH(async (req, res) => {
  const q = paginationSchema.parse(req.query);
  const category = typeof req.query.category === "string" ? req.query.category : undefined;
  const rows = await prisma.product.findMany({
    take: q.limit,
    where: category ? { category } : {},
    orderBy: { upvotes: "desc" },
  });
  res.json(ok(rows, { count: rows.length }));
}));
api.get("/products/:slug", asyncH(async (req, res) => {
  const { slug } = req.params as { slug: string };
  const p = await prisma.product.findUnique({ where: { slug } });
  res.json(ok(p));
}));

// ── News ─────────────────────────────────────────────────────
api.get("/news", asyncH(async (req, res) => {
  const q = paginationSchema.parse(req.query);
  const rows = await prisma.newsArticle.findMany({ take: q.limit, orderBy: { publishedAt: "desc" } });
  res.json(ok(rows, { count: rows.length }));
}));
api.get("/news/trending", asyncH(async (_req, res) => {
  const rows = await prisma.newsArticle.findMany({ take: 10, orderBy: { viewCount: "desc" } });
  res.json(ok(rows, { count: rows.length }));
}));

// ── Feed (cached) ────────────────────────────────────────────
api.get("/feed", asyncH(async (_req, res) => {
  const hit = cache.get(CacheKeys.feed);
  if (hit) return res.json(ok(hit, { cached: true }));
  const [funding, news] = await Promise.all([
    prisma.fundingRound.findMany({ take: 15, orderBy: { announcedAt: "desc" }, include: { company: true } }),
    prisma.newsArticle.findMany({ take: 15, orderBy: { publishedAt: "desc" } }),
  ]);
  const feed = [
    ...funding.map((f) => ({ kind: "funding" as const, at: f.announcedAt, payload: f })),
    ...news.map((n) => ({ kind: "news" as const, at: n.publishedAt, payload: n })),
  ].sort((a, b) => b.at.getTime() - a.at.getTime());
  cache.set(CacheKeys.feed, feed);
  res.json(ok(feed, { count: feed.length, cached: false }));
}));

// ── Search ───────────────────────────────────────────────────
api.get("/search", asyncH(async (req, res) => {
  const { q, type, limit } = searchQuery.parse(req.query);
  const like = { contains: q, mode: "insensitive" as const };
  const [companies, investors, products] = await Promise.all([
    type === "all" || type === "companies"
      ? prisma.company.findMany({ where: { name: like }, take: limit, select: { slug: true, name: true } })
      : [],
    type === "all" || type === "investors"
      ? prisma.investor.findMany({ where: { name: like }, take: limit, select: { slug: true, name: true } })
      : [],
    type === "all" || type === "products"
      ? prisma.product.findMany({ where: { name: like }, take: limit, select: { slug: true, name: true } })
      : [],
  ]);
  res.json(ok({ companies, investors, products }, { query: q }));
}));

// ── Stats (cached) ───────────────────────────────────────────
api.get("/stats", asyncH(async (_req, res) => {
  const hit = cache.get(CacheKeys.stats);
  if (hit) return res.json(ok(hit, { cached: true }));
  const [companies, investors, products, unicorns, rounds] = await Promise.all([
    prisma.company.count(),
    prisma.investor.count(),
    prisma.product.count(),
    prisma.company.count({ where: { isUnicorn: true } }),
    prisma.fundingRound.aggregate({ _sum: { amountUsd: true } }),
  ]);
  const stats = {
    companies, investors, products, unicorns,
    totalFundingUsd: Number(rounds._sum.amountUsd ?? 0),
  };
  cache.set(CacheKeys.stats, stats);
  res.json(ok(stats, { cached: false }));
}));

// ── Founders ─────────────────────────────────────────────────
api.get("/founders/:slug", asyncH(async (req, res) => {
  const { slug } = req.params as { slug: string };
  const f = await prisma.founder.findUnique({
    where: { slug },
    include: { companies: { include: { company: true } } },
  });
  res.json(ok(f));
}));

export default api;

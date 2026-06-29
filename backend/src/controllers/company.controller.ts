/**
 * CompanyController — thin HTTP layer. Validates input (Zod), calls the
 * repository/services, and returns the { data, meta, error } envelope.
 * Async errors propagate to the central errorHandler via `asyncH`.
 */
import type { Request, Response } from "express";
import { CompanyRepository } from "../repositories/company.repository";
import { TrendingService } from "../services/trending.service";
import { TrendingScoreService } from "../services/trendingScore.service";
import { notFound } from "../middleware/errorHandler";
import { ok } from "../shared/types";
import {
  listCompaniesQuery,
  createCompanySchema,
  claimCompanySchema,
  cursorMeta,
} from "../validators";
import { serializeCompany } from "../shared/serializers";

export const CompanyController = {
  async list(req: Request, res: Response) {
    const q = listCompaniesQuery.parse(req.query);
    const rows = await CompanyRepository.list(q);
    const { page, meta } = cursorMeta(rows, q.limit);
    res.json(ok(page.map(serializeCompany), meta));
  },

  async detail(req: Request, res: Response) {
    const { slug } = req.params as { slug: string };
    const company = await CompanyRepository.bySlug(slug);
    if (!company) throw notFound("Company");
    res.json(ok(serializeCompany(company)));
  },

  async funding(req: Request, res: Response) {
    const { slug } = req.params as { slug: string };
    const company = await CompanyRepository.bySlug(slug);
    if (!company) throw notFound("Company");
    const rounds = await CompanyRepository.funding(slug);
    const total = rounds.reduce((s, r) => s + Number(r.amountUsd), 0);
    res.json(
      ok(
        rounds.map((r) => ({
          id: r.id,
          stage: r.stage,
          amountUsd: Number(r.amountUsd),
          valuationUsd: r.valuationUsd ? Number(r.valuationUsd) : null,
          announcedAt: r.announcedAt,
          investors: r.investors.map((i) => ({
            slug: i.investor.slug,
            name: i.investor.name,
            isLead: i.isLead,
          })),
        })),
        { count: rounds.length, totalRaisedUsd: total },
      ),
    );
  },

  async products(req: Request, res: Response) {
    const { slug } = req.params as { slug: string };
    const rows = await CompanyRepository.products(slug);
    res.json(ok(rows, { count: rows.length }));
  },

  async graph(req: Request, res: Response) {
    const { slug } = req.params as { slug: string };
    const c = await CompanyRepository.graph(slug);
    if (!c) throw notFound("Company");
    const nodes = [
      { id: c.id, label: c.name, type: "company", root: true },
      ...c.products.map((p) => ({ id: p.id, label: p.name, type: "product" })),
      ...c.founders.map((f) => ({ id: f.founder.id, label: f.founder.name, type: "founder" })),
      ...c.relationsFrom.map((r) => ({ id: r.to.id, label: r.to.name, type: r.type.toLowerCase() })),
    ];
    const edges = [
      ...c.products.map((p) => ({ from: c.id, to: p.id, type: "product" })),
      ...c.founders.map((f) => ({ from: f.founder.id, to: c.id, type: "founder" })),
      ...c.relationsFrom.map((r) => ({ from: c.id, to: r.to.id, type: r.type.toLowerCase() })),
    ];
    res.json(ok({ nodes, edges }, { nodeCount: nodes.length, edgeCount: edges.length }));
  },

  async trending(req: Request, res: Response) {
    const limit = Math.min(Number(req.query.limit ?? 12), 50);
    const { rows, cached } = await TrendingService.top(limit);
    res.json(ok(rows, { count: rows.length, cached }));
  },

  async create(req: Request, res: Response) {
    const body = createCompanySchema.parse(req.body);
    const company = await CompanyRepository.create({
      name: body.name,
      slug: body.slug,
      website: body.website ?? null,
      tagline: body.tagline ?? null,
      description: body.description ?? null,
      foundedYear: body.foundedYear ?? null,
      hqLocation: body.hqLocation ?? null,
      ...(body.categorySlug ? { category: { connect: { slug: body.categorySlug } } } : {}),
    });
    // Seed an initial trending score so it surfaces immediately.
    const { score } = TrendingScoreService.compute({
      lastFundingAt: null, lastFundingAmountUsd: null, totalRaisedUsd: null,
      employeeGrowthPct: 0, newsMentions90d: 0, productUpvotes: 0,
      dataConfidenceScore: 0.4, foundedYear: body.foundedYear ?? null, isUnicorn: false,
    });
    await CompanyRepository.updateTrendingScore(company.id, score);
    res.status(201).json(ok(serializeCompany({ ...company, trendingScore: score })));
  },

  async claim(req: Request, res: Response) {
    const { slug } = req.params as { slug: string };
    const company = await CompanyRepository.bySlug(slug);
    if (!company) throw notFound("Company");
    const body = claimCompanySchema.parse(req.body);
    // In production: create a ClaimRequest row + notify ops. Here we ack.
    res.status(202).json(
      ok({ status: "pending_review", companySlug: company.slug, requestedBy: body.email }),
    );
  },
};

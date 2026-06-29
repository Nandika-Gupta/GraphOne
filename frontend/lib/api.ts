/**
 * Typed API client for the GraphOne Express backend.
 * Used in Next.js Server Components (page.tsx files) — never import in client components.
 */

import type { Company, Investor, Product, NewsItem, Stats, InvestorSector } from "@/types";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api/v1";
const KEY  = process.env.API_KEY ?? "dev-key-123";

async function apiFetch<T>(path: string, opts?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      ...opts,
      headers: { "X-API-Key": KEY, "Content-Type": "application/json", ...opts?.headers },
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const body = await res.json() as { data: T | null };
    return body.data;
  } catch {
    return null;
  }
}

// ── Shape adapters ────────────────────────────────────────────
const CAT_COLORS: Record<string, string> = {
  "Foundation Models": "#FF4D7A", "AI Agents": "#8B5CF6", "AI Coding": "#10B981",
  "AI Search": "#3B82F6", "AI Video": "#EC4899", "AI Voice": "#F97316",
  "AI Infrastructure": "#14B8A6", "Healthcare AI": "#22C55E", "AI Image": "#A855F7",
  "Legal AI": "#0EA5E9", "Robotics": "#F59E0B", "Enterprise AI": "#6366F1",
};

const fmtUsd = (n: number): string =>
  n >= 1e9 ? "$" + (n / 1e9).toFixed(n % 1e9 === 0 ? 0 : 1) + "B"
  : n >= 1e6 ? "$" + Math.round(n / 1e6) + "M"
  : "$" + n.toLocaleString();

interface ApiCompany {
  id: string; slug: string; name: string; tagline: string | null; description: string | null;
  website: string | null; hqLocation: string | null; foundedYear: number | null;
  employeeCount: number | null; employeeGrowthPct: number | null; isUnicorn: boolean;
  valuationUsd: number | null; totalRaisedUsd: number | null; trendingScore: number;
  category: { name: string; colorHex: string | null } | null;
  tags: { tag: { name: string } }[];
  founders: { role: string | null; founder: { name: string } }[];
  products: { slug: string }[];
  fundingRounds: ApiRound[];
}

interface ApiRound {
  id: string; stage: string; amountUsd: number; valuationUsd: number | null;
  announcedAt: string;
  investors: { isLead: boolean; investor: { slug: string; name: string } }[];
}

export function mapCompany(c: ApiCompany): Company {
  const catName = c.category?.name ?? "AI";
  const catColor = c.category?.colorHex ?? CAT_COLORS[catName] ?? "#8B5CF6";

  const rounds = (c.fundingRounds ?? []).map((r) => ({
    stage: r.stage.replace(/_/g, " "),
    amount: fmtUsd(r.amountUsd),
    amountM: Math.round(r.amountUsd / 1e6),
    date: new Date(r.announcedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    year: new Date(r.announcedAt).getFullYear(),
    leads: (r.investors ?? []).filter((i) => i.isLead).map((i) => i.investor.slug),
  }));

  return {
    slug: c.slug,
    name: c.name,
    cat: catName,
    catColor,
    hq: c.hqLocation ?? "",
    founded: c.foundedYear ?? 0,
    employees: c.employeeCount ?? 0,
    growth: c.employeeGrowthPct ?? 0,
    unicorn: c.isUnicorn,
    valuation: c.valuationUsd && c.valuationUsd > 0 ? fmtUsd(c.valuationUsd) : "—",
    raised: c.totalRaisedUsd && c.totalRaisedUsd > 0 ? fmtUsd(c.totalRaisedUsd) : "—",
    tagline: c.tagline ?? "",
    desc: c.description ?? "",
    tags: (c.tags ?? []).map((t) => t.tag.name),
    founders: (c.founders ?? []).map((f) => ({ name: f.founder.name, role: f.role ?? "" })),
    productSlugs: (c.products ?? []).map((p) => p.slug),
    investorSlugs: Array.from(new Set(rounds.flatMap((r) => r.leads))),
    rounds,
    similar: [],
    timeline: rounds.map((r) => ({ year: String(r.year), label: `${r.stage} · ${r.amount}` })),
    website: c.website ?? "",
  };
}

interface ApiInvestmentRound {
  id: string; stage: string; amountUsd: number; announcedAt: string;
  company: { slug: string; name: string; category: { name: string; colorHex: string | null } | null };
}
interface ApiInvestmentEntry { isLead: boolean; round: ApiInvestmentRound }

interface ApiInvestor {
  id: string; slug: string; name: string; type: string; hqLocation: string | null;
  foundedYear: number | null; isVerified: boolean; avgCheckSizeUsd: number | null;
  fundNumber: number | null; aumUsd: number | null; thesis: string | null;
  stageFocus?: string[];
  investments?: ApiInvestmentEntry[];
}

const INVESTOR_TYPE_LABELS: Record<string, string> = {
  VC: "VC", ANGEL: "Angel", ACCELERATOR: "Accelerator",
  CORPORATE: "Corporate", GROWTH_EQUITY: "Growth Equity", PE: "PE", SOVEREIGN: "Sovereign",
};

const STAGE_LABELS: Record<string, string> = {
  PRE_SEED: "Pre-Seed", SEED: "Seed", SERIES_A: "Series A", SERIES_B: "Series B",
  SERIES_C: "Series C", SERIES_D: "Series D", SERIES_E: "Series E", GROWTH: "Growth", IPO: "IPO",
};

const SECTOR_COLORS = [
  "#FF4D7A", "#8B5CF6", "#10B981", "#3B82F6", "#EC4899",
  "#F97316", "#14B8A6", "#22C55E", "#A855F7", "#0EA5E9",
];

export function mapInvestor(inv: ApiInvestor): Investor {
  const investments = inv.investments ?? [];
  const now = Date.now();
  const ms90d = 90 * 86_400_000;

  // Unique portfolio companies
  const seenSlugs = new Set<string>();
  for (const e of investments) seenSlugs.add(e.round.company.slug);
  const portfolioSlugs = Array.from(seenSlugs);

  const deals90d = investments.filter(
    (e) => now - new Date(e.round.announcedAt).getTime() < ms90d,
  ).length;

  const recent = investments.slice(0, 6).map((e) => ({
    companySlug: e.round.company.slug,
    company: e.round.company.name,
    cat: e.round.company.category?.name ?? "AI",
    stage: STAGE_LABELS[e.round.stage] ?? e.round.stage.replace(/_/g, " "),
    amount: fmtUsd(e.round.amountUsd),
    role: e.isLead ? "Lead Investor" : "Co-Investor",
  }));

  // Quarterly velocity — last 4 quarters
  const velocity = Array.from({ length: 4 }, (_, i) => {
    const qi = 3 - i;
    const endMs = now - qi * 91 * 86_400_000;
    const startMs = endMs - 91 * 86_400_000;
    const d = new Date(endMs);
    const deals = investments.filter((e) => {
      const t = new Date(e.round.announcedAt).getTime();
      return t >= startMs && t < endMs;
    }).length;
    return { label: `Q${Math.ceil((d.getMonth() + 1) / 3)} '${String(d.getFullYear()).slice(2)}`, deals };
  });

  // Sector concentration from portfolio categories
  const catCounts = new Map<string, number>();
  for (const e of investments) {
    const cat = e.round.company.category?.name ?? "Other";
    catCounts.set(cat, (catCounts.get(cat) ?? 0) + 1);
  }
  const topCats = Array.from(catCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const catTotal = topCats.reduce((s, [, n]) => s + n, 0) || 1;
  const sectors: InvestorSector[] = topCats.map(([label, n], i) => ({
    label,
    v: Math.round((n / catTotal) * 100),
    c: SECTOR_COLORS[i] ?? "#8B5CF6",
  }));
  // Ensure percentages sum to 100
  if (sectors.length > 0) {
    const diff = 100 - sectors.reduce((s, sec) => s + sec.v, 0);
    if (diff !== 0) sectors[sectors.length - 1]!.v += diff;
  }

  const stages = (inv.stageFocus ?? []).map((s) => STAGE_LABELS[s] ?? s.replace(/_/g, " "));

  return {
    slug: inv.slug,
    name: inv.name,
    type: INVESTOR_TYPE_LABELS[inv.type] ?? inv.type,
    hq: inv.hqLocation ?? "",
    founded: inv.foundedYear ?? 0,
    verified: inv.isVerified,
    avgCheck: inv.avgCheckSizeUsd ? fmtUsd(inv.avgCheckSizeUsd) : "—",
    fundNumber: inv.fundNumber ?? 0,
    aum: inv.aumUsd && inv.aumUsd > 0 ? fmtUsd(inv.aumUsd) : "—",
    thesis: inv.thesis ?? "",
    partners: [],
    sectors,
    stages,
    portfolioSlugs,
    portfolioCount: portfolioSlugs.length,
    deals90d,
    coInvestors: [],
    recent,
    velocity,
  };
}

interface ApiProduct {
  id: string; slug: string; name: string; tagline: string | null; description: string | null;
  category: string | null; upvotes: number; commentCount: number;
  company: { slug: string; name: string; category: { name: string; colorHex: string | null } | null } | null;
}

export function mapProduct(p: ApiProduct): Product {
  const catName = p.company?.category?.name ?? p.category ?? "AI";
  return {
    slug: p.slug,
    name: p.name,
    companySlug: p.company?.slug ?? "",
    company: p.company?.name ?? "",
    category: catName,
    categoryColor: p.company?.category?.colorHex ?? CAT_COLORS[catName] ?? "#8B5CF6",
    desc: p.description ?? p.tagline ?? "",
    upvotes: p.upvotes,
    comments: p.commentCount,
  };
}

// ── Public API functions ─────────────────────────────────────

export async function getCompany(slug: string): Promise<Company | null> {
  const data = await apiFetch<ApiCompany>(`/companies/${slug}`);
  return data ? mapCompany(data) : null;
}

export async function getCompanies(params?: {
  limit?: number; sort?: string; category?: string; cursor?: string;
}): Promise<Company[]> {
  const qs = new URLSearchParams();
  if (params?.limit) qs.set("limit", String(params.limit));
  if (params?.sort) qs.set("sort", params.sort);
  if (params?.category) qs.set("category", params.category);
  if (params?.cursor) qs.set("cursor", params.cursor);
  const data = await apiFetch<ApiCompany[]>(`/companies?${qs}`);
  return (data ?? []).map(mapCompany);
}

export async function getTrendingCompanies(limit = 12): Promise<Company[]> {
  const data = await apiFetch<ApiCompany[]>(`/companies/trending?limit=${limit}`);
  return (data ?? []).map(mapCompany);
}

export async function getInvestor(slug: string): Promise<Investor | null> {
  const [data, coData] = await Promise.all([
    apiFetch<ApiInvestor>(`/investors/${slug}`),
    apiFetch<{ investor: { slug: string; name: string }; count: number }[]>(`/investors/${slug}/co-investors`),
  ]);
  if (!data) return null;
  const investor = mapInvestor(data);
  investor.coInvestors = (coData ?? []).slice(0, 8).map((co) => ({
    slug: co.investor.slug,
    name: co.investor.name,
    shared: co.count,
  }));
  return investor;
}

export async function getInvestors(limit = 20): Promise<Investor[]> {
  const data = await apiFetch<ApiInvestor[]>(`/investors?limit=${limit}`);
  return (data ?? []).map(mapInvestor);
}

export async function getProduct(slug: string): Promise<Product | null> {
  const data = await apiFetch<ApiProduct>(`/products/${slug}`);
  return data ? mapProduct(data) : null;
}

export async function getProducts(limit = 30): Promise<Product[]> {
  const data = await apiFetch<ApiProduct[]>(`/products?limit=${limit}`);
  return (data ?? []).map(mapProduct);
}

export async function getNews(limit = 40): Promise<NewsItem[]> {
  interface ApiNews {
    id: string; slug: string; title: string; publishedAt: string; source: string | null;
    viewCount: number; company: { slug: string; name: string } | null;
  }
  const data = await apiFetch<ApiNews[]>(`/news?limit=${limit}`);
  const now = Date.now();
  return (data ?? []).map((n) => {
    const ms = now - new Date(n.publishedAt).getTime();
    const hours = ms / 3_600_000;
    return {
      slug: n.slug,
      title: n.title,
      company: n.company?.name ?? "",
      companySlug: n.company?.slug ?? "",
      domain: n.source ?? "TechCrunch",
      kind: "news",
      daysAgo: Math.floor(hours / 24),
      hoursAgo: hours < 24 ? Math.floor(hours) : null,
      comments: 0,
    };
  });
}

export async function getStats(): Promise<Stats | null> {
  interface ApiStats {
    companies: number; investors: number; products: number; unicorns: number;
    totalFundingUsd: number;
  }
  const data = await apiFetch<ApiStats>("/stats");
  if (!data) return null;
  return {
    companies: data.companies.toLocaleString() + "+",
    totalFunding: fmtUsd(data.totalFundingUsd),
    rounds: "120+",
    unicorns: String(data.unicorns),
    products: data.products.toLocaleString() + "+",
    investors: data.investors.toLocaleString() + "+",
  };
}

export async function search(q: string) {
  interface ApiSearch {
    companies: { slug: string; name: string }[];
    investors: { slug: string; name: string }[];
    products: { slug: string; name: string }[];
  }
  return apiFetch<ApiSearch>(`/search?q=${encodeURIComponent(q)}&limit=5`);
}

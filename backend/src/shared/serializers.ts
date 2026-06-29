/** Serializers — convert Prisma rows (BigInt, relations) into JSON-safe DTOs. */

const big = (v: bigint | null | undefined): number | null => (v == null ? null : Number(v));

export function serializeCompany(c: any) {
  return {
    id: c.id,
    slug: c.slug,
    name: c.name,
    tagline: c.tagline ?? null,
    description: c.description ?? null,
    website: c.website ?? null,
    logoUrl: c.logoUrl ?? null,
    hqLocation: c.hqLocation ?? null,
    foundedYear: c.foundedYear ?? null,
    employeeCount: c.employeeCount ?? null,
    employeeGrowthPct: c.employeeGrowthPct ?? 0,
    isUnicorn: c.isUnicorn ?? false,
    valuationUsd: big(c.valuationUsd),
    totalRaisedUsd: big(c.totalRaisedUsd),
    growthScore: c.growthScore ?? 0,
    dataConfidenceScore: c.dataConfidenceScore ?? 0,
    trendingScore: c.trendingScore ?? 0,
    category: c.category
      ? { slug: c.category.slug, name: c.category.name, colorHex: c.category.colorHex ?? null }
      : null,
    tags: Array.isArray(c.tags)
      ? c.tags.map((t: any) => ({ tag: { name: t.tag?.name ?? t.name ?? String(t) } }))
      : [],
    founders: Array.isArray(c.founders)
      ? c.founders.map((f: any) => ({ role: f.role ?? null, founder: { name: f.founder?.name ?? "" } }))
      : [],
    products: Array.isArray(c.products)
      ? c.products.map((p: any) => ({ slug: p.slug }))
      : [],
    fundingRounds: Array.isArray(c.fundingRounds)
      ? c.fundingRounds.map((r: any) => ({
          id: r.id,
          stage: r.stage,
          amountUsd: big(r.amountUsd) ?? 0,
          valuationUsd: r.valuationUsd ? big(r.valuationUsd) : null,
          announcedAt: r.announcedAt,
          investors: Array.isArray(r.investors)
            ? r.investors.map((i: any) => ({
                isLead: i.isLead,
                investor: { slug: i.investor?.slug ?? "", name: i.investor?.name ?? "" },
              }))
            : [],
        }))
      : [],
    lastScrapedAt: c.lastScrapedAt ?? null,
  };
}
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
    category: c.category ? { slug: c.category.slug, name: c.category.name } : null,
    tags: Array.isArray(c.tags) ? c.tags.map((t: any) => t.tag?.name ?? t.name).filter(Boolean) : [],
    lastScrapedAt: c.lastScrapedAt ?? null,
  };
}

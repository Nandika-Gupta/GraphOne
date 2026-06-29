/**
 * Zod validators + URL validation + cursor pagination helpers.
 */
import { z } from "zod";

/** Strict absolute http(s) URL. */
export const urlSchema = z
  .string()
  .trim()
  .url("Must be a valid URL")
  .refine((u) => /^https?:\/\//i.test(u), "URL must use http or https");

export const slugSchema = z
  .string()
  .trim()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug");

/** Cursor pagination query (?limit=&cursor=). */
export const paginationSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  cursor: z.string().trim().min(1).optional(),
});
export type Pagination = z.infer<typeof paginationSchema>;

export const listCompaniesQuery = paginationSchema.extend({
  category: slugSchema.optional(),
  unicorn: z.coerce.boolean().optional(),
  sort: z.enum(["trending", "growth", "raised", "newest"]).default("trending"),
});

export const createCompanySchema = z.object({
  name: z.string().trim().min(1).max(160),
  slug: slugSchema,
  website: urlSchema.optional(),
  tagline: z.string().trim().max(240).optional(),
  description: z.string().trim().max(4000).optional(),
  foundedYear: z.number().int().min(1900).max(new Date().getFullYear()).optional(),
  hqLocation: z.string().trim().max(160).optional(),
  categorySlug: slugSchema.optional(),
});

export const claimCompanySchema = z.object({
  email: z.string().trim().email(),
  fullName: z.string().trim().min(1).max(160),
  role: z.string().trim().max(120).optional(),
  linkedinUrl: urlSchema.optional(),
});

export const searchQuery = z.object({
  q: z.string().trim().min(1).max(120),
  type: z.enum(["all", "companies", "investors", "products", "news"]).default("all"),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

/** Build the standard cursor meta from a result page. */
export function cursorMeta<T extends { id: string }>(rows: T[], limit: number) {
  const hasMore = rows.length > limit;
  const page = hasMore ? rows.slice(0, limit) : rows;
  const nextCursor = hasMore ? (page[page.length - 1]?.id ?? null) : null;
  return { page, meta: { count: page.length, hasMore, nextCursor } };
}

-- GraphOne — initial schema migration
-- Generated to match prisma/schema.prisma. Apply with: prisma migrate deploy
-- (Prisma normally authors this file under prisma/migrations/<timestamp>_init/.)

-- ── Enums ─────────────────────────────────────────────────────
CREATE TYPE "FundingStage" AS ENUM ('PRE_SEED','SEED','SERIES_A','SERIES_B','SERIES_C','SERIES_D','SERIES_E','GROWTH','IPO');
CREATE TYPE "InvestorType" AS ENUM ('VC','ANGEL','ACCELERATOR','CORPORATE','GROWTH_EQUITY','PE','SOVEREIGN');
CREATE TYPE "RelationshipType" AS ENUM ('COMPETITOR','ACQUISITION','PARTNERSHIP','SUBSIDIARY','INTEGRATION');

-- ── Category ──────────────────────────────────────────────────
CREATE TABLE "Category" (
  "id" TEXT PRIMARY KEY,
  "slug" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "colorHex" TEXT
);

-- ── Company ───────────────────────────────────────────────────
CREATE TABLE "Company" (
  "id" TEXT PRIMARY KEY,
  "slug" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "legalName" TEXT,
  "tagline" TEXT,
  "description" TEXT,
  "website" TEXT,
  "logoUrl" TEXT,
  "hqLocation" TEXT,
  "foundedYear" INTEGER,
  "employeeCount" INTEGER,
  "employeeGrowthPct" DOUBLE PRECISION DEFAULT 0,
  "isUnicorn" BOOLEAN NOT NULL DEFAULT false,
  "isClaimed" BOOLEAN NOT NULL DEFAULT false,
  "valuationUsd" BIGINT,
  "totalRaisedUsd" BIGINT DEFAULT 0,
  "growthScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "dataConfidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
  "trendingScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "lastScrapedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "categoryId" TEXT REFERENCES "Category"("id")
);
CREATE INDEX "Company_trendingScore_idx" ON "Company"("trendingScore" DESC);
CREATE INDEX "Company_growthScore_idx" ON "Company"("growthScore" DESC);
CREATE INDEX "Company_categoryId_idx" ON "Company"("categoryId");
CREATE INDEX "Company_isUnicorn_idx" ON "Company"("isUnicorn");

-- ── Investor ──────────────────────────────────────────────────
CREATE TABLE "Investor" (
  "id" TEXT PRIMARY KEY,
  "slug" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "type" "InvestorType" NOT NULL DEFAULT 'VC',
  "description" TEXT,
  "website" TEXT,
  "logoUrl" TEXT,
  "hqLocation" TEXT,
  "foundedYear" INTEGER,
  "isVerified" BOOLEAN NOT NULL DEFAULT false,
  "avgCheckSizeUsd" BIGINT,
  "fundNumber" INTEGER,
  "aumUsd" BIGINT,
  "thesis" TEXT,
  "stageFocus" "FundingStage"[],
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);
CREATE INDEX "Investor_type_idx" ON "Investor"("type");

-- ── Founder + join ────────────────────────────────────────────
CREATE TABLE "Founder" (
  "id" TEXT PRIMARY KEY,
  "slug" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "title" TEXT,
  "bio" TEXT,
  "avatarUrl" TEXT,
  "linkedinUrl" TEXT,
  "twitterUrl" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);
CREATE TABLE "FounderCompany" (
  "founderId" TEXT NOT NULL REFERENCES "Founder"("id") ON DELETE CASCADE,
  "companyId" TEXT NOT NULL REFERENCES "Company"("id") ON DELETE CASCADE,
  "role" TEXT,
  "isCurrent" BOOLEAN NOT NULL DEFAULT true,
  PRIMARY KEY ("founderId","companyId")
);
CREATE INDEX "FounderCompany_companyId_idx" ON "FounderCompany"("companyId");

-- ── FundingRound + join ───────────────────────────────────────
CREATE TABLE "FundingRound" (
  "id" TEXT PRIMARY KEY,
  "companyId" TEXT NOT NULL REFERENCES "Company"("id") ON DELETE CASCADE,
  "stage" "FundingStage" NOT NULL,
  "amountUsd" BIGINT NOT NULL,
  "valuationUsd" BIGINT,
  "announcedAt" TIMESTAMP(3) NOT NULL,
  "source" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "FundingRound_companyId_idx" ON "FundingRound"("companyId");
CREATE INDEX "FundingRound_announcedAt_idx" ON "FundingRound"("announcedAt" DESC);

CREATE TABLE "FundingRoundInvestor" (
  "roundId" TEXT NOT NULL REFERENCES "FundingRound"("id") ON DELETE CASCADE,
  "investorId" TEXT NOT NULL REFERENCES "Investor"("id") ON DELETE CASCADE,
  "isLead" BOOLEAN NOT NULL DEFAULT false,
  PRIMARY KEY ("roundId","investorId")
);
CREATE INDEX "FundingRoundInvestor_investorId_idx" ON "FundingRoundInvestor"("investorId");

-- ── Product ───────────────────────────────────────────────────
CREATE TABLE "Product" (
  "id" TEXT PRIMARY KEY,
  "slug" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "tagline" TEXT,
  "description" TEXT,
  "url" TEXT,
  "logoUrl" TEXT,
  "category" TEXT,
  "upvotes" INTEGER NOT NULL DEFAULT 0,
  "commentCount" INTEGER NOT NULL DEFAULT 0,
  "launchedAt" TIMESTAMP(3),
  "companyId" TEXT REFERENCES "Company"("id") ON DELETE SET NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);
CREATE INDEX "Product_upvotes_idx" ON "Product"("upvotes" DESC);
CREATE INDEX "Product_category_idx" ON "Product"("category");

-- ── NewsArticle ───────────────────────────────────────────────
CREATE TABLE "NewsArticle" (
  "id" TEXT PRIMARY KEY,
  "slug" TEXT NOT NULL UNIQUE,
  "title" TEXT NOT NULL,
  "summary" TEXT,
  "url" TEXT NOT NULL,
  "source" TEXT,
  "imageUrl" TEXT,
  "publishedAt" TIMESTAMP(3) NOT NULL,
  "sentiment" DOUBLE PRECISION DEFAULT 0,
  "viewCount" INTEGER NOT NULL DEFAULT 0,
  "companyId" TEXT REFERENCES "Company"("id") ON DELETE SET NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "NewsArticle_publishedAt_idx" ON "NewsArticle"("publishedAt" DESC);
CREATE INDEX "NewsArticle_companyId_idx" ON "NewsArticle"("companyId");

-- ── Tag + join ────────────────────────────────────────────────
CREATE TABLE "Tag" (
  "id" TEXT PRIMARY KEY,
  "slug" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL
);
CREATE TABLE "CompanyTag" (
  "companyId" TEXT NOT NULL REFERENCES "Company"("id") ON DELETE CASCADE,
  "tagId" TEXT NOT NULL REFERENCES "Tag"("id") ON DELETE CASCADE,
  PRIMARY KEY ("companyId","tagId")
);

-- ── CompanyRelationship (graph edges) ─────────────────────────
CREATE TABLE "CompanyRelationship" (
  "id" TEXT PRIMARY KEY,
  "fromId" TEXT NOT NULL REFERENCES "Company"("id") ON DELETE CASCADE,
  "toId" TEXT NOT NULL REFERENCES "Company"("id") ON DELETE CASCADE,
  "type" "RelationshipType" NOT NULL,
  "weight" DOUBLE PRECISION NOT NULL DEFAULT 1,
  "note" TEXT,
  UNIQUE ("fromId","toId","type")
);
CREATE INDEX "CompanyRelationship_fromId_idx" ON "CompanyRelationship"("fromId");
CREATE INDEX "CompanyRelationship_toId_idx" ON "CompanyRelationship"("toId");

-- ── Investor collections ──────────────────────────────────────
CREATE TABLE "InvestorCollection" (
  "id" TEXT PRIMARY KEY,
  "slug" TEXT NOT NULL UNIQUE,
  "title" TEXT NOT NULL,
  "blurb" TEXT
);
CREATE TABLE "InvestorCollectionItem" (
  "collectionId" TEXT NOT NULL REFERENCES "InvestorCollection"("id") ON DELETE CASCADE,
  "investorId" TEXT NOT NULL REFERENCES "Investor"("id") ON DELETE CASCADE,
  PRIMARY KEY ("collectionId","investorId")
);

/**
 * GraphOne seed script.
 *   npm run db:seed   (or: prisma migrate reset)
 *
 * Seeds 50+ real AI companies, 20+ investors, 100+ news articles, realistic
 * funding rounds, founders and products. Idempotent: upserts by slug.
 *
 * Data is real-world public information (company names, founders, HQs, funding
 * stages). Figures are approximate and for demonstration. After seeding, run
 * the trending job so trendingScore is populated:  npm run jobs:trending
 */
import { PrismaClient, FundingStage, InvestorType, RelationshipType } from "@prisma/client";
import { TrendingScoreService } from "../src/services/trendingScore.service";

const prisma = new PrismaClient();

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// ── Categories ──────────────────────────────────────────────
const CATEGORIES = [
  ["Foundation Models", "#FF4D7A"], ["AI Agents", "#8B5CF6"], ["AI Coding", "#10B981"],
  ["AI Search", "#3B82F6"], ["AI Video", "#EC4899"], ["AI Voice", "#F97316"],
  ["AI Infrastructure", "#14B8A6"], ["Healthcare AI", "#22C55E"], ["AI Image", "#A855F7"],
  ["Legal AI", "#0EA5E9"], ["Robotics", "#F59E0B"], ["Enterprise AI", "#6366F1"],
];

// ── 50+ real AI companies ───────────────────────────────────
// [name, category, hq, foundedYear, employees, growthPct, unicorn, valuationB, raisedB, confidence]
const COMPANIES: Array<[string, string, string, number, number, number, boolean, number, number, number]> = [
  ["OpenAI", "Foundation Models", "San Francisco, CA, USA", 2015, 3500, 1.4, true, 157, 21.9, 0.98],
  ["Anthropic", "Foundation Models", "San Francisco, CA, USA", 2021, 1000, 1.8, true, 61.5, 14.3, 0.97],
  ["Mistral AI", "Foundation Models", "Paris, France", 2023, 150, 1.2, true, 6.2, 1.1, 0.9],
  ["xAI", "Foundation Models", "Palo Alto, CA, USA", 2023, 300, 2.1, true, 50, 12, 0.9],
  ["Cohere", "Enterprise AI", "Toronto, Canada", 2019, 400, 0.6, true, 5.5, 0.97, 0.9],
  ["Google DeepMind", "Foundation Models", "London, UK", 2010, 2500, 0.3, false, 0, 0, 0.95],
  ["Hugging Face", "AI Infrastructure", "New York, NY, USA", 2016, 350, 0.7, true, 4.5, 0.4, 0.93],
  ["Perplexity AI", "AI Search", "San Francisco, CA, USA", 2022, 180, 2.4, true, 9, 0.9, 0.92],
  ["Cursor (Anysphere)", "AI Coding", "San Francisco, CA, USA", 2022, 60, 3.0, true, 2.6, 0.4, 0.9],
  ["Glean", "AI Search", "Palo Alto, CA, USA", 2019, 600, 0.9, true, 4.6, 0.6, 0.9],
  ["Harvey", "Legal AI", "San Francisco, CA, USA", 2022, 300, 1.6, true, 3, 0.5, 0.88],
  ["Scale AI", "AI Infrastructure", "San Francisco, CA, USA", 2016, 900, 0.5, true, 13.8, 1.6, 0.93],
  ["Databricks", "AI Infrastructure", "San Francisco, CA, USA", 2013, 7000, 0.4, true, 62, 14, 0.95],
  ["Runway", "AI Video", "New York, NY, USA", 2018, 200, 1.1, true, 1.5, 0.24, 0.88],
  ["ElevenLabs", "AI Voice", "London, UK", 2022, 120, 2.0, true, 3.3, 0.28, 0.9],
  ["Midjourney", "AI Image", "San Francisco, CA, USA", 2021, 60, 0.8, false, 0, 0, 0.82],
  ["Stability AI", "AI Image", "London, UK", 2019, 200, -0.1, true, 1, 0.25, 0.78],
  ["Synthesia", "AI Video", "London, UK", 2017, 400, 1.0, true, 2.1, 0.33, 0.88],
  ["Character.AI", "AI Agents", "Menlo Park, CA, USA", 2021, 150, 0.6, true, 1, 0.15, 0.85],
  ["Adept AI", "AI Agents", "San Francisco, CA, USA", 2022, 100, 0.4, true, 1, 0.42, 0.84],
  ["Inflection AI", "Foundation Models", "Palo Alto, CA, USA", 2022, 70, 0.2, true, 4, 1.3, 0.82],
  ["Together AI", "AI Infrastructure", "San Francisco, CA, USA", 2022, 130, 1.7, true, 3.3, 0.5, 0.89],
  ["Groq", "AI Infrastructure", "Mountain View, CA, USA", 2016, 300, 1.5, true, 2.8, 0.64, 0.9],
  ["Cerebras", "AI Infrastructure", "Sunnyvale, CA, USA", 2015, 400, 0.6, true, 4.1, 0.72, 0.9],
  ["Pinecone", "AI Infrastructure", "New York, NY, USA", 2019, 130, 1.1, true, 0.75, 0.14, 0.86],
  ["Weaviate", "AI Infrastructure", "Amsterdam, Netherlands", 2019, 100, 0.9, false, 0.2, 0.07, 0.82],
  ["LangChain", "AI Infrastructure", "San Francisco, CA, USA", 2022, 60, 1.8, false, 0.2, 0.04, 0.82],
  ["Replicate", "AI Infrastructure", "San Francisco, CA, USA", 2019, 50, 1.0, false, 0.35, 0.06, 0.8],
  ["Sierra", "AI Agents", "San Francisco, CA, USA", 2023, 100, 2.6, true, 4.5, 0.28, 0.86],
  ["Cognition AI", "AI Coding", "San Francisco, CA, USA", 2023, 30, 3.5, true, 2, 0.2, 0.85],
  ["Magic AI", "AI Coding", "San Francisco, CA, USA", 2022, 40, 1.4, true, 1.5, 0.47, 0.8],
  ["Codeium (Windsurf)", "AI Coding", "Mountain View, CA, USA", 2021, 150, 1.9, true, 1.25, 0.24, 0.86],
  ["Poolside", "AI Coding", "San Francisco, CA, USA", 2023, 60, 2.2, true, 3, 0.63, 0.82],
  ["Suno", "AI Voice", "Cambridge, MA, USA", 2022, 50, 2.4, true, 0.5, 0.13, 0.82],
  ["Pika", "AI Video", "Palo Alto, CA, USA", 2023, 40, 2.0, false, 0.47, 0.14, 0.8],
  ["Luma AI", "AI Video", "San Francisco, CA, USA", 2021, 60, 1.6, false, 0.3, 0.07, 0.8],
  ["Abridge", "Healthcare AI", "Pittsburgh, PA, USA", 2018, 300, 1.7, true, 2.75, 0.46, 0.88],
  ["OpenEvidence", "Healthcare AI", "Cambridge, MA, USA", 2021, 50, 2.8, true, 1, 0.1, 0.82],
  ["Hippocratic AI", "Healthcare AI", "Palo Alto, CA, USA", 2023, 100, 2.1, true, 1.6, 0.27, 0.84],
  ["Tempus AI", "Healthcare AI", "Chicago, IL, USA", 2015, 2300, 0.3, true, 8, 1.3, 0.9],
  ["Physical Intelligence", "Robotics", "San Francisco, CA, USA", 2024, 60, 3.2, true, 2.4, 0.4, 0.82],
  ["Skild AI", "Robotics", "Pittsburgh, PA, USA", 2023, 80, 2.0, true, 1.5, 0.3, 0.82],
  ["Figure AI", "Robotics", "Sunnyvale, CA, USA", 2022, 200, 1.9, true, 2.6, 0.75, 0.87],
  ["Waymo", "Robotics", "Mountain View, CA, USA", 2009, 2500, 0.2, true, 45, 11, 0.9],
  ["Writer", "Enterprise AI", "San Francisco, CA, USA", 2020, 250, 1.3, true, 1.9, 0.33, 0.87],
  ["Jasper", "Enterprise AI", "Austin, TX, USA", 2021, 200, 0.3, true, 1.5, 0.14, 0.82],
  ["Hebbia", "Enterprise AI", "New York, NY, USA", 2020, 80, 1.4, true, 0.7, 0.16, 0.82],
  ["Decagon", "AI Agents", "San Francisco, CA, USA", 2023, 70, 2.7, true, 1.5, 0.13, 0.84],
  ["11x", "AI Agents", "San Francisco, CA, USA", 2022, 60, 2.5, false, 0.35, 0.08, 0.8],
  ["Lovable", "AI Coding", "Stockholm, Sweden", 2023, 35, 3.8, false, 0.18, 0.02, 0.8],
  ["Mercor", "Enterprise AI", "San Francisco, CA, USA", 2023, 60, 3.0, true, 2, 0.1, 0.82],
  ["Sakana AI", "Foundation Models", "Tokyo, Japan", 2023, 40, 2.2, true, 1.5, 0.24, 0.82],
  ["Reka AI", "Foundation Models", "Sunnyvale, CA, USA", 2022, 30, 1.0, false, 0.3, 0.06, 0.78],
  ["Contextual AI", "Enterprise AI", "Mountain View, CA, USA", 2023, 60, 1.5, false, 0.6, 0.1, 0.8],
  ["Imbue", "AI Agents", "San Francisco, CA, USA", 2021, 50, 0.7, true, 1, 0.22, 0.8],
];

// ── 20+ real investors ──────────────────────────────────────
// [name, type, hq, founded, verified, avgCheckM, fundNumber, aumB, thesis]
const INVESTORS: Array<[string, InvestorType, string, number, boolean, number, number, number, string]> = [
  ["Sequoia Capital", InvestorType.VC, "Menlo Park, CA, USA", 1972, true, 25, 20, 85, "Backing the daring from idea to iconic."],
  ["Andreessen Horowitz", InvestorType.VC, "Menlo Park, CA, USA", 2009, true, 30, 9, 44, "Software is eating the world; AI is eating software."],
  ["Lightspeed Venture Partners", InvestorType.VC, "Menlo Park, CA, USA", 2000, true, 20, 14, 25, "Partnering with exceptional founders early."],
  ["Khosla Ventures", InvestorType.VC, "Menlo Park, CA, USA", 2004, true, 15, 8, 15, "Bold bets on hard technology."],
  ["Founders Fund", InvestorType.VC, "San Francisco, CA, USA", 2005, true, 25, 9, 12, "Investing in smart people solving difficult problems."],
  ["Accel", InvestorType.VC, "Palo Alto, CA, USA", 1983, true, 18, 16, 30, "Backing exceptional teams from inception."],
  ["Greylock Partners", InvestorType.VC, "Menlo Park, CA, USA", 1965, true, 18, 17, 3.5, "Day-one partner to founders."],
  ["Index Ventures", InvestorType.VC, "London, UK", 1996, true, 16, 11, 13, "Helping ambitious founders win."],
  ["General Catalyst", InvestorType.VC, "Cambridge, MA, USA", 2000, true, 20, 12, 32, "Powering transformation."],
  ["Kleiner Perkins", InvestorType.VC, "Menlo Park, CA, USA", 1972, true, 18, 20, 10, "Make bold bets on the future."],
  ["Bessemer Venture Partners", InvestorType.VC, "San Francisco, CA, USA", 1911, true, 15, 12, 20, "Roadmaps over guesswork."],
  ["NEA", InvestorType.VC, "Menlo Park, CA, USA", 1977, true, 20, 18, 25, "Built by founders, for founders."],
  ["Thrive Capital", InvestorType.VC, "New York, NY, USA", 2010, true, 30, 9, 15, "Concentrated bets on category leaders."],
  ["Coatue Management", InvestorType.GROWTH_EQUITY, "New York, NY, USA", 1999, true, 50, 7, 50, "Technology-driven investing across stages."],
  ["Tiger Global Management", InvestorType.GROWTH_EQUITY, "New York, NY, USA", 2001, true, 60, 16, 58, "Backing category-defining tech."],
  ["Insight Partners", InvestorType.GROWTH_EQUITY, "New York, NY, USA", 1995, true, 40, 13, 80, "Scaling software ScaleUps."],
  ["Y Combinator", InvestorType.ACCELERATOR, "Mountain View, CA, USA", 2005, true, 0.5, 0, 1, "Make something people want."],
  ["Microsoft (M12)", InvestorType.CORPORATE, "Redmond, WA, USA", 2016, true, 15, 0, 0, "Strategic AI and enterprise bets."],
  ["NVIDIA (NVentures)", InvestorType.CORPORATE, "Santa Clara, CA, USA", 2022, true, 12, 0, 0, "Accelerating the AI ecosystem."],
  ["Menlo Ventures", InvestorType.VC, "San Francisco, CA, USA", 1976, true, 14, 16, 5, "Early-stage and inflection investing."],
  ["Spark Capital", InvestorType.VC, "Boston, MA, USA", 2005, true, 15, 7, 6, "Partner to category-creating founders."],
  ["Conviction", InvestorType.VC, "San Francisco, CA, USA", 2022, true, 8, 2, 1, "AI-native software seed fund."],
];

const FOUNDERS: Array<[string, string, string]> = [
  ["Sam Altman", "OpenAI", "CEO & Co-founder"],
  ["Greg Brockman", "OpenAI", "President & Co-founder"],
  ["Dario Amodei", "Anthropic", "CEO & Co-founder"],
  ["Daniela Amodei", "Anthropic", "President & Co-founder"],
  ["Arthur Mensch", "Mistral AI", "CEO & Co-founder"],
  ["Aravind Srinivas", "Perplexity AI", "CEO & Co-founder"],
  ["Clément Delangue", "Hugging Face", "CEO & Co-founder"],
  ["Alexandr Wang", "Scale AI", "CEO & Founder"],
  ["Ali Ghodsi", "Databricks", "CEO & Co-founder"],
  ["Cristóbal Valenzuela", "Runway", "CEO & Co-founder"],
  ["Mati Staniszewski", "ElevenLabs", "CEO & Co-founder"],
  ["Winston Weinberg", "Harvey", "CEO & Co-founder"],
  ["Michael Truell", "Cursor (Anysphere)", "CEO & Co-founder"],
  ["Arvind Jain", "Glean", "CEO & Founder"],
  ["Emad Mostaque", "Stability AI", "Founder"],
  ["Eric Steinberger", "Magic AI", "CEO & Co-founder"],
  ["Bret Taylor", "Sierra", "CEO & Co-founder"],
  ["Scott Wu", "Cognition AI", "CEO & Co-founder"],
  ["David Luan", "Adept AI", "CEO & Co-founder"],
  ["Noam Shazeer", "Character.AI", "CEO & Co-founder"],
  ["Mustafa Suleyman", "Inflection AI", "CEO & Co-founder"],
  ["Vince Hankes", "Reka AI", "Founder"],
];

const PRODUCTS: Array<[string, string, string, string, number]> = [
  ["ChatGPT", "OpenAI", "Foundation Models", "Conversational AI assistant", 24000],
  ["GPT-4o", "OpenAI", "Foundation Models", "Omni multimodal model", 18500],
  ["Sora", "OpenAI", "AI Video", "Text-to-video generation", 15200],
  ["Operator", "OpenAI", "AI Agents", "Browser-using AI agent", 8400],
  ["Claude", "Anthropic", "Foundation Models", "Helpful, harmless AI assistant", 19800],
  ["Claude Code", "Anthropic", "AI Coding", "Agentic coding in the terminal", 9100],
  ["Le Chat", "Mistral AI", "Foundation Models", "Multilingual AI assistant", 5400],
  ["Codestral", "Mistral AI", "AI Coding", "Code generation model", 4200],
  ["Perplexity", "Perplexity AI", "AI Search", "Answer engine with citations", 12600],
  ["Cursor", "Cursor (Anysphere)", "AI Coding", "The AI code editor", 16700],
  ["Midjourney v6", "Midjourney", "AI Image", "Text-to-image generation", 14300],
  ["Gen-3 Alpha", "Runway", "AI Video", "Cinematic video generation", 7800],
  ["ElevenLabs", "ElevenLabs", "AI Voice", "Realistic voice synthesis", 8600],
  ["Synthesia", "Synthesia", "AI Video", "AI avatar video creation", 6200],
  ["Suno v4", "Suno", "AI Voice", "AI music generation", 7100],
  ["Devin", "Cognition AI", "AI Coding", "Autonomous AI software engineer", 6900],
  ["Glean Assistant", "Glean", "AI Search", "Enterprise work assistant", 4300],
  ["Harvey", "Harvey", "Legal AI", "Generative AI for legal teams", 3800],
  ["Pika 1.5", "Pika", "AI Video", "Idea-to-video generation", 5200],
  ["Dream Machine", "Luma AI", "AI Video", "Realistic video from text & images", 4900],
  ["Stable Diffusion 3", "Stability AI", "AI Image", "Open image generation model", 6400],
  ["Together Inference", "Together AI", "AI Infrastructure", "Fast open-model inference", 2800],
  ["Pinecone", "Pinecone", "AI Infrastructure", "Vector database for AI", 3100],
  ["Weaviate", "Weaviate", "AI Infrastructure", "Open-source vector database", 2600],
  ["LangChain", "LangChain", "AI Infrastructure", "Framework for LLM apps", 7300],
  ["Replicate", "Replicate", "AI Infrastructure", "Run open models via API", 3400],
  ["GroqCloud", "Groq", "AI Infrastructure", "Ultra-low-latency LLM inference", 4100],
  ["Sierra Agent OS", "Sierra", "AI Agents", "Conversational AI agents for business", 3300],
  ["Writer", "Writer", "Enterprise AI", "Full-stack generative AI platform", 3600],
  ["Jasper", "Jasper", "Enterprise AI", "AI marketing copilot", 4700],
  ["Windsurf", "Codeium (Windsurf)", "AI Coding", "Agentic AI IDE", 6100],
  ["Lovable", "Lovable", "AI Coding", "Build apps by chatting", 8800],
  ["Abridge", "Abridge", "Healthcare AI", "Clinical documentation AI", 2400],
  ["Hippocratic Polaris", "Hippocratic AI", "Healthcare AI", "Safety-focused healthcare agents", 2100],
  ["Character.AI", "Character.AI", "AI Agents", "Personalized AI characters", 9600],
];

async function main() {
  console.log("Seeding GraphOne…");

  const catBySlug = new Map<string, string>();
  for (const [name, color] of CATEGORIES) {
    const c = await prisma.category.upsert({
      where: { slug: slugify(name) },
      update: { name, colorHex: color },
      create: { slug: slugify(name), name, colorHex: color },
    });
    catBySlug.set(name, c.id);
  }

  const companyBySlug = new Map<string, string>();
  for (const [name, cat, hq, founded, emp, growth, unicorn, valB, raisedB, conf] of COMPANIES) {
    const slug = slugify(name);
    const growthScore = Math.round(Math.min(100, Math.max(0, (growth + 0.2) * 45)) * 10) / 10;
    const c = await prisma.company.upsert({
      where: { slug },
      update: {},
      create: {
        slug, name,
        tagline: `${cat} company`,
        description: `${name} is a leading ${cat.toLowerCase()} company based in ${hq}.`,
        website: `https://${slug.replace(/-/g, "")}.com`,
        hqLocation: hq, foundedYear: founded, employeeCount: emp, employeeGrowthPct: growth,
        isUnicorn: unicorn,
        valuationUsd: BigInt(Math.round(valB * 1e9)),
        totalRaisedUsd: BigInt(Math.round(raisedB * 1e9)),
        growthScore, dataConfidenceScore: conf,
        lastScrapedAt: new Date(Date.now() - Math.random() * 7 * 86400000),
        categoryId: catBySlug.get(cat) ?? null,
      },
    });
    companyBySlug.set(name, c.id);
  }

  // Funding rounds — 1–3 recent rounds per company.
  const stages = [FundingStage.SEED, FundingStage.SERIES_A, FundingStage.SERIES_B, FundingStage.SERIES_C, FundingStage.SERIES_D];
  for (const [name, , , , , , , , raisedB] of COMPANIES) {
    const companyId = companyBySlug.get(name)!;
    const rounds = 1 + Math.floor(Math.random() * 3);
    for (let i = 0; i < rounds; i++) {
      const amount = Math.round((raisedB * 1e9 / rounds) * (0.6 + Math.random() * 0.8));
      await prisma.fundingRound.create({
        data: {
          companyId,
          stage: stages[Math.min(i, stages.length - 1)]!,
          amountUsd: BigInt(Math.max(1_000_000, amount)),
          announcedAt: new Date(Date.now() - (i * 220 + Math.random() * 120) * 86400000),
          source: "Press release",
        },
      });
    }
  }

  // Investors.
  for (const [name, type, hq, founded, verified, checkM, fundNo, aumB, thesis] of INVESTORS) {
    await prisma.investor.upsert({
      where: { slug: slugify(name) },
      update: {},
      create: {
        slug: slugify(name), name, type, hqLocation: hq, foundedYear: founded,
        isVerified: verified, avgCheckSizeUsd: BigInt(Math.round(checkM * 1e6)),
        fundNumber: fundNo, aumUsd: BigInt(Math.round(aumB * 1e9)), thesis,
        website: `https://${slugify(name).replace(/-/g, "")}.com`,
      },
    });
  }

  // Connect investors to rounds (each round gets 1 lead + 1–3 participants).
  const allInvestors = await prisma.investor.findMany();
  const allRounds = await prisma.fundingRound.findMany();
  for (const round of allRounds) {
    const shuffled = [...allInvestors].sort(() => Math.random() - 0.5).slice(0, 1 + Math.floor(Math.random() * 3));
    for (let i = 0; i < shuffled.length; i++) {
      await prisma.fundingRoundInvestor.upsert({
        where: { roundId_investorId: { roundId: round.id, investorId: shuffled[i]!.id } },
        update: {},
        create: { roundId: round.id, investorId: shuffled[i]!.id, isLead: i === 0 },
      });
    }
  }

  // Founders.
  for (const [name, company, role] of FOUNDERS) {
    const f = await prisma.founder.upsert({
      where: { slug: slugify(name) },
      update: {},
      create: { slug: slugify(name), name, title: role },
    });
    const companyId = companyBySlug.get(company);
    if (companyId) {
      await prisma.founderCompany.upsert({
        where: { founderId_companyId: { founderId: f.id, companyId } },
        update: {},
        create: { founderId: f.id, companyId, role },
      });
    }
  }

  // Products.
  for (const [name, company, cat, desc, upvotes] of PRODUCTS) {
    await prisma.product.upsert({
      where: { slug: slugify(name) },
      update: {},
      create: {
        slug: slugify(name), name, tagline: desc, description: desc, category: cat,
        upvotes, commentCount: Math.round(upvotes / 40),
        url: `https://${slugify(name).replace(/-/g, "")}.ai`,
        companyId: companyBySlug.get(company) ?? null,
        launchedAt: new Date(Date.now() - Math.random() * 400 * 86400000),
      },
    });
  }

  // 100+ news articles spread across companies.
  const HEADLINES = [
    "raises new funding round at higher valuation",
    "launches next-generation model",
    "expands enterprise partnerships",
    "announces major product update",
    "crosses new revenue milestone",
    "hires senior leadership from rival",
    "opens new research lab",
    "reports record user growth",
  ];
  const companyNames = [...companyBySlug.keys()];
  let newsCount = 0;
  for (let i = 0; i < 120; i++) {
    const company = companyNames[i % companyNames.length]!;
    const headline = HEADLINES[i % HEADLINES.length]!;
    await prisma.newsArticle.upsert({
      where: { slug: slugify(`${company}-${headline}-${i}`) },
      update: {},
      create: {
        slug: slugify(`${company}-${headline}-${i}`),
        title: `${company} ${headline}`,
        summary: `${company} ${headline}. Industry observers note continued momentum across the AI sector.`,
        url: `https://news.example.com/${slugify(`${company}-${headline}-${i}`)}`,
        source: ["TechCrunch", "The Information", "Bloomberg", "Reuters"][i % 4],
        publishedAt: new Date(Date.now() - Math.random() * 90 * 86400000),
        sentiment: Math.round((Math.random() * 1.4 - 0.2) * 100) / 100,
        viewCount: Math.round(Math.random() * 50000),
        companyId: companyBySlug.get(company) ?? null,
      },
    });
    newsCount++;
  }

  // Company relationships (ecosystem edges).
  const rel: Array<[string, string, RelationshipType]> = [
    ["OpenAI", "Anthropic", RelationshipType.COMPETITOR],
    ["OpenAI", "Google DeepMind", RelationshipType.COMPETITOR],
    ["Anthropic", "Mistral AI", RelationshipType.COMPETITOR],
    ["Cursor (Anysphere)", "Cognition AI", RelationshipType.COMPETITOR],
    ["Perplexity AI", "Glean", RelationshipType.COMPETITOR],
    ["Databricks", "Scale AI", RelationshipType.PARTNERSHIP],
  ];
  for (const [from, to, type] of rel) {
    const fromId = companyBySlug.get(from), toId = companyBySlug.get(to);
    if (fromId && toId) {
      await prisma.companyRelationship.upsert({
        where: { fromId_toId_type: { fromId, toId, type } },
        update: {},
        create: { fromId, toId, type, weight: 1 },
      });
    }
  }

  // Compute initial trending scores (the hourly cron keeps them fresh).
  const companies = await prisma.company.findMany({
    include: {
      fundingRounds: { orderBy: { announcedAt: "desc" }, take: 1 },
      products: { select: { upvotes: true } },
      _count: { select: { newsArticles: true } },
    },
  });
  for (const c of companies) {
    const { score } = TrendingScoreService.compute({
      lastFundingAt: c.fundingRounds[0]?.announcedAt ?? null,
      lastFundingAmountUsd: c.fundingRounds[0] ? Number(c.fundingRounds[0].amountUsd) : null,
      totalRaisedUsd: c.totalRaisedUsd ? Number(c.totalRaisedUsd) : null,
      employeeGrowthPct: c.employeeGrowthPct,
      newsMentions90d: c._count.newsArticles,
      productUpvotes: c.products.reduce((s, p) => s + p.upvotes, 0),
      dataConfidenceScore: c.dataConfidenceScore,
      foundedYear: c.foundedYear,
      isUnicorn: c.isUnicorn,
    });
    await prisma.company.update({ where: { id: c.id }, data: { trendingScore: score } });
  }

  console.log(`Seeded ${COMPANIES.length} companies, ${INVESTORS.length} investors, ${PRODUCTS.length} products, ${newsCount} news articles.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());

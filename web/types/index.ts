export interface Founder {
  name: string;
  role: string;
}

export interface FundingRound {
  stage: string;
  amount: string;
  amountM: number;
  date: string;
  year: number;
  leads: string[];
}

export interface Company {
  slug: string;
  name: string;
  cat: string;
  catColor: string;
  hq: string;
  founded: number;
  employees: number;
  growth: number;
  unicorn: boolean;
  valuation: string;
  raised: string;
  tagline: string;
  desc: string;
  tags: string[];
  founders: Founder[];
  productSlugs: string[];
  investorSlugs: string[];
  rounds: FundingRound[];
  similar: string[];
  timeline: { year: string; label: string }[];
  website: string;
}

export interface InvestorPartner {
  name: string;
  role: string;
}

export interface InvestorSector {
  label: string;
  v: number;
  c: string;
}

export interface CoInvestorRef {
  slug: string;
  name: string;
  shared: number;
}

export interface RecentInvestment {
  companySlug: string;
  company: string;
  cat: string;
  stage: string;
  amount: string;
  role: string;
}

export interface VelocityPoint {
  label: string;
  deals: number;
}

export interface Investor {
  slug: string;
  name: string;
  type: string;
  hq: string;
  founded: number;
  verified: boolean;
  avgCheck: string;
  fundNumber: number;
  aum: string;
  thesis: string;
  partners: InvestorPartner[];
  sectors: InvestorSector[];
  stages: string[];
  portfolioSlugs: string[];
  portfolioCount: number;
  deals90d: number;
  coInvestors: CoInvestorRef[];
  recent: RecentInvestment[];
  velocity: VelocityPoint[];
}

export interface Product {
  slug: string;
  name: string;
  companySlug: string;
  company: string;
  category: string;
  categoryColor: string;
  desc: string;
  upvotes: number;
  comments: number;
}

export interface NewsItem {
  slug: string;
  title: string;
  company: string;
  companySlug: string;
  domain: string;
  kind: string;
  daysAgo: number;
  hoursAgo: number | null;
  comments: number;
}

export interface Job {
  slug: string;
  title: string;
  company: string;
  companySlug: string;
  dept: string;
  type: string;
  location: string;
  salary: string;
  postedDays: number;
}

export interface TrendingTag {
  label: string;
  count: number;
}

export interface Stats {
  companies: string;
  totalFunding: string;
  rounds: string;
  unicorns: string;
  products: string;
  investors: string;
}

export interface GOData {
  CAT: Record<string, string>;
  companies: Company[];
  investors: Investor[];
  products: Product[];
  news: NewsItem[];
  jobs: Job[];
  trendingTags: TrendingTag[];
  stats: Stats;
  companyBySlug: Record<string, Company>;
  investorBySlug: Record<string, Investor>;
  productBySlug: Record<string, Product>;
  findCompanySlug: (name: string) => string | undefined;
  findInvestorSlug: (name: string) => string | undefined;
  findProductSlug: (name: string) => string | undefined;
}

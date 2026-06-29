# GraphOne - AI Economy Intelligence Platform

The global intelligence layer for AI: companies, investors, products, founders, and funding rounds — connected in one graph.

**Live Frontend:** https://graph-one-three.vercel.app/  
**Backend API:** https://graphone-k6m8.onrender.com/api/v1  
**API Docs (Swagger):** https://graphone-k6m8.onrender.com/docs
**GitHub:** https://github.com/Nandika-Gupta/GraphOne  

> First request after inactivity may take ~50s (Render free tier spin-up).

---

## Pages Built

| Page | Features |
|---|---|
| Home `/home` | Trending companies, stats bar, activity feed |
| AI Startups `/startups` | Filter by category, sort by trending/funded/new |
| Company Detail `/startups/:slug` | Timeline, funding history, investors, founders, products, similar companies |
| Investors `/investors` | Filter by type, most active ranking |
| Investor Profile `/investors/:slug` | Thesis, portfolio concentration, investment velocity, co-investor network |
| AI Products `/products` | Category tabs, upvotes, popular right now |
| News `/news` | Paginated feed, trending articles |
| Capital Graph `/capital-graph` | Ecosystem graph view |
| Search | Live typeahead across all entities, `/` keyboard shortcut, dark mode toggle |

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 14 App Router, TypeScript (strict) |
| Styling | CSS custom properties (design token system) |
| Icons | Lucide React |
| Backend | Node.js, Express, TypeScript |
| Database | Supabase (PostgreSQL), Prisma ORM |
| Validation | Zod |
| Deployment | Vercel (frontend), Render (backend) |

---

## Local Development

### Backend

```bash
cd backend
npm install
cp .env.example .env
npx prisma migrate deploy
npx prisma db seed
npm run dev
```

Environment variables (`backend/.env`):

```
DATABASE_URL=your_supabase_postgres_url
API_KEYS=dev-key-123
PORT=4000
CORS_ORIGIN=http://localhost:3000
```

API runs at `http://localhost:4000/api/v1`

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Environment variables (`frontend/.env.local`):

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api/v1
API_KEY=dev-key-123
```

App runs at `http://localhost:3000`

---

## API Endpoints

Base URL: `https://graphone-k6m8.onrender.com/api/v1`

All responses use the envelope: `{ data, meta, error }`  
GET endpoints are public. Write endpoints require `X-API-Key` header.

### Companies

| Method | Endpoint | Description |
|---|---|---|
| GET | `/companies` | List with filters: `category`, `sort`, `limit`, `cursor` |
| GET | `/companies/trending` | Top 10 by trending score (cached) |
| GET | `/companies/:slug` | Full profile with funding, founders, investors, products |
| GET | `/companies/:slug/funding` | Funding round timeline |
| GET | `/companies/:slug/products` | Company's products |
| POST | `/companies` | Create company (requires `X-API-Key`) |

### Investors

| Method | Endpoint | Description |
|---|---|---|
| GET | `/investors` | List with filters |
| GET | `/investors/most-active` | Ranked by deal count |
| GET | `/investors/:slug` | Full profile + portfolio |
| GET | `/investors/:slug/investments` | Paginated investment history |
| GET | `/investors/:slug/co-investors` | Co-investor syndication network |

### Products & News

| Method | Endpoint | Description |
|---|---|---|
| GET | `/products` | List with category filter, sort by popular |
| GET | `/products/:slug` | Product detail |
| GET | `/news` | Paginated news feed |
| GET | `/news/trending` | Most read last 24h |

### Utility

| Method | Endpoint | Description |
|---|---|---|
| GET | `/search?q=` | Cross-entity search: companies, investors, products |
| GET | `/stats` | Platform aggregate stats (cached) |
| GET | `/feed` | Ranked activity feed: funding + news (cached) |
| GET | `/founders/:slug` | Founder profile |
| GET | `/health` | Health check |

---

## Trending Score Formula

Each company receives a `trendingScore` (0–100) computed from 8 weighted signals:

| Signal | Weight | Rationale |
|---|---|---|
| Employee growth % | 25% | Strongest real-world momentum signal |
| Funding recency (last 90 days) | 20% | Fresh capital = active growth |
| News mentions (last 30 days) | 15% | Media attention drives discovery |
| Product upvotes | 15% | Community validation |
| Number of investors | 10% | Broad institutional interest |
| Founding recency | 5% | Newer companies trend faster |
| Unicorn status | 5% | Status multiplier |
| Social/engagement signals | 5% | Secondary amplification |

Each signal is normalised to 0–1 across all companies, multiplied by its weight, then summed to produce the final score. Scores are recomputed **hourly** via a cron job and cached with TTL.

---

## Database Seed

```bash
cd backend && npx prisma db seed
```

Seeds: **55 companies · 22 investors · 35 products · funding rounds · founders · news articles**

---

## What Would I Build Next (With 2 More Days)

1. **Founder graph** — link founders across companies and show career trajectory timelines.
2. **Funding alerts** — webhook-based notifications when a watched company raises a new round.
3. **Competitive intelligence** — auto-cluster companies by embedding similarity to surface non-obvious competitors.
4. **Auth + watchlists** — user accounts with saved companies, followed investors, and a personalised feed.

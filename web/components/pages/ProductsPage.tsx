"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Flame, Heart, Sparkles, ChevronDown, TrendingUp, Mail, Trophy, ArrowRight, ExternalLink } from "lucide-react";
import { GODATA } from "@/lib/data";
import { LogoTile } from "@/components/ui/LogoTile";

function pillBtn(on: boolean): React.CSSProperties {
  return {
    display: "inline-flex", alignItems: "center", gap: 6, height: 34, padding: "0 14px", borderRadius: 999,
    border: on ? "1px solid var(--rose-200)" : "1px solid transparent", background: on ? "var(--rose-50)" : "transparent",
    color: on ? "var(--rose-600)" : "var(--gray-500)", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-sans)",
  };
}

function SponsoredRow() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, padding: 16, margin: "8px 0", borderRadius: 14, background: "linear-gradient(120deg,#F3ECFF,#EEE7FF)" }}>
      <div style={{ width: 42, height: 42, borderRadius: 12, background: "var(--cat-agents)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>G</span>
      </div>
      <div style={{ flex: 1 }}>
        <span style={{ fontSize: 10.5, fontWeight: 800, color: "var(--cat-agents)", letterSpacing: "0.05em" }}>SPONSORED</span>
        <div style={{ fontSize: 15, fontWeight: 700, color: "var(--gray-900)" }}>Build AI agents in minutes</div>
        <div style={{ fontSize: 13, color: "var(--gray-500)" }}>The all-in-one platform to design, deploy and scale AI workflows.</div>
      </div>
      <button style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "#fff", background: "var(--cat-agents)", border: "none", borderRadius: 10, padding: "10px 16px", cursor: "pointer" }}>
        Try GraphOne Studio <ArrowRight size={14} />
      </button>
    </div>
  );
}

function ProductRow({ name, desc, tags, badge, likes, comments }: { name: string; desc: string; tags: string[]; badge?: string; likes: string; comments: number }) {
  const router = useRouter();
  const slug = GODATA.findProductSlug(name);
  return (
    <div onClick={() => slug && router.push("/products/" + slug)} role="button" tabIndex={0}
      style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 4px", borderBottom: "1px solid var(--border-subtle)", cursor: "pointer", transition: "background .12s" }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "var(--surface-subtle)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
    >
      <LogoTile name={name} size={42} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14.5, fontWeight: 700, color: "var(--gray-900)" }}>{name}</div>
        <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 1 }}>{desc}</div>
        <div style={{ display: "flex", gap: 7, marginTop: 7 }}>
          {tags.map((t) => <span key={t} style={{ fontSize: 11.5, fontWeight: 600, color: "var(--gray-600)", background: "var(--gray-100)", borderRadius: 6, padding: "3px 8px" }}>{t}</span>)}
        </div>
      </div>
      {badge && <span style={{ fontSize: 12, fontWeight: 600, color: "var(--rose-600)", background: "var(--rose-50)", borderRadius: 999, padding: "3px 10px", whiteSpace: "nowrap" }}>{badge}</span>}
      <div style={{ display: "flex", alignItems: "center", gap: 6, width: 64, justifyContent: "flex-end" }}>
        <Heart size={16} color="var(--rose-500)" fill="var(--rose-500)" />
        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--gray-700)" }}>{likes}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, width: 56, justifyContent: "flex-end", color: "var(--gray-400)" }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>{comments}</span>
      </div>
    </div>
  );
}

const BASE_ROWS = [
  { name: "Cursor", desc: "The AI-first code editor built for speed and productivity.", tags: ["Code", "Developer Tools"], badge: "Trending in Coding", likes: "8.3K", comments: 173 },
  { name: "Claude", desc: "AI assistant for thoughtful work and collaboration.", tags: ["Chat", "Productivity"], badge: "Most used this week", likes: "6.7K", comments: 89 },
  { name: "Midjourney", desc: "AI image generator for creators and designers.", tags: ["Image", "Design"], badge: "Top rated in Image", likes: "5.5K", comments: 386 },
  { name: "ChatGPT", desc: "Conversational AI for any question or task.", tags: ["Chat", "Artificial Intelligence"], badge: "Most used this week", likes: "5.1K", comments: 341 },
  { name: "Runway", desc: "AI video creation platform for everyone.", tags: ["Video", "Creative"], badge: "Fastest growing", likes: "3.9K", comments: 210 },
  { name: "ElevenLabs", desc: "AI voice synthesis and audio tools.", tags: ["Voice", "Audio"], badge: "Trending in Voice", likes: "3.2K", comments: 175 },
  { name: "Perplexity", desc: "AI search engine for real-time answers.", tags: ["Search", "Productivity"], badge: "Most used this week", likes: "2.9K", comments: 144 },
  { name: "Notion AI", desc: "AI notes, docs and knowledge workspace.", tags: ["Productivity", "Writing"], likes: "2.6K", comments: 128 },
];

function ProductList() {
  const [tab, setTab] = useState("popular");
  const likesNum = (s: string) => parseFloat(s) * (s.includes("K") ? 1000 : s.includes("M") ? 1e6 : 1);
  const rows =
    tab === "liked" ? [...BASE_ROWS].sort((a, b) => likesNum(b.likes) - likesNum(a.likes)) :
    tab === "newest" ? [...BASE_ROWS].reverse() :
    BASE_ROWS;
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0 6px" }}>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setTab("popular")} style={pillBtn(tab === "popular")}><Flame size={13} />Most Popular</button>
          <button onClick={() => setTab("liked")} style={pillBtn(tab === "liked")}><Heart size={13} />Most Liked</button>
          <button onClick={() => setTab("newest")} style={pillBtn(tab === "newest")}><Sparkles size={13} />Newest</button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 12.5, color: "var(--gray-400)", fontWeight: 600 }}>20,458 products</span>
          <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12.5, fontWeight: 600, color: "var(--gray-600)", cursor: "pointer" }}>
            Sort by: {tab === "liked" ? "Most Liked" : tab === "newest" ? "Newest" : "Popular"} <ChevronDown size={14} />
          </span>
        </div>
      </div>
      {rows.slice(0, 5).map((r) => <ProductRow key={r.name} {...r} />)}
      <SponsoredRow />
      {rows.slice(5).map((r) => <ProductRow key={r.name} {...r} />)}
      <div style={{ marginTop: 18, textAlign: "center" }}>
        <button style={{ ...pillBtn(false), width: "100%", justifyContent: "center", height: 44, border: "1px solid var(--border-default)" }}>
          Load more products <ChevronDown size={15} />
        </button>
      </div>
    </div>
  );
}

function PopularRow() {
  const router = useRouter();
  const items: [string, string][] = [
    ["Cursor", "AI code editor"], ["Claude", "AI assistant"], ["Lovable", "AI app builder"],
    ["Midjourney", "Image generator"], ["Perplexity", "AI search"], ["Runway", "Video gen"],
  ];
  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11.5, fontWeight: 800, color: "var(--rose-500)", letterSpacing: "0.05em", marginBottom: 10 }}>
        <Flame size={13} fill="var(--rose-500)" /> POPULAR RIGHT NOW
      </div>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 2 }}>
        {items.map(([n, d]) => {
          const slug = GODATA.findProductSlug(n);
          return (
            <div key={n} onClick={() => slug && router.push("/products/" + slug)} role="button" tabIndex={0}
              style={{ flex: "none", width: 150, display: "flex", alignItems: "center", gap: 9, padding: "10px 12px", border: "1px solid var(--border-subtle)", borderRadius: 12, background: "var(--surface-card)", cursor: "pointer", transition: "border-color .15s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--rose-200)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-subtle)"; }}
            >
              <LogoTile name={n} size={30} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--gray-900)" }}>{n}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Rail() {
  const trends = ["Cursor", "Claude", "Vibe Coding", "Lovable", "Perplexity", "Midjourney", "Runway", "MCP", "AI Agents", "AI Notetaker"];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: 16, boxShadow: "var(--shadow-sm)", padding: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: "var(--gray-900)", marginBottom: 14 }}>
          <Trophy size={16} color="#F59E0B" /> Product of the Day
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <LogoTile name="Cursor" size={44} />
          <div>
            <div style={{ fontSize: 14.5, fontWeight: 700, color: "var(--gray-900)" }}>Cursor</div>
            <div style={{ fontSize: 12.5, color: "var(--gray-500)" }}>AI-first code editor</div>
          </div>
        </div>
        <button style={{ width: "100%", marginTop: 14, height: 40, borderRadius: 10, border: "none", background: "var(--rose-500)", color: "#fff", font: "700 13px var(--font-sans)", cursor: "pointer" }}>
          View Product
        </button>
      </div>
      <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: 16, boxShadow: "var(--shadow-sm)", padding: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: "var(--gray-900)", marginBottom: 14 }}>
          <TrendingUp size={16} color="var(--rose-500)" /> Trending Searches
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {trends.map((t) => <span key={t} style={{ fontSize: 12.5, fontWeight: 600, color: "var(--gray-700)", background: "var(--surface-subtle)", borderRadius: 999, padding: "6px 12px", cursor: "pointer" }}>{t}</span>)}
        </div>
      </div>
      <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: 16, boxShadow: "var(--shadow-sm)", padding: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 14, fontWeight: 700, color: "var(--gray-900)" }}>
          <Mail size={16} color="var(--rose-500)" /> Stay ahead in AI
        </div>
        <p style={{ fontSize: 12.5, color: "var(--gray-500)", margin: "8px 0 14px" }}>Get weekly updates on new tools and trends.</p>
        <input placeholder="Enter your email" style={{ width: "100%", height: 42, border: "1px solid var(--border-default)", borderRadius: 10, padding: "0 12px", fontSize: 13, fontFamily: "var(--font-sans)", outline: "none", boxSizing: "border-box", marginBottom: 10 }} />
        <button style={{ width: "100%", height: 40, borderRadius: 10, border: "none", background: "var(--rose-500)", color: "#fff", font: "700 13px var(--font-sans)", cursor: "pointer" }}>Subscribe</button>
      </div>
      <div style={{ fontSize: 12.5, color: "var(--gray-500)", lineHeight: 2, padding: "0 4px" }}>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {["About", "Advertise", "API", "Newsletter", "Blog", "Privacy", "Terms", "Contact"].map((l) => (
            <a key={l} style={{ cursor: "pointer" }}>{l}</a>
          ))}
        </div>
        <div style={{ marginTop: 10, color: "var(--gray-400)" }}>© 2026 GraphOne. All rights reserved.</div>
      </div>
    </div>
  );
}

function Hero() {
  const nodes = [
    { n: "OpenAI", x: 64, y: 4 }, { n: "Anthropic", x: 30, y: 24 },
    { n: "Cursor", x: 84, y: 26 }, { n: "Midjourney", x: 40, y: 60 }, { n: "Perplexity", x: 74, y: 62 },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 0.9fr", gap: 24, alignItems: "center", padding: "8px 0 4px" }}>
      <div>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 800, color: "var(--rose-500)", letterSpacing: "0.06em" }}>
          <span style={{ width: 7, height: 7, borderRadius: 999, background: "var(--rose-500)" }} />LIVE AI INTELLIGENCE
        </span>
        <h1 style={{ fontSize: 42, fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.06, color: "var(--gray-900)", marginTop: 12 }}>
          The Global Intelligence Layer <span style={{ color: "var(--rose-500)" }}>for AI.</span>
        </h1>
        <p style={{ fontSize: 15, color: "var(--text-body)", marginTop: 12 }}>One graph connecting companies, founders, investors, products, funding and talent.</p>
        <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap", marginTop: 16 }}>
          <span style={{ fontSize: 12.5, color: "var(--gray-400)", fontWeight: 600 }}>Most searched</span>
          {["Databricks", "Notion", "Pinecone", "Weaviate", "LangChain"].map((p) => (
            <span key={p} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 600, color: "var(--gray-700)", background: "var(--surface-card)", border: "1px solid var(--border-default)", borderRadius: 999, padding: "5px 11px" }}>
              <LogoTile name={p} size={16} /> {p}
            </span>
          ))}
        </div>
      </div>
      <div style={{ position: "relative", height: 280 }}>
        <svg viewBox="0 0 100 80" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          {nodes.map((n, i) => <line key={i} x1="56" y1="40" x2={n.x + 6} y2={n.y + 6} stroke="var(--rose-200)" strokeWidth="0.3" strokeDasharray="1 1" />)}
          {Array.from({ length: 16 }).map((_, i) => <circle key={i} cx={20 + (i * 37) % 70} cy={10 + (i * 23) % 64} r="0.5" fill="#FF4D7A" opacity="0.5" />)}
        </svg>
        <div style={{ position: "absolute", left: "56%", top: "50%", transform: "translate(-50%,-50%)", width: 72, height: 72, borderRadius: 18, background: "var(--rose-500)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 32px rgba(251,44,70,0.4)" }}>
          <ExternalLink size={34} color="#fff" />
        </div>
        {nodes.map((n) => (
          <div key={n.n} style={{ position: "absolute", left: `${n.x}%`, top: `${n.y}%`, display: "flex", alignItems: "center", gap: 7, background: "var(--surface-card)", borderRadius: 12, boxShadow: "var(--shadow-md)", border: "1px solid var(--border-subtle)", padding: "7px 12px 7px 8px" }}>
            <LogoTile name={n.n} size={26} />
            <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--gray-900)" }}>{n.n}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CollectionBanner() {
  return (
    <div style={{ borderRadius: 18, background: "linear-gradient(120deg,#FFF1F4,#FCE9F0)", padding: 24, display: "flex", alignItems: "center", gap: 20, marginTop: 8 }}>
      <div style={{ flex: 1 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 800, color: "var(--rose-500)", letterSpacing: "0.05em" }}>
          <Flame size={13} fill="var(--rose-500)" color="var(--rose-500)" /> COLLECTION OF THE WEEK
        </span>
        <h2 style={{ fontSize: 26, fontWeight: 800, color: "var(--gray-900)", marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
          <Flame size={22} color="#F97316" fill="#F97316" /> Vibe Coding Tools
        </h2>
        <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 6 }}>The best AI tools for vibe coding, building and shipping faster.</p>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 16 }}>
          <div style={{ display: "flex" }}>
            {["A", "B", "C"].map((a, i) => (
              <div key={a} style={{ width: 30, height: 30, borderRadius: 999, border: "2px solid #fff", marginLeft: i ? -8 : 0, background: (["#FFB199", "#A5B4FC", "#6EE7B7"] as string[])[i] ?? "#FFB199", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff" }}>{a}</div>
            ))}
            <div style={{ width: 30, height: 30, borderRadius: 999, border: "2px solid #fff", marginLeft: -8, background: "var(--gray-900)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#fff" }}>+2K</div>
          </div>
          <span style={{ fontSize: 13, color: "var(--gray-500)", fontWeight: 600 }}>2,341 products</span>
        </div>
      </div>
      <button style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 700, color: "#fff", background: "var(--gray-900)", border: "none", borderRadius: 12, padding: "12px 20px", cursor: "pointer" }}>
        Explore Collection <ArrowRight size={15} />
      </button>
    </div>
  );
}

function ProductsHeader() {
  return (
    <div style={{ padding: "4px 0 6px" }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 800, color: "var(--rose-500)", letterSpacing: "0.06em" }}>
        <Flame size={13} fill="var(--rose-500)" color="var(--rose-500)" /> AI PRODUCTS DIRECTORY
      </span>
      <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.08, color: "var(--gray-900)", marginTop: 10 }}>Discover the best AI products</h1>
      <p style={{ fontSize: 15, color: "var(--text-body)", marginTop: 8, maxWidth: 560 }}>Browse, compare and upvote the tools shaping how the world builds with AI — by category, popularity and momentum.</p>
    </div>
  );
}

export function ProductsPage({ variant = "home" }: { variant?: "home" | "products" }) {
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ padding: "20px 28px 40px" }}>
        {variant === "products" ? <ProductsHeader /> : <Hero />}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 312px", gap: 24, marginTop: 12 }}>
          <div style={{ minWidth: 0 }}>
            {variant !== "products" && <CollectionBanner />}
            <PopularRow />
            <ProductList />
          </div>
          <Rail />
        </div>
      </div>
    </div>
  );
}

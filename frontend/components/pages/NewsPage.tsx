"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, MessageSquare, TrendingUp, Mail, Calendar } from "lucide-react";
import { GODATA } from "@/lib/data";
import { LogoTile } from "@/components/ui/LogoTile";
import type { NewsItem } from "@/types";

const TABS = ["All News", "AI Models", "AI Tools", "Funding", "Research", "Datasets"];
const TAB_KIND: Record<string, string> = { "AI Models": "AI Models", "AI Tools": "AI Tools", "Funding": "Funding", "Research": "Research", "Datasets": "Datasets" };
const KIND_TONE: Record<string, [string, string]> = {
  "AI Models": ["var(--rose-600)", "var(--rose-50)"],
  "AI Tools": ["var(--rose-600)", "var(--rose-50)"],
  "Funding": ["#0D9488", "#E6FBF6"],
  "Research": ["#2563EB", "#E8F0FE"],
  "Datasets": ["#7C3AED", "#F3E8FF"],
  "Product Launch": ["#B45309", "#FEF3C7"],
  "Acquisition": ["#9333EA", "#F3E8FF"],
};

function Row({ n, item }: { n: number; item: NewsItem }) {
  const router = useRouter();
  const toneEntry = KIND_TONE[item.kind];
  const fg = toneEntry ? toneEntry[0] : "var(--gray-600)";
  const bg = toneEntry ? toneEntry[1] : "var(--surface-subtle)";
  const ago = item.hoursAgo ? item.hoursAgo + " hours ago" : item.daysAgo <= 1 ? "1 day ago" : item.daysAgo + " days ago";
  return (
    <div onClick={() => router.push("/companies/" + item.companySlug)} role="button" tabIndex={0}
      style={{ display: "grid", gridTemplateColumns: "34px 56px 1fr", gap: 14, alignItems: "center", padding: "16px 6px", borderBottom: "1px solid var(--border-subtle)", cursor: "pointer" }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "var(--surface-subtle)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
    >
      <span style={{ fontSize: 14, fontWeight: 700, color: "var(--gray-300)", textAlign: "center" }}>{n}</span>
      <LogoTile name={item.company} size={48} />
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: "var(--gray-900)", lineHeight: 1.35 }}>{item.title}</span>
          <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--rose-500)", display: "inline-flex", alignItems: "center", gap: 4 }}>
            {item.domain} <ExternalLink size={12} />
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 7 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: fg, background: bg, borderRadius: 6, padding: "3px 9px" }}>{item.kind}</span>
          <span style={{ fontSize: 12, color: "var(--gray-400)" }}>{ago}</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--gray-400)" }}>
            <MessageSquare size={13} /> {item.comments} comments
          </span>
        </div>
      </div>
    </div>
  );
}

function Bucket({ label, items, start }: { label: string; items: NewsItem[]; start: number }) {
  if (!items.length) return null;
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 800, color: "var(--rose-500)", letterSpacing: "0.06em", padding: "18px 6px 4px" }}>{label}</div>
      {items.map((it, i) => <Row key={it.slug} n={start + i} item={it} />)}
    </div>
  );
}

function Rail() {
  const tags = GODATA.trendingTags;
  const startups = GODATA.companies.slice().sort((a, b) => b.employees - a.employees).slice(0, 5);
  const router = useRouter();
  return (
    <aside style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: 16, boxShadow: "var(--shadow-sm)", padding: 18 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--gray-900)" }}>Trending Tags</h3>
          <a style={{ fontSize: 12.5, fontWeight: 600, color: "var(--rose-500)", cursor: "pointer" }}>View all</a>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {tags.map((t) => (
            <div key={t.label} style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 6px", borderRadius: 8, cursor: "pointer" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "var(--surface-subtle)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
            >
              <span style={{ fontSize: 14, fontWeight: 800, color: "var(--rose-400)" }}>#</span>
              <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "var(--gray-800)" }}>{t.label}</span>
              <span style={{ fontSize: 12, color: "var(--gray-400)" }}>({t.count})</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: 16, boxShadow: "var(--shadow-sm)", padding: 18 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--gray-900)" }}>Trending Startups</h3>
          <a style={{ fontSize: 12.5, fontWeight: 600, color: "var(--rose-500)", cursor: "pointer" }}>View all</a>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {startups.map((c) => (
            <div key={c.slug} onClick={() => router.push("/companies/" + c.slug)}
              style={{ display: "flex", alignItems: "center", gap: 11, padding: "8px 6px", borderRadius: 10, cursor: "pointer" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "var(--surface-subtle)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
            >
              <LogoTile name={c.name} size={36} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--gray-900)" }}>{c.name}</div>
                <div style={{ fontSize: 11.5, color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.tagline}</div>
              </div>
              <ExternalLink size={14} color="var(--rose-400)" />
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: 16, boxShadow: "var(--shadow-sm)", padding: 18 }}>
        <span style={{ width: 38, height: 38, borderRadius: 10, background: "var(--rose-50)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Mail size={18} color="var(--rose-500)" />
        </span>
        <div style={{ fontSize: 15, fontWeight: 700, color: "var(--gray-900)", marginTop: 12 }}>Newsletter</div>
        <p style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 4, lineHeight: 1.45 }}>Get the best AI news delivered to your inbox, daily.</p>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <input placeholder="Enter your email" style={{ flex: 1, minWidth: 0, height: 38, border: "1px solid var(--border-default)", borderRadius: 9, padding: "0 12px", fontSize: 13, fontFamily: "var(--font-sans)", background: "var(--surface-card)", color: "var(--gray-900)", outline: "none" }} />
          <button style={{ height: 38, padding: "0 14px", borderRadius: 9, border: "none", background: "var(--rose-500)", color: "#fff", font: "700 13px var(--font-sans)", cursor: "pointer" }}>Subscribe</button>
        </div>
      </div>
      <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: 16, boxShadow: "var(--shadow-sm)", padding: 18 }}>
        <span style={{ width: 38, height: 38, borderRadius: 10, background: "var(--rose-50)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Calendar size={18} color="var(--rose-500)" />
        </span>
        <div style={{ fontSize: 15, fontWeight: 700, color: "var(--gray-900)", marginTop: 12 }}>Daily Digest</div>
        <p style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 4, lineHeight: 1.45 }}>Your daily summary of top AI news and updates.</p>
        <button style={{ width: "100%", height: 38, marginTop: 12, borderRadius: 9, border: "none", background: "var(--rose-50)", color: "var(--rose-600)", font: "700 13px var(--font-sans)", cursor: "pointer" }}>View Today&apos;s Digest</button>
      </div>
    </aside>
  );
}

export function NewsPage() {
  const [tab, setTab] = useState("All News");
  const kindFilter = TAB_KIND[tab];
  const filtered = tab === "All News" ? GODATA.news : GODATA.news.filter((n) => n.kind === kindFilter);
  const today = filtered.filter((n) => n.daysAgo === 0);
  const yest = filtered.filter((n) => n.daysAgo >= 1 && n.daysAgo <= 1);
  const week = filtered.filter((n) => n.daysAgo >= 2 && n.daysAgo <= 7);
  const earlier = filtered.filter((n) => n.daysAgo > 7);
  let counter = 0;
  const buckets: [string, NewsItem[]][] = [["Today", today], ["Yesterday", yest], ["Earlier This Week", week], ["Earlier", earlier]];

  return (
    <div style={{ maxWidth: 1240, margin: "0 auto", padding: "22px 28px 56px" }}>
      <div style={{ position: "relative", overflow: "hidden", background: "var(--hero-wash)", border: "1px solid var(--border-subtle)", borderRadius: 18, padding: "26px 28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, fontWeight: 800, color: "var(--rose-500)", letterSpacing: "0.07em" }}>
          <span style={{ width: 7, height: 7, borderRadius: 999, background: "var(--rose-500)" }} /> LIVE AI INTELLIGENCE
        </div>
        <h1 style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-0.03em", color: "var(--gray-900)", marginTop: 10 }}>Trending AI News</h1>
        <p style={{ fontSize: 14.5, color: "var(--text-body)", marginTop: 6 }}>Real-time updates on breakthroughs, launches, and trends shaping the AI revolution.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, marginTop: 22 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 6 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {TABS.map((t) => (
                <button key={t} onClick={() => setTab(t)} style={{ height: 34, padding: "0 14px", borderRadius: 999, border: "none", background: tab === t ? "var(--rose-500)" : "var(--surface-subtle)", color: tab === t ? "#fff" : "var(--gray-600)", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "var(--font-sans)" }}>{t}</button>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "var(--gray-500)", flex: "none" }}>
              <TrendingUp size={15} /> Trending Now
            </div>
          </div>
          {filtered.length === 0
            ? <div style={{ padding: "60px 20px", textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>No stories in this category yet.</div>
            : buckets.map(([label, items]) => {
                const start = counter + 1;
                counter += items.length;
                return <Bucket key={label} label={label} items={items} start={start} />;
              })}
        </div>
        <Rail />
      </div>
    </div>
  );
}

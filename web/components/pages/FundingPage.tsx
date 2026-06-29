"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GODATA } from "@/lib/data";
import { LogoTile } from "@/components/ui/LogoTile";
import type { FundingRound } from "@/types";

interface RoundWithCompany extends FundingRound {
  company: string;
  companySlug: string;
  cat: string;
}

const STAGE_LIST = ["Seed", "Series A", "Series B", "Series C", "Series D", "Series E"];

export function FundingPage() {
  const router = useRouter();
  const [stageFilter, setStageFilter] = useState("All");

  const allRounds: RoundWithCompany[] = [];
  GODATA.companies.forEach((c) => c.rounds.forEach((r) => allRounds.push({ ...r, company: c.name, companySlug: c.slug, cat: c.cat })));

  const filtered = stageFilter === "All" ? allRounds : allRounds.filter((r) => r.stage === stageFilter);
  const biggest = filtered.slice().sort((a, b) => b.amountM - a.amountM).slice(0, 8);
  const feed = filtered.slice().sort((a, b) => b.year - a.year).slice(0, 8);

  const byStage: Record<string, number> = {};
  allRounds.forEach((r) => { byStage[r.stage] = (byStage[r.stage] ?? 0) + 1; });
  const stages = STAGE_LIST.map((s) => [s, byStage[s] ?? 0] as [string, number]);
  const maxStage = Math.max(...stages.map((s) => s[1]), 1);

  const invTotals: Record<string, number> = {};
  allRounds.forEach((r) => r.leads.forEach((s) => { invTotals[s] = (invTotals[s] ?? 0) + r.amountM; }));
  const largestInvestors = Object.entries(invTotals)
    .sort((a, b) => b[1] - a[1]).slice(0, 6)
    .map(([slug, m]) => ({ slug, inv: GODATA.investorBySlug[slug], total: m >= 1000 ? "$" + (m / 1000).toFixed(1) + "B" : "$" + m + "M" }))
    .filter((x) => x.inv);

  const byYear: Record<number, number> = {};
  allRounds.forEach((r) => { byYear[r.year] = (byYear[r.year] ?? 0) + r.amountM; });
  const years = Object.keys(byYear).map(Number).sort((a, b) => a - b).slice(-6);
  const maxYear = Math.max(...years.map((y) => byYear[y] ?? 0), 1);

  const s = GODATA.stats;
  const heroStats: [string, string][] = [["Total Funding", s.totalFunding], ["Funding Rounds", s.rounds], ["Funded Startups", s.companies], ["AI Unicorns", s.unicorns]];

  return (
    <div style={{ minHeight: "100%" }}>
      <div style={{ background: "var(--hero-wash)", borderBottom: "1px solid var(--border-subtle)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "44px 28px 32px" }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: "var(--rose-500)", letterSpacing: "0.08em" }}>CAPITAL INTELLIGENCE</span>
          <h1 style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-0.03em", color: "var(--gray-900)", lineHeight: 1.05, marginTop: 10, maxWidth: 620 }}>Follow the capital behind the AI economy</h1>
          <p style={{ fontSize: 15.5, color: "var(--text-body)", marginTop: 12, maxWidth: 540, lineHeight: 1.5 }}>Track every funding round, investor and capital trend shaping the future of artificial intelligence.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginTop: 28 }}>
            {heroStats.map(([label, val]) => (
              <div key={label} style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: 14, boxShadow: "var(--shadow-sm)", padding: 16 }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: "var(--gray-900)" }}>{val}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "30px 28px 56px", display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["All", ...STAGE_LIST].map((st) => (
            <button key={st} onClick={() => setStageFilter(st)} style={{ height: 36, padding: "0 16px", borderRadius: 999, border: stageFilter === st ? "1px solid var(--rose-200)" : "1px solid var(--border-default)", background: stageFilter === st ? "var(--rose-50)" : "var(--surface-card)", color: stageFilter === st ? "var(--rose-600)" : "var(--gray-600)", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "var(--font-sans)" }}>{st}</button>
          ))}
        </div>

        <section>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--gray-900)", marginBottom: 14 }}>Biggest Funding Rounds</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
            {biggest.map((r, i) => (
              <div key={i} role="button" tabIndex={0} onClick={() => router.push("/companies/" + r.companySlug)}
                style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: 16, boxShadow: "var(--shadow-sm)", padding: 16, cursor: "pointer", transition: "transform .15s, box-shadow .15s" }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(-3px)"; el.style.boxShadow = "var(--shadow-lg)"; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "var(--shadow-sm)"; }}
              >
                <LogoTile name={r.company} size={38} />
                <div style={{ fontSize: 22, fontWeight: 800, color: "var(--rose-500)", marginTop: 12 }}>{r.amount}</div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--gray-900)", marginTop: 4 }}>{r.company}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{r.stage} · {r.date}</div>
              </div>
            ))}
          </div>
        </section>

        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 16 }}>
          <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: 16, boxShadow: "var(--shadow-sm)", padding: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--gray-900)", marginBottom: 14 }}>Funding Activity Feed</h3>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {feed.map((r, i) => (
                <div key={i} onClick={() => router.push("/companies/" + r.companySlug)}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderBottom: i < feed.length - 1 ? "1px solid var(--border-subtle)" : "none", cursor: "pointer" }}>
                  <LogoTile name={r.company} size={32} />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: "var(--gray-900)" }}>{r.company}</span>{" "}
                    <span style={{ fontSize: 13.5, color: "var(--text-muted)" }}>raised {r.amount} {r.stage}</span>
                  </div>
                  <span style={{ fontSize: 12, color: "var(--gray-400)" }}>{r.date}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: 16, boxShadow: "var(--shadow-sm)", padding: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--gray-900)", marginBottom: 16 }}>Funding by Stage</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {stages.map(([st, n]) => (
                <div key={st} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--gray-600)", width: 72 }}>{st}</span>
                  <div style={{ flex: 1, height: 10, borderRadius: 999, background: "var(--surface-subtle)", overflow: "hidden" }}>
                    <div style={{ width: (n / maxStage * 100) + "%", height: "100%", borderRadius: 999, background: "linear-gradient(90deg,var(--rose-500),var(--rose-300))" }} />
                  </div>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--gray-900)", width: 26, textAlign: "right" }}>{n}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 16 }}>
          <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: 16, boxShadow: "var(--shadow-sm)", padding: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--gray-900)", marginBottom: 14 }}>Most Active Investors</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {largestInvestors.map((x, i) => x.inv && (
                <div key={x.slug} onClick={() => router.push("/investors/" + x.slug)}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 6px", borderRadius: 10, cursor: "pointer" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "var(--surface-subtle)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
                >
                  <span style={{ fontSize: 13, fontWeight: 800, color: "var(--gray-300)", width: 16 }}>{i + 1}</span>
                  <LogoTile name={x.inv.name} size={34} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--gray-900)" }}>{x.inv.name}</div>
                    <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>{x.inv.type} · {x.inv.portfolioCount} cos</div>
                  </div>
                  <span style={{ fontSize: 13.5, fontWeight: 800, color: "var(--rose-500)" }}>{x.total}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: 16, boxShadow: "var(--shadow-sm)", padding: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--gray-900)", marginBottom: 6 }}>Funding Timeline</h3>
            <p style={{ fontSize: 12.5, color: "var(--text-muted)", marginBottom: 16 }}>Capital raised across tracked AI companies by year.</p>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 14, height: 168, padding: "0 4px" }}>
              {years.map((y) => {
                const v = byYear[y] ?? 0;
                const total = v >= 1000 ? "$" + (v / 1000).toFixed(1) + "B" : "$" + Math.round(v) + "M";
                return (
                  <div key={y} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "var(--gray-600)" }}>{total}</span>
                    <div title={total} style={{ width: "100%", maxWidth: 44, height: Math.max(6, (v / maxYear) * 116), borderRadius: "8px 8px 4px 4px", background: "linear-gradient(180deg,var(--rose-500),var(--rose-300))" }} />
                    <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>{y}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

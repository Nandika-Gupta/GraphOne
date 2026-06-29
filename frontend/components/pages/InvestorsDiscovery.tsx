"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, TrendingUp } from "lucide-react";
import { GODATA } from "@/lib/data";
import { LogoTile } from "@/components/ui/LogoTile";
import { useApp } from "@/components/providers/AppProvider";

export function InvestorsDiscovery() {
  const router = useRouter();
  const { openSearch } = useApp();

  const heroCards = [
    { n: "Andreessen Horowitz", s: "a16z", x: 60, y: 2 },
    { n: "Sequoia Capital", s: "SEQUOIA", x: 50, y: 28 },
    { n: "Lightspeed", s: "Lightspeed", x: 80, y: 22 },
    { n: "Accel", s: "Accel", x: 70, y: 52 },
    { n: "General Catalyst", s: "General Catalyst", x: 40, y: 56 },
    { n: "Khosla Ventures", s: "Khosla", x: 55, y: 78 },
  ];

  const trendingInvestors = [
    { n: "a16z", tags: "AI Infrastructure · AI Agents · Developer Tools", g: "linear-gradient(150deg,#F97316,#EF4444)" },
    { n: "SEQUOIA", tags: "AI Infra · Enterprise AI · Global Scale", g: "linear-gradient(150deg,#1F2937,#0B0D12)" },
    { n: "Lightspeed", tags: "Early Stage · AI/ML · Enterprise", g: "linear-gradient(150deg,#1E3A8A,#172554)" },
    { n: "Khosla Ventures", tags: "Deep Tech · AI · Frontier", g: "linear-gradient(150deg,#111827,#0B0D12)" },
    { n: "Accel", tags: "Early Stage · Consumer AI · Enterprise", g: "linear-gradient(150deg,#BE185D,#7C2D6B)" },
    { n: "General Catalyst", tags: "Seed to Growth · AI First · Platform", g: "linear-gradient(150deg,#4C1D95,#2E1065)" },
  ];

  const collections = [
    ["Investors Backing AI Agents", "129 Investors", "linear-gradient(120deg,#1E293B,#0F172A)"],
    ["Investors Backing Indian AI Startups", "96 Investors", "linear-gradient(120deg,#B45309,#78350F)"],
    ["Top Seed Investors", "214 Investors", "linear-gradient(120deg,#15803D,#14532D)"],
    ["Operator Angels", "178 Investors", "linear-gradient(120deg,#334155,#1E293B)"],
  ] as [string, string, string][];

  const mostActive = [
    ["a16z", "Andreessen Horowitz", 42, "Foundation Models · Agents", "+8 this quarter", "#F97316"],
    ["Sequoia Capital", "Sequoia", 38, "Infra · Enterprise AI", "+6 this quarter", "#1F2937"],
    ["Lightspeed", "Lightspeed Venture Partners", 31, "AI/ML · Enterprise", "+5 this quarter", "#1E3A8A"],
    ["General Catalyst", "General Catalyst", 27, "Seed to Growth · Platform", "+5 this quarter", "#4C1D95"],
    ["Accel", "Accel", 24, "Consumer AI · Enterprise", "+4 this quarter", "#BE185D"],
    ["Khosla Ventures", "Khosla Ventures", 21, "Deep Tech · Frontier", "+3 this quarter", "#111827"],
  ] as [string, string, number, string, string, string][];

  const byType = [
    ["Seed Investors", "1,245 Investors", "#ECFDF3"],
    ["Series A Investors", "896 Investors", "#F3E8FF"],
    ["Angel Investors", "2,734 Investors", "#EFF6FF"],
    ["Corporate Venture Funds", "612 Investors", "#EFF6FF"],
    ["Late Stage Investors", "432 Investors", "#FFF1F5"],
    ["Family Offices", "218 Investors", "#FFFAEB"],
  ] as [string, string, string][];

  return (
    <div>
      {/* Hero */}
      <section style={{ background: "var(--hero-wash)", position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "52px 28px 36px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
          <div>
            <h1 style={{ fontSize: 44, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.08, color: "var(--gray-900)" }}>
              Discover Investors<br />Building the AI Economy
            </h1>
            <p style={{ fontSize: 16, color: "var(--text-body)", marginTop: 16, maxWidth: 420, lineHeight: 1.5 }}>
              Find VCs, angels, operators, corporate funds and emerging managers backing the next generation of AI companies.
            </p>
            <div style={{ marginTop: 24, maxWidth: 480 }}>
              <div onClick={openSearch} style={{ display: "flex", alignItems: "center", gap: 10, height: 50, background: "var(--surface-card)", border: "1px solid var(--border-default)", borderRadius: 14, padding: "0 16px", cursor: "text", boxShadow: "var(--shadow-sm)" }}>
                <span style={{ fontSize: 14, color: "var(--text-subtle)" }}>Search investors, funds, firms…</span>
              </div>
            </div>
          </div>
          <div style={{ position: "relative", minHeight: 300 }}>
            <svg viewBox="0 0 100 100" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
              <defs>
                <radialGradient id="iglow" cx="55%" cy="45%" r="40%">
                  <stop offset="0" stopColor="#FF4D7A" stopOpacity="0.18" />
                  <stop offset="1" stopColor="#FF4D7A" stopOpacity="0" />
                </radialGradient>
              </defs>
              <ellipse cx="55" cy="45" rx="46" ry="42" fill="url(#iglow)" />
              <ellipse cx="55" cy="45" rx="40" ry="36" fill="none" stroke="var(--rose-200)" strokeWidth="0.3" strokeDasharray="1.4 1.4" />
            </svg>
            {heroCards.map((c) => (
              <div key={c.n} style={{ position: "absolute", left: `${c.x}%`, top: `${c.y}%`, transform: "translate(-50%,-50%)", background: "var(--surface-card)", borderRadius: 12, boxShadow: "var(--shadow-md)", border: "1px solid var(--border-subtle)", padding: "9px 13px", minWidth: 120 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "var(--gray-900)", letterSpacing: "-0.01em" }}>{c.s}</div>
                <div style={{ fontSize: 10.5, color: "var(--gray-400)", marginTop: 1 }}>{c.n}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending */}
      <section style={{ maxWidth: 1240, margin: "30px auto 0", padding: "0 28px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: "var(--rose-500)" }}>01</span>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "var(--gray-900)" }}>Trending Investors</h2>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 12 }}>
          {trendingInvestors.map((v) => (
            <div key={v.n}
              onClick={() => { const slug = GODATA.findInvestorSlug(v.n); if (slug) router.push("/investors/" + slug); }}
              role="button" tabIndex={0}
              style={{ borderRadius: 16, background: v.g, padding: 16, minHeight: 160, color: "#fff", display: "flex", flexDirection: "column", justifyContent: "space-between", cursor: "pointer", transition: "transform .2s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}
            >
              <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-0.01em" }}>{v.n}</div>
              <div>
                <p style={{ fontSize: 11, opacity: 0.82, lineHeight: 1.5, marginBottom: 12 }}>{v.tags}</p>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700 }}>View portfolio <ArrowRight size={13} /></span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Collections */}
      <section style={{ maxWidth: 1240, margin: "30px auto 0", padding: "0 28px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: "var(--rose-500)" }}>02</span>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "var(--gray-900)" }}>Investor Collections</h2>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1.1fr", gap: 12 }}>
          {collections.map(([t, c, g]) => (
            <div key={t} style={{ borderRadius: 16, background: g, padding: 18, minHeight: 150, color: "#fff", display: "flex", flexDirection: "column", justifyContent: "space-between", cursor: "pointer" }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, lineHeight: 1.2, maxWidth: 180 }}>{t}</div>
                <div style={{ fontSize: 12, opacity: 0.78, marginTop: 6 }}>{c}</div>
              </div>
              <span style={{ width: 30, height: 30, borderRadius: 999, background: "rgba(255,255,255,0.16)", display: "flex", alignItems: "center", justifyContent: "center" }}><ArrowRight size={15} color="#fff" /></span>
            </div>
          ))}
        </div>
      </section>

      {/* Most Active */}
      <section style={{ maxWidth: 1240, margin: "30px auto 0", padding: "0 28px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: "var(--rose-500)" }}>04</span>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "var(--gray-900)" }}>Most Active Investors</h2>
          </div>
        </div>
        <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: 16, boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "48px 1.6fr 0.8fr 1.4fr 1fr", gap: 12, padding: "12px 18px", borderBottom: "1px solid var(--border-subtle)", fontSize: 11, fontWeight: 700, color: "var(--gray-400)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
            <span>#</span><span>Investor</span><span>Deals · 90d</span><span>Focus</span><span style={{ textAlign: "right" }}>Momentum</span>
          </div>
          {mostActive.map(([name, full, deals, focus, mo, c], i) => (
            <div key={name} role="button" tabIndex={0}
              onClick={() => { const slug = GODATA.findInvestorSlug(name); if (slug) router.push("/investors/" + slug); }}
              style={{ display: "grid", gridTemplateColumns: "48px 1.6fr 0.8fr 1.4fr 1fr", gap: 12, padding: "14px 18px", alignItems: "center", borderBottom: i < mostActive.length - 1 ? "1px solid var(--border-subtle)" : "none", cursor: "pointer", transition: "background .15s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "var(--surface-hover)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
            >
              <span style={{ fontSize: 14, fontWeight: 800, color: i < 3 ? "var(--rose-500)" : "var(--gray-400)" }}>{String(i + 1).padStart(2, "0")}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0 }}>
                <span style={{ width: 34, height: 34, borderRadius: 9, background: c, flex: "none", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 800 }}>{name[0]}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--gray-900)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</div>
                  <div style={{ fontSize: 11.5, color: "var(--gray-400)" }}>{full}</div>
                </div>
              </div>
              <span style={{ fontSize: 15, fontWeight: 800, color: "var(--gray-900)" }}>{deals}</span>
              <span style={{ fontSize: 12.5, color: "var(--text-muted)" }}>{focus}</span>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--success-500)", textAlign: "right", display: "flex", alignItems: "center", gap: 5, justifyContent: "flex-end" }}>
                <TrendingUp size={14} color="var(--success-500)" />{mo}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* By Type */}
      <section style={{ maxWidth: 1240, margin: "30px auto 0", padding: "0 28px" }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 14 }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: "var(--rose-500)", marginRight: 10 }}>03</span>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: "var(--gray-900)" }}>Browse by Investor Type</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {byType.map(([n, c, bg]) => (
            <div key={n} style={{ display: "flex", alignItems: "center", gap: 12, padding: 16, borderRadius: 14, background: bg, cursor: "pointer", border: "1px solid var(--border-subtle)" }}>
              <span style={{ width: 38, height: 38, borderRadius: 10, background: "var(--surface-card)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "var(--shadow-xs)", fontSize: 18 }}>💼</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--gray-900)" }}>{n}</div>
                <div style={{ fontSize: 12, color: "var(--gray-500)" }}>{c}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Capital Graph CTA */}
      <section style={{ maxWidth: 1240, margin: "30px auto 0", padding: "0 28px" }}>
        <div style={{ borderRadius: 20, background: "linear-gradient(120deg,#1A0E1F,#0B0D12)", padding: "28px 30px", display: "flex", alignItems: "center", gap: 30 }}>
          <div style={{ flex: "none", maxWidth: 280 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: "var(--rose-400)", letterSpacing: "0.06em" }}>EXPLORE THE CAPITAL GRAPH</span>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#fff", marginTop: 10, lineHeight: 1.2 }}>Visualize How Capital Moves in the AI Economy</h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 10 }}>Explore relationships between investors, founders, companies, funding rounds and products.</p>
            <button onClick={() => router.push("/capital-graph")} style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 16, height: 40, padding: "0 18px", borderRadius: 999, border: "none", background: "var(--rose-500)", color: "#fff", fontSize: 13.5, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-sans)" }}>
              Explore Capital Graph <ArrowRight size={14} />
            </button>
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {(["Investor", "Founder", "Company", "Funding Round", "Product"] as string[]).map((n, i) => (
              <div key={n} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ textAlign: "center", cursor: "pointer" }}>
                  <div style={{ width: 56, height: 56, borderRadius: 999, background: ["#FF4D7A", "#8B5CF6", "#3B82F6", "#0D9488", "#16A34A"][i] ?? "#FF4D7A", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px", boxShadow: `0 8px 24px ${["#FF4D7A", "#8B5CF6", "#3B82F6", "#0D9488", "#16A34A"][i] ?? "#FF4D7A"}55` }}>
                    <span style={{ fontSize: 22 }}>{["👥", "👤", "🏢", "💰", "🚀"][i] ?? "🔷"}</span>
                  </div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: "#fff" }}>{n}</div>
                </div>
                {i < 4 && <ArrowRight size={18} color="var(--rose-400)" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ height: 48 }} />
    </div>
  );
}

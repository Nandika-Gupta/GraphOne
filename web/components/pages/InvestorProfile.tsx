"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Briefcase, MapPin, Calendar, Check, ArrowRight, TrendingUp, Users } from "lucide-react";
import { GODATA } from "@/lib/data";
import { LogoTile } from "@/components/ui/LogoTile";
import type { Investor, InvestorSector } from "@/types";

function Panel({ children, title, action, onAction, style }: { children: React.ReactNode; title?: string; action?: string; onAction?: () => void; style?: React.CSSProperties }) {
  return (
    <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: 16, boxShadow: "var(--shadow-sm)", padding: 22, ...style }}>
      {title && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--gray-900)" }}>{title}</h3>
          {action && <a onClick={onAction} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 600, color: "var(--rose-500)", cursor: "pointer" }}>{action} <ArrowRight size={14} /></a>}
        </div>
      )}
      {children}
    </div>
  );
}

function Donut({ data, size = 150, thickness = 20 }: { data: InvestorSector[]; size?: number; thickness?: number }) {
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let off = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
      {data.map((d, i) => {
        const len = (d.v / 100) * c;
        const el = (
          <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={d.c} strokeWidth={thickness}
            strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-off} />
        );
        off += len;
        return el;
      })}
    </svg>
  );
}

function Header({ v }: { v: Investor }) {
  const tints = ["#FFE0E9", "#E0ECFF", "#E6FBEC", "#F3E8FF"];
  const firstSector = v.sectors[0];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "start", paddingTop: 8 }}>
      <div style={{ display: "flex", gap: 20 }}>
        <div style={{ width: 116, height: 116, borderRadius: 16, background: "var(--surface-card)", border: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-sm)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none", fontSize: 40, fontWeight: 800, color: firstSector ? firstSector.c : "var(--rose-500)" }}>
          {v.name[0]}
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, fontWeight: 700, color: "#2BB673" }}>
            <Check size={15} color="#2BB673" /> Verified Investor
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginTop: 8 }}>
            <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.02em", color: "var(--gray-900)" }}>{v.name}</h1>
            <span style={{ width: 22, height: 22, borderRadius: 999, background: "var(--rose-500)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              <Check size={13} color="#fff" />
            </span>
          </div>
          <p style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-700)", marginTop: 4 }}>{v.thesis}</p>
          <div style={{ display: "flex", gap: 18, flexWrap: "wrap", marginTop: 12, fontSize: 13, color: "var(--text-muted)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Briefcase size={15} />{v.type}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><MapPin size={15} />{v.hq}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Calendar size={15} />Est. {v.founded}</span>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#fff", background: "var(--rose-500)", border: "none", borderRadius: 999, padding: "8px 16px", cursor: "pointer" }}>
              Follow Investor
            </button>
            <button style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "var(--gray-700)", background: "transparent", border: "1px solid var(--border-default)", borderRadius: 999, padding: "8px 16px", cursor: "pointer" }}>
              Save
            </button>
          </div>
        </div>
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--gray-900)", marginBottom: 12 }}>Key people</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }}>
          {v.partners.slice(0, 4).map((p, i) => (
            <div key={p.name} style={{ textAlign: "center" }}>
              <div style={{ width: 44, height: 44, borderRadius: 999, background: tints[i % 4] ?? tints[0], margin: "0 auto 6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "var(--gray-600)" }}>
                {p.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
              </div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--gray-900)" }}>{p.name}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{p.role}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatStrip({ v }: { v: Investor }) {
  const stats: [string | number, string][] = [
    ["+" + v.deals90d, "Deals · Last 90 Days"],
    [v.portfolioCount, "Portfolio Companies"],
    [v.avgCheck, "Avg Check Size"],
    ["Fund " + (v.fundNumber ?? "—"), "Current Fund"],
    [v.aum, "Assets Under Mgmt"],
  ];
  return (
    <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: 16, boxShadow: "var(--shadow-sm)", padding: "20px 8px", display: "flex" }}>
      {stats.map(([val, label], i) => (
        <div key={i} style={{ flex: 1, textAlign: "center", borderRight: i < stats.length - 1 ? "1px solid var(--border-subtle)" : "none", padding: "0 8px" }}>
          <TrendingUp size={18} color="var(--rose-400)" style={{ marginBottom: 6 }} />
          <div style={{ fontSize: 20, fontWeight: 800, color: "var(--gray-900)" }}>{val}</div>
          <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 2 }}>{label}</div>
        </div>
      ))}
    </div>
  );
}

function ThesisConcentration({ v }: { v: Investor }) {
  const lastStage = v.stages[v.stages.length - 1] ?? "Growth";
  const firstStage = v.stages[0] ?? "Seed";
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <Panel title="Investment Thesis">
        <p style={{ fontSize: 14, color: "var(--gray-700)", lineHeight: 1.55 }}>
          {v.thesis} {v.name} concentrates capital in {v.sectors.slice(0, 3).map((s) => s.label).join(", ")}, backing category-defining teams from {firstStage} through {lastStage}.
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
          {v.stages.map((s) => (
            <span key={s} style={{ fontSize: 12, fontWeight: 600, color: "var(--gray-600)", background: "var(--surface-subtle)", border: "1px solid var(--border-subtle)", borderRadius: 999, padding: "4px 11px" }}>{s}</span>
          ))}
        </div>
      </Panel>
      <Panel title="Portfolio Concentration">
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <Donut data={v.sectors} />
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {v.sectors.map((s) => (
              <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: s.c }} />
                <span style={{ fontSize: 12.5, color: "var(--gray-700)", flex: 1 }}>{s.label}</span>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--gray-900)" }}>{s.v}%</span>
              </div>
            ))}
          </div>
        </div>
      </Panel>
    </div>
  );
}

function Portfolio({ v }: { v: Investor }) {
  const router = useRouter();
  const cos = v.portfolioSlugs.map((s) => GODATA.companyBySlug[s]).filter(Boolean);
  if (!cos.length) return null;
  return (
    <Panel title="Portfolio" action="View full portfolio">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12 }}>
        {cos.map((o) => o && (
          <div key={o.slug} role="button" tabIndex={0} onClick={() => router.push("/companies/" + o.slug)}
            style={{ display: "flex", flexDirection: "column", gap: 8, padding: 14, border: "1px solid var(--border-subtle)", borderRadius: 14, cursor: "pointer", transition: "border-color .15s, transform .15s" }}
            onMouseEnter={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = "var(--rose-300)"; el.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = "var(--border-subtle)"; el.style.transform = "translateY(0)"; }}
          >
            <LogoTile name={o.name} size={36} />
            <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--gray-900)" }}>{o.name}</div>
            <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>{o.cat}</div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function RecentInvestments({ v }: { v: Investor }) {
  const router = useRouter();
  if (!v.recent.length) return null;
  const grads = [
    "linear-gradient(150deg,#1F2937,#0B0D12)",
    "linear-gradient(150deg,#2A1B3D,#0E0A18)",
    "linear-gradient(150deg,#1E3A8A,#172554)",
    "linear-gradient(150deg,#BE185D,#7C2D6B)",
    "linear-gradient(150deg,#0F766E,#134E4A)",
    "linear-gradient(150deg,#7C2D12,#431407)",
  ];
  return (
    <Panel title="Recent Investments" action="View all investments">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
        {v.recent.map((r, i) => (
          <div key={r.companySlug} role="button" tabIndex={0} onClick={() => router.push("/companies/" + r.companySlug)}
            style={{ borderRadius: 14, background: grads[i % grads.length] ?? grads[0], padding: 16, minHeight: 132, color: "#fff", display: "flex", flexDirection: "column", justifyContent: "space-between", cursor: "pointer", transition: "transform .2s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}
          >
            <LogoTile name={r.company} size={36} />
            <div>
              <div style={{ fontSize: 15, fontWeight: 800 }}>{r.company}</div>
              <div style={{ fontSize: 11.5, opacity: 0.75 }}>{r.cat}</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700 }}>{r.stage} · {r.amount}</span>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 999, background: r.role === "Lead Investor" ? "var(--rose-500)" : "rgba(255,255,255,0.18)" }}>
                  {r.role === "Lead Investor" ? "Lead" : "Co"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function InvestmentVelocity({ v }: { v: Investor }) {
  const max = Math.max(...v.velocity.map((x) => x.deals));
  const sum = v.velocity.reduce((s, x) => s + x.deals, 0);
  const avg = (sum / v.velocity.length / 3).toFixed(1);
  return (
    <Panel title="Investment Velocity" action="View full history">
      <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 18 }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "var(--gray-900)" }}>
            {avg}<span style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600 }}> deals/mo</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Trailing 12-month pace</div>
        </div>
        <div style={{ width: 1, height: 36, background: "var(--border-subtle)" }} />
        <div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#22C55E" }}>+27%</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>vs. prior year</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 16, height: 150, padding: "0 4px" }}>
        {v.velocity.map((x) => (
          <div key={x.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--gray-700)" }}>{x.deals}</span>
            <div title={x.deals + " deals"} style={{ width: "100%", maxWidth: 38, height: (x.deals / (max || 1)) * 104, borderRadius: "8px 8px 4px 4px", background: "linear-gradient(180deg,var(--rose-500),var(--rose-300))" }} />
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{x.label}</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function CoInvestors({ v }: { v: Investor }) {
  const router = useRouter();
  if (!v.coInvestors.length) return null;
  return (
    <Panel title="Co-Investor Network" action="View all co-investors">
      <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginBottom: 12 }}>Most Frequent Co-Investors</div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {v.coInvestors.map((co) => (
          <a key={co.slug} onClick={() => router.push("/investors/" + co.slug)}
            style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 12px", border: "1px solid var(--border-subtle)", borderRadius: 999, cursor: "pointer", transition: "border-color .15s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--rose-300)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border-subtle)"; }}
          >
            <LogoTile name={co.name} size={26} />
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--gray-900)" }}>{co.name}</span>
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{co.shared} shared</span>
          </a>
        ))}
      </div>
    </Panel>
  );
}

export function InvestorProfile({ slug }: { slug: string }) {
  const router = useRouter();
  const v = GODATA.investorBySlug[slug] ?? GODATA.investors[0];
  if (!v) return null;

  return (
    <div style={{ background: "var(--surface-subtle)", minHeight: "100%" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "8px 28px 56px", display: "flex", flexDirection: "column", gap: 16 }}>
        <a onClick={() => router.push("/investors")} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "var(--text-muted)", cursor: "pointer", marginTop: 16 }}>
          <ChevronLeft size={15} /> Back to Investors
        </a>
        <Header v={v} />
        <StatStrip v={v} />
        <ThesisConcentration v={v} />
        <Portfolio v={v} />
        <RecentInvestments v={v} />
        <InvestmentVelocity v={v} />
        <CoInvestors v={v} />
      </div>
    </div>
  );
}

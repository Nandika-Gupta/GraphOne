"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Users, Building2, Layers, Rocket, TrendingUp, Check, X, ArrowRight } from "lucide-react";
import { GODATA } from "@/lib/data";
import type { LucideIcon } from "lucide-react";

interface NodeType {
  label: string;
  color: string;
  Icon: LucideIcon;
}

const TYPE: Record<string, NodeType> = {
  investor:   { label: "Investors",       color: "#FF4D7A", Icon: Users },
  founder:    { label: "Founders",        color: "#8B5CF6", Icon: Users },
  company:    { label: "Companies",       color: "#3B82F6", Icon: Building2 },
  funding:    { label: "Funding Rounds",  color: "#0D9488", Icon: Layers },
  product:    { label: "Products",        color: "#16A34A", Icon: Rocket },
  competitor: { label: "Competitors",     color: "#F59E0B", Icon: TrendingUp },
};

interface FocusState { kind: string; slug: string }

interface GraphNode {
  kind: string;
  slug: string;
  name: string;
  sub?: string;
  focusable?: boolean;
  asCompany?: boolean;
}

interface PlacedNode extends GraphNode { x: number; y: number }

function neighboursFor(focus: FocusState): { center: GraphNode | null; groups: GraphNode[] } {
  const out: GraphNode[] = [];
  if (focus.kind === "company") {
    const c = GODATA.companyBySlug[focus.slug];
    if (!c) return { center: null, groups: [] };
    c.investorSlugs.forEach((s) => { const v = GODATA.investorBySlug[s]; if (v) out.push({ kind: "investor", slug: v.slug, name: v.name, focusable: true }); });
    c.founders.forEach((f) => out.push({ kind: "founder", slug: c.slug, name: f.name, sub: f.role, focusable: false }));
    c.productSlugs.forEach((s) => { const p = GODATA.productBySlug[s]; if (p) out.push({ kind: "product", slug: p.slug, name: p.name, focusable: false }); });
    c.rounds.slice(0, 4).forEach((r, i) => out.push({ kind: "funding", slug: c.slug + "-r" + i, name: r.stage, sub: r.amount, focusable: false }));
    c.similar.slice(0, 4).forEach((s) => { const o = GODATA.companyBySlug[s]; if (o) out.push({ kind: "competitor", slug: o.slug, name: o.name, focusable: true, asCompany: true }); });
    return { center: { kind: "company", slug: c.slug, name: c.name, sub: c.cat }, groups: out };
  }
  const v = GODATA.investorBySlug[focus.slug];
  if (!v) return { center: null, groups: [] };
  v.portfolioSlugs.forEach((s) => { const c = GODATA.companyBySlug[s]; if (c) out.push({ kind: "company", slug: c.slug, name: c.name, sub: c.cat, focusable: true }); });
  v.coInvestors.slice(0, 5).forEach((co) => out.push({ kind: "investor", slug: co.slug, name: co.name, sub: co.shared + " shared", focusable: true }));
  return { center: { kind: "investor", slug: v.slug, name: v.name, sub: v.type }, groups: out };
}

export function CapitalGraph() {
  const router = useRouter();
  const [focus, setFocus] = useState<FocusState>({ kind: "company", slug: "openai" });
  const [hidden, setHidden] = useState<Record<string, boolean>>({});

  const { center, groups } = neighboursFor(focus);
  const visible = groups.filter((g) => !hidden[g.kind]);
  const presentTypes = Array.from(new Set(groups.map((g) => g.kind)));

  const W = 760, H = 540, cx = W / 2, cy = H / 2;
  const placed: PlacedNode[] = visible.map((g, i) => {
    const ang = (i / visible.length) * Math.PI * 2 - Math.PI / 2;
    const rx = 300, ry = 210;
    return { ...g, x: cx + Math.cos(ang) * rx, y: cy + Math.sin(ang) * ry };
  });

  const viewProfile = () => {
    if (!center) return;
    if (center.kind === "company") router.push("/companies/" + center.slug);
    else router.push("/investors/" + center.slug);
  };

  return (
    <div style={{ maxWidth: 1240, margin: "0 auto", padding: "24px 28px 56px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20, flexWrap: "wrap", marginBottom: 18 }}>
        <div>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 800, color: "var(--rose-500)", letterSpacing: "0.07em" }}>
            <span style={{ width: 7, height: 7, borderRadius: 999, background: "var(--rose-500)" }} />THE CAPITAL GRAPH
          </span>
          <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.03em", color: "var(--gray-900)", marginTop: 10 }}>Capital Graph</h1>
          <p style={{ fontSize: 14.5, color: "var(--text-body)", marginTop: 6, maxWidth: 600 }}>Explore relationships between investors, founders, companies, funding rounds and products. Click any focusable node to recenter.</p>
        </div>
        <div style={{ position: "relative", flex: "none" }}>
          <select value={focus.kind + ":" + focus.slug}
            onChange={(e) => { const [k, s] = e.target.value.split(":"); if (k && s) setFocus({ kind: k, slug: s }); }}
            aria-label="Focus entity"
            style={{ appearance: "none", WebkitAppearance: "none", height: 44, padding: "0 38px 0 16px", borderRadius: 12, border: "1px solid var(--border-default)", background: "var(--surface-card)", color: "var(--gray-800)", fontSize: 13.5, fontWeight: 600, fontFamily: "var(--font-sans)", cursor: "pointer", minWidth: 220 }}>
            <optgroup label="Companies">
              {GODATA.companies.slice(0, 18).map((c) => <option key={c.slug} value={"company:" + c.slug}>{c.name}</option>)}
            </optgroup>
            <optgroup label="Investors">
              {GODATA.investors.map((v) => <option key={v.slug} value={"investor:" + v.slug}>{v.name}</option>)}
            </optgroup>
          </select>
          <span style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--gray-400)" }}>
            <ChevronDown size={16} />
          </span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "210px 1fr", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: "var(--gray-400)", textTransform: "uppercase", letterSpacing: "0.05em", padding: "2px 4px 4px" }}>Node types</div>
          {Object.keys(TYPE).filter((t) => presentTypes.includes(t)).map((t) => {
            const off = hidden[t] ?? false;
            const nodeType = TYPE[t];
            if (!nodeType) return null;
            return (
              <button key={t} onClick={() => setHidden((h) => ({ ...h, [t]: !h[t] }))}
                style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 11px", borderRadius: 10, cursor: "pointer", textAlign: "left", border: "1px solid var(--border-subtle)", background: off ? "var(--surface-subtle)" : "var(--surface-card)", opacity: off ? 0.5 : 1, fontFamily: "var(--font-sans)" }}>
                <span style={{ width: 12, height: 12, borderRadius: 999, border: "2px solid " + nodeType.color, background: nodeType.color + "22", flex: "none" }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--gray-700)", flex: 1 }}>{nodeType.label}</span>
                {off ? <X size={13} color="var(--gray-400)" /> : <Check size={13} color={nodeType.color} />}
              </button>
            );
          })}
          {center && (
            <button onClick={viewProfile}
              style={{ marginTop: 8, height: 40, borderRadius: 10, border: "none", background: "var(--rose-500)", color: "#fff", font: "700 13px var(--font-sans)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, boxShadow: "var(--shadow-accent)" }}>
              View full profile <ArrowRight size={14} color="#fff" />
            </button>
          )}
        </div>

        <div style={{ position: "relative", borderRadius: 18, border: "1px solid var(--border-subtle)", background: "var(--surface-subtle)", overflow: "hidden", minHeight: H }}>
          <svg viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
            <ellipse cx={cx} cy={cy} rx="300" ry="210" fill="none" stroke="var(--border-default)" strokeWidth="1" strokeDasharray="3 4" />
            {placed.map((g, i) => {
              const nodeType = TYPE[g.kind];
              return <line key={i} x1={cx} y1={cy} x2={g.x} y2={g.y} stroke={nodeType?.color ?? "#999"} strokeWidth="1.3" strokeOpacity="0.4" />;
            })}
          </svg>

          {center && (
            <div style={{ position: "absolute", left: cx, top: cy, transform: "translate(-50%,-50%)", zIndex: 3 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{ width: 88, height: 88, borderRadius: 22, background: "var(--gray-900)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "var(--shadow-pop)", border: "3px solid var(--surface-card)" }}>
                  <span style={{ fontSize: 34, fontWeight: 800, color: "#fff" }}>{center.name[0]}</span>
                </div>
                <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: 999, padding: "5px 14px", boxShadow: "var(--shadow-sm)", textAlign: "center" }}>
                  <div style={{ fontSize: 13.5, fontWeight: 800, color: "var(--gray-900)", whiteSpace: "nowrap" }}>{center.name}</div>
                </div>
              </div>
            </div>
          )}

          {placed.map((g, i) => {
            const nodeType = TYPE[g.kind];
            if (!nodeType) return null;
            const { Icon } = nodeType;
            const clickable = g.focusable ?? false;
            const handleClick = () => {
              if (g.kind === "investor") setFocus({ kind: "investor", slug: g.slug });
              else if (g.asCompany ?? g.kind === "company") setFocus({ kind: "company", slug: g.slug });
              else if (g.kind === "product") router.push("/products/" + g.slug);
            };
            return (
              <div key={i}
                onClick={clickable ? handleClick : undefined}
                role={clickable ? "button" : undefined}
                tabIndex={clickable ? 0 : undefined}
                style={{ position: "absolute", left: g.x, top: g.y, transform: "translate(-50%,-50%)", zIndex: 2, cursor: clickable ? "pointer" : "default", transition: "transform .15s" }}
                onMouseEnter={(e) => { if (clickable) (e.currentTarget as HTMLDivElement).style.transform = "translate(-50%,-50%) scale(1.06)"; }}
                onMouseLeave={(e) => { if (clickable) (e.currentTarget as HTMLDivElement).style.transform = "translate(-50%,-50%) scale(1)"; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--surface-card)", border: "1px solid " + nodeType.color + "55", borderRadius: 12, padding: "8px 12px 8px 8px", boxShadow: "var(--shadow-sm)", maxWidth: 168 }}>
                  <span style={{ width: 30, height: 30, borderRadius: 8, background: nodeType.color + "1A", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
                    <Icon size={15} color={nodeType.color} />
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--gray-900)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{g.name}</div>
                    {g.sub && <div style={{ fontSize: 10.5, color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{g.sub}</div>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

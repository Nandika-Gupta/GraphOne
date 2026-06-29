"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, LayoutGrid, List } from "lucide-react";
import { GODATA } from "@/lib/data";
import { LogoTile } from "@/components/ui/LogoTile";
import type { Company } from "@/types";

function Select({ value, onChange, options, label }: { value: string; onChange: (v: string) => void; options: { v: string; l: string }[]; label: string }) {
  return (
    <div style={{ position: "relative" }}>
      <select value={value} onChange={(e) => onChange(e.target.value)} aria-label={label} style={{
        appearance: "none", WebkitAppearance: "none", height: 44, padding: "0 38px 0 16px", borderRadius: 12,
        border: "1px solid var(--border-default)", background: "var(--surface-card)", color: "var(--gray-800)",
        fontSize: 13.5, fontWeight: 600, fontFamily: "var(--font-sans)", cursor: "pointer", minWidth: 150,
      }}>
        {options.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
      <span style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--gray-400)" }}>
        <ChevronDown size={16} />
      </span>
    </div>
  );
}

function CompanyCard({ c, list }: { c: Company; list: boolean }) {
  const router = useRouter();
  const growth = Math.max(8, Math.min(98, Math.round((c.growth ?? 0.5) * 22 + 34)));
  return (
    <div onClick={() => router.push("/companies/" + c.slug)} role="button" tabIndex={0}
      style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: 16, boxShadow: "var(--shadow-sm)", padding: 18, cursor: "pointer", transition: "transform .15s, box-shadow .15s", display: list ? "flex" : "block", alignItems: "center", gap: 18 }}
      onMouseEnter={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(-3px)"; el.style.boxShadow = "var(--shadow-lg)"; }}
      onMouseLeave={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "var(--shadow-sm)"; }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 13, flex: list ? "none" : "initial", width: list ? 230 : "auto" }}>
        <LogoTile name={c.name} size={44} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--gray-900)" }}>{c.name}</div>
          <div style={{ fontSize: 12.5, color: "var(--text-muted)" }}>{c.cat}</div>
        </div>
      </div>
      <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5, margin: list ? 0 : "16px 0 0", flex: list ? 1 : "initial", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" } as React.CSSProperties}>{c.desc}</p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginTop: list ? 0 : 18, paddingTop: list ? 0 : 14, borderTop: list ? "none" : "1px solid var(--border-subtle)", flex: list ? "none" : "initial", width: list ? 220 : "auto" }}>
        <span style={{ fontSize: 12.5, color: "var(--gray-500)" }}>Valuation: <strong style={{ color: "var(--gray-900)", fontWeight: 700 }}>{c.valuation}</strong></span>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#22C55E" }}>+{growth}%</span>
      </div>
    </div>
  );
}

export function CompaniesGrid() {
  const [cat, setCat] = useState("all");
  const [stage, setStage] = useState("all");
  const [sort, setSort] = useState("trending");
  const [list, setList] = useState(false);
  const [limit, setLimit] = useState(12);

  const catKeys = Object.keys(GODATA.CAT);
  const catOpts = [{ v: "all", l: "Category" }, ...catKeys.map((k) => ({ v: k, l: k }))];
  const stageOpts = [{ v: "all", l: "Funding Stage" }, ...["Seed", "Series A", "Series B", "Series C", "Series D"].map((s) => ({ v: s, l: s }))];
  const sortOpts = [{ v: "trending", l: "Trending" }, { v: "valuation", l: "Valuation" }, { v: "growth", l: "Growth" }, { v: "newest", l: "Newest" }];

  let rows = GODATA.companies.slice();
  if (cat !== "all") rows = rows.filter((c) => c.cat === cat);
  if (stage !== "all") rows = rows.filter((c) => c.rounds.some((r) => r.stage === stage));
  rows.sort((a, b) =>
    sort === "valuation" ? (parseFloat(b.valuation.replace(/[^0-9.]/g, "")) || 0) - (parseFloat(a.valuation.replace(/[^0-9.]/g, "")) || 0) :
    sort === "growth" ? (b.growth ?? 0) - (a.growth ?? 0) :
    sort === "newest" ? b.founded - a.founded :
    b.employees - a.employees
  );
  const shown = rows.slice(0, limit);

  return (
    <div style={{ maxWidth: 1240, margin: "0 auto", padding: "24px 28px 56px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20, flexWrap: "wrap", marginBottom: 22 }}>
        <div>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 800, color: "var(--rose-500)", letterSpacing: "0.07em" }}>
            <span style={{ width: 7, height: 7, borderRadius: 999, background: "var(--rose-500)" }} />AI STARTUPS
          </span>
          <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.03em", color: "var(--gray-900)", marginTop: 10 }}>Explore All Companies</h1>
          <p style={{ fontSize: 14.5, color: "var(--text-body)", marginTop: 6 }}>Find, filter, and compare the right AI companies.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <Select value={cat} onChange={(v) => { setCat(v); setLimit(12); }} options={catOpts} label="Category" />
          <Select value={stage} onChange={(v) => { setStage(v); setLimit(12); }} options={stageOpts} label="Funding Stage" />
          <Select value={sort} onChange={setSort} options={sortOpts} label="Sort" />
          <div style={{ display: "flex", border: "1px solid var(--border-default)", borderRadius: 12, overflow: "hidden", flex: "none" }}>
            <button aria-label="Grid view" onClick={() => setList(false)} style={{ width: 42, height: 44, border: "none", background: !list ? "var(--rose-50)" : "var(--surface-card)", color: !list ? "var(--rose-500)" : "var(--gray-400)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LayoutGrid size={17} />
            </button>
            <button aria-label="List view" onClick={() => setList(true)} style={{ width: 42, height: 44, border: "none", borderLeft: "1px solid var(--border-default)", background: list ? "var(--rose-50)" : "var(--surface-card)", color: list ? "var(--rose-500)" : "var(--gray-400)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <List size={17} />
            </button>
          </div>
        </div>
      </div>

      {shown.length === 0 ? (
        <div style={{ padding: "70px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "var(--gray-900)" }}>No companies match these filters</div>
          <p style={{ fontSize: 13.5, color: "var(--text-muted)", marginTop: 6 }}>Try a different category or funding stage.</p>
        </div>
      ) : (
        <div style={{ display: list ? "flex" : "grid", flexDirection: list ? "column" : undefined, gridTemplateColumns: list ? undefined : "repeat(4, 1fr)", gap: 16 }}>
          {shown.map((c) => <CompanyCard key={c.slug} c={c} list={list} />)}
        </div>
      )}

      {limit < rows.length && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 26 }}>
          <button onClick={() => setLimit((n) => n + 12)} style={{ height: 44, padding: "0 24px", borderRadius: 999, border: "1px solid var(--border-default)", background: "var(--surface-card)", color: "var(--gray-700)", font: "700 14px var(--font-sans)", cursor: "pointer", display: "flex", alignItems: "center", gap: 7 }}>
            Load more companies <ChevronDown size={15} />
          </button>
        </div>
      )}
    </div>
  );
}

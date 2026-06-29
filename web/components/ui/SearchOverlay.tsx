"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";
import { useApp } from "@/components/providers/AppProvider";
import { GODATA } from "@/lib/data";
import { LogoTile } from "@/components/ui/LogoTile";

type ResultType = "company" | "investor" | "product";

interface SearchResult {
  type: ResultType;
  slug: string;
  name: string;
  meta: string;
  isFounder?: boolean;
}

const HREF_MAP: Record<ResultType, string> = {
  company: "/companies",
  investor: "/investors",
  product: "/products",
};

export function SearchOverlay() {
  const { searchOpen, closeSearch } = useApp();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) {
      setQ("");
      setActiveIdx(0);
      const t = setTimeout(() => inputRef.current?.focus(), 30);
      return () => clearTimeout(t);
    }
  }, [searchOpen]);

  if (!searchOpen) return null;

  const ql = q.trim().toLowerCase();
  const D = GODATA;

  const cos: SearchResult[] = (ql
    ? D.companies.filter((c) => c.name.toLowerCase().includes(ql) || c.cat.toLowerCase().includes(ql) || c.tags.join(" ").toLowerCase().includes(ql))
    : D.companies.slice().sort((a, b) => b.employees - a.employees)
  ).slice(0, 5).map((c) => ({ type: "company" as const, slug: c.slug, name: c.name, meta: c.cat }));

  const invs: SearchResult[] = (ql
    ? D.investors.filter((v) => v.name.toLowerCase().includes(ql) || v.type.toLowerCase().includes(ql))
    : D.investors.slice(0, 4)
  ).slice(0, 4).map((v) => ({ type: "investor" as const, slug: v.slug, name: v.name, meta: v.type }));

  const prods: SearchResult[] = ql
    ? D.products.filter((p) => p.name.toLowerCase().includes(ql) || p.category.toLowerCase().includes(ql))
        .slice(0, 4).map((p) => ({ type: "product" as const, slug: p.slug, name: p.name, meta: p.category }))
    : [];

  const founders: SearchResult[] = ql
    ? D.companies.flatMap((c) => c.founders.map((f) => ({
        type: "company" as const, slug: c.slug, name: f.name,
        meta: f.role + " · " + c.name, isFounder: true,
      }))).filter((f) => f.name.toLowerCase().includes(ql)).slice(0, 4)
    : [];

  const groups: [string, SearchResult[]][] = (
    [
      ["Companies", cos],
      ["Founders", founders],
      ["Investors", invs],
      ["Products", prods],
    ] as [string, SearchResult[]][]
  ).filter(([, items]) => items.length > 0);

  const flat = groups.flatMap(([, items]) => items);
  const empty = ql.length > 0 && flat.length === 0;

  const pick = (r: SearchResult) => {
    router.push(HREF_MAP[r.type] + "/" + r.slug);
    closeSearch();
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") closeSearch();
    else if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, flat.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, 0)); }
    else if (e.key === "Enter" && flat[activeIdx]) pick(flat[activeIdx]);
  };

  let idx = -1;

  return (
    <div
      onClick={closeSearch}
      style={{ position: "fixed", inset: 0, zIndex: 120, background: "rgba(8,10,15,0.5)", backdropFilter: "blur(3px)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "12vh 20px 20px" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: "min(620px, 100%)", background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: 18, boxShadow: "var(--shadow-pop)", overflow: "hidden" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 18px", borderBottom: "1px solid var(--border-subtle)" }}>
          <Search size={20} color="var(--gray-400)" />
          <input
            ref={inputRef} value={q}
            onChange={(e) => { setQ(e.target.value); setActiveIdx(0); }}
            onKeyDown={onKey}
            placeholder="Search companies, founders, investors, products…"
            style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 16, fontFamily: "var(--font-sans)", color: "var(--gray-900)" }}
          />
          <kbd style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--gray-400)", border: "1px solid var(--border-default)", borderRadius: 6, padding: "2px 7px" }}>Esc</kbd>
        </div>

        <div style={{ maxHeight: "56vh", overflowY: "auto", padding: 8 }}>
          {empty && (
            <div style={{ padding: "36px 18px", textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>
              No results for &ldquo;{q}&rdquo;. Try a company, founder, investor or product.
            </div>
          )}
          {groups.map(([label, items]) => (
            <div key={label} style={{ marginBottom: 4 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--gray-400)", textTransform: "uppercase", letterSpacing: "0.05em", padding: "8px 12px 4px" }}>
                {label}
              </div>
              {items.map((r) => {
                idx++;
                const on = idx === activeIdx;
                const myIdx = idx;
                return (
                  <div
                    key={r.type + r.slug + r.name}
                    onMouseEnter={() => setActiveIdx(myIdx)}
                    onClick={() => pick(r)}
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 12px", borderRadius: 10, cursor: "pointer", background: on ? "var(--surface-hover)" : "transparent" }}
                  >
                    {r.isFounder ? (
                      <span style={{ width: 32, height: 32, borderRadius: 999, flex: "none", background: "var(--surface-sunken)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "var(--gray-600)" }}>
                        {r.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                      </span>
                    ) : (
                      <LogoTile name={r.name} size={32} />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "var(--gray-900)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.name}</div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{r.meta}</div>
                    </div>
                    <ArrowRight size={15} color={on ? "var(--rose-500)" : "var(--gray-300)"} />
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 16, padding: "10px 18px", borderTop: "1px solid var(--border-subtle)", fontSize: 11.5, color: "var(--text-muted)" }}>
          <span><kbd style={{ fontFamily: "var(--font-mono)" }}>↑↓</kbd> navigate</span>
          <span><kbd style={{ fontFamily: "var(--font-mono)" }}>↵</kbd> open</span>
          <span style={{ marginLeft: "auto" }}>Press <kbd style={{ fontFamily: "var(--font-mono)", border: "1px solid var(--border-default)", borderRadius: 5, padding: "1px 6px" }}>/</kbd> anytime</span>
        </div>
      </div>
    </div>
  );
}

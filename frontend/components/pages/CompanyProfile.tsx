"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Globe, Calendar, MapPin, Users, Check, ArrowRight } from "lucide-react";
import { GODATA } from "@/lib/data";
import { LogoTile } from "@/components/ui/LogoTile";
import type { Company } from "@/types";

function Panel({ children, title, n, action, onAction, style }: { children: React.ReactNode; title?: string; n?: string | number; action?: string; onAction?: () => void; style?: React.CSSProperties }) {
  return (
    <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: 16, boxShadow: "var(--shadow-sm)", padding: 22, ...style }}>
      {title && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            {n && <span style={{ fontSize: 11, fontWeight: 800, color: "var(--rose-500)", background: "var(--rose-50)", borderRadius: 6, padding: "3px 7px" }}>{n}</span>}
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--gray-900)" }}>{title}</h3>
          </div>
          {action && <a onClick={onAction} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 600, color: "var(--rose-500)", cursor: "pointer" }}>{action} <ArrowRight size={14} /></a>}
        </div>
      )}
      {children}
    </div>
  );
}

function CompanyHeader({ c }: { c: Company }) {
  return (
    <div style={{ position: "relative", background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: 18, boxShadow: "var(--shadow-sm)", padding: 24, overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: 320, height: "100%", background: `radial-gradient(120% 120% at 90% 10%, ${c.catColor}22 0%, transparent 70%)` }} />
      <div style={{ position: "relative", display: "flex", gap: 20 }}>
        <LogoTile name={c.name} size={84} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap" }}>
            <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.02em", color: "var(--gray-900)" }}>{c.name}</h1>
            <span style={{ width: 22, height: 22, borderRadius: 999, background: "var(--rose-500)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}><Check size={13} color="#fff" /></span>
            {c.unicorn && <span style={{ fontSize: 11, fontWeight: 800, color: "#fff", background: "linear-gradient(135deg,#8B5CF6,#6366F1)", borderRadius: 999, padding: "3px 10px" }}>UNICORN</span>}
          </div>
          <p style={{ fontSize: 14.5, color: "var(--text-body)", marginTop: 6, maxWidth: 520, lineHeight: 1.5 }}>{c.desc}</p>
          <div style={{ display: "flex", gap: 18, flexWrap: "wrap", marginTop: 14, fontSize: 13, color: "var(--text-muted)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Globe size={15} />{c.website}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Calendar size={15} />Founded {c.founded}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><MapPin size={15} />{c.hq}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Users size={15} />{c.employees.toLocaleString()} employees</span>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
            {c.tags.map((t) => <span key={t} style={{ fontSize: 12, fontWeight: 600, color: "var(--gray-600)", background: "var(--surface-subtle)", border: "1px solid var(--border-subtle)", borderRadius: 999, padding: "4px 11px" }}>{t}</span>)}
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button style={{ fontSize: 13, fontWeight: 600, color: "#fff", background: "var(--rose-500)", border: "none", borderRadius: 999, padding: "8px 18px", cursor: "pointer" }}>Follow Company</button>
            <button style={{ fontSize: 13, fontWeight: 600, color: "var(--gray-700)", background: "transparent", border: "1px solid var(--border-default)", borderRadius: 999, padding: "8px 18px", cursor: "pointer" }}>Save</button>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: "none", textAlign: "right" }}>
          {([["Valuation", c.valuation], ["Total Raised", c.raised], ["Category", c.cat]] as [string, string][]).map(([l, v]) => (
            <div key={l}>
              <div style={{ fontSize: 18, fontWeight: 800, color: "var(--gray-900)" }}>{v}</div>
              <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Timeline({ c }: { c: Company }) {
  return (
    <Panel n="2" title="Timeline">
      <div style={{ display: "flex", justifyContent: "space-between", position: "relative", paddingTop: 6 }}>
        <div style={{ position: "absolute", top: 27, left: 20, right: 20, height: 2, background: "var(--border-default)" }} />
        {c.timeline.map((t, i) => (
          <div key={i} style={{ position: "relative", textAlign: "center", flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--gray-900)", marginBottom: 8 }}>{t.year}</div>
            <div style={{ width: 12, height: 12, borderRadius: 999, background: "var(--surface-card)", border: "2.5px solid var(--rose-500)", margin: "0 auto" }} />
            <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 8, lineHeight: 1.3, padding: "0 4px" }}>{t.label}</div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function FundingHistory({ c }: { c: Company }) {
  const router = useRouter();
  if (!c.rounds.length) return null;
  return (
    <Panel n="3" title="Funding History" action="View all rounds">
      <div style={{ display: "flex", gap: 20, marginBottom: 18 }}>
        <div><div style={{ fontSize: 24, fontWeight: 800, color: "var(--rose-500)" }}>{c.raised}</div><div style={{ fontSize: 12, color: "var(--text-muted)" }}>Total raised</div></div>
        <div style={{ width: 1, background: "var(--border-subtle)" }} />
        <div><div style={{ fontSize: 24, fontWeight: 800, color: "var(--gray-900)" }}>{c.rounds.length}</div><div style={{ fontSize: 12, color: "var(--text-muted)" }}>Rounds</div></div>
        <div style={{ width: 1, background: "var(--border-subtle)" }} />
        <div><div style={{ fontSize: 24, fontWeight: 800, color: "var(--gray-900)" }}>{c.valuation}</div><div style={{ fontSize: 12, color: "var(--text-muted)" }}>Latest valuation</div></div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {c.rounds.map((r, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "120px 110px 1fr", gap: 12, alignItems: "center", padding: "12px 14px", borderRadius: 12, background: "var(--surface-subtle)" }}>
            <span style={{ fontSize: 13.5, fontWeight: 700, color: "var(--gray-900)" }}>{r.stage}</span>
            <span style={{ fontSize: 15, fontWeight: 800, color: "var(--rose-500)" }}>{r.amount}</span>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
              <span style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {r.leads.map((s) => { const inv = GODATA.investorBySlug[s]; return inv ? <a key={s} onClick={() => router.push("/investors/" + s)} style={{ fontSize: 12, fontWeight: 600, color: "var(--gray-700)", background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: 999, padding: "3px 10px", cursor: "pointer" }}>{inv.name} · Lead</a> : null; })}
              </span>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{r.date}</span>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function InvestorsList({ c }: { c: Company }) {
  const router = useRouter();
  const invs = c.investorSlugs.map((s) => GODATA.investorBySlug[s]).filter(Boolean);
  if (!invs.length) return null;
  return (
    <Panel n="4" title="Investors" action="View all investors">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
        {invs.map((inv) => inv && (
          <div key={inv.slug} role="button" tabIndex={0} onClick={() => router.push("/investors/" + inv.slug)}
            style={{ display: "flex", alignItems: "center", gap: 11, padding: 12, border: "1px solid var(--border-subtle)", borderRadius: 12, cursor: "pointer", transition: "border-color .15s, transform .15s" }}
            onMouseEnter={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = "var(--rose-300)"; el.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = "var(--border-subtle)"; el.style.transform = "translateY(0)"; }}
          >
            <LogoTile name={inv.name} size={34} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--gray-900)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{inv.name}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{inv.type}</div>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function FoundersList({ c }: { c: Company }) {
  if (!c.founders.length) return null;
  const tints = ["#FFE0E9", "#E0ECFF", "#E6FBEC", "#F3E8FF"];
  return (
    <Panel n="5" title="Founders & Leadership">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
        {c.founders.map((f, i) => (
          <div key={f.name} style={{ display: "flex", alignItems: "center", gap: 13 }}>
            <div style={{ width: 52, height: 52, borderRadius: 999, background: tints[i % tints.length] ?? tints[0], flex: "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 800, color: "var(--gray-700)" }}>
              {f.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
            </div>
            <div>
              <div style={{ fontSize: 14.5, fontWeight: 700, color: "var(--gray-900)" }}>{f.name}</div>
              <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 1 }}>{f.role}</div>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function ProductsList({ c }: { c: Company }) {
  const router = useRouter();
  const prods = c.productSlugs.map((s) => GODATA.productBySlug[s]).filter(Boolean);
  if (!prods.length) return null;
  return (
    <Panel n="6" title="Products" action="View all products">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
        {prods.map((p) => p && (
          <div key={p.slug} role="button" tabIndex={0} onClick={() => router.push("/products/" + p.slug)}
            style={{ padding: 14, border: "1px solid var(--border-subtle)", borderRadius: 14, cursor: "pointer", transition: "transform .15s, box-shadow .15s" }}
            onMouseEnter={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(-2px)"; el.style.boxShadow = "var(--shadow-md)"; }}
            onMouseLeave={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}
          >
            <LogoTile name={p.name} size={34} />
            <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--gray-900)", marginTop: 8 }}>{p.name}</div>
            <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 2 }}>{p.category}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 8, fontSize: 12, fontWeight: 700, color: "var(--rose-500)" }}>♥ {(p.upvotes / 1000).toFixed(1)}K</div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function SimilarCompanies({ c }: { c: Company }) {
  const router = useRouter();
  const fromSlugs = c.similar.map((s) => GODATA.companyBySlug[s]).filter(Boolean);
  const fromCat = fromSlugs.length
    ? fromSlugs
    : GODATA.companies.filter((o) => o.cat === c.cat && o.slug !== c.slug).slice(0, 5);
  const sims = fromCat;
  if (!sims.length) return null;
  return (
    <Panel n="7" title="Similar Companies" action="View more">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12 }}>
        {sims.map((o) => o && (
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

export function CompanyProfile({ slug, company }: { slug: string; company?: Company }) {
  const router = useRouter();
  const c = company ?? GODATA.companyBySlug[slug] ?? GODATA.companies[0];
  if (!c) return null;

  return (
    <div style={{ background: "var(--surface-subtle)", minHeight: "100%" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "24px 28px 56px", display: "flex", flexDirection: "column", gap: 16 }}>
        <a onClick={() => router.push("/startups")} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "var(--text-muted)", cursor: "pointer" }}>
          <ChevronLeft size={15} /> Back to Companies
        </a>
        <CompanyHeader c={c} />
        <Timeline c={c} />
        <FundingHistory c={c} />
        <InvestorsList c={c} />
        <FoundersList c={c} />
        <ProductsList c={c} />
        <SimilarCompanies c={c} />
      </div>
    </div>
  );
}

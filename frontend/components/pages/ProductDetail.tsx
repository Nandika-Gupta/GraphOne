"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Heart, Trophy, LayoutGrid, ArrowRight } from "lucide-react";
import { GODATA } from "@/lib/data";
import { LogoTile } from "@/components/ui/LogoTile";
import type { Product } from "@/types";

export function ProductDetail({ slug, product }: { slug: string; product?: Product }) {
  const router = useRouter();
  const p = product ?? GODATA.productBySlug[slug] ?? GODATA.products[0];
  if (!p) return null;

  const company = p.companySlug ? GODATA.companyBySlug[p.companySlug] : undefined;
  const related = GODATA.products.filter((o) => o.category === p.category && o.slug !== p.slug).slice(0, 4);
  const sortedByUpvotes = GODATA.products.slice().sort((a, b) => b.upvotes - a.upvotes);
  const rank = sortedByUpvotes.findIndex((o) => o.slug === p.slug) + 1;

  const stats: [string, string | number][] = [
    ["Upvotes", (p.upvotes / 1000).toFixed(1) + "K"],
    ["Comments", p.comments],
    ["Category", p.category],
    ["Rank", "#" + rank],
  ];

  return (
    <div style={{ background: "var(--surface-subtle)", minHeight: "100%" }}>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "24px 28px 56px", display: "flex", flexDirection: "column", gap: 16 }}>
        <a onClick={() => router.push("/products")} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "var(--text-muted)", cursor: "pointer" }}>
          <ChevronLeft size={15} /> Back to Products
        </a>

        <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: 18, boxShadow: "var(--shadow-sm)", padding: 24, display: "flex", gap: 20, alignItems: "center" }}>
          <LogoTile name={p.name} size={76} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h1 style={{ fontSize: 27, fontWeight: 800, letterSpacing: "-0.02em", color: "var(--gray-900)" }}>{p.name}</h1>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: "#fff", background: p.categoryColor, borderRadius: 999, padding: "3px 10px" }}>{p.category}</span>
            </div>
            <p style={{ fontSize: 15, color: "var(--text-body)", marginTop: 6 }}>{p.desc}</p>
            {company && (
              <a onClick={() => router.push("/companies/" + company.slug)} style={{ display: "inline-flex", alignItems: "center", gap: 7, marginTop: 10, fontSize: 13, fontWeight: 600, color: "var(--rose-500)", cursor: "pointer" }}>
                <LogoTile name={company.name} size={20} /> by {company.name} <ArrowRight size={13} />
              </a>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: "none" }}>
            <button style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "#fff", background: "var(--rose-500)", border: "none", borderRadius: 999, padding: "10px 18px", cursor: "pointer" }}>
              <Heart size={14} fill="#fff" color="#fff" /> Upvote · {(p.upvotes / 1000).toFixed(1)}K
            </button>
            <button style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "var(--gray-700)", background: "transparent", border: "1px solid var(--border-default)", borderRadius: 999, padding: "10px 18px", cursor: "pointer" }}>
              Visit
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
          {stats.map(([label, val], i) => {
            const icons = [Heart, Trophy, LayoutGrid, Trophy];
            const Icon = icons[i] ?? Heart;
            return (
              <div key={label} style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: 16, textAlign: "center" }}>
                <Icon size={18} color="var(--rose-400)" style={{ marginBottom: 6 }} />
                <div style={{ fontSize: 19, fontWeight: 800, color: "var(--gray-900)" }}>{val}</div>
                <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 2 }}>{label}</div>
              </div>
            );
          })}
        </div>

        <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: 16, boxShadow: "var(--shadow-sm)", padding: 22 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--gray-900)", marginBottom: 10 }}>About {p.name}</h3>
          <p style={{ fontSize: 14, color: "var(--gray-700)", lineHeight: 1.6 }}>
            {p.desc} It is one of the leading products in the {p.category.toLowerCase()} category{company ? ", built by " + company.name + " (" + company.hq + ")" : ""}. The GraphOne community has given it {(p.upvotes / 1000).toFixed(1)}K upvotes and {p.comments} discussions.
          </p>
        </div>

        {related.length > 0 && (
          <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: 16, boxShadow: "var(--shadow-sm)", padding: 22 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--gray-900)", marginBottom: 14 }}>Related Products</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
              {related.map((o) => (
                <div key={o.slug} role="button" tabIndex={0} onClick={() => router.push("/products/" + o.slug)}
                  style={{ padding: 14, border: "1px solid var(--border-subtle)", borderRadius: 14, cursor: "pointer", transition: "transform .15s, box-shadow .15s" }}
                  onMouseEnter={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(-2px)"; el.style.boxShadow = "var(--shadow-md)"; }}
                  onMouseLeave={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}
                >
                  <LogoTile name={o.name} size={34} />
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--gray-900)", marginTop: 8 }}>{o.name}</div>
                  <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 2 }}>{o.company || o.category}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useApp } from "@/components/providers/AppProvider";
import { LogoMark } from "@/components/ui/LogoMark";

export function Footer() {
  const { openAuth } = useApp();

  const cols = [
    {
      heading: "Platform",
      links: [
        { label: "Companies", href: "/" },
        { label: "AI Products", href: "/products" },
        { label: "Investors", href: "/investors" },
        { label: "Funding", href: "/funding" },
        { label: "Jobs", href: "/jobs" },
        { label: "News", href: "/news" },
        { label: "Capital Graph", href: "/capital-graph" },
      ],
    },
    {
      heading: "Resources",
      links: [
        { label: "API", href: "#" },
        { label: "Newsletter", href: "#" },
        { label: "Blog", href: "#" },
        { label: "Changelog", href: "#" },
        { label: "Status", href: "#" },
      ],
    },
    {
      heading: "Company",
      links: [
        { label: "About", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Advertise", href: "#" },
        { label: "Privacy", href: "#" },
        { label: "Terms", href: "#" },
        { label: "Contact", href: "#" },
      ],
    },
  ];

  return (
    <footer style={{ background: "var(--surface-card)", borderTop: "1px solid var(--border-subtle)", marginTop: 40 }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "48px 28px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr", gap: 32, marginBottom: 40 }}>
          <div>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none", marginBottom: 14 }}>
              <LogoMark size={28} />
              <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: "-0.02em", color: "var(--gray-900)" }}>GraphOne</span>
            </Link>
            <p style={{ fontSize: 13.5, color: "var(--text-muted)", lineHeight: 1.6, maxWidth: 260 }}>
              The intelligence layer for the AI economy. Discover companies, investors, products, and funding.
            </p>
            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--gray-900)", marginBottom: 10 }}>Stay ahead in AI</div>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  placeholder="Enter your email"
                  style={{ flex: 1, height: 40, border: "1px solid var(--border-default)", borderRadius: 9, padding: "0 12px", fontSize: 13, fontFamily: "var(--font-sans)", background: "var(--surface-card)", color: "var(--gray-900)", outline: "none" }}
                />
                <button
                  onClick={() => openAuth("signup")}
                  style={{ width: 40, height: 40, borderRadius: 9, border: "none", background: "var(--rose-500)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
          {cols.map((col) => (
            <div key={col.heading}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "var(--gray-400)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14 }}>{col.heading}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {col.links.map((l) => (
                  <Link
                    key={l.label}
                    href={l.href}
                    style={{ fontSize: 13.5, color: "var(--text-muted)", textDecoration: "none", fontWeight: 500 }}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: 20, display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12.5, color: "var(--gray-400)" }}>
          <span>© 2026 GraphOne. All rights reserved.</span>
          <span>Built for the AI economy</span>
        </div>
      </div>
    </footer>
  );
}

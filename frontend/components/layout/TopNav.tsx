"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Moon, Sun, Menu } from "lucide-react";
import { useApp } from "@/components/providers/AppProvider";
import { LogoMark } from "@/components/ui/LogoMark";

interface TopNavProps {
  compact?: boolean;
}

export function TopNav({ compact }: TopNavProps) {
  const pathname = usePathname();
  const { theme, toggleTheme, openSearch, openAuth, openMobileMenu } = useApp();

  const links = [
    { href: "/", label: "Companies" },
    { href: "/investors", label: "Investors" },
    { href: "/products", label: "Products" },
    { href: "/funding", label: "Funding" },
    { href: "/jobs", label: "Jobs" },
    { href: "/news", label: "News" },
  ];

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border-subtle)" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", gap: 20 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none", flex: "none" }}>
          <LogoMark size={28} />
          <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-0.02em", color: "var(--gray-900)" }}>GraphOne</span>
        </Link>

        {!compact && (
          <nav style={{ display: "flex", alignItems: "center", gap: 2, marginLeft: 16 }} className="go-hide-mobile">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  padding: "6px 12px", borderRadius: 8, fontSize: 13.5, fontWeight: 600, textDecoration: "none",
                  color: pathname === l.href ? "var(--rose-600)" : "var(--gray-600)",
                  background: pathname === l.href ? "var(--rose-50)" : "transparent",
                }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        )}

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={openSearch}
            style={{ display: "flex", alignItems: "center", gap: 8, height: 36, padding: "0 12px", borderRadius: 9, border: "1px solid var(--border-default)", background: "var(--surface-card)", color: "var(--gray-500)", cursor: "pointer", fontSize: 13 }}
            className="go-hide-mobile"
          >
            <Search size={15} />
            <span>Search</span>
            <kbd style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--gray-400)", border: "1px solid var(--border-default)", borderRadius: 5, padding: "1px 5px", marginLeft: 4 }}>/</kbd>
          </button>
          <button onClick={openSearch} className="go-hide-desktop" style={{ width: 36, height: 36, borderRadius: 9, border: "1px solid var(--border-default)", background: "var(--surface-card)", color: "var(--gray-600)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Search size={17} />
          </button>
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            style={{ width: 36, height: 36, borderRadius: 9, border: "1px solid var(--border-default)", background: "var(--surface-card)", color: "var(--gray-600)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            onClick={() => openAuth("login")}
            style={{ height: 36, padding: "0 14px", borderRadius: 9, border: "1px solid var(--border-default)", background: "var(--surface-card)", color: "var(--gray-700)", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-sans)" }}
            className="go-hide-mobile"
          >
            Log in
          </button>
          <button
            onClick={() => openAuth("signup")}
            style={{ height: 36, padding: "0 14px", borderRadius: 9, border: "none", background: "var(--rose-500)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-sans)" }}
            className="go-hide-mobile"
          >
            Sign up
          </button>
          <button onClick={openMobileMenu} style={{ display: "none", width: 36, height: 36, borderRadius: 9, border: "1px solid var(--border-default)", background: "var(--surface-card)", color: "var(--gray-600)", cursor: "pointer", alignItems: "center", justifyContent: "center" }} aria-label="Menu">
            <Menu size={17} />
          </button>
        </div>
      </div>
    </header>
  );
}

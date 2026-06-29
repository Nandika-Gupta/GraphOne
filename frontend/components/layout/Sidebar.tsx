"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Rocket, Layers, Users, TrendingUp, Briefcase, Globe, Plus, GitBranch, Moon, Sun } from "lucide-react";
import { useApp } from "@/components/providers/AppProvider";
import { LogoMark } from "@/components/ui/LogoMark";

const NAV = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/startups", label: "AI Startups", icon: Rocket },
  { href: "/products", label: "AI Products", icon: Layers },
  { href: "/investors", label: "Investors", icon: Users },
  { href: "/funding", label: "Funding", icon: TrendingUp },
  { href: "/jobs", label: "Jobs", icon: Briefcase },
  { href: "/news", label: "News", icon: Globe },
  { href: "/capital-graph", label: "Capital Graph", icon: GitBranch },
];

export function Sidebar() {
  const pathname = usePathname();
  const { openSubmit, theme, toggleTheme } = useApp();

  return (
    <aside style={{ width: 220, flex: "none", borderRight: "1px solid var(--border-subtle)", background: "var(--surface-card)", display: "flex", flexDirection: "column", minHeight: "100vh", position: "sticky", top: 0 }}>
      <div style={{ padding: "18px 16px 12px" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <LogoMark size={26} />
          <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: "-0.02em", color: "var(--gray-900)" }}>GraphOne</span>
        </Link>
      </div>

      <nav style={{ flex: 1, padding: "8px 10px" }}>
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/home" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10,
                marginBottom: 2, textDecoration: "none", fontSize: 13.5, fontWeight: active ? 700 : 500,
                color: active ? "var(--rose-600)" : "var(--gray-600)",
                background: active ? "var(--rose-50)" : "transparent",
              }}
            >
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: "12px 10px 8px", borderTop: "1px solid var(--border-subtle)" }}>
        <button
          onClick={toggleTheme}
          style={{ display: "flex", alignItems: "center", gap: 9, width: "100%", padding: "9px 12px", borderRadius: 10, border: "none", background: "transparent", color: "var(--gray-600)", fontSize: 13.5, fontWeight: 500, cursor: "pointer", textAlign: "left", fontFamily: "var(--font-sans)" }}
        >
          {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </button>
      </div>

      <div style={{ padding: "4px 10px 20px", borderTop: "1px solid var(--border-subtle)" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--gray-400)", textTransform: "uppercase", letterSpacing: "0.05em", padding: "8px 12px 8px" }}>Contribute</div>
        <button
          onClick={() => openSubmit("startup")}
          style={{ display: "flex", alignItems: "center", gap: 9, width: "100%", padding: "9px 12px", borderRadius: 10, border: "none", background: "transparent", color: "var(--gray-600)", fontSize: 13.5, fontWeight: 500, cursor: "pointer", textAlign: "left", fontFamily: "var(--font-sans)" }}
        >
          <Plus size={17} /> Submit a Startup
        </button>
        <button
          onClick={() => openSubmit("product")}
          style={{ display: "flex", alignItems: "center", gap: 9, width: "100%", padding: "9px 12px", borderRadius: 10, border: "none", background: "transparent", color: "var(--gray-600)", fontSize: 13.5, fontWeight: 500, cursor: "pointer", textAlign: "left", fontFamily: "var(--font-sans)" }}
        >
          <Plus size={17} /> Submit a Product
        </button>
      </div>
    </aside>
  );
}
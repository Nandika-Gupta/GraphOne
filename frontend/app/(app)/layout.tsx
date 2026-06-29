"use client";

import { Search } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { useApp } from "@/components/providers/AppProvider";

function AppTopBar() {
  const { openSearch } = useApp();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "12px 28px", position: "sticky", top: 0, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", zIndex: 30, borderBottom: "1px solid var(--border-subtle)" }}>
      <div
        onClick={openSearch}
        style={{ flex: 1, maxWidth: 720, display: "flex", alignItems: "center", gap: 10, height: 44, background: "var(--surface-subtle)", border: "1px solid var(--border-subtle)", borderRadius: 999, padding: "0 16px", cursor: "text" }}
      >
        <Search size={17} color="var(--gray-400)" />
        <span style={{ flex: 1, fontSize: 14, color: "var(--text-subtle)", fontFamily: "var(--font-sans)" }}>Search startups, products, investors…</span>
        <kbd style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--gray-400)", border: "1px solid var(--border-default)", borderRadius: 6, padding: "1px 7px", background: "var(--surface-card)" }}>/</kbd>
      </div>
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 999, background: "linear-gradient(135deg,#FFB199,#FF4D7A)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>A</div>
      </div>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <AppTopBar />
        <main style={{ flex: 1 }}>{children}</main>
      </div>
    </div>
  );
}

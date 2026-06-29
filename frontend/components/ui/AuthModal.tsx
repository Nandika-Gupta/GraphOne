"use client";

import { X } from "lucide-react";
import { useApp } from "@/components/providers/AppProvider";
import { LogoMark } from "@/components/ui/LogoMark";

export function AuthModal() {
  const { authMode, closeAuth, openAuth } = useApp();
  if (!authMode) return null;

  return (
    <div
      role="dialog" aria-modal="true" aria-label={authMode === "signup" ? "Sign up" : "Log in"}
      onClick={closeAuth}
      style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(8,10,15,0.5)", backdropFilter: "blur(3px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: "min(420px, 100%)", background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: 20, boxShadow: "var(--shadow-pop)", padding: 28 }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <LogoMark size={32} />
          <button aria-label="Close" onClick={closeAuth} style={{ width: 34, height: 34, borderRadius: 9, border: "1px solid var(--border-default)", background: "var(--surface-card)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--gray-600)" }}>
            <X size={17} />
          </button>
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", color: "var(--gray-900)", marginTop: 8 }}>
          {authMode === "signup" ? "Create your GraphOne account" : "Welcome back"}
        </h2>
        <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 8, lineHeight: 1.5 }}>
          Authentication is outside the scope of this demo — the entire application is fully browsable without an account.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 18 }}>
          <input disabled placeholder="you@company.com" style={{ height: 44, border: "1px solid var(--border-default)", borderRadius: 11, padding: "0 14px", fontSize: 14, fontFamily: "var(--font-sans)", background: "var(--surface-sunken)", color: "var(--text-subtle)", outline: "none" }} />
          <input disabled type="password" placeholder="••••••••" style={{ height: 44, border: "1px solid var(--border-default)", borderRadius: 11, padding: "0 14px", fontSize: 14, fontFamily: "var(--font-sans)", background: "var(--surface-sunken)", color: "var(--text-subtle)", outline: "none" }} />
        </div>
        <button onClick={closeAuth} style={{ width: "100%", height: 46, marginTop: 16, borderRadius: 11, border: "none", background: "var(--rose-500)", color: "#fff", font: "700 14.5px var(--font-sans)", cursor: "pointer" }}>
          Continue browsing
        </button>
        <div style={{ textAlign: "center", fontSize: 13, color: "var(--text-muted)", marginTop: 14 }}>
          {authMode === "signup" ? "Already have an account? " : "New to GraphOne? "}
          <a onClick={() => openAuth(authMode === "signup" ? "login" : "signup")} style={{ color: "var(--rose-500)", fontWeight: 700, cursor: "pointer" }}>
            {authMode === "signup" ? "Log in" : "Sign up"}
          </a>
        </div>
      </div>
    </div>
  );
}

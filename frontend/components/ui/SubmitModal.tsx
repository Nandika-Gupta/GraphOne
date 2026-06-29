"use client";

import { X, Rocket, Plus } from "lucide-react";
import { useApp } from "@/components/providers/AppProvider";

export function SubmitModal() {
  const { submitMode, closeSubmit } = useApp();
  if (!submitMode) return null;

  const isProduct = submitMode === "product";

  return (
    <div
      role="dialog" aria-modal="true" aria-label={isProduct ? "Submit Product" : "Submit Startup"}
      onClick={closeSubmit}
      style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(8,10,15,0.5)", backdropFilter: "blur(3px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: "min(460px, 100%)", background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: 20, boxShadow: "var(--shadow-pop)", padding: 28 }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ width: 40, height: 40, borderRadius: 12, background: "var(--rose-50)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {isProduct ? <Plus size={20} color="var(--rose-500)" /> : <Rocket size={20} color="var(--rose-500)" />}
          </span>
          <button aria-label="Close" onClick={closeSubmit} style={{ width: 34, height: 34, borderRadius: 9, border: "1px solid var(--border-default)", background: "var(--surface-card)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--gray-600)" }}>
            <X size={17} />
          </button>
        </div>
        <h2 style={{ fontSize: 21, fontWeight: 800, letterSpacing: "-0.02em", color: "var(--gray-900)", marginTop: 10 }}>
          {isProduct ? "Submit an AI Product" : "Submit a Startup"}
        </h2>
        <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 8, lineHeight: 1.5 }}>
          Add a {isProduct ? "product" : "company"} to the GraphOne graph. Submissions are reviewed before they go live — in this demo the form is illustrative.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 18 }}>
          <input placeholder={isProduct ? "Product name" : "Company name"} style={{ height: 44, border: "1px solid var(--border-default)", borderRadius: 11, padding: "0 14px", fontSize: 14, fontFamily: "var(--font-sans)", background: "var(--surface-card)", color: "var(--gray-900)", outline: "none" }} />
          <input placeholder="Website URL (https://…)" style={{ height: 44, border: "1px solid var(--border-default)", borderRadius: 11, padding: "0 14px", fontSize: 14, fontFamily: "var(--font-sans)", background: "var(--surface-card)", color: "var(--gray-900)", outline: "none" }} />
          <input placeholder="Category (e.g. AI Agents)" style={{ height: 44, border: "1px solid var(--border-default)", borderRadius: 11, padding: "0 14px", fontSize: 14, fontFamily: "var(--font-sans)", background: "var(--surface-card)", color: "var(--gray-900)", outline: "none" }} />
          <textarea placeholder="One-line description" rows={2} style={{ border: "1px solid var(--border-default)", borderRadius: 11, padding: "10px 14px", fontSize: 14, fontFamily: "var(--font-sans)", background: "var(--surface-card)", color: "var(--gray-900)", outline: "none", resize: "none" }} />
        </div>
        <button onClick={closeSubmit} style={{ width: "100%", height: 46, marginTop: 16, borderRadius: 11, border: "none", background: "var(--rose-500)", color: "#fff", font: "700 14.5px var(--font-sans)", cursor: "pointer" }}>
          Submit for review
        </button>
      </div>
    </div>
  );
}

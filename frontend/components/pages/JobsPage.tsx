"use client";

import { useRouter } from "next/navigation";
import { Check, Users, Briefcase, MapPin, Search, Bell, ChevronDown, ArrowRight, Zap, List, Grid3X3 } from "lucide-react";
import { GODATA } from "@/lib/data";
import { LogoTile } from "@/components/ui/LogoTile";
import type { Company, Job } from "@/types";

function StartupCard({ c }: { c: Company }) {
  const router = useRouter();
  const lastRound = c.rounds[0];
  const stage = lastRound ? lastRound.stage : (c.unicorn ? "Private" : "Seed");
  const emp = c.employees >= 1000 ? Math.round(c.employees / 1000) + ",000+" : c.employees + "+";
  const openJobs = (c.founded % 90) + 8;
  return (
    <div onClick={() => router.push("/companies/" + c.slug)} role="button" tabIndex={0}
      style={{ flex: "none", width: 210, background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: 16, boxShadow: "var(--shadow-sm)", padding: 18, cursor: "pointer", transition: "transform .15s, box-shadow .15s" }}
      onMouseEnter={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(-3px)"; el.style.boxShadow = "var(--shadow-lg)"; }}
      onMouseLeave={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "var(--shadow-sm)"; }}
    >
      <div style={{ display: "flex", justifyContent: "center" }}><LogoTile name={c.name} size={64} /></div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 14 }}>
        <span style={{ fontSize: 15.5, fontWeight: 800, color: "var(--gray-900)" }}>{c.name}</span>
        <Check size={15} color="var(--rose-500)" />
      </div>
      <div style={{ display: "flex", justifyContent: "space-around", marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--border-subtle)" }}>
        {([["users", emp], ["briefcase", openJobs], ["pin", stage]] as [string, string | number][]).map(([ic, v], i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            {ic === "users" && <Users size={14} color="var(--rose-400)" />}
            {ic === "briefcase" && <Briefcase size={14} color="var(--rose-400)" />}
            {ic === "pin" && <MapPin size={14} color="var(--rose-400)" />}
            <span style={{ fontSize: 11.5, fontWeight: 700, color: "var(--gray-700)" }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function JobRow({ j }: { j: Job }) {
  const router = useRouter();
  const posted = j.postedDays === 0 ? "today" : j.postedDays === 1 ? "1d ago" : j.postedDays + "d ago";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 14px", background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: 12, transition: "border-color .15s" }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--rose-200)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-subtle)"; }}
    >
      <LogoTile name={j.company} size={40} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14.5, fontWeight: 700, color: "var(--gray-900)" }}>{j.title}</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 3, fontSize: 12, color: "var(--text-muted)" }}>
          <a onClick={() => router.push("/companies/" + j.companySlug)} style={{ fontWeight: 600, color: "var(--rose-500)", cursor: "pointer" }}>{j.company}</a>
          <span>· {j.type === "Contract" ? "Remote" : "In office"}</span>
          <span>· {j.location}</span>
          <span>· {j.salary}</span>
          <span style={{ color: "var(--gray-400)" }}>· {posted}</span>
        </div>
      </div>
      <button style={{ height: 34, padding: "0 14px", borderRadius: 9, border: "1px solid var(--border-default)", background: "var(--surface-card)", color: "var(--gray-700)", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-sans)" }}>Save</button>
      <button style={{ height: 34, padding: "0 14px", borderRadius: 9, border: "none", background: "var(--rose-500)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-sans)" }}>Apply</button>
    </div>
  );
}

function Section({ title, link, jobs }: { title: string; link: string; jobs: Job[] }) {
  if (!jobs.length) return null;
  return (
    <section style={{ marginTop: 26 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: "var(--gray-900)" }}>{title}</h2>
        <a style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 600, color: "var(--rose-500)", cursor: "pointer" }}>
          {link} <ArrowRight size={14} />
        </a>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {jobs.map((j) => <JobRow key={j.slug} j={j} />)}
      </div>
    </section>
  );
}

function Rail() {
  const perks = [
    [Zap, "Unique jobs in niche industries"],
    [List, "Set salary & equity upfront"],
    [Grid3X3, "Personalized job filters"],
    [Bell, "Showcase skills beyond a resume"],
    [Users, "Let founders and recruiters reach out to you"],
  ] as const;
  return (
    <aside style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: 16, boxShadow: "var(--shadow-sm)", padding: 20 }}>
        <div style={{ fontSize: 17, fontWeight: 800, color: "var(--gray-900)", lineHeight: 1.2 }}>Get new jobs in your inbox</div>
        <p style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 6, lineHeight: 1.45 }}>Join 50K+ professionals getting AI jobs handpicked daily.</p>
        <input placeholder="Enter your email" style={{ width: "100%", boxSizing: "border-box", height: 42, marginTop: 12, border: "1px solid var(--border-default)", borderRadius: 10, padding: "0 13px", fontSize: 13.5, fontFamily: "var(--font-sans)", background: "var(--surface-card)", color: "var(--gray-900)", outline: "none" }} />
        <button style={{ width: "100%", height: 42, marginTop: 10, borderRadius: 10, border: "none", background: "var(--rose-500)", color: "#fff", font: "700 14px var(--font-sans)", cursor: "pointer", boxShadow: "var(--shadow-accent)" }}>Sign up</button>
        <div style={{ textAlign: "center", fontSize: 12, color: "var(--gray-400)", margin: "10px 0" }}>or</div>
        <button style={{ width: "100%", height: 42, borderRadius: 10, border: "1px solid var(--border-default)", background: "var(--surface-card)", color: "var(--gray-800)", font: "700 13.5px var(--font-sans)", cursor: "pointer" }}>Sign up with Google</button>
        <p style={{ fontSize: 11.5, color: "var(--gray-400)", marginTop: 10, textAlign: "center" }}>No spam. Unsubscribe anytime.</p>
      </div>
      <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: 16, boxShadow: "var(--shadow-sm)", padding: 20 }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: "var(--gray-900)" }}>Level up your job search</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14 }}>
          {perks.map(([Icon, t]) => (
            <div key={t} style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
              <Icon size={17} color="var(--rose-400)" style={{ marginTop: 1, flex: "none" }} />
              <span style={{ fontSize: 13, color: "var(--gray-700)", lineHeight: 1.4 }}>{t}</span>
            </div>
          ))}
        </div>
        <button style={{ width: "100%", height: 40, marginTop: 16, borderRadius: 10, border: "1px solid var(--border-default)", background: "var(--surface-card)", color: "var(--gray-800)", font: "700 13.5px var(--font-sans)", cursor: "pointer" }}>Sign up & search</button>
      </div>
      <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: 16, boxShadow: "var(--shadow-sm)", padding: 20 }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: "var(--gray-900)" }}>Know your worth</div>
        <p style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 6, lineHeight: 1.45 }}>Filter by industry, job title, location & more.</p>
        <button style={{ height: 38, padding: "0 16px", marginTop: 12, borderRadius: 10, border: "1px solid var(--border-default)", background: "var(--surface-card)", color: "var(--gray-800)", font: "700 13px var(--font-sans)", cursor: "pointer" }}>Salary calculator</button>
      </div>
      <div style={{ background: "var(--rose-50)", borderRadius: 16, padding: 20 }}>
        <span style={{ width: 40, height: 40, borderRadius: 11, background: "var(--surface-card)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Bell size={19} color="var(--rose-500)" />
        </span>
        <div style={{ fontSize: 16, fontWeight: 800, color: "var(--gray-900)", marginTop: 12 }}>Never miss the right opportunity</div>
        <p style={{ fontSize: 12.5, color: "var(--gray-600)", marginTop: 6, lineHeight: 1.45 }}>Get notified when new AI jobs match your interests.</p>
        <button style={{ width: "100%", height: 42, marginTop: 14, borderRadius: 10, border: "none", background: "var(--rose-500)", color: "#fff", font: "700 14px var(--font-sans)", cursor: "pointer", boxShadow: "var(--shadow-accent)" }}>Create job alert</button>
      </div>
    </aside>
  );
}

export function JobsPage() {
  const router = useRouter();
  const startups = GODATA.companies.slice().sort((a, b) => b.employees - a.employees).slice(0, 8);
  const byDept = (d: string) => GODATA.jobs.filter((j) => j.dept === d);
  const trending = GODATA.jobs.slice(0, 5);

  return (
    <div style={{ maxWidth: 1240, margin: "0 auto", padding: "22px 28px 56px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 26 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, fontWeight: 800, color: "var(--rose-500)", letterSpacing: "0.07em" }}>
            <span style={{ width: 7, height: 7, borderRadius: 999, background: "var(--rose-500)" }} /> LIVE AI INTELLIGENCE
          </div>
          <h1 style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.03em", color: "var(--gray-900)", marginTop: 10 }}>
            Find what&apos;s <span style={{ color: "var(--rose-500)" }}>next.</span>
          </h1>
          <p style={{ fontSize: 15, color: "var(--text-body)", marginTop: 8 }}>Discover the best AI startups and find your next career opportunity.</p>
          <div style={{ display: "flex", alignItems: "center", gap: 0, marginTop: 18, background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: 12, boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 9, padding: "0 14px", height: 50 }}>
              <Search size={17} color="var(--gray-400)" />
              <span style={{ fontSize: 14, color: "var(--text-subtle)" }}>Job title</span>
            </div>
            <div style={{ width: 1, height: 26, background: "var(--border-subtle)" }} />
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 9, padding: "0 14px", height: 50 }}>
              <MapPin size={17} color="var(--gray-400)" />
              <span style={{ fontSize: 14, color: "var(--text-subtle)" }}>Location</span>
            </div>
            <div style={{ padding: 6 }}>
              <button style={{ height: 38, padding: "0 20px", borderRadius: 9, border: "none", background: "var(--rose-500)", color: "#fff", font: "700 14px var(--font-sans)", cursor: "pointer" }}>Search</button>
            </div>
          </div>

          <section style={{ marginTop: 28 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: "var(--gray-900)" }}>Trending startups hiring now</h2>
              <a onClick={() => router.push("/")} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 600, color: "var(--rose-500)", cursor: "pointer" }}>
                View all companies <ArrowRight size={14} />
              </a>
            </div>
            <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 4 }}>
              {startups.map((c) => <StartupCard key={c.slug} c={c} />)}
            </div>
          </section>

          <Section title="Trending startup jobs" link="View all jobs" jobs={trending} />
          <Section title="Engineering jobs" link="View all engineering jobs" jobs={byDept("Engineering").slice(0, 5)} />
          <Section title="Product jobs" link="View all product jobs" jobs={byDept("Product").slice(0, 5)} />
          <Section title="Design jobs" link="View all design jobs" jobs={byDept("Design").slice(0, 4)} />

          <div style={{ display: "flex", justifyContent: "center", marginTop: 26 }}>
            <button style={{ height: 40, padding: "0 22px", borderRadius: 999, border: "1px solid var(--border-default)", background: "var(--surface-card)", color: "var(--gray-700)", font: "700 13.5px var(--font-sans)", cursor: "pointer", display: "flex", alignItems: "center", gap: 7 }}>
              Load more jobs <ChevronDown size={15} />
            </button>
          </div>
        </div>
        <Rail />
      </div>
    </div>
  );
}

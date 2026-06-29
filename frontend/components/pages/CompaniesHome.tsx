"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, ChevronRight } from "lucide-react";
import { GODATA } from "@/lib/data";
import { LogoTile } from "@/components/ui/LogoTile";
import { useApp } from "@/components/providers/AppProvider";

function SectionHead({ n, title, sub, action = "View all" }: { n: string | number; title: string; sub?: string; action?: string | null }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
      <div style={{ display: "flex", gap: 12 }}>
        <span style={{ width: 22, height: 22, borderRadius: 999, background: "var(--rose-50)", color: "var(--rose-600)", fontSize: 11, fontWeight: 800, display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "none", marginTop: 2 }}>{n}</span>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--gray-900)", letterSpacing: "-0.01em" }}>{title}</h2>
          {sub && <p style={{ fontSize: 13.5, color: "var(--text-muted)", marginTop: 2 }}>{sub}</p>}
        </div>
      </div>
      {action && (
        <a style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 600, color: "var(--gray-500)", cursor: "pointer" }}>
          {action} <ArrowRight size={14} />
        </a>
      )}
    </div>
  );
}

function MiniChart({ from = "#FF8FB0", to = "#FF4D7A" }: { from?: string; to?: string }) {
  const id = "g" + Math.abs(from.charCodeAt(1) * 7 + to.charCodeAt(1) * 3);
  return (
    <svg viewBox="0 0 120 44" width="100%" height="44" preserveAspectRatio="none">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={to} stopOpacity="0.35" />
          <stop offset="1" stopColor={to} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M0 38 C20 34 28 22 44 20 C62 18 70 10 88 8 C102 6 110 4 120 2 L120 44 L0 44 Z" fill={`url(#${id})`} />
      <path d="M0 38 C20 34 28 22 44 20 C62 18 70 10 88 8 C102 6 110 4 120 2" fill="none" stroke={from} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function Hero() {
  const router = useRouter();
  const { openSearch } = useApp();
  const filters = [
    { label: "AI Agents", slug: "ai-agents", color: "var(--cat-agents)" },
    { label: "AI Coding", slug: "coding-tools", color: "var(--cat-coding)" },
    { label: "AI Search", slug: "ai-search", color: "var(--cat-search)" },
    { label: "AI Video", slug: "ai-video", color: "var(--cat-video)" },
    { label: "AI Voice", slug: "ai-voice", color: "var(--cat-voice)" },
    { label: "AI Infrastructure", slug: "infrastructure", color: "var(--cat-infra)" },
  ];
  const nodes = [
    { x: 58, y: 8, name: "OpenAI", c: "var(--rose-500)" },
    { x: 80, y: 30, name: "Cursor", c: "var(--cat-coding)" },
    { x: 70, y: 62, name: "ElevenLabs", c: "var(--cat-voice)" },
    { x: 34, y: 54, name: "Anthropic", c: "var(--cat-agents)" },
    { x: 18, y: 26, name: "Perplexity", c: "var(--cat-search)" },
  ];

  return (
    <section style={{ position: "relative", overflow: "hidden", background: "var(--hero-wash)" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "56px 28px 40px", display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: 32, alignItems: "center" }}>
        <div>
          <span style={{ display: "inline-block", padding: "5px 11px", borderRadius: 999, background: "var(--surface-card)", boxShadow: "var(--shadow-xs)", marginBottom: 18, fontSize: 11, fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>AI Companies</span>
          <h1 style={{ fontSize: 52, fontWeight: 800, lineHeight: 1.04, letterSpacing: "-0.035em", color: "var(--gray-900)" }}>
            Discover the world&apos;s<br />most innovative<br />AI companies
          </h1>
          <p style={{ fontSize: 17, color: "var(--text-body)", marginTop: 18, maxWidth: 440, lineHeight: 1.5 }}>
            Explore AI startups, unicorns, frontier labs, and emerging companies shaping the future of artificial intelligence.
          </p>
          <div style={{ marginTop: 26, maxWidth: 520 }}>
            <div
              onClick={openSearch}
              style={{ display: "flex", alignItems: "center", gap: 10, height: 50, background: "var(--surface-card)", border: "1px solid var(--border-default)", borderRadius: 14, padding: "0 16px", cursor: "text", boxShadow: "var(--shadow-sm)" }}
            >
              <span style={{ fontSize: 14, color: "var(--text-subtle)" }}>Search companies, categories, founders, investors…</span>
              <kbd style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--gray-400)", border: "1px solid var(--border-default)", borderRadius: 5, padding: "1px 6px" }}>/</kbd>
            </div>
          </div>
          <div style={{ display: "flex", gap: 9, flexWrap: "wrap", marginTop: 18 }}>
            {filters.map((f) => (
              <span
                key={f.label}
                onClick={() => router.push("/startups?category=" + f.slug)}
                style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 32, padding: "0 12px", borderRadius: 999, border: "1px solid var(--border-subtle)", background: "var(--surface-card)", fontSize: 12.5, fontWeight: 600, color: "var(--gray-700)", cursor: "pointer" }}
              >
                <span style={{ width: 6, height: 6, borderRadius: 999, background: f.color }} />
                {f.label}
              </span>
            ))}
          </div>
        </div>
        <div style={{ position: "relative", height: 320 }}>
          <svg viewBox="0 0 100 80" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
            <ellipse cx="50" cy="40" rx="38" ry="30" fill="none" stroke="var(--rose-200)" strokeWidth="0.4" strokeDasharray="1.5 1.5" />
            <ellipse cx="50" cy="40" rx="24" ry="18" fill="none" stroke="var(--rose-200)" strokeWidth="0.4" strokeDasharray="1.5 1.5" />
            {(["#FF4D7A", "#8B5CF6", "#10B981", "#F97316"] as string[]).map((c, i) => {
              const positions = [[24, 12], [86, 64], [14, 60], [90, 20]];
              const pos = positions[i] ?? [50, 40];
              return <circle key={i} cx={pos[0]} cy={pos[1]} r="1.1" fill={c} />;
            })}
          </svg>
          {nodes.map((n, i) => (
            <div
              key={i}
              className="go-float"
              onClick={() => { const slug = GODATA.findCompanySlug(n.name); if (slug) router.push("/companies/" + slug); }}
              role="button" tabIndex={0}
              style={{ position: "absolute", left: `${n.x}%`, top: `${n.y}%`, padding: "9px 14px 9px 10px", borderRadius: 14, cursor: "pointer", background: "var(--surface-card)", boxShadow: "var(--shadow-md)", display: "flex", alignItems: "center", gap: 9, border: "1px solid var(--border-subtle)", animationDelay: (i * 0.6) + "s" }}
            >
              <LogoTile name={n.name} size={28} />
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--gray-900)", whiteSpace: "nowrap" }}>{n.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Trending() {
  const router = useRouter();
  const goCo = (name: string) => { const slug = GODATA.findCompanySlug(name); if (slug) router.push("/companies/" + slug); };

  const big = [
    { rank: "01", name: "Cursor", cat: "AI Coding", desc: "The AI-first code editor built for developers.", views: "15.2K views (7d)", trend: "Trending #1", grad: "linear-gradient(150deg,#2A1B3D,#0E0A1A)" },
    { rank: "02", name: "Perplexity", cat: "AI Search", desc: "AI search engine for real-time answers.", views: "12.3K views (7d)", trend: "Trending #2", grad: "linear-gradient(150deg,#0E2230,#0A1018)" },
    { rank: "03", name: "Midjourney", cat: "AI Image", desc: "Create stunning images from natural language.", views: "9.7K views (7d)", trend: "Trending #3", grad: "linear-gradient(150deg,#3A1530,#14080F)" },
  ];
  const small = [
    { rank: "04", name: "Runway", cat: "AI Video", views: "7.3K views (7d)", g: "linear-gradient(120deg,#FFF0F4,#EFE7FF)" },
    { rank: "05", name: "Synthesia", cat: "AI Video", views: "6.9K views (7d)", g: "linear-gradient(120deg,#FFE9EF,#FFF6E9)" },
  ];

  return (
    <section style={{ maxWidth: 1240, margin: "28px auto 0", padding: "0 28px" }}>
      <SectionHead n="1" title="Trending AI Companies" sub="The most searched, viewed and discussed AI companies right now." />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1.15fr", gap: 14 }}>
        {big.map((b) => (
          <div key={b.name} onClick={() => goCo(b.name)} role="button" tabIndex={0}
            style={{ position: "relative", borderRadius: 16, padding: 18, minHeight: 168, color: "#fff", overflow: "hidden", background: b.grad, boxShadow: "var(--shadow-md)", cursor: "pointer", transition: "transform .2s", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 11, fontWeight: 800, padding: "3px 7px", borderRadius: 7, background: "rgba(0,0,0,0.45)" }}>{b.rank}</span>
            </div>
            <div>
              <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: "-0.01em" }}>{b.name}</div>
              <div style={{ fontSize: 12.5, opacity: 0.78, marginTop: 1 }}>{b.cat}</div>
              <p style={{ fontSize: 13, opacity: 0.85, marginTop: 8, lineHeight: 1.4, maxWidth: 200 }}>{b.desc}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 700, padding: "4px 8px", borderRadius: 999, background: "rgba(255,77,122,0.92)" }}>🔥 {b.trend}</span>
                <span style={{ fontSize: 12, opacity: 0.8 }}>{b.views}</span>
              </div>
            </div>
          </div>
        ))}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {small.map((s) => (
            <div key={s.name} onClick={() => goCo(s.name)} role="button" tabIndex={0}
              style={{ flex: 1, borderRadius: 16, padding: 14, background: s.g, position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", cursor: "pointer" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <span style={{ fontSize: 11, fontWeight: 800, padding: "3px 7px", borderRadius: 7, background: "var(--gray-900)", color: "#fff" }}>{s.rank}</span>
                <span style={{ width: 28, height: 28, borderRadius: 999, background: "var(--surface-card)", boxShadow: "var(--shadow-sm)", display: "flex", alignItems: "center", justifyContent: "center" }}><ChevronRight size={15} color="var(--gray-700)" /></span>
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--gray-900)" }}>{s.name}</div>
                <div style={{ fontSize: 12, color: "var(--gray-500)" }}>{s.cat}</div>
                <div style={{ fontSize: 11.5, color: "var(--gray-500)", marginTop: 4 }}>{s.views}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FastestGrowing() {
  const router = useRouter();
  const goCo = (name: string) => { const slug = GODATA.findCompanySlug(name); if (slug) router.push("/companies/" + slug); };
  const cos = [
    { name: "Lovable", cat: "AI App Builder", c: ["#FF8FB0", "#FF4D7A"] as [string, string] },
    { name: "Cohere", cat: "AI Infrastructure", c: ["#9F7AEA", "#7C3AED"] as [string, string] },
    { name: "ElevenLabs", cat: "AI Voice", c: ["#5EEAD4", "#0D9488"] as [string, string] },
    { name: "Pika", cat: "AI Video", c: ["#FDBA74", "#F97316"] as [string, string] },
    { name: "Mistral AI", cat: "AI Models", c: ["#FCA5A5", "#EF4444"] as [string, string] },
  ];

  return (
    <section style={{ maxWidth: 1240, margin: "28px auto 0", padding: "0 28px" }}>
      <SectionHead n="2" title="Fastest Growing AI Companies" sub="Companies showing strong momentum across key growth signals." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr) 1.35fr", gap: 12 }}>
        {cos.map((co) => (
          <div key={co.name} onClick={() => goCo(co.name)} role="button" tabIndex={0}
            style={{ borderRadius: 16, background: "var(--surface-card)", border: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-sm)", padding: 14, display: "flex", flexDirection: "column", gap: 8, cursor: "pointer", transition: "transform .2s, box-shadow .2s" }}
            onMouseEnter={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(-3px)"; el.style.boxShadow = "var(--shadow-lg)"; }}
            onMouseLeave={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "var(--shadow-sm)"; }}
          >
            <LogoTile name={co.name} size={36} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--gray-900)" }}>{co.name}</div>
              <div style={{ fontSize: 12, color: "var(--gray-500)" }}>{co.cat}</div>
            </div>
            <div style={{ marginTop: "auto" }}><MiniChart from={co.c[0]} to={co.c[1]} /></div>
          </div>
        ))}
        <div style={{ borderRadius: 16, background: "linear-gradient(150deg,#FFF1F5,#F3ECFF)", padding: 20, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--gray-900)", lineHeight: 1.2 }}>Explore tomorrow&apos;s market leaders today.</h3>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 8 }}>Discover companies with the highest growth potential.</p>
          </div>
          <button onClick={() => router.push("/startups")} style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 14, height: 36, padding: "0 14px", borderRadius: 999, border: "none", background: "var(--gray-900)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-sans)", alignSelf: "flex-start" }}>
            Explore Growth Leaders <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}

function Emerging() {
  const router = useRouter();
  const goCo = (name: string) => { const slug = GODATA.findCompanySlug(name); if (slug) router.push("/companies/" + slug); };
  const feature = { name: "Glean", cat: "AI Search", desc: "Enterprise search across all your data.", year: "2022", size: "51–300 employees", c: ["#A78BFA", "#7C3AED"] as [string, string] };
  const cos = [
    { name: "Reka", cat: "AI Research", desc: "Building multimodal AI models.", year: "2023", size: "11–50" },
    { name: "Hugging Face", cat: "AI Infrastructure", desc: "The AI community building the future.", year: "2016", size: "201–500" },
    { name: "Mistral AI", cat: "AI Models", desc: "Frontier AI models for every builder.", year: "2023", size: "51–200" },
  ];

  return (
    <section style={{ maxWidth: 1240, margin: "28px auto 0", padding: "0 28px" }}>
      <SectionHead n="3" title="Emerging AI Startups to Watch" sub="Promising early-stage companies gaining real traction." />
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: 12 }}>
        <div onClick={() => goCo(feature.name)} role="button" tabIndex={0}
          style={{ borderRadius: 16, background: "linear-gradient(135deg,#EEF0FF,#E5E0FF)", padding: 20, position: "relative", overflow: "hidden", cursor: "pointer", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 188 }}
        >
          <div>
            <div style={{ fontSize: 19, fontWeight: 800, color: "var(--gray-900)" }}>{feature.name}</div>
            <div style={{ fontSize: 12.5, color: "var(--gray-500)", marginTop: 1 }}>{feature.cat}</div>
            <p style={{ fontSize: 13.5, color: "var(--gray-700)", marginTop: 12, maxWidth: 200, lineHeight: 1.45 }}>{feature.desc}</p>
          </div>
          <div style={{ fontSize: 12, color: "var(--gray-500)", fontWeight: 600 }}>{feature.year} · {feature.size}</div>
          <div style={{ position: "absolute", right: -10, bottom: -10, width: 96, height: 96, borderRadius: 26, background: `linear-gradient(135deg,${feature.c[0]},${feature.c[1]})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 14px 30px rgba(124,58,237,0.35)" }}>
            <span style={{ fontSize: 38, fontWeight: 800, color: "#fff" }}>{feature.name[0]}</span>
          </div>
        </div>
        {cos.map((co) => (
          <div key={co.name} onClick={() => goCo(co.name)} role="button" tabIndex={0}
            style={{ borderRadius: 16, background: "var(--surface-card)", border: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-sm)", padding: 16, display: "flex", flexDirection: "column", gap: 6, cursor: "pointer", transition: "transform .2s, box-shadow .2s", minHeight: 188 }}
            onMouseEnter={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(-3px)"; el.style.boxShadow = "var(--shadow-lg)"; }}
            onMouseLeave={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "var(--shadow-sm)"; }}
          >
            <LogoTile name={co.name} size={36} />
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--gray-900)", marginTop: 2 }}>{co.name}</div>
            <div style={{ fontSize: 12, color: "var(--gray-500)" }}>{co.cat}</div>
            <p style={{ fontSize: 12.5, color: "var(--text-muted)", lineHeight: 1.4 }}>{co.desc}</p>
            <div style={{ fontSize: 11.5, color: "var(--gray-400)", fontWeight: 600, marginTop: "auto" }}>{co.year} · {co.size}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Categories() {
  const router = useRouter();
  const cats = [
    { name: "AI Agents", slug: "ai-agents", count: "1,248", color: "var(--cat-agents)" },
    { name: "AI Coding", slug: "coding-tools", count: "863", color: "var(--cat-coding)" },
    { name: "AI Search", slug: "ai-search", count: "324", color: "var(--cat-search)" },
    { name: "AI Video", slug: "ai-video", count: "563", color: "var(--cat-video)" },
    { name: "AI Voice", slug: "ai-voice", count: "412", color: "var(--cat-voice)" },
    { name: "AI Infrastructure", slug: "infrastructure", count: "972", color: "var(--cat-infra)" },
    { name: "Healthcare AI", slug: "healthcare-ai", count: "687", color: "var(--cat-health)" },
    { name: "Robotics", slug: "robotics", count: "396", color: "var(--cat-robotics)" },
  ];
  return (
    <section style={{ maxWidth: 1240, margin: "28px auto 0", padding: "0 28px" }}>
      <SectionHead n="4" title="Browse by Category" sub="Explore companies by what they&apos;re building." action={null} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 10 }}>
        {cats.map((cat) => (
          <div key={cat.name}
            onClick={() => router.push("/startups?category=" + cat.slug)}
            style={{ borderRadius: 14, background: "var(--surface-card)", border: "1px solid var(--border-subtle)", padding: "16px 12px", cursor: "pointer", transition: "border-color .15s, transform .15s" }}
            onMouseEnter={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = cat.color; el.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = "var(--border-subtle)"; el.style.transform = "translateY(0)"; }}
          >
            <div style={{ width: 34, height: 34, borderRadius: 9, background: cat.color + "1a", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
              <span style={{ width: 14, height: 14, borderRadius: 3, background: cat.color, opacity: 0.8 }} />
            </div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--gray-900)" }}>{cat.name}</div>
            <div style={{ fontSize: 11.5, color: "var(--gray-400)", marginTop: 2 }}>{cat.count} companies</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Unicorns() {
  const router = useRouter();
  const u = [["OpenAI", "$80B+"], ["Anthropic", "$18.4B"], ["Databricks", "$43B"], ["Perplexity", "$9B"], ["xAI", "$24B"]] as [string, string][];
  return (
    <section style={{ maxWidth: 1240, margin: "28px auto 0", padding: "0 28px" }}>
      <div style={{ borderRadius: 18, background: "linear-gradient(110deg,#FFF1F5,#F6ECFF)", padding: "20px 24px", display: "flex", alignItems: "center", gap: 28 }}>
        <div style={{ flex: "none", maxWidth: 200 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <span style={{ width: 22, height: 22, borderRadius: 999, background: "var(--surface-card)", color: "var(--rose-600)", fontSize: 11, fontWeight: 800, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>8</span>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--gray-900)" }}>AI Unicorns</h2>
          </div>
          <p style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 4, marginLeft: 31 }}>Private companies valued at $1B+.</p>
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-around", gap: 12 }}>
          {u.map(([name, val]) => (
            <div key={name} onClick={() => { const slug = GODATA.findCompanySlug(name); if (slug) router.push("/companies/" + slug); }} role="button" tabIndex={0} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
              <LogoTile name={name} size={36} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--gray-900)" }}>{name}</div>
                <div style={{ fontSize: 12.5, color: "var(--gray-500)" }}>{val}</div>
              </div>
            </div>
          ))}
        </div>
        <span onClick={() => router.push("/startups?unicorn=true")} style={{ width: 34, height: 34, borderRadius: 999, background: "var(--surface-card)", boxShadow: "var(--shadow-sm)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none", cursor: "pointer" }}>
          <ChevronRight size={16} color="var(--gray-700)" />
        </span>
      </div>
    </section>
  );
}

export function CompaniesHome() {
  return (
    <div>
      <Hero />
      <div style={{ height: 28 }} />
      <Trending />
      <FastestGrowing />
      <Emerging />
      <Categories />
      <Unicorns />
      <div style={{ height: 40 }} />
    </div>
  );
}
import type { GOData, Company, Investor, Product, NewsItem, Job, FundingRound } from "@/types";

const CAT: Record<string, string> = {
  "Foundation Models": "#FF4D7A",
  "AI Agents": "#8B5CF6",
  "AI Coding": "#10B981",
  "AI Search": "#3B82F6",
  "AI Video": "#EC4899",
  "AI Voice": "#F97316",
  "AI Infrastructure": "#14B8A6",
  "Healthcare AI": "#22C55E",
  "AI Image": "#A855F7",
  "Legal AI": "#0EA5E9",
  "Robotics": "#F59E0B",
  "Enterprise AI": "#6366F1",
};

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const fmtB = (b: number): string =>
  b >= 1 ? "$" + (b % 1 === 0 ? b : b.toFixed(1)) + "B" : "$" + Math.round(b * 1000) + "M";

const INV = [
  ["Sequoia Capital", "VC", "Menlo Park, CA", 1972, true, 25, 20, 85, "Backing the daring from idea to iconic.", "Roelof Botha:Managing Partner;Pat Grady:Managing Partner;Doug Leone:Partner;Alfred Lin:Partner", "AI Infrastructure:35;AI Agents:22;AI Coding:18;Healthcare AI:15;Enterprise AI:10"],
  ["Andreessen Horowitz", "VC", "Menlo Park, CA", 2009, true, 30, 9, 44, "Software is eating the world; AI is eating software.", "Marc Andreessen:Co-founder;Ben Horowitz:Co-founder;Martin Casado:General Partner;Anjney Midha:General Partner", "Foundation Models:30;AI Agents:25;Developer Tools:20;AI Infrastructure:15;Enterprise AI:10"],
  ["Accel", "VC", "Palo Alto, CA", 1983, true, 18, 16, 30, "Backing exceptional teams from inception.", "Rich Wong:Partner;Dan Levine:Partner;Sameer Gandhi:Partner", "Enterprise AI:34;AI Coding:24;Consumer AI:20;AI Infrastructure:12;Healthcare AI:10"],
  ["Lightspeed Venture Partners", "VC", "Menlo Park, CA", 2000, true, 20, 14, 25, "Partnering with exceptional founders early.", "Ravi Mhatre:Partner;Nnamdi Okike:Partner;Guru Chahal:Partner", "AI/ML:30;Enterprise AI:26;AI Infrastructure:20;Foundation Models:14;Robotics:10"],
  ["General Catalyst", "VC", "Cambridge, MA", 2000, true, 20, 12, 32, "Powering transformation across the economy.", "Hemant Taneja:CEO;Deep Nishar:Partner;Marc Bhargava:Partner", "Healthcare AI:32;AI Agents:24;Enterprise AI:20;Foundation Models:14;Robotics:10"],
  ["Benchmark", "VC", "San Francisco, CA", 1995, true, 15, 11, 12, "A single fund, equal partners, founder-first.", "Peter Fenton:Partner;Eric Vishria:Partner;Sarah Tavel:Partner", "AI Agents:30;AI Coding:26;Consumer AI:22;Enterprise AI:12;AI Search:10"],
  ["GV", "Corporate", "Mountain View, CA", 2009, true, 18, 0, 10, "Backing the most ambitious founders, from seed to growth.", "David Krane:CEO;Crystal Huang:Partner;Erik Nordlander:Partner", "Healthcare AI:30;AI Infrastructure:26;Foundation Models:20;Enterprise AI:14;Robotics:10"],
  ["Khosla Ventures", "VC", "Menlo Park, CA", 2004, true, 15, 8, 15, "Bold bets on hard technology.", "Vinod Khosla:Founder;Keith Rabois:Partner;David Weiden:Partner", "Foundation Models:34;Deep Tech:24;Robotics:18;Healthcare AI:14;AI Infrastructure:10"],
  ["Founders Fund", "VC", "San Francisco, CA", 2005, true, 25, 9, 12, "Investing in smart people solving difficult problems.", "Peter Thiel:Partner;Brian Singerman:Partner;Trae Stephens:Partner", "Foundation Models:30;Robotics:24;AI Infrastructure:20;Enterprise AI:16;Healthcare AI:10"],
  ["Greylock Partners", "VC", "Menlo Park, CA", 1965, true, 18, 17, 3.5, "Day-one partner to founders.", "Reid Hoffman:Partner;Saam Motamedi:Partner;Sarah Guo:Partner", "Enterprise AI:32;AI Agents:24;AI Infrastructure:20;Foundation Models:14;AI Search:10"],
  ["Index Ventures", "VC", "London, UK", 1996, true, 16, 11, 13, "Helping ambitious founders win globally.", "Mike Volpi:Partner;Erin Price-Wright:Partner;Jan Hammer:Partner", "AI Agents:30;Enterprise AI:26;AI Coding:20;Foundation Models:14;Healthcare AI:10"],
  ["Thrive Capital", "VC", "New York, NY", 2010, true, 30, 9, 15, "Concentrated bets on category-defining leaders.", "Josh Kushner:Founder;Vince Hankes:Partner;Kareem Zaki:Partner", "Foundation Models:36;AI Coding:24;Enterprise AI:18;AI Agents:12;AI Search:10"],
] as const;

const CO = [
  ["OpenAI", "Foundation Models", "San Francisco, CA", 2015, 3500, 1.4, true, 157, 21.9, "Creating safe AGI that benefits all of humanity.", "OpenAI is an AI research and deployment company building safe and beneficial artificial general intelligence.", "Artificial Intelligence;Machine Learning;Generative AI;Foundation Models;AI Research", "Sam Altman:CEO & Co-founder;Greg Brockman:President & Co-founder;Ilya Sutskever:Co-founder", "chatgpt;gpt-4o;sora;operator", "thrive-capital;andreessen-horowitz;khosla-ventures;sequoia-capital"],
  ["Anthropic", "Foundation Models", "San Francisco, CA", 2021, 1000, 1.8, true, 61.5, 14.3, "AI safety and research company building reliable, interpretable systems.", "Anthropic is an AI safety company building Claude, a family of helpful, harmless, and honest AI assistants.", "AI Safety;Foundation Models;Generative AI;Research;Enterprise AI", "Dario Amodei:CEO & Co-founder;Daniela Amodei:President & Co-founder;Tom Brown:Co-founder", "claude;claude-code", "gv;greylock;lightspeed-venture-partners;general-catalyst"],
  ["Mistral AI", "Foundation Models", "Paris, France", 2023, 150, 1.2, true, 6.2, 1.1, "Frontier AI models for every builder, open where it matters.", "Mistral AI builds open and portable frontier models for developers and enterprises.", "Open Models;Foundation Models;Generative AI;Developer Tools", "Arthur Mensch:CEO & Co-founder;Guillaume Lample:Chief Scientist;Timothée Lacroix:CTO", "le-chat;codestral", "andreessen-horowitz;lightspeed-venture-partners;index-ventures"],
  ["xAI", "Foundation Models", "Palo Alto, CA", 2023, 300, 2.1, true, 50, 12, "Understand the true nature of the universe.", "xAI develops frontier models including Grok, integrated across the X platform.", "Foundation Models;Reasoning;Generative AI;Research", "Elon Musk:CEO & Founder;Igor Babuschkin:Co-founder", "", "founders-fund;sequoia-capital"],
  ["Cohere", "Enterprise AI", "Toronto, Canada", 2019, 400, 0.6, true, 5.5, 0.97, "The enterprise AI platform for language.", "Cohere builds large language models and a secure enterprise platform for RAG, search, and agents.", "Enterprise AI;LLMs;RAG;Foundation Models", "Aidan Gomez:CEO & Co-founder;Nick Frosst:Co-founder;Ivan Zhang:Co-founder", "", "index-ventures;general-catalyst;andreessen-horowitz"],
  ["Google DeepMind", "Foundation Models", "London, UK", 2010, 2500, 0.3, false, 0, 0, "Solving intelligence to advance science and benefit humanity.", "Google DeepMind is a world leader in AI research, behind Gemini, AlphaFold and breakthroughs across science.", "AI Research;Foundation Models;Science;Reinforcement Learning", "Demis Hassabis:CEO & Co-founder;Shane Legg:Chief Scientist", "", ""],
  ["Hugging Face", "AI Infrastructure", "New York, NY", 2016, 350, 0.7, true, 4.5, 0.4, "The AI community building the future.", "Hugging Face is the most-used open platform for machine learning, hosting models, datasets and tools.", "Open Source;AI Infrastructure;ML Platform;Community", "Clément Delangue:CEO & Co-founder;Julien Chaumond:CTO;Thomas Wolf:Chief Scientist", "", "sequoia-capital;lightspeed-venture-partners;thrive-capital"],
  ["Perplexity AI", "AI Search", "San Francisco, CA", 2022, 180, 2.4, true, 9, 0.9, "Where knowledge begins — the answer engine.", "Perplexity is an AI answer engine that delivers accurate, cited responses to any question.", "AI Search;Answer Engine;Consumer AI;Generative AI", "Aravind Srinivas:CEO & Co-founder;Denis Yarats:CTO;Johnny Ho:Co-founder", "perplexity", "andreessen-horowitz;benchmark;index-ventures"],
  ["Cursor (Anysphere)", "AI Coding", "San Francisco, CA", 2022, 60, 3.0, true, 2.6, 0.4, "The AI code editor built for productivity.", "Anysphere builds Cursor, the AI-first code editor that lets engineers write, edit and understand code.", "AI Coding;Developer Tools;Productivity;IDE", "Michael Truell:CEO & Co-founder;Sualeh Asif:CPO;Arvid Lunnemark:Co-founder", "cursor", "thrive-capital;andreessen-horowitz;benchmark"],
  ["Glean", "AI Search", "Palo Alto, CA", 2019, 600, 0.9, true, 4.6, 0.6, "The work AI platform for the enterprise.", "Glean connects and searches all your company's apps and data, grounding AI assistants in enterprise knowledge.", "Enterprise Search;AI Agents;Knowledge;Enterprise AI", "Arvind Jain:CEO & Founder;T.R. Vishwanath:Chief Architect", "glean-assistant", "sequoia-capital;lightspeed-venture-partners;general-catalyst"],
  ["Harvey", "Legal AI", "San Francisco, CA", 2022, 300, 1.6, true, 3, 0.5, "Domain-specific AI for legal and professional services.", "Harvey builds generative AI tailored to law firms and legal teams.", "Legal AI;Enterprise AI;Generative AI;Professional Services", "Winston Weinberg:CEO & Co-founder;Gabriel Pereyra:President & Co-founder", "harvey", "sequoia-capital;gv;general-catalyst"],
  ["Scale AI", "AI Infrastructure", "San Francisco, CA", 2016, 900, 0.5, true, 13.8, 1.6, "The data foundry for AI.", "Scale AI provides high-quality training data, evaluation and infrastructure powering frontier models.", "Data;AI Infrastructure;Evaluation;Enterprise AI", "Alexandr Wang:CEO & Founder;Lucy Guo:Co-founder", "", "accel;founders-fund;greylock"],
  ["Databricks", "AI Infrastructure", "San Francisco, CA", 2013, 7000, 0.4, true, 62, 14, "The data and AI company.", "Databricks unifies data, analytics and AI on the lakehouse, enabling enterprises to build and deploy AI.", "Data;AI Infrastructure;Lakehouse;Enterprise AI", "Ali Ghodsi:CEO & Co-founder;Matei Zaharia:CTO & Co-founder", "", "andreessen-horowitz;thrive-capital;greylock"],
  ["Runway", "AI Video", "New York, NY", 2018, 200, 1.1, true, 1.5, 0.24, "Advancing creativity with generative media.", "Runway builds frontier generative video models and creative tools used by filmmakers and studios.", "AI Video;Generative Media;Creative Tools;Research", "Cristóbal Valenzuela:CEO & Co-founder;Anastasis Germanidis:CTO", "gen-3-alpha", "general-catalyst;greylock;lightspeed-venture-partners"],
  ["ElevenLabs", "AI Voice", "London, UK", 2022, 120, 2.0, true, 3.3, 0.28, "The most realistic AI audio platform.", "ElevenLabs builds lifelike text-to-speech, voice cloning and dubbing in 30+ languages.", "AI Voice;Audio;Generative AI;Developer Tools", "Mati Staniszewski:CEO & Co-founder;Piotr Dąbkowski:CTO & Co-founder", "elevenlabs", "andreessen-horowitz;sequoia-capital"],
  ["Midjourney", "AI Image", "San Francisco, CA", 2021, 60, 0.8, false, 0, 0, "An independent research lab exploring new mediums of thought.", "Midjourney builds one of the world's most popular text-to-image generators.", "AI Image;Generative Media;Creative;Research", "David Holz:CEO & Founder", "midjourney-v6", ""],
  ["Stability AI", "AI Image", "London, UK", 2019, 200, -0.1, true, 1, 0.25, "Open models for the imagination.", "Stability AI develops open generative models across image, video and audio.", "Open Models;AI Image;Generative Media;Research", "Prem Akkaraju:CEO;Emad Mostaque:Founder", "stable-diffusion-3", "greylock"],
  ["Synthesia", "AI Video", "London, UK", 2017, 400, 1.0, true, 2.1, 0.33, "The #1 AI video communications platform.", "Synthesia turns text into studio-quality videos with AI avatars in 140+ languages.", "AI Video;Avatars;Enterprise AI;Generative Media", "Victor Riparbelli:CEO & Co-founder;Steffen Tjerrild:COO & Co-founder", "synthesia", "accel;index-ventures"],
  ["Character.AI", "AI Agents", "Menlo Park, CA", 2021, 150, 0.6, true, 1, 0.15, "Personalized superintelligence, today.", "Character.AI lets anyone create and chat with lifelike AI characters.", "AI Agents;Consumer AI;Generative AI;Entertainment", "Noam Shazeer:Co-founder;Daniel De Freitas:Co-founder", "character-ai", "andreessen-horowitz"],
  ["Together AI", "AI Infrastructure", "San Francisco, CA", 2022, 130, 1.7, true, 3.3, 0.5, "The fastest cloud for generative AI.", "Together AI offers high-performance training and inference for open models.", "AI Infrastructure;Inference;Open Models;Cloud", "Vipul Ved Prakash:CEO & Co-founder;Ce Zhang:CTO", "together-inference", "general-catalyst;lightspeed-venture-partners;khosla-ventures"],
  ["Groq", "AI Infrastructure", "Mountain View, CA", 2016, 300, 1.5, true, 2.8, 0.64, "Instant intelligence at scale.", "Groq builds the LPU inference engine delivering ultra-low-latency model serving.", "AI Infrastructure;Chips;Inference;Hardware", "Jonathan Ross:CEO & Founder", "groqcloud", "khosla-ventures;general-catalyst"],
  ["Pinecone", "AI Infrastructure", "New York, NY", 2019, 130, 1.1, true, 0.75, 0.14, "The vector database for AI.", "Pinecone is the leading managed vector database powering retrieval for AI applications.", "AI Infrastructure;Vector Database;Search;Developer Tools", "Edo Liberty:CEO & Founder", "pinecone", "andreessen-horowitz;index-ventures"],
  ["LangChain", "AI Infrastructure", "San Francisco, CA", 2022, 60, 1.8, false, 0.2, 0.04, "The platform for building agents.", "LangChain provides the framework and platform to build, observe and deploy reliable LLM applications.", "AI Infrastructure;Developer Tools;Agents;Open Source", "Harrison Chase:CEO & Co-founder;Ankush Gola:Co-founder", "langchain", "sequoia-capital;benchmark"],
  ["Sierra", "AI Agents", "San Francisco, CA", 2023, 100, 2.6, true, 4.5, 0.28, "Elevate your customer experience with AI agents.", "Sierra builds conversational AI agents that resolve customer issues for leading brands.", "AI Agents;Customer Experience;Enterprise AI", "Bret Taylor:CEO & Co-founder;Clay Bavor:Co-founder", "sierra-agent-os", "sequoia-capital;benchmark;thrive-capital"],
  ["Cognition AI", "AI Coding", "San Francisco, CA", 2023, 30, 3.5, true, 2, 0.2, "The AI software engineering team.", "Cognition builds Devin, an autonomous AI software engineer that plans and ships code end-to-end.", "AI Coding;Agents;Developer Tools;Automation", "Scott Wu:CEO & Co-founder;Steven Hao:Co-founder", "devin", "founders-fund;thrive-capital"],
  ["Codeium (Windsurf)", "AI Coding", "Mountain View, CA", 2021, 150, 1.9, true, 1.25, 0.24, "The agentic IDE for every developer.", "Codeium builds Windsurf, the agentic AI IDE, plus AI coding tools used across thousands of enterprises.", "AI Coding;Developer Tools;IDE;Enterprise AI", "Varun Mohan:CEO & Co-founder;Douglas Chen:Co-founder", "windsurf", "greylock;general-catalyst;khosla-ventures"],
  ["Lovable", "AI Coding", "Stockholm, Sweden", 2023, 35, 3.8, false, 0.18, 0.02, "Build software by chatting with AI.", "Lovable lets anyone create production web apps through natural-language conversation.", "AI Coding;No-Code;App Builder;Consumer AI", "Anton Osika:CEO & Co-founder;Fabian Hedin:CTO", "lovable", "accel;index-ventures"],
  ["Suno", "AI Voice", "Cambridge, MA", 2022, 50, 2.4, true, 0.5, 0.13, "Make any song you can imagine.", "Suno builds generative music models that let anyone create original songs from a text prompt.", "AI Voice;Music;Generative Media;Consumer AI", "Mikey Shulman:CEO & Co-founder", "suno-v4", "lightspeed-venture-partners"],
  ["Pika", "AI Video", "Palo Alto, CA", 2023, 40, 2.0, false, 0.47, 0.14, "The idea-to-video platform.", "Pika builds playful, powerful generative video tools that bring any idea to motion.", "AI Video;Generative Media;Consumer AI;Creative", "Demi Guo:CEO & Co-founder;Chenlin Meng:CTO", "pika-1-5", "lightspeed-venture-partners;greylock"],
  ["Luma AI", "AI Video", "San Francisco, CA", 2021, 60, 1.6, false, 0.3, 0.07, "Multimodal AI for video and 3D.", "Luma AI builds Dream Machine, generating realistic video and 3D from text and images.", "AI Video;3D;Generative Media;Research", "Amit Jain:CEO & Co-founder", "dream-machine", "andreessen-horowitz"],
  ["Abridge", "Healthcare AI", "Pittsburgh, PA", 2018, 300, 1.7, true, 2.75, 0.46, "Powering the clinical conversation.", "Abridge turns patient–clinician conversations into structured clinical notes.", "Healthcare AI;Clinical;Generative AI;Enterprise AI", "Shiv Rao:CEO & Co-founder;Florian Metze:Co-founder", "abridge", "general-catalyst;gv;lightspeed-venture-partners"],
  ["Writer", "Enterprise AI", "San Francisco, CA", 2020, 250, 1.3, true, 1.9, 0.33, "The full-stack generative AI platform for enterprises.", "Writer builds enterprise-grade models and an agentic platform for business workflows.", "Enterprise AI;Generative AI;Agents;Productivity", "May Habib:CEO & Co-founder;Waseem AlShikh:CTO & Co-founder", "writer", "accel"],
  ["Jasper", "Enterprise AI", "Austin, TX", 2021, 200, 0.3, true, 1.5, 0.14, "The AI platform for marketing teams.", "Jasper helps marketing teams create on-brand content and campaigns with generative AI.", "Enterprise AI;Marketing;Generative AI;Content", "Timothy Young:CEO;Dave Rogenmoser:Co-founder", "jasper", ""],
] as const;

const PR = [
  ["ChatGPT", "openai", "Foundation Models", "Conversational AI assistant for any question or task.", 24000, 600],
  ["GPT-4o", "openai", "Foundation Models", "Omni multimodal flagship model.", 18500, 462],
  ["Sora", "openai", "AI Video", "Text-to-video generation.", 15200, 380],
  ["Operator", "openai", "AI Agents", "Browser-using AI agent that completes tasks.", 8400, 210],
  ["Claude", "anthropic", "Foundation Models", "Helpful, harmless AI assistant for thoughtful work.", 19800, 495],
  ["Claude Code", "anthropic", "AI Coding", "Agentic coding in the terminal.", 9100, 228],
  ["Le Chat", "mistral-ai", "Foundation Models", "Multilingual AI assistant by Mistral.", 5400, 135],
  ["Codestral", "mistral-ai", "AI Coding", "Open code-generation model.", 4200, 105],
  ["Perplexity", "perplexity-ai", "AI Search", "Answer engine with real-time citations.", 12600, 315],
  ["Cursor", "cursor-anysphere", "AI Coding", "The AI-first code editor built for speed.", 16700, 417],
  ["Midjourney v6", "midjourney", "AI Image", "Distinctive text-to-image generation.", 14300, 358],
  ["Gen-3 Alpha", "runway", "AI Video", "Cinematic generative video.", 7800, 195],
  ["ElevenLabs", "elevenlabs", "AI Voice", "Realistic voice synthesis and cloning.", 8600, 215],
  ["Synthesia", "synthesia", "AI Video", "AI avatar video creation in 140+ languages.", 6200, 155],
  ["Suno v4", "suno", "AI Voice", "AI music generation from a prompt.", 7100, 178],
  ["Devin", "cognition-ai", "AI Coding", "Autonomous AI software engineer.", 6900, 172],
  ["Glean Assistant", "glean", "AI Search", "Enterprise work assistant grounded in your data.", 4300, 108],
  ["Harvey", "harvey", "Legal AI", "Generative AI for legal teams.", 3800, 95],
  ["Pika 1.5", "pika", "AI Video", "Idea-to-video generation.", 5200, 130],
  ["Dream Machine", "luma-ai", "AI Video", "Realistic video from text and images.", 4900, 122],
  ["Stable Diffusion 3", "stability-ai", "AI Image", "Open image-generation model.", 6400, 160],
  ["Together Inference", "together-ai", "AI Infrastructure", "Fast open-model inference cloud.", 2800, 70],
  ["Pinecone", "pinecone", "AI Infrastructure", "Vector database for AI retrieval.", 3100, 78],
  ["LangChain", "langchain", "AI Infrastructure", "Framework for building LLM apps.", 7300, 182],
  ["GroqCloud", "groq", "AI Infrastructure", "Ultra-low-latency LLM inference.", 4100, 102],
  ["Sierra Agent OS", "sierra", "AI Agents", "Conversational AI agents for business.", 3300, 82],
  ["Writer", "writer", "Enterprise AI", "Full-stack generative AI platform.", 3600, 90],
  ["Jasper", "jasper", "Enterprise AI", "AI marketing copilot.", 4700, 117],
  ["Windsurf", "codeium-windsurf", "AI Coding", "Agentic AI IDE.", 6100, 152],
  ["Lovable", "lovable", "AI Coding", "Build apps by chatting.", 8800, 220],
  ["Abridge", "abridge", "Healthcare AI", "Clinical documentation AI.", 2400, 60],
  ["Character.AI", "character-ai", "AI Agents", "Personalized AI characters.", 9600, 240],
] as const;

const STAGES = ["Seed", "Series A", "Series B", "Series C", "Series D", "Series E"] as const;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;

function genRounds(raisedB: number, founded: number, investorSlugs: string[]): FundingRound[] {
  if (!raisedB) return [];
  const n = raisedB >= 5 ? 5 : raisedB >= 1 ? 4 : raisedB >= 0.3 ? 3 : 2;
  const rounds: FundingRound[] = [];
  let remaining = raisedB * 1000;
  for (let i = 0; i < n; i++) {
    const frac = (i + 1) / ((n * (n + 1)) / 2);
    const amt = Math.max(2, Math.round(remaining * frac * (i === n - 1 ? 1.3 : 1)));
    const year = Math.min(2025, founded + i + (founded < 2018 ? 2 : 1));
    const stageIdx = Math.min(i, STAGES.length - 1);
    const stage = STAGES[stageIdx] ?? "Seed";
    const monthIdx = (i * 5 + 2) % 12;
    const month = MONTHS[monthIdx] ?? "Jan";
    const lead = investorSlugs[i % Math.max(1, investorSlugs.length)];
    rounds.push({
      stage,
      amount: amt >= 1000 ? "$" + (amt / 1000).toFixed(1) + "B" : "$" + amt + "M",
      amountM: amt,
      date: month + " " + year,
      year,
      leads: lead ? [lead] : [],
    });
  }
  return rounds.reverse();
}

function buildGODATA(): GOData {
  const palette = ["#FF4D7A", "#3B82F6", "#93C5FD", "#C4B5FD", "#8B5CF6", "#22C55E"];

  const investors: Investor[] = INV.map(([name, type, hq, founded, _verified, checkM, fundNo, aumB, thesis, partnersCsv, sectorsCsv]) => {
    const sectors = String(sectorsCsv).split(";").map((s, i) => {
      const parts = s.split(":");
      const label = parts[0] ?? s;
      const v = Number(parts[1] ?? 20);
      return { label, v, c: palette[i % palette.length] ?? "#FF4D7A" };
    });
    return {
      slug: slugify(String(name)),
      name: String(name),
      type: String(type),
      hq: String(hq),
      founded: Number(founded),
      verified: Boolean(_verified),
      avgCheck: "$" + String(checkM) + "M",
      fundNumber: Number(fundNo),
      aum: Number(aumB) ? fmtB(Number(aumB)) : "—",
      thesis: String(thesis),
      partners: String(partnersCsv).split(";").map((p) => {
        const parts = p.split(":");
        return { name: parts[0] ?? p, role: parts[1] ?? "" };
      }),
      sectors,
      stages: ["Seed", "Series A", "Series B", "Growth"],
      portfolioSlugs: [],
      portfolioCount: 0,
      deals90d: 0,
      coInvestors: [],
      recent: [],
      velocity: [],
    };
  });

  const investorBySlug = Object.fromEntries(investors.map((i) => [i.slug, i]));

  const companies: Company[] = CO.map(([name, cat, hq, founded, employees, growth, unicorn, valB, raisedB, tagline, desc, tagsCsv, foundersCsv, productsCsv, investorsCsv]) => {
    const slug = slugify(String(name));
    const investorSlugs = String(investorsCsv) ? String(investorsCsv).split(";").filter(Boolean) : [];
    const rounds = genRounds(Number(raisedB), Number(founded), investorSlugs);
    const founders = String(foundersCsv).split(";").filter(Boolean).map((f) => {
      const parts = f.split(":");
      return { name: parts[0] ?? f, role: parts[1] ?? "" };
    });
    const timeline: { year: string; label: string }[] = [{ year: String(founded), label: "Founded" }];
    [...rounds].reverse().forEach((r) => timeline.push({ year: String(r.year), label: r.stage + " · " + r.amount }));
    if (unicorn) timeline.push({ year: "2024", label: "Unicorn status" });
    return {
      slug, name: String(name),
      cat: String(cat), catColor: CAT[String(cat)] ?? "#FF4D7A",
      hq: String(hq), founded: Number(founded), employees: Number(employees),
      growth: Number(growth), unicorn: Boolean(unicorn),
      valuation: Number(valB) ? fmtB(Number(valB)) : "Private",
      raised: Number(raisedB) ? fmtB(Number(raisedB)) : "—",
      tagline: String(tagline), desc: String(desc),
      tags: String(tagsCsv).split(";"),
      founders,
      productSlugs: String(productsCsv) ? String(productsCsv).split(";").filter(Boolean) : [],
      investorSlugs, rounds,
      timeline: timeline.slice(0, 7),
      website: slug.replace(/-/g, "") + ".com",
      similar: [],
    };
  });

  const companyBySlug = Object.fromEntries(companies.map((c) => [c.slug, c]));

  companies.forEach((c) => {
    c.similar = companies.filter((o) => o.cat === c.cat && o.slug !== c.slug).slice(0, 5).map((o) => o.slug);
    if (c.similar.length < 5) {
      const extra = companies.filter((o) => o.slug !== c.slug && !c.similar.includes(o.slug)).slice(0, 5 - c.similar.length).map((o) => o.slug);
      c.similar = c.similar.concat(extra);
    }
  });

  const products: Product[] = PR.map(([name, companySlug, category, desc, upvotes, comments]) => {
    const company = companyBySlug[String(companySlug)];
    return {
      slug: slugify(String(name)),
      name: String(name),
      companySlug: String(companySlug),
      company: company ? company.name : String(companySlug),
      category: String(category),
      categoryColor: CAT[String(category)] ?? "#FF4D7A",
      desc: String(desc),
      upvotes: Number(upvotes),
      comments: Number(comments),
    };
  });

  const productBySlug = Object.fromEntries(products.map((p) => [p.slug, p]));

  investors.forEach((inv) => {
    const portfolio = companies.filter((c) => c.investorSlugs.includes(inv.slug));
    inv.portfolioSlugs = portfolio.map((c) => c.slug);
    inv.portfolioCount = portfolio.length;
    inv.recent = portfolio.slice(0, 6).map((c) => {
      const r = c.rounds[0] ?? { stage: "Series A", amount: c.raised, date: "2024", amountM: 0, year: 2024, leads: [] };
      const lead = r.leads && r.leads.includes(inv.slug);
      return { companySlug: c.slug, company: c.name, cat: c.cat, stage: r.stage, amount: r.amount, role: lead ? "Lead Investor" : "Participant" };
    });
    const coCount: Record<string, number> = {};
    portfolio.forEach((c) => c.investorSlugs.forEach((s) => { if (s !== inv.slug) coCount[s] = (coCount[s] ?? 0) + 1; }));
    inv.coInvestors = Object.entries(coCount).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([s, n]) => ({ slug: s, name: investorBySlug[s]?.name ?? s, shared: n }));
    const base = Math.max(4, Math.round(inv.portfolioCount * 1.2));
    inv.velocity = ["Q1 '24", "Q2 '24", "Q3 '24", "Q4 '24", "Q1 '25", "Q2 '25"].map((q, i) => ({ label: q, deals: Math.max(2, base + ((i * 7) % 6) - 2) }));
    inv.deals90d = base + 4;
  });

  const NEWS_TPL = [
    ["AI Models", "{c} launches its next-generation foundation model with improved reasoning"],
    ["AI Models", "{c} releases a new model with expanded context and native multimodality"],
    ["AI Tools", "{c} ships a major product update with new agentic capabilities"],
    ["AI Tools", "{c} introduces an AI agent for autonomous workflows"],
    ["Funding", "{c} raises a new round at a higher valuation"],
    ["Funding", "{c} closes a mega-round to accelerate frontier research"],
    ["Research", "{c} publishes new research on efficient model training"],
    ["Research", "{c} open-sources best practices for AI transparency"],
    ["Datasets", "{c} announces a new dataset and evaluation suite"],
    ["Product Launch", "{c} unveils a flagship product to broad demand"],
    ["Acquisition", "{c} acquires a team to expand its platform"],
  ] as const;

  const SOURCES = ["TechCrunch", "The Information", "Bloomberg", "Reuters"] as const;
  const news: NewsItem[] = [];
  for (let i = 0; i < 120; i++) {
    const c = companies[i % companies.length];
    if (!c) continue;
    const tpl = NEWS_TPL[i % NEWS_TPL.length];
    if (!tpl) continue;
    const [kind, template] = tpl;
    const daysAgo = Math.floor((i * 7.3) % 90);
    const title = template.replace("{c}", c.name);
    news.push({
      slug: slugify(c.slug + "-" + kind + "-" + i),
      title, companySlug: c.slug, company: c.name,
      domain: c.website,
      kind,
      daysAgo, hoursAgo: i < 10 ? (i + 1) * 2 : null,
      comments: 4 + ((i * 5) % 28),
    });
  }
  news.sort((a, b) => a.daysAgo - b.daysAgo);

  const tagCount: Record<string, number> = {};
  companies.forEach((c) => c.tags.forEach((t) => { tagCount[t] = (tagCount[t] ?? 0) + 1; }));
  const trendingTags = Object.entries(tagCount).sort((a, b) => b[1] - a[1]).slice(0, 9)
    .map(([label, n]) => ({ label, count: n * 13 + 7 }));

  const ROLES = [
    ["Software Engineer", "Engineering", 150, 200],
    ["Senior ML Engineer", "Engineering", 200, 280],
    ["Product Manager", "Product", 160, 220],
    ["Research Scientist", "Research", 220, 320],
    ["Developer Advocate", "Marketing", 130, 180],
    ["Account Executive", "Sales", 120, 240],
    ["Design Lead", "Design", 170, 230],
    ["Data Engineer", "Engineering", 160, 210],
  ] as const;
  const LOCS = ["San Francisco, CA", "Remote — US", "New York, NY", "London, UK", "Remote — Global"] as const;
  const jobs: Job[] = [];
  companies.forEach((c, ci) => {
    const count = (ci % 3) + 1;
    for (let j = 0; j < count; j++) {
      const role = ROLES[(ci + j) % ROLES.length];
      if (!role) continue;
      const [title, dept, lo, hi] = role;
      const loc = LOCS[(ci + j) % LOCS.length] ?? "Remote — US";
      jobs.push({
        slug: slugify(c.slug + "-" + title + "-" + j),
        title, dept, companySlug: c.slug, company: c.name,
        location: loc,
        type: j % 4 === 0 ? "Contract" : "Full-time",
        salary: "$" + lo + "k–$" + hi + "k",
        postedDays: ((ci * 3 + j * 5) % 28),
      });
    }
  });

  const totalRaised = companies.reduce((s, c) => {
    const match = c.raised.match(/[\d.]+/);
    const n = match ? parseFloat(match[0]) : 0;
    return s + (c.raised.includes("B") ? n : n * 0.001);
  }, 0);

  const stats = {
    companies: String(companies.length),
    investors: String(investors.length),
    products: String(products.length),
    unicorns: String(companies.filter((c) => c.unicorn).length),
    news: String(news.length),
    jobs: String(jobs.length),
    totalFunding: "$" + totalRaised.toFixed(0) + "B",
    rounds: String(companies.reduce((s, c) => s + c.rounds.length, 0)),
  };

  return {
    CAT, companies, companyBySlug, investors, investorBySlug, products, productBySlug,
    news, jobs, stats, trendingTags,
    findCompanySlug(name: string) {
      if (!name) return undefined;
      const n = name.toLowerCase().trim();
      return (
        companies.find((c) => c.name.toLowerCase() === n) ??
        companies.find((c) => c.name.toLowerCase().startsWith(n)) ??
        companies.find((c) => c.name.toLowerCase().includes(n) || n.includes(c.slug.split("-")[0] ?? ""))
      )?.slug;
    },
    findInvestorSlug(name: string) {
      if (!name) return undefined;
      const alias: Record<string, string> = { "a16z": "andreessen-horowitz", "sequoia": "sequoia-capital", "lightspeed": "lightspeed-venture-partners", "general catalyst": "general-catalyst" };
      const n = name.toLowerCase().trim();
      if (alias[n]) return alias[n];
      return (
        investors.find((v) => v.name.toLowerCase() === n) ??
        investors.find((v) => v.name.toLowerCase().startsWith(n)) ??
        investors.find((v) => v.name.toLowerCase().includes(n))
      )?.slug;
    },
    findProductSlug(name: string) {
      if (!name) return undefined;
      const n = name.toLowerCase().trim();
      return (
        products.find((p) => p.name.toLowerCase() === n) ??
        products.find((p) => p.name.toLowerCase().startsWith(n)) ??
        products.find((p) => p.name.toLowerCase().includes(n))
      )?.slug;
    },
  };
}

export const GODATA: GOData = buildGODATA();

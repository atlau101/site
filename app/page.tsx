import { Hero } from "@/components/hero/Hero";
import { AboutStrip } from "@/components/sections/AboutStrip";
import { FeaturedCard } from "@/components/sections/FeaturedCard";
import { GroupedFeaturedCard } from "@/components/sections/GroupedFeaturedCard";
import { Footer } from "@/components/sections/Footer";
import { LandingScrollRestorer } from "@/components/sections/LandingScrollRestorer";
import { ThinkingProcessSection } from "@/components/sections/ThinkingProcessSection";

// ─── Tier 1: featured projects ────────────────────────────────────────────────
const malloyGroup = {
  title: "Malloy Group",
  outcome:
    "Three consulting splits for real clients: competitive analysis, feasibility, GTM.",
  category: "Consulting · GTM · Brand · 2024–2025",
  href: "/projects/malloy",
  projects: [
    {
      title: "Competitive Analysis & Brand Strategy",
      category: "Rebrandly · Nov 2024",
      href: "/projects/malloy-rebrandly",
    },
    {
      title: "Smart Attendance Feasibility Study",
      category: "Amal & Company · Feb 2025",
      href: "/projects/malloy-amal",
    },
    {
      title: "Go-To-Market Strategy",
      category: "Noble Note · Oct 2025",
      href: "/projects/malloy-noble-note",
    },
  ],
};

const dataProjects = {
  title: "Data Projects",
  outcome:
    "Analytics and predictive modeling, each built around a real hypothesis.",
  category: "Data analytics · ML · Visualization",
  projects: [
    {
      title: "B2B Sales Pipeline Analytics",
      category: "Data Mining · B2B · R",
      href: "/projects/bus315-data-mining",
    },
    {
      title: "Uber India Ride Analytics",
      category: "Data Visualization · Tableau",
      href: "/projects/uber-analytics",
    },
    {
      title: "Wildfire Proximity ML",
      category: "ML(Survival Analysis-Horizon) · Python · Kaggle",
      href: "/projects/wildfire-ml",
    },
    {
      title: "LMU EMS Datathon",
      category: "Data Analysis · Project Management",
      href: "/projects/lmu-datathon",
    },
  ],
};

const chamberGPT = {
  title: "ChamberGPT",
  outcome:
    "Support chatbot for the SF Chamber of Commerce: $0 budget, intern-built on Voiceflow.",
  category: "AI · Workflows · Automation",
  year: "Spring 2025",
  href: "/projects/chambergpt",
};

const fillmoreEcosystem = {
  title: "Fillmore Ecosystem",
  outcome:
    "Community-based research into SF's Lower Fillmore food and pharmacy desert after the Safeway closure.",
  category: "Research · Market Research · Community Centric",
  year: "Fall 2025",
  href: "/projects/fillmore",
};

const vibeCoding = {
  title: "Agentic AI Coding",
  outcome:
    "A documentation of my journey into pseudo-SWE. AI-assisted coding, unfinished product ideas, and a random library of tools I want to look into.",
  category: "Agentic SWE · Entrepreneurship · Product Management",
  year: "2026–ongoing",
  href: "/projects/vibe-coding",
};

export default function Home() {
  return (
    <>
      <main id="main-content" className="pt-16 sm:pt-20">
        <LandingScrollRestorer />
        <Hero />

        {/* About */}
        <AboutStrip />

        {/* Thinking process */}
        <ThinkingProcessSection />

        {/* Featured projects — Tier 1 */}
        <section
          id="work"
          className="w-full bg-background px-6 py-10 sm:px-8 md:py-24 lg:px-12"
        >
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 space-y-3 md:mb-10">
              <p className="annotation text-secondary">Featured work / 03</p>
              <h2 className="font-heading text-3xl font-black uppercase leading-[0.94] text-foreground sm:text-4xl md:text-5xl">
                Featured work
              </h2>
            </div>
            <div className="flex flex-col gap-0 rule-h">
              {/* 1 — Malloy Group */}
              <div id="project-malloy-group" className="rule-h-faint">
                <GroupedFeaturedCard {...malloyGroup} />
              </div>

              {/* 2 — Data Projects (grouped, inline accordion) */}
              <div id="project-data" className="rule-h-faint">
                <GroupedFeaturedCard {...dataProjects} />
              </div>

              {/* 3 — ChamberGPT */}
              <div id="project-chambergpt" className="rule-h-faint">
                <FeaturedCard {...chamberGPT} />
              </div>

              {/* 4 — Fillmore Ecosystem */}
              <div id="project-fillmore" className="rule-h-faint">
                <FeaturedCard {...fillmoreEcosystem} />
              </div>

              {/* 5 — Vibe Coding */}
              <div id="project-vibe-coding" className="rule-h-faint">
                <FeaturedCard {...vibeCoding} />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );

}

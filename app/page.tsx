import { Navbar } from "@/components/sections/Nav";
import { HeroPlaceholder } from "@/components/hero/HeroPlaceholder";
import { AboutStrip } from "@/components/sections/AboutStrip";
import { FeaturedCard } from "@/components/sections/FeaturedCard";
import { ProjectGrid, type SecondaryProject } from "@/components/sections/ProjectGrid";
import { Footer } from "@/components/sections/Footer";

// ─── Tier 1: 3 featured projects ─────────────────────────────────────────────
const featuredProjects = [
  {
    title: "Malloy Group",
    outcome:
      "Three client consulting splits — competitive analysis, feasibility study, and GTM strategy — for real startups across three semesters.",
    category: "Consulting · GTM · Brand",
    year: "2024–2025",
    href: "/projects/malloy-group",
  },
  {
    title: "B2B Sales Pipeline Analytics",
    outcome:
      "Applied k-prototypes clustering and association rule mining to a mock CRM to segment leads and predict cross-sell opportunities.",
    category: "Data Mining · B2B · R",
    year: "Fall 2025",
    href: "/projects/bus315-data-mining",
  },
  {
    title: "AUGMENT",
    outcome:
      "Designed a mind-map engine app where AI outputs relationships — not answers — so users build the argument path themselves.",
    category: "UX Design · Product · Figma",
    year: "2025",
    href: "/projects/augment",
  },
];

// ─── Tier 2: 6 secondary projects ────────────────────────────────────────────
const secondaryProjects: SecondaryProject[] = [
  {
    title: "Fillmore Ecosystem",
    description:
      "Community-based research into SF's Lower Fillmore food and pharmacy desert after the Safeway closure.",
    category: "Community Research",
    year: "Fall 2025",
    href: "/projects/fillmore",
  },
  {
    title: "Uber India Ride Analytics",
    description:
      "Tested three business hypotheses on Uber India ride data using Tableau. Two confirmed, one rejected.",
    category: "Data Visualization · Tableau",
    year: "Fall 2025",
    href: "/projects/uber-analytics",
  },
  {
    title: "Wildfire Proximity ML",
    description:
      "Kaggle datathon predicting wildfire proximity to evacuation zones using survival analysis and XGBoost.",
    category: "ML · Python · Kaggle",
    year: "Spring 2026",
    href: "/projects/wildfire-ml",
  },
  {
    title: "LMU EMS Datathon",
    description:
      "Spatial cluster analysis of EMS call data. Honest post-mortem: over-complicated the 'so what.'",
    category: "Data Analysis · Growth",
    year: "Spring 2026",
    href: "/projects/lmu-datathon",
  },
  {
    title: "ChamberGPT",
    description:
      "Member-facing support chatbot for the SF Chamber of Commerce using Voiceflow. $0 budget, intern-run.",
    category: "AI · No-Code · Internship",
    year: "Spring 2025",
    href: "/projects/chambergpt",
  },
  {
    title: "AI Investment Bubble",
    description:
      "Applied money and banking concepts to ask: is the AI investment boom a financial bubble?",
    category: "Economics · Research",
    year: "Fall 2025",
    href: "/projects/ai-bubble",
  },
];

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        {/* Hero — BranchingGraph replaces HeroPlaceholder in Task 4 */}
        <HeroPlaceholder />

        {/* About */}
        <AboutStrip />

        {/* Featured projects — Tier 1 */}
        <section
          id="work"
          className="w-full py-16 md:py-24 px-6 sm:px-8 lg:px-12"
          style={{ backgroundColor: "#F7F3EC" }}
        >
          <div className="max-w-7xl mx-auto">
            <h2
              className="text-2xl md:text-3xl font-medium mb-10"
              style={{ fontFamily: "var(--font-fraunces)", color: "#1F2A23" }}
            >
              Featured work
            </h2>
            <div className="flex flex-col gap-6">
              {featuredProjects.map((project) => (
                <FeaturedCard key={project.href} {...project} />
              ))}
            </div>
          </div>
        </section>

        {/* Secondary projects — Tier 2 */}
        <ProjectGrid projects={secondaryProjects} heading="More work" />
      </main>

      <Footer />
    </>
  );
}

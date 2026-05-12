import Link from "next/link";
import { ViewTransition } from "react";
import { Footer } from "@/components/sections/Footer";
import { ReturnHomeAnchorLink } from "@/components/sections/ReturnHomeAnchorLink";

const PROJECTS = [
  {
    num: "01",
    title: "Competitive Analysis & Brand Strategy",
    client: "Rebrandly",
    date: "Nov 2024",
    summary: "An 8-point competitive rubric across 6 link-management tools. Found Rebrandly 5th of 7 on pricing. Delivered a 28-page deck with SWOT and repositioning recommendations.",
    href: "/projects/malloy-rebrandly",
  },
  {
    num: "02",
    title: "Smart Attendance Feasibility Study",
    client: "Amal & Company",
    date: "Feb 2025",
    summary: "Built a 5-pillar framework to stress-test NFC attendance across 8+ markets. The research disqualified the original target — higher ed — and pointed toward senior living and hospitals instead.",
    href: "/projects/malloy-amal",
  },
  {
    num: "03",
    title: "Go-To-Market Strategy",
    client: "Noble Note",
    date: "Oct 2025",
    summary: "Brand audit, ICP reframe, and Kickstarter email sequence for a premium stationery startup. Reoriented their messaging from creatives to high-income corporate buyers.",
    href: "/projects/malloy-noble-note",
  },
];

export default function MalloyHubPage() {
  return (
    <>
      <main id="main-content" className="pt-16 sm:pt-20">
        {/* Header */}
        <section className="w-full py-24 px-6 sm:px-8 lg:px-12 bg-background">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <ReturnHomeAnchorLink
                targetId="project-malloy-group"
                openSlug="malloy"
                className="annotation text-muted-foreground hover:text-foreground transition-colors duration-200 no-underline"
              >
                ← Back to work
              </ReturnHomeAnchorLink>
            </div>

            <div className="rule-h pb-16">
              <ViewTransition name="project-group-malloy">
                <p className="annotation text-muted-foreground mb-6">
                  THE MALLOY GROUP · 2024–2025 · CONSULTING
                </p>
              </ViewTransition>

              <h1
                className="font-heading text-display font-semibold leading-[1.05] text-primary mb-10"
                style={{ letterSpacing: "-0.02em" }}
              >
                First real stakes.
              </h1>

              <div className="space-y-5 max-w-[65ch]">
                <p className="text-base md:text-lg leading-relaxed text-foreground/80">
                  The Malloy Group was my first real stepping stone into anything career-adjacent. Before this, everything I&apos;d done was coursework — graded, low-stakes, contained. Malloy put me in front of actual clients with actual deliverables.
                </p>
                <p className="text-base md:text-lg leading-relaxed text-foreground/80">
                  What the program actually trains is design thinking: ideate, build a rough version, test it against reality, iterate. It&apos;s not technical work — the focus is entirely on marketing, positioning, and consulting. It was my first real dive into that space, and where I first started developing the organizational instincts that I&apos;d keep building on.
                </p>
              </div>
            </div>

            {/* Through-line */}
            <div className="rule-h pb-16 pt-16">
              <p className="annotation text-muted-foreground mb-6">THE THROUGH-LINE</p>
              <div className="space-y-5 max-w-[65ch]">
                <p className="text-base md:text-lg leading-relaxed text-foreground/80">
                  Across all three splits, the recurring challenge was the same: the client&apos;s first framing of the problem was rarely the right one. Rebrandly needed repositioning more than a product fix. Amal needed a different market, not a better pitch to the wrong one. Noble Note needed a new ICP before any GTM strategy would land.
                </p>
                <p className="text-base md:text-lg leading-relaxed text-foreground/80">
                  The instincts I developed here — how to push back without confronting, how to let research carry the argument, how to keep a team on task — were a rough sketch of what I&apos;d eventually need. The version where those instincts actually got tested came much later.
                </p>
              </div>
            </div>

            {/* Project entries */}
            <div className="pt-16">
              <div className="flex items-baseline gap-5 mb-5">
                <h2
                  className="font-heading text-2xl md:text-3xl font-semibold text-primary"
                  style={{ letterSpacing: "-0.015em" }}
                >
                  The work.
                </h2>
                <span className="annotation text-muted-foreground">three client splits, 2024–2025</span>
              </div>
              <div className="border-b border-border" />

              <div>
                {PROJECTS.map((project) => {
                  const pSlug = project.href.split("/").pop() ?? project.href;
                  return (
                    <Link
                      key={project.href}
                      href={project.href}
                      transitionTypes={["forward"]}
                      className="group flex items-start gap-7 md:gap-10 py-10 border-b border-border/50 hover:bg-paper-low transition-colors duration-200 no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {/* Oversized number — typographic anchor */}
                      <span
                        className="font-heading text-5xl md:text-6xl font-semibold leading-none tabular-nums shrink-0 pt-1 text-primary/20 group-hover:text-primary/50 transition-colors duration-200"
                        style={{ width: "3rem" }}
                        aria-hidden="true"
                      >
                        {project.num}
                      </span>

                      {/* Content */}
                      <div className="flex-1 min-w-0 space-y-2.5">
                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 flex-wrap">
                          <ViewTransition name={`project-title-${pSlug}`}>
                            <h3 className="font-heading text-xl md:text-2xl font-medium text-foreground group-hover:underline underline-offset-2 decoration-foreground/30 leading-snug">
                              {project.title}
                            </h3>
                          </ViewTransition>
                          <span className="annotation text-muted-foreground shrink-0">
                            {project.client} · {project.date}
                          </span>
                        </div>
                        <p className="text-base text-foreground/65 leading-relaxed max-w-[58ch]">
                          {project.summary}
                        </p>
                      </div>

                      {/* Arrow */}
                      <span
                        className="font-heading text-xl text-foreground/20 group-hover:text-foreground/60 group-hover:translate-x-1 transition-all duration-200 shrink-0 pt-2"
                        aria-hidden="true"
                      >
                        →
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

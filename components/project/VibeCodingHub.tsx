import Link from "next/link";
import { ViewTransition } from "react";
import { ReturnHomeAnchorLink } from "@/components/sections/ReturnHomeAnchorLink";
import {
  vibeProjects,
  vibeTabs,
  vibeTools,
  vibeWatched,
  workflowNotes,
  type VibeProjectSlug,
  type VibeTabId,
} from "@/lib/vibe-coding";

const palette = {
  base: "oklch(0.9337 0.004688 142)",
  paper: "oklch(0.978 0.002 106)",
  paperLow: "oklch(0.952 0.01 96)",
  ink: "oklch(0.18 0.018 35)",
  green: "oklch(0.31 0.082 142)",

  line: "oklch(0.23 0.018 35)",
  muted: "oklch(0.38 0.024 35)",
};

interface VibeCodingHubProps {
  activeTab?: VibeTabId;
  activeProjectSlug?: VibeProjectSlug;
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em]" style={{ color: palette.green }}>
      {children}
    </p>
  );
}

function VisualSlot({ label }: { label: string }) {
  return (
    <div
      className="flex min-h-[14rem] items-center justify-center border px-5 text-center font-mono text-[10px] uppercase tracking-[0.18em]"
      style={{ background: palette.base, borderColor: palette.line, color: palette.muted }}
    >
      {label} TBD
    </div>
  );
}

function TabNav({ activeTab }: { activeTab: VibeTabId }) {
  return (
    <nav className="flex flex-wrap gap-2 border-y py-3" style={{ borderColor: palette.line }}>
      {vibeTabs.map((tab) => {
        const active = tab.id === activeTab;
        return (
          <Link
            key={tab.id}
            href={tab.href}
            scroll={false}
            className="border px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors duration-200"
            style={{
              borderColor: palette.line,
              background: active ? palette.ink : "transparent",
              color: active ? palette.paper : palette.ink,
            }}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

function VibeHeader({ activeTab }: { activeTab: VibeTabId }) {
  return (
    <section className="w-full px-6 py-20 sm:px-8 lg:px-12" style={{ background: palette.base }}>
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <ReturnHomeAnchorLink
            targetId="project-vibe-coding"
            className="annotation text-muted-foreground transition-colors duration-200 hover:text-foreground"
          >
            Back to work
          </ReturnHomeAnchorLink>
        </div>

        <div className="rule-h pb-10">
          <ViewTransition name="project-title-vibe-coding">
            <p className="annotation mb-6 text-muted-foreground">
              VIBE CODING · 2025-ONGOING · AGENTIC SWE
            </p>
          </ViewTransition>

          <h1 className="mb-8 max-w-[12ch] font-heading text-6xl font-black uppercase leading-[0.9] text-primary md:text-8xl">
            One calendar app, a lot of broken assumptions.
          </h1>

          <div className="max-w-[68ch] space-y-5 text-base leading-8 text-foreground/75 md:text-lg">
            <p>
              I got into <strong>Agentic-coding</strong> — <strong>vibe-coding</strong> as it's better known — with <strong>Claude Code</strong>, not Lovable or Replit. Those are fine
              for wireframes. But the second you need actual behavior — <strong>persistence,
                state, a login flow that works</strong> — they fall apart. I wanted to build something real, not just a wireframe.
            </p>
            <p>
              <strong>Drift</strong>, my take on a productivity tool, was the first thing I tried to build. The <strong>experience of making it</strong> —
              not the app itself — is what changed <strong>how I look at software</strong>. This section
              is the story of that, the tools that came out of it, and the product ideas
              I've been working on since.
            </p>
          </div>
        </div>

        <div className="pt-8">
          <TabNav activeTab={activeTab} />
        </div>
      </div>
    </section>
  );
}

function StoryTab() {
  return (
    <section className="vibe-content-enter px-6 py-16 sm:px-8 lg:px-12" style={{ background: palette.paperLow }}>
      <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[16rem_1fr]">
        <div>
          <Eyebrow>Story</Eyebrow>
          <h2 className="mt-4 font-heading text-4xl font-black uppercase leading-[0.94]" style={{ color: palette.ink }}>
            An intern with all the knowledge in the world.
          </h2>
        </div>
        <div className="space-y-8">
          <div className="max-w-[65ch] space-y-5 text-lg leading-9" style={{ color: palette.ink }}>
            <p>
              A lot of people think <strong>vibe coding</strong> is just throwing a single prompt into
              Lovable or Replit. I've tried both. The front end looks like <strong>AI-generated
                slop</strong> — a bunch of emojis, no back end, nothing that holds up once you need
              the app to actually do something. Same deal with Figma's AI features. While those
              tools have their own merit for wireframes and quick prototypes, they're <strong>cardboard houses built on shaky foundations</strong>.
            </p>
            <p>
              <strong>Drift</strong> is where it clicked. I wanted a calendar app with a persistent
              Pomodoro timer, and the second I started building it I ran into all the
              work I didn't know existed. <strong>OAuth. Database state. Event persistence.</strong> The
              concept of storing something so it survives a page refresh. Every one of
              those felt <strong>obvious in hindsight</strong> and <strong>invisible before</strong>.
            </p>
            <p>
              That's what <strong>agentic coding</strong> is actually about for me. AI is like an <strong>intern </strong>
              with all the knowledge in the world, but they're <strong>extremely stupid</strong>. If you have
              no clue what you're trying to do, neither will the AI. <strong>Slop in, slop out. </strong>
              The loop is: <strong>know what you want, inspect what came back, and do it again </strong>
              until it's right.
            </p>
          </div>

          <div className="grid gap-4">
            {workflowNotes.map((note, index) => (
              <article key={note.label} className="grid gap-4 border p-5 md:grid-cols-[8rem_1fr]" style={{ background: palette.paper, borderColor: palette.line }}>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: palette.green }}>
                  Note {String(index + 1).padStart(2, "0")}
                </div>
                <div>
                  <h3 className="font-heading text-2xl font-black uppercase leading-none" style={{ color: palette.ink }}>
                    {note.label}
                  </h3>
                  <p className="mt-3 text-sm leading-7" style={{ color: palette.muted }}>
                    {note.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function EnvironmentTab() {
  return (
    <section className="vibe-content-enter px-6 py-16 sm:px-8 lg:px-12" style={{ background: palette.paperLow }}>
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[18rem_1fr]">
        <div>
          <Eyebrow>Environment</Eyebrow>
          <h2 className="mt-4 font-heading text-4xl font-black uppercase leading-[0.94]" style={{ color: palette.ink }}>
            Tuning the loadout like a co-op mission.
          </h2>
          <p className="mt-5 text-sm leading-7" style={{ color: palette.muted }}>
            I'm on GitHub basically every week looking at what <strong>new open-source tools</strong> are dropping — <strong>new agents, MCPs, context file formats, sub-agent harnesses</strong>. Optimizing the dev environment feels exactly like how I used to play co-op games. Same instinct: what's the <strong>fastest way through the mission</strong>, what's the <strong>best setup for the current task</strong>.
          </p>
        </div>

        <div className="space-y-6">
          <div className="border p-5" style={{ background: palette.paper, borderColor: palette.line }}>
            <Eyebrow>Dev environment: ANTIGRAVITY. (Google's VSCode Fork).</Eyebrow>
            <h3 className="mt-4 font-heading text-4xl font-black uppercase leading-none" style={{ color: palette.ink }}>
              Where my workflow lives.
            </h3>
            <p className="mt-4 max-w-[58ch] text-sm leading-7" style={{ color: palette.muted }}>
              Personally love using google's VSCode Antigravity. Has all the knick knacks that makes VSCode so convenient, like file Explorer, Source Control, and various Extensions. Additionally, includes agent integrations with Gemini.
            </p>
            <div className="mt-6">
              <VisualSlot label="Antigravity screenshot" />
            </div>
          </div>

          <div className="grid gap-3">
            {vibeTools.map((tool) => (
              <details key={tool.url} className="group border p-5" style={{ background: palette.paper, borderColor: palette.line }}>
                <summary className="cursor-pointer list-none">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Eyebrow>{tool.owner}</Eyebrow>
                      <h3 className="mt-3 font-heading text-3xl font-black uppercase leading-none" style={{ color: palette.ink }}>
                        {tool.name}
                      </h3>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-2 pt-0.5 md:flex-row md:items-center md:gap-4">
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: palette.muted }}>
                        {tool.role}
                      </span>
                      <span className="select-none font-mono text-base font-semibold leading-none" style={{ color: palette.green }}>
                        <span className="group-open:hidden">+</span>
                        <span className="hidden group-open:inline">−</span>
                      </span>
                    </div>
                  </div>
                </summary>
                <div className="mt-5 border-t pt-5" style={{ borderColor: palette.line }}>
                  <p className="max-w-[62ch] text-sm leading-7" style={{ color: palette.muted }}>
                    {tool.body}
                  </p>
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 block break-all font-mono text-[11px] underline decoration-foreground/30 underline-offset-4"
                    style={{ color: palette.green }}
                  >
                    {tool.url}
                  </a>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectsTab({ activeProjectSlug }: { activeProjectSlug?: VibeProjectSlug }) {
  return (
    <section className="vibe-content-enter px-6 py-16 sm:px-8 lg:px-12" style={{ background: palette.paperLow }}>
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[16rem_1fr]">
        <div>
          <Eyebrow>Projects</Eyebrow>
          <h2 className="mt-4 font-heading text-4xl font-black uppercase leading-[0.94]" style={{ color: palette.ink }}>
            Three ideas the building turned up.
          </h2>
          <p className="mt-5 text-sm leading-7" style={{ color: palette.muted }}>
            <strong>Drift</strong> came first and is still unfinished. <strong>Workbench</strong> is a working MVP. <strong>Augment</strong> is still mostly an idea — I've been working through it with a UC Berkeley co-founder who came at the same problem from a STEM angle.
          </p>
        </div>

        <div className="grid gap-0 border-y" style={{ borderColor: palette.line }}>
          {vibeProjects.map((project) => {
            const active = project.slug === activeProjectSlug;
            return (
              <Link
                key={project.slug}
                href={project.href}
                scroll={false}
                className="grid gap-5 border-b py-8 transition-colors duration-200 hover:bg-paper md:grid-cols-[5rem_1fr]"
                style={{ borderColor: palette.line, background: active ? palette.paper : "transparent" }}
              >
                <span className="font-heading text-5xl font-black leading-none tabular-nums" style={{ color: active ? palette.green : "oklch(0.18 0.018 35 / 0.25)" }}>
                  {project.num}
                </span>
                <div>
                  <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:gap-4">
                    <h3 className="font-heading text-3xl font-black uppercase leading-none" style={{ color: palette.ink }}>
                      {project.title}
                    </h3>
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: palette.muted }}>
                      {project.status}
                    </span>
                  </div>
                  <p className="mt-4 max-w-[58ch] text-sm leading-7" style={{ color: palette.muted }}>
                    {project.summary}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ProjectSubnav({ activeProjectSlug }: { activeProjectSlug: VibeProjectSlug }) {
  return (
    <section className="px-6 pt-10 sm:px-8 lg:px-12" style={{ background: palette.paperLow }}>
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap gap-1.5 border-b pb-3" style={{ borderColor: palette.line }}>
          {vibeProjects.map((project) => {
            const active = project.slug === activeProjectSlug;
            return (
              <Link
                key={project.slug}
                href={project.href}
                scroll={false}
                className="border px-3 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] transition-colors duration-200"
                style={{
                  borderColor: active ? palette.ink : "oklch(0.23 0.018 35 / 0.4)",
                  background: active ? palette.ink : "transparent",
                  color: active ? palette.paper : palette.muted,
                }}
              >
                {project.title}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ProjectDetail({ slug }: { slug: VibeProjectSlug }) {
  const project = vibeProjects.find((item) => item.slug === slug);

  if (!project) {
    return null;
  }

  return (
    <section className="vibe-content-enter px-6 py-16 sm:px-8 lg:px-12" style={{ background: palette.base }}>
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[18rem_1fr]">
        <div>
          <Eyebrow>{project.detailEyebrow}</Eyebrow>
          <h2 className="mt-4 font-heading text-4xl font-black uppercase leading-[0.94]" style={{ color: palette.ink }}>
            {project.detailTitle}
          </h2>
          <Link
            href="/projects/vibe-coding?tab=projects"
            scroll={false}
            className="mt-6 inline-block font-mono text-[11px] uppercase tracking-[0.18em] underline decoration-foreground/30 underline-offset-4"
            style={{ color: palette.green }}
          >
            ← All projects
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
          <div className="max-w-[65ch] space-y-5 text-lg leading-9" style={{ color: palette.ink }}>
            {project.detailBody.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <VisualSlot label={project.visualLabel} />
        </div>
      </div>
    </section>
  );
}

function WatchedTab() {
  return (
    <section className="vibe-content-enter px-6 py-16 sm:px-8 lg:px-12" style={{ background: palette.paperLow }}>
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[18rem_1fr]">
        <div>
          <Eyebrow>Watched</Eyebrow>
          <h2 className="mt-4 font-heading text-4xl font-black uppercase leading-[0.94]" style={{ color: palette.ink }}>
            Open source I'm reading.
          </h2>
          <p className="mt-5 text-sm leading-7" style={{ color: palette.muted }}>
            These aren't my tools. They're open-source repos I'm currently watching, reading through, or planning to try. Building a habit of looking at what other people make is part of the loop.
          </p>
        </div>

        <div className="grid gap-3">
          {vibeWatched.map((repo) => (
            <details key={repo.url} className="group border-[3px] p-5" style={{ background: palette.paper, borderColor: palette.line }}>
              <summary className="cursor-pointer list-none">
                <div className="flex flex-col gap-3 md:flex-row md:items-baseline md:justify-between">
                  <div>
                    <Eyebrow>{repo.owner}</Eyebrow>
                    <h3 className="mt-3 font-heading text-3xl font-black uppercase leading-none" style={{ color: palette.ink }}>
                      {repo.name}
                    </h3>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: palette.muted }}>
                    {repo.intent}
                  </span>
                </div>
              </summary>
              <div className="mt-5 border-t pt-5" style={{ borderColor: palette.line }}>
                <p className="max-w-[62ch] text-sm leading-7" style={{ color: palette.muted }}>
                  {repo.body}
                </p>
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 block break-all font-mono text-[11px] underline decoration-foreground/30 underline-offset-4"
                  style={{ color: palette.contrast }}
                >
                  {repo.url}
                </a>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function VibeCodingHub({ activeTab = "story", activeProjectSlug }: VibeCodingHubProps) {
  return (
    <div style={{ background: palette.base, color: palette.ink }}>
      <VibeHeader activeTab={activeTab} />
      {activeProjectSlug ? (
        <>
          <ProjectSubnav activeProjectSlug={activeProjectSlug} />
          <ProjectDetail key={activeProjectSlug} slug={activeProjectSlug} />
        </>
      ) : null}
      {!activeProjectSlug && activeTab === "story" ? <StoryTab /> : null}
      {!activeProjectSlug && activeTab === "environment" ? <EnvironmentTab /> : null}
      {!activeProjectSlug && activeTab === "projects" ? <ProjectsTab /> : null}
      {!activeProjectSlug && activeTab === "watched" ? <WatchedTab /> : null}
    </div>
  );
}

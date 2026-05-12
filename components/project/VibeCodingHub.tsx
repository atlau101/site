import Link from "next/link";
import { ViewTransition } from "react";
import { ReturnHomeAnchorLink } from "@/components/sections/ReturnHomeAnchorLink";
import {
  vibeProjects,
  vibeTabs,
  vibeTools,
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
  contrast: "oklch(0.34 0.12 12)",
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
      className="flex min-h-[14rem] items-center justify-center border-[3px] px-5 text-center font-mono text-[10px] uppercase tracking-[0.18em]"
      style={{ background: palette.base, borderColor: palette.line, color: palette.contrast }}
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
            Building made the critique useful.
          </h1>

          <div className="max-w-[68ch] space-y-5 text-base leading-8 text-foreground/75 md:text-lg">
            <p>
              I did not get into this by asking a one-prompt builder to make an app. I
              got into it by trying to build Drift and realizing how much software hides
              under normal interactions.
            </p>
            <p>
              This section is a live map of that loop: the first app that made software
              feel real, the tools that became my loadout, and the product ideas that
              came out of learning how to build with agents.
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
    <section className="px-6 py-16 sm:px-8 lg:px-12" style={{ background: palette.paperLow }}>
      <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[16rem_1fr]">
        <div>
          <Eyebrow>Story</Eyebrow>
          <h2 className="mt-4 font-heading text-4xl font-black uppercase leading-[0.94]" style={{ color: palette.ink }}>
            Not one prompt. A loop.
          </h2>
        </div>
        <div className="space-y-8">
          <div className="space-y-5 text-lg leading-9" style={{ color: palette.ink }}>
            <p>
              A lot of the AI app-builder pitch feels fake to me. You can get a
              wireframe fast, but the second you need actual behavior, persistence, or
              taste, the shortcut starts showing.
            </p>
            <p>
              Drift was the first thing that cut through that. I wanted a calendar tool
              with draggable tasks and a timer that kept me focused. Then the hidden
              work showed up: OAuth, saved events, database state, timers, tiny UI
              expectations I had never thought about because other products made them
              feel automatic.
            </p>
            <p>
              That is where agentic coding became interesting. The agent is not magic.
              It is more like an overpowered intern that still needs direction. The
              intelligence is in knowing what you want, checking what came back, and
              being willing to run the loop again.
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
    <section className="px-6 py-16 sm:px-8 lg:px-12" style={{ background: palette.paperLow }}>
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[18rem_1fr]">
        <div>
          <Eyebrow>Environment</Eyebrow>
          <h2 className="mt-4 font-heading text-4xl font-black uppercase leading-[0.94]" style={{ color: palette.ink }}>
            The loadout became part of the craft.
          </h2>
          <p className="mt-5 text-sm leading-7" style={{ color: palette.muted }}>
            The original idea was a home tab for the tools I actually use. Antigravity
            gets the big slot; the repos below explain what each tool does in the loop.
          </p>
        </div>

        <div className="space-y-6">
          <div className="border-[3px] p-5" style={{ background: palette.paper, borderColor: palette.line }}>
            <Eyebrow>Antigravity home base</Eyebrow>
            <h3 className="mt-4 font-heading text-4xl font-black uppercase leading-none" style={{ color: palette.ink }}>
              Screenshot anchor
            </h3>
            <p className="mt-4 max-w-[58ch] text-sm leading-7" style={{ color: palette.muted }}>
              This is where the main environment screenshot will go. The point is not to
              show a tool for the sake of showing it, it is to show the actual surface
              where the workflow happens.
            </p>
            <div className="mt-6">
              <VisualSlot label="Antigravity screenshot" />
            </div>
          </div>

          <div className="grid gap-3">
            {vibeTools.map((tool) => (
              <details key={tool.url} className="group border-[3px] p-5" style={{ background: palette.paper, borderColor: palette.line }}>
                <summary className="cursor-pointer list-none">
                  <div className="flex flex-col gap-3 md:flex-row md:items-baseline md:justify-between">
                    <div>
                      <Eyebrow>{tool.owner}</Eyebrow>
                      <h3 className="mt-3 font-heading text-3xl font-black uppercase leading-none" style={{ color: palette.ink }}>
                        {tool.name}
                      </h3>
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: palette.contrast }}>
                      {tool.role}
                    </span>
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
                    style={{ color: palette.contrast }}
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
    <section className="px-6 py-16 sm:px-8 lg:px-12" style={{ background: palette.paperLow }}>
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[16rem_1fr]">
        <div>
          <Eyebrow>Projects</Eyebrow>
          <h2 className="mt-4 font-heading text-4xl font-black uppercase leading-[0.94]" style={{ color: palette.ink }}>
            Separate pages, same section.
          </h2>
          <p className="mt-5 text-sm leading-7" style={{ color: palette.muted }}>
            Drift and Workbench already have enough context to stand on their own.
            Augment is still more speculative, but it belongs in the same family.
          </p>
        </div>

        <div className="grid gap-0 border-y" style={{ borderColor: palette.line }}>
          {vibeProjects.map((project) => {
            const active = project.slug === activeProjectSlug;
            return (
              <Link
                key={project.slug}
                href={project.href}
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
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: palette.contrast }}>
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
    <section className="px-6 pt-12 sm:px-8 lg:px-12" style={{ background: palette.paperLow }}>
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap gap-2 border-y py-3" style={{ borderColor: palette.line }}>
          {vibeProjects.map((project) => {
            const active = project.slug === activeProjectSlug;
            return (
              <Link
                key={project.slug}
                href={project.href}
                className="border px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors duration-200"
                style={{
                  borderColor: palette.line,
                  background: active ? palette.ink : "transparent",
                  color: active ? palette.paper : palette.ink,
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
    <section className="px-6 py-16 sm:px-8 lg:px-12" style={{ background: palette.base }}>
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[18rem_1fr]">
        <div>
          <Eyebrow>{project.detailEyebrow}</Eyebrow>
          <h2 className="mt-4 font-heading text-4xl font-black uppercase leading-[0.94]" style={{ color: palette.ink }}>
            {project.detailTitle}
          </h2>
          <Link
            href="/projects/vibe-coding?tab=projects"
            className="mt-6 inline-block font-mono text-[11px] uppercase tracking-[0.18em] underline decoration-foreground/30 underline-offset-4"
            style={{ color: palette.contrast }}
          >
            Back to project tabs
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
          <div className="space-y-5 text-lg leading-9" style={{ color: palette.ink }}>
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

export function VibeCodingHub({ activeTab = "story", activeProjectSlug }: VibeCodingHubProps) {
  return (
    <div style={{ background: palette.base, color: palette.ink }}>
      <VibeHeader activeTab={activeTab} />
      {activeProjectSlug ? (
        <>
          <ProjectSubnav activeProjectSlug={activeProjectSlug} />
          <ProjectDetail slug={activeProjectSlug} />
        </>
      ) : null}
      {!activeProjectSlug && activeTab === "story" ? <StoryTab /> : null}
      {!activeProjectSlug && activeTab === "environment" ? <EnvironmentTab /> : null}
      {!activeProjectSlug && activeTab === "projects" ? <ProjectsTab /> : null}
    </div>
  );
}

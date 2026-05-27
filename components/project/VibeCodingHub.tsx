"use client";

import Image from "next/image";
import Link from "next/link";
import { ViewTransition, useState, useEffect, useCallback } from "react";
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

const vibeKpis = [
  {
    value: "3",
    label: "Product ideas advanced",
    detail: "Drift, Workbench, and Augment moved from loose ideas into scoped product directions.",
  },
  {
    value: "1",
    label: "Shipped MVP",
    detail: "Workbench reached a working MVP with the core reflection-first assistant loop in place. Drift, soon.",
  },
  {
    value: "80+",
    label: "GitHub commits in a month",
    detail: "The learning showed up as repeated commits, branches, rollbacks, and rebuilds.",
  },
  {
    value: "MANY",
    label: "Repos Integrated or Watched",
    detail: "Implemented a LOT of tools into the workflow. Even more starred for future exploration.Constantly on top of new tools.",
  },
];

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

function ImageMat({
  src,
  caption,
  priority = false,
  imgWidth = 1440,
  imgHeight = 900,
  onClick,
}: {
  src: string;
  caption: string;
  priority?: boolean;
  imgWidth?: number;
  imgHeight?: number;
  onClick?: () => void;
}) {
  return (
    <figure className="cursor-zoom-in" onClick={onClick}>
      <div className="border p-2.5" style={{ background: palette.paper, borderColor: palette.line }}>
        <Image
          src={src}
          alt={caption}
          width={imgWidth}
          height={imgHeight}
          className="block w-full"
          sizes="(min-width: 1024px) 55vw, 92vw"
          priority={priority}
        />
      </div>
      <figcaption
        className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em]"
        style={{ color: palette.muted }}
      >
        {caption}
      </figcaption>
    </figure>
  );
}

function Lightbox({
  src,
  caption,
  onClose,
}: {
  src: string;
  caption: string;
  onClose: () => void;
}) {
  const [entered, setEntered] = useState(false);

  const close = useCallback(() => {
    setEntered(false);
    setTimeout(onClose, 260);
  }, [onClose]);

  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true));
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [close]);

  return (
    <div
      onClick={close}
      className="fixed inset-0 z-[200] flex items-center justify-center p-6 sm:p-10"
      style={{
        background: "oklch(0.18 0.018 35 / 0.96)",
        transition: "opacity 260ms cubic-bezier(0.16, 1, 0.3, 1)",
        opacity: entered ? 1 : 0,
      }}
    >
      <button
        onClick={(e) => { e.stopPropagation(); close(); }}
        className="absolute right-6 top-6 font-mono text-[11px] uppercase tracking-[0.18em] transition-opacity hover:opacity-60"
        style={{ color: "oklch(0.78 0.018 35)" }}
      >
        × Close
      </button>
      <figure
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col items-start"
        style={{
          transition: "transform 260ms cubic-bezier(0.16, 1, 0.3, 1)",
          transform: entered ? "scale(1) translateY(0)" : "scale(0.96) translateY(10px)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={caption}
          style={{ maxHeight: "84vh", maxWidth: "88vw", width: "auto", height: "auto", display: "block" }}
        />
        <figcaption
          className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em]"
          style={{ color: "oklch(0.65 0.024 35)" }}
        >
          {caption}
        </figcaption>
      </figure>
    </div>
  );
}

const hoverLift = "transition-[transform,opacity] duration-200 ease-out hover:z-50 hover:scale-[1.07]";
const siblingDim = "group-hover/collage:opacity-40 hover:!opacity-100";

function WorkbenchCollage() {
  const [lightbox, setLightbox] = useState<{ src: string; caption: string } | null>(null);

  const openLightbox = useCallback((src: string, caption: string) => {
    setLightbox({ src, caption });
  }, []);

  return (
    <div className="space-y-8">
      {/* ── Act 1: Student side ── */}
      <div>
        <p className="mb-5 font-mono text-[10px] font-semibold uppercase tracking-[0.24em]" style={{ color: palette.muted }}>
          Student side
        </p>

        {/* Mobile: vertical stack */}
        <div className="flex flex-col gap-6 md:hidden">
          {[
            { src: "/vibe-coding/workbench/05-thinking-gym.png", caption: "Reflection gate · pre-unlock", offset: false, priority: true },
            { src: "/vibe-coding/workbench/08-scaffolding-top.png", caption: "Adversarial helper · post-unlock", offset: true },
            { src: "/vibe-coding/workbench/04-student-dashboard.png", caption: "Student dashboard", offset: false },
            { src: "/vibe-coding/workbench/03-role-picker.png", caption: "Role select · student / instructor", offset: true },
            { src: "/vibe-coding/workbench/07-scaffolding.png", caption: "Scaffolded reply", offset: false },
            { src: "/vibe-coding/workbench/06-gym-session-start.png", caption: "Session start", offset: true },
          ].map((img) => (
            <div key={img.src} style={{ marginLeft: img.offset ? 8 : 0, marginRight: img.offset ? 0 : 8 }}>
              <ImageMat
                src={img.src}
                caption={img.caption}
                priority={img.priority}
                onClick={() => openLightbox(img.src, img.caption)}
              />
            </div>
          ))}
        </div>

        {/* Desktop: 12-col asymmetric collage, 2 rows */}
        <div className="group/collage relative hidden pb-28 md:grid md:grid-cols-12 md:gap-x-3">
          {/* Row 1 — Hero + Anchor B */}
          <div className={`relative z-20 col-[1/9] row-[1/2] ${hoverLift} ${siblingDim}`}>
            <ImageMat
              src="/vibe-coding/workbench/05-thinking-gym.png"
              caption="Reflection gate · pre-unlock"
              priority
              onClick={() => openLightbox("/vibe-coding/workbench/05-thinking-gym.png", "Reflection gate · pre-unlock")}
            />
          </div>
          <div className={`relative z-10 col-[6/13] row-[1/2] mt-10 -rotate-[1deg] ${hoverLift} ${siblingDim}`}>
            <ImageMat
              src="/vibe-coding/workbench/08-scaffolding-top.png"
              caption="Adversarial helper · post-unlock"
              onClick={() => openLightbox("/vibe-coding/workbench/08-scaffolding-top.png", "Adversarial helper · post-unlock")}
            />
          </div>

          {/* Row 2 — cascading strip */}
          <div className={`relative z-30 col-[1/5] row-[2/3] -mt-8 rotate-[1deg] ${hoverLift} ${siblingDim}`}>
            <ImageMat
              src="/vibe-coding/workbench/03-role-picker.png"
              caption="Role select"
              onClick={() => openLightbox("/vibe-coding/workbench/03-role-picker.png", "Role select · student / instructor")}
            />
          </div>
          <div className={`relative z-20 col-[3/9] row-[2/3] mt-6 rotate-[0.8deg] ${hoverLift} ${siblingDim}`}>
            <ImageMat
              src="/vibe-coding/workbench/04-student-dashboard.png"
              caption="Student dashboard"
              onClick={() => openLightbox("/vibe-coding/workbench/04-student-dashboard.png", "Student dashboard")}
            />
          </div>
          <div className={`relative z-10 col-[7/12] row-[2/3] mt-2 -rotate-[1.5deg] ${hoverLift} ${siblingDim}`}>
            <ImageMat
              src="/vibe-coding/workbench/07-scaffolding.png"
              caption="Scaffolded reply"
              onClick={() => openLightbox("/vibe-coding/workbench/07-scaffolding.png", "Scaffolded reply")}
            />
          </div>
          <div className={`relative z-0 col-[10/13] row-[2/3] mt-14 rotate-[0.5deg] ${hoverLift} ${siblingDim}`}>
            <ImageMat
              src="/vibe-coding/workbench/06-gym-session-start.png"
              caption="Session start"
              onClick={() => openLightbox("/vibe-coding/workbench/06-gym-session-start.png", "Session start")}
            />
          </div>
        </div>
      </div>

      {/* ── Act 2: Instructor side ── */}
      <div>
        <p className="mb-5 font-mono text-[10px] font-semibold uppercase tracking-[0.24em]" style={{ color: palette.muted }}>
          Instructor side
        </p>

        {/* Mobile: vertical stack */}
        <div className="flex flex-col gap-6 md:hidden">
          {[
            { src: "/vibe-coding/workbench/09-instructor-dashboard.png", caption: "Instructor overview", offset: false },
            { src: "/vibe-coding/workbench/10-instructor-assignments.png", caption: "Assignments view", offset: true },
            { src: "/vibe-coding/workbench/11-instructor-gate-adjustment.png", caption: "Gate adjustment · settings", offset: false, imgWidth: 3018, imgHeight: 1604 },
          ].map((img) => (
            <div key={img.src} style={{ marginLeft: img.offset ? 8 : 0, marginRight: img.offset ? 0 : 8 }}>
              <ImageMat
                src={img.src}
                caption={img.caption}
                imgWidth={img.imgWidth}
                imgHeight={img.imgHeight}
                onClick={() => openLightbox(img.src, img.caption)}
              />
            </div>
          ))}
        </div>

        {/* Desktop: cascading 3-image strip */}
        <div className="group/collage relative hidden pb-20 md:grid md:grid-cols-12 md:gap-x-3">
          <div className={`relative z-20 col-[1/6] row-[1/2] ${hoverLift} ${siblingDim}`}>
            <ImageMat
              src="/vibe-coding/workbench/09-instructor-dashboard.png"
              caption="Instructor overview"
              onClick={() => openLightbox("/vibe-coding/workbench/09-instructor-dashboard.png", "Instructor overview")}
            />
          </div>
          <div className={`relative z-10 col-[4/10] row-[1/2] mt-8 -rotate-[1deg] ${hoverLift} ${siblingDim}`}>
            <ImageMat
              src="/vibe-coding/workbench/10-instructor-assignments.png"
              caption="Assignments view"
              onClick={() => openLightbox("/vibe-coding/workbench/10-instructor-assignments.png", "Assignments view")}
            />
          </div>
          <div className={`relative z-0 col-[8/13] row-[1/2] mt-16 rotate-[0.8deg] ${hoverLift} ${siblingDim}`}>
            <ImageMat
              src="/vibe-coding/workbench/11-instructor-gate-adjustment.png"
              caption="Gate adjustment · settings"
              imgWidth={3018}
              imgHeight={1604}
              onClick={() => openLightbox("/vibe-coding/workbench/11-instructor-gate-adjustment.png", "Gate adjustment · settings")}
            />
          </div>
        </div>
      </div>

      {lightbox && (
        <Lightbox
          src={lightbox.src}
          caption={lightbox.caption}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  );
}

function ProofOfMotionBand() {
  return (
    <div className="border-y py-6" style={{ borderColor: palette.line }}>
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Eyebrow>Proof of motion</Eyebrow>
          <h2 className="mt-3 font-heading text-3xl font-black uppercase leading-none" style={{ color: palette.ink }}>
            What the loop produced.
          </h2>
        </div>
        <p className="max-w-[30ch] text-sm leading-6" style={{ color: palette.muted }}>
          Practice Volume, Product Judgment, Iteration Through Version Control.
        </p>
      </div>

      <dl className="divide-y" style={{ borderColor: palette.line }}>
        {vibeKpis.map((kpi) => (
          <div
            key={kpi.label}
            className="grid gap-3 py-5 sm:grid-cols-[5.5rem_12rem_1fr] sm:items-baseline"
            style={{ borderColor: palette.line }}
          >
            <dt className="font-heading text-4xl font-black leading-none tabular-nums" style={{ color: palette.green }}>
              {kpi.value}
            </dt>
            <dd className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: palette.ink }}>
              {kpi.label}
            </dd>
            <dd className="text-sm leading-7" style={{ color: palette.muted }}>
              {kpi.detail}
            </dd>
          </div>
        ))}
      </dl>
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
            className={`border px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors duration-200${!active ? " hover:bg-paper-low" : ""}`}
            style={{
              borderColor: palette.line,
              ...(active ? { background: palette.ink, color: palette.paper } : { color: palette.ink }),
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
            className="inline-flex border-[3px] border-foreground bg-card px-4 py-3 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-foreground transition-colors duration-200 hover:bg-primary hover:text-primary-foreground"
          >
            Back to work
          </ReturnHomeAnchorLink>
        </div>

        <div className="rule-h pb-10">
          <ViewTransition name="project-title-vibe-coding">
            <p className="annotation mb-6 text-muted-foreground">
              AGENTIC SWE · ENTREPRENEURSHIP · PRODUCT MANAGEMENT
            </p>
          </ViewTransition>

          <h1 className="mb-8 max-w-[12ch] font-heading text-6xl font-black uppercase leading-[0.9] text-primary md:text-8xl">
            One calendar app, a lot of broken assumptions.
          </h1>

          <div className="max-w-[68ch] space-y-5 text-base leading-8 text-foreground/75 md:text-lg">
            <p>
              <strong>Vibe coding isn't one prompt</strong> and a finished product. It's a practice: <strong>knowing what you want, building it with agents, inspecting the result, and doing it again</strong>. I've been in this loop for the past two months, trying to <strong>actually understand what I'm building</strong>.
            </p>
            <p>This section maps the whole thing.</p>
            <p>
              <strong>Story</strong> is how it started and what I've learned.
            </p>
            <p>
              <strong>Environment</strong> is the workflow and tools I've built around it.
            </p>
            <p>
              <strong>Projects</strong> are the apps that came out of it.
            </p>
            <p>
              <strong>Watched</strong> is what I'm reading right now. Everything here is still moving.
            </p>
          </div>
        </div>

        <ProofOfMotionBand />

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
              <strong>Instead, I built my foundation on the stronger, SWE adjacent agent: Claude Code.</strong>
            </p>
            <p>
              <em>(I started at a very quick
                moving time — agents and agent-based productivity has made leaps and bounds in the months leading to me starting,
                as well as currently.)</em>
            </p>
            <p>
              <strong>Drift</strong> is where I first started, and where things started to click.
              I wanted a calendar app with a persistent Pomodoro timer, and the second I started building
              it I ran into all the work I didn't know existed. <strong>OAuth. Database state. Event persistence.</strong> The
              concept of storing something so it survives a page refresh. Every one of
              those felt <strong>obvious in hindsight</strong> and <strong>invisible before</strong>.
            </p>
            <p>
              That's what <strong>agentic coding</strong> is actually about for me. AI is like an <strong>intern </strong>
              with all the knowledge in the world, but they're <strong>extremely stupid</strong>. If you have
              no clue what you're trying to do, neither will the AI. <strong>Slop in, slop out. </strong>
            </p>
            <p>The loop is: <strong>know what you want, inspect what came back, and do it again </strong>
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
                  <p className="mt-3 text-sm leading-7" style={{ color: palette.muted }} dangerouslySetInnerHTML={{ __html: note.body }} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section >
  );
}

function EnvironmentTab() {
  return (
    <section className="vibe-content-enter px-6 py-16 sm:px-8 lg:px-12" style={{ background: palette.paperLow }}>
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[18rem_1fr]">
        <div>
          <Eyebrow>Environment</Eyebrow>
          <h2 className="mt-4 font-heading text-4xl font-black uppercase leading-[0.94]" style={{ color: palette.ink }}>
            Tuning the Dev Environment like a loadout.
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
              Personally love using google's VSCode Antigravity. Has all the knick knacks that makes VSCode so convenient, like file Explorer, Source Control, and various extensions while also including agent integrations with Gemini.
            </p>
            <div className="mt-6 overflow-hidden border" style={{ borderColor: palette.line }}>
              <Image
                src="/vibe-coding/dev-environment/Antigravity screenshot.png"
                alt="Antigravity IDE — Google's VSCode fork with Gemini agent integration"
                width={1280}
                height={720}
                className="w-full object-cover"
              />
            </div>
          </div>

          <div className="grid gap-3">
            {vibeTools.map((tool) => (
              <details key={tool.url} className="group border border-rule bg-paper p-5 transition-colors duration-200 hover:border-ink hover:bg-paper-low" style={{}}>
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
                  <p className="max-w-[62ch] text-sm leading-7" style={{ color: palette.muted }} dangerouslySetInnerHTML={{ __html: tool.body }} />
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
                className={`group grid gap-5 border-b py-8 transition-colors duration-200 md:grid-cols-[5rem_1fr]${!active ? " hover:bg-paper" : ""}`}
                style={{ borderColor: palette.line, ...(active ? { background: palette.paper } : {}) }}
              >
                <span className={`font-heading text-5xl font-black leading-none tabular-nums transition-colors duration-200${active ? "" : " text-[oklch(0.18_0.018_35/0.25)] group-hover:text-forest"}`} style={active ? { color: palette.green } : undefined}>
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
                  <p className="mt-4 max-w-[58ch] text-sm leading-7" style={{ color: palette.muted }} dangerouslySetInnerHTML={{ __html: project.summary }} />
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
                className={`border px-3 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] transition-colors duration-200${!active ? " hover:bg-paper-low" : ""}`}
                style={{
                  ...(active
                    ? { borderColor: palette.ink, background: palette.ink, color: palette.paper }
                    : { borderColor: "oklch(0.23 0.018 35 / 0.4)", color: palette.muted }),
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

        <div className="space-y-8">
          <div className="border p-6 sm:p-8" style={{ background: palette.paper, borderColor: palette.line }}>
            <Eyebrow>What it is</Eyebrow>
            <p className="mt-4 text-xl leading-9 sm:text-2xl sm:leading-10" style={{ color: palette.ink }}>
              {project.productDef}
            </p>
          </div>
          {project.slug === "workbench" ? (
            <div className="max-w-[65ch] space-y-5 text-lg leading-9" style={{ color: palette.ink }}>
              {project.detailBody.map((paragraph, idx) => (
                <p key={idx} className="mb-5" dangerouslySetInnerHTML={{ __html: paragraph }} />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
              <div className="max-w-[65ch] space-y-5 text-lg leading-9" style={{ color: palette.ink }}>
                {project.detailBody.map((paragraph, idx) => (
                  <p key={idx} className="mb-5" dangerouslySetInnerHTML={{ __html: paragraph }} />
                ))}
              </div>
              <VisualSlot label={project.visualLabel} />
            </div>
          )}
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
          <Eyebrow>For fellow devs.</Eyebrow>
          <h2 className="mt-4 font-heading text-4xl font-black uppercase leading-[0.94]" style={{ color: palette.ink }}>
            What I'm Looking At.
          </h2>
          <p className="mt-5 text-sm leading-7" style={{ color: palette.muted }}>
            Open source repos I'm watching, or looking to try soon.
            <p></p>
            <p></p>
            <em>Ranges anywhere from agent Harnesses, to UX/UI tools, to data wrangling — the possibilities and lists go on and on. Seeing what other people make lets me optimize my workflow with their tools, while also providing inspiration.</em>
          </p>
        </div>

        <div className="grid gap-3">
          {vibeWatched.map((repo) => (
            <details key={repo.url} className="group border-[3px] border-rule bg-paper p-5 transition-colors duration-200 hover:border-ink hover:bg-paper-low" style={{}}>
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
                <p className="max-w-[62ch] text-sm leading-7" style={{ color: palette.muted }} dangerouslySetInnerHTML={{ __html: repo.body }} />
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 block break-all font-mono text-[11px] underline decoration-foreground/30 underline-offset-4"
                  style={{ color: palette.green }}
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

function WorkbenchCollageSection() {
  return (
    <section className="px-6 pb-20 sm:px-8 lg:px-12" style={{ background: palette.base }}>
      <WorkbenchCollage />
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
          {activeProjectSlug === "workbench" && <WorkbenchCollageSection />}
        </>
      ) : null}
      {!activeProjectSlug && activeTab === "story" ? <StoryTab /> : null}
      {!activeProjectSlug && activeTab === "environment" ? <EnvironmentTab /> : null}
      {!activeProjectSlug && activeTab === "projects" ? <ProjectsTab /> : null}
      {!activeProjectSlug && activeTab === "watched" ? <WatchedTab /> : null}
    </div>
  );
}

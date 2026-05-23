"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const THINKING_STAGES = [
  {
    number: "01",
    title: "Name the mess",
    body: "I decide what problem is actually here before I reach for the clean answer.",
    note: "Wrong question first",
    tag: "blocker",
    segment:
      "M 126 174 C 196 112, 288 112, 358 180",
    desktopClass: "left-[4%] top-[7%] w-[34%] -rotate-[2deg]",
  },
  {
    number: "02",
    title: "Find the gap",
    body: "I separate the unknowns that change the decision from noise that only feels useful.",
    note: "Signal over noise",
    tag: "signal",
    segment:
      "M 358 180 C 454 236, 590 188, 666 230",
    desktopClass: "right-[5%] top-[6%] w-[33%] rotate-[1.5deg]",
  },
  {
    number: "03",
    title: "Build the baseline",
    body: "I put the smallest honest version in front of feedback before polish becomes a hiding place.",
    note: "Proof before polish",
    tag: "feedback",
    segment:
      "M 666 230 C 788 302, 760 440, 622 472",
    desktopClass: "bottom-[5%] right-[8%] w-[35%] -rotate-[1deg]",
  },
  {
    number: "04",
    title: "Revise on contact",
    body: "Then I cut, branch, or deepen the work where reality exposes the next move.",
    note: "Branch later",
    tag: "branch",
    segment:
      "M 622 472 C 500 522, 344 492, 270 430 C 206 378, 226 298, 334 262",
    desktopClass: "bottom-[3%] left-[10%] w-[37%] rotate-[1deg]",
  },
] as const;

const ROUTE_NODES = [
  { label: "wrong turn", className: "left-[39%] top-[25%]" },
  { label: "signal", className: "right-[40%] top-[34%]" },
  { label: "branch later", className: "left-[40%] bottom-[32%]" },
] as const;

const routeTransition = {
  duration: 1.68,
  ease: [0.16, 1, 0.3, 1],
} as const;

export function ThinkingProcessSection() {
  const [activeStage, setActiveStage] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="w-full bg-background px-6 py-10 sm:px-8 md:py-24 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 grid gap-5 lg:mb-10 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,30rem)] lg:items-end">
          <div>
            <p className="annotation text-secondary">Thinking process / 02</p>
            <h2 className="mt-4 max-w-[11ch] font-heading text-4xl font-black uppercase leading-[0.92] text-foreground sm:text-5xl md:text-6xl">
              Here&apos;s how I think.
            </h2>
          </div>
          <p className="max-w-[44ch] text-base leading-7 text-foreground/78 md:text-lg md:leading-8 lg:justify-self-end">
            The work starts before the polished answer. I need to see the problem,
            decide what matters, test a baseline, then let evidence change the next
            move.
          </p>
        </div>

        <div className="relative overflow-hidden border-[3px] border-foreground bg-card">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              backgroundImage:
                "linear-gradient(to right, color-mix(in oklch, var(--color-rule) 12%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklch, var(--color-rule) 12%, transparent) 1px, transparent 1px)",
              backgroundSize: "3.25rem 3.25rem",
            }}
          />

          <div className="relative px-4 py-5 sm:px-6 lg:hidden">
            <div className="absolute bottom-8 left-[2.15rem] top-8 w-[3px] bg-foreground/18" />
            <div className="space-y-4">
              {THINKING_STAGES.map((stage, index) => {
                const isActive = index === activeStage;

                return (
                  <div key={stage.number} className="relative pl-8">
                    <span
                      aria-hidden="true"
                      className={`absolute left-0 top-8 h-5 w-5 border-[3px] border-foreground transition-colors ${isActive ? "bg-primary" : "bg-card"
                        }`}
                    />
                    <motion.button
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setActiveStage(index)}
                      className={`brutalist-panel min-h-11 w-full touch-manipulation px-4 py-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card ${isActive ? "bg-paper-white" : "bg-card active:bg-muted"
                        }`}
                      initial={
                        prefersReducedMotion ? false : { opacity: 0, y: 18 }
                      }
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{
                        duration: prefersReducedMotion ? 0 : 0.55,
                        delay: prefersReducedMotion ? 0 : index * 0.07,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <span className="font-heading text-4xl font-black leading-none text-primary">
                          {stage.number}
                        </span>
                        <span className="annotation border border-foreground bg-muted px-2 py-1 text-secondary">
                          {stage.tag}
                        </span>
                      </div>
                      <h3 className="mt-5 font-heading text-2xl font-black uppercase leading-[0.96] text-foreground">
                        {stage.title}
                      </h3>
                      <p className="mt-3 max-w-[28rem] text-base leading-7 text-foreground/78">
                        {stage.body}
                      </p>
                      <p className="mt-4 border-t border-foreground pt-3 annotation text-secondary">
                        {stage.note}
                      </p>
                    </motion.button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative hidden min-h-[48rem] lg:block">
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 920 620"
              fill="none"
              preserveAspectRatio="none"
            >
              <motion.path
                d="M 126 174 C 196 112, 288 112, 358 180 C 454 236, 590 188, 666 230 C 788 302, 760 440, 622 472 C 500 522, 344 492, 270 430 C 206 378, 226 298, 334 262"
                stroke="color-mix(in oklch, var(--color-rule) 54%, transparent)"
                strokeWidth="3"
                strokeLinecap="square"
                initial={
                  prefersReducedMotion
                    ? false
                    : { opacity: 0, pathLength: 0 }
                }
                whileInView={{ opacity: 1, pathLength: 1 }}
                viewport={{ once: true, margin: "-120px" }}
                transition={
                  prefersReducedMotion ? { duration: 0 } : routeTransition
                }
              />
              {THINKING_STAGES.map((stage, index) => (
                <motion.path
                  key={stage.number}
                  d={stage.segment}
                  stroke="var(--primary)"
                  strokeWidth="5"
                  strokeLinecap="square"
                  initial={
                    prefersReducedMotion
                      ? false
                      : { opacity: 0, pathLength: 0 }
                  }
                  whileInView={{ pathLength: 1 }}
                  animate={{ opacity: activeStage === index ? 1 : 0.1 }}
                  viewport={{ once: true, margin: "-120px" }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.72,
                    delay: prefersReducedMotion ? 0 : 0.62 + index * 0.14,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
              ))}
            </svg>

            {ROUTE_NODES.map((node, index) => (
              <motion.div
                key={node.label}
                aria-hidden="true"
                className={`pointer-events-none absolute z-[15] ${node.className}`}
                initial={
                  prefersReducedMotion ? false : { opacity: 0, scale: 0.7 }
                }
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-120px" }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.56,
                  delay: prefersReducedMotion ? 0 : 1.34 + index * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <div className="relative flex items-center gap-2">
                  <span className="h-4 w-4 border-[3px] border-foreground bg-primary" />
                  <span className="annotation border border-foreground bg-card px-2 py-1 text-secondary">
                    {node.label}
                  </span>
                </div>
              </motion.div>
            ))}

            {THINKING_STAGES.map((stage, index) => {
              const isActive = index === activeStage;

              return (
                <motion.button
                  key={stage.number}
                  type="button"
                  aria-pressed={isActive}
                  onFocus={() => setActiveStage(index)}
                  onMouseEnter={() => setActiveStage(index)}
                  className={`brutalist-panel group absolute min-h-[15.5rem] px-6 py-5 text-left transition-transform duration-200 focus-visible:z-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card ${stage.desktopClass} ${isActive
                      ? "z-10 -translate-y-1 translate-x-1 bg-paper-white"
                      : "z-[1] bg-card hover:-translate-y-1 hover:translate-x-1"
                    }`}
                  initial={
                    prefersReducedMotion ? false : { opacity: 0, y: 34 }
                  }
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-120px" }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.96,
                    delay: prefersReducedMotion ? 0 : 0.5 + index * 0.14,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <div className="flex items-start justify-between gap-5">
                    <span className="font-heading text-6xl font-black leading-none text-primary">
                      {stage.number}
                    </span>
                    <span className="annotation border border-foreground bg-muted px-2 py-1 text-secondary">
                      {stage.tag}
                    </span>
                  </div>
                  <h3 className="mt-6 max-w-[9ch] font-heading text-3xl font-black uppercase leading-[0.93] text-foreground">
                    {stage.title}
                  </h3>
                  <p className="mt-4 max-w-[29ch] text-base leading-7 text-foreground/78">
                    {stage.body}
                  </p>
                  <p
                    className={`mt-5 border-t border-foreground pt-3 annotation text-secondary transition-opacity duration-200 ${isActive ? "opacity-100" : "opacity-35"
                      }`}
                  >
                    {stage.note}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

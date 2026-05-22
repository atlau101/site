"use client";

import React, { useState } from "react";
import { ProjectData } from "@/lib/projects/types";
import { RichProjectText } from "./RichProjectText";

interface ProjectTakeawaysProps {
  project: ProjectData;
}

const palette = {
  base: "oklch(0.9337 0.004688 142)",
  paper: "oklch(0.978 0.002 106)",
  paperShadow: "oklch(0.905 0.006 100)",
  green: "oklch(0.31 0.082 142)",
  ink: "oklch(0.19 0.016 35)",
  line: "oklch(0.79 0.008 110)",
  ruleBlue: "oklch(0.78 0.02 235)",
};

function TakeawaySheet({
  title,
  summary,
  body,
  index,
}: {
  title: string;
  summary: string;
  body: string;
  index: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <article className="relative">
      <div
        className="relative overflow-hidden border"
        style={{
          background: palette.paper,
          borderColor: palette.line,
          boxShadow: `7px 7px 0 ${palette.paperShadow}`,
        }}
      >
        <div
          className="absolute inset-y-0 left-0 w-[4.6rem] border-r"
          style={{
            borderColor: palette.line,
            background: "rgba(255, 255, 255, 0.48)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-y-0 left-[4.6rem] w-[2px]"
          style={{ background: palette.green }}
        />
        <div className="pointer-events-none absolute left-[1.38rem] top-[2.15rem] flex flex-col gap-[4.45rem]">
          {[0, 1, 2].map((item) => (
            <span
              key={item}
              className="h-5 w-5 rounded-full border"
              style={{
                background: palette.base,
                borderColor: palette.line,
              }}
            />
          ))}
        </div>

        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="relative flex w-full items-start justify-between gap-6 px-6 py-6 pl-[6.25rem] pr-8 text-left transition-transform duration-200 ease-out hover:translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{
            color: palette.ink,
            borderColor: palette.green,
            outlineColor: palette.green,
          }}
        >
          <div className="space-y-4">
            <div
              className="font-mono text-[10px] uppercase tracking-[0.22em]"
              style={{ color: palette.green }}
            >
              Note {String(index + 1).padStart(2, "0")}
            </div>
            <h3
              className="text-[1.85rem] leading-[1.02] md:text-[2.35rem]"
              style={{
                color: palette.ink,
                fontFamily: '"Marker Felt", "Bradley Hand", cursive',
              }}
            >
              {title}
            </h3>
            <p
              className="max-w-[42rem] text-[1.02rem] leading-[1.75rem]"
              style={{ color: palette.ink }}
            >
              {summary}
            </p>
          </div>

          <div
            className="mt-1 shrink-0 text-[1.45rem] leading-none"
            style={{
              color: palette.green,
              fontFamily: "Arial Black, Impact, sans-serif",
            }}
          >
            {open ? "−" : "+"}
          </div>
        </button>

        <div
          className="grid transition-[grid-template-rows] duration-300 ease-out"
          style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
        >
          <div className="overflow-hidden">
            <div
              className="border-t pl-[6.25rem] pr-8"
              style={{
                borderColor: palette.line,
                paddingTop: "1.75rem",
                paddingBottom: "3.5rem",
                backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent calc(1.75rem - 1px), ${palette.ruleBlue} calc(1.75rem - 1px), ${palette.ruleBlue} 1.75rem)`,
                backgroundPositionY: "-0.3rem",
              }}
            >
              <RichProjectText
                text={body}
                className="max-w-[44rem] space-y-[1.75rem]"
                paragraphClassName="text-[1.02rem] leading-[1.75rem] text-foreground"
                strongClassName="font-semibold text-foreground"
              />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export const ProjectTakeaways: React.FC<ProjectTakeawaysProps> = ({ project }) => {
  return (
    <section
      className="w-full px-6 py-20 sm:px-8 lg:px-12"
      style={{ background: palette.base }}
    >
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[20rem_1fr] lg:gap-12">
        <div className="space-y-3 lg:pt-2">
          <p
            className="annotation"
            style={{ color: palette.green }}
          >
            POST-PROJECT REFLECTION
          </p>
          <h2
            className="font-heading text-3xl font-medium leading-[0.98] sm:text-4xl md:text-5xl"
            style={{ color: palette.ink }}
          >
            What I Took Away
          </h2>
          <p
            className="max-w-[16rem] text-[0.92rem] uppercase leading-[2.05] tracking-[0.08em]"
            style={{ color: palette.ink, opacity: 0.68 }}
          >
            What I learned. Ranges anywhere from technical skills, to general lessons. <br></br><br></br>My goal is to always learn from an experience, no matter how big or small.
          </p>
        </div>

        <div className="space-y-8">
          {project.lessons.map((lesson, idx) => (
            <TakeawaySheet
              key={idx}
              title={lesson.title}
              summary={lesson.summary}
              body={lesson.full}
              index={idx}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

"use client";

import React, { useState } from "react";
import { RichProjectText } from "./RichProjectText";

const palette = {
  ink: "oklch(0.19 0.016 35)",
  green: "oklch(0.31 0.082 142)",
  line: "oklch(0.79 0.008 110)",
};

interface ProjectDescriptionProps {
  lead?: string;
  body: string;
}

export function ProjectDescription({ lead, body }: ProjectDescriptionProps) {
  const [open, setOpen] = useState(false);

  if (!lead) {
    return (
      <p
        className="font-heading text-lg font-normal leading-relaxed md:text-xl"
        style={{ color: palette.ink }}
      >
        {body}
      </p>
    );
  }

  return (
    <div>
      <p
        className="font-heading text-lg font-semibold leading-relaxed md:text-xl"
        style={{ color: palette.ink }}
      >
        {lead}
      </p>

      <div
        className="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
        id="description-body"
      >
        <div className="overflow-hidden">
          <div className="pt-4">
            <RichProjectText
              text={body}
              paragraphClassName="font-heading text-base font-normal leading-relaxed text-foreground md:text-lg"
            />
          </div>
        </div>
      </div>

      <button
        type="button"
        aria-expanded={open}
        aria-controls="description-body"
        onClick={() => setOpen((v) => !v)}
        className="mt-3 font-mono text-[0.75rem] uppercase tracking-[0.18em] transition-opacity duration-150 hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        style={{ color: palette.green, outlineColor: palette.green }}
      >
        {open ? "Read less ↑" : "Read more ↓"}
      </button>
    </div>
  );
}

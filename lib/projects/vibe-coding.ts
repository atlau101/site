import { ProjectData } from "./types";

export const vibeCodingProject: ProjectData = {
  slug: "vibe-coding",
  title: "Agentic AI Coding",
  year: "2025–ongoing",
  type: "Agentic SWE · Entrepreneurship · Product Management",
  skills: [
    "Agentic Coding",
    "Rapid Iteration & Prototyping",
    "Human-in-the-Loop Debugging",
  ],
  tagline:
    "Two months in. Drift, Workbench, and Augment came out of it, and I'm still tuning the dev environment like a co-op mission loadout.",
  description:
    "I picked up Claude Code two months ago starting with Drift, a calendar app idea. That first build taught me what software actually takes — OAuth, database state, UI behavior that doesn't just happen. Since then I've shipped a working Workbench MVP, been designing Augment with a Berkeley co-founder, and spent a lot of time on GitHub looking at what's new in open-source agent tooling. This page tracks all of it.",
  outputs: [
    {
      label: "Current Status",
      value: "Drift unfinished. Workbench MVP working. Augment still concept-stage.",
    },
  ],
  lessons: [
    {
      title: "AI is an intern with all the knowledge in the world, but they're extremely stupid.",
      summary:
        "The value isn't one perfect prompt — it's knowing what you want, checking what came back, and running the loop again.",
      full:
        "My professors say it like this: if you put in slop, you get slop out. It took me building Drift to understand what that really means. The agent doesn't know what Drift is supposed to feel like. It doesn't know that the timer needs to stay visible across tab switches, or that the drag behavior should feel snappy, or that an OAuth error should tell the user something useful. I have to know those things, specify them, inspect the result, and iterate. The agent has all the knowledge. The direction has to come from me.",
    },
  ],
  redos: [],
};

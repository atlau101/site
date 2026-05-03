import { ProjectData } from "./types";

export const vibeCodingProject: ProjectData = {
  slug: "vibe-coding",
  title: "Vibe Coding",
  year: "2025–ongoing",
  type: "AI-Assisted SWE · Tooling · WIP",
  skills: [
    "Agentic Workflows",
    "Rapid Prototyping",
    "Tool Evaluation",
    "Human-in-the-Loop Debugging",
  ],
  tagline:
    "An ongoing body of experiments and projects using coding agents, MCPs, and fast repo iteration to execute various ideas and increase productivity.",
  description:
    "This page is intentionally a work in progress because the project itself still is. The through-line is straightforward: I keep using live repos as a lab for agentic coding, context tooling, and fast implementation loops, then paying close attention to where the speed is real, where the handoff quality breaks, and where taste still matters more than automation. The interesting part is not that AI can generate code. It is which parts of the workflow get easier, which get noisier, and what kind of judgment still has to stay human.",
  outputs: [
    {
      label: "Current Status",
      value: "Ongoing experiments, still consolidating the strongest examples",
    },

  ],
  lessons: [
    {
      title: "WIP.",
      summary:
        "WIP.",
      full:
        "WIP.",
    },
    {
      title: "Tooling changes fast, judgment does not.",
      summary:
        "The stack keeps moving, but the durable skill is still deciding what is worth building, what is noise, and when to stop trusting the machine's momentum.",
      full:
        "The interesting pattern so far is that the tools improve much faster than the surrounding habits. Prompting, repo structure, context loading, verification discipline, and UI taste still decide whether the output is useful. The models changed. The need for judgment did not.",
    },
  ],
  redos: [],
};

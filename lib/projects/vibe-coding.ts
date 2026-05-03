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
    "An ongoing body of experiments using coding agents, MCPs, and fast repo iteration to learn where assisted development actually helps.",
  description:
    "This page is intentionally a work in progress because the project itself still is. The through-line is straightforward: I keep using live repos as a lab for agentic coding, context tooling, and fast implementation loops, then paying close attention to where the speed is real, where the handoff quality breaks, and where taste still matters more than automation. The interesting part is not that AI can generate code. It is which parts of the workflow get easier, which get noisier, and what kind of judgment still has to stay human.",
  outputs: [
    {
      label: "Current Status",
      value: "Ongoing experiments, still consolidating the strongest examples",
    },
    {
      label: "Focus",
      value: "Where coding agents add leverage versus where they create drag",
    },
  ],
  lessons: [
    {
      title: "Speed only matters if orientation survives it.",
      summary:
        "The biggest gain from AI-assisted development is not raw generation, it is reducing the time between idea, test, and correction without losing the thread.",
      full:
        "The useful version of vibe coding is not 'ask for an app and hope.' It is keeping enough context, intent, and evaluation discipline in the loop that rapid iteration still compounds instead of collapsing into cleanup. When the context is tight and the goal is concrete, agents can remove a lot of dead time. When the context is loose, they mostly accelerate wrong turns.",
    },
    {
      title: "Tooling changes fast, judgment does not.",
      summary:
        "The stack keeps moving, but the durable skill is still deciding what is worth building, what is noise, and when to stop trusting the machine's momentum.",
      full:
        "The interesting pattern so far is that the tools improve much faster than the surrounding habits. Prompting, repo structure, context loading, verification discipline, and UI taste still decide whether the output is useful. The models changed. The need for judgment did not.",
    },
  ],
  redos: [
    "I need to document this work as a tighter set of concrete case studies instead of a broad running bucket. Right now the experimentation is real, but the page still needs better curation.",
  ],
};

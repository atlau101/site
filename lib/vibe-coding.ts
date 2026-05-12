export type VibeTabId = "story" | "environment" | "projects";
export type VibeProjectSlug = "drift" | "workbench" | "augment";

export const vibeTabs: Array<{ id: VibeTabId; label: string; href: string }> = [
  { id: "story", label: "Story", href: "/projects/vibe-coding?tab=story" },
  { id: "environment", label: "Environment", href: "/projects/vibe-coding?tab=environment" },
  { id: "projects", label: "Projects", href: "/projects/vibe-coding?tab=projects" },
];

export const workflowNotes = [
  {
    label: "Jump in",
    body: "The useful version of this did not start with a perfect plan. It started with an idea, Claude Code, and enough curiosity to see what would break.",
  },
  {
    label: "Notice the hidden work",
    body: "Drift made normal software feel less magical. Login, saved events, timers, state, and every small interaction had to be made real.",
  },
  {
    label: "Use Git like a save file",
    body: "Commits changed the psychology. I could try riskier changes because a working state was always recoverable.",
  },
  {
    label: "Turn critique into a build",
    body: "The old instinct was to point at what felt wrong. Now the sharper move is to sketch the better version and test whether the critique holds up.",
  },
];

export const vibeTools = [
  {
    name: "rtk",
    owner: "rtk-ai",
    url: "https://github.com/rtk-ai/rtk",
    role: "Local execution layer",
    body: "I use this as part of the command and verification layer around agent work. The value is practical: run the thing, inspect the result, keep the loop moving.",
  },
  {
    name: "awesome-claude-code-subagents",
    owner: "VoltAgent",
    url: "https://github.com/VoltAgent/awesome-claude-code-subagents",
    role: "Agent role reference",
    body: "This is a reference shelf for thinking in specialized agents instead of one giant assistant. It maps cleanly to how I want harder work split up.",
  },
  {
    name: "graphify",
    owner: "safishamsi",
    url: "https://github.com/safishamsi/graphify",
    role: "Relationship extraction",
    body: "This connects directly to the Augment idea. I keep coming back to tools that can turn messy material into a graph of relationships I can actually inspect.",
  },
  {
    name: "context-mode",
    owner: "mksglu",
    url: "https://github.com/mksglu/context-mode",
    role: "Context routing",
    body: "Context is one of the real constraints in agent work. Better routing means less raw dumping and more precise retrieval when the agent needs evidence.",
  },
  {
    name: "impeccable",
    owner: "pbakaus",
    url: "https://github.com/pbakaus/impeccable",
    role: "Design discipline",
    body: "Goat. This is the layer that pushes agent-built interfaces away from generic AI slop and toward actual product taste.",
  },
];

export const vibeProjects = [
  {
    slug: "drift",
    num: "01",
    title: "Drift",
    status: "First app, unfinished",
    href: "/projects/vibe-coding/drift",
    summary: "A drag-and-drop calendar and persistent Pomodoro idea that taught me how much state, OAuth, and UI behavior sit underneath everyday software.",
    detailTitle: "The first app made software feel real.",
    detailEyebrow: "Drift · calendar, Pomodoro, OAuth, state",
    detailBody: [
      "Drift started as a time-management app. The idea was simple enough: predefined tasks that could be dragged into blocks of the day, with a Pomodoro timer that stayed visible no matter where you were in the app.",
      "The important part is that it is not finished. The useful part is what it exposed. A calendar event has to be stored somewhere. A login flow has to go through OAuth. A timer has to persist, update, and stay honest across the interface. Every widget I took for granted in Apple Calendar, Google Calendar, or Todoist suddenly looked like work someone had to specify.",
      "That changed how I look at software. It made agentic coding less about asking for an app and more about understanding the system hiding underneath a normal interaction.",
    ],
    visualLabel: "Drift MVP / wireframe",
  },
  {
    slug: "workbench",
    num: "02",
    title: "Workbench",
    status: "Working MVP",
    href: "/projects/vibe-coding/workbench",
    summary: "A reflection-gated writing assistant built around the idea that students should think before they ask AI to finish the work.",
    detailTitle: "AI literacy by making the student think first.",
    detailEyebrow: "Workbench · reflection gate, assistant, synthesis",
    detailBody: [
      "Workbench is the clearest product version of the idea. The premise is not anti-AI. The premise is that students are using AI badly when they outsource the thinking before they understand what they want to say.",
      "The MVP puts a reflection gate in front of the assistant. Before the AI unlocks, the student has to write what they are trying to say, where they are stuck, and what they already think. After that, the assistant is not supposed to simply answer. It pushes back, asks why, and points without replacing the student's work.",
      "That is the thread I care about: AI as a thinking partner only works if the person brings enough of their own thinking into the room.",
    ],
    visualLabel: "Workbench MVP screenshot",
  },
  {
    slug: "augment",
    num: "03",
    title: "Augment",
    status: "Back-burner frontier",
    href: "/projects/vibe-coding/augment",
    summary: "A canvas idea for turning notes, documents, and messy explanations into human-legible maps of how ideas connect.",
    detailTitle: "Messy thinking should become visible without being flattened.",
    detailEyebrow: "Augment · semantic graph, canvas, documents",
    detailBody: [
      "Augment is still the least formed, but it is the one I keep circling back to. The idea is a canvas-based mind map where the structure appears as you talk through a problem or upload documents.",
      "The point is not to force people to organize their thoughts before they can see them. The point is to let AI do some of the mapping, then give the person a graph they can inspect, question, and reshape.",
      "It connects to studying, project planning, and my own problem-solving habits. Hard problems rarely arrive as clean outlines. They arrive as clusters, branches, and dependencies that only make sense once you can see the relationships.",
    ],
    visualLabel: "Augment concept wireframe",
  },
] as const;

export function getVibeProject(slug: string) {
  return vibeProjects.find((project) => project.slug === slug) ?? null;
}

export function isVibeTabId(value: string): value is VibeTabId {
  return value === "story" || value === "environment" || value === "projects";
}

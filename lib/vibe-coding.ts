export type VibeTabId = "story" | "environment" | "projects" | "watched";
export type VibeProjectSlug = "drift" | "workbench" | "augment";

export const vibeTabs: Array<{ id: VibeTabId; label: string; href: string }> = [
  { id: "story", label: "Story", href: "/projects/vibe-coding?tab=story" },
  { id: "environment", label: "Environment", href: "/projects/vibe-coding?tab=environment" },
  { id: "projects", label: "Projects", href: "/projects/vibe-coding?tab=projects" },
  { id: "watched", label: "Watched", href: "/projects/vibe-coding?tab=watched" },
];

export const workflowNotes = [
  {
    label: "My introduction",
    body: "I picked up Claude Code two months ago with no plan. Just an idea for a calendar app and enough curiosity to learn and try.",
  },
  {
    label: "Notice the hidden work",
    body: "Every interaction, button, UX element, design, etc. on an app is something you need to code in. Drift made Google Calendar look like witchcraft. A timer, a saved event, a login — every one of those are things I took for granted before I started building.",
  },
  {
    label: "Git as a save file",
    body: "Before I touch anything, risky or not, I always commit or branch. Same instinct as saving before a legendary Pokémon encounter — if I accidentally faint it, I can just roll back.",
  },
  {
    label: "Critique as Product Development",
    body: "At Rebrandly, constantly critiquing the client was counterproductive. Yet now, that critique can become a wireframe. Same eye, but now, software is democratized.",
  },
];

export const vibeTools = [
  {
    name: "rtk",
    owner: "rtk-ai",
    url: "https://github.com/rtk-ai/rtk",
    role: "Local execution layer",
    body: "Runs commands inside the agent loop and keeps them honest. Worth it when an agent claims it ran something — this actually verifies the output.",
  },
  {
    name: "awesome-claude-code-subagents",
    owner: "VoltAgent",
    url: "https://github.com/VoltAgent/awesome-claude-code-subagents",
    role: "Agent role reference",
    body: "My go-to when I need to split up a harder task across specialized agents instead of pushing everything into one big prompt. Good mental model for the work.",
  },
  {
    name: "graphify",
    owner: "safishamsi",
    url: "https://github.com/safishamsi/graphify",
    role: "Relationship extraction",
    body: "Connects directly to what I'm building in Augment — turning messy input into a graph of relationships. I use it on codebases to understand structure before I start prompting.",
  },
  {
    name: "context-mode",
    owner: "mksglu",
    url: "https://github.com/mksglu/context-mode",
    role: "Context routing",
    body: "Context window is a real constraint once you're doing serious agent work. This routes retrieval more precisely instead of dumping everything in at once.",
  },
  {
    name: "impeccable",
    owner: "pbakaus",
    url: "https://github.com/pbakaus/impeccable",
    role: "Design discipline",
    body: "Goat. The layer that keeps agent-built UIs from looking like AI-generated slop with a bunch of emojis on them.",
  },
];

export const vibeProjects = [
  {
    slug: "drift",
    num: "01",
    title: "Drift",
    status: "First app, unfinished",
    href: "/projects/vibe-coding/drift",
    summary: "A drag-and-drop calendar where you slide predefined tasks into blocks of your day, with a Pomodoro timer that stays visible no matter where you are in the app. The timer was the point — a visible countdown is the best phone-distraction defense I've found.",
    detailTitle: "The unfinished first app that taught me what software actually is.",
    detailEyebrow: "Drift · calendar · Pomodoro · OAuth · Supabase",
    detailBody: [
      "The idea was a time-management calendar where you have predefined tasks — work blocks, exercise, focus sessions — and you slide them into whatever time slots fit your day. The Pomodoro timer was the actual value: it stays on screen regardless of where you go in the app. I've always found that a visible countdown keeps me from reaching for my phone. Todoist's timer disappears when you switch tabs. Drift's wouldn't.",
      "It's unfinished. But the build taught me more than the idea did. A calendar event has to be stored somewhere — that meant learning Supabase and database state for the first time. Logging in through Google meant working through OAuth from scratch. Every little thing I'd taken for granted in apps I use every day suddenly had a price in code.",
      "My professors say it like this: if you put in slop, you get slop out. It took me building Drift to understand what that really means. The agent doesn't know what Drift is supposed to feel like. It doesn't know that the timer needs to stay visible across tab switches, or that the drag behavior should feel snappy, or that an OAuth error should tell the user something useful. I have to know those things, specify them, inspect the result, and iterate. The agent has all the knowledge. The direction has to come from me.",
      "That's the useful part of Drift: I stopped seeing apps as products and started seeing them as systems. Every widget in Apple Calendar, every button in Todoist — someone had to specify all of that. Once you know that, you look at software differently.",
    ],
    visualLabel: "Drift MVP / wireframe",
  },
  {
    slug: "workbench",
    num: "02",
    title: "Workbench",
    status: "Working MVP",
    href: "/projects/vibe-coding/workbench",
    summary: "An AI writing assistant with a reflection gate in front of it. Before the assistant unlocks, you have to write what you're trying to say and where you're stuck. The idea is that you should think before you outsource.",
    detailTitle: "Make the student think before the AI unlocks.",
    detailEyebrow: "Workbench · reflection gate · assistant · synthesis",
    detailBody: [
      "The premise came from watching how students actually use AI. They're not using it to think harder — they're using it to skip the thinking entirely. They paste in an assignment and ask for the answer without engaging with the material at all. The product is built around that problem.",
      "Workbench puts a reflection gate in front of the assistant. You can't access the AI until you write out your own thoughts: what you're trying to say, where you're confused, what you already think. Once you do that, the AI unlocks — but the system prompt is designed to push back, not answer. It asks why you think something, points in a direction without giving you the destination.",
      "The goal is to teach AI literacy by making you bring your own thinking into the room first. It's a working MVP — backend, frontend, everything. The reflection gate mechanic is what I'm most interested in validating.",
    ],
    visualLabel: "Workbench MVP screenshot",
  },
  {
    slug: "augment",
    num: "03",
    title: "Augment",
    status: "Back-burner frontier",
    href: "/projects/vibe-coding/augment",
    summary: "A canvas mind-map tool where a bot builds the graph as you talk through your thoughts or upload documents. The brain doesn't think in straight lines — this tries to match that.",
    detailTitle: "Your thoughts as a graph, because brains don't think in straight lines.",
    detailEyebrow: "Augment · semantic graph · canvas · documents",
    detailBody: [
      "The original motivation was similar to Workbench — I wanted something that encouraged people to understand their own thinking before handing it to AI. My version of working through a hard problem is to keep breaking it down: what is the problem, what do I need to know, what's blocking me, why can't I solve it. If you mapped that out, you'd get a tree with 16 branches off one root. That's how I actually think.",
      "I've been working through this with a student from UC Berkeley who came at it from a different angle. His use case is applied mathematics — tons of concepts that seem siloed until you realize they're all built on top of each other. A mind map that shows those relationships is more useful than a set of notes because you can see the structure.",
      "The connection to neural networks is something I keep coming back to. Transformers use self-attention to understand context non-linearly — they don't process things one by one, they look at how everything relates to everything else. That's roughly what Augment is trying to do for a student's notes. Still mostly an idea; no wireframe yet. But it's the one I keep circling back to.",
    ],
    visualLabel: "Augment concept wireframe",
  },
] as const;

export const vibeWatched = [
  {
    name: "hermes-agent",
    owner: "nousresearch",
    url: "https://github.com/nousresearch/hermes-agent",
    intent: "A constantly evolving agent.",
    body: "OpenClaw but smarter, constantly growing with you by creating its own skills. Definitely want to set aside some tokens and see what this thing's made of.",
  },
  {
    name: "huashu-design",
    owner: "alchaincyf",
    url: "https://github.com/alchaincyf/huashu-design",
    intent: "Open Source, CLI-Based Design.",
    body: "Open source version of Claude-Design. Utilizes CLI instead of Claude-Design's web focus. Makes it so you're not limited by the separate Design limits on Anthropic. Definitely on my list to try when the time arises.",
  },
  {
    name: "qsv",
    owner: "dathere",
    url: "https://github.com/dathere/qsv",
    intent: "Data tooling to try",
    body: "Rust CLI for fast CSV work. On the list for the next time I need to manipulate a large dataset without spinning up pandas.",
  },
];

export function getVibeProject(slug: string) {
  return vibeProjects.find((project) => project.slug === slug) ?? null;
}

export function isVibeTabId(value: string): value is VibeTabId {
  return value === "story" || value === "environment" || value === "projects" || value === "watched";
}

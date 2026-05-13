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
    productDef: "A drag-and-drop time management calendar where you slot predefined tasks — work blocks, exercise, focus sessions — into whatever time slots fit your day. The centerpiece is a Pomodoro timer that stays visible on screen no matter where you go in the app.",
    detailBody: [
      "The idea was a time-management calendar where you have <b>predefined tasks</b> — work blocks, exercise, focus sessions — and you slide them into whatever time slots fit your day. The Pomodoro timer was the actual value: it <b>stays on screen regardless of where you go in the app</b>. I've always found that a <b>visible countdown keeps me from reaching for my phone</b>. Todoist's timer disappears when you switch tabs. Drift's wouldn't.",
      "It's unfinished. But the build taught me more than the idea did. A calendar event has to be stored somewhere — that meant learning Supabase and database state for the first time. Logging in through Google meant working through OAuth from scratch. My method was to <b>iterate while taking notes off apps I actually used</b>: Todoist, Apple Reminders, Apple Calendar, Google Calendar — <b>cataloguing every interaction I take for granted</b> but now had to code myself.",
      "That process <b>changed how I look at products</b>. Before Drift, I used Google Calendar without thinking about it. After Drift, I couldn't stop noticing every button, every widget, every animation — and the <b>cost each one has in code</b>. Things you take for granted every day require <b>coding for each interaction and UI element</b>. None of it just happens.",
      "That's the useful shift: I stopped seeing apps as products and started seeing them as <b>systems of specified decisions</b>. Knowing that, you build and prompt differently.",
    ],
    visualLabel: "Drift MVP / wireframe",
  },
  {
    slug: "workbench",
    num: "02",
    title: "Workbench",
    status: "Working MVP",
    href: "/projects/vibe-coding/workbench",
    summary: "An end to end learning platform training students how to work alongside AI, rather than having AI do their work for them. Centers around a reflection gate, where you have to write what you're trying to say and where you're stuck before receiving AI assistance. Think before you outsource.",
    detailTitle: "Make the student think before the AI unlocks.",
    detailEyebrow: "Workbench · reflection gate · assistant · synthesis",
    productDef: "An AI writing assistant with a reflection gate in front of it. Before the AI unlocks, you have to write your own thoughts — what you're trying to say, where you're stuck, what you think. The assistant that unlocks is adversarial: it critiques and expands your claims rather than answering you.",
    detailBody: [
      "The premise came from <b>watching how students actually use AI</b>. They're not using it to think harder — they're using it to <b>skip thinking entirely</b>. Paste in the assignment, ask for the answer, get a 100%, never engage with the material. Workbench is built around that problem, but not in the restrictive way.",
      "Workbench embraces the AI age. Instead of holding students back form using AI, why not give it to them, but limit the exposure they have instead? Instead, the idea is: <b>to unlock the AI, you have to write your own thoughts</b>: what you're trying to say, where you're stuck, what you think. Once you do that, an <b>adversarial helper</b> unlocks. It's set up to <b>critique and expand their claims</b>, not give straight answers. The system prompt is designed around <b>making the user think</b>. It asks why you think this way, how you got there. The voice is something like: okay, you want help with this — I can tell you you might be going in this direction, but what do you think? It won't give you the destination.",
      "The goal is to train students to have a better sense of <b>AI literacy</b> as well as how to <b>think better by understanding their own thoughts</b>. You have to bring something into the room before the AI will engage with it. <b>Working MVP</b> — backend, frontend, the whole loop. The reflection gate mechanic is what I want to validate.",
    ],
    visualLabel: "Workbench MVP screenshot",
  },
  {
    slug: "augment",
    num: "03",
    title: "Augment",
    status: "Back-burner frontier",
    href: "/projects/vibe-coding/augment",
    summary: "An open canvas mind-map tool where a bot builds the graph as you talk through your thoughts or upload documents. The brain doesn't think in straight lines — this tries to match that.",
    detailTitle: "Your thoughts as a graph, because brains don't think in straight lines.",
    detailEyebrow: "Augment · semantic graph · canvas · documents",
    productDef: "A canvas-based mind map tool where the map gets built for you as you talk through your thoughts or upload documents. Whether or not you structure your thinking first — the AI helps to do the mapping and you get a human-legible graph of how your ideas connect.",
    detailBody: [
      "Prelude: Get ready. <b>This is gonna be a lot.</b> It's the product idea I'm by far the most interested in, and my story reflects that.",
      "The original motivation was the same as Workbench: <b>make people understand their own thinking</b> before they hand it to AI. My version of working through a hard problem is to keep breaking it down — What is the problem? What do I need to know about it? How do I solve it? What's the end goal? If I can't solve it, why can't I? Then I keep going. If you mapped that out, you'd get a massive tree—one root node, way too many branches—because of <b>how many follow-up questions I ask myself</b>. That's <b>how I actually think about hard problems</b>. Mapping that out is what Augment is trying to do.",
      "The idea kept evolving. First it was a study tool — look at any serious Obsidian vault and you'll see the same instinct: people connect primary concepts to sources and related material non-linearly, building a knowledge graph out of what they know. I connected with a friend, <b>Kevin</b>, a student from UC Berkeley who's probably going to be my co-founder on this. He came at it from a STEM angle: in applied mathematics you have a ton of concepts that feel totally siloed — definitions, theorems, proofs — until you realize most of them are built on top of each other or quietly relate. A textbook won't show you that. A map that surfaces those relationships doesn't just help you study; it helps you <b>see how the field is actually structured</b>.",
      "Then I thought: <b>why not apply it to project management</b>? When you're building something from scratch, or any project for that matter, figuring out your critical path is genuinely hard — what's essential, what's a branch you can do later, what's a dependency you haven't named yet. The idea: brain dump the whole project into Augment and it builds an initial map. Keep talking to it as the project develops and the map grows with you. You end up with a clearer picture of what's blocking everything else, what can wait, and what you thought was important but actually isn't. Then the simplest version of all this clicked: if everyone already takes notes linearly — top to bottom in a Google Doc, the way we were all taught — why couldn't you just <b>turn those notes into a graph</b>? There's a couple high quality repos that've applied this thinking to codebases, but nothing more student/general focused.",
      "The honest question is still: <b>who cares, and why does it actually matter?</b> The concept has a real adoption barrier. Most people don't think non-linearly, or at least they don't think they do, because they were taught to go top to bottom. I don't even fully utilize non-linear thinking myself. But the connection I keep coming back to is that neural networks and transformers — the backbone of every LLM — work exactly this way: <b>self-attention looks at how everything relates to everything else</b>, not in sequence. The most important tools right now are built on non-linear reasoning. Figuring out how to make that accessible is the actual problem worth solving.",
      "No wireframe yet. Still need to understand semantic graphing and vector databases from the ground up before the execution makes any sense.",
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

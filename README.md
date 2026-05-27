# atlau.vercel.app

Source for my portfolio site. Live at [atlau.vercel.app](https://atlau.vercel.app).

The site is the long-form version of my resume. It exists to show **how I think through a problem**, not just what I shipped — what I tried first, what failed, what I'd do differently. Each project page is written like a field journal: the context, the wrong turns, the decision that actually moved it forward.

## Why this exists

A resume can tell you I worked on something. It can't tell you whether the project succeeded because of me or in spite of me. This site tries to make that visible — by keeping the failures, the tradeoffs, and the uncertainty in view instead of flattening everything into outcomes.

## Tech

- **Next.js 16** (App Router, View Transitions) + **React 19**
- **TypeScript**, **Tailwind v4**, **shadcn/ui**, **Base UI**
- **Framer Motion** + **d3-force** for the hero network animation
- **MDX** for long-form project writing
- Deployed on **Vercel**

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## What's worth looking at

If you're poking around the repo and want the interesting parts:

- [`components/hero/`](components/hero) — WebGL2 particle field that resolves a chaotic point cloud into a coherent network ("The Graph Settles")
- [`components/project/`](components/project) — project page composition: shared `ViewTransition` morphs the card title into the hero title between routes
- [`lib/projects/`](lib/projects) — content layer for each project (Malloy, LMU, vibe coding work)
- [`DESIGN.md`](DESIGN.md), [`CODEBASE.md`](CODEBASE.md), [`HERO_HANDOFF.md`](HERO_HANDOFF.md) — design system, architecture map, and a handoff note for the hero animation

## Honest disclosure

I'm a non-engineer by background — analytics, consulting, BD. This site is one of the first real things I built. I worked closely with coding agents as a pair-programmer, and I think the slope of the learning curve is part of the story rather than something to hide. The design decisions, the writing, and the iteration are mine.

— Andrew

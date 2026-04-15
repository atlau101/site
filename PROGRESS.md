# Portfolio Site — Progress Tracker

**Stack:** Next.js 16 · TypeScript · Tailwind · Framer Motion · d3-force · shadcn/ui  
**Deploy target:** TBD  
**Last updated:** 2026-04-15

---

## Current State

The site lives in `site/`. The homepage scaffold is complete with real project data wired in. The hero renders a vanilla JS canvas animation (`hero-canvas.js`) via `components/hero/Hero.tsx`, which is wired into `app/page.tsx`. `HeroPlaceholder.tsx` has been deleted. `BranchingGraph.tsx` still exists in the repo but is no longer active.

### What's built

| Area | Status | File(s) |
|------|--------|---------|
| Global layout, fonts | Done | `app/layout.tsx` |
| Navbar (sticky, scroll-aware) | Done | `components/sections/Nav.tsx` |
| Hero placeholder (orb + text) | Deleted | — |
| BranchingGraph animation | Retired (historical) | `components/hero/BranchingGraph.tsx` |
| hero-canvas.js — "Reveal the Signal" | Live on homepage | `components/hero/hero-canvas.js` |
| About strip | Done | `components/sections/AboutStrip.tsx` |
| Featured project cards (Tier 1 × 3) | Done | `components/sections/FeaturedCard.tsx` |
| Project grid (Tier 2 × 6) | Done | `components/sections/ProjectGrid.tsx` |
| Footer | Done | `components/sections/Footer.tsx` |
| Homepage wiring | Done | `app/page.tsx` |
| Design system master | Done | `design-system/andrew-lau-portfolio/MASTER.md` |
| Individual project pages | Not started | `app/projects/[slug]/` |

### Projects mapped

**Tier 1 (Featured Cards):** Malloy Group · B2B Sales Pipeline Analytics · AUGMENT  
**Tier 2 (Grid):** Fillmore Ecosystem · Uber India Analytics · Wildfire Proximity ML · LMU EMS Datathon · ChamberGPT · AI Investment Bubble

- Note: Featured should be: ChamberGPT, MG, Something data related. Placeholder maybe LMU.

---

## Hero — Design Decision Log

### What we tried: BranchingGraph (d3-force)

A living tree/garden metaphor. Project nodes grow as fruit from a root node ("Andrew Lau"), hang alive for a random lifespan, then prune and regrow near the root. Cursor creates "wind" that pushes nodes. Clicking a fruit navigates to that project page.

**Why it crashed your computer:** d3-force runs its own internal animation loop via `d3-timer` AND the component ran a `requestAnimationFrame` loop. Calling `sim.restart()` on every cursor tick re-launched d3's internal loop repeatedly, so you eventually had many loops running simultaneously.

**Fix applied (2026-04-13, round 1):** Simulation now runs stopped (`sim.stop()`). The RAF loop manually calls `sim.tick(1)` each frame. Cursor wind and node regrowth bump `.alpha()` instead of calling `.restart()`. Tab visibility pauses the RAF loop.

**Fix applied (2026-04-13, round 2 — full perf overhaul):** Despite round 1, the page still crashed the machine. Root causes found and fixed:
1. **Per-frame gradient allocation** — `createRadialGradient` was called for every node every frame (~1,000 obj/s → GC pressure). Now cached per radius bucket in a `Map`, cleared on resize.
2. **Full Retina backing store** — DPR now clamped to 1.5 (was native 2×), halving pixel area on Retina displays.
3. **Simulation never settled** — cursor wind path was re-pumping `sim.alpha()` every 3rd tick while the mouse was anywhere near a node, keeping the sim hot forever. Alpha is now bumped only on actual `mousemove` events. Regrowth bump lowered from 0.15 → 0.05.
4. **No offscreen pause** — added `IntersectionObserver`; RAF stops as soon as the hero scrolls off-screen.
5. **`visibilitychange` could resurrect dead loop** — `cancelled` flag is now permanent (cleanup-only). A separate `paused` flag handles tab-hide and IntersectionObserver. HMR/strict-mode can't resurrect a dead closure.
6. **Resize rebuilt the entire graph** — `onResize` now only recalculates canvas dimensions and re-centers the force, preserving node positions. No more 80-step sync solve on every resize.
7. **Mousemove hitTest on input thread** — raw coords are now stashed in a ref; `hitTest` runs once per frame inside `tick()`.
8. **RAF capped at 30fps** — halves per-frame CPU for a visual style that reads identically at 30fps.
9. **Deleted `HeroPlaceholder.tsx`** — was compiling an infinite `motion.div` loop on every HMR cycle.
10. **Removed `motion` npm package** — duplicate of `framer-motion`; both were in `package.json`.

### What replaced it: hero-canvas.js — "Reveal the Signal" (2026-04-14/15)

BranchingGraph was retired in favor of a lighter, more focused concept. The new hero is a vanilla JS HTML5 canvas animation that lives in `components/hero/hero-canvas.js`. `Hero.tsx` is unchanged — it still renders the same `hero-scatter-canvas` canvas element at 420px height.

**Core mechanic:** roughly 40 dots (28 on viewports under 768px) start in a "noisy" state — scattered, slowly drifting, blurry, gray-green (`#8A9E7A` at ~38% opacity) with varying radii. An invisible 240px-wide vertical reveal window follows the cursor X position. Dots inside the window lerp toward fixed "signal" positions (an upward-trending scatter, bottom-left to top-right) using easeOutCubic over ~300ms. Dots in the center of the window snap fastest; edge dots snap slower via an `edgeFactor`. Dots outside the window return to noise state using easeInOutSine over 500ms.

Signal state: forest green `#2D5016`, full opacity, sharp (no blur), 4px radius. Noise state: rendered with `ctx.filter = "blur(2px)"` for a foggy feel.

**Auto-sweep:** when no cursor is active, the window drifts left-to-right over 6s (easeInOutSine, feels like breathing) and loops continuously. It pauses on the first `mousemove` and resumes 3s after `mouseleave`. Mobile tap holds the window at tap X for 1.5s then fades.

**Reduced motion:** no auto-sweep, no drift, instant snap/unsnap.

**Key implementation note:** noise drift velocity is multiplied by `(1 - t)` so dots stop drifting as they enter signal state. Without this, the moving noise baseline fights the lerp and produces visible jitter.

**Other changes in this session:**
- `app/page.tsx` — added `pt-16 sm:pt-20` to `<main>` to compensate for the fixed Navbar (`h-16`/`h-20`). Previously the hero canvas sat behind the nav bar.
- `Hero.tsx` — subtitle changed from `"Business Analyst · Designer · Experimenter"` to `"Problem Solver · Analyst · Tinkerer"`.

---

## Hero — What to Build Next

### The brief

The original prompt asked for a **Godly-quality homepage hero** that communicates three values: **Feedback · Growth · Experimentation**. Not problem-solving-as-a-trope. The emphasis is on someone who seeks out situations they aren't ready for, pays attention to where things break, and ships anyway.

The garden/tree metaphor from BranchingGraph is the right concept — it's not just decoration, it *is* the argument. Projects grow, get pruned, and regrow. That's the whole story.

---

### Hero concepts — brainstorm

#### Option A — Living Garden (current direction, evolved) ★ recommended

Keep the BranchingGraph but push it much further visually. Right now it's technically working but aesthetically underdeveloped. Godly-tier would mean:

- The canvas fills 100vh behind the text, not beside it
- Nodes feel hand-drawn — use a slight wobble/jitter on branch paths instead of clean curves, ink-bleed on the circles
- The root pulses like a heartbeat, not a static dot
- Branch thickness varies: thick near root, tapers to a hairline at the fruit
- Fruit have a subtle internal glow gradient that intensifies when alive
- The pruning animation should feel like a leaf falling, not just fading out (arc + fall physics before disappearing)
- On load: branches should grow outward from the root one by one with a drawing animation (SVG stroke-dashoffset or canvas path progress)
- Text overlays bottom-left corner of the canvas. The canvas itself is the "above-the-fold" experience.
- The three values (Feedback · Growth · Experimentation) emerge as faint ambient labels that drift around the canvas — not static, almost like pollen

**Why this works:** It literally demonstrates the values instead of stating them. The animation is the bio.

---

### Recommended next build: Option A (evolved)

The garden metaphor is already architecturally in place. The goal for the next session is to push BranchingGraph from "interesting prototype" to "Godly-quality" by addressing:

1. **Visual quality pass** — tapered branches, wobble paths, ink-texture circles
2. **Entrance sequence** — branches grow one-by-one on load (stroke draw animation)
3. **Value labels** — ambient drifting text ("Feedback" / "Growth" / "Experiment") at low opacity
4. **Root heartbeat** — subtle pulse on the root node
5. **Pruning physics** — falling arc before fade
6. **Hero text layout** — text lives inside the canvas section, not in a separate section. Bottom-left anchor.
7. **Wire it in** — replace `HeroPlaceholder` in `page.tsx`

---

## About Section

**Current:** `AboutStrip.tsx` — single paragraph, left-justified, serif font. Good bones.

**What to change:** The paragraph currently leads with "I put myself into situations I'm not ready for." This is solid. But it should more explicitly land on **feedback** and **growth** as intentional values — not just implied. Consider rewriting the first sentence to something like: *"Feedback is the best iteration tool just as experience is the most impactful teacher—ironic to say, but I aim to fail often and fail fast to learn quickly. I'm drawn to problems that sit just outside my comfort zone, where the learning curve is steep and the stakes are real."*

Consider splitting AboutStrip into two rows:

- Row 1: the paragraph (as is, slightly revised)
- Row 2: three mini-values with faint icons — **Feedback** · **Growth** · **Experimentation** — echoing the hero animation

---

## Project Pages

Not started. The route would be `app/projects/[slug]/page.tsx`.

### Proposed structure per project page

```
/projects/[slug]
├── Hero: project title + category + year (large, left-aligned)
├── Context strip: one-sentence framing of the problem
├── Process section: what happened — honest, not polished
├── Outcome section: what changed / what was learned
├── Reflection callout: "what I'd do differently"
├── Back arrow → homepage
```

Content for all 9 projects exists as raw notes in `drive-exports/`. Each project needs a write-up pass before the page can be built.

### Project content status

| Project | Raw notes | Write-up | Page built |
|---------|-----------|----------|------------|
| Malloy Group | Yes (`drive-exports/MALLOY GROUP/`) | No | No |
| B2B Sales Analytics | Yes (`drive-exports/BUS315/`) | No | No |
| AUGMENT | No (likely in Figma/Obsidian) | No | No |
| Fillmore Ecosystem | Yes (`drive-exports/BUSCAPSTONE/`) | No | No |
| Uber India Analytics | Yes (`drive-exports/BUS340/`) | No | No |
| Wildfire Proximity ML | Partial (`drive-exports/BUS411/`) | No | No |
| LMU EMS Datathon | Yes (`drive-exports/LMU-Datathon/`) | No | No |
| ChamberGPT | Yes (`drive-exports/SFCC/`) | No | No |
| AI Investment Bubble | Yes (`drive-exports/ECON350/`) | No | No |

---

## Known Issues / Bugs

| Issue | Status | File |
|-------|--------|------|
| BranchingGraph performance crash (gradient alloc, Retina DPR, non-settling sim, no offscreen pause) | Fixed 2026-04-13 (round 2) | `BranchingGraph.tsx` |
| BranchingGraph not wired to homepage | Moot — BranchingGraph retired | `app/page.tsx` |
| Hero canvas sitting behind fixed Navbar (no top padding on main) | Fixed 2026-04-15 — `pt-16 sm:pt-20` added to `<main>` | `app/page.tsx` |
| `HeroPlaceholder` was an unused infinite animation | Deleted | — |
| Design system master uses different color palette than actual code | Noted | `design-system/MASTER.md` uses #18181B; code uses #1F2A23 etc. Align before project pages. |

---

## Phase Plan

| Phase | What | Status |
|-------|------|--------|
| 1 | Homepage scaffold + real data | Done |
| 2 | BranchingGraph prototype | Done (fixed) |
| 3 | Hero visual quality pass — "Reveal the Signal" canvas | Done |
| 4 | About section revision | After Phase 3 |
| 5 | Project write-ups (9 projects) | Parallel / async |
| 6 | Project page template + first 3 builds | After write-ups |
| 7 | Remaining 6 project pages | After Phase 6 |
| 8 | Final polish, performance, deploy | Last |

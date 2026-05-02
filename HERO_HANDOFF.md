# Hero Handoff

## Files
- `site/components/hero/hero-entropy.js` — WebGL2 particle field + coherence-cycle state machine
- `site/components/hero/Hero.tsx` — React wrapper, pause button, text overlay markup

## Current State

The hero no longer uses the magnetic-board interaction.

Current interaction:
1. `entropy` — particles drift in a curl-noise field, CTA hidden
2. `signal` — after enough cursor movement, or after an ambient timeout, the full CTA resolves into view
3. `hold` — CTA stays fully readable for a short beat
4. `release` — text dissolves back out and particles return to drift

Layout was intentionally left alone. The hero still uses the same overlay structure in `Hero.tsx`.

## What Changed

The old handoff in this file was about:
- radial cursor mask reveal
- particle crystallization near the cursor
- preserving `maskRadius` logic

That is no longer the system.

The current hero is driven by a simpler state machine and a central tuning object:

```js
const COHERENCE_DIRECTION = {
  trigger: {
    interactionThreshold: 0.92,
    moveNormalizer: 170,
    ambientDelayMs: 6400,
    cooldownMs: 3000,
    energyDecayActive: 0.92,
    energyDecayIdle: 0.975,
  },
  timing: {
    revealMs: 880,
    holdMs: 1650,
    releaseMs: 1500,
  },
  text: {
    overlayOpacityPower: 0.86,
    headlineBlurPx: 18,
    headlineLiftPx: 20,
    auxDelay: 0.22,
    auxBlurPx: 10,
    auxLiftPx: 12,
  },
  particles: {
    pull: 0.15,
    releasePull: 0.08,
    stickRadius: 22,
    snapRadius: 7,
    snapLerp: 0.34,
    burstMin: 1.1,
    burstMax: 2.3,
    glowBoost: 0.85,
  },
};
```

This is the main place to retune the visual direction without rewriting the feature.

## Verified Behavior

Verified locally with Playwright on `http://localhost:3001`:
- hidden entropy at rest
- full CTA reveal after interaction
- smooth dissolve back into drifting particles

Touched-file lint also passed:

```bash
npx eslint components/hero/Hero.tsx components/hero/hero-entropy.js
```

## Current Problems

### 1. Particle collection around the CTA still looks bad

This is the main remaining issue.

The dots do not really trace the glyph shapes. They cluster loosely around sampled target points, so the reveal reads like:
- random green blobs around letters
- uneven density across the headline
- particles complementing the text poorly instead of reinforcing it

Root cause:
- the current system still samples text edge points from the rendered headline
- particles are assigned to those points in a coarse rank/order mapping
- there is no true per-glyph packing, path following, or outline-aware distribution

Result:
- particles gather “near” the letters
- they do not actually describe the letterforms convincingly

This is probably not a constants problem. It is probably a mechanic problem.

### 2. CTA hold time is too short

Current hold time is:

```js
holdMs: 1650
```

That is enough to confirm the effect works, but not enough to feel deliberate.

Immediate easy fix:
- increase `COHERENCE_DIRECTION.timing.holdMs`

Likely first values to test:
- `2200`
- `2600`
- `3000`

### 3. The reveal mechanic and the particle mechanic are still too coupled

The text reveal itself is fine.

The weak part is what the particles do during the reveal.

Right now the particles are being asked to do two jobs:
- support the CTA reveal
- visually describe the letters

They are not good enough at the second job, and that drags down the first.

## Recommendation

Do **not** spend much more time polishing the current “particles cluster around letter targets” behavior.

If particles need to remain part of the coherence moment, it is better to redesign their role.

## Best Next Direction

Most promising next direction:

### Particles shrink into the letters

This is the strongest idea on the table.

Instead of asking the particles to outline the glyphs, use them as a field that:
1. compresses toward the text region
2. shrinks and disappears into the letters
3. lets the actual CTA typography carry readability
4. releases back out into entropy afterward

Why this is better:
- particles no longer need perfect outline fidelity
- the typography can stay crisp and editorial
- the particles still feel causally related to the reveal
- the motion reads as “signal condensing” instead of “dots trying and failing to draw letters”

## If Pursuing The Shrink-Into-Letters Route

Recommended behavior:

### Entropy
- wide drifting field
- CTA hidden

### Signal
- particles in a broad band around the headline start converging toward the text block
- particle size tapers down as they approach the letters
- the text fades/resolves in as if the particles are feeding it
- particles should disappear before trying to visibly trace exact outlines

### Hold
- CTA fully visible
- only a small number of residual particles remain nearby
- avoid thick clustering directly on top of letter shapes

### Release
- text softens out
- particles re-emerge from the text block or from a narrow band around it
- the field loosens back into entropy

## Alternative Particle Roles

If the shrink-into-letters route does not feel right, these are the fallback options worth testing.

### Option A: Particles collapse into a text-shaped band, not the letters

Particles gather into the rectangular headline zone, not into glyph outlines.

Good:
- easier to make elegant
- preserves the “signal gathering” story

Bad:
- less magical
- weaker relationship to the actual typography

### Option B: Particles create a halo, then text appears cleanly on top

Particles brighten and tighten around the headline area, but never try to become the letters.

Good:
- safest visual result
- likely easiest to make beautiful

Bad:
- more atmospheric, less causally explicit

### Option C: Particles compress into a directional sweep through the CTA

Particles form a horizontal or diagonal compression wave through the text area, then release.

Good:
- strong motion language
- can feel editorial rather than gimmicky

Bad:
- less “particles become language”

## What I Would Not Do

- keep iterating on nearest-particle letter outlining
- increase particle density and hope it starts looking like typography
- make particles snap harder onto sampled text points
- add more local randomness to the current letter-clustering behavior

Those changes will probably make the effect noisier, not better.

## Easiest Next Tweaks

If the next pass is meant to be minimal before a bigger redesign:

1. Increase `holdMs`
2. Reduce visible particle density during `hold`
3. Reduce how many particles try to gather directly onto text targets
4. Let more of the reveal depend on text opacity/blur, less on particle-letter fidelity

That would improve the current effect, but it would still be a stopgap.

## Real Next Build Goal

If doing a proper next pass, the goal should be:

> Reassign particles from “draw the letters” to “feed the reveal.”

That is the cleanest conceptual fix.

## Do Not Touch

Unless the direction changes again:
- hero layout in `Hero.tsx`
- pause button behavior
- current text overlay structure

The problem is not the layout.

The problem is the particle role during the coherence moment.

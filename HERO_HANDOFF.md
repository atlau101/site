# Hero Canvas Handoff

## Files
- `site/components/hero/hero-entropy.js` — WebGL2 particle engine
- `site/components/hero/Hero.tsx` — React wrapper, text overlay ref

## How It Works (Current State)

**Canvas:** 2000 particles (600 mobile) drift in a curl-based flow field (noise). An auto-sweep attractor moves left→right every 9s creating a green cluster without user interaction.

**Cursor interaction:** Particles within 260px radius crystallize — grow from 3px to 10px, shift from ink-dark to forest green.

**Text reveal (mask mechanic):** The CTA text overlay starts hidden (opacity 0). When cursor enters the canvas, a radial CSS mask (`mask-image: radial-gradient(...)`) expands slowly around the cursor position (~3s to full radius of 340px). Text only becomes readable where the mask circle is. When cursor leaves, mask collapses over ~5s. This creates a "sweeping cursor reveals letters" effect.

## Design Intent
- Noise state: subtle drifting specks — barely noticeable, atmospheric
- Signal state: cursor crystallizes nearby particles into vivid green cluster
- Text reveal: text materializes only where cursor has swept — "find the signal"
- The contrast between noise and signal IS the interaction

## Current Problems

### 1. Particle noise too subtle
Base alpha `0.52` (last attempted fix) made noise particles too heavy and competed with text reveal. Reverted intent: noise should be subtle (~0.32 base alpha) but still perceptible as a field of drifting specks.

### 2. Particle pop when cursor is stationary
With `CALM_IN = 0.035` (current), crystallization is ~0.9s — good. But previously at `0.13` (~0.28s), particles would "pop" from 2px invisible dots to large green discs in a single blink when cursor held still. The slow lerp fix helped but broke the contrast.

### 3. Crystallized state not vivid enough
The gap between calm=0 and calm=1 needs to be sharper. Noise should be subtle; crystallized particles should be unmistakably green and large. The current state compresses this range.

## What Needs Fixing

1. **Noise particles:** Base alpha ~0.32, base size 2-3px. Should be visible as a subtle drifting field but not dominant.

2. **Crystallized particles:** At calm=1, alpha should reach 0.88-0.92, size 10-12px. The green should be vivid (`vec3(0.086, 0.275, 0.071)` or brighter). The contrast noise→signal should be dramatic.

3. **No pop:** `CALM_IN` should be slow enough (~0.05-0.07) that crystallization is a gradual bloom, not a snap. When cursor holds still over particles, they should slowly intensify green over ~0.5-0.7s.

4. **Mask reveal must stay intact:** Do not touch the `maskRadius` / `maskX` / `maskY` / `MASK_LERP_IN` / `MASK_LERP_OUT` logic. The CTA text reveal mechanic is working correctly.

## Key Constants (hero-entropy.js)

```js
const CALM_IN  = 0.035;   // lerp speed toward crystallized — tweak for pop fix
const CALM_OUT = 0.018;   // lerp speed back to chaos
const ATTRACT_R = 260;    // cursor influence radius in px
const REVEAL_R  = 340;    // mask circle radius at full reveal
const MASK_LERP_IN  = 0.006;  // DO NOT TOUCH
const MASK_LERP_OUT = 0.004;  // DO NOT TOUCH
```

## Fragment Shader Alpha (line ~33)
```glsl
float a = edge * (0.52 + v_calm * 0.40);
// Should be closer to:
float a = edge * (0.32 + v_calm * 0.58);
// noise: 0.32 alpha, crystallized: 0.90 alpha
```

## Vertex Shader Size (line ~15)
```glsl
gl_PointSize = (3.0 + a_calm * 7.0) * u_dpr;
// noise: 3px, crystallized: 10px — this range is probably fine
```

## Do Not Touch
- Mask reveal logic (maskRadius, maskX, maskY, MASK_LERP_*)
- Sweep attractor logic
- Entry burst animation
- Hero.tsx structure

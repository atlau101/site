/**
 * hero-canvas.js
 * "Reveal the Signal" hero animation — vanilla JS, zero dependencies.
 *
 * Usage:
 *   import { init } from "./hero-canvas.js";
 *   const destroy = init("hero-scatter-canvas");
 *   // later: destroy();
 */

// ─── Constants ────────────────────────────────────────────────────────────────

const TAU = Math.PI * 2;

// Blur sprite atlas — 6 pre-blurred noise dots at discrete radii.
// Filter runs ONCE at build time, not per frame.
const SPRITE_BUCKETS  = [2.5, 3.0, 3.5, 4.0, 4.5, 5.5];
const SPRITE_PAD      = 8;   // px padding around each dot (≥ 3× blur radius of 2px)
const SPRITE_BLUR     = 2;   // matches the visual look from ctx.filter = "blur(2px)"

// ─── Utilities ────────────────────────────────────────────────────────────────

function lerp(a, b, t) { return a + (b - a) * t; }

function easeOutCubic(t)    { return 1 - Math.pow(1 - t, 3); }
function easeInOutSine(t)   { return -(Math.cos(Math.PI * t) - 1) / 2; }

function gaussian() {
  let u1;
  do { u1 = Math.random(); } while (u1 === 0);
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(TAU * Math.random());
}

function rand(min, max) { return min + Math.random() * (max - min); }

function closestBucket(r) {
  let best = 0, bestDist = Infinity;
  for (let i = 0; i < SPRITE_BUCKETS.length; i++) {
    const d = Math.abs(SPRITE_BUCKETS[i] - r);
    if (d < bestDist) { bestDist = d; best = i; }
  }
  return best;
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function init(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return () => {};
  const ctx = canvas.getContext("2d");

  const H   = 420;
  const R   = 120;
  // Cap DPR at 2: on 3× phones this halves backing-store pixels with no visible loss.
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  // ─── Listener cleanup ────────────────────────────────────────────────────────
  const listeners = [];
  function addListener(el, type, fn, opts) {
    el.addEventListener(type, fn, opts);
    listeners.push({ el, type, fn, opts });
  }

  // ─── Reduced-motion ──────────────────────────────────────────────────────────
  const motionMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reducedMotion = motionMQ.matches;
  addListener(motionMQ, "change", (e) => { reducedMotion = e.matches; });

  // ─── BoundingClientRect cache ────────────────────────────────────────────────
  // Avoids layout read on every mousemove event.
  let canvasRect = { left: 0, top: 0 };
  function cacheRect() { canvasRect = canvas.getBoundingClientRect(); }

  // ─── Sprite atlas ────────────────────────────────────────────────────────────
  // Each cell is (maxRadius + SPRITE_PAD) × 2, so blur never clips.
  const maxR       = SPRITE_BUCKETS[SPRITE_BUCKETS.length - 1];
  const spriteSize = Math.ceil((maxR + SPRITE_PAD) * 2); // logical px per cell
  let atlas        = null;   // OffscreenCanvas | HTMLCanvasElement

  function buildAtlas() {
    const totalW = spriteSize * SPRITE_BUCKETS.length;
    const totalH = spriteSize;
    // Use OffscreenCanvas when available (no DOM overhead).
    atlas = (typeof OffscreenCanvas !== "undefined")
      ? new OffscreenCanvas(totalW * dpr, totalH * dpr)
      : Object.assign(document.createElement("canvas"), {
          width:  totalW * dpr,
          height: totalH * dpr,
        });

    const actx = atlas.getContext("2d");
    actx.scale(dpr, dpr);
    actx.clearRect(0, 0, totalW, totalH);
    actx.filter    = `blur(${SPRITE_BLUR}px)`;
    actx.fillStyle = "#8A9E7A";

    for (let i = 0; i < SPRITE_BUCKETS.length; i++) {
      const cx = i * spriteSize + spriteSize / 2;
      const cy = spriteSize / 2;
      actx.beginPath();
      actx.arc(cx, cy, SPRITE_BUCKETS[i], 0, TAU);
      actx.fill();
    }
    // Reset filter so future draws to the atlas context are unaffected.
    actx.filter = "none";
  }

  // ─── Canvas sizing ───────────────────────────────────────────────────────────
  let w = 0;
  function resize() {
    const newW = canvas.clientWidth;
    if (newW === 0) return;
    w = newW;
    canvas.width  = w * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    buildAtlas();          // rebuild at current DPR (called after scale)
    cacheRect();
    buildSignalPositions();
  }

  // ─── Dot data ────────────────────────────────────────────────────────────────
  let dots = [];
  const spriteHalf = spriteSize / 2;

  function buildSignalPositions() {
    const n = dots.length;
    if (n === 0 || w === 0) return;
    for (let i = 0; i < n; i++) {
      const baseX = (i + 0.5) * (w / n);
      const baseY = H - 40 - (baseX / w) * (H - 80);
      dots[i].signal.x = Math.min(Math.max(baseX + gaussian() * 20, 4), w - 4);
      dots[i].signal.y = Math.min(Math.max(baseY + gaussian() * 20, 4), H - 4);
    }
  }

  function seedDots() {
    const count = window.innerWidth < 768 ? 28 : 40;
    dots = [];
    for (let i = 0; i < count; i++) {
      const speed = rand(0.15, 0.35);
      const angle = Math.random() * TAU;
      const x     = rand(8, (w || 300) - 8);
      const y     = rand(8, H - 8);
      const noiseR = rand(2.5, 5.5);
      dots.push({
        noise:     { x, y, vx: speed * Math.cos(angle), vy: speed * Math.sin(angle) },
        signal:    { x, y },
        noiseR,
        spriteIdx: closestBucket(noiseR),
        p:  0,
        t:  0,
        cx: x,
        cy: y,
      });
    }
    buildSignalPositions();
  }

  // ─── Interaction state ───────────────────────────────────────────────────────
  let cursorActive  = false;
  let cursorX       = 0;
  let tapX          = 0;
  let tapHoldUntil  = 0;
  let resumeAt      = 0;
  let sweepProgress = 0;
  let driftScale    = 1;   // 1 = full drift, 0 = frozen; lerped on cursor enter/leave

  // ─── RAF bookkeeping ─────────────────────────────────────────────────────────
  let rafId = null;
  let lastT = null;

  // ─── Frame loop ──────────────────────────────────────────────────────────────
  function tick(timestamp) {
    rafId = requestAnimationFrame(tick);

    if (document.visibilityState !== "visible") {
      lastT = null;
      return;
    }

    const now = timestamp;
    const dt  = lastT === null ? 16 : Math.min(now - lastT, 33);
    lastT = now;

    // 1. Resolve window X
    let windowX = null;
    if (cursorActive) {
      windowX = cursorX;
    } else if (now < tapHoldUntil) {
      windowX = tapX;
    } else if (!reducedMotion && now >= resumeAt) {
      sweepProgress += dt / 6000;
      if (sweepProgress > 1) sweepProgress = 0;
      windowX = easeInOutSine(sweepProgress) * w;
    }

    const n = dots.length;

    // 2. Noise drift
    if (reducedMotion) { driftScale = 0; }
    if (!reducedMotion) {
      // Freeze/thaw driftScale: lerps to 0 when cursor is on canvas, back to 1 when it leaves.
      // Per-dot vx/vy are never zeroed — driftScale just scales their contribution each frame.
      const freezeRate = dt / 250;   // full freeze in ~250ms
      const thawRate   = dt / 400;   // full thaw  in ~400ms
      if (cursorActive) {
        driftScale = Math.max(0, driftScale - freezeRate);
      } else {
        driftScale = Math.min(1, driftScale + thawRate);
      }

      const scale = dt / 16;
      for (let i = 0; i < n; i++) {
        const d = dots[i];
        d.noise.x += d.noise.vx * scale * driftScale;
        d.noise.y += d.noise.vy * scale * driftScale;
        if (d.noise.x < 4)     { d.noise.x = 4;     d.noise.vx =  Math.abs(d.noise.vx); }
        if (d.noise.x > w - 4) { d.noise.x = w - 4; d.noise.vx = -Math.abs(d.noise.vx); }
        if (d.noise.y < 4)     { d.noise.y = 4;     d.noise.vy =  Math.abs(d.noise.vy); }
        if (d.noise.y > H - 4) { d.noise.y = H - 4; d.noise.vy = -Math.abs(d.noise.vy); }
      }
    }

    // 3. Transition progress + render position
    for (let i = 0; i < n; i++) {
      const d = dots[i];
      const dx     = windowX !== null ? Math.abs(d.cx - windowX) : Infinity;
      const inside = dx < R;

      if (reducedMotion) {
        d.p = inside ? 1 : 0;
        d.t = d.p;
      } else if (inside) {
        const edgeFactor = Math.max(1 - dx / R, 0.15);
        d.p = Math.min(1, d.p + dt / (300 / edgeFactor));
        d.t = easeOutCubic(d.p);
      } else {
        d.p = Math.max(0, d.p - dt / 500);
        d.t = easeInOutSine(d.p);
      }

      d.cx = lerp(d.noise.x, d.signal.x, d.t);
      d.cy = lerp(d.noise.y, d.signal.y, d.t);
    }

    // 4. Draw — background
    ctx.fillStyle = "#F5F0E8";
    ctx.fillRect(0, 0, w, H);

    // Pass A — noise dots via pre-blurred sprite atlas (no per-frame filter)
    for (let i = 0; i < n; i++) {
      const d = dots[i];
      if (d.t >= 0.99) continue;
      ctx.globalAlpha = (1 - d.t) * 0.38;
      ctx.drawImage(
        atlas,
        d.spriteIdx * spriteSize * dpr, 0,
        spriteSize * dpr, spriteSize * dpr,
        d.cx - spriteHalf, d.cy - spriteHalf,
        spriteSize, spriteSize
      );
    }

    // Pass B — signal dots: crisp, unfiltered arc
    ctx.fillStyle = "#2D5016";
    for (let i = 0; i < n; i++) {
      const d = dots[i];
      if (d.t <= 0.01) continue;
      ctx.globalAlpha = d.t;
      ctx.beginPath();
      ctx.arc(d.cx, d.cy, 4, 0, TAU);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
  }

  // ─── Event handlers ──────────────────────────────────────────────────────────
  function onMouseMove(e) {
    cursorX = e.clientX - canvasRect.left;
    cursorActive = true;
    resumeAt = Infinity;
  }

  function onMouseLeave() {
    cursorActive = false;
    resumeAt = performance.now() + 3000;
  }

  function onTouchStart(e) {
    e.preventDefault();
    tapX = e.touches[0].clientX - canvasRect.left;
    tapHoldUntil = performance.now() + 1500;
    sweepProgress = 0;
    resumeAt = tapHoldUntil;
  }

  let resizePending = false;
  function onResize() {
    if (resizePending) return;
    resizePending = true;
    requestAnimationFrame(() => {
      resizePending = false;
      resize();
    });
  }

  function onVisibilityChange() { lastT = null; }

  // ─── Init ─────────────────────────────────────────────────────────────────────
  canvas.style.height = H + "px";
  resize();   // sets w, DPR, builds atlas, caches rect
  seedDots();

  addListener(canvas,   "mousemove",        onMouseMove);
  addListener(canvas,   "mouseleave",       onMouseLeave);
  addListener(canvas,   "touchstart",       onTouchStart, { passive: false });
  addListener(window,   "resize",           onResize);
  addListener(window,   "scroll",           cacheRect, { passive: true });
  addListener(document, "visibilitychange", onVisibilityChange);

  rafId = requestAnimationFrame(tick);

  // ─── Cleanup ──────────────────────────────────────────────────────────────────
  return function destroy() {
    if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
    for (let i = 0; i < listeners.length; i++) {
      const { el, type, fn, opts } = listeners[i];
      el.removeEventListener(type, fn, opts);
    }
    listeners.length = 0;
  };
}

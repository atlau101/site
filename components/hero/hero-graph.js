// "The Graph Settles" — hero canvas
// Two-state lerp: nodes have chaos positions and order positions.
// Cursor proximity drives calmFactor (0=chaos, 1=order) per node.

// Easing
function easeInOutSine(t) {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

// Color helpers
const INK  = (a) => `rgba(27,28,26,${a.toFixed(3)})`;
const HUB  = (a) => `rgba(23,56,9,${a.toFixed(3)})`;

// Node data: [orderX, orderY, chaosX, chaosY, isHub]
// Order layout: left-inputs → middle-processing → right-hubs (convergent DAG)
// Chaos layout: nodes swapped to opposite sides to maximise edge crossings
const NODE_DATA = [
  // ── Left inputs (0-5) ──
  [0.18, 0.22,  0.58, 0.62,  false],
  [0.15, 0.42,  0.74, 0.22,  false],
  [0.20, 0.58,  0.48, 0.40,  false],
  [0.17, 0.76,  0.70, 0.78,  false],
  [0.25, 0.32,  0.62, 0.28,  false],
  [0.23, 0.65,  0.78, 0.56,  false],
  // ── Middle processing (6-10) ──
  [0.44, 0.20,  0.22, 0.72,  false],
  [0.46, 0.38,  0.36, 0.16,  false],
  [0.42, 0.55,  0.76, 0.48,  false],
  [0.48, 0.72,  0.18, 0.44,  false],
  [0.52, 0.30,  0.55, 0.76,  false],
  // ── Right hubs (11-13) ──
  [0.72, 0.32,  0.25, 0.28,  true],
  [0.70, 0.52,  0.42, 0.66,  true],
  [0.73, 0.70,  0.20, 0.54,  true],
  // ── Extra scatter (14-19) ──
  [0.32, 0.14,  0.65, 0.14,  false],
  [0.34, 0.82,  0.45, 0.86,  false],
  [0.60, 0.18,  0.28, 0.60,  false],
  [0.62, 0.80,  0.80, 0.32,  false],
  [0.80, 0.42,  0.38, 0.24,  false],
  [0.82, 0.60,  0.60, 0.70,  false],
];

const EDGE_PAIRS = [
  // Left → Middle
  [0,6],[0,7],[1,7],[1,8],[2,8],[2,9],[3,9],[4,6],[4,10],[5,8],[5,9],
  // Middle → Right hubs
  [6,11],[7,11],[7,12],[8,12],[9,13],[10,11],[10,12],
  // Hub interconnects
  [11,12],[12,13],
  // Extra → network
  [14,6],[15,9],[16,7],[17,10],[18,12],[19,13],
];

// Mobile: keep a representative subset
const MOBILE_SET = new Set([0,1,2,3,6,7,8,9,11,12,14,16,18]);

// Interaction constants
const CALM_RADIUS  = 240;  // px
const CALM_SPEED   = 0.09; // lerp rate toward calm (per frame ~60fps)
const CHAOS_SPEED  = 0.035; // lerp rate returning to chaos
const SWEEP_MS     = 8000; // ms per sweep direction
const TAP_HOLD_MS  = 1800;
const RESUME_DELAY = 3000;

export function init(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!(canvas instanceof HTMLCanvasElement)) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const prefersReducedMotion =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth < 768;

  // ── Active node/edge subset ──────────────────────────────────────────────
  const activeSet = isMobile ? MOBILE_SET : new Set(NODE_DATA.map((_, i) => i));
  const activeEdges = EDGE_PAIRS.filter(
    ([f, t]) => activeSet.has(f) && activeSet.has(t)
  );

  // ── Canvas sizing ────────────────────────────────────────────────────────
  let dpr = 1, W = 0, H = 0;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = canvas.getBoundingClientRect();
    W = r.width;
    H = r.height;
    canvas.width  = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();

  // ── Build node objects ───────────────────────────────────────────────────
  const nodes = [...activeSet].map(i => {
    const [ox, oy, cx, cy, isHub] = NODE_DATA[i];
    return { id: i, isHub, ox, oy, cx, cy, x: cx * W, y: cy * H, calm: 0 };
  });

  // Index map: original id → nodes array index
  const idMap = new Map(nodes.map((n, i) => [n.id, i]));

  const edges = activeEdges
    .filter(([f, t]) => idMap.has(f) && idMap.has(t))
    .map(([f, t]) => [idMap.get(f), idMap.get(t)]);

  // ── Cursor / sweep state ─────────────────────────────────────────────────
  let curX = -9999, curY = -9999, hasCursor = false;
  let sweepPaused = false, sweepStart = Date.now();
  let resumeTimer = null, tapTimer = null;

  function sweepPos() {
    const elapsed = (Date.now() - sweepStart) % (SWEEP_MS * 2);
    const raw = elapsed / SWEEP_MS;                  // 0..2
    const ping = raw <= 1 ? raw : 2 - raw;           // 0..1..0
    const x = (easeInOutSine(ping) * (W + CALM_RADIUS * 2)) - CALM_RADIUS;
    return { x, y: H * 0.48 };
  }

  // ── RAF control ──────────────────────────────────────────────────────────
  let rafId = null, isVisible = true, isInView = true;

  function frame() {
    rafId = requestAnimationFrame(frame);
    if (!isVisible || !isInView) return;

    ctx.clearRect(0, 0, W, H);

    // Effective cursor
    let ex, ey, active;
    if (hasCursor) {
      ex = curX; ey = curY; active = true;
    } else if (!sweepPaused && !prefersReducedMotion) {
      const s = sweepPos();
      ex = s.x; ey = s.y; active = true;
    } else {
      ex = -9999; ey = -9999; active = false;
    }

    // Update each node
    for (const n of nodes) {
      const dx = n.x - ex, dy = n.y - ey;
      const dist = Math.sqrt(dx * dx + dy * dy);
      let target = active ? Math.max(0, 1 - dist / CALM_RADIUS) : 0;
      target *= target; // square for tighter central calm zone

      const speed = target > n.calm ? CALM_SPEED : CHAOS_SPEED;
      n.calm = prefersReducedMotion
        ? target
        : n.calm + (target - n.calm) * speed;

      n.x = (n.cx + (n.ox - n.cx) * n.calm) * W;
      n.y = (n.cy + (n.oy - n.cy) * n.calm) * H;
    }

    // Draw edges
    for (const [fi, ti] of edges) {
      const f = nodes[fi], t = nodes[ti];
      const avg = (f.calm + t.calm) * 0.5;
      ctx.beginPath();
      ctx.strokeStyle = INK(0.10 + avg * 0.46);
      ctx.lineWidth   = 0.5 + avg * 0.4;
      ctx.moveTo(f.x, f.y);
      ctx.lineTo(t.x, t.y);
      ctx.stroke();
    }

    // Draw nodes
    for (const n of nodes) {
      const a = 0.18 + n.calm * 0.65;
      const r = 2.5  + n.calm * 1.8;
      ctx.beginPath();
      ctx.fillStyle = (n.isHub && n.calm > 0.25) ? HUB(a) : INK(a);
      ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // ── Event handlers ───────────────────────────────────────────────────────
  const section = canvas.parentElement;

  function onMouseMove(e) {
    const r = canvas.getBoundingClientRect();
    curX = e.clientX - r.left;
    curY = e.clientY - r.top;
    hasCursor = true;
    sweepPaused = true;
    clearTimeout(resumeTimer);
  }

  function onMouseLeave() {
    hasCursor = false;
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => {
      sweepPaused = false;
      sweepStart = Date.now();
    }, RESUME_DELAY);
  }

  function onTouchStart(e) {
    const touch = e.touches[0];
    const r = canvas.getBoundingClientRect();
    curX = touch.clientX - r.left;
    curY = touch.clientY - r.top;
    hasCursor = true;
    sweepPaused = true;
    clearTimeout(tapTimer);
    tapTimer = setTimeout(() => { hasCursor = false; }, TAP_HOLD_MS);
  }

  let resizeTimer = null;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      for (const n of nodes) {
        n.x = (n.cx + (n.ox - n.cx) * n.calm) * W;
        n.y = (n.cy + (n.oy - n.cy) * n.calm) * H;
      }
    }, 100);
  }

  function onVisibilityChange() {
    isVisible = !document.hidden;
  }

  // IntersectionObserver — pause RAF when section scrolled off screen
  let observer = null;
  if (section && 'IntersectionObserver' in window) {
    observer = new IntersectionObserver(
      ([entry]) => { isInView = entry.isIntersecting; },
      { threshold: 0 }
    );
    observer.observe(section);
  }

  section?.addEventListener('mousemove', onMouseMove);
  section?.addEventListener('mouseleave', onMouseLeave);
  section?.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('resize', onResize);
  document.addEventListener('visibilitychange', onVisibilityChange);

  rafId = requestAnimationFrame(frame);

  // ── Cleanup ──────────────────────────────────────────────────────────────
  return function destroy() {
    cancelAnimationFrame(rafId);
    observer?.disconnect();
    clearTimeout(resumeTimer);
    clearTimeout(tapTimer);
    clearTimeout(resizeTimer);
    section?.removeEventListener('mousemove', onMouseMove);
    section?.removeEventListener('mouseleave', onMouseLeave);
    section?.removeEventListener('touchstart', onTouchStart);
    window.removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', onVisibilityChange);
  };
}

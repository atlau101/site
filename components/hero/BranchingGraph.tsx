"use client";

import React, { useRef, useEffect, useCallback } from "react";
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
  type SimulationNodeDatum,
  type SimulationLinkDatum,
} from "d3-force";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProjectNode extends SimulationNodeDatum {
  id: string;
  label: string;
  href: string;
  r: number;
  life: number;
  state: "dormant" | "growing" | "alive" | "pruning" | "pruned";
  parentId?: string;
  age: number;
  isRoot?: boolean;
  category?: string;
  introDelay: number;
  fallVx: number;
  fallVy: number;
  fallActive: boolean;
}

interface GraphLink extends SimulationLinkDatum<ProjectNode> {
  opacity: number;
  drawProgress: number;
  wobbleOffX: number;
  wobbleOffY: number;
  wobbleSeed: number;
}

interface ValueLabel {
  text: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  phase: number;
}

// ─── Palette ──────────────────────────────────────────────────────────────────

const P = {
  bg:        "#F7F3EC",
  branch:    "#6B8A66",
  branchDk:  "#3E5641",
  fruit:     "#C97B4A",
  fruitWarm: "#E2B25A",
  ink:       "#1F2A23",
  muted:     "#4A5C4E",
  labelBg:   "rgba(247,243,236,0.92)",
};

// ─── Static data ──────────────────────────────────────────────────────────────

const PROJECTS = [
  { id: "malloy",    label: "Malloy Group",        href: "/projects/malloy-group",       category: "Consulting" },
  { id: "bus315",    label: "B2B Sales Analytics", href: "/projects/bus315-data-mining", category: "Data Mining" },
  { id: "augment",   label: "AUGMENT",              href: "/projects/augment",            category: "UX Design"  },
  { id: "fillmore",  label: "Fillmore",             href: "/projects/fillmore",           category: "Research"   },
  { id: "uber",      label: "Uber Analytics",       href: "/projects/uber-analytics",     category: "Tableau"    },
  { id: "wildfire",  label: "Wildfire ML",          href: "/projects/wildfire-ml",        category: "ML"         },
  { id: "lmu",       label: "LMU Datathon",         href: "/projects/lmu-datathon",       category: "Analytics"  },
  { id: "chamber",   label: "ChamberGPT",           href: "/projects/chambergpt",         category: "AI"         },
  { id: "ai-bubble", label: "AI Bubble",            href: "/projects/ai-bubble",          category: "Economics"  },
];

// ─── Constants ────────────────────────────────────────────────────────────────

const GROWTH_TICKS  = 80;
const ALIVE_MIN     = 500;
const ALIVE_MAX     = 1000;
const PRUNE_TICKS   = 100;
const PRUNED_WAIT   = 150;
const INTRO_STAGGER = 35;
const TARGET_FPS    = 30;
const FRAME_MS      = 1000 / TARGET_FPS; // ~33 ms per frame

// ─── Helper ───────────────────────────────────────────────────────────────────

/**
 * Draw the first `progress` fraction of a quadratic bezier using De Casteljau.
 * Caller must call ctx.beginPath() before this.
 */
function partialQuad(
  ctx: CanvasRenderingContext2D,
  x0: number, y0: number,
  cpx: number, cpy: number,
  x1: number, y1: number,
  progress: number,
) {
  if (progress <= 0) return;
  ctx.moveTo(x0, y0);
  if (progress >= 1) { ctx.quadraticCurveTo(cpx, cpy, x1, y1); return; }
  const p  = progress;
  const ax = x0  + (cpx - x0)  * p;
  const ay = y0  + (cpy - y0)  * p;
  const bx = cpx + (x1  - cpx) * p;
  const by = cpy + (y1  - cpy) * p;
  ctx.quadraticCurveTo(ax, ay, ax + (bx - ax) * p, ay + (by - ay) * p);
}

// ─── Component ────────────────────────────────────────────────────────────────

export interface BranchingGraphProps {
  className?: string;
}

export function BranchingGraph({ className }: BranchingGraphProps) {
  const canvasRef      = useRef<HTMLCanvasElement>(null);
  const router         = useRouter();
  const routerRef      = useRef(router);
  useEffect(() => { routerRef.current = router; });
  const nodesRef       = useRef<ProjectNode[]>([]);
  const linksRef       = useRef<GraphLink[]>([]);
  const labelsRef      = useRef<ValueLabel[]>([]);
  const simRef         = useRef<ReturnType<typeof forceSimulation<ProjectNode, GraphLink>> | null>(null);
  // Raw client coords updated in onMouseMove; hitTest runs inside tick()
  const rawMouseRef    = useRef<{ x: number; y: number } | null>(null);
  const mouseRef       = useRef<{ x: number; y: number } | null>(null);
  const hoveredRef     = useRef<ProjectNode | null>(null);
  const rafRef         = useRef<number>(0);
  const tickRef        = useRef<number>(0);
  const lastFrameRef   = useRef<number>(0);
  const reducedMotion  = useRef(false);
  // Gradient cache: keyed by rounded radius (r), cleared on resize
  const gradCacheRef   = useRef<Map<number, CanvasGradient>>(new Map());
  const glowCacheRef   = useRef<Map<number, CanvasGradient>>(new Map());

  // ── Build graph ─────────────────────────────────────────────────────────────

  const buildGraph = useCallback((w: number, h: number) => {
    const root: ProjectNode = {
      id: "root", label: "Andrew Lau", href: "/",
      r: 6, life: 1, state: "alive", age: 999, isRoot: true,
      x: w / 2, y: h * 0.74,
      introDelay: 0, fallVx: 0, fallVy: 0, fallActive: false,
    };

    const nodes: ProjectNode[] = PROJECTS.map((p, i) => ({
      ...p,
      r: 10 + Math.random() * 6,
      life: 0, state: "dormant" as const, age: 0,
      x: root.x! + (Math.random() - 0.5) * 30,
      y: root.y! + (Math.random() - 0.5) * 30,
      parentId: "root",
      introDelay: i * INTRO_STAGGER,
      fallVx: 0, fallVy: 0, fallActive: false,
    }));

    const all = [root, ...nodes];
    const links: GraphLink[] = nodes.map((n) => ({
      source: "root",
      target: n.id,
      opacity: 0,
      drawProgress: 0,
      wobbleOffX: (Math.random() - 0.5) * 90,
      wobbleOffY: (Math.random() - 0.5) * 30 - 15,
      wobbleSeed: Math.random() * Math.PI * 2,
    }));

    nodesRef.current  = all;
    linksRef.current  = links;

    labelsRef.current = [
      { text: "Feedback",   x: w * 0.14, y: h * 0.22, vx:  0.13, vy:  0.07, phase: 0   },
      { text: "Growth",     x: w * 0.76, y: h * 0.18, vx: -0.10, vy:  0.09, phase: 2.1 },
      { text: "Experiment", x: w * 0.58, y: h * 0.73, vx:  0.08, vy: -0.06, phase: 4.2 },
    ];

    const sim = forceSimulation<ProjectNode, GraphLink>(all)
      .force("link",    forceLink<ProjectNode, GraphLink>(links)
        .id((d) => d.id).distance(165).strength(0.25))
      .force("charge",  forceManyBody().strength(-110))
      .force("center",  forceCenter(w / 2, h * 0.38))
      .force("collide", forceCollide<ProjectNode>((d) => d.r + 22).strength(0.5))
      .alphaDecay(0.012)
      .velocityDecay(0.65)
      .stop(); // RAF loop ticks manually — no d3 internal timer

    simRef.current = sim;
    sim.tick(80); // pre-warm so nodes don't pile at origin on first frame
  }, []);

  // ── Lifecycle state machine ─────────────────────────────────────────────────

  const tickLifecycle = useCallback(() => {
    nodesRef.current.forEach((node) => {
      if (node.isRoot) return;
      node.age++;

      if (node.state === "dormant") {
        if (tickRef.current >= node.introDelay) { node.state = "growing"; node.age = 0; }
        return;
      }

      if (node.state === "growing") {
        node.life = Math.min(1, node.life + 1 / GROWTH_TICKS);
        linksRef.current.forEach((l) => {
          const tid = typeof l.target === "object" ? (l.target as ProjectNode).id : l.target;
          if (tid === node.id) l.drawProgress = node.life;
        });
        if (node.life >= 1) {
          node.state = "alive"; node.age = 0;
          linksRef.current.forEach((l) => {
            const tid = typeof l.target === "object" ? (l.target as ProjectNode).id : l.target;
            if (tid === node.id) { l.opacity = 1; l.drawProgress = 1; }
          });
        }

      } else if (node.state === "alive") {
        const lifespan = ALIVE_MIN + Math.random() * (ALIVE_MAX - ALIVE_MIN);
        if (node.age > lifespan) {
          node.state = "pruning"; node.age = 0;
          node.fallVx = (Math.random() - 0.5) * 1.8;
          node.fallVy = -0.6;
          node.fallActive = true;
        }

      } else if (node.state === "pruning") {
        node.life = Math.max(0, node.life - 1 / PRUNE_TICKS);
        if (node.fallActive) {
          node.fallVy    += 0.09; // gravity
          node.x          = (node.x ?? 0) + node.fallVx;
          node.y          = (node.y ?? 0) + node.fallVy;
        }
        linksRef.current.forEach((l) => {
          const tid = typeof l.target === "object" ? (l.target as ProjectNode).id : l.target;
          if (tid === node.id) { l.opacity = node.life; l.drawProgress = node.life; }
        });
        if (node.life <= 0) { node.state = "pruned"; node.age = 0; node.fallActive = false; }

      } else if (node.state === "pruned") {
        if (node.age > PRUNED_WAIT) {
          const root   = nodesRef.current.find((n) => n.isRoot)!;
          node.x       = root.x! + (Math.random() - 0.5) * 50;
          node.y       = root.y! + (Math.random() - 0.5) * 50;
          node.vx      = 0; node.vy = 0;
          node.life    = 0; node.state = "growing"; node.age = 0;
          node.fallVx  = 0; node.fallVy = 0; node.fallActive = false;
          // Small alpha bump so d3 spreads the regrowing node. 0.05 decays quickly.
          simRef.current?.alpha(Math.max(simRef.current.alpha(), 0.05));
        }
      }
    });
  }, []);

  // ── Value label drift ───────────────────────────────────────────────────────

  const tickLabels = useCallback((w: number, h: number) => {
    labelsRef.current.forEach((lb) => {
      lb.x += lb.vx;
      lb.y += lb.vy;
      if (lb.x < 50  || lb.x > w - 120) lb.vx *= -1;
      if (lb.y < 30  || lb.y > h - 30)  lb.vy *= -1;
    });
  }, []);

  // ── Cursor wind ─────────────────────────────────────────────────────────────

  const applyCursorWind = useCallback(() => {
    if (!mouseRef.current) return;
    const { x: mx, y: my } = mouseRef.current;
    nodesRef.current.forEach((node) => {
      if (node.isRoot || node.state === "pruned" || node.state === "dormant") return;
      const dx   = (node.x ?? 0) - mx;
      const dy   = (node.y ?? 0) - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 130 && dist > 0) {
        const f = (1 - dist / 130) * 0.5;
        node.vx = (node.vx ?? 0) + (dx / dist) * f;
        node.vy = (node.vy ?? 0) + (dy / dist) * f;
        // No alpha pump here — vx/vy injection is sufficient for visible wind.
        // Alpha is only bumped on actual mouse movement (see onMouseMove handler).
      }
    });
  }, []);

  // ── Draw ─────────────────────────────────────────────────────────────────────

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W    = canvas.offsetWidth;
    const H    = canvas.offsetHeight;
    const tick = tickRef.current;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = P.bg;
    ctx.fillRect(0, 0, W, H);

    // ── Ambient value labels ─────────────────────────────────────────────────
    ctx.save();
    ctx.font = "300 12px var(--font-inter, system-ui)";
    (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "0.16em";
    labelsRef.current.forEach((lb) => {
      ctx.globalAlpha = 0.10 + 0.05 * Math.sin(tick * 0.018 + lb.phase);
      ctx.fillStyle   = P.muted;
      ctx.fillText(lb.text.toUpperCase(), lb.x, lb.y);
    });
    ctx.restore();

    // ── Branches ─────────────────────────────────────────────────────────────
    linksRef.current.forEach((link) => {
      const s = link.source as ProjectNode;
      const t = link.target as ProjectNode;
      if (!s.x || !t.x || link.drawProgress <= 0) return;

      const wob = tick * 0.009;
      const cpx = (s.x + t.x) / 2
                + link.wobbleOffX * 0.35 * Math.sin(wob       + link.wobbleSeed);
      const cpy = (s.y! + t.y!) / 2 - 25
                + link.wobbleOffY * 0.35 * Math.cos(wob * 1.2 + link.wobbleSeed);
      const prog = link.drawProgress;

      ctx.save();
      ctx.lineCap = "round";

      // Thick dark pass — gives trunk weight near root
      ctx.globalAlpha = prog * 0.28;
      ctx.strokeStyle = P.branchDk;
      ctx.lineWidth   = 2.8;
      ctx.beginPath();
      partialQuad(ctx, s.x, s.y!, cpx, cpy, t.x, t.y!, prog);
      ctx.stroke();

      // Thin green pass — the main visible branch
      ctx.globalAlpha = prog * 0.62;
      ctx.strokeStyle = P.branch;
      ctx.lineWidth   = 1;
      ctx.beginPath();
      partialQuad(ctx, s.x, s.y!, cpx, cpy, t.x, t.y!, prog);
      ctx.stroke();

      ctx.restore();
    });

    // ── Nodes ────────────────────────────────────────────────────────────────
    nodesRef.current.forEach((node) => {
      if (!node.x || node.state === "pruned" || node.state === "dormant") return;
      const alpha   = node.isRoot ? 1 : node.life;
      const hovered = hoveredRef.current?.id === node.id;
      if (alpha <= 0) return;

      ctx.save();

      if (node.isRoot) {
        // Heartbeat: pulse radius + fading outer ring
        const beat     = 1 + 0.28 * Math.abs(Math.sin(tick * 0.055));
        const r        = 5 * beat;
        const ringFade = 0.25 * (1 - Math.abs(Math.sin(tick * 0.055)));

        ctx.globalAlpha = ringFade;
        ctx.strokeStyle = P.branch;
        ctx.lineWidth   = 1.2;
        ctx.beginPath();
        ctx.arc(node.x, node.y!, r * 2.8, 0, Math.PI * 2);
        ctx.stroke();

        ctx.globalAlpha = 1;
        ctx.fillStyle   = P.branchDk;
        ctx.beginPath();
        ctx.arc(node.x, node.y!, r, 0, Math.PI * 2);
        ctx.fill();

      } else {
        ctx.globalAlpha = alpha;
        const r = node.r * node.life * (hovered ? 1.15 : 1);

        // Hover glow — cached per radius bucket
        if (hovered) {
          const rk = Math.round(r * 10); // bucket key (sub-pixel resolution)
          let g = glowCacheRef.current.get(rk);
          if (!g) {
            g = ctx.createRadialGradient(node.x, node.y!, r * 0.5, node.x, node.y!, r * 2.8);
            g.addColorStop(0, `${P.fruit}35`);
            g.addColorStop(1, "transparent");
            glowCacheRef.current.set(rk, g);
          }
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(node.x, node.y!, r * 2.8, 0, Math.PI * 2);
          ctx.fill();
        }

        // Fruit body — cached per radius bucket
        const rk = Math.round(r * 10);
        let fg = gradCacheRef.current.get(rk);
        if (!fg) {
          fg = ctx.createRadialGradient(
            node.x - r * 0.25, node.y! - r * 0.25, r * 0.05,
            node.x,             node.y!,             r,
          );
          fg.addColorStop(0, P.fruitWarm);
          fg.addColorStop(1, P.fruit);
          gradCacheRef.current.set(rk, fg);
        }
        ctx.fillStyle   = fg;
        ctx.beginPath();
        ctx.arc(node.x, node.y!, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = P.branchDk;
        ctx.lineWidth   = 0.8;
        ctx.stroke();

        // Hover label tooltip
        if (hovered && node.life > 0.8) {
          ctx.globalAlpha = 1;
          const lbl  = node.label;
          const cat  = node.category ?? "";
          const padX = 12, padY = 8, fS = 13, cS = 11;

          ctx.font = `500 ${fS}px var(--font-inter, system-ui)`;
          const lw  = ctx.measureText(lbl).width;
          ctx.font = `400 ${cS}px var(--font-inter, system-ui)`;
          const cw  = ctx.measureText(cat).width;

          const bw = Math.max(lw, cw) + padX * 2;
          const bh = fS + cS + padY * 2 + 4;
          let lx   = node.x + r + 8;
          let ly   = node.y! - bh / 2;
          if (lx + bw > W - 16) lx = node.x - r - 8 - bw;
          if (ly < 8)            ly = 8;
          if (ly + bh > H - 8)   ly = H - bh - 8;

          const br = 8;
          ctx.fillStyle = P.labelBg;
          ctx.beginPath();
          ctx.moveTo(lx + br, ly);
          ctx.lineTo(lx + bw - br, ly);
          ctx.arcTo(lx + bw, ly,      lx + bw, ly + br,      br);
          ctx.lineTo(lx + bw, ly + bh - br);
          ctx.arcTo(lx + bw, ly + bh, lx + bw - br, ly + bh, br);
          ctx.lineTo(lx + br, ly + bh);
          ctx.arcTo(lx, ly + bh,      lx, ly + bh - br,       br);
          ctx.lineTo(lx, ly + br);
          ctx.arcTo(lx, ly,           lx + br, ly,             br);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = `${P.fruit}55`;
          ctx.lineWidth   = 1;
          ctx.stroke();

          ctx.fillStyle = P.ink;
          ctx.font      = `500 ${fS}px var(--font-inter, system-ui)`;
          ctx.fillText(lbl, lx + padX, ly + padY + fS - 2);
          ctx.fillStyle = P.muted;
          ctx.font      = `400 ${cS}px var(--font-inter, system-ui)`;
          ctx.fillText(cat, lx + padX, ly + padY + fS + 4 + cS - 2);
        }
      }

      ctx.restore();
    });
  }, []);

  // ── Hit test ─────────────────────────────────────────────────────────────────

  const hitTest = useCallback((cx: number, cy: number): ProjectNode | null => {
    for (const node of nodesRef.current) {
      if (node.isRoot || node.state === "pruned" || node.state === "dormant" || node.life < 0.5) continue;
      const dx = (node.x ?? 0) - cx;
      const dy = (node.y ?? 0) - cy;
      if (Math.sqrt(dx * dx + dy * dy) <= node.r * node.life + 12) return node;
    }
    return null;
  }, []);

  // ── Resize ───────────────────────────────────────────────────────────────────

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Cap DPR at 1.5 — visually identical for this ink-style drawing, halves
    // backing-store area on Retina displays (2× → 1.5× = ~44% fewer pixels).
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w   = canvas.offsetWidth;
    const h   = canvas.offsetHeight;
    canvas.width  = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext("2d")!;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    // Gradient objects are position-absolute, so they're invalid after resize.
    gradCacheRef.current.clear();
    glowCacheRef.current.clear();
  }, []);

  // ── Mount ────────────────────────────────────────────────────────────────────

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = canvasRef.current!;

    // ── Cancellation / pause flags ──────────────────────────────────────────
    // `cancelled` flips true ONLY in cleanup — once true, never reset.
    //   → kills the RAF chain permanently; guards against HMR/strict-mode resurrection.
    // `paused` toggles on tab-hidden and IntersectionObserver offscreen — safe to flip.
    let cancelled  = false;
    let paused     = false;
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;

    const schedule = () => {
      if (cancelled || paused) return;
      rafRef.current = requestAnimationFrame(tick);
    };

    const tick = (now: number) => {
      if (cancelled || paused) return;
      const cvs = canvasRef.current;
      if (!cvs) { schedule(); return; }

      // ── 30 fps cap ────────────────────────────────────────────────────────
      if (now - lastFrameRef.current < FRAME_MS) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      lastFrameRef.current = now;

      tickRef.current++;

      // ── Throttled mousemove processing ────────────────────────────────────
      // rawMouseRef is written on every native mousemove; we consume it here
      // (once per frame at 30fps) to keep hitTest off the input thread.
      if (rawMouseRef.current) {
        const rect = cvs.getBoundingClientRect();
        const pos  = {
          x: rawMouseRef.current.x - rect.left,
          y: rawMouseRef.current.y - rect.top,
        };
        mouseRef.current   = pos;
        const hit          = hitTest(pos.x, pos.y);
        const changed      = hit?.id !== hoveredRef.current?.id;
        hoveredRef.current = hit;
        cvs.style.cursor   = hit ? "pointer" : "default";
        if (changed) {
          // Redraw immediately on hover change so tooltip appears/disappears responsively
        }
      }

      // Manually step d3 (no internal d3-timer running)
      const sim = simRef.current;
      if (sim && sim.alpha() > sim.alphaMin()) sim.tick(1);

      if (tickRef.current % 2 === 0) tickLifecycle();
      if (tickRef.current % 3 === 0) applyCursorWind();
      if (tickRef.current % 5 === 0) tickLabels(cvs.offsetWidth, cvs.offsetHeight);

      draw();
      schedule();
    };

    resize();
    buildGraph(canvas.offsetWidth, canvas.offsetHeight);

    // ── Tab visibility — uses `paused`, NOT `cancelled` ─────────────────────
    const onVisChange = () => {
      if (document.hidden) {
        paused = true;
        cancelAnimationFrame(rafRef.current);
      } else {
        paused = false;
        schedule();
      }
    };

    // ── IntersectionObserver — pause when hero is off-screen ─────────────────
    // This stops the 60fps (well, 30fps) work as soon as the user scrolls past
    // the hero section and reads project cards.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          paused = true;
          cancelAnimationFrame(rafRef.current);
        } else {
          paused = false;
          schedule();
        }
      },
      { threshold: 0 },
    );
    observer.observe(canvas);

    if (!reducedMotion.current) {
      schedule();
    } else {
      nodesRef.current.forEach((n) => { n.life = 1; n.state = "alive"; });
      linksRef.current.forEach((l) => { l.opacity = 1; l.drawProgress = 1; });
      simRef.current?.tick(200);
      draw();
    }

    // ── Resize — debounced; only recalculates canvas size, does NOT rebuild graph ──
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        // Re-center the force-center force to match new dimensions.
        // Node positions are preserved; the sim will ease them over a few ticks.
        const w = canvas.offsetWidth;
        const h = canvas.offsetHeight;
        const sim = simRef.current;
        if (sim) {
          sim.force("center", forceCenter(w / 2, h * 0.38));
          sim.alpha(Math.max(sim.alpha(), 0.05)); // small bump to let forces re-settle
        }
        // Anchor root to new center-bottom
        const root = nodesRef.current.find((n) => n.isRoot);
        if (root) { root.x = w / 2; root.y = h * 0.74; root.vx = 0; root.vy = 0; }
      }, 150);
    };

    const onMouseMove = (e: MouseEvent) => {
      // Just stash raw client coords. hitTest runs in tick() at 30fps.
      rawMouseRef.current = { x: e.clientX, y: e.clientY };
      // Bump sim alpha on actual movement so cursor wind feels responsive.
      simRef.current?.alpha(Math.max(simRef.current.alpha(), 0.04));
    };

    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const pos  = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      const node = hitTest(pos.x, pos.y);
      if (node) routerRef.current.push(node.href);
    };

    const onMouseLeave = () => {
      rawMouseRef.current  = null;
      mouseRef.current     = null;
      hoveredRef.current   = null;
      canvas.style.cursor  = "default";
    };

    canvas.addEventListener("mousemove",  onMouseMove);
    canvas.addEventListener("click",      onClick);
    canvas.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("visibilitychange", onVisChange);
    window.addEventListener("resize", onResize);

    return () => {
      cancelled = true; // permanent — kills any in-flight tick chain
      cancelAnimationFrame(rafRef.current);
      clearTimeout(resizeTimer);
      simRef.current?.stop();
      observer.disconnect();
      canvas.removeEventListener("mousemove",  onMouseMove);
      canvas.removeEventListener("click",      onClick);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("visibilitychange", onVisChange);
      window.removeEventListener("resize", onResize);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%" }}
      aria-label="Interactive project garden — click a node to explore a project"
      role="img"
    />
  );
}

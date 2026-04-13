"use client";

import React, { useRef, useEffect, useCallback } from "react";
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
  SimulationNodeDatum,
  SimulationLinkDatum,
} from "d3-force";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProjectNode extends SimulationNodeDatum {
  id: string;
  label: string;
  href: string;
  /** radius of the fruit node */
  r: number;
  /** life: 0–1 (1 = fully grown, 0 = pruned) */
  life: number;
  /** growing | alive | pruning | pruned */
  state: "growing" | "alive" | "pruning" | "pruned";
  /** parent node id — for structural branch edges */
  parentId?: string;
  /** ticks since last state change */
  age: number;
  /** true if this is the trunk/root node */
  isRoot?: boolean;
  /** project slug for hover labels */
  category?: string;
}

interface GraphLink extends SimulationLinkDatum<ProjectNode> {
  opacity: number;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PALETTE = {
  bg: "#F7F3EC",
  branch: "#6B8A66",
  branchDark: "#3E5641",
  fruit: "#C97B4A",
  fruitWarm: "#E2B25A",
  ink: "#1F2A23",
  muted: "#4A5C4E",
  labelBg: "rgba(247,243,236,0.92)",
};

const PROJECTS: Array<{ id: string; label: string; href: string; category: string }> = [
  { id: "malloy",    label: "Malloy Group",        href: "/projects/malloy-group",    category: "Consulting" },
  { id: "bus315",    label: "B2B Sales Analytics", href: "/projects/bus315-data-mining", category: "Data Mining" },
  { id: "augment",   label: "AUGMENT",              href: "/projects/augment",          category: "UX Design" },
  { id: "fillmore",  label: "Fillmore",             href: "/projects/fillmore",         category: "Research" },
  { id: "uber",      label: "Uber Analytics",       href: "/projects/uber-analytics",   category: "Tableau" },
  { id: "wildfire",  label: "Wildfire ML",          href: "/projects/wildfire-ml",      category: "ML" },
  { id: "lmu",       label: "LMU Datathon",         href: "/projects/lmu-datathon",     category: "Analytics" },
  { id: "chamber",   label: "ChamberGPT",           href: "/projects/chambergpt",       category: "AI" },
  { id: "ai-bubble", label: "AI Bubble",            href: "/projects/ai-bubble",        category: "Economics" },
];

// ─── Constants ────────────────────────────────────────────────────────────────

const TICK_MS          = 16;   // ~60fps
const GROWTH_TICKS     = 60;   // ticks to fully grow
const ALIVE_TICKS_MIN  = 400;
const ALIVE_TICKS_MAX  = 900;
const PRUNE_TICKS      = 80;
const PRUNED_TICKS     = 120;  // wait before regrowing

// ─── Component ────────────────────────────────────────────────────────────────

export interface BranchingGraphProps {
  className?: string;
}

export function BranchingGraph({ className }: BranchingGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router    = useRouter();

  // mutable state stored in refs to avoid re-renders
  const nodesRef   = useRef<ProjectNode[]>([]);
  const linksRef   = useRef<GraphLink[]>([]);
  const simRef     = useRef<ReturnType<typeof forceSimulation<ProjectNode, GraphLink>> | null>(null);
  const mouseRef   = useRef<{ x: number; y: number } | null>(null);
  const hoveredRef = useRef<ProjectNode | null>(null);
  const rafRef     = useRef<number>(0);
  const tickRef    = useRef<number>(0);
  const reducedMotion = useRef(false);

  // ─── Initialize nodes & links ──────────────────────────────────────────────

  const buildGraph = useCallback((width: number, height: number) => {
    // Root node (trunk) at bottom-center
    const root: ProjectNode = {
      id: "root",
      label: "Andrew Lau",
      href: "/",
      r: 6,
      life: 1,
      state: "alive",
      age: 999,
      isRoot: true,
      x: width / 2,
      y: height * 0.8,
    };

    const projectNodes: ProjectNode[] = PROJECTS.map((p, i) => {
      const angle = ((i / PROJECTS.length) * Math.PI * 1.5) - Math.PI * 0.75;
      const dist  = 180 + Math.random() * 120;
      return {
        ...p,
        r: 10 + Math.random() * 6,
        life: 0,
        state: "growing" as const,
        age: 0,
        x: root.x! + Math.cos(angle) * dist * 0.3,
        y: root.y! + Math.sin(angle) * dist * 0.3 - 60,
        parentId: "root",
      };
    });

    const allNodes = [root, ...projectNodes];
    const allLinks: GraphLink[] = projectNodes.map((n) => ({
      source: "root",
      target: n.id,
      opacity: 0,
    }));

    nodesRef.current = allNodes;
    linksRef.current = allLinks;

    // Force simulation — stopped immediately so d3-timer doesn't run its own loop.
    // We tick it manually inside the RAF loop instead.
    const sim = forceSimulation<ProjectNode, GraphLink>(allNodes)
      .force("link", forceLink<ProjectNode, GraphLink>(allLinks)
        .id((d) => d.id)
        .distance(160)
        .strength(0.3))
      .force("charge", forceManyBody().strength(-120))
      .force("center", forceCenter(width / 2, height * 0.42))
      .force("collide", forceCollide<ProjectNode>((d) => d.r + 20).strength(0.6))
      .alphaDecay(0.015)
      .velocityDecay(0.6)
      .stop();

    simRef.current = sim;
  }, []);

  // ─── Lifecycle state machine ────────────────────────────────────────────────

  const tickLifecycle = useCallback(() => {
    nodesRef.current.forEach((node) => {
      if (node.isRoot) return;
      node.age++;

      if (node.state === "growing") {
        node.life = Math.min(1, node.life + 1 / GROWTH_TICKS);
        if (node.life >= 1) {
          node.state = "alive";
          node.age = 0;
          // Update link opacity
          linksRef.current.forEach((l) => {
            const tgt = typeof l.target === "object" ? (l.target as ProjectNode).id : l.target;
            if (tgt === node.id) l.opacity = 1;
          });
        }
      } else if (node.state === "alive") {
        const lifespan = ALIVE_TICKS_MIN + Math.random() * (ALIVE_TICKS_MAX - ALIVE_TICKS_MIN);
        if (node.age > lifespan) {
          node.state = "pruning";
          node.age = 0;
        }
      } else if (node.state === "pruning") {
        node.life = Math.max(0, node.life - 1 / PRUNE_TICKS);
        // Fade link
        linksRef.current.forEach((l) => {
          const tgt = typeof l.target === "object" ? (l.target as ProjectNode).id : l.target;
          if (tgt === node.id) l.opacity = node.life;
        });
        if (node.life <= 0) {
          node.state = "pruned";
          node.age = 0;
        }
      } else if (node.state === "pruned") {
        if (node.age > PRUNED_TICKS) {
          // Regrow near root
          const root = nodesRef.current.find((n) => n.isRoot)!;
          node.x = root.x! + (Math.random() - 0.5) * 60;
          node.y = root.y! + (Math.random() - 0.5) * 60;
          node.vx = 0;
          node.vy = 0;
          node.life = 0;
          node.state = "growing";
          node.age = 0;
          // Kick alpha so the manual tick spreads the regrown node
          if (simRef.current) simRef.current.alpha(Math.max(simRef.current.alpha(), 0.3));
        }
      }
    });
  }, []);

  // ─── Cursor wind ───────────────────────────────────────────────────────────

  const applyCursorWind = useCallback(() => {
    if (!mouseRef.current) return;
    const { x: mx, y: my } = mouseRef.current;
    nodesRef.current.forEach((node) => {
      if (node.isRoot || node.state === "pruned") return;
      const dx = (node.x ?? 0) - mx;
      const dy = (node.y ?? 0) - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const force = (1 - dist / 120) * 0.6;
        node.vx = (node.vx ?? 0) + (dx / dist) * force;
        node.vy = (node.vy ?? 0) + (dy / dist) * force;
      }
    });
    // Nudge alpha so the manual tick responds to cursor wind — no restart() needed
    if (simRef.current && simRef.current.alpha() < 0.05) {
      simRef.current.alpha(0.05);
    }
  }, []);

  // ─── Drawing ───────────────────────────────────────────────────────────────

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = PALETTE.bg;
    ctx.fillRect(0, 0, width, height);

    // Draw links (branches)
    linksRef.current.forEach((link) => {
      const s = link.source as ProjectNode;
      const t = link.target as ProjectNode;
      if (!s.x || !t.x || link.opacity <= 0) return;

      ctx.save();
      ctx.globalAlpha = link.opacity * 0.6;
      ctx.strokeStyle = PALETTE.branch;
      ctx.lineWidth   = 1.5;
      ctx.lineCap     = "round";

      // Slight organic curve
      const mx = (s.x + t.x) / 2 + (Math.random() - 0.5) * 4;
      const my = (s.y! + t.y!) / 2 - 20;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y!);
      ctx.quadraticCurveTo(mx, my, t.x, t.y!);
      ctx.stroke();
      ctx.restore();
    });

    // Draw nodes (fruits + root)
    nodesRef.current.forEach((node) => {
      if (!node.x || node.state === "pruned") return;

      const isHovered = hoveredRef.current?.id === node.id;
      const alpha     = node.isRoot ? 1 : node.life;
      if (alpha <= 0) return;

      ctx.save();
      ctx.globalAlpha = alpha;

      if (node.isRoot) {
        // Trunk anchor — small filled circle
        ctx.fillStyle = PALETTE.branchDark;
        ctx.beginPath();
        ctx.arc(node.x, node.y!, 5, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Fruit node
        const pulse = isHovered ? 1.2 : 1;
        const r     = node.r * node.life * pulse;

        // Outer glow on hover
        if (isHovered) {
          const grad = ctx.createRadialGradient(node.x, node.y!, r * 0.5, node.x, node.y!, r * 2.5);
          grad.addColorStop(0, `${PALETTE.fruit}40`);
          grad.addColorStop(1, "transparent");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(node.x, node.y!, r * 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Fruit body
        const grad = ctx.createRadialGradient(node.x - r * 0.2, node.y! - r * 0.2, r * 0.1, node.x, node.y!, r);
        grad.addColorStop(0, PALETTE.fruitWarm);
        grad.addColorStop(1, PALETTE.fruit);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(node.x, node.y!, r, 0, Math.PI * 2);
        ctx.fill();

        // Subtle border
        ctx.strokeStyle = PALETTE.branchDark;
        ctx.lineWidth   = 0.8;
        ctx.stroke();

        // Label on hover
        if (isHovered && node.life > 0.8) {
          ctx.globalAlpha = 1;
          const label   = node.label;
          const cat     = node.category ?? "";
          const padX    = 12, padY = 8;
          const fSize   = 13;
          const catSize = 11;
          ctx.font = `500 ${fSize}px var(--font-inter, system-ui)`;
          const lw  = ctx.measureText(label).width;
          ctx.font = `400 ${catSize}px var(--font-inter, system-ui)`;
          const cw  = ctx.measureText(cat).width;
          const bw  = Math.max(lw, cw) + padX * 2;
          const bh  = fSize + catSize + padY * 2 + 4;
          let lx    = node.x + r + 8;
          let ly    = node.y! - bh / 2;
          if (lx + bw > width - 16) lx = node.x - r - 8 - bw;
          if (ly < 8) ly = 8;
          if (ly + bh > height - 8) ly = height - bh - 8;

          // Background pill
          ctx.fillStyle = PALETTE.labelBg;
          ctx.beginPath();
          const br = 8;
          ctx.moveTo(lx + br, ly);
          ctx.lineTo(lx + bw - br, ly);
          ctx.arcTo(lx + bw, ly, lx + bw, ly + br, br);
          ctx.lineTo(lx + bw, ly + bh - br);
          ctx.arcTo(lx + bw, ly + bh, lx + bw - br, ly + bh, br);
          ctx.lineTo(lx + br, ly + bh);
          ctx.arcTo(lx, ly + bh, lx, ly + bh - br, br);
          ctx.lineTo(lx, ly + br);
          ctx.arcTo(lx, ly, lx + br, ly, br);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = `${PALETTE.fruit}55`;
          ctx.lineWidth   = 1;
          ctx.stroke();

          // Label text
          ctx.fillStyle = PALETTE.ink;
          ctx.font      = `500 ${fSize}px var(--font-inter, system-ui)`;
          ctx.fillText(label, lx + padX, ly + padY + fSize - 2);
          ctx.fillStyle = PALETTE.muted;
          ctx.font      = `400 ${catSize}px var(--font-inter, system-ui)`;
          ctx.fillText(cat, lx + padX, ly + padY + fSize + 4 + catSize - 2);
        }
      }

      ctx.restore();
    });
  }, []);

  // ─── Main loop ─────────────────────────────────────────────────────────────

  const loop = useCallback(() => {
    tickRef.current++;

    // Manually tick d3 simulation — keeps it under our control, no d3-timer running
    if (simRef.current && simRef.current.alpha() > simRef.current.alphaMin()) {
      simRef.current.tick(1);
    }

    // Run lifecycle every 2 ticks
    if (tickRef.current % 2 === 0) tickLifecycle();

    // Apply cursor wind every 3 ticks
    if (tickRef.current % 3 === 0) applyCursorWind();

    draw();
    rafRef.current = requestAnimationFrame(loop);
  }, [tickLifecycle, applyCursorWind, draw]);

  // ─── Hit-test ──────────────────────────────────────────────────────────────

  const hitTest = useCallback((cx: number, cy: number): ProjectNode | null => {
    for (const node of nodesRef.current) {
      if (node.isRoot || node.state === "pruned" || node.life < 0.5) continue;
      const dx = (node.x ?? 0) - cx;
      const dy = (node.y ?? 0) - cy;
      if (Math.sqrt(dx * dx + dy * dy) <= node.r * node.life + 12) return node;
    }
    return null;
  }, []);

  // ─── Canvas sizing ─────────────────────────────────────────────────────────

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w   = canvas.offsetWidth;
    const h   = canvas.offsetHeight;
    canvas.width  = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);
  }, []);

  // ─── Mount ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const canvas = canvasRef.current!;
    resize();

    const cssW = canvas.offsetWidth;
    const cssH = canvas.offsetHeight;
    buildGraph(cssW, cssH);

    if (!reducedMotion.current) {
      rafRef.current = requestAnimationFrame(loop);
    } else {
      // Static snapshot: manually tick the stopped sim to settle positions, then draw once
      nodesRef.current.forEach((n) => { n.life = 1; n.state = "alive"; });
      linksRef.current.forEach((l) => { l.opacity = 1; });
      for (let i = 0; i < 200; i++) simRef.current?.tick(1);
      draw();
    }

    const onResize = () => {
      resize();
      if (simRef.current) simRef.current.alpha(Math.max(simRef.current.alpha(), 0.3));
    };
    window.addEventListener("resize", onResize);

    // Pause the RAF loop when the tab is hidden to prevent background CPU/memory drain
    const onVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafRef.current);
      } else if (!reducedMotion.current) {
        rafRef.current = requestAnimationFrame(loop);
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    // Mouse / touch events
    const toCanvas = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const onMouseMove = (e: MouseEvent) => {
      const pos = toCanvas(e.clientX, e.clientY);
      mouseRef.current = pos;
      hoveredRef.current = hitTest(pos.x, pos.y);
      canvas.style.cursor = hoveredRef.current ? "pointer" : "default";
    };

    const onClick = (e: MouseEvent) => {
      const pos  = toCanvas(e.clientX, e.clientY);
      const node = hitTest(pos.x, pos.y);
      if (node) router.push(node.href);
    };

    const onMouseLeave = () => {
      mouseRef.current  = null;
      hoveredRef.current = null;
      canvas.style.cursor = "default";
    };

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("click", onClick);
    canvas.addEventListener("mouseleave", onMouseLeave);

    return () => {
      cancelAnimationFrame(rafRef.current);
      simRef.current?.stop();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("click", onClick);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [buildGraph, loop, draw, resize, hitTest, router]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%" }}
      aria-label="Interactive project graph — click a node to explore a project"
      role="img"
    />
  );
}

"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let destroy: (() => void) | undefined;
    (async () => {
      const mod = await import("./hero-graph.js");
      destroy = mod.init("hero-scatter-canvas");
    })();
    return () => destroy?.();
  }, []);

  return (
    <section className="relative w-full min-h-[85vh] bg-background">
      {/* Canvas background — fills full section */}
      <canvas
        id="hero-scatter-canvas"
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full block"
      />

      {/* Text overlay */}
      <div className="absolute inset-0 z-10 flex flex-col justify-between px-6 sm:px-8 lg:px-12 py-16 md:py-24 pointer-events-none">
        <div className="max-w-7xl w-full mx-auto flex flex-col justify-between h-full flex-1">
          {/* Name — top left */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-heading italic text-foreground"
            style={{
              fontSize: 'clamp(1.75rem, 3.5vw + 0.75rem, 3.5rem)',
              fontWeight: 400,
              letterSpacing: '-0.015em',
              lineHeight: 1,
            }}
          >
            Andrew Lau
          </motion.p>

          {/* CTA heading — center */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease: "easeOut" }}
            className="font-heading font-semibold text-primary my-8 md:my-12 max-w-full md:max-w-[55%]"
            style={{ letterSpacing: '-0.009em', fontSize: 'clamp(1.875rem, 4vw + 1rem, 4.5rem)', lineHeight: 1.05 }}
          >
            I untangle ambiguous questions and turn them into something actionable.
          </motion.h1>

          {/* Role — bottom left */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="annotation"
          >
            —— PROBLEM SOLVER · ANALYST · TINKERER
          </motion.p>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let destroy: (() => void) | undefined;
    (async () => {
      const mod = await import("./hero-canvas.js");
      destroy = mod.init("hero-scatter-canvas");
    })();
    return () => destroy?.();
  }, []);

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: "#F5F0E8" }}
    >
      {/* Canvas background */}
      <canvas
        id="hero-scatter-canvas"
        ref={canvasRef}
        className="block w-full"
        style={{ height: 420 }}
      />

      {/* Text overlay — bottom-left, absolutely positioned over canvas */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end px-6 sm:px-8 lg:px-12 pb-12 pointer-events-none">
        <div className="max-w-7xl w-full mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-sm tracking-widest uppercase mb-5"
            style={{ color: "#C97B4A" }}
          >
            Problem Solver · Analyst · Tinkerer
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55, ease: "easeOut" }}
            className="text-6xl sm:text-7xl md:text-8xl lg:text-[7rem] font-medium leading-[0.9] tracking-tight"
            style={{
              color: "#1F2A23",
              fontFamily: "var(--font-fraunces)",
            }}
          >
            Andrew
            <br />
            Lau.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="mt-6 text-lg md:text-xl max-w-sm"
            style={{ color: "#4A5C4E" }}
          >
            Prefers the problems where the question isn&apos;t obvious yet.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.5 }}
            className="mt-8 flex items-center gap-2 text-sm"
            style={{ color: "#6B8A66" }}
          >
            <span>Scroll to explore</span>
            <motion.span
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              ↓
            </motion.span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

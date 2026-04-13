"use client";

import { motion } from "framer-motion";
import { BranchingGraph } from "./BranchingGraph";

export function Hero() {
  return (
    <section
      className="relative w-full min-h-screen overflow-hidden"
      style={{ backgroundColor: "#F7F3EC" }}
    >
      {/* BranchingGraph fills the entire hero */}
      <BranchingGraph className="absolute inset-0 w-full h-full" />

      {/* Text overlay — bottom-left */}
      <div className="relative z-10 flex flex-col justify-end min-h-screen px-6 sm:px-8 lg:px-12 pb-16 pointer-events-none">
        <div className="max-w-7xl w-full mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-sm tracking-widest uppercase mb-5"
            style={{ color: "#C97B4A" }}
          >
            Business Analyst · Designer · Experimenter
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
            <span>Hover a node to explore</span>
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

"use client";

import { motion } from "framer-motion";

// Temporary placeholder — will be replaced by BranchingGraph (Canvas2D + d3-force)
export function HeroPlaceholder() {
  return (
    <section
      className="relative flex items-end min-h-screen w-full px-6 sm:px-8 lg:px-12 pb-16"
      style={{ backgroundColor: "#F7F3EC" }}
    >
      {/* Animated background orb — placeholder for the BranchingGraph */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute rounded-full opacity-20"
          style={{
            width: 600,
            height: 600,
            top: "50%",
            left: "50%",
            x: "-50%",
            y: "-50%",
            background: "radial-gradient(circle, #6B8A66 0%, #C97B4A 50%, transparent 80%)",
          }}
          animate={{
            scale: [1, 1.08, 1],
            rotate: [0, 8, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Text content — bottom-left */}
      <div className="relative z-10 max-w-7xl w-full mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-sm tracking-widest uppercase mb-4"
          style={{ color: "#C97B4A" }}
        >
          Business Analyst · Designer · Experimenter
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-medium leading-none"
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
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-6 text-lg md:text-xl max-w-md"
          style={{ color: "#4A5C4E" }}
        >
          Prefers the problems where the question isn&apos;t obvious yet.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="mt-10 flex items-center gap-2"
          style={{ color: "#4A5C4E" }}
        >
          <span className="text-sm">Scroll to explore</span>
          <motion.span
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ↓
          </motion.span>
        </motion.div>
      </div>
    </section>
  );
}

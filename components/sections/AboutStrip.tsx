"use client";

import { motion } from "framer-motion";

export function AboutStrip() {
  return (
    <section
      id="about"
      className="w-full py-20 md:py-32 px-6 sm:px-8 lg:px-12"
      style={{ backgroundColor: "#F7F3EC" }}
    >
      <div className="max-w-3xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-xl md:text-2xl leading-relaxed md:leading-relaxed"
          style={{ color: "#1F2A23", fontFamily: "var(--font-fraunces)", fontWeight: 400 }}
        >
          I put myself into situations I&apos;m not ready for — because feedback
          lands differently when something&apos;s actually at stake. I take notes
          on where things go wrong, not because anyone asks, but because I want to
          understand before I move on. I&apos;m most interested in problems where
          the question itself isn&apos;t obvious yet, and I&apos;ve had to relearn
          more than once when to stop asking &ldquo;so what?&rdquo; and just ship.
        </motion.p>
      </div>
    </section>
  );
}

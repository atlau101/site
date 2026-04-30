"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function AboutStrip() {
  return (
    <section
      id="about"
      className="w-full py-20 md:py-32 px-6 sm:px-8 lg:px-12 bg-background"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
          {/* Marginalia annotation + headshot */}
          <div className="md:col-span-1">
            <div className="flex flex-col">
              <span className="annotation">§ About / 01</span>
              <Image
                src="/andrew_headshot.jpg"
                alt="Andrew Lau"
                width={400}
                height={500}
                className="w-full max-w-xs md:-mt-6 mt-4 md:mt-0"
                priority
              />
            </div>
          </div>

          {/* Main text — 2/3 column */}
          <motion.div
            className="md:col-span-2"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <p className="font-heading text-xl md:text-2xl text-foreground font-normal">
              Hi! I&apos;m Andrew.
            </p>
            <p className="text-lg md:text-xl text-foreground mt-6">
              I&apos;ve always been drawn to problems that don&apos;t come with obvious answers — the kind where you have to figure out what you&apos;re even dealing with before you can start solving it. I learned this after various experiences in consulting, business development, and data analysis/machine learning. The thread connecting all of it was never the domain, but the process of making sense of something messy.
            </p>
            <p className="text-lg md:text-xl text-foreground mt-4">
              What I&apos;ve learned along the way is that clarity comes from knowing what gaps in knowledge actually matter. If I don't know something, why is that so? I also learned the hard way that there&apos;s a difference between preparing to act and actually acting. Getting something in front of real feedback early almost always teaches you more than spending twice as long refining it in isolation.
            </p>
            <p className="text-lg md:text-xl text-foreground mt-4">
              That&apos;s shaped how I work now: get to a clear baseline quickly, remove anything blocking that path, and build from there. Everything else is a branch, not a blocker. From there, I revise where reality pushes back.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

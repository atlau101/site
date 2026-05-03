"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function AboutStrip() {
  return (
    <section
      id="about"
      className="w-full bg-background px-6 py-20 md:py-32 sm:px-8 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12">
          <div className="md:col-span-1">
            <div className="brutalist-panel flex flex-col overflow-hidden">
              <div className="border-b-[3px] border-foreground bg-primary px-5 py-4 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-primary-foreground">
                About / 01
              </div>
              <Image
                src="/andrew_headshot.jpg"
                alt="Andrew Lau"
                width={400}
                height={500}
                className="w-full"
                priority
              />
              <div className="border-t-[3px] border-foreground bg-card px-5 py-4">
                <p className="annotation text-secondary">San Francisco / USF 2026</p>
              </div>
            </div>
          </div>

          <motion.div
            className="brutalist-panel md:col-span-2"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="border-b-[3px] border-foreground px-5 py-4 md:px-7">
              <p className="annotation text-secondary">Approach</p>
              <p className="mt-4 max-w-[18ch] font-heading text-3xl font-black uppercase leading-[0.95] text-foreground md:text-5xl">
                Hi, I&apos;m Andrew.
              </p>
            </div>
            <div className="space-y-0 px-5 py-5 md:px-7 md:py-7">
              <p className="text-base leading-8 text-foreground md:text-lg">
                I&apos;ve always been drawn to problems that don&apos;t come with obvious answers, the kind where you have to figure out what you&apos;re even dealing with before you can start solving it. I learned this after various experiences in consulting, business development, and data analysis and machine learning. The thread connecting all of it was never the domain, but the process of making sense of something messy.
              </p>
              <p className="mt-5 border-t border-foreground pt-5 text-base leading-8 text-foreground md:text-lg">
                What I&apos;ve learned along the way is that clarity comes from knowing what gaps in knowledge actually matter. If I don&apos;t know something, why is that so? I also learned the hard way that there&apos;s a difference between preparing to act and actually acting. Getting something in front of real feedback early almost always teaches you more than spending twice as long refining it in isolation.
              </p>
              <p className="mt-5 border-t border-foreground pt-5 text-base leading-8 text-foreground md:text-lg">
                That&apos;s shaped how I work now: get to a clear baseline quickly, remove anything blocking that path, and build from there. Everything else is a branch, not a blocker. From there, I revise where reality pushes back.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

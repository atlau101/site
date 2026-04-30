"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ProjectData } from "@/lib/projects/types";

interface ProjectHeroProps {
  project: ProjectData;
}

export const ProjectHero: React.FC<ProjectHeroProps> = ({ project }) => {
  return (
    <section className="w-full py-24 px-6 sm:px-8 lg:px-12 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link
            href="/#work"
            className="annotation text-muted-foreground hover:text-foreground transition-colors duration-200 no-underline"
          >
            ← Back to work
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 rule-h pb-12">
          {/* Left column: Project title */}
          <div className="md:col-span-7">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="font-heading text-display font-semibold leading-[1.05] text-primary"
              style={{ letterSpacing: "-0.02em" }}
            >
              {project.title}
            </motion.h1>
          </div>

          {/* Right column: Metadata sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="md:col-span-5 bg-primary px-6 py-8 md:px-8 md:py-10"
          >
            <div className="grid grid-cols-2 gap-4 pb-5">
              <span className="font-mono text-xs tracking-[0.05em] uppercase text-primary-foreground/55">YEAR</span>
              <p className="font-heading text-lg italic text-primary-foreground">{project.year}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 py-5 border-t border-primary-foreground/15">
              <span className="font-mono text-xs tracking-[0.05em] uppercase text-primary-foreground/55">TYPE</span>
              <p className="font-heading text-lg italic text-primary-foreground">{project.type}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-5 border-t border-primary-foreground/15">
              <span className="font-mono text-xs tracking-[0.05em] uppercase text-primary-foreground/55">SKILLS</span>
              <div className="space-y-1">
                {project.skills.map((skill, i) => (
                  <p key={i} className="font-heading text-base italic text-primary-foreground leading-snug">
                    {skill}
                  </p>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

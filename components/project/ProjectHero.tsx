"use client";

import React from "react";
import { motion } from "framer-motion";
import { ViewTransition } from "react";
import { ProjectData } from "@/lib/projects/types";
import { getLandingAnchorId } from "@/lib/projects/navigation";
import { ReturnHomeAnchorLink } from "@/components/sections/ReturnHomeAnchorLink";

interface ProjectHeroProps {
  project: ProjectData;
}

export const ProjectHero: React.FC<ProjectHeroProps> = ({ project }) => {
  return (
    <section className="w-full bg-background px-6 py-24 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <ReturnHomeAnchorLink
            targetId={getLandingAnchorId(project.slug)}
            openSlug={project.slug}
            className="inline-flex border-[3px] border-foreground bg-card px-4 py-3 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-foreground transition-colors duration-200 hover:bg-primary hover:text-primary-foreground"
          >
            Back to work
          </ReturnHomeAnchorLink>
        </div>

        <div className="grid grid-cols-1 gap-0 border-y-[3px] border-foreground pb-0 md:grid-cols-12">
          <div className="border-b-[3px] border-foreground px-5 py-8 md:col-span-7 md:border-b-0 md:px-8 md:py-10">
            <p className="annotation text-secondary">Project / {project.year}</p>
            <ViewTransition name={`project-title-${project.slug}`}>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                className="mt-6 font-heading text-display font-black uppercase text-foreground"
              >
                {project.title}
              </motion.h1>
            </ViewTransition>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="bg-primary md:col-span-5 md:border-l-[3px] md:border-foreground"
          >
            <div className="grid grid-cols-2 gap-4 border-b-[3px] border-foreground px-5 py-5 md:px-7">
              <span className="annotation !text-primary-foreground">Year</span>
              <p className="font-heading text-lg font-black uppercase tracking-[-0.03em] text-primary-foreground">
                {project.year}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-b-[3px] border-foreground px-5 py-5 md:px-7">
              <span className="annotation !text-primary-foreground">Type</span>
              <p className="font-heading text-lg font-black uppercase tracking-[-0.03em] text-primary-foreground">
                {project.type}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 px-5 py-5 md:px-7">
              <span className="annotation !text-primary-foreground">Skills</span>
              <div className="space-y-2">
                {project.skills.map((skill, i) => (
                  <p
                    key={i}
                    className="font-heading text-sm font-black uppercase tracking-[0.02em] text-primary-foreground md:text-base"
                  >
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

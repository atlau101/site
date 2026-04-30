"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export interface SecondaryProject {
  title: string;
  description: string;
  category: string;
  year: string;
  href: string;
}

interface ProjectGridProps {
  projects: SecondaryProject[];
  heading?: string;
}

export function ProjectGrid({ projects, heading = "More work" }: ProjectGridProps) {
  return (
    <section className="w-full py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <h2 className="font-heading text-2xl md:text-3xl font-medium mb-10 text-foreground">
          {heading}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <motion.div
              key={project.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: index * 0.07, ease: "easeOut" }}
              className="rule-h-faint"
            >
              <Link href={project.href} className="block h-full group cursor-pointer no-underline">
                <div className="h-full p-6 flex flex-col gap-3 bg-card transition-opacity duration-200 group-hover:opacity-80">
                  <h3 className="font-heading text-xl font-medium leading-snug text-foreground">
                    {project.title}
                  </h3>

                  <p className="text-sm leading-relaxed flex-1 text-foreground/70">
                    {project.description}
                  </p>

                  <div className="flex items-center justify-between gap-3 pt-1">
                    <span className="annotation">{project.category}</span>
                    <span className="annotation">{project.year}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

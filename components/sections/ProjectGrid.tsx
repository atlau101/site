"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    <section className="w-full py-16 md:py-24" style={{ backgroundColor: "#F7F3EC" }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <h2
          className="text-2xl md:text-3xl font-medium mb-10"
          style={{ fontFamily: "var(--font-fraunces)", color: "#1F2A23" }}
        >
          {heading}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: index * 0.07, ease: "easeOut" }}
            >
              <Link href={project.href} className="block h-full group cursor-pointer">
                <Card
                  className="h-full transition-all duration-250 border-2"
                  style={{
                    backgroundColor: "#EDE8DF",
                    borderColor: "#1F2A23",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "#C97B4A";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "#1F2A23";
                  }}
                >
                  <CardContent className="p-6 flex flex-col h-full gap-3">
                    <h3
                      className="text-xl font-medium leading-snug"
                      style={{ fontFamily: "var(--font-fraunces)", color: "#1F2A23" }}
                    >
                      {project.title}
                    </h3>

                    <p
                      className="text-sm leading-relaxed flex-1"
                      style={{ color: "#1F2A23", opacity: 0.72 }}
                    >
                      {project.description}
                    </p>

                    <div className="flex items-center justify-between gap-3 pt-1">
                      <Badge
                        variant="outline"
                        className="text-xs border-current"
                        style={{ color: "#4A5C4E", borderColor: "#4A5C4E", backgroundColor: "transparent" }}
                      >
                        {project.category}
                      </Badge>
                      <span className="text-sm" style={{ color: "#1F2A23", opacity: 0.5 }}>
                        {project.year}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

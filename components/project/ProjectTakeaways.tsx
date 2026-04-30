"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { ProjectData } from "@/lib/projects/types";
import { RichProjectText } from "./RichProjectText";

interface ProjectTakeawaysProps {
  project: ProjectData;
}

export const ProjectTakeaways: React.FC<ProjectTakeawaysProps> = ({ project }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <section className="w-full py-20 px-6 sm:px-8 lg:px-12 bg-background">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12"
        >
          <h2 className="font-heading text-3xl sm:text-4xl font-medium text-primary mb-2">
            What I Took Away
          </h2>
          <p className="annotation text-muted-foreground">POST-PROJECT REFLECTION</p>
        </motion.div>

        <div className="space-y-0">
          {project.lessons.map((lesson, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.45,
                ease: [0.22, 1, 0.36, 1],
                delay: idx * 0.06,
              }}
              className={idx > 0 ? "rule-h-faint pt-6" : ""}
            >
              <div className="pb-6">
                <button
                  onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
                  className="w-full text-left flex items-start gap-3 cursor-pointer group transition-opacity hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:rounded-sm"
                  aria-expanded={expandedIndex === idx}
                >
                  <motion.div
                    animate={{ rotate: expandedIndex === idx ? 0 : 180 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    className="mt-1 flex-shrink-0"
                  >
                    <ChevronDown size={20} className="text-foreground" aria-hidden="true" />
                  </motion.div>

                  <div className="flex-1">
                    <h3 className="font-heading text-xl font-semibold leading-snug text-primary mb-2">
                      {lesson.title}
                    </h3>
                    <p className="max-w-3xl text-[1.02rem] leading-7 text-foreground/80">
                      {lesson.summary}
                    </p>
                  </div>
                </button>

                <AnimatePresence>
                  {expandedIndex === idx && (
                    <motion.div
                      initial={{ opacity: 0, gridTemplateRows: "0fr" }}
                      animate={{ opacity: 1, gridTemplateRows: "1fr" }}
                      exit={{ opacity: 0, gridTemplateRows: "0fr", transition: { duration: 0.18, ease: "easeIn" } }}
                      transition={{ duration: 0.28, ease: [0.33, 1, 0.68, 1] }}
                      style={{ display: "grid", overflow: "hidden" }}
                    >
                      <div style={{ minHeight: 0 }}>
                        <div className="mt-5 ml-8 border-t border-rule/60 pt-5 pb-1">
                          <RichProjectText
                            text={lesson.full}
                            className="space-y-4 max-w-3xl"
                            paragraphClassName="text-[1.02rem] leading-8 text-foreground"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

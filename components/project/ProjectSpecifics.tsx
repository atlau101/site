"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { ProjectData } from "@/lib/projects/types";

function renderInline(text: string): React.ReactNode[] {
  return text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  );
}

interface ProjectSpecificsProps {
  project: ProjectData;
}

export const ProjectSpecifics: React.FC<ProjectSpecificsProps> = ({ project }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!project.specifics) return null;

  return (
    <section className="w-full py-20 px-6 sm:px-8 lg:px-12 bg-background">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-left flex items-start gap-3 cursor-pointer group transition-opacity hover:opacity-75 mb-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:rounded-sm"
          aria-expanded={isExpanded}
        >
          <motion.div
            animate={{ rotate: isExpanded ? 0 : 180 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="flex-shrink-0"
          >
            <ChevronDown size={24} className="text-foreground" aria-hidden="true" />
          </motion.div>
          <div>
            <h2 className="font-heading text-3xl sm:text-4xl font-medium text-primary">
              The Specifics
            </h2>
            <p className="annotation text-muted-foreground mt-1">DEEP DIVE · FULL DETAIL</p>
          </div>
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, gridTemplateRows: "0fr" }}
              animate={{ opacity: 1, gridTemplateRows: "1fr" }}
              exit={{ opacity: 0, gridTemplateRows: "0fr", transition: { duration: 0.2, ease: "easeIn" } }}
              transition={{ duration: 0.32, ease: [0.33, 1, 0.68, 1] }}
              style={{ display: "grid", overflow: "hidden" }}
            >
              <div style={{ minHeight: 0 }}>
              <div className="max-w-none text-foreground space-y-6">
                {project.specifics.split("\n\n").map((paragraph, idx) => {
                  if (paragraph.startsWith("##")) {
                    return (
                      <h3 key={idx} className="font-heading text-xl font-semibold text-primary mt-8 mb-4">
                        {paragraph.replace(/^##\s+/, "").trim()}
                      </h3>
                    );
                  }
                  if (paragraph.startsWith("|") || paragraph.startsWith("- ") || paragraph.startsWith("* ")) {
                    return (
                      <div key={idx} className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
                        {paragraph}
                      </div>
                    );
                  }
                  return (
                    <p key={idx} className="text-base leading-relaxed">
                      {renderInline(paragraph)}
                    </p>
                  );
                })}
              </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

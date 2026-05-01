"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ViewTransition } from "react";
import { ChevronDown } from "lucide-react";

export interface SubProject {
  title: string;
  category: string;
  href: string;
}

export interface GroupedFeaturedCardProps {
  title: string;
  outcome: string;
  category: string;
  projects: SubProject[];
  href?: string;
}

const listVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
  exit: {},
};

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.22, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: 4,
    transition: { duration: 0.12, ease: "easeIn" },
  },
};

export const GroupedFeaturedCard: React.FC<GroupedFeaturedCardProps> = ({
  title,
  outcome,
  category,
  projects,
  href,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="bg-card overflow-hidden">
      <div className="bg-popover">
        {/* Collapsed header — click to toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          className="w-full text-left p-8 md:p-12 space-y-5 hover:bg-paper-container transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
        >
          <span className="annotation text-muted-foreground">{category}</span>

          <div className="flex items-start justify-between gap-6">
            {href ? (
              <ViewTransition name={`project-group-${href.split("/").pop()}`}>
                <h3 className="font-heading text-3xl md:text-4xl font-medium leading-tight text-foreground flex-1">
                  {title}
                </h3>
              </ViewTransition>
            ) : (
              <h3 className="font-heading text-3xl md:text-4xl font-medium leading-tight text-foreground flex-1">
                {title}
              </h3>
            )}
            <div className="pt-2 flex-shrink-0">
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.25, ease: [0.33, 1, 0.68, 1] }}
              >
                <ChevronDown className="w-6 h-6 text-foreground" aria-hidden="true" />
              </motion.div>
            </div>
          </div>

          <p className="text-base md:text-lg text-foreground/75">
            {outcome}
          </p>

          {/* Sub-project index — visible when collapsed, fades out when list is open */}
          <AnimatePresence mode="wait">
            {!isOpen && (
              <motion.p
                key="index"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="annotation normal-case text-foreground/45"
              >
                {projects.map((p) => p.title).join(" · ")}
              </motion.p>
            )}
          </AnimatePresence>
        </button>

        {/* Expanded sub-projects list — rows stagger in */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, gridTemplateRows: "0fr" }}
              animate={{ opacity: 1, gridTemplateRows: "1fr" }}
              exit={{ opacity: 0, gridTemplateRows: "0fr" }}
              transition={{ duration: 0.25, ease: [0.33, 1, 0.68, 1] }}
              className="border-t border-border"
              style={{ display: "grid", overflow: "hidden" }}
            >
              <div style={{ minHeight: 0 }}>
                <motion.div
                  className="divide-y divide-border/50"
                  variants={listVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {href && (
                    <motion.div key="hub-link" variants={rowVariants}>
                      <Link
                        href={href}
                        transitionTypes={["forward"]}
                        className="flex items-center justify-between px-8 md:px-12 py-6 bg-paper-low hover:bg-paper-container transition-colors duration-200 group no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                      >
                        <div className="flex flex-col gap-1">
                          <span className="font-heading text-xl md:text-2xl font-semibold text-foreground group-hover:underline underline-offset-2">
                            {title} — Overview
                          </span>
                          <span className="annotation text-muted-foreground">
                            Context, through-line, all three splits
                          </span>
                        </div>
                        <span className="text-foreground/60 group-hover:text-foreground transition-colors ml-4 flex-shrink-0 text-lg">
                          →
                        </span>
                      </Link>
                    </motion.div>
                  )}
                  {projects.map((project) => {
                    const pSlug = project.href.split("/").pop() ?? project.href;
                    return (
                      <motion.div key={project.href} variants={rowVariants}>
                        <Link
                          href={project.href}
                          transitionTypes={["forward"]}
                          className="flex items-center justify-between px-8 md:px-12 py-5 hover:bg-paper-container transition-colors duration-200 group no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                        >
                          <div className="flex flex-col gap-1">
                            <ViewTransition name={`project-title-${pSlug}`}>
                              <span className="font-heading text-lg md:text-xl font-medium text-foreground group-hover:underline underline-offset-2">
                                {project.title}
                              </span>
                            </ViewTransition>
                            <span className="annotation text-muted-foreground">
                              {project.category}
                            </span>
                          </div>
                          <span className="text-foreground/40 group-hover:text-foreground transition-colors ml-4 flex-shrink-0">
                            →
                          </span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

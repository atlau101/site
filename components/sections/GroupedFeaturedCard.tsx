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
    <div className="brutalist-panel overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="w-full cursor-pointer space-y-5 px-6 py-6 text-left transition-colors duration-200 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset md:px-8 md:py-8"
      >
        <span className="annotation text-secondary">{category}</span>

        <div className="flex items-start justify-between gap-6">
          {href ? (
            <ViewTransition name={`project-group-${href.split("/").pop()}`}>
              <h3 className="flex-1 font-heading text-3xl font-black leading-[0.95] text-foreground md:text-5xl">
                {title}
              </h3>
            </ViewTransition>
          ) : (
            <h3 className="flex-1 font-heading text-3xl font-black leading-[0.95] text-foreground md:text-5xl">
              {title}
            </h3>
          )}

          <div className="shrink-0 border-[3px] border-foreground bg-primary px-3 py-3">
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.25, ease: [0.33, 1, 0.68, 1] }}
            >
              <ChevronDown
                className="h-6 w-6 text-primary-foreground"
                aria-hidden="true"
              />
            </motion.div>
          </div>
        </div>

        <p className="max-w-[42rem] text-base leading-8 text-foreground/78 md:text-lg">
          {outcome}
        </p>

        <AnimatePresence mode="wait">
          {!isOpen && (
            <motion.p
              key="index"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="annotation text-foreground/54"
            >
              {projects.map((p) => p.title).join(" · ")}
            </motion.p>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, gridTemplateRows: "0fr" }}
            animate={{ opacity: 1, gridTemplateRows: "1fr" }}
            exit={{ opacity: 0, gridTemplateRows: "0fr" }}
            transition={{ duration: 0.25, ease: [0.33, 1, 0.68, 1] }}
            className="border-t-[3px] border-foreground"
            style={{ display: "grid", overflow: "hidden" }}
          >
            <div style={{ minHeight: 0 }}>
              <motion.div
                className="divide-y-[3px] divide-foreground"
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
                      className="group flex items-center justify-between bg-card px-6 py-6 no-underline transition-colors duration-200 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset md:px-8"
                    >
                      <div className="flex flex-col gap-2">
                        <span className="font-heading text-2xl font-black leading-tight text-foreground">
                          {title} overview
                        </span>
                        <span className="annotation text-secondary">
                          Context, through-line, all three splits
                        </span>
                      </div>
                      <span className="ml-4 shrink-0 text-2xl text-primary">→</span>
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
                        className="group flex items-center justify-between bg-background px-6 py-5 no-underline transition-colors duration-200 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset md:px-8"
                      >
                        <div className="flex flex-col gap-2">
                          <ViewTransition name={`project-title-${pSlug}`}>
                            <span className="font-heading text-xl font-black leading-tight text-foreground md:text-2xl">
                              {project.title}
                            </span>
                          </ViewTransition>
                          <span className="annotation text-secondary">
                            {project.category}
                          </span>
                        </div>
                        <span className="ml-4 shrink-0 text-xl text-primary">→</span>
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
  );
};

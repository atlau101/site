"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ViewTransition } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

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
  const [isOpen, setIsOpen] = React.useState(() => {
    if (typeof window === "undefined") return false;
    const slug = sessionStorage.getItem("accordionOpenForSlug");
    if (!slug) return false;
    const matchesProject = projects.some(
      (p) => p.href.split("/").pop() === slug,
    );
    const matchesHub = href ? href.split("/").pop() === slug : false;
    return matchesProject || matchesHub;
  });

  React.useEffect(() => {
    sessionStorage.removeItem("accordionOpenForSlug");
  }, []);

  return (
    <>
      <details className="brutalist-panel overflow-hidden md:hidden [&[open]>summary_.chevron-icon]:rotate-90">
        <summary className="cursor-pointer list-none space-y-4 px-6 py-6 text-left transition-colors duration-200 active:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset">
          <span className="annotation text-secondary">{category}</span>

          <div className="flex items-center justify-between gap-4">
            <h3 className="flex-1 font-heading text-3xl font-black leading-[0.95] text-foreground">
              {title}
            </h3>
            <div className="flex shrink-0 items-center gap-3">
              <span className="annotation text-secondary">{projects.length} projects</span>
              <ChevronRight
                className="chevron-icon h-5 w-5 text-primary transition-transform duration-200"
                aria-hidden="true"
              />
            </div>
          </div>

          <p className="max-w-[42rem] text-base leading-7 text-foreground/78">
            {outcome}
          </p>
        </summary>

        <div className="divide-y divide-foreground/40 border-t-[3px] border-foreground">
          {href && (
            <Link
              href={href}
              transitionTypes={["forward"]}
              className="flex min-h-11 touch-manipulation items-center justify-between bg-card px-6 py-5 no-underline transition-colors duration-200 active:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
            >
              <div className="flex flex-col gap-2">
                <span className="font-heading text-2xl font-black leading-tight text-foreground">
                  Open {title}
                </span>
                <span className="annotation text-secondary">Project hub</span>
              </div>
              <span className="ml-4 shrink-0 text-2xl text-primary">→</span>
            </Link>
          )}

          {projects.map((project) => (
            <Link
              key={project.href}
              href={project.href}
              transitionTypes={["forward"]}
              className="flex min-h-11 touch-manipulation items-center justify-between bg-background px-6 py-5 no-underline transition-colors duration-200 active:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
            >
              <div className="flex flex-col gap-2">
                <span className="font-heading text-xl font-black leading-tight text-foreground">
                  {project.title}
                </span>
                <span className="annotation text-secondary">{project.category}</span>
              </div>
              <span className="ml-4 shrink-0 text-xl text-primary">→</span>
            </Link>
          ))}
        </div>
      </details>

      <div className="brutalist-panel hidden overflow-hidden md:block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="w-full cursor-pointer space-y-5 px-6 py-6 text-left transition-colors duration-200 hover:bg-muted active:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset md:px-8 md:py-8"
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

      <AnimatePresence initial={false}>
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
                className="divide-y divide-foreground/40"
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
                    className="group flex min-h-11 touch-manipulation items-center justify-between bg-card px-6 py-6 no-underline transition-colors duration-200 hover:bg-muted active:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset md:px-8"
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
                      className="group flex min-h-11 touch-manipulation items-center justify-between bg-background px-6 py-5 no-underline transition-colors duration-200 hover:bg-muted active:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset md:px-8"
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
    </>
  );
};

"use client";

import React from "react";
import Link from "next/link";

const MALLOY_PROJECTS = [
  { num: "01", label: "Rebrandly", slug: "malloy-rebrandly" },
  { num: "02", label: "Amal & Co.", slug: "malloy-amal" },
  { num: "03", label: "Noble Note", slug: "malloy-noble-note" },
];

interface MalloyIndexProps {
  currentSlug: string;
}

export const MalloyIndex: React.FC<MalloyIndexProps> = ({ currentSlug }) => {
  return (
    <>
      {/* Desktop: fixed left sidebar */}
      <nav
        aria-label="Malloy Group projects"
        className="hidden lg:flex fixed left-[clamp(16px,3vw,40px)] top-1/2 -translate-y-1/2 z-40 flex-col gap-5"
      >
        {currentSlug !== "malloy" && (
          <Link
            href="/projects/malloy"
            className="annotation text-[10px] tracking-widest text-muted-foreground hover:text-foreground transition-colors no-underline"
          >
            ← MALLOY GROUP
          </Link>
        )}
        <div className="flex flex-col gap-3 border-t border-border pt-4">
          {MALLOY_PROJECTS.map(({ num, label, slug }) => {
            const isCurrent = slug === currentSlug;
            return (
              <Link
                key={slug}
                href={`/projects/${slug}`}
                className={`annotation text-[10px] tracking-widest no-underline transition-colors ${
                  isCurrent
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {num} {label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile/tablet: fixed strip just below the navbar */}
      <div className="lg:hidden fixed top-16 sm:top-20 left-0 right-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border/40 px-6 sm:px-8 py-2.5">
        <nav
          aria-label="Malloy Group projects"
          className="flex items-center gap-4 flex-wrap"
        >
          {currentSlug !== "malloy" && (
            <>
              <Link
                href="/projects/malloy"
                className="annotation text-[10px] tracking-widest text-muted-foreground hover:text-foreground transition-colors no-underline"
              >
                ← MALLOY GROUP
              </Link>
              <span className="text-border" aria-hidden="true">·</span>
            </>
          )}
          {MALLOY_PROJECTS.map(({ num, label, slug }, i) => {
            const isCurrent = slug === currentSlug;
            return (
              <React.Fragment key={slug}>
                <Link
                  href={`/projects/${slug}`}
                  className={`annotation text-[10px] tracking-widest no-underline transition-colors ${
                    isCurrent
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {num} {label}
                </Link>
                {i < MALLOY_PROJECTS.length - 1 && (
                  <span className="text-border" aria-hidden="true">·</span>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>
    </>
  );
};

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
      <nav
        aria-label="Malloy Group projects"
        className="fixed left-[clamp(16px,3vw,40px)] top-1/2 z-40 hidden -translate-y-1/2 lg:flex"
      >
        <div className="overflow-hidden border-[3px] border-foreground bg-card">
          <div className="flex flex-col">
            {currentSlug === "malloy" ? (
              <span className="border-b-[3px] border-foreground bg-primary px-4 py-3 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-primary-foreground no-underline transition-colors hover:bg-accent">
                Malloy group
              </span>
            ) : (
              <Link
                href="/projects/malloy"
                className="border-b-[3px] border-foreground bg-primary px-4 py-3 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-primary-foreground no-underline transition-colors hover:bg-accent"
              >
                Malloy group
              </Link>
            )}
            <div className="flex flex-col">
              {MALLOY_PROJECTS.map(({ num, label, slug }) => {
                const isCurrent = slug === currentSlug;
                return (
                  <Link
                    key={slug}
                    href={`/projects/${slug}`}
                    className={`px-4 py-3 text-[0.68rem] font-bold uppercase tracking-[0.16em] no-underline transition-colors ${
                      isCurrent
                        ? "bg-accent text-accent-foreground"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {num} {label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      <div className="fixed left-0 right-0 top-16 z-30 border-b-[3px] border-foreground bg-card px-6 py-2.5 sm:top-20 sm:px-8 lg:hidden">
        <nav
          aria-label="Malloy Group projects"
          className="flex flex-wrap items-center gap-2"
        >
          {currentSlug === "malloy" ? (
            <span className="bg-primary px-3 py-2 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-primary-foreground no-underline">
              Malloy group
            </span>
          ) : (
            <Link
              href="/projects/malloy"
              className="bg-primary px-3 py-2 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-primary-foreground no-underline"
            >
              Malloy group
            </Link>
          )}
          {MALLOY_PROJECTS.map(({ num, label, slug }) => {
            const isCurrent = slug === currentSlug;
            return (
              <Link
                key={slug}
                href={`/projects/${slug}`}
                className={`px-3 py-2 text-[0.68rem] font-bold uppercase tracking-[0.16em] no-underline ${
                  isCurrent
                    ? "bg-accent text-accent-foreground"
                    : "bg-background text-foreground"
                }`}
              >
                {num} {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};

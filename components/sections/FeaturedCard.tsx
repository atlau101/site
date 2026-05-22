"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ViewTransition } from "react";

interface FeaturedCardProps {
  title: string;
  outcome: string;
  category: string;
  year: string;
  href: string;
  imageSrc?: string;
  imageAlt?: string;
}

export const FeaturedCard: React.FC<FeaturedCardProps> = ({
  title,
  outcome,
  category,
  year,
  href,
  imageSrc,
  imageAlt,
}) => {
  const slug = href.split("/").pop() ?? "card";

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={href}
        transitionTypes={["forward"]}
        className="group block w-full cursor-pointer touch-manipulation no-underline"
      >
        <div className="brutalist-panel overflow-hidden transition-transform duration-200 group-hover:-translate-y-[3px] group-hover:translate-x-[3px] group-active:translate-x-[1px] group-active:translate-y-[1px] group-active:bg-muted md:group-active:bg-card">
          <div className="grid gap-0 md:grid-cols-3">
            <div className="flex flex-col justify-between gap-6 px-6 py-6 md:col-span-2 md:px-8 md:py-8">
              {/* Mobile: category + year on one line; desktop: category only (year pill below) */}
              <span className="annotation text-secondary">
                <span className="md:hidden">{category} · {year}</span>
                <span className="hidden md:inline">{category}</span>
              </span>

              <ViewTransition name={`project-title-${slug}`}>
                <h3 className="font-heading text-3xl font-black leading-[0.95] text-foreground transition-colors duration-200 group-hover:text-primary group-active:text-primary md:text-5xl">
                  {title}
                </h3>
              </ViewTransition>

              <p className="max-w-[38rem] text-base leading-7 text-foreground/78 md:leading-8 md:text-lg">
                {outcome}
              </p>

              <div className="hidden md:inline-flex w-fit border-[3px] border-foreground bg-primary px-3 py-2 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-primary-foreground">
                {year}
              </div>
            </div>

            {/* Image block: hidden on mobile when no real image; shown on desktop always */}
            <div className={`relative overflow-hidden border-t-[3px] border-foreground bg-muted md:min-h-[300px] md:border-l-[3px] md:border-t-0 ${imageSrc ? "min-h-[160px] md:min-h-[300px]" : "hidden md:block md:min-h-[300px]"}`}>
              {imageSrc ? (
                <>
                  <Image
                    src={imageSrc}
                    alt={imageAlt ?? title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-x-0 bottom-0 hidden bg-card/92 p-4 md:block">
                    <span className="annotation text-secondary">{category}</span>
                  </div>
                </>
              ) : (
                <div className="relative h-full w-full">
                  <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0,transparent_2.4rem,var(--color-rule)_2.4rem,var(--color-rule)_2.55rem)] bg-[length:100%_2.55rem]" />
                  <div className="absolute inset-x-5 top-5 h-16 border-[3px] border-foreground bg-primary" />
                  <div className="absolute bottom-5 left-5 right-5 border-[3px] border-foreground bg-card px-4 py-3">
                    <span className="annotation text-secondary">{category}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

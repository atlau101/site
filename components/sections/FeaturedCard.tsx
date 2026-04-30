"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

interface FeaturedCardProps {
  title: string;
  outcome: string;
  category: string;
  year: string;
  href: string;
  imageSrc?: string;
  imageAlt?: string;
}

const LINE_COUNT = 15;

export const FeaturedCard: React.FC<FeaturedCardProps> = ({
  title,
  outcome,
  category,
  year,
  href,
  imageSrc,
  imageAlt,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
    <Link href={href} className="block w-full cursor-pointer group no-underline">
      <div className="bg-card overflow-hidden">
        <div className="bg-popover grid md:grid-cols-3 gap-0">
          {/* Left — content (2/3) */}
          <div className="md:col-span-2 flex flex-col justify-center space-y-5 p-8 md:p-12">
            <span className="annotation text-muted-foreground">{category}</span>

            <h3 className="font-heading text-3xl md:text-4xl font-medium leading-tight text-foreground group-hover:text-primary transition-colors duration-300">
              {title}
              <span
                className="inline-block ml-2 opacity-0 -translate-x-1 group-hover:opacity-100 group-focus-within:opacity-100 group-hover:translate-x-0 group-focus-within:translate-x-0 transition-all duration-200 font-normal"
                aria-hidden="true"
              >
                →
              </span>
            </h3>

            <p className="text-base md:text-lg text-foreground/75">
              {outcome}
            </p>

            <span className="annotation">{year}</span>
          </div>

          {/* Right — image or ruled-paper placeholder (1/3) */}
          <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[300px] overflow-hidden">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={imageAlt ?? title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
            ) : (
              <div className="relative w-full h-full min-h-[240px] bg-paper-low">
                {/* Ruled notebook lines — field journal metaphor */}
                <svg
                  className="absolute inset-0 w-full h-full"
                  aria-hidden="true"
                  preserveAspectRatio="none"
                >
                  {Array.from({ length: LINE_COUNT }, (_, i) => (
                    <line
                      key={i}
                      x1="0"
                      y1={`${((i + 1) / (LINE_COUNT + 1)) * 100}%`}
                      x2="100%"
                      y2={`${((i + 1) / (LINE_COUNT + 1)) * 100}%`}
                      stroke="var(--color-rule)"
                      strokeWidth="0.75"
                      opacity="0.45"
                    />
                  ))}
                </svg>
                {/* Category label — bottom-left, like a page caption */}
                <div className="absolute inset-0 flex items-end justify-start p-6">
                  <span className="annotation text-muted-foreground/60 tracking-widest">
                    {category}
                  </span>
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

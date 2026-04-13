"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";

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
  return (
    <Link href={href} className="block w-full cursor-pointer group">
      <Card className="transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-lg border-none overflow-hidden rounded-xl">
        <div
          className="grid md:grid-cols-2 gap-0"
          style={{ backgroundColor: "#EDE8DF" }}
        >
          {/* Left — content */}
          <div className="flex flex-col justify-center space-y-4 p-8 md:p-12">
            <Badge
              variant="outline"
              className="w-fit text-xs tracking-wide"
              style={{ color: "#C97B4A", borderColor: "#C97B4A" }}
            >
              {category}
            </Badge>

            <h3
              className="text-3xl md:text-4xl font-medium leading-tight"
              style={{
                color: "#1F2A23",
                fontFamily: "var(--font-fraunces)",
              }}
            >
              {title}
            </h3>

            <p
              className="text-base md:text-lg leading-relaxed"
              style={{ color: "#1F2A23", opacity: 0.75 }}
            >
              {outcome}
            </p>

            <p
              className="text-sm font-medium tracking-wider"
              style={{ color: "#C97B4A" }}
            >
              {year}
            </p>
          </div>

          {/* Right — image */}
          <div
            className="relative aspect-[4/3] md:aspect-auto md:min-h-[300px] overflow-hidden"
            style={{ backgroundColor: "#D4CBC0" }}
          >
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={imageAlt ?? title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center min-h-[240px]"
                style={{ color: "#1F2A23", opacity: 0.25 }}
              >
                <span className="text-sm font-medium tracking-wide">
                  {title}
                </span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};

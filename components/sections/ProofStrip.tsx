"use client";

import { motion } from "framer-motion";

const proofItems = [
  {
    label: "Malloy Group · Consulting",
    outcome:
      "Competitive analysis, feasibility study, and GTM strategy — three real client engagements across three semesters.",
  },
  {
    label: "ChamberGPT · SFCC Internship",
    outcome:
      "Production chatbot built on $0 budget. Projected 20–30% reduction in inbound member inquiries.",
  },
  {
    label: "Fillmore Ecosystem · BUS496",
    outcome:
      "$12M in annual economic leakage quantified. Findings presented to a panel of 6 SF executives.",
  },
  {
    label: "B2B Sales Pipeline · Data Mining",
    outcome:
      "B2B CRM dataset segmented into 5 actionable clusters via k-prototypes in R.",
  },
];

export function ProofStrip() {
  return (
    <section className="w-full py-10 px-6 sm:px-8 lg:px-12 bg-primary overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {proofItems.map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{
                duration: 0.48,
                ease: [0.22, 1, 0.36, 1],
                delay: idx * 0.09,
              }}
            >
              <span className="font-mono text-xs tracking-[0.05em] uppercase text-primary-foreground/55">
                {item.label}
              </span>
              <p className="font-heading text-base mt-3 text-primary-foreground leading-snug">
                {item.outcome}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

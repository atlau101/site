"use client";

import { motion } from "framer-motion";

const proofItems = [
  {
    label: "Malloy Group · Consulting",
    outcome:
      "Competitive analysis, feasibility study, and GTM strategy, three real client engagements across three semesters.",
  },
  {
    label: "ChamberGPT · SFCC Internship",
    outcome:
      "Production chatbot built on $0 budget. Projected 20 to 30 percent reduction in inbound member inquiries.",
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
    <section className="w-full overflow-hidden bg-background px-6 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-0 border-[3px] border-foreground sm:grid-cols-2 lg:grid-cols-4">
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
              className={[
                "bg-card px-5 py-5 md:px-6 md:py-6",
                idx > 0 ? "border-t-[3px] border-foreground sm:border-t-0" : "",
                idx === 1 ? "sm:border-l-[3px] sm:border-foreground lg:border-l-0" : "",
                idx > 1 ? "lg:border-l-[3px] lg:border-foreground" : "",
              ].join(" ")}
            >
              <span className="annotation text-secondary">{item.label}</span>
              <p className="mt-3 font-heading text-[1.02rem] leading-snug text-foreground md:text-[1.08rem]">
                {item.outcome}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

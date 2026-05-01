"use client";

import { MotionConfig } from "framer-motion";

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      {children}
    </MotionConfig>
  );
}

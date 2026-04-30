"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { MalloyIndex } from "./MalloyIndex";

function deriveSlug(pathname: string): string | null {
  if (pathname === "/projects/malloy") return "malloy";
  const match = pathname.match(/^\/projects\/(malloy-[\w-]+)$/);
  return match ? match[1] : null;
}

export function MalloyShell() {
  const pathname = usePathname();
  const currentSlug = deriveSlug(pathname);
  const isMalloy = currentSlug !== null;

  return (
    <AnimatePresence>
      {isMalloy && (
        <motion.div
          key="malloy-shell"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <MalloyIndex currentSlug={currentSlug} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

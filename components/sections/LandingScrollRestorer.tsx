"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function LandingScrollRestorer() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const section = searchParams.get("section");

  useEffect(() => {
    if (!section) return;

    const scrollToTarget = () => {
      const target = document.getElementById(section);
      if (!target) return;

      const top = target.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top, behavior: "smooth" });
      router.replace(pathname, { scroll: false });
    };

    let rafB = 0;
    const rafA = window.requestAnimationFrame(() => {
      rafB = window.requestAnimationFrame(scrollToTarget);
    });

    return () => {
      window.cancelAnimationFrame(rafA);
      window.cancelAnimationFrame(rafB);
    };
  }, [pathname, router, section]);

  return null;
}

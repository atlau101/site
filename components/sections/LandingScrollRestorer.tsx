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

    const target = document.getElementById(section);
    if (!target) {
      // Section not found — clean the URL immediately so it doesn't persist
      router.replace(pathname, { scroll: false });
      return;
    }

    const top = target.getBoundingClientRect().top + window.scrollY - 88;

    // Scroll just before the VT animation ends (560ms) so the DOM is already in
    // position when the pseudo-element overlay is removed. Scrolling immediately
    // causes the fixed VT overlay and the scrolled DOM to conflict, creating
    // afterimage artifacts when the user scrolls.
    const scrollTimer = setTimeout(() => {
      window.scrollTo({ top, behavior: "instant" });
    }, 540);

    // Clean the ?section param after the transition is fully done.
    // Calling router.replace() during the VT cancels it, hence the delay.
    const urlTimer = setTimeout(() => {
      router.replace(pathname, { scroll: false });
    }, 620);

    return () => {
      clearTimeout(scrollTimer);
      clearTimeout(urlTimer);
    };
  }, [section, pathname, router]);

  return null;
}

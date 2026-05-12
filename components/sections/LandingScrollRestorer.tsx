"use client";

import { useLayoutEffect } from "react";

export function LandingScrollRestorer() {
  useLayoutEffect(() => {
    const target = sessionStorage.getItem("returnTo");
    if (!target) return;
    sessionStorage.removeItem("returnTo");
    const el = document.getElementById(target);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 88;
    window.scrollTo({ top, behavior: "instant" });
  }, []);

  return null;
}

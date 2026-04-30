"use client";

import * as React from "react";
import { motion, useScroll } from "framer-motion";
import { usePathname } from "next/navigation";

interface NavbarProps {
  name?: string;
  links?: Array<{ label: string; href: string }>;
}

export const Navbar: React.FC<NavbarProps> = ({
  name = "Andrew Lau",
  links = [
    { label: "Work", href: "#work" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ],
}) => {
  const pathname = usePathname();
  const isHome = pathname === "/";

  // On non-home pages, prefix anchor hrefs with "/" so they navigate home then scroll
  const resolvedLinks = links.map((link) => ({
    ...link,
    href: !isHome && link.href.startsWith("#") ? `/${link.href}` : link.href,
  }));

  const [isScrolled, setIsScrolled] = React.useState(false);
  const { scrollY } = useScroll();

  React.useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setIsScrolled(latest > 20);
    });
    return () => unsubscribe();
  }, [scrollY]);

  const handleAnchorClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (isHome && href.startsWith("#")) {
      e.preventDefault();
      const target = document.getElementById(href.slice(1));
      if (target) {
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 bg-background/95 transition-all duration-300 ${
        isScrolled ? "border-b border-border" : ""
      }`}
    >
      <a
        href="#main-content"
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-4 focus-visible:left-4 focus-visible:z-[100] focus-visible:px-4 focus-visible:py-2 focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:rounded-sm focus-visible:text-sm focus-visible:font-medium"
      >
        Skip to content
      </a>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <motion.a
            href="/"
            className="font-heading text-xl sm:text-2xl font-medium tracking-tight text-foreground no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:rounded-sm"
            whileHover={{ opacity: 0.7 }}
            transition={{ duration: 0.2 }}
          >
            {name}
          </motion.a>

          <div className="flex items-center gap-6 sm:gap-8">
            {resolvedLinks.map((link, index) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link.href)}
                className="annotation text-muted-foreground hover:opacity-60 transition-opacity duration-200 no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:rounded-sm focus-visible:opacity-100"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.2 + index * 0.1,
                  ease: "easeOut",
                }}
              >
                {link.label}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

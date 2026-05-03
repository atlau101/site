"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useScroll } from "framer-motion";
import { usePathname } from "next/navigation";

interface NavbarProps {
  name?: string;
  links?: Array<{ label: string; href: string }>;
}

type NavLabelProps = {
  text: string;
};

const SF_TIME_ZONE = "America/Los_Angeles";

function NavLabel({ text }: NavLabelProps) {
  return (
    <>
      <span aria-hidden="true" className="nav-ink-label">
        {Array.from(text).map((char, index) => (
          <span
            key={`${text}-${index}`}
            className="nav-ink-label__char"
            style={{ "--nav-char-index": index } as React.CSSProperties}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
      <span className="sr-only">{text}</span>
    </>
  );
}

export const Navbar: React.FC<NavbarProps> = ({
  name = "Andrew Lau",
  links = [
    { label: "About", href: "#about" },
    { label: "Work", href: "#work" },
    { label: "Contact", href: "#contact" },
  ],
}) => {
  const pathname = usePathname();
  const isHome = pathname === "/";

  // On non-home pages, prefix anchor hrefs with "/" so they navigate home then scroll
  const resolvedLinks = links.map((link) => ({
    ...link,
    href:
      !isHome && link.href.startsWith("#") && link.href !== "#contact"
        ? `/${link.href}`
        : link.href,
  }));

  const [isScrolled, setIsScrolled] = React.useState(false);
  const [sfTime, setSfTime] = React.useState("");
  const { scrollY } = useScroll();

  React.useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setIsScrolled(latest > 20);
    });
    return () => unsubscribe();
  }, [scrollY]);

  React.useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: SF_TIME_ZONE,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const updateTime = () => {
      setSfTime(formatter.format(new Date()));
    };

    updateTime();
    const intervalId = window.setInterval(updateTime, 30000);

    return () => window.clearInterval(intervalId);
  }, []);

  const handleAnchorClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith("#")) {
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
      className={`fixed top-0 left-0 right-0 z-50 bg-background/95 transition-all duration-300 ${isScrolled ? "border-b border-border" : ""
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
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Link
              href="/"
              transitionTypes={!isHome ? ["backward"] : undefined}
              className="nav-kinetic-link nav-kinetic-link--name font-heading text-xl sm:text-2xl font-medium tracking-tight text-foreground no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:rounded-sm"
            >
              <NavLabel text={name} />
            </Link>
          </motion.div>

          <div className="flex items-center gap-6 sm:gap-8">
            <div
              aria-label={sfTime ? `San Francisco time ${sfTime}` : "San Francisco time"}
              className="hidden md:flex items-center gap-2.5 text-muted-foreground"
            >
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-primary/80" />
              <span className="annotation text-foreground/80">
                SF {sfTime || "--:-- --"}
              </span>
            </div>
            {resolvedLinks.map((link, index) => {
              const isLocalAnchor = link.href.startsWith("#");
              const itemClassName =
                "nav-kinetic-link annotation text-muted-foreground no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:rounded-sm";

              if (isLocalAnchor) {
                return (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleAnchorClick(e, link.href)}
                    className={itemClassName}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.2 + index * 0.1,
                      ease: "easeOut",
                    }}
                  >
                    <NavLabel text={link.label} />
                  </motion.a>
                );
              }

              return (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.2 + index * 0.1,
                    ease: "easeOut",
                  }}
                >
                  <Link
                    href={link.href}
                    transitionTypes={["backward"]}
                    className={itemClassName}
                  >
                    <NavLabel text={link.label} />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useScroll } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReturnHomeAnchorLink } from "./ReturnHomeAnchorLink";

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
        const top = target.getBoundingClientRect().top + window.scrollY - 88;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className={`fixed left-0 right-0 top-0 z-50 border-b-[3px] border-foreground bg-card/95 transition-all duration-300 ${
        isScrolled ? "shadow-[0_8px_0_var(--color-paper-container)]" : ""
      }`}
    >
      <a
        href="#main-content"
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:left-4 focus-visible:top-4 focus-visible:z-[100] focus-visible:border-[3px] focus-visible:border-foreground focus-visible:bg-primary focus-visible:px-4 focus-visible:py-2 focus-visible:text-xs focus-visible:font-bold focus-visible:uppercase focus-visible:tracking-[0.16em] focus-visible:text-primary-foreground focus-visible:outline-none"
      >
        Skip to content
      </a>
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="flex h-16 items-center justify-between gap-4 sm:h-20">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <Link
              href="/"
              transitionTypes={!isHome ? ["backward"] : undefined}
              className="nav-kinetic-link nav-kinetic-link--name font-heading text-[0.88rem] font-black uppercase tracking-[0.18em] text-foreground no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card sm:text-[0.98rem]"
            >
              <NavLabel text={name} />
            </Link>
          </motion.div>

          <div className="flex items-center gap-3 sm:gap-5">
            <div
              aria-label={sfTime ? `San Francisco time ${sfTime}` : "San Francisco time"}
              className="hidden border-[3px] border-foreground bg-background px-3 py-2 md:flex md:items-center md:gap-3"
            >
              <span aria-hidden className="h-2.5 w-2.5 bg-primary" />
              <span className="annotation text-foreground">
                SF {sfTime || "--:-- --"}
              </span>
            </div>

            {links.map((link, index) => {
              const isLocalAnchor = link.href.startsWith("#");
              const isReturnToLandingSection =
                !isHome && isLocalAnchor && link.href !== "#contact";
              const itemClassName =
                "nav-kinetic-link annotation text-foreground/72 no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card";

              if (isHome && isLocalAnchor) {
                return (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleAnchorClick(e, link.href)}
                    className={itemClassName}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.45,
                      delay: 0.18 + index * 0.08,
                      ease: "easeOut",
                    }}
                  >
                    <NavLabel text={link.label} />
                  </motion.a>
                );
              }

              if (isReturnToLandingSection) {
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.45,
                      delay: 0.18 + index * 0.08,
                      ease: "easeOut",
                    }}
                  >
                    <ReturnHomeAnchorLink
                      targetId={link.href.slice(1)}
                      className={itemClassName}
                    >
                      <NavLabel text={link.label} />
                    </ReturnHomeAnchorLink>
                  </motion.div>
                );
              }

              return (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.45,
                    delay: 0.18 + index * 0.08,
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

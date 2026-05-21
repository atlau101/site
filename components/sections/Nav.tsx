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

function ResponsiveNavLabel({ text }: NavLabelProps) {
  return (
    <>
      <span className="md:hidden">{text}</span>
      <span className="hidden md:inline">
        <NavLabel text={text} />
      </span>
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const mobileMenuRef = React.useRef<HTMLDialogElement>(null);
  const mobileMenuTriggerRef = React.useRef<HTMLButtonElement>(null);
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

  React.useEffect(() => {
    const mobileMenu = mobileMenuRef.current;
    if (!mobileMenu) return;

    if (isMobileMenuOpen && !mobileMenu.open) {
      mobileMenu.showModal();
    }

    if (!isMobileMenuOpen && mobileMenu.open) {
      mobileMenu.close();
    }
  }, [isMobileMenuOpen]);

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
    mobileMenuTriggerRef.current?.focus();
  };

  const handleMobileMenuCancel = (e: React.SyntheticEvent<HTMLDialogElement>) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
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
            className="flex items-center gap-3"
          >
            <Link
              href="/"
              transitionTypes={!isHome ? ["backward"] : undefined}
              className="nav-kinetic-link nav-kinetic-link--name font-heading text-[0.88rem] font-black uppercase tracking-[0.18em] text-foreground no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card sm:text-[0.98rem]"
            >
              <ResponsiveNavLabel text={name} />
            </Link>
            <div className="flex items-center gap-1.5">
              <a
                href="https://www.linkedin.com/in/atlau101/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
                className="flex h-11 w-11 touch-manipulation items-center justify-center text-foreground/40 transition-colors duration-200 hover:text-foreground active:bg-muted active:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card md:h-auto md:w-auto"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px] md:h-3.5 md:w-3.5" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="https://github.com/atlau101"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                className="flex h-11 w-11 touch-manipulation items-center justify-center text-foreground/40 transition-colors duration-200 hover:text-foreground active:bg-muted active:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card md:h-auto md:w-auto"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px] md:h-3.5 md:w-3.5" aria-hidden="true">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.09.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </a>
            </div>
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

            <button
              ref={mobileMenuTriggerRef}
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="annotation flex min-h-11 touch-manipulation items-center border-[3px] border-foreground bg-background px-3 text-foreground transition-colors duration-200 active:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card md:hidden"
            >
              Menu
            </button>

            <div className="hidden items-center gap-3 sm:gap-5 md:flex">
              {links.map((link, index) => {
                const isLocalAnchor = link.href.startsWith("#");
                const isReturnToLandingSection =
                  !isHome && isLocalAnchor && link.href !== "#contact";
                const itemClassName =
                  "nav-kinetic-link annotation text-foreground/72 no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card";

                if (isLocalAnchor && (isHome || link.href === "#contact")) {
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
      </div>

      <dialog
        ref={mobileMenuRef}
        onClose={handleMobileMenuClose}
        onCancel={handleMobileMenuCancel}
        className="m-0 h-[100svh] max-h-none w-screen max-w-none border-0 bg-background p-0 text-foreground backdrop:bg-foreground/45 md:hidden"
      >
        <div className="flex h-full flex-col px-6 py-6">
          <div className="flex items-center justify-between border-b-[3px] border-foreground pb-5">
            <span className="annotation text-secondary">Navigate</span>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="annotation flex min-h-11 touch-manipulation items-center border-[3px] border-foreground bg-card px-3 text-foreground transition-colors duration-200 active:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Close
            </button>
          </div>

          <div className="flex flex-1 flex-col justify-center gap-3">
            {links.map((link) => {
              const isLocalAnchor = link.href.startsWith("#");
              const isReturnToLandingSection =
                !isHome && isLocalAnchor && link.href !== "#contact";
              const itemClassName =
                "flex min-h-16 touch-manipulation items-center border-b border-foreground py-3 font-heading text-[2rem] font-black uppercase leading-[0.95] text-foreground no-underline transition-colors duration-200 active:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

              if (isLocalAnchor && (isHome || link.href === "#contact")) {
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      setIsMobileMenuOpen(false);
                      handleAnchorClick(e, link.href);
                    }}
                    className={itemClassName}
                  >
                    {link.label}
                  </a>
                );
              }

              if (isReturnToLandingSection) {
                return (
                  <ReturnHomeAnchorLink
                    key={link.href}
                    targetId={link.href.slice(1)}
                    className={itemClassName}
                  >
                    {link.label}
                  </ReturnHomeAnchorLink>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  transitionTypes={["backward"]}
                  className={itemClassName}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </dialog>
    </motion.nav>
  );
};

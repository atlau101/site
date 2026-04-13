"use client";

import * as React from "react";
import { motion, useScroll } from "framer-motion";

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
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { scrollY } = useScroll();

  React.useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setIsScrolled(latest > 20);
    });
    return () => unsubscribe();
  }, [scrollY]);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "border-b border-[#1F2A23]/10" : ""
      }`}
      style={{ backgroundColor: "#F7F3EC" }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <motion.a
            href="/"
            className="font-serif text-xl sm:text-2xl font-medium tracking-tight"
            style={{ color: "#1F2A23", fontFamily: "var(--font-fraunces)" }}
            whileHover={{ opacity: 0.7 }}
            transition={{ duration: 0.2 }}
          >
            {name}
          </motion.a>

          <div className="flex items-center gap-6 sm:gap-8">
            {links.map((link, index) => (
              <motion.a
                key={link.href}
                href={link.href}
                className="text-sm sm:text-base font-normal tracking-wide hover:opacity-60 transition-opacity duration-200"
                style={{ color: "#1F2A23" }}
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

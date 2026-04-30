import React from "react";

interface FooterProps {
  name?: string;
}

export function Footer({ name = "Andrew Lau" }: FooterProps) {
  const contactRows = [
    {
      label: "EMAIL",
      display: "andrew.t.lau101@gmail.com",
      href: "mailto:andrew.t.lau101@gmail.com",
    },
    {
      label: "LINKEDIN",
      display: "atlau101",
      href: "https://www.linkedin.com/in/atlau101/",
    },
    {
      label: "GITHUB",
      display: "atlau101",
      href: "https://github.com/atlau101",
    },
  ];

  return (
    <footer id="contact" className="w-full bg-paper-dim text-foreground">
      {/* ── CTA section ───────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-16 md:pt-24 pb-16 md:pb-20">
        {/* Label */}
        <p className="annotation text-muted-foreground mb-10 md:mb-14 text-xs tracking-widest uppercase">
          Get in touch · 04
        </p>

        {/* Headline */}
        <div className="mb-16 md:mb-24">
          <h2
            className="font-heading font-medium text-foreground leading-[1.05]"
            style={{
              fontSize: "clamp(2.25rem, 6vw, 4.5rem)",
            }}
          >
            Looking for client-facing,
            <br />
            data-focused roles
          </h2>
          <p
            className="font-heading font-medium italic text-primary leading-[1.05] mt-1"
            style={{
              fontSize: "clamp(2.25rem, 6vw, 4.5rem)",
            }}
          >
            where flexible thinking
            <br />
            and communication matters.
          </p>
        </div>

        {/* Bottom: blurb + contact rows */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10 md:gap-16">
          <p className="annotation normal-case text-muted-foreground text-sm leading-relaxed max-w-xs">
            GTM, Sales, Analytics, or anything in between.
            <br />
            If you&apos;re hiring for a role where ideas and data
            work together, I&apos;d love to chat.
          </p>

          {/* Contact rows */}
          <div className="flex flex-col min-w-[260px]">
            {contactRows.map((row, i) => (
              <a
                key={row.label}
                href={row.href}
                target={row.href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className={`flex items-center justify-between gap-8 py-4 no-underline group transition-opacity duration-200 hover:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:rounded-sm ${i < contactRows.length - 1 ? "border-b border-border" : ""
                  }`}
              >
                <span className="annotation text-xs text-muted-foreground tracking-widest uppercase shrink-0">
                  {row.label}
                </span>
                <span className="font-heading text-base font-medium text-foreground text-right">
                  {row.display}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Footer strip ──────────────────────────────────────────── */}
      <div className="border-t border-border px-6 sm:px-8 lg:px-12 py-5">
        <div className="max-w-7xl mx-auto annotation normal-case text-muted-foreground text-xs">
          © {new Date().getFullYear()} {name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

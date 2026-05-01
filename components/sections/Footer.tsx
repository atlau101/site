"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface FooterProps {
  name?: string;
}

type FormStatus = "idle" | "submitting" | "success" | "error";

export function Footer({ name = "Andrew Lau" }: FooterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({ name: "", email: "", message: "", _hp: "" });
  const formRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        nameInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "Something went wrong");
      }

      setStatus("success");
      setForm({ name: "", email: "", message: "", _hp: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  const inputBase =
    "w-full bg-transparent border-b border-border font-heading text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors duration-150 py-2";

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

          {/* Contact rows + email form */}
          <div className="flex flex-col min-w-[260px]">
            {contactRows.map((row, i) => (
              <a
                key={row.label}
                href={row.href}
                target={row.href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className={`flex items-center justify-between gap-8 py-4 no-underline group transition-opacity duration-200 hover:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:rounded-sm ${
                  i < contactRows.length - 1 ? "border-b border-border" : ""
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

            {/* Send email toggle */}
            <div className="mt-6">
              {status !== "success" ? (
                <button
                  onClick={() => setIsOpen((v) => !v)}
                  className="annotation text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors duration-150 focus-visible:outline-none focus-visible:underline"
                >
                  {isOpen ? "Close" : "Send me an email →"}
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <p className="annotation text-xs tracking-widest uppercase text-muted-foreground">
                    Thanks. I&apos;ll be in touch.
                  </p>
                  <button
                    onClick={() => { setStatus("idle"); setIsOpen(false); }}
                    className="annotation text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors duration-150 focus-visible:outline-none focus-visible:underline self-start"
                  >
                    Close
                  </button>
                </div>
              )}

              <AnimatePresence>
                {isOpen && status !== "success" && (
                  <motion.div
                    ref={formRef}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <form onSubmit={handleSubmit} className="pt-6 flex flex-col gap-5">
                      {/* Honeypot — hidden from real users */}
                      <input
                        type="text"
                        name="_hp"
                        value={form._hp}
                        onChange={(e) => setForm((f) => ({ ...f, _hp: e.target.value }))}
                        tabIndex={-1}
                        aria-hidden="true"
                        className="hidden"
                      />

                      <div className="flex flex-col gap-1">
                        <label htmlFor="contact-name" className="annotation text-xs tracking-widest uppercase text-muted-foreground">
                          Name
                        </label>
                        <input
                          ref={nameInputRef}
                          id="contact-name"
                          type="text"
                          required
                          maxLength={200}
                          value={form.name}
                          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                          placeholder="Your name"
                          className={inputBase}
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label htmlFor="contact-email" className="annotation text-xs tracking-widest uppercase text-muted-foreground">
                          Email
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          required
                          maxLength={320}
                          value={form.email}
                          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                          placeholder="you@example.com"
                          className={inputBase}
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label htmlFor="contact-message" className="annotation text-xs tracking-widest uppercase text-muted-foreground">
                          Message
                        </label>
                        <textarea
                          id="contact-message"
                          required
                          maxLength={5000}
                          rows={4}
                          value={form.message}
                          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                          placeholder="What would you like to discuss?"
                          className={`${inputBase} resize-none`}
                        />
                      </div>

                      {status === "error" && (
                        <div className="flex flex-col gap-1" role="alert">
                          <p className="annotation text-xs text-destructive normal-case">
                            {errorMsg || "Something went wrong. Try again or email me directly."}
                          </p>
                          <a
                            href="mailto:andrew.t.lau101@gmail.com"
                            className="annotation text-xs text-muted-foreground underline normal-case hover:text-foreground transition-colors duration-150"
                          >
                            andrew.t.lau101@gmail.com
                          </a>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={status === "submitting"}
                        className="annotation text-xs tracking-widest uppercase text-foreground border border-border py-3 px-4 hover:bg-foreground hover:text-background transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {status === "submitting" ? "Sending…" : "Send →"}
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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

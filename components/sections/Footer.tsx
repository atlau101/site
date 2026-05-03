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
    "w-full border-b-[3px] border-foreground bg-transparent py-3 text-sm text-foreground placeholder:text-foreground/42 focus:border-primary focus:outline-none transition-colors duration-150";

  return (
    <footer id="contact" className="w-full bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12 md:py-24">
        <div className="overflow-hidden border-[3px] border-foreground bg-card">
          <div className="grid gap-0 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="border-b-[3px] border-foreground px-6 py-6 lg:border-b-0 lg:border-r-[3px] md:px-8 md:py-8">
              <p className="annotation text-secondary">Get in touch / 04</p>

              <div className="mt-10">
                <h2
                  className="font-heading font-black uppercase leading-[0.92] text-foreground"
                  style={{ fontSize: "clamp(2.7rem, 6vw, 5.6rem)" }}
                >
                  Looking for
                  <br />
                  client-facing,
                  <br />
                  data-focused roles
                </h2>
                <p className="mt-6 max-w-[33rem] text-base leading-8 text-foreground/78 md:text-lg">
                  GTM, sales, analytics, or anything in between. If you&apos;re hiring for a role where ideas and data work together, I&apos;d love to chat.
                </p>
              </div>
            </div>

            <div className="bg-muted px-6 py-6 md:px-8 md:py-8">
              <div className="space-y-0">
                {contactRows.map((row, i) => (
                  <a
                    key={row.label}
                    href={row.href}
                    target={row.href.startsWith("mailto") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className={`group flex items-center justify-between gap-8 py-4 no-underline transition-colors duration-200 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-muted ${
                      i < contactRows.length - 1 ? "border-b-[3px] border-foreground" : ""
                    }`}
                  >
                    <span className="annotation text-secondary">{row.label}</span>
                    <span className="font-heading text-base font-black uppercase tracking-[-0.03em] text-right text-foreground md:text-lg">
                      {row.display}
                    </span>
                  </a>
                ))}
              </div>

              <div className="mt-8">
                {status !== "success" ? (
                  <button
                    onClick={() => setIsOpen((v) => !v)}
                    className="brutalist-button px-4 py-3 text-[0.72rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-muted"
                  >
                    {isOpen ? "Close form" : "Send an email"}
                  </button>
                ) : (
                  <div className="flex flex-col gap-3">
                    <p className="annotation text-secondary">Thanks. I&apos;ll be in touch.</p>
                    <button
                      onClick={() => {
                        setStatus("idle");
                        setIsOpen(false);
                      }}
                      className="brutalist-button w-fit px-4 py-3 text-[0.72rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-muted"
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
                      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5 border-t-[3px] border-foreground pt-6">
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
                          <label htmlFor="contact-name" className="annotation text-secondary">
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
                          <label htmlFor="contact-email" className="annotation text-secondary">
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
                          <label htmlFor="contact-message" className="annotation text-secondary">
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
                            <p className="annotation text-destructive normal-case">
                              {errorMsg || "Something went wrong. Try again or email me directly."}
                            </p>
                            <a
                              href="mailto:andrew.t.lau101@gmail.com"
                              className="annotation text-secondary normal-case underline underline-offset-4"
                            >
                              andrew.t.lau101@gmail.com
                            </a>
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={status === "submitting"}
                          className="brutalist-button w-fit px-4 py-3 text-[0.72rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-muted disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {status === "submitting" ? "Sending" : "Send"}
                        </button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t-[3px] border-foreground bg-accent px-6 py-5 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl text-[0.72rem] font-bold uppercase tracking-[0.16em] text-accent-foreground">
          {name} 2026
        </div>
      </div>
    </footer>
  );
}

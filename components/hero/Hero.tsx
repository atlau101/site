"use client";

import { useEffect, useRef, useState } from "react";

type HeroEntropyController = {
  destroy: () => void;
  setPaused: (paused: boolean) => void;
};

const HERO_HEADLINE =
  "I untangle ambiguous questions and turn them into something actionable.";

export function Hero() {
  const textRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const controllerRef = useRef<HeroEntropyController | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let controller: HeroEntropyController | undefined;
    (async () => {
      const mod = await import("./hero-entropy.js");
      controller = mod.init(
        "hero-entropy-canvas",
        textRef.current,
        headlineRef.current,
      );
      controllerRef.current = controller ?? null;
    })();
    return () => {
      controllerRef.current = null;
      controller?.destroy();
    };
  }, []);

  useEffect(() => {
    controllerRef.current?.setPaused(isPaused);
  }, [isPaused]);

  return (
    <section className="relative w-full min-h-[100svh] bg-background md:min-h-[85vh]">
      <canvas
        id="hero-entropy-canvas"
        aria-hidden="true"
        className="absolute inset-0 block h-full w-full"
      />

      <button
        type="button"
        aria-pressed={isPaused}
        onClick={() => setIsPaused((paused) => !paused)}
        className="absolute right-4 top-4 z-20 inline-flex h-10 items-center justify-center border border-foreground/20 bg-background/82 px-3 text-foreground/68 transition-colors hover:bg-card hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring active:bg-card sm:right-6 sm:top-6 sm:px-4"
      >
        <span className="annotation" style={{ letterSpacing: "0.12em" }}>
          {isPaused ? "Resume" : "Pause"}
        </span>
      </button>

      <div
        ref={textRef}
        className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-center px-6 py-16 sm:px-8 lg:px-12 md:py-24"
        style={{ opacity: 0 }}
      >
        <div className="mx-auto w-full max-w-7xl">
          <h1
            ref={headlineRef}
            className="pointer-events-auto max-w-full font-heading font-black uppercase text-primary md:max-w-[65%]"
            style={{
              letterSpacing: "-0.02em",
              fontSize: "clamp(1.6rem, 2.8vw + 0.5rem, 3.2rem)",
              lineHeight: 1.05,
            }}
          >
            {HERO_HEADLINE}
          </h1>

          <p
            data-hero-aux
            className="annotation mt-4 text-foreground/72"
            style={{ opacity: 0, fontSize: "0.72rem", letterSpacing: "0.08em" }}
          >
            Problem solver · analyst · tinkerer
          </p>
        </div>
      </div>

      <p
        className="pointer-events-none absolute bottom-5 left-1/2 z-20 w-full max-w-[18rem] -translate-x-1/2 px-6 text-center annotation select-none md:bottom-3 xl:bottom-8"
        style={{
          opacity: 0.38,
          letterSpacing: "0.12em",
          fontSize: "0.65rem",
        }}
        aria-hidden="true"
      >
        {isPaused ? "FIELD PAUSED" : "MOVE CURSOR TO FIND THE SIGNAL"}
      </p>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

type HeroEntropyController = {
  destroy: () => void;
  setPaused: (paused: boolean) => void;
};

export function Hero() {
  const textRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<HeroEntropyController | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let controller: HeroEntropyController | undefined;
    (async () => {
      const mod = await import("./hero-entropy.js");
      controller = mod.init("hero-entropy-canvas", textRef.current);
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
    <section className="relative w-full min-h-[100svh] md:min-h-[85vh] bg-background">
      {/* WebGL canvas — transparent, particles render over cream bg */}
      <canvas
        id="hero-entropy-canvas"
        aria-hidden="true"
        className="absolute inset-0 w-full h-full block"
      />

      <button
        type="button"
        aria-pressed={isPaused}
        onClick={() => setIsPaused((paused) => !paused)}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 inline-flex h-11 items-center justify-center border border-border bg-background/80 px-3 sm:px-4 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring active:bg-muted/80"
      >
        <span className="annotation">{isPaused ? "Resume" : "Pause"}</span>
      </button>

      {/* Text overlay — opacity driven by signal strength from canvas */}
      <div
        ref={textRef}
        className="absolute inset-0 z-10 flex flex-col justify-between px-6 sm:px-8 lg:px-12 py-16 md:py-24 pointer-events-none"
        style={{ opacity: 0 }}
      >
        <div className="max-w-7xl w-full mx-auto flex flex-col justify-between h-full flex-1">
          {/* Name — top left */}
          <p
            className="font-heading italic text-foreground"
            style={{
              fontSize: "clamp(1.75rem, 3.5vw + 0.75rem, 3.5rem)",
              fontWeight: 400,
              letterSpacing: "-0.015em",
              lineHeight: 1,
            }}
          >
            Andrew Lau
          </p>

          {/* Headline — center */}
          <h1
            className="font-heading font-semibold text-primary my-8 md:my-12 max-w-full md:max-w-[55%]"
            style={{
              letterSpacing: "-0.009em",
              fontSize: "clamp(1.875rem, 4vw + 1rem, 4.5rem)",
              lineHeight: 1.05,
            }}
          >
            I untangle ambiguous questions and turn them into something actionable.
          </h1>

          {/* Role — bottom left */}
          <p className="annotation">—— PROBLEM SOLVER · ANALYST · TINKERER</p>
        </div>
      </div>

      {/* Cursor hint — visible briefly before first interaction */}
      <p
        className="absolute bottom-5 md:bottom-3 xl:bottom-8 left-1/2 -translate-x-1/2 z-20 w-full max-w-[18rem] px-6 text-center annotation pointer-events-none select-none"
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

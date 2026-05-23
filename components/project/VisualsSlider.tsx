'use client';
import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ProjectVisual } from '@/lib/projects/types';

interface VisualsSliderProps {
  visuals: ProjectVisual[];
}

export const VisualsSlider: React.FC<VisualsSliderProps> = ({ visuals }) => {
  const [idx, setIdx] = useState(0);
  const reduced = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const n = visuals.length;

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const scrollToIndex = (nextIdx: number) => {
    const track = trackRef.current;
    if (!track) return;
    const next = Math.max(0, Math.min(nextIdx, n - 1));
    track.scrollTo({
      left: next * track.clientWidth,
      behavior: reduced ? 'auto' : 'smooth',
    });
    setIdx(next);
  };

  const advance = () => scrollToIndex(idx + 1);

  const goBack = () => {
    scrollToIndex(idx - 1);
  };

  const handleScroll = () => {
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      const track = trackRef.current;
      rafRef.current = null;
      if (!track) return;
      const width = track.clientWidth || 1;
      const next = Math.max(0, Math.min(Math.round(track.scrollLeft / width), n - 1));
      setIdx(next);
    });
  };

  return (
    <div
      role="region"
      aria-label="Project images"
      tabIndex={0}
      className="outline-none focus-visible:ring-1 focus-visible:ring-ring"
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft')  goBack();
        if (e.key === 'ArrowRight') advance();
      }}
    >
      {/* Arrows + horizontal swipe row */}
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={goBack}
          disabled={idx === 0}
          className="flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center text-muted-foreground transition-colors hover:text-foreground active:text-foreground disabled:pointer-events-none disabled:opacity-25"
          aria-label="Previous image"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="relative flex-1 min-w-0">
          <div
            ref={trackRef}
            onScroll={handleScroll}
            className={`flex w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${reduced ? '' : 'scroll-smooth'}`}
          >
            {visuals.map((visual, i) => (
              <div
                key={`${visual.src}-${i}`}
                className="flex w-full shrink-0 snap-center select-none items-center justify-center bg-[oklch(0.974_0.005_95)]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={visual.src}
                  alt={visual.caption}
                  draggable={false}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  className="block h-auto max-h-[min(72vh,44rem)] w-auto max-w-full"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={advance}
          disabled={idx === n - 1}
          className="flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center text-muted-foreground transition-colors hover:text-foreground active:text-foreground disabled:pointer-events-none disabled:opacity-25"
          aria-label="Next image"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Dot indicators */}
      {visuals.length > 1 && (
        <div className="flex gap-1.5 justify-center mt-1" aria-hidden="true">
          {visuals.map((_, i) => (
            <div
              key={i}
              className="h-[3px] rounded-full transition-all duration-300"
              style={{
                width: i === idx ? '1rem' : '0.375rem',
                background:
                  i === idx
                    ? 'oklch(0.18 0.005 120)'
                    : 'oklch(0.18 0.005 120 / 0.22)',
              }}
            />
          ))}
        </div>
      )}

      {/* Caption + counter */}
      <div className="flex items-start justify-between mt-3 gap-4">
        <AnimatePresence mode="wait">
          <motion.p
            key={idx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={reduced ? { duration: 0 } : { duration: 0.12 }}
            className="annotation text-muted-foreground"
          >
            {visuals[idx].caption}
          </motion.p>
        </AnimatePresence>
        <span
          className="annotation text-muted-foreground shrink-0"
          aria-live="polite"
          aria-atomic="true"
        >
          {`${String(idx + 1).padStart(2, '0')} / ${String(visuals.length).padStart(2, '0')}`}
        </span>
      </div>
    </div>
  );
};

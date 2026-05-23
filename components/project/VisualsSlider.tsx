'use client';
import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ProjectVisual } from '@/lib/projects/types';

interface VisualsSliderProps {
  visuals: ProjectVisual[];
}

export const VisualsSlider: React.FC<VisualsSliderProps> = ({ visuals }) => {
  const [idx, setIdx] = useState(0);
  const reduced = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const lightboxRef = useRef<HTMLDialogElement>(null);
  const lightboxTriggerRef = useRef<HTMLButtonElement | null>(null);
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

  const openLightbox = (trigger: HTMLButtonElement) => {
    lightboxTriggerRef.current = trigger;
    const lightbox = lightboxRef.current;
    if (lightbox && !lightbox.open) {
      lightbox.showModal();
    }
  };

  const closeLightbox = () => {
    lightboxRef.current?.close();
  };

  const handleLightboxClose = () => {
    lightboxTriggerRef.current?.focus();
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
      <div className="relative left-1/2 w-[calc(100vw-2rem)] -translate-x-1/2 md:left-auto md:w-auto md:translate-x-0">
        {/* Arrows + horizontal swipe row */}
        <div className="flex items-center md:gap-4">
          <button
            onClick={goBack}
            disabled={idx === 0}
            className="hidden h-11 w-11 shrink-0 touch-manipulation items-center justify-center text-muted-foreground transition-colors hover:text-foreground active:text-foreground disabled:pointer-events-none disabled:opacity-25 md:flex"
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
                  className="relative flex w-full shrink-0 snap-center select-none items-center justify-center overflow-hidden bg-[oklch(0.974_0.005_95)] md:min-h-0"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={visual.src}
                    alt={visual.caption}
                    draggable={false}
                    loading={i === 0 ? 'eager' : 'lazy'}
                    className="block h-auto w-full object-contain md:max-h-[min(72vh,44rem)] md:w-auto md:max-w-full"
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={advance}
            disabled={idx === n - 1}
            className="hidden h-11 w-11 shrink-0 touch-manipulation items-center justify-center text-muted-foreground transition-colors hover:text-foreground active:text-foreground disabled:pointer-events-none disabled:opacity-25 md:flex"
            aria-label="Next image"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="mt-3 flex items-center justify-center gap-2 md:hidden">
          {visuals.length > 1 && (
            <button
              type="button"
              onClick={goBack}
              disabled={idx === 0}
              className="flex h-11 w-11 touch-manipulation items-center justify-center border border-foreground/20 bg-background/80 text-muted-foreground transition-colors active:bg-muted active:text-foreground disabled:pointer-events-none disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Previous image"
            >
              <ChevronLeft size={18} />
            </button>
          )}
          <span className="annotation min-w-16 text-center text-muted-foreground" aria-live="polite" aria-atomic="true">
            {`${String(idx + 1).padStart(2, '0')} / ${String(visuals.length).padStart(2, '0')}`}
          </span>
          {visuals.length > 1 && (
            <button
              type="button"
              onClick={advance}
              disabled={idx === n - 1}
              className="flex h-11 w-11 touch-manipulation items-center justify-center border border-foreground/20 bg-background/80 text-muted-foreground transition-colors active:bg-muted active:text-foreground disabled:pointer-events-none disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Next image"
            >
              <ChevronRight size={18} />
            </button>
          )}
          <button
            type="button"
            onClick={(e) => openLightbox(e.currentTarget)}
            className="flex h-11 w-11 touch-manipulation items-center justify-center border border-foreground/20 bg-background/80 text-muted-foreground transition-colors active:bg-muted active:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`View full image: ${visuals[idx].caption}`}
          >
            <Maximize2 size={17} />
          </button>
        </div>

        <div className="mt-3 hidden items-center justify-center md:flex">
          <button
            type="button"
            onClick={(e) => openLightbox(e.currentTarget)}
            className="flex h-11 w-11 touch-manipulation items-center justify-center border border-foreground/20 bg-background/80 text-muted-foreground transition-colors hover:bg-muted active:bg-muted active:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`View full image: ${visuals[idx].caption}`}
          >
            <Maximize2 size={17} />
          </button>
        </div>

        {/* Dot indicators */}
        {visuals.length > 1 && (
          <div className="mt-1 hidden justify-center gap-1.5 md:flex" aria-hidden="true">
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
      </div>

      {/* Caption + counter */}
      <div className="mt-3 flex items-start justify-between gap-4">
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
          className="annotation hidden shrink-0 text-muted-foreground md:inline"
          aria-live="polite"
          aria-atomic="true"
        >
            {`${String(idx + 1).padStart(2, '0')} / ${String(visuals.length).padStart(2, '0')}`}
        </span>
      </div>

      <dialog
        ref={lightboxRef}
        onClose={handleLightboxClose}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') {
            e.preventDefault();
            goBack();
          }
          if (e.key === 'ArrowRight') {
            e.preventDefault();
            advance();
          }
        }}
        className="m-0 h-[100svh] max-h-none w-screen max-w-none border-0 bg-[oklch(0.974_0.005_95)] p-0 text-foreground backdrop:bg-foreground/55"
      >
        <div className="flex h-full flex-col">
          <div className="flex min-h-16 items-center justify-between gap-3 border-b border-foreground/20 px-4 py-3">
            <p className="annotation truncate text-muted-foreground">{visuals[idx].caption}</p>
            <button
              type="button"
              onClick={closeLightbox}
              className="flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center border border-foreground/25 bg-background text-foreground transition-colors hover:bg-muted active:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Close full image view"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-[3rem_minmax(0,1fr)_3rem] items-center gap-1 px-2 py-3 md:grid-cols-[4.5rem_minmax(0,1fr)_4.5rem] md:px-4">
            <button
              type="button"
              onClick={goBack}
              disabled={idx === 0}
              className="flex h-12 w-12 touch-manipulation items-center justify-center justify-self-center text-foreground transition-colors hover:bg-muted active:bg-muted disabled:pointer-events-none disabled:opacity-25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Previous full image"
            >
              <ChevronLeft size={24} />
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={visuals[idx].src}
                initial={reduced ? { opacity: 1 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduced ? { opacity: 1 } : { opacity: 0 }}
                transition={reduced ? { duration: 0 } : { duration: 0.14 }}
                className="flex min-h-0 items-center justify-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={visuals[idx].src}
                  alt={visuals[idx].caption}
                  draggable={false}
                  className="block max-h-[calc(100svh-9.5rem)] max-w-full object-contain"
                />
              </motion.div>
            </AnimatePresence>

            <button
              type="button"
              onClick={advance}
              disabled={idx === n - 1}
              className="flex h-12 w-12 touch-manipulation items-center justify-center justify-self-center text-foreground transition-colors hover:bg-muted active:bg-muted disabled:pointer-events-none disabled:opacity-25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Next full image"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <div className="flex min-h-14 items-center justify-between gap-4 border-t border-foreground/20 px-4 py-3">
            <p className="annotation min-w-0 text-muted-foreground">{visuals[idx].caption}</p>
            <span className="annotation shrink-0 text-muted-foreground" aria-live="polite" aria-atomic="true">
              {`${String(idx + 1).padStart(2, '0')} / ${String(visuals.length).padStart(2, '0')}`}
            </span>
          </div>
        </div>
      </dialog>
    </div>
  );
};

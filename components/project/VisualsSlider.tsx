'use client';
import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ProjectVisual } from '@/lib/projects/types';

const isVideoSrc = (src: string) => /\.(mov|mp4|webm)(\?|$)/i.test(src);

interface VisualsSliderProps {
  visuals: ProjectVisual[];
}

export const VisualsSlider: React.FC<VisualsSliderProps> = ({ visuals }) => {
  const [idx, setIdx] = useState(0);
  const [zoom, setZoom] = useState({ scale: 1, x: 0, y: 0 });
  const reduced = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const lightboxRef = useRef<HTMLDialogElement>(null);
  const lightboxTriggerRef = useRef<HTMLButtonElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const pinchRef = useRef<{
    pointers: Map<number, { x: number; y: number }>;
    startDistance: number;
    startCenter: { x: number; y: number };
    startZoom: { scale: number; x: number; y: number };
  }>({
    pointers: new Map(),
    startDistance: 0,
    startCenter: { x: 0, y: 0 },
    startZoom: { scale: 1, x: 0, y: 0 },
  });
  const n = visuals.length;

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const resetZoom = () => {
    pinchRef.current.pointers.clear();
    pinchRef.current.startDistance = 0;
    setZoom({ scale: 1, x: 0, y: 0 });
  };

  const scrollToIndex = (nextIdx: number) => {
    const track = trackRef.current;
    if (!track) return;
    const next = Math.max(0, Math.min(nextIdx, n - 1));
    if (next !== idx) {
      resetZoom();
    }
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
      if (next !== idx) {
        resetZoom();
      }
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
    resetZoom();
    lightboxRef.current?.close();
  };

  const handleLightboxClose = () => {
    resetZoom();
    lightboxTriggerRef.current?.focus();
  };

  const getPinchDistance = (points: Array<{ x: number; y: number }>) => {
    const [a, b] = points;
    return Math.hypot(a.x - b.x, a.y - b.y);
  };

  const getPinchCenter = (points: Array<{ x: number; y: number }>) => {
    const [a, b] = points;
    return {
      x: (a.x + b.x) / 2,
      y: (a.y + b.y) / 2,
    };
  };

  const handleZoomPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'touch') return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Synthetic pointer events in tests may not be capturable.
    }
    pinchRef.current.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pinchRef.current.pointers.size === 2) {
      const points = Array.from(pinchRef.current.pointers.values());
      pinchRef.current.startDistance = getPinchDistance(points);
      pinchRef.current.startCenter = getPinchCenter(points);
      pinchRef.current.startZoom = zoom;
    }
  };

  const handleZoomPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'touch' || !pinchRef.current.pointers.has(e.pointerId)) return;
    pinchRef.current.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pinchRef.current.pointers.size !== 2 || pinchRef.current.startDistance <= 0) return;
    e.preventDefault();

    const points = Array.from(pinchRef.current.pointers.values());
    const distance = getPinchDistance(points);
    const center = getPinchCenter(points);
    const nextScale = Math.max(
      1,
      Math.min(4, pinchRef.current.startZoom.scale * (distance / pinchRef.current.startDistance)),
    );

    setZoom({
      scale: nextScale,
      x: nextScale === 1 ? 0 : pinchRef.current.startZoom.x + center.x - pinchRef.current.startCenter.x,
      y: nextScale === 1 ? 0 : pinchRef.current.startZoom.y + center.y - pinchRef.current.startCenter.y,
    });
  };

  const handleZoomPointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    pinchRef.current.pointers.delete(e.pointerId);
    pinchRef.current.startDistance = 0;

    if (zoom.scale <= 1.01) {
      setZoom({ scale: 1, x: 0, y: 0 });
    }
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
                  {isVideoSrc(visual.src) ? (
                    <video
                      src={visual.src}
                      aria-label={visual.caption}
                      controls
                      playsInline
                      muted
                      loop
                      preload={i === 0 ? 'metadata' : 'none'}
                      className="block h-auto w-full object-contain md:max-h-[min(72vh,44rem)] md:w-auto md:max-w-full"
                    />
                  ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={visual.src}
                      alt={visual.caption}
                      draggable={false}
                      loading={i === 0 ? 'eager' : 'lazy'}
                      className="block h-auto w-full object-contain md:max-h-[min(72vh,44rem)] md:w-auto md:max-w-full"
                    />
                  )}
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
          <div className="flex min-h-16 items-center justify-between gap-3 border-b border-foreground/20 px-4 py-3 md:min-h-20 md:px-6">
            <p className="annotation truncate text-muted-foreground md:!text-[0.95rem]">
              {visuals[idx].caption}
            </p>
            <button
              type="button"
              onClick={closeLightbox}
              className="flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center border border-foreground/25 bg-background text-foreground transition-colors hover:bg-muted active:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Close full image view"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-1 items-center px-2 py-3 md:grid-cols-[4.5rem_minmax(0,1fr)_4.5rem] md:gap-1 md:px-4">
            <button
              type="button"
              onClick={goBack}
              disabled={idx === 0}
              className="hidden h-12 w-12 touch-manipulation items-center justify-center justify-self-center text-foreground transition-colors hover:bg-muted active:bg-muted disabled:pointer-events-none disabled:opacity-25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:flex"
              aria-label="Previous full image"
            >
              <ChevronLeft size={24} />
            </button>

            <div
              className="flex min-h-0 touch-none items-center justify-center overflow-hidden"
              onPointerDown={handleZoomPointerDown}
              onPointerMove={handleZoomPointerMove}
              onPointerUp={handleZoomPointerEnd}
              onPointerCancel={handleZoomPointerEnd}
              onLostPointerCapture={handleZoomPointerEnd}
            >
              <AnimatePresence>
                <motion.div
                  key={visuals[idx].src}
                  initial={reduced ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.985 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduced ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.015 }}
                  transition={reduced ? { duration: 0 } : { duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  className="flex min-h-0 items-center justify-center"
                >
                  <div
                    style={{
                      transform: `translate3d(${zoom.x}px, ${zoom.y}px, 0) scale(${zoom.scale})`,
                      transformOrigin: 'center center',
                    }}
                  >
                    {isVideoSrc(visuals[idx].src) ? (
                      <video
                        src={visuals[idx].src}
                        aria-label={visuals[idx].caption}
                        controls
                        playsInline
                        className="block max-h-[calc(100svh-10rem)] max-w-full select-none object-contain md:max-h-[calc(100svh-12rem)]"
                      />
                    ) : (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={visuals[idx].src}
                        alt={visuals[idx].caption}
                        draggable={false}
                        className="block max-h-[calc(100svh-10rem)] max-w-full select-none object-contain md:max-h-[calc(100svh-12rem)]"
                      />
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              type="button"
              onClick={advance}
              disabled={idx === n - 1}
              className="hidden h-12 w-12 touch-manipulation items-center justify-center justify-self-center text-foreground transition-colors hover:bg-muted active:bg-muted disabled:pointer-events-none disabled:opacity-25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:flex"
              aria-label="Next full image"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <div className="flex min-h-28 flex-col items-center justify-center gap-3 border-t border-foreground/20 px-4 py-3 md:min-h-16 md:flex-row md:items-center md:justify-between md:gap-4 md:px-6">
            {visuals.length > 1 && (
              <div className="flex items-center justify-center gap-2 md:hidden">
                <button
                  type="button"
                  onClick={goBack}
                  disabled={idx === 0}
                  className="flex h-11 w-11 touch-manipulation items-center justify-center border border-foreground/20 bg-background/80 text-foreground transition-colors active:bg-muted disabled:pointer-events-none disabled:opacity-25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Previous full image"
                >
                  <ChevronLeft size={21} />
                </button>
                <button
                  type="button"
                  onClick={advance}
                  disabled={idx === n - 1}
                  className="flex h-11 w-11 touch-manipulation items-center justify-center border border-foreground/20 bg-background/80 text-foreground transition-colors active:bg-muted disabled:pointer-events-none disabled:opacity-25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Next full image"
                >
                  <ChevronRight size={21} />
                </button>
              </div>
            )}
            <div className="flex w-full items-start justify-between gap-4 md:w-auto md:flex-1">
              <p className="annotation min-w-0 text-muted-foreground md:!text-[0.95rem]">
                {visuals[idx].caption}
              </p>
              <span
                className="annotation shrink-0 text-muted-foreground md:!text-[0.95rem]"
                aria-live="polite"
                aria-atomic="true"
              >
                {`${String(idx + 1).padStart(2, '0')} / ${String(visuals.length).padStart(2, '0')}`}
              </span>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
};

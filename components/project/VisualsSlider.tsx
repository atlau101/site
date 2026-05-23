'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion, type PanInfo } from 'framer-motion';
import { ProjectVisual } from '@/lib/projects/types';

interface VisualsSliderProps {
  visuals: ProjectVisual[];
}

const SWIPE_DIST = 55;
const SWIPE_VEL = 400;
const WHEEL_THRESHOLD = 60; // accumulated deltaX px before triggering navigation

const cardVariants = {
  enter: (d: number) => ({
    x: d < 0 ? -380 : 0,
    y: d > 0 ? 28 : 0,
    scale: d > 0 ? 0.88 : 1,
    opacity: d > 0 ? 0 : 1,
  }),
  center: {
    x: 0,
    y: 0,
    scale: 1,
    opacity: 1,
  },
  exit: (d: number) => ({
    x: d > 0 ? -520 : 380,
    opacity: 0,
    scale: 0.9,
    rotate: d > 0 ? -8 : 8,
  }),
};

export const VisualsSlider: React.FC<VisualsSliderProps> = ({ visuals }) => {
  const [[idx, dir], setState] = useState<[number, number]>([0, 0]);
  const [exitingIdx, setExitingIdx] = useState<number | null>(null);
  const reduced = useReducedMotion();
  const regionRef = useRef<HTMLDivElement>(null);
  const wheelAccum = useRef(0);
  const wheelLocked = useRef(false);
  const n = visuals.length;

  // Trackpad horizontal swipe via native wheel events (passive:false to preventDefault)
  useEffect(() => {
    const el = regionRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      // Claim any horizontal-dominant gesture immediately so the browser never
      // interprets it as a back/forward navigation swipe.
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
      }

      // Only accumulate for clearly dominant horizontal scroll
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || Math.abs(e.deltaX) < 2) return;

      if (wheelLocked.current) return;

      wheelAccum.current += e.deltaX;

      if (Math.abs(wheelAccum.current) >= WHEEL_THRESHOLD) {
        const forward = wheelAccum.current > 0;
        wheelAccum.current = 0;
        wheelLocked.current = true;
        setState(([i]) => {
          const next = forward ? i + 1 : i - 1;
          if (next < 0 || next >= n) return [i, 0];
          return [next, forward ? 1 : -1];
        });
        // Cooldown prevents momentum events from firing multiple advances per swipe
        setTimeout(() => {
          wheelLocked.current = false;
          wheelAccum.current = 0;
        }, 650);
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [n]);

  const advance = () => {
    setExitingIdx(idx);
    setState(([i]) => i < n - 1 ? [i + 1, 1] : [i, 0]);
  };
  const goBack = () => {
    setExitingIdx(idx);
    setState(([i]) => i > 0 ? [i - 1, -1] : [i, 0]);
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const movedLeft  = info.offset.x < -SWIPE_DIST || info.velocity.x < -SWIPE_VEL;
    const movedRight = info.offset.x >  SWIPE_DIST || info.velocity.x >  SWIPE_VEL;
    if (movedLeft)  advance();
    else if (movedRight) goBack();
  };

  return (
    <div
      ref={regionRef}
      role="region"
      aria-label="Project images"
      tabIndex={0}
      className="outline-none focus-visible:ring-1 focus-visible:ring-ring"
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft')  goBack();
        if (e.key === 'ArrowRight') advance();
      }}
    >
      {/* Arrows + stack row */}
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={goBack}
          disabled={idx === 0}
          className="flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center text-muted-foreground transition-colors hover:text-foreground active:text-foreground disabled:pointer-events-none disabled:opacity-25"
          aria-label="Previous image"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Stack container — extra bottom space for peek cards */}
        <div className="relative flex-1 min-w-0 pb-5">
          <div className="relative" style={{ aspectRatio: '16 / 9' }}>

            {/* Peek cards — suppress any card that is currently mid-exit */}
            {([2, 1] as const).map((depth) => {
              const peekIdx = idx + depth;
              if (peekIdx >= n || peekIdx === exitingIdx) return null;
              return (
                <div
                  key={`peek-${depth}`}
                  aria-hidden="true"
                  className="absolute inset-0 overflow-hidden"
                  style={{
                    transform: `translateY(${depth * 10}px) scale(${1 - depth * 0.028})`,
                    transformOrigin: 'top center',
                    zIndex: depth,
                    background: 'oklch(0.974 0.005 95)',
                  }}
                >
                  <Image
                    src={visuals[peekIdx].src}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 900px"
                    className="object-cover opacity-50"
                  />
                </div>
              );
            })}

            {/* Active card */}
            <AnimatePresence custom={dir} onExitComplete={() => setExitingIdx(null)}>
              <motion.div
                key={idx}
                custom={dir}
                variants={reduced ? undefined : cardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                drag={reduced ? false : 'x'}
                dragElastic={0.4}
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={handleDragEnd}
                className="absolute inset-0 overflow-hidden cursor-grab active:cursor-grabbing select-none"
                style={{ zIndex: 10, background: 'oklch(0.974 0.005 95)' }}
              >
                <Image
                  src={visuals[idx].src}
                  alt={visuals[idx].caption}
                  fill
                  sizes="(max-width: 1024px) 100vw, 900px"
                  className="object-contain"
                  draggable={false}
                  priority={idx === 0}
                />
              </motion.div>
            </AnimatePresence>

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

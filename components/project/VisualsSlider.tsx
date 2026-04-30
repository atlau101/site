'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProjectVisual } from '@/lib/projects/types';

interface VisualsSliderProps {
  visuals: ProjectVisual[];
}

export const VisualsSlider: React.FC<VisualsSliderProps> = ({ visuals }) => {
  const [idx, setIdx] = useState(0);
  const [fading, setFading] = useState(false);

  const navigate = (next: number) => {
    if (next === idx) return;
    setFading(true);
    setTimeout(() => {
      setIdx(next);
      setFading(false);
    }, 150);
  };

  const prev = () => navigate(idx - 1);
  const next = () => navigate(idx + 1);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft' && idx > 0) prev();
    if (e.key === 'ArrowRight' && idx < visuals.length - 1) next();
  };

  const current = visuals[idx];
  const counter = `${String(idx + 1).padStart(2, '0')} / ${String(visuals.length).padStart(2, '0')}`;

  return (
    <div
      role="region"
      aria-label="Project images"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      className="outline-none focus-visible:ring-1 focus-visible:ring-ring"
    >
      {/* Slider row: arrow · image · arrow — centered, capped width */}
      <div className="flex items-center justify-center gap-6">
        <button
          onClick={prev}
          disabled={idx === 0}
          className="p-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-25 disabled:pointer-events-none shrink-0"
          aria-label="Previous image"
        >
          <ChevronLeft size={20} />
        </button>

        <div
          className="relative flex-1 min-w-0 aspect-video bg-paper-dim overflow-hidden"
          style={{ transition: 'opacity 0.15s ease', opacity: fading ? 0 : 1 }}
        >
          <Image
            key={idx}
            src={current.src}
            alt={current.caption}
            fill
            sizes="(max-width: 640px) calc(100vw - 112px), (max-width: 1024px) calc(100vw - 200px), 800px"
            className="object-contain"
          />
        </div>

        <button
          onClick={next}
          disabled={idx === visuals.length - 1}
          className="p-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-25 disabled:pointer-events-none shrink-0"
          aria-label="Next image"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Caption + counter */}
      <div className="flex items-start justify-between mt-4 gap-4">
        <p className="annotation text-muted-foreground">{current.caption}</p>
        <span className="annotation text-muted-foreground shrink-0" aria-live="polite" aria-atomic="true">{counter}</span>
      </div>
    </div>
  );
};

'use client';

import clsx from 'clsx';
import { ChevronsLeftRight } from 'lucide-react';
import { useCallback, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';

/**
 * Draggable before/after comparison (DESIGN §3.8). `after` fills the frame; `before` is clipped
 * to the left of the handle. The handle follows the pointer and is a keyboard slider (arrows,
 * Home/End).
 */
export function BeforeAfter({
  before,
  after,
  beforeLabel,
  afterLabel,
  sliderLabel,
  initial = 50,
  className,
  children,
}: {
  before: ReactNode;
  after: ReactNode;
  beforeLabel: string;
  afterLabel: string;
  sliderLabel: string;
  initial?: number;
  className?: string;
  /** Extra overlay content (e.g. the "AI ile oluşturuldu" pill). */
  children?: ReactNode;
}) {
  const [pos, setPos] = useState(initial);
  const frame = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const moveTo = useCallback((clientX: number) => {
    const rect = frame.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    setPos(Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)));
  }, []);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    moveTo(e.clientX);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragging.current) moveTo(e.clientX);
  };
  const stop = () => {
    dragging.current = false;
  };
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 10 : 4;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') setPos((p) => Math.max(0, p - step));
    else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') setPos((p) => Math.min(100, p + step));
    else if (e.key === 'Home') setPos(0);
    else if (e.key === 'End') setPos(100);
    else return;
    e.preventDefault();
  };

  return (
    <div
      ref={frame}
      className={clsx('relative touch-pan-y overflow-hidden select-none', className)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stop}
      onPointerCancel={stop}
    >
      <div className="absolute inset-0">{after}</div>
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        {before}
      </div>
      <span className="float-chip absolute top-3 left-3 rounded-pill px-2.5 py-1 text-[11px] font-semibold text-ink">{beforeLabel}</span>
      <span className="float-chip absolute top-3 right-3 rounded-pill px-2.5 py-1 text-[11px] font-semibold text-ink">{afterLabel}</span>
      <div aria-hidden className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white/95" style={{ left: `${pos}%` }} />
      <div
        role="slider"
        tabIndex={0}
        aria-label={sliderLabel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        aria-valuetext={`${beforeLabel} ${Math.round(pos)}% · ${afterLabel} ${Math.round(100 - pos)}%`}
        onKeyDown={onKeyDown}
        className="absolute top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize place-items-center rounded-full bg-white text-violet shadow-[0_4px_14px_rgb(23_20_31/0.25)]"
        style={{ left: `${pos}%` }}
      >
        <ChevronsLeftRight aria-hidden className="size-5" strokeWidth={1.75} />
      </div>
      {children}
    </div>
  );
}

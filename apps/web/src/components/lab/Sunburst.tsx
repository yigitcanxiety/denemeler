import clsx from 'clsx';
import type { CSSProperties, ReactNode } from 'react';
import type { EnterMode } from './primitives';

export interface SunburstLabel {
  text: string;
  /** Degrees clockwise from 12 o'clock. */
  angle: number;
  /** Optional swatches drawn next to the label. */
  colors?: string[];
}

const rand = (i: number) => {
  const x = Math.sin(i * 12.9898 + 4.1414) * 43758.5453;
  return x - Math.floor(x);
};

const round = (n: number) => Math.round(n * 100) / 100;

/**
 * Radial "sunburst" of hairlines around a circle (preloader, analyzing screen, seasons section).
 * Lines draw outward with stroke-dashoffset, staggered; labels sit at the ends of the axes.
 */
export function Sunburst({
  labels = [],
  inner = 34,
  lines = 72,
  enter = 'scroll',
  delay = 0,
  className,
  children,
  labelClassName,
  axisMarkers = true,
  rotateSides = false,
}: {
  labels?: SunburstLabel[];
  /** Inner circle radius in viewBox units (the whole burst is 200 units wide). */
  inner?: number;
  lines?: number;
  enter?: EnterMode | 'play';
  delay?: number;
  className?: string;
  /** Rendered inside the inner circle. */
  children?: ReactNode;
  labelClassName?: string;
  axisMarkers?: boolean;
  /** Run the E/W labels vertically along the axis (narrow screens: no horizontal overflow). */
  rotateSides?: boolean;
}) {
  const rays = Array.from({ length: lines }, (_, i) => {
    const angle = (i * 360) / lines;
    if (axisMarkers && angle % 90 === 0) return null;
    const r = rand(i);
    const long = i % 6 === 3;
    const start = inner + 2 + (long ? 0 : r * 10);
    const end = long ? 92 : inner + 16 + r * 44;
    const rad = (angle * Math.PI) / 180;
    const sx = Math.sin(rad);
    const cy = -Math.cos(rad);
    return {
      i,
      d: `M${round(sx * start)} ${round(cy * start)}L${round(sx * end)} ${round(cy * end)}`,
      dot: !long && i % 3 === 0 ? { x: round(sx * end), y: round(cy * end) } : null,
    };
  }).filter((ray): ray is NonNullable<typeof ray> => ray !== null);

  const drawClass = enter === 'intro' ? 'intro-draw' : enter === 'play' ? 'play-draw' : undefined;
  const axisEnd = 86;

  return (
    <div className={clsx('relative aspect-square', className)}>
      <svg
        aria-hidden
        viewBox="-100 -100 200 200"
        className={clsx('absolute inset-0 size-full overflow-visible', drawClass)}
        data-draw={enter === 'scroll' ? '' : undefined}
      >
        <g fill="none" stroke="var(--color-ink)" strokeOpacity="0.55" strokeWidth="0.35" strokeLinecap="round">
          {rays.map((ray) => (
            <path key={ray.i} className="draw" d={ray.d} pathLength={1} style={{ '--d': `${delay + ray.i * 13}ms` } as CSSProperties} />
          ))}
        </g>
        <g fill="var(--color-ink)" fillOpacity="0.7">
          {rays.map((ray) => (ray.dot ? <circle key={ray.i} cx={ray.dot.x} cy={ray.dot.y} r="0.9" /> : null))}
        </g>
        <circle
          className="draw"
          r={inner}
          fill="none"
          stroke="var(--color-ink)"
          strokeOpacity="0.4"
          strokeWidth="0.35"
          pathLength={1}
          transform="rotate(-90)"
          style={{ '--d': `${delay}ms` } as CSSProperties}
        />
        {axisMarkers && (
          <g fill="none" stroke="var(--color-ink)" strokeOpacity="0.6" strokeWidth="0.35">
            <path className="draw" d={`M0 ${-axisEnd}V${axisEnd}`} pathLength={1} style={{ '--d': `${delay + 200}ms` } as CSSProperties} />
            <path className="draw" d={`M${-axisEnd} 0H${axisEnd}`} pathLength={1} style={{ '--d': `${delay + 300}ms` } as CSSProperties} />
            {[
              [0, -axisEnd],
              [axisEnd, 0],
              [0, axisEnd],
              [-axisEnd, 0],
            ].map(([x, y]) => (
              <circle key={`${x}${y}`} cx={x} cy={y} r="1.7" fill="var(--color-paper)" />
            ))}
          </g>
        )}
      </svg>

      {children && (
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ width: `${inner}%`, height: `${inner}%` }}
        >
          {children}
        </div>
      )}

      {labels.map((label, i) => {
        const rad = (label.angle * Math.PI) / 180;
        const sx = Math.sin(rad);
        const cy = Math.cos(rad);
        const radius = axisMarkers ? 46 : 47;
        const tx = sx > 0.3 ? '0%' : sx < -0.3 ? '-100%' : '-50%';
        const ty = cy > 0.3 ? '-100%' : cy < -0.3 ? '0%' : '-50%';
        const pad = 6;
        const vertical = rotateSides && Math.abs(sx) > 0.9;
        return (
          <span
            key={label.text}
            className={clsx(
              'absolute flex items-center gap-1.5 text-[11px] font-medium tracking-[0.04em] whitespace-nowrap text-ink uppercase',
              enter === 'intro' ? 'intro-fade' : enter === 'play' ? 'play-fade' : undefined,
              labelClassName,
            )}
            data-reveal={enter === 'scroll' ? 'fade' : undefined}
            style={
              {
                left: `${50 + sx * (vertical ? radius + 1 : radius)}%`,
                top: `${50 - cy * radius}%`,
                transform: vertical
                  ? `translate(-50%, -50%) rotate(${sx > 0 ? 90 : -90}deg) translateY(${-pad - 4}px)`
                  : `translate(calc(${tx} + ${sx > 0.3 ? pad : sx < -0.3 ? -pad : 0}px), calc(${ty} + ${cy > 0.3 ? -pad : cy < -0.3 ? pad : 0}px))`,
                '--d': `${delay + 500 + i * 120}ms`,
              } as CSSProperties
            }
          >
            {label.colors && sx < -0.3 && <Dots colors={label.colors} />}
            <span>{label.text}</span>
            {label.colors && sx >= -0.3 && <Dots colors={label.colors} />}
          </span>
        );
      })}
    </div>
  );
}

function Dots({ colors }: { colors: string[] }) {
  return (
    <span aria-hidden className="flex -space-x-0.5">
      {colors.slice(0, 3).map((c) => (
        <span key={c} className="size-2.5 rounded-full ring-1 ring-paper" style={{ backgroundColor: c }} />
      ))}
    </span>
  );
}

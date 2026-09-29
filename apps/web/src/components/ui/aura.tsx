import clsx from 'clsx';
import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

/** Stagger helper for `.enter` / `.bar-fill` animations. */
export const delay = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

/** `✦ KENDİNİ KEŞFET` chip used above headings. */
export function Eyebrow({ children, className, tone = 'mist' }: { children: ReactNode; className?: string; tone?: 'mist' | 'paper' | 'violet' }) {
  return (
    <span
      className={clsx(
        'caps inline-flex w-max max-w-full items-center gap-1.5 rounded-pill px-3 py-1.5',
        tone === 'mist' && 'bg-mist text-ink ring-1 ring-line ring-inset',
        tone === 'paper' && 'bg-paper text-ink shadow-soft',
        tone === 'violet' && 'bg-violet-soft text-[#5a3fe0]',
        className,
      )}
    >
      <span aria-hidden className="text-violet">
        ✦
      </span>
      {children}
    </span>
  );
}

/** Centered or left-aligned section heading: eyebrow chip, serif title, lead. */
export function SectionHeading({
  id,
  eyebrow,
  title,
  lead,
  align = 'center',
  className,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: 'center' | 'left';
  className?: string;
}) {
  return (
    <div className={clsx('flex flex-col gap-4', align === 'center' ? 'items-center text-center' : 'items-start', className)} data-reveal>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 id={id} className="max-w-[22ch] text-[clamp(1.9rem,6.4vw,3.1rem)] text-ink">
        {title}
      </h2>
      {lead && <p className={clsx('max-w-[56ch] text-[15.5px] text-muted', align === 'center' && 'mx-auto')}>{lead}</p>}
    </div>
  );
}

/** Fill template like `%{n} uyum` / `{n}% fit`. */
export function fitText(template: string, n: number): string {
  return template.replace('{n}', String(n));
}

/** "% uyum" pill: mint ≥ 90, butter 75–89, rose below (DESIGN §2). Only about shade/season fit. */
export function FitPill({ value, template, className }: { value: number; template: string; className?: string }) {
  return (
    <span
      className={clsx(
        'inline-flex w-max items-center rounded-pill px-2 py-[3px] text-[11px] leading-none font-bold whitespace-nowrap',
        value >= 90 ? 'bg-mint text-mint-ink' : value >= 75 ? 'bg-butter text-butter-ink' : 'bg-rose-soft text-rose-ink',
        className,
      )}
    >
      {fitText(template, value)}
    </span>
  );
}

/** Soft rounded card (white with a hairline, or tinted). */
export function Card({
  children,
  className,
  tone = 'paper',
  as: Tag = 'div',
  ...rest
}: {
  children: ReactNode;
  className?: string;
  tone?: 'paper' | 'mist' | 'violet' | 'rose';
  as?: 'div' | 'section' | 'article' | 'li';
} & Omit<HTMLAttributes<HTMLElement>, 'className' | 'children'>) {
  return (
    <Tag
      className={clsx(
        'rounded-card',
        tone === 'paper' && 'bg-paper ring-1 ring-line ring-inset',
        tone === 'mist' && 'bg-mist',
        tone === 'violet' && 'bg-violet-soft',
        tone === 'rose' && 'bg-rose-soft',
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Circular progress ring (0–100) with content in the middle. */
export function ProgressRing({
  value,
  size = 240,
  stroke = 6,
  className,
  children,
  label,
}: {
  value: number;
  size?: number;
  stroke?: number;
  className?: string;
  children?: ReactNode;
  label?: string;
}) {
  const r = 50 - stroke / 2;
  const c = 2 * Math.PI * r;
  return (
    <div
      className={clsx('relative', className)}
      style={{ width: size, height: size, maxWidth: '100%', aspectRatio: '1' }}
      role={label ? 'progressbar' : undefined}
      aria-label={label}
      aria-valuemin={label ? 0 : undefined}
      aria-valuemax={label ? 100 : undefined}
      aria-valuenow={label ? Math.round(value) : undefined}
    >
      <svg aria-hidden viewBox="0 0 100 100" className="absolute inset-0 size-full -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--color-violet-soft)" strokeWidth={stroke} />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="var(--color-violet)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - Math.max(0, Math.min(100, value)) / 100)}
        />
      </svg>
      {children}
    </div>
  );
}

/** Small uyum ring used on photos (e.g. 92). */
export function MiniRing({ value, className }: { value: number; className?: string }) {
  const r = 15;
  const c = 2 * Math.PI * r;
  return (
    <span className={clsx('relative inline-grid size-10 place-items-center', className)}>
      <svg aria-hidden viewBox="0 0 36 36" className="absolute inset-0 size-full -rotate-90">
        <circle cx="18" cy="18" r={r} fill="none" stroke="var(--color-violet-soft)" strokeWidth="3.5" />
        <circle cx="18" cy="18" r={r} fill="none" stroke="var(--color-violet)" strokeWidth="3.5" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} />
      </svg>
      <span className="text-[10px] font-bold text-ink">{value}</span>
    </span>
  );
}

/**
 * Colour-profile radar (DESIGN §3.7): hexagonal grid, violet polygon that grows from the centre.
 * Descriptive only, never a beauty score.
 */
export function Radar({
  axes,
  className,
  label,
}: {
  axes: { label: string; value: number }[];
  className?: string;
  label: string;
}) {
  const n = axes.length;
  const cx = 160;
  const cy = 140;
  const R = 92;
  const point = (i: number, radius: number) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    return [cx + radius * Math.cos(a), cy + radius * Math.sin(a)] as const;
  };
  const ring = (f: number) => axes.map((_, i) => point(i, R * f).join(',')).join(' ');
  const poly = axes.map((a, i) => point(i, (R * Math.max(6, a.value)) / 100).join(',')).join(' ');
  return (
    <svg viewBox="-24 0 368 284" role="img" aria-label={label} className={clsx('h-auto w-full', className)}>
      <defs>
        <linearGradient id="radar-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8E75FF" stopOpacity="0.55" />
          <stop offset="1" stopColor="#7457F5" stopOpacity="0.25" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <polygon key={f} points={ring(f)} fill={f === 1 ? '#F6F4FE' : 'none'} stroke="#E6E2F3" strokeWidth="1" />
      ))}
      {axes.map((_, i) => {
        const [x, y] = point(i, R);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#E6E2F3" strokeWidth="1" />;
      })}
      <g className="radar-grow">
        <polygon points={poly} fill="url(#radar-fill)" stroke="#7457F5" strokeWidth="1.75" strokeLinejoin="round" />
        {axes.map((a, i) => {
          const [x, y] = point(i, (R * Math.max(6, a.value)) / 100);
          return <circle key={i} cx={x} cy={y} r="3" fill="#fff" stroke="#7457F5" strokeWidth="1.5" />;
        })}
      </g>
      {axes.map((a, i) => {
        const [x, y] = point(i, R + 22);
        const anchor = Math.abs(x - cx) < 4 ? 'middle' : x > cx ? 'start' : 'end';
        const dy = y < cy - R * 0.6 ? -6 : y > cy + R * 0.6 ? 10 : 0;
        return (
          <text key={a.label} x={x} y={y + dy} textAnchor={anchor} fontSize="12" fill="#6B6679" fontFamily="var(--font-sans)">
            <tspan x={x}>{a.label}</tspan>
            <tspan x={x} dy="16" fontSize="15" fill="#17141F" fontFamily="var(--font-display)">
              {a.value}
            </tspan>
          </text>
        );
      })}
    </svg>
  );
}

/** Coloured metric bars (Sıcaklık, Kontrast, Yumuşaklık …) with serif values. */
export function ProfileBars({ items, className }: { items: { label: string; value: number; color: string }[]; className?: string }) {
  return (
    <ul className={clsx('flex flex-col gap-4', className)}>
      {items.map((item, i) => (
        <li key={item.label} className="grid grid-cols-[1fr_auto] items-end gap-x-4 gap-y-1.5">
          <span className="text-[14px] font-medium text-ink">{item.label}</span>
          <span className="serif row-span-2 self-center text-[1.35rem] leading-none text-ink">{item.value}</span>
          <span className="block h-2 overflow-hidden rounded-pill" style={{ backgroundColor: `color-mix(in srgb, ${item.color} 20%, white)` }}>
            <span
              className="bar-fill block h-full rounded-pill"
              style={{ width: `${item.value}%`, backgroundColor: item.color, ...delay(120 + i * 90) }}
            />
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Small lipstick-tube glyph tinted with a shade (for shade cards). */
export function ShadeTube({ color, className }: { color: string; className?: string }) {
  return (
    <span className={clsx('grid h-16 place-items-center rounded-[12px]', className)} style={{ backgroundColor: `${color}1f` }}>
      <svg aria-hidden viewBox="0 0 24 48" className="h-11 w-auto">
        <path d="M7 4c0-2 2-3 5-3s5 1 5 3v14H7V4Z" fill={color} />
        <rect x="5" y="18" width="14" height="8" rx="1.5" fill="#D8D2E6" />
        <rect x="4" y="26" width="16" height="20" rx="3" fill="#17141F" opacity=".85" />
      </svg>
    </span>
  );
}

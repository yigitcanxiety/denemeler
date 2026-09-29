import clsx from 'clsx';
import type { CSSProperties } from 'react';
import { HEAT_DEFAULT, type HeatPalette } from '@/lib/heat';

type Zone = { cx: number; cy: number; rx: number; ry: number };

/** Where makeup goes: lips, cheeks (blush), eyelids (shadow). */
const ZONES: { key: 'lids' | 'cheeks' | 'lips'; shapes: Zone[]; delay: number }[] = [
  {
    key: 'lids',
    delay: 400,
    shapes: [
      { cx: 161, cy: 193, rx: 30, ry: 14 },
      { cx: 239, cy: 193, rx: 30, ry: 14 },
    ],
  },
  {
    key: 'cheeks',
    delay: 1200,
    shapes: [
      { cx: 144, cy: 262, rx: 36, ry: 27 },
      { cx: 256, cy: 262, rx: 36, ry: 27 },
    ],
  },
  {
    key: 'lips',
    delay: 0,
    shapes: [
      { cx: 200, cy: 304, rx: 40, ry: 20 },
      { cx: 200, cy: 301, rx: 24, ry: 10 },
    ],
  },
];

const FACE_PATHS = [
  // head
  'M200 64C142 64 108 112 108 184C108 250 128 306 162 338C176 351 188 356 200 356C212 356 224 351 238 338C272 306 292 250 292 184C292 112 258 64 200 64Z',
  // hair silhouette
  'M200 44C128 44 86 96 86 176C86 236 90 290 70 350C64 368 58 380 52 392',
  'M200 44C272 44 314 96 314 176C314 236 310 290 330 350C336 368 342 380 348 392',
  // fringe
  'M200 66C180 92 146 112 112 162',
  'M200 66C226 88 262 106 290 152',
  // neck + shoulders
  'M168 340C170 372 168 394 158 416C118 426 76 446 54 480',
  'M232 340C230 372 232 394 242 416C282 426 324 446 346 480',
  // brows
  'M136 180C150 170 170 169 184 175',
  'M216 175C230 169 250 170 264 180',
  // eyes
  'M140 205C150 194 174 193 186 204M140 205C154 213 174 213 186 204M140 205L134 201',
  'M214 204C226 193 250 194 260 205M214 204C226 213 246 213 260 205M260 205L266 201',
  // nose
  'M197 212C196 236 190 254 185 263M188 267C194 272 206 272 212 267',
  // lips
  'M170 302C180 296 190 290 200 295C210 290 220 296 230 302M170 302C184 306 216 306 230 302M172 303C182 318 218 318 228 303',
];

const CREASES = ['M144 196C156 186 174 186 184 195', 'M216 195C226 186 244 186 256 196', 'M178 442C188 447 196 447 200 445', 'M222 442C212 447 204 447 200 445'];

/**
 * Line-art face with heat-map makeup blobs on lips, cheeks and eyelids (the hero object).
 * Palette-parameterised: pass any 5-stop heat palette (default Tonelle glow, a season, or a
 * user's own shades). Blobs slowly breathe and shift hue; both loops stop for reduced motion.
 */
export function HeatFace({
  id,
  palette = HEAT_DEFAULT,
  tone = 'paper',
  animated = true,
  className,
  style,
  showBody = true,
}: {
  /** Unique prefix for SVG gradient ids. */
  id: string;
  palette?: HeatPalette;
  tone?: 'paper' | 'night';
  animated?: boolean;
  className?: string;
  style?: CSSProperties;
  showBody?: boolean;
}) {
  const g = (name: string) => `${id}-${name}`;
  const stroke = tone === 'paper' ? '#231816' : '#F3ECE6';
  const [c0, c1, c2, c3, c4] = palette;
  const alt: HeatPalette = [c1, c2, c3, c4, c4];

  const gradient = (name: string, p: HeatPalette) => (
    <radialGradient id={g(name)} cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor={p[0]} stopOpacity="0.95" />
      <stop offset="30%" stopColor={p[1]} stopOpacity="0.92" />
      <stop offset="56%" stopColor={p[2]} stopOpacity="0.8" />
      <stop offset="78%" stopColor={p[3]} stopOpacity="0.5" />
      <stop offset="100%" stopColor={p[4]} stopOpacity="0" />
    </radialGradient>
  );

  return (
    <svg
      viewBox={showBody ? '40 30 320 450' : '70 30 260 360'}
      aria-hidden
      focusable="false"
      className={clsx('overflow-visible', className)}
      style={style}
    >
      <defs>
        <radialGradient id={g('skin')} cx="44%" cy="36%" r="72%">
          {tone === 'paper' ? (
            <>
              <stop offset="0%" stopColor="#F6F1EC" />
              <stop offset="70%" stopColor="#E9E1DA" />
              <stop offset="100%" stopColor="#D6CCC4" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#3A2C2A" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#161010" stopOpacity="0.2" />
            </>
          )}
        </radialGradient>
        {gradient('heat', [c0, c1, c2, c3, c4])}
        {gradient('alt', alt)}
      </defs>

      <path d={FACE_PATHS[0]} fill={`url(#${g('skin')})`} />

      {ZONES.map((zone) => (
        <g key={zone.key}>
          <g className={animated ? 'breathe' : undefined} style={{ '--d': `${-zone.delay}ms` } as CSSProperties}>
            {zone.shapes.map((s, i) => (
              <ellipse key={i} cx={s.cx} cy={s.cy} rx={s.rx} ry={s.ry} fill={`url(#${g('heat')})`} />
            ))}
          </g>
          {animated && (
            <g className="shift" style={{ '--d': `${-zone.delay * 2}ms` } as CSSProperties}>
              {zone.shapes.map((s, i) => (
                <ellipse
                  key={i}
                  cx={s.cx + (i % 2 ? 3 : -3)}
                  cy={s.cy - 2}
                  rx={s.rx * 0.8}
                  ry={s.ry * 0.8}
                  fill={`url(#${g('alt')})`}
                />
              ))}
            </g>
          )}
        </g>
      ))}

      <g fill="none" stroke={stroke} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke">
        {FACE_PATHS.filter((_, i) => showBody || (i !== 5 && i !== 6)).map((d) => (
          <path key={d} d={d} vectorEffect="non-scaling-stroke" />
        ))}
        <g opacity="0.45">
          {CREASES.filter((_, i) => showBody || i < 2).map((d) => (
            <path key={d} d={d} vectorEffect="non-scaling-stroke" />
          ))}
        </g>
        <circle cx="163" cy="203.5" r="7" vectorEffect="non-scaling-stroke" />
        <circle cx="237" cy="203.5" r="7" vectorEffect="non-scaling-stroke" />
      </g>
      <circle cx="163" cy="203.5" r="2.6" fill={stroke} />
      <circle cx="237" cy="203.5" r="2.6" fill={stroke} />
    </svg>
  );
}

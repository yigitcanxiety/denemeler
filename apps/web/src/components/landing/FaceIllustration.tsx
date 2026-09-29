/**
 * Stylised, illustrative face (not a real person) used as a placeholder for before/after
 * imagery. `makeup` adds a soft, Soft-Autumn-style look: eyeshadow, liner, blush, lip colour.
 */
export function FaceIllustration({
  variant,
  id,
  className,
}: {
  variant: 'bare' | 'makeup';
  /** Unique prefix for SVG gradient ids (several instances can share a page). */
  id: string;
  className?: string;
}) {
  const makeup = variant === 'makeup';
  const g = (name: string) => `${id}-${name}`;
  return (
    <svg viewBox="0 0 400 500" className={className} aria-hidden focusable="false">
      <defs>
        <radialGradient id={g('skin')} cx="45%" cy="38%" r="70%">
          <stop offset="0%" stopColor={makeup ? '#e6bca2' : '#e2b397'} />
          <stop offset="70%" stopColor={makeup ? '#d4a083' : '#cf9a7c'} />
          <stop offset="100%" stopColor="#b98266" />
        </radialGradient>
        <linearGradient id={g('neck')} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#b47c60" />
          <stop offset="100%" stopColor="#cf9a7c" />
        </linearGradient>
        <linearGradient id={g('hair')} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#4a3029" />
          <stop offset="100%" stopColor="#2c1d19" />
        </linearGradient>
        <linearGradient id={g('top')} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#a8b08c" />
          <stop offset="100%" stopColor="#8a9a5b" />
        </linearGradient>
        <radialGradient id={g('blush')}>
          <stop offset="0%" stopColor="#d27c6c" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#d27c6c" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={g('shadow')} x1="0" x2="0" y1="1" y2="0">
          <stop offset="0%" stopColor="#a0785a" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#c9907c" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id={g('lip')} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={makeup ? '#a9524b' : '#c48676'} />
          <stop offset="100%" stopColor={makeup ? '#8f4038' : '#b57666'} />
        </linearGradient>
      </defs>

      {/* Hair (back) */}
      <path
        d="M200 38c-96 0-150 70-150 170 0 70 8 150-8 232h316c-16-82-8-162-8-232C350 108 296 38 200 38Z"
        fill={`url(#${g('hair')})`}
      />
      {/* Shoulders / top */}
      <path d="M40 500c8-62 58-96 122-104h76c64 8 114 42 122 104Z" fill={`url(#${g('top')})`} />
      {/* Neck */}
      <path d="M168 318h64v70c0 20-14 34-32 34s-32-14-32-34Z" fill={`url(#${g('neck')})`} />
      {/* Face */}
      <ellipse cx="200" cy="232" rx="98" ry="126" fill={`url(#${g('skin')})`} />
      {/* Hair (front, side-swept) */}
      <path
        d="M104 214c-2-86 48-140 104-140 58 0 94 38 96 92-38-44-96-58-150-26-22 14-38 40-50 74Z"
        fill={`url(#${g('hair')})`}
      />

      {makeup && (
        <>
          {/* Blush */}
          <ellipse cx="143" cy="286" rx="36" ry="22" fill={`url(#${g('blush')})`} />
          <ellipse cx="257" cy="286" rx="36" ry="22" fill={`url(#${g('blush')})`} />
          {/* Highlight on cheekbones */}
          <ellipse cx="150" cy="266" rx="16" ry="6" fill="#fff4ec" opacity="0.35" />
          <ellipse cx="250" cy="266" rx="16" ry="6" fill="#fff4ec" opacity="0.35" />
          {/* Eyeshadow */}
          <path d="M130 236c10-26 50-34 60-2-18-8-42-8-60 2Z" fill={`url(#${g('shadow')})`} />
          <path d="M210 234c10-32 50-24 60 2-18-10-42-10-60-2Z" fill={`url(#${g('shadow')})`} />
        </>
      )}

      {/* Brows */}
      <path d="M132 206c14-10 36-12 54-4" stroke="#3b2721" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M214 202c18-8 40-6 54 4" stroke="#3b2721" strokeWidth="6" strokeLinecap="round" fill="none" />

      {/* Eyes */}
      <path d="M136 236c14-14 36-14 50 0-14 10-36 10-50 0Z" fill="#f6ede6" />
      <path d="M214 236c14-14 36-14 50 0-14 10-36 10-50 0Z" fill="#f6ede6" />
      <circle cx="161" cy="235" r="7.5" fill="#4a3326" />
      <circle cx="239" cy="235" r="7.5" fill="#4a3326" />
      <circle cx="163.5" cy="232.5" r="2" fill="#fff" opacity="0.8" />
      <circle cx="241.5" cy="232.5" r="2" fill="#fff" opacity="0.8" />
      {/* Upper lid / liner */}
      <path
        d={makeup ? 'M134 236c14-16 38-16 54-1l7-5' : 'M136 236c14-14 36-14 50 0'}
        stroke="#2c1d19"
        strokeWidth={makeup ? 3.5 : 2}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d={makeup ? 'M266 236c-14-16-38-16-54-1l-7-5' : 'M264 236c-14-14-36-14-50 0'}
        stroke="#2c1d19"
        strokeWidth={makeup ? 3.5 : 2}
        strokeLinecap="round"
        fill="none"
      />

      {/* Nose */}
      <path d="M200 246c-4 18-8 30-12 36 6 5 18 5 24 0" stroke="#a86e54" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.55" />

      {/* Lips */}
      <path d="M170 318c10-9 22-12 30-6 8-6 20-3 30 6-10 4-50 4-60 0Z" fill={`url(#${g('lip')})`} />
      <path d="M170 318c10 20 50 20 60 0-10 4-50 4-60 0Z" fill={`url(#${g('lip')})`} />
      {makeup && <ellipse cx="200" cy="327" rx="9" ry="2.5" fill="#fff" opacity="0.25" />}
    </svg>
  );
}

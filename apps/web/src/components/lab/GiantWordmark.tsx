import clsx from 'clsx';
import type { CSSProperties } from 'react';

const WORD = 'TONELLE';

/**
 * Edge-to-edge TONELLE wordmark. The font size is derived from the container width
 * (container query units), so the word fills 100% of the available width at every
 * breakpoint without measuring in JS. Letters rise out of a clip mask, 40 ms apart:
 * on load (`enter="intro"`, CSS only, never blocks LCP) or when scrolled into view.
 */
export function GiantWordmark({
  as: Tag = 'p',
  enter = 'intro',
  delay = 0,
  className,
  tone = 'ink',
}: {
  as?: 'p' | 'div' | 'span';
  enter?: 'intro' | 'scroll' | 'none';
  delay?: number;
  className?: string;
  tone?: 'ink' | 'paper';
}) {
  return (
    <div className={clsx('w-full [container-type:inline-size]', className)}>
      <Tag
        aria-label="Tonelle"
        role="img"
        className={clsx(
          'block text-[calc(100cqw*0.259)] leading-[0.8] font-semibold tracking-[-0.055em] whitespace-nowrap select-none',
          tone === 'ink' ? 'text-ink' : 'text-paper',
          enter === 'intro' && 'wm-intro',
        )}
        data-wm={enter === 'scroll' ? '' : undefined}
        style={{ '--d': `${delay}ms`, marginLeft: '-0.03em' } as CSSProperties}
      >
        {WORD.split('').map((ch, i) => (
          <span key={i} aria-hidden className="wm-letter" style={{ '--i': i } as CSSProperties}>
            <span>{ch}</span>
          </span>
        ))}
      </Tag>
    </div>
  );
}

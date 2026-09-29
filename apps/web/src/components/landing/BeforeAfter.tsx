import clsx from 'clsx';
import { Sparkles } from 'lucide-react';
import Image from 'next/image';
import { LANDING_IMAGES } from '@/config/company';
import { FaceIllustration } from './FaceIllustration';

/**
 * Animated before/after comparison. Uses the SVG illustration until real images are placed
 * in `public/landing/` and referenced in `LANDING_IMAGES` (src/config/company.ts).
 */
export function BeforeAfter({
  beforeLabel,
  afterLabel,
  aiLabel,
  description,
  className,
}: {
  beforeLabel: string;
  afterLabel: string;
  aiLabel: string;
  description: string;
  className?: string;
}) {
  const layer = (variant: 'bare' | 'makeup') => {
    const src = variant === 'bare' ? LANDING_IMAGES.before : LANDING_IMAGES.after;
    return src ? (
      <Image src={src} alt="" fill sizes="(min-width: 1024px) 420px, 90vw" className="object-cover" priority />
    ) : (
      <FaceIllustration variant={variant} id={`ba-${variant}`} className="absolute inset-x-0 bottom-0 h-[92%] w-full" />
    );
  };

  return (
    <figure
      role="img"
      aria-label={description}
      className={clsx(
        'relative aspect-[4/5] w-full overflow-hidden rounded-card bg-[radial-gradient(120%_80%_at_50%_0%,#fae6e6_0%,#f2e2d7_55%,#e8cfbf_100%)] shadow-lift',
        className,
      )}
    >
      <div className="absolute inset-0">{layer('bare')}</div>
      <div className="tonelle-reveal absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,#fdf5f5_0%,#f4cfd0_55%,#eaaeb1_100%)]">
        {layer('makeup')}
      </div>
      <div aria-hidden className="tonelle-reveal-line absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white/90 shadow-[0_0_12px_rgb(0_0_0/0.15)]">
        <span className="absolute top-1/2 left-1/2 grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-accent shadow-soft">
          <Sparkles className="size-4" />
        </span>
      </div>
      <span aria-hidden className="absolute top-4 left-4 rounded-pill bg-white/85 px-3 py-1 text-xs font-semibold text-ink backdrop-blur">
        {afterLabel}
      </span>
      <span aria-hidden className="absolute top-4 right-4 rounded-pill bg-white/85 px-3 py-1 text-xs font-semibold text-ink-muted backdrop-blur">
        {beforeLabel}
      </span>
      <span aria-hidden className="absolute right-4 bottom-4 inline-flex items-center gap-1 rounded-pill bg-surface-inverse/80 px-2.5 py-1 text-[0.7rem] font-medium text-ink-inverse backdrop-blur">
        <Sparkles className="size-3" />
        {aiLabel}
      </span>
    </figure>
  );
}

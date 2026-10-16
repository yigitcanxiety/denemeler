import clsx from 'clsx';
import { buttonClasses, type ButtonSize, type ButtonVariant } from '@/components/ui';
import type { SiteContent } from '@/content';
import { APP_STORE_LIVE, APP_STORE_URL } from '@/lib/app-store';
import { AppleGlyph } from './StoreBadges';

/**
 * The website's only call to action: points to the iOS app. Until launch (`APP_STORE_LIVE`)
 * it renders a plain, clearly labelled non-link so there is no dead link.
 */
export function AppStoreCta({
  labels,
  variant = 'dark',
  size = 'lg',
  fullWidth,
  className,
}: {
  labels: Pick<SiteContent['stores'], 'download' | 'soon'>;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}) {
  if (!APP_STORE_LIVE) {
    return (
      <span className={clsx(buttonClasses({ variant: 'soft', size, fullWidth }), 'pointer-events-none', className)}>
        <AppleGlyph className="size-5" />
        {labels.soon}
      </span>
    );
  }
  return (
    <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" className={clsx(buttonClasses({ variant, size, fullWidth }), className)}>
      <AppleGlyph className="size-5" />
      {labels.download}
    </a>
  );
}

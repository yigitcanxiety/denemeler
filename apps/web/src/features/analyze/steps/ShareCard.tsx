'use client';

import { SEASONS, localized, t, type FaceAnalysis, type Locale } from '@tonelle/shared';
import { Download, Share2 } from 'lucide-react';
import { forwardRef, useRef, useState } from 'react';
import { GiantWordmark } from '@/components/lab/GiantWordmark';
import { HeatFace } from '@/components/lab/HeatFace';
import { Logo } from '@/components/site/Logo';
import { Button, Modal } from '@/components/ui';
import { heatFrom } from '@/lib/heat';
import { SITE_URL } from '@/config/company';
import type { AnalyzeCopy, Translate } from '../types';

const CARD_W = 1080;
const CARD_H = 1920;
const PREVIEW_SCALE = 0.25;

/** 1080×1920 story card (DESIGN §5), rendered as DOM and exported with html-to-image. */
export const SeasonShareCard = forwardRef<HTMLDivElement, { locale: Locale; analysis: FaceAnalysis }>(
  function SeasonShareCard({ locale, analysis }, ref) {
    const season = SEASONS[analysis.season];
    const name = localized(season.name, locale);
    const colors = analysis.bestColors.slice(0, 8);
    const heat = heatFrom([analysis.lip[0] ?? '#C8354A', analysis.blush[0] ?? '#E0775E', analysis.eyeshadow[0] ?? '#F3B27A']);
    const cols = [90, 240, 390, 540, 690, 840, 990];
    const mono = { fontFamily: 'var(--font-mono)' } as const;
    return (
      <div
        ref={ref}
        style={{ width: CARD_W, height: CARD_H, backgroundColor: '#E6DED7', color: '#231816', fontFamily: 'var(--font-sans)' }}
        className="relative overflow-hidden"
      >
        {/* construction grid */}
        {cols.map((x) => (
          <span key={x} className="absolute top-0 bottom-0 w-px" style={{ left: x, backgroundColor: 'rgb(35 24 22 / 0.12)' }} />
        ))}
        {[200, 1000, 1370, 1590].map((y) => (
          <span key={y} className="absolute right-0 left-0 h-px" style={{ top: y, backgroundColor: 'rgb(35 24 22 / 0.12)' }} />
        ))}
        {/* accent construction circle + connector line */}
        <span className="absolute rounded-full" style={{ left: 540 - 400, top: 600 - 400, width: 800, height: 800, border: '2px solid #C8354A' }} />
        <span className="absolute h-[2px]" style={{ left: 0, right: 0, top: 599, backgroundColor: '#C8354A', opacity: 0.9 }} />
        <span className="absolute" style={{ left: 0, top: 590, width: 44, height: 20, backgroundColor: '#C8354A' }} />
        <span className="absolute" style={{ right: 0, top: 590, width: 44, height: 20, backgroundColor: '#C8354A' }} />

        {/* header */}
        <div className="absolute flex items-center justify-between" style={{ left: 90, right: 90, top: 84 }}>
          <span className="flex items-center gap-4 rounded-[20px] px-7 py-5" style={{ backgroundColor: '#EFE9E3' }}>
            <Logo className="text-[54px]" />
          </span>
          <span className="flex items-center gap-4 text-[28px] tracking-[0.06em] uppercase" style={mono}>
            <span className="grid size-[56px] place-items-center text-[24px]" style={{ backgroundColor: '#231816', color: '#E6DED7' }}>
              01
            </span>
            {t(locale, 'results.yourSeason')}
          </span>
        </div>

        {/* heat-map face */}
        <div className="absolute rounded-full" style={{ left: 540 - 320, top: 600 - 320, width: 640, height: 640, background: 'radial-gradient(circle at 50% 55%, rgb(243 178 122 / 0.35), rgb(224 119 94 / 0.12) 48%, transparent 70%)' }} />
        <HeatFace id="share-face" palette={heat} animated={false} showBody={false} className="absolute" style={{ left: 540 - 240, top: 600 - 305, width: 480, height: 610 }} />
        <span
          className="absolute flex items-center gap-3 px-4 py-2 text-[26px] tracking-[0.06em] uppercase"
          style={{ ...mono, left: 540, top: 872, transform: 'translateX(-50%)', backgroundColor: '#C8354A', color: '#fff' }}
        >
          <span className="size-3 rounded-full bg-white" />
          {t(locale, 'common.aiGenerated')}
        </span>

        {/* season */}
        <div className="absolute" style={{ left: 84, right: 84, top: 1030 }}>
          <p className="text-[30px] tracking-[0.02em]" style={mono}>
            {t(locale, 'share.cardHeadline', { season: name })}
          </p>
          <h2 className="mt-6 font-semibold" style={{ fontSize: name.length > 14 ? 124 : 150, lineHeight: 0.88, letterSpacing: '-0.055em' }}>
            {name}
          </h2>
        </div>

        {/* palette */}
        <div className="absolute" style={{ left: 90, right: 90, top: 1396 }}>
          <p className="text-[26px] tracking-[0.06em] uppercase" style={{ ...mono, color: '#6E605B' }}>
            {t(locale, 'share.cardPaletteLabel')}
          </p>
          <div className="mt-6 flex gap-[8px] overflow-hidden rounded-[24px]" style={{ height: 92 }}>
            {colors.map((c) => (
              <span key={c} className="block flex-1" style={{ backgroundColor: c }} />
            ))}
          </div>
        </div>

        {/* footer: giant wordmark + caption */}
        <div className="absolute" style={{ left: 72, right: 72, bottom: 112 }}>
          <GiantWordmark enter="none" />
        </div>
        <div className="absolute flex items-center justify-between" style={{ left: 90, right: 90, bottom: 40 }}>
          <span className="text-[26px]" style={{ ...mono, color: '#6E605B' }}>
            {t(locale, 'share.cardFooter')}
          </span>
          <span className="size-4 bg-[#C8354A]" />
        </div>
      </div>
    );
  },
);

export function ShareCardDialog({
  open,
  onClose,
  locale,
  analysis,
  copy,
  tt,
}: {
  open: boolean;
  onClose: () => void;
  locale: Locale;
  analysis: FaceAnalysis;
  copy: AnalyzeCopy;
  tt: Translate;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState<'download' | 'share' | null>(null);
  const [error, setError] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const seasonName = localized(SEASONS[analysis.season].name, locale);
  const canShareFiles =
    typeof navigator !== 'undefined' && typeof navigator.canShare === 'function' && typeof File !== 'undefined';

  const render = async (): Promise<Blob> => {
    const node = cardRef.current;
    if (!node) throw new Error('Card not mounted');
    const { toBlob } = await import('html-to-image');
    const options = { width: CARD_W, height: CARD_H, pixelRatio: 1, cacheBust: true, backgroundColor: '#E6DED7' };
    let blob: Blob | null = null;
    try {
      blob = await toBlob(node, options);
    } catch {
      // Font embedding can fail on some browsers; retry with system fonts.
      blob = await toBlob(node, { ...options, skipFonts: true });
    }
    if (!blob) throw new Error('Empty image');
    return blob;
  };

  const fileName = `tonelle-${analysis.season}.png`;

  const download = async () => {
    setBusy('download');
    setError(false);
    try {
      const blob = await render();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setStatus(tt('share.saved'));
    } catch {
      setError(true);
    } finally {
      setBusy(null);
    }
  };

  const share = async () => {
    setBusy('share');
    setError(false);
    try {
      const blob = await render();
      const file = new File([blob], fileName, { type: 'image/png' });
      const text = tt('share.caption', { season: seasonName, url: SITE_URL.replace(/^https?:\/\//, '') });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text, title: tt('share.title') });
      } else {
        await navigator.share({ text, url: `${SITE_URL}/${locale}`, title: tt('share.title') });
      }
    } catch (err) {
      if (!(err instanceof Error && err.name === 'AbortError')) setError(true);
    } finally {
      setBusy(null);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={tt('share.title')} closeLabel={copy.shareClose}>
      <p className="mono text-ink-muted">{tt('share.subtitle')}</p>
      <div
        className="mx-auto mt-5 overflow-hidden rounded-[18px] ring-1 ring-line-strong"
        style={{ width: CARD_W * PREVIEW_SCALE, height: CARD_H * PREVIEW_SCALE }}
      >
        {/* The transform lives on this wrapper so the exported node itself is unscaled. */}
        <div style={{ transform: `scale(${PREVIEW_SCALE})`, transformOrigin: 'top left', width: CARD_W, height: CARD_H }}>
          <SeasonShareCard ref={cardRef} locale={locale} analysis={analysis} />
        </div>
      </div>
      <div aria-live="polite" className="mt-3 min-h-5 text-center text-sm">
        {busy && <span className="text-ink-muted">{tt('share.generating')}</span>}
        {!busy && error && <span className="text-danger">{copy.shareFailed}</span>}
        {!busy && !error && status && <span className="text-success">{status}</span>}
      </div>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <Button
          fullWidth
          loading={busy === 'download'}
          disabled={busy !== null}
          onClick={() => void download()}
          icon={<Download aria-hidden className="size-4" />}
        >
          {tt('share.download')}
        </Button>
        {canShareFiles && (
          <Button
            fullWidth
            variant="secondary"
            loading={busy === 'share'}
            disabled={busy !== null}
            onClick={() => void share()}
            icon={<Share2 aria-hidden className="size-4" />}
          >
            {tt('share.shareButton')}
          </Button>
        )}
      </div>
    </Modal>
  );
}

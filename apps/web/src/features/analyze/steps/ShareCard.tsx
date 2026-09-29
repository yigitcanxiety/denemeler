'use client';

import { SEASONS, localized, t, type FaceAnalysis, type Locale } from '@tonelle/shared';
import { Download, Share2, Sparkles } from 'lucide-react';
import { forwardRef, useRef, useState } from 'react';
import { Button, Modal } from '@/components/ui';
import { SITE_URL } from '@/config/company';
import type { AnalyzeCopy, Translate } from '../types';

const CARD_W = 1080;
const CARD_H = 1920;
const PREVIEW_SCALE = 0.25;

/** 1080×1920 story card, rendered as DOM and exported with html-to-image. */
export const SeasonShareCard = forwardRef<HTMLDivElement, { locale: Locale; analysis: FaceAnalysis }>(
  function SeasonShareCard({ locale, analysis }, ref) {
    const season = SEASONS[analysis.season];
    const name = localized(season.name, locale);
    const colors = analysis.bestColors.slice(0, 8);
    return (
      <div
        ref={ref}
        style={{
          width: CARD_W,
          height: CARD_H,
          background: `linear-gradient(160deg, #fdf9f6 0%, ${season.palette[0]}55 45%, ${season.palette[3]}66 100%)`,
        }}
        className="relative flex flex-col items-center overflow-hidden px-[96px] py-[120px] text-ink"
      >
        <div className="flex items-center gap-5">
          <span className="block size-[56px] rounded-full bg-[conic-gradient(from_200deg,#e8cfbf,#c96a71,#a7775e,#e8cfbf)]" />
          <span className="font-display text-[88px] leading-none tracking-tight">Tonelle</span>
        </div>

        <p className="mt-[150px] text-[44px] font-medium tracking-[0.2em] text-ink-muted uppercase">
          {t(locale, 'results.yourSeason')}
        </p>
        <h2 className="mt-8 text-center font-display text-[120px] leading-[1.04]">
          {t(locale, 'share.cardHeadline', { season: name })}
        </h2>

        <p className="mt-[100px] text-[40px] font-semibold text-ink">{t(locale, 'share.cardPaletteLabel')}</p>
        <div className="mt-12 grid grid-cols-4 gap-10">
          {colors.map((c) => (
            <span
              key={c}
              className="block size-[160px] rounded-full border-[10px] border-white shadow-[0_12px_40px_rgb(92_58_50/0.18)]"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        <div className="mt-auto flex flex-col items-center gap-8">
          <span className="inline-flex items-center gap-3 rounded-full bg-surface-inverse/85 px-8 py-4 text-[34px] font-medium text-ink-inverse">
            <Sparkles className="size-[34px]" />
            {t(locale, 'common.aiGenerated')}
          </span>
          <p className="text-[40px] text-ink-muted">{t(locale, 'share.cardFooter')}</p>
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
    const options = { width: CARD_W, height: CARD_H, pixelRatio: 1, cacheBust: true, backgroundColor: '#fdf9f6' };
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
      <p className="text-sm text-ink-muted">{tt('share.subtitle')}</p>
      <div
        className="mx-auto mt-5 overflow-hidden rounded-2xl shadow-card"
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

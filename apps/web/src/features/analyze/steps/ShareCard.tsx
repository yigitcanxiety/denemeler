'use client';

import { SEASONS, localized, t, type FaceAnalysis, type Locale } from '@tonelle/shared';
import { Download, Share2 } from 'lucide-react';
import { forwardRef, useRef, useState } from 'react';
import { Button, Modal } from '@/components/ui';
import { SITE_URL } from '@/config/company';
import type { AnalyzeCopy, Translate } from '../types';

const CARD_W = 1080;
const CARD_H = 1920;
const PREVIEW_SCALE = 0.25;
const BG = '#F6F4FE';

/** 1080×1920 story card (DESIGN §3): white/lavender, serif season name, palette, portrait, wordmark. */
export const SeasonShareCard = forwardRef<HTMLDivElement, { locale: Locale; analysis: FaceAnalysis; photo?: string | null }>(
  function SeasonShareCard({ locale, analysis, photo }, ref) {
    const season = SEASONS[analysis.season];
    const name = localized(season.name, locale);
    const colors = analysis.bestColors.slice(0, 8);
    const serif = { fontFamily: 'var(--font-display)' } as const;
    return (
      <div
        ref={ref}
        style={{ width: CARD_W, height: CARD_H, background: `linear-gradient(180deg, #FFFFFF 0%, ${BG} 45%, #E9E5FB 100%)`, color: '#17141F', fontFamily: 'var(--font-sans)' }}
        className="relative overflow-hidden"
      >
        {/* header */}
        <div className="absolute flex items-center justify-between" style={{ left: 90, right: 90, top: 96 }}>
          <span style={{ ...serif, fontSize: 64, letterSpacing: '-0.02em' }}>Tonelle</span>
          <span className="rounded-full" style={{ background: '#EDE8FF', color: '#5A3FE0', fontSize: 28, fontWeight: 700, padding: '14px 28px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            ✦ {t(locale, 'results.yourSeason')}
          </span>
        </div>

        {/* portrait / season gradient */}
        <div
          className="absolute overflow-hidden"
          style={{ left: 190, top: 250, width: 700, height: 820, borderRadius: 64, background: 'linear-gradient(160deg,#F8E4D8,#EFD8E6 55%,#E6E0FA)', boxShadow: '0 60px 120px -60px rgba(40,20,110,.45)' }}
        >
          {photo && (
            // eslint-disable-next-line @next/next/no-img-element -- in-memory data URL, exported locally
            <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          )}
          <span
            className="absolute flex items-center"
            style={{ right: 32, bottom: 32, gap: 12, background: 'rgba(255,255,255,.92)', color: '#7457F5', borderRadius: 999, padding: '14px 26px', fontSize: 26, fontWeight: 700 }}
          >
            ✦ {t(locale, 'common.aiGenerated')}
          </span>
        </div>

        {/* season */}
        <div className="absolute text-center" style={{ left: 80, right: 80, top: 1140 }}>
          <p style={{ fontSize: 34, color: '#6B6679' }}>{t(locale, 'share.cardHeadline', { season: name })}</p>
          <h2 style={{ ...serif, marginTop: 20, fontSize: name.length > 14 ? 118 : 138, lineHeight: 1, letterSpacing: '-0.01em' }}>{name}</h2>
        </div>

        {/* palette */}
        <div className="absolute" style={{ left: 110, right: 110, top: 1500 }}>
          <p className="text-center" style={{ fontSize: 26, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B6679' }}>
            {t(locale, 'share.cardPaletteLabel')}
          </p>
          <div className="flex" style={{ marginTop: 28, gap: 14 }}>
            {colors.map((c) => (
              <span key={c} className="block flex-1" style={{ height: 110, borderRadius: 28, backgroundColor: c }} />
            ))}
          </div>
        </div>

        {/* footer */}
        <div className="absolute text-center" style={{ left: 90, right: 90, bottom: 80, fontSize: 28, color: '#6B6679' }}>
          {t(locale, 'share.cardFooter')}
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
  photo,
  copy,
  tt,
}: {
  open: boolean;
  onClose: () => void;
  locale: Locale;
  analysis: FaceAnalysis;
  photo?: string | null;
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
    const options = { width: CARD_W, height: CARD_H, pixelRatio: 1, cacheBust: true, backgroundColor: BG };
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
      <p className="text-[14.5px] text-muted">{tt('share.subtitle')}</p>
      <div
        className="mx-auto mt-5 overflow-hidden rounded-[18px] ring-1 ring-line"
        style={{ width: CARD_W * PREVIEW_SCALE, height: CARD_H * PREVIEW_SCALE }}
      >
        {/* The transform lives on this wrapper so the exported node itself is unscaled. */}
        <div style={{ transform: `scale(${PREVIEW_SCALE})`, transformOrigin: 'top left', width: CARD_W, height: CARD_H }}>
          <SeasonShareCard ref={cardRef} locale={locale} analysis={analysis} photo={photo} />
        </div>
      </div>
      <div aria-live="polite" className="mt-3 min-h-5 text-center text-sm">
        {busy && <span className="text-muted">{tt('share.generating')}</span>}
        {!busy && error && <span className="text-danger">{copy.shareFailed}</span>}
        {!busy && !error && status && <span className="text-mint-ink">{status}</span>}
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

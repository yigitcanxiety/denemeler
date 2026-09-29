'use client';

import { LOOKS, SEASONS, localized, type FaceAnalysis, type LookId, type TranslationKey } from '@tonelle/shared';
import clsx from 'clsx';
import { Camera, ChevronDown, RefreshCw, Share2, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { HeatFace } from '@/components/lab/HeatFace';
import { Chip, PaletteBar } from '@/components/lab/primitives';
import { Button, Modal, SwatchBar } from '@/components/ui';
import { apiClient, errorMessageKey, type ApiClient } from '@/lib/api-client';
import { heatFrom } from '@/lib/heat';
import { getAppUserId } from '@/lib/storage';
import type { StepProps } from '../types';
import { Eyebrow, RoundButton, delay } from '../ui';
import { ShareCardDialog } from './ShareCard';

/** Settled render results; a look without an entry is pending (queued or in flight). */
type RenderState = { status: 'done'; image: string } | { status: 'error'; messageKey: TranslationKey };
type LookRenderState = RenderState | { status: 'pending' };

function Swatches({ title, colors, tt, crossed }: { title: string; colors: string[]; tt: StepProps['tt']; crossed?: boolean }) {
  return (
    <div>
      <h3 className="mono-caps text-ink-inverse-muted">{title}</h3>
      <SwatchBar
        className="mt-3"
        colors={colors}
        label={title}
        copyLabel={tt('results.copyHex')}
        copiedLabel={tt('results.copied')}
        crossed={crossed}
      />
    </div>
  );
}

/** BRIK "Best score / Reaction speed" metric card. */
function Metric({ label, value, neck, className }: { label: string; value: string; neck?: 'top' | 'left'; className?: string }) {
  return (
    <div className={clsx('ink-card flex min-h-[8.5rem] flex-col justify-between p-5', neck === 'top' && 'neck-top', neck === 'left' && 'neck-left', className)}>
      <p className="text-[0.95rem] leading-tight text-ink-inverse">{label}</p>
      <p className="mt-4 text-[clamp(1.5rem,6.6vw,2rem)] leading-none font-light tracking-[-0.035em] text-accent-soft">{value}</p>
    </div>
  );
}

function LookCard({
  lookId,
  index,
  state: render,
  photo,
  analysis,
  onRetry,
  onNewSelfie,
  copy,
  tt,
  locale,
}: {
  lookId: LookId;
  index: number;
  state: LookRenderState;
  photo: string | null;
  analysis: FaceAnalysis;
  onRetry: () => void;
  onNewSelfie: () => void;
} & Pick<StepProps, 'copy' | 'tt' | 'locale'>) {
  const look = LOOKS[lookId];
  const [showBefore, setShowBefore] = useState(false);
  const shades = [
    analysis.lip[index % analysis.lip.length],
    analysis.blush[index % analysis.blush.length],
    analysis.eyeshadow[index % analysis.eyeshadow.length],
  ].filter((c): c is string => Boolean(c));

  return (
    <article className="ink-card flex flex-col p-3">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[18px] bg-night">
        {!photo ? (
          <div className="flex size-full flex-col items-center justify-center gap-4 p-6 text-center">
            <HeatFace id={`look-empty-${index}`} tone="night" showBody={false} animated={false} palette={heatFrom(shades)} className="h-[42%] w-auto opacity-80" />
            <p className="mono text-[12px] text-ink-inverse-muted">{copy.resultsPhotoNeeded}</p>
            <Button size="sm" variant="soft" onClick={onNewSelfie} icon={<Camera aria-hidden className="size-4" />}>
              {copy.resultsNewSelfie}
            </Button>
          </div>
        ) : render.status === 'done' ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element -- generated data URL */}
            <img
              src={showBefore ? photo : render.image}
              alt={showBefore ? tt('look.before') : `${localized(look.name, locale)} (${tt('common.aiGenerated')})`}
              className="size-full object-cover"
            />
            {!showBefore && (
              <Chip tone="soft" className="absolute bottom-3 left-3">
                AI · {tt('common.aiGenerated')}
              </Chip>
            )}
            <div className="mono-caps absolute top-3 right-3 flex rounded-pill bg-ink/70 p-1 text-ink-inverse backdrop-blur">
              <button
                type="button"
                aria-pressed={showBefore}
                onClick={() => setShowBefore(true)}
                className={clsx('h-9 rounded-pill px-3', showBefore && 'bg-accent-soft text-[#231816]')}
              >
                {tt('look.before')}
              </button>
              <button
                type="button"
                aria-pressed={!showBefore}
                onClick={() => setShowBefore(false)}
                className={clsx('h-9 rounded-pill px-3', !showBefore && 'bg-accent-soft text-[#231816]')}
              >
                {tt('look.after')}
              </button>
            </div>
          </>
        ) : render.status === 'error' ? (
          <div className="flex size-full flex-col items-center justify-center gap-3 p-6 text-center">
            <p className="font-medium text-ink-inverse">{copy.renderFailed}</p>
            <p className="mono text-[12px] text-ink-inverse-muted">{tt(render.messageKey)}</p>
            <Button size="sm" variant="soft" onClick={onRetry} icon={<RefreshCw aria-hidden className="size-4" />}>
              {tt('common.retry')}
            </Button>
          </div>
        ) : (
          <div className="relative size-full">
            {/* eslint-disable-next-line @next/next/no-img-element -- local preview */}
            <img src={photo} alt="" className="size-full object-cover opacity-40 blur-[3px]" />
            <div aria-hidden className="shimmer absolute inset-0" />
            <div role="status" className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center">
              <span aria-hidden className="spin size-8 rounded-full border-2 border-accent-soft border-r-transparent" />
              <p className="mt-1 font-medium text-ink-inverse">{tt('look.rendering')}</p>
              <p className="mono text-[12px] text-ink-inverse-muted">{tt('look.renderingHint')}</p>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col px-3 pt-5 pb-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[1.5rem] text-ink-inverse">{localized(look.name, locale)}</h3>
          <Chip tone="soft" className="mt-1">
            AI
          </Chip>
        </div>
        <p className="mono mt-2 text-ink-inverse-muted">{localized(look.description, locale)}</p>
        <div className="mt-4 flex flex-wrap gap-1.5 text-ink-inverse-muted">
          {look.occasions.map((o) => (
            <Chip key={o} tone="line">
              {tt(`look.occasionTag.${o}`)}
            </Chip>
          ))}
          <Chip tone="line" className="text-accent-soft">
            {tt(`look.level.${look.level}`)}
          </Chip>
        </div>
        <div className="mt-5">
          <p className="mono-caps text-ink-inverse-muted">{tt('look.shadesTitle')}</p>
          <PaletteBar colors={shades} height="h-8" className="mt-2" />
        </div>
        <details className="group mt-5 rounded-[16px] bg-white/[0.05]">
          <summary className="mono-caps flex min-h-11 cursor-pointer items-center justify-between px-4 text-ink-inverse">
            {tt('look.stepsTitle')}
            <ChevronDown aria-hidden className="size-4 transition-transform group-open:rotate-180 motion-reduce:transition-none" />
          </summary>
          <ol className="space-y-3 px-4 pb-4">
            {look.steps.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="mono grid size-6 shrink-0 place-items-center bg-accent-soft text-[11px] text-[#231816]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <p className="font-medium text-ink-inverse">{localized(step.title, locale)}</p>
                  <p className="mono mt-1 text-[12.5px] text-ink-inverse-muted">{localized(step.body, locale)}</p>
                </div>
              </li>
            ))}
          </ol>
        </details>
      </div>
    </article>
  );
}

/** BRIK bottom navigation: round ink buttons flanking a pill segmented control. */
function ResultsNav({
  copy,
  tt,
  onShare,
  onStartOver,
}: Pick<StepProps, 'copy' | 'tt'> & { onShare: () => void; onStartOver: () => void }) {
  const [active, setActive] = useState<'results' | 'looks'>('results');
  useEffect(() => {
    const looks = document.getElementById('looks');
    if (!looks || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry) setActive(entry.boundingClientRect.top < window.innerHeight * 0.6 ? 'looks' : 'results');
    }, { threshold: [0, 0.2, 0.5, 1], rootMargin: '0px 0px -40% 0px' });
    io.observe(looks);
    return () => io.disconnect();
  }, []);

  const item = (id: 'results' | 'looks', href: string, label: string) => (
    <a
      href={href}
      aria-current={active === id ? 'true' : undefined}
      onClick={() => setActive(id)}
      className={clsx(
        'mono-caps grid h-11 flex-1 place-items-center rounded-pill px-3 transition-colors',
        active === id ? 'bg-accent-soft text-[#231816]' : 'text-ink-inverse hover:text-accent-soft',
      )}
    >
      {label}
    </a>
  );

  return (
    <nav aria-label={tt('results.title')} className="sticky bottom-3 z-20 mx-auto mt-4 flex w-full max-w-sm items-center gap-2">
      <RoundButton label={copy.resultsShareCta} onClick={onShare} className="size-12 shadow-lift">
        <Share2 aria-hidden className="size-4" />
      </RoundButton>
      <div className="flex flex-1 rounded-pill bg-ink p-0.5 shadow-lift">
        {item('results', '#results-top', copy.navResults)}
        {item('looks', '#looks', copy.navLooks)}
      </div>
      <RoundButton label={copy.resultsStartOver} onClick={onStartOver} className="size-12 shadow-lift">
        <RefreshCw aria-hidden className="size-4" />
      </RoundButton>
    </nav>
  );
}

export function ResultsStep({
  locale,
  state,
  dispatch,
  copy,
  tt,
  client = apiClient,
}: StepProps & { client?: ApiClient }) {
  const result = state.result;
  const [renders, setRenders] = useState<Partial<Record<LookId, RenderState>>>({});
  const [shareOpen, setShareOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const photo = state.photo;

  const inFlight = useRef<LookId | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  // Abort a pending render when leaving the results screen.
  useEffect(() => () => controllerRef.current?.abort(), []);

  // Render looks one at a time (cost + rate limits), only while we still hold the photo.
  useEffect(() => {
    if (!result || !photo || !state.unlocked || inFlight.current) return;
    const next = result.recommendedLookIds.find((id) => !renders[id]);
    if (!next) return;
    const controller = new AbortController();
    controllerRef.current = controller;
    inFlight.current = next;
    void client
      .renderLook(
        { image: photo, lookId: next, analysis: result.analysis, appUserId: getAppUserId(), locale },
        { signal: controller.signal },
      )
      .then((res) => {
        inFlight.current = null;
        setRenders((r) => {
          const copy = { ...r };
          if (res.ok) copy[next] = { status: 'done', image: res.data.image };
          else if (res.error.code === 'aborted') delete copy[next];
          else copy[next] = { status: 'error', messageKey: errorMessageKey(res.error.code) };
          return copy;
        });
      });
  }, [result, photo, state.unlocked, renders, client, locale]);

  if (!result) return null;
  const { analysis } = result;
  const season = SEASONS[analysis.season];
  const heat = heatFrom([analysis.lip[0] ?? '#C8354A', analysis.blush[0] ?? '#E0775E', analysis.eyeshadow[0] ?? '#F3B27A']);

  const pairs: [TranslationKey, string][][] = [
    [
      ['results.undertoneTitle', tt(`results.undertone.${analysis.undertone}`)],
      ['results.contrastTitle', tt(`results.contrast.${analysis.contrast}`)],
    ],
    [
      ['results.skinDepthTitle', tt(`results.skinDepth.${analysis.skinDepth}`)],
      ['results.faceShapeTitle', tt(`results.faceShape.${analysis.faceShape}`)],
    ],
    [
      ['results.eyeShapeTitle', tt(`results.eyeShape.${analysis.eyeShape}`)],
      ['results.yourSeason', tt('results.confidence', { percent: Math.round(analysis.seasonConfidence * 100) })],
    ],
  ];

  return (
    <div id="results-top" className="scroll-mt-4">
      <div className="grid gap-[10px] lg:grid-cols-12">
        {/* Hero: season in huge type */}
        <section className="enter ink-card neck-top relative overflow-hidden p-6 sm:p-8 lg:col-span-7" style={delay(40)}>
          <Eyebrow n="07">{tt('results.title')}</Eyebrow>
          <div className="relative mt-6 grid grid-cols-[1fr_auto] items-end gap-4">
            <div className="min-w-0">
              <p className="mono-caps text-ink-inverse-muted">{tt('results.yourSeason')}</p>
              <h1 className="mt-2 text-[clamp(2.8rem,13vw,5.4rem)] leading-[0.88] tracking-[-0.055em] text-ink-inverse [overflow-wrap:anywhere]">
                {localized(season.name, locale)}
              </h1>
            </div>
            <HeatFace id="results-face" tone="night" showBody={false} palette={heat} className="h-28 w-auto sm:h-36" />
          </div>
          <p className="mt-6 max-w-[52ch] leading-relaxed text-ink-inverse-muted">{localized(season.description, locale)}</p>
          <PaletteBar colors={season.palette} height="h-3" className="mt-6" />
          <p className="mono mt-4 flex items-center gap-2 text-[11.5px] text-ink-inverse-muted">
            <span aria-hidden className="size-1.5 shrink-0 bg-accent-soft" />
            {tt('results.savedOnDevice')}
          </p>
        </section>

        {/* Metric cards in pairs joined by necks */}
        <div className="flex flex-col gap-[10px] lg:col-span-5">
          {pairs.map((row, r) => (
            <div key={r} className="enter grid grid-cols-2 gap-[10px]" style={delay(100 + r * 60)}>
              {row.map(([label, value], c) => (
                <Metric
                  key={label}
                  label={tt(label)}
                  value={value}
                  neck={c === 1 ? 'left' : r === 0 ? 'top' : undefined}
                  className={clsx(c === 0 && r === 0 && 'lg:neck-none', 'lg:min-h-0 lg:flex-1')}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-[10px] grid gap-[10px] lg:grid-cols-12">
        {/* Summary */}
        <section className="enter rounded-card bg-paper-raised p-6 sm:p-8 lg:col-span-5" style={delay(160)}>
          <h2 className="mono-caps text-ink-muted">{tt('results.summaryTitle')}</h2>
          <p className="mt-4 text-[1.08rem] leading-relaxed text-ink">{analysis.summary}</p>
          <p className="mono mt-6 border-t border-line-strong pt-4 text-[12px] text-ink-muted">{tt('results.disclaimer')}</p>
        </section>

        {/* Palette */}
        <section className="enter ink-card space-y-7 p-6 sm:p-8 lg:col-span-7" style={delay(200)}>
          <Swatches title={tt('results.bestColors')} colors={analysis.bestColors} tt={tt} />
          <Swatches title={tt('results.avoidColors')} colors={analysis.avoidColors} tt={tt} crossed />
        </section>
      </div>

      {/* Shades */}
      <section className="enter ink-card neck-top mt-[10px] grid gap-8 p-6 sm:p-8 lg:grid-cols-12 lg:gap-6" style={delay(240)}>
        <div className="lg:col-span-5">
          <h2 className="mono-caps text-ink-inverse-muted">{tt('results.foundationTitle')}</h2>
          <p className="mt-4 text-[1.6rem] leading-tight font-light tracking-[-0.03em] text-ink-inverse">
            {tt('results.foundationUndertone', { label: analysis.foundation.undertoneLabel })}
          </p>
          <p className="mt-1 text-[1.6rem] leading-tight font-light tracking-[-0.03em] text-accent-soft">
            {tt('results.foundationRange', { range: analysis.foundation.shadeRange })}
          </p>
          <p className="mono mt-4 text-[12px] text-ink-inverse-muted">{copy.resultsFoundationHint}</p>
        </div>
        <div className="space-y-6 lg:col-span-7">
          <Swatches title={tt('results.lipTitle')} colors={analysis.lip} tt={tt} />
          <Swatches title={tt('results.blushTitle')} colors={analysis.blush} tt={tt} />
          <Swatches title={tt('results.eyeshadowTitle')} colors={analysis.eyeshadow} tt={tt} />
        </div>
      </section>

      {/* Looks */}
      <section id="looks" aria-labelledby="looks-title" className="scroll-mt-4 pt-14">
        <div className="flex flex-wrap items-end justify-between gap-3 px-1">
          <h2 id="looks-title" className="text-[clamp(2.2rem,9vw,3.6rem)] text-ink">
            {tt('results.looksTitle')}
          </h2>
          <p className="mono text-[12px] text-ink-muted">{tt('common.aiGeneratedNote')}</p>
        </div>
        <div className="mt-6 grid gap-[10px] sm:grid-cols-2 lg:grid-cols-3">
          {result.recommendedLookIds.map((id, i) => (
            <LookCard
              key={id}
              lookId={id}
              index={i}
              state={renders[id] ?? { status: 'pending' }}
              photo={photo}
              analysis={analysis}
              onRetry={() =>
                setRenders((r) => {
                  const copy = { ...r };
                  delete copy[id];
                  return copy;
                })
              }
              onNewSelfie={() => dispatch({ type: 'NEW_SELFIE' })}
              copy={copy}
              tt={tt}
              locale={locale}
            />
          ))}
        </div>
      </section>

      {/* Share */}
      <section className="mt-14 flex flex-col items-start gap-5 rounded-card bg-paper-raised p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <h2 className="text-[1.9rem] text-ink">{tt('share.title')}</h2>
          <p className="mono mt-2 text-ink-muted">{tt('share.subtitle')}</p>
        </div>
        <Button onClick={() => setShareOpen(true)} icon={<Share2 aria-hidden className="size-4" />}>
          {copy.resultsShareCta}
        </Button>
      </section>

      <div className="mt-6 flex flex-col gap-2 border-t border-line-strong pt-6 sm:flex-row">
        <Button variant="secondary" onClick={() => dispatch({ type: 'START_OVER' })} icon={<RefreshCw aria-hidden className="size-4" />}>
          {copy.resultsStartOver}
        </Button>
        <Button variant="ghost" onClick={() => setConfirmDelete(true)} icon={<Trash2 aria-hidden className="size-4" />}>
          {tt('settings.deleteData')}
        </Button>
      </div>

      <ResultsNav copy={copy} tt={tt} onShare={() => setShareOpen(true)} onStartOver={() => dispatch({ type: 'START_OVER' })} />

      <ShareCardDialog open={shareOpen} onClose={() => setShareOpen(false)} locale={locale} analysis={analysis} copy={copy} tt={tt} />

      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title={tt('settings.deleteDataTitle')}
        closeLabel={tt('common.close')}
        size="sm"
      >
        <p className="text-ink-muted">{tt('settings.deleteDataBody')}</p>
        <div className="mt-6 flex flex-col gap-2">
          <Button
            fullWidth
            variant="danger"
            onClick={() => {
              setConfirmDelete(false);
              dispatch({ type: 'DELETE_DATA' });
            }}
          >
            {tt('settings.deleteDataConfirm')}
          </Button>
          <Button variant="ghost" fullWidth onClick={() => setConfirmDelete(false)}>
            {tt('common.cancel')}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

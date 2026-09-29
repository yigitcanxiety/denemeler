'use client';

import { LOOKS, SEASONS, localized, type FaceAnalysis, type LookId, type TranslationKey } from '@tonelle/shared';
import { Camera, ChevronDown, Info, RefreshCw, Share2, Sparkles, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { AttributeChip, Button, Card, Chip, Modal, Skeleton, Swatch, SwatchRow } from '@/components/ui';
import { apiClient, errorMessageKey, type ApiClient } from '@/lib/api-client';
import { getAppUserId } from '@/lib/storage';
import type { StepProps } from '../types';
import { ShareCardDialog } from './ShareCard';

/** Settled render results; a look without an entry is pending (queued or in flight). */
type RenderState = { status: 'done'; image: string } | { status: 'error'; messageKey: TranslationKey };
type LookRenderState = RenderState | { status: 'pending' };

function SwatchGroup({ title, colors, tt, crossed }: { title: string; colors: string[]; tt: StepProps['tt']; crossed?: boolean }) {
  return (
    <div>
      <h3 className="font-sans text-sm font-semibold text-ink">{title}</h3>
      <SwatchRow className="mt-3">
        {colors.map((c) => (
          <Swatch
            key={c}
            color={c}
            label={title}
            copyLabel={tt('results.copyHex')}
            copiedLabel={tt('results.copied')}
            showHex
            crossed={crossed}
          />
        ))}
      </SwatchRow>
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
  const shades = [analysis.lip[index % analysis.lip.length], analysis.blush[index % analysis.blush.length], analysis.eyeshadow[index % analysis.eyeshadow.length]].filter(
    (c): c is string => Boolean(c),
  );

  return (
    <Card as="article" padding="none" className="overflow-hidden">
      <div className="relative aspect-[4/5] bg-surface-sunken">
        {!photo ? (
          <div className="flex size-full flex-col items-center justify-center gap-3 p-6 text-center">
            <Camera aria-hidden className="size-8 text-blush-400" />
            <p className="text-sm text-ink-muted">{copy.resultsPhotoNeeded}</p>
            <Button size="sm" variant="secondary" onClick={onNewSelfie}>
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
              <Chip tone="inverse" size="sm" className="absolute bottom-3 left-3" icon={<Sparkles aria-hidden className="size-3" />}>
                {tt('common.aiGenerated')}
              </Chip>
            )}
            <div className="absolute top-3 right-3 flex rounded-pill bg-black/40 p-0.5 text-xs font-semibold text-white backdrop-blur">
              <button
                type="button"
                aria-pressed={showBefore}
                onClick={() => setShowBefore(true)}
                className={showBefore ? 'rounded-pill bg-white px-3 py-1 text-ink' : 'px-3 py-1'}
              >
                {tt('look.before')}
              </button>
              <button
                type="button"
                aria-pressed={!showBefore}
                onClick={() => setShowBefore(false)}
                className={!showBefore ? 'rounded-pill bg-white px-3 py-1 text-ink' : 'px-3 py-1'}
              >
                {tt('look.after')}
              </button>
            </div>
          </>
        ) : render.status === 'error' ? (
          <div className="flex size-full flex-col items-center justify-center gap-3 p-6 text-center">
            <p className="text-sm font-medium text-ink">{copy.renderFailed}</p>
            <p className="text-sm text-ink-muted">{tt(render.messageKey)}</p>
            <Button size="sm" variant="secondary" onClick={onRetry} icon={<RefreshCw aria-hidden className="size-4" />}>
              {tt('common.retry')}
            </Button>
          </div>
        ) : (
          <div className="relative size-full">
            {/* eslint-disable-next-line @next/next/no-img-element -- local preview */}
            <img src={photo} alt="" className="size-full object-cover opacity-40 blur-sm" />
            <Skeleton className="absolute inset-0 rounded-none opacity-60" />
            <div role="status" className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center">
              <span aria-hidden className="size-8 animate-spin rounded-full border-3 border-accent border-r-transparent" />
              <p className="text-sm font-semibold text-ink">{tt('look.rendering')}</p>
              <p className="text-xs text-ink-muted">{tt('look.renderingHint')}</p>
            </div>
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-xl text-ink">{localized(look.name, locale)}</h3>
        <p className="mt-1 text-sm leading-relaxed text-ink-muted">{localized(look.description, locale)}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {look.occasions.map((o) => (
            <Chip key={o} size="sm">
              {tt(`look.occasionTag.${o}`)}
            </Chip>
          ))}
          <Chip size="sm" tone="accent">
            {tt(`look.level.${look.level}`)}
          </Chip>
        </div>
        <div className="mt-4">
          <p className="text-xs font-semibold text-ink-muted">{tt('look.shadesTitle')}</p>
          <SwatchRow className="mt-2">
            {shades.map((c) => (
              <Swatch key={c} color={c} size="sm" label={tt('look.shadesTitle')} />
            ))}
          </SwatchRow>
        </div>
        <details className="group mt-4 rounded-2xl bg-surface-sunken/70">
          <summary className="flex cursor-pointer items-center justify-between px-4 py-3 text-sm font-semibold text-ink">
            {tt('look.stepsTitle')}
            <ChevronDown aria-hidden className="size-4 transition-transform group-open:rotate-180" />
          </summary>
          <ol className="space-y-3 px-4 pb-4">
            {look.steps.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent text-xs font-semibold text-white">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">{localized(step.title, locale)}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-ink-muted">{localized(step.body, locale)}</p>
                </div>
              </li>
            ))}
          </ol>
        </details>
      </div>
    </Card>
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

  const attributes: { label: TranslationKey; value: TranslationKey }[] = [
    { label: 'results.undertoneTitle', value: `results.undertone.${analysis.undertone}` },
    { label: 'results.skinDepthTitle', value: `results.skinDepth.${analysis.skinDepth}` },
    { label: 'results.contrastTitle', value: `results.contrast.${analysis.contrast}` },
    { label: 'results.faceShapeTitle', value: `results.faceShape.${analysis.faceShape}` },
    { label: 'results.eyeShapeTitle', value: `results.eyeShape.${analysis.eyeShape}` },
  ];

  return (
    <div className="tonelle-enter space-y-6">
      <div className="flex items-end justify-between gap-4">
        <h1 className="text-3xl text-ink sm:text-4xl">{tt('results.title')}</h1>
        <Chip tone="outline" size="sm">
          {tt('results.savedOnDevice')}
        </Chip>
      </div>

      {/* Season */}
      <Card padding="none" className="overflow-hidden">
        <div
          className="relative p-6 sm:p-8"
          style={{
            background: `linear-gradient(135deg, ${season.palette[0]}40, ${season.palette[2]}40 50%, ${season.palette[5]}40)`,
          }}
        >
          <p className="text-xs font-semibold tracking-widest text-ink-muted uppercase">{tt('results.yourSeason')}</p>
          <p className="mt-1 font-display text-4xl text-ink sm:text-5xl">{localized(season.name, locale)}</p>
          <Chip tone="inverse" size="sm" className="mt-3">
            {tt('results.confidence', { percent: Math.round(analysis.seasonConfidence * 100) })}
          </Chip>
          <p className="mt-4 leading-relaxed text-ink">{localized(season.description, locale)}</p>
        </div>
        <div className="border-t border-border/70 p-6 sm:p-8">
          <h2 className="font-sans text-sm font-semibold text-ink">{tt('results.summaryTitle')}</h2>
          <p className="mt-2 leading-relaxed text-ink-muted">{analysis.summary}</p>
          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {attributes.map((a) => (
              <AttributeChip key={a.label} label={tt(a.label)} value={tt(a.value)} />
            ))}
          </div>
        </div>
      </Card>

      {/* Palette */}
      <Card className="space-y-6">
        <SwatchGroup title={tt('results.bestColors')} colors={analysis.bestColors} tt={tt} />
        <SwatchGroup title={tt('results.avoidColors')} colors={analysis.avoidColors} tt={tt} crossed />
      </Card>

      {/* Shades */}
      <Card className="space-y-6">
        <div>
          <h2 className="text-2xl text-ink">{tt('results.foundationTitle')}</h2>
          <p className="mt-2 text-ink">{tt('results.foundationUndertone', { label: analysis.foundation.undertoneLabel })}</p>
          <p className="mt-1 text-ink">{tt('results.foundationRange', { range: analysis.foundation.shadeRange })}</p>
          <p className="mt-3 flex gap-2 text-sm text-ink-muted">
            <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
            {copy.resultsFoundationHint}
          </p>
        </div>
        <SwatchGroup title={tt('results.lipTitle')} colors={analysis.lip} tt={tt} />
        <SwatchGroup title={tt('results.blushTitle')} colors={analysis.blush} tt={tt} />
        <SwatchGroup title={tt('results.eyeshadowTitle')} colors={analysis.eyeshadow} tt={tt} />
      </Card>

      {/* Looks */}
      <section aria-labelledby="looks-title" className="pt-2">
        <h2 id="looks-title" className="text-2xl text-ink sm:text-3xl">
          {tt('results.looksTitle')}
        </h2>
        <p className="mt-1 text-sm text-ink-muted">{tt('common.aiGeneratedNote')}</p>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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

      {/* Share + actions */}
      <Card tone="accent" className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl text-ink">{tt('share.title')}</h2>
          <p className="mt-1 text-sm text-ink-muted">{tt('share.subtitle')}</p>
        </div>
        <Button onClick={() => setShareOpen(true)} icon={<Share2 aria-hidden className="size-4" />}>
          {copy.resultsShareCta}
        </Button>
      </Card>

      <p className="text-xs leading-relaxed text-ink-subtle">{tt('results.disclaimer')}</p>

      <div className="flex flex-col gap-2 border-t border-border pt-6 sm:flex-row">
        <Button variant="secondary" onClick={() => dispatch({ type: 'START_OVER' })} icon={<RefreshCw aria-hidden className="size-4" />}>
          {copy.resultsStartOver}
        </Button>
        <Button variant="ghost" onClick={() => setConfirmDelete(true)} icon={<Trash2 aria-hidden className="size-4" />}>
          {tt('settings.deleteData')}
        </Button>
      </div>

      <ShareCardDialog
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        locale={locale}
        analysis={analysis}
        copy={copy}
        tt={tt}
      />

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
            className="bg-danger hover:bg-danger/90"
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

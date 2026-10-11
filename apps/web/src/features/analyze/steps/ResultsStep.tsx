'use client';

import { LOOKS, SEASONS, localized, shadeMatch, type FaceAnalysis, type LookId, type TranslationKey } from '@tonelle/shared';
import clsx from 'clsx';
import { Camera, ChevronDown, Contrast, Eye, RefreshCw, ScanFace, Share2, Sun, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { BeforeAfter, Button, FitPill, Modal, ProfileBars, Radar, ShadeTube, SwatchBar } from '@/components/ui';
import { apiClient, errorMessageKey, type ApiClient } from '@/lib/api-client';
import { profileView } from '@/lib/profile-view';
import { getAppUserId, getPaddleRef } from '@/lib/storage';
import type { StepProps } from '../types';
import { delay } from '../ui';
import { ShareCardDialog } from './ShareCard';

/** Settled render results; a look without an entry is pending (queued or in flight). */
type RenderState = { status: 'done'; image: string } | { status: 'error'; messageKey: TranslationKey };
type LookRenderState = RenderState | { status: 'pending' };
type Tab = 'color' | 'tryon';

export function Panel({ title, children, className, aside }: { title?: string; children: ReactNode; className?: string; aside?: ReactNode }) {
  return (
    <section className={clsx('rounded-panel bg-paper p-5 ring-1 ring-line ring-inset sm:p-6', className)}>
      {title && (
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-[1.3rem] text-ink">{title}</h2>
          {aside}
        </div>
      )}
      {children}
    </section>
  );
}

/** Shade card with a "% uyum" pill (DESIGN §3.7). */
function ShadeCard({ hex, label, analysis, fitLabel }: { hex: string; label?: string; analysis: FaceAnalysis; fitLabel: string }) {
  return (
    <li className="flex min-w-0 flex-col gap-2 rounded-card bg-paper p-2 ring-1 ring-line ring-inset sm:p-2.5">
      <FitPill value={shadeMatch(hex, analysis)} template={fitLabel} className="max-w-full px-1.5 text-[10px] sm:px-2 sm:text-[11px]" />
      <ShadeTube color={hex} />
      <span className="min-w-0 px-0.5">
        {label && <span className="block truncate text-[12.5px] font-semibold text-ink">{label}</span>}
        <span className="block text-[11px] text-muted">{hex.toUpperCase()}</span>
      </span>
    </li>
  );
}

function TryOn({
  analysis,
  lookIds,
  selected,
  onSelect,
  render,
  photo,
  onRetry,
  onNewSelfie,
  copy,
  tt,
  locale,
}: {
  analysis: FaceAnalysis;
  lookIds: LookId[];
  selected: LookId;
  onSelect: (id: LookId) => void;
  render: LookRenderState;
  photo: string | null;
  onRetry: () => void;
  onNewSelfie: () => void;
} & Pick<StepProps, 'copy' | 'tt' | 'locale'>) {
  const index = Math.max(0, lookIds.indexOf(selected));
  const look = LOOKS[selected];
  const shades: { hex: string; label: string }[] = [
    { hex: analysis.lip[index % analysis.lip.length], label: tt('results.lipTitle') },
    { hex: analysis.blush[index % analysis.blush.length], label: tt('results.blushTitle') },
    { hex: analysis.eyeshadow[index % analysis.eyeshadow.length], label: tt('results.eyeshadowTitle') },
  ].filter((s): s is { hex: string; label: string } => Boolean(s.hex));

  return (
    <div className="flex flex-col gap-5">
      <div role="radiogroup" aria-label={copy.tryOnLooksLabel} className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
        {lookIds.map((id) => {
          const active = id === selected;
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onSelect(id)}
              className={clsx(
                'press h-10 shrink-0 rounded-pill px-4 text-[13.5px] font-semibold whitespace-nowrap',
                active ? 'bg-ink text-white' : 'bg-mist text-ink ring-1 ring-line ring-inset hover:bg-violet-soft',
              )}
            >
              {localized(LOOKS[id].name, locale)}
            </button>
          );
        })}
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,420px)_1fr] lg:items-start">
        <div className="relative mx-auto aspect-[4/5] w-full max-w-[420px] overflow-hidden rounded-xl bg-mist">
          {!photo ? (
            <div className="flex size-full flex-col items-center justify-center gap-4 bg-[linear-gradient(160deg,#F8E4D8,#EFD8E6_55%,#E6E0FA)] p-6 text-center">
              <span className="grid size-14 place-items-center rounded-full bg-paper text-violet">
                <Camera aria-hidden className="size-6" strokeWidth={1.75} />
              </span>
              <p className="max-w-[30ch] text-[14px] text-ink">{copy.resultsPhotoNeeded}</p>
              <Button size="sm" onClick={onNewSelfie} icon={<Camera aria-hidden className="size-4" />}>
                {copy.resultsNewSelfie}
              </Button>
            </div>
          ) : render.status === 'done' ? (
            <BeforeAfter
              className="size-full"
              beforeLabel={tt('look.before')}
              afterLabel={tt('look.after')}
              sliderLabel={copy.tryOnSliderLabel}
              // eslint-disable-next-line @next/next/no-img-element -- in-memory data URL
              before={<img src={photo} alt={tt('look.before')} className="size-full object-cover" draggable={false} />}
              after={
                // eslint-disable-next-line @next/next/no-img-element -- generated data URL
                <img src={render.image} alt={`${localized(look.name, locale)} (${tt('common.aiGenerated')})`} className="size-full object-cover" draggable={false} />
              }
            >
              <span className="float-chip pointer-events-none absolute right-3 bottom-3 rounded-pill px-2.5 py-1 text-[11px] font-semibold text-violet">
                ✦ {tt('common.aiGenerated')}
              </span>
            </BeforeAfter>
          ) : render.status === 'error' ? (
            <div className="flex size-full flex-col items-center justify-center gap-3 p-6 text-center">
              <p className="font-semibold text-ink">{copy.renderFailed}</p>
              <p className="text-[13px] text-muted">{tt(render.messageKey)}</p>
              <Button size="sm" variant="secondary" onClick={onRetry} icon={<RefreshCw aria-hidden className="size-4" />}>
                {tt('common.retry')}
              </Button>
            </div>
          ) : (
            <div className="shimmer relative size-full">
              {/* eslint-disable-next-line @next/next/no-img-element -- local preview */}
              <img src={photo} alt="" className="size-full object-cover opacity-70 blur-[2px]" />
              <div role="status" className="absolute inset-x-3 bottom-3 flex items-center gap-3 rounded-card bg-paper/92 p-3 text-left backdrop-blur">
                <span aria-hidden className="spin size-6 shrink-0 rounded-full border-2 border-violet border-r-transparent" />
                <span>
                  <span className="block text-[13.5px] font-semibold text-ink">{tt('look.rendering')}</span>
                  <span className="block text-[12px] text-muted">{tt('look.renderingHint')}</span>
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <h2 className="text-[1.6rem] text-ink">{localized(look.name, locale)}</h2>
            <p className="mt-1.5 text-[14.5px] text-muted">{localized(look.description, locale)}</p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {look.occasions.map((o) => (
                <li key={o} className="rounded-pill bg-rose-soft px-2.5 py-1 text-[12px] font-semibold text-rose-ink">
                  {tt(`look.occasionTag.${o}`)}
                </li>
              ))}
              <li className="rounded-pill bg-mist px-2.5 py-1 text-[12px] font-semibold text-ink">{tt(`look.level.${look.level}`)}</li>
            </ul>
          </div>

          <div>
            <h3 className="text-[1.15rem] text-ink">{copy.tryOnShadesTitle}</h3>
            <ul className="mt-3 grid grid-cols-3 gap-2.5">
              {shades.map((s) => (
                <ShadeCard key={`${s.label}-${s.hex}`} hex={s.hex} label={s.label} analysis={analysis} fitLabel={copy.fitLabel} />
              ))}
            </ul>
          </div>

          <details className="group rounded-card bg-mist">
            <summary className="flex min-h-12 cursor-pointer items-center justify-between px-4 text-[14.5px] font-semibold text-ink">
              {tt('look.stepsTitle')}
              <ChevronDown aria-hidden className="size-4 transition-transform group-open:rotate-180 motion-reduce:transition-none" />
            </summary>
            <ol className="space-y-3 px-4 pb-4">
              {look.steps.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-violet text-[11.5px] font-bold text-white">{i + 1}</span>
                  <div>
                    <p className="text-[14px] font-semibold text-ink">{localized(step.title, locale)}</p>
                    <p className="mt-0.5 text-[13px] text-muted">{localized(step.body, locale)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </details>
          <p className="text-[12px] text-muted">{tt('common.aiGeneratedNote')}</p>
        </div>
      </div>
    </div>
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
  const [tab, setTab] = useState<Tab>('color');
  const full = state.mode === 'full';
  const [selectedLook, setSelectedLook] = useState<LookId | null>(null);
  const photo = state.photo;

  const inFlight = useRef<LookId | null>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const lookIds = result?.recommendedLookIds ?? [];
  const selected = selectedLook ?? lookIds[0] ?? null;

  // Abort a pending render when leaving the results screen.
  useEffect(() => () => controllerRef.current?.abort(), []);

  // Render looks one at a time (cost + rate limits), the selected one first, only while we still hold the photo.
  useEffect(() => {
    if (!full || !result || !photo || !state.unlocked || inFlight.current) return;
    const next = selected && !renders[selected] ? selected : result.recommendedLookIds.find((id) => !renders[id]);
    if (!next) return;
    const controller = new AbortController();
    controllerRef.current = controller;
    inFlight.current = next;
    void client
      .renderLook(
        { image: photo, lookId: next, analysis: result.analysis, appUserId: getAppUserId(), paddleRef: getPaddleRef(), locale },
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
  }, [full, result, photo, state.unlocked, renders, client, locale, selected]);

  if (!result) return null;
  const { analysis } = result;
  const season = SEASONS[analysis.season];
  const { axes, bars } = profileView(analysis, locale);

  const traits = [
    { icon: Sun, label: tt('results.undertoneTitle'), value: tt(`results.undertone.${analysis.undertone}`) },
    { icon: Contrast, label: tt('results.contrastTitle'), value: tt(`results.contrast.${analysis.contrast}`) },
    // Face and eye shape guide makeup, so the colour-only analysis leaves them out.
    ...(full
      ? [
          { icon: ScanFace, label: tt('results.faceShapeTitle'), value: tt(`results.faceShape.${analysis.faceShape}`) },
          { icon: Eye, label: tt('results.eyeShapeTitle'), value: tt(`results.eyeShape.${analysis.eyeShape}`) },
        ]
      : []),
  ];

  const shadeGroups: [string, string[]][] = [
    [tt('results.lipTitle'), analysis.lip],
    [tt('results.blushTitle'), analysis.blush],
    [tt('results.eyeshadowTitle'), analysis.eyeshadow],
  ];

  const tabs: [Tab, string][] = [
    ['color', copy.navResults],
    ['tryon', copy.navLooks],
  ];

  return (
    <div id="results-top" className="scroll-mt-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-[clamp(1.8rem,7vw,2.4rem)] text-ink">{full ? tt('results.title') : copy.colorResultsTitle}</h1>
        <button
          type="button"
          onClick={() => setShareOpen(true)}
          aria-label={copy.resultsShareCta}
          className="press grid size-11 shrink-0 place-items-center rounded-full bg-violet-soft text-violet hover:bg-violet hover:text-white"
        >
          <Share2 aria-hidden className="size-[18px]" strokeWidth={1.75} />
        </button>
      </div>

 {full && (
      <div role="tablist" aria-label={tt('results.title')} className="mt-4 grid grid-cols-2 gap-1 rounded-pill bg-mist p-1 ring-1 ring-line ring-inset sm:inline-grid sm:w-auto">
        {tabs.map(([id, label]) => (
          <button
            key={id}
            id={`tab-${id}`}
            type="button"
            role="tab"
            aria-selected={tab === id}
            aria-controls={`panel-${id}`}
            onClick={() => setTab(id)}
            className={clsx(
              'press h-11 rounded-pill px-5 text-[14px] font-semibold whitespace-nowrap',
              tab === id ? 'bg-paper text-ink shadow-[0_1px_4px_rgb(23_20_31/0.12)]' : 'text-muted hover:text-ink',
            )}
          >
            {label}
          </button>
        ))}
      </div>
      )}

      {tab === 'color' ? (
        <div id="panel-color" role="tabpanel" aria-labelledby="tab-color" className="enter mt-5 flex flex-col gap-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="flex flex-col gap-4">
              {/* Season card */}
              <section className="rounded-panel bg-[linear-gradient(160deg,#F8E4D8,#EFD8E6_60%,#E6E0FA)] p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="caps rounded-pill bg-paper/80 px-2.5 py-1 text-ink">{copy.resultsSeasonChip}</span>
                  <span className="rounded-pill bg-paper/80 px-2.5 py-1 text-[11.5px] font-bold text-violet">
                    {tt('results.confidence', { percent: Math.round(analysis.seasonConfidence * 100) })}
                  </span>
                </div>
                <h2 className="mt-3 text-[clamp(2rem,8.6vw,2.6rem)] leading-none text-ink [overflow-wrap:anywhere]">{localized(season.name, locale)}</h2>
                <p className="mt-3 text-[14.5px] text-ink/80">{localized(season.description, locale)}</p>
                <div role="img" aria-label={tt('results.bestColors')} className="mt-4 flex gap-1.5">
                  {season.palette.map((c) => (
                    <i key={c} className="block h-8 flex-1 rounded-[9px]" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <p className="mt-3 text-[12px] text-ink/60">{tt('results.savedOnDevice')}</p>
              </section>

              <Panel title={copy.resultsProfileTitle}>
                <Radar axes={axes} label={copy.resultsProfileTitle} className="mx-auto max-w-[360px]" />
                <ProfileBars items={bars} className="mt-2" />
              </Panel>
            </div>

            <div className="flex flex-col gap-4">
              <section aria-labelledby="traits-title">
                <h2 id="traits-title" className="sr-only">
                  {copy.resultsTraitsTitle}
                </h2>
                <ul className="grid grid-cols-2 gap-3">
                  {traits.map(({ icon: Icon, label, value }, i) => (
                    <li key={label} className="enter flex flex-col gap-2 rounded-card bg-mist p-4" style={delay(60 + i * 50)}>
                      <span className="grid size-9 place-items-center rounded-full bg-paper text-violet">
                        <Icon aria-hidden className="size-4" strokeWidth={1.75} />
                      </span>
                      <span className="text-[12.5px] text-muted">{label}</span>
                      <span className="serif text-[1.25rem] leading-tight text-ink">{value}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <Panel title={tt('results.summaryTitle')}>
                <p className="text-[15px] leading-relaxed text-ink">{analysis.summary}</p>
                <p className="mt-4 border-t border-line pt-3 text-[12px] text-muted">{tt('results.disclaimer')}</p>
              </Panel>

              <Panel>
                <h2 className="text-[1.15rem] text-ink">{tt('results.bestColors')}</h2>
                <SwatchBar className="mt-3" colors={analysis.bestColors} label={tt('results.bestColors')} copyLabel={tt('results.copyHex')} copiedLabel={tt('results.copied')} />
                <h2 className="mt-3 text-[1.15rem] text-ink">{tt('results.avoidColors')}</h2>
                <SwatchBar
                  className="mt-3"
                  colors={analysis.avoidColors}
                  label={tt('results.avoidColors')}
                  copyLabel={tt('results.copyHex')}
                  copiedLabel={tt('results.copied')}
                  crossed
                />
              </Panel>

              <Panel title={tt('results.foundationTitle')}>
                <p className="serif text-[1.25rem] leading-snug text-ink">{tt('results.foundationUndertone', { label: analysis.foundation.undertoneLabel })}</p>
                <p className="serif mt-1 text-[1.25rem] leading-snug text-violet">{tt('results.foundationRange', { range: analysis.foundation.shadeRange })}</p>
                <p className="mt-3 text-[13px] text-muted">{copy.resultsFoundationHint}</p>
              </Panel>
            </div>
          </div>

          {full && (
          <Panel title={copy.resultsShadesTitle}>
            <div className="flex flex-col gap-5">
              {shadeGroups.map(([title, colors]) => (
                <div key={title}>
                  <h3 className="text-[14px] font-semibold text-ink" style={{ fontFamily: 'var(--font-sans)' }}>
                    {title}
                  </h3>
                  <ul className="mt-2.5 grid grid-cols-4 gap-2 sm:gap-2.5 lg:grid-cols-6">
                    {colors.map((hex) => (
                      <ShadeCard key={hex} hex={hex} analysis={analysis} fitLabel={copy.fitLabel} />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Panel>
          )}

          <section className="flex flex-col items-start gap-4 rounded-panel bg-violet-soft p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <h2 className="text-[1.5rem] text-ink">{tt('share.title')}</h2>
              <p className="mt-1 text-[14px] text-muted">{tt('share.subtitle')}</p>
            </div>
            <Button onClick={() => setShareOpen(true)} icon={<Share2 aria-hidden className="size-4" />}>
              {copy.resultsShareCta}
            </Button>
          </section>
        </div>
      ) : (
        <div id="panel-tryon" role="tabpanel" aria-labelledby="tab-tryon" className="enter mt-5">
          {selected && (
            <TryOn
              analysis={analysis}
              lookIds={lookIds}
              selected={selected}
              onSelect={setSelectedLook}
              render={renders[selected] ?? { status: 'pending' }}
              photo={photo}
              onRetry={() =>
                setRenders((r) => {
                  const next = { ...r };
                  delete next[selected];
                  return next;
                })
              }
              onNewSelfie={() => dispatch({ type: 'NEW_SELFIE' })}
              copy={copy}
              tt={tt}
              locale={locale}
            />
          )}
        </div>
      )}

      <div className="mt-8 flex flex-col gap-2 border-t border-line pt-6 sm:flex-row">
        <Button variant="secondary" onClick={() => dispatch({ type: 'START_OVER' })} icon={<RefreshCw aria-hidden className="size-4" />}>
          {copy.resultsStartOver}
        </Button>
        <Button variant="ghost" onClick={() => setConfirmDelete(true)} icon={<Trash2 aria-hidden className="size-4" />}>
          {tt('settings.deleteData')}
        </Button>
      </div>

      <ShareCardDialog open={shareOpen} onClose={() => setShareOpen(false)} locale={locale} analysis={analysis} photo={photo} copy={copy} tt={tt} />

      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title={tt('settings.deleteDataTitle')}
        closeLabel={tt('common.close')}
        size="sm"
      >
        <p className="text-[14.5px] text-muted">{tt('settings.deleteDataBody')}</p>
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

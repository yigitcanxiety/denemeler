'use client';

import clsx from 'clsx';
import { Brush, Camera, Check, ImageUp, RefreshCw, ScanFace, ShieldCheck, Sparkles, Sun, TriangleAlert, X } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type DragEvent } from 'react';
import { Button } from '@/components/ui';
import { drawToJpeg, isAcceptedImageFile, prepareImageFile } from '@/lib/image';
import type { StepProps } from '../types';
import { Note, RingPhoto, ScreenTitle } from '../ui';

const noopSubscribe = () => () => undefined;

type CameraStatus = 'off' | 'starting' | 'live' | 'error';

const EXAMPLES = ['/images/portrait-hero.jpg', '/images/portrait-2.jpg', '/images/portrait-3.jpg'] as const;

/** CSS treatments that turn the example portraits into "avoid" examples (DESIGN §5). */
const AVOID_STYLES: CSSProperties[] = [
  { filter: 'brightness(0.42) saturate(0.6)' },
  { filter: 'saturate(1.9) hue-rotate(-20deg) contrast(1.15) brightness(1.05)' },
  { transform: 'rotate(-16deg) scale(1.45) translate(12%, 6%)', filter: 'brightness(0.85)' },
];

function CameraCapture({
  onCapture,
  onClose,
  onError,
  copy,
  tt,
}: {
  onCapture: (dataUrl: string, tooDark: boolean) => void;
  onClose: () => void;
  onError: (key: 'camera.permissionDenied' | 'errors.cameraUnavailable') => void;
  copy: StepProps['copy'];
  tt: StepProps['tt'];
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<CameraStatus>('starting');
  const [facing, setFacing] = useState<'user' | 'environment'>('user');

  useEffect(() => {
    let cancelled = false;
    async function start() {
      setStatus('starting');
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 1600 } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          await video.play().catch(() => undefined);
        }
        setStatus('live');
      } catch (error) {
        if (cancelled) return;
        setStatus('error');
        const name = error instanceof Error ? error.name : '';
        onError(name === 'NotAllowedError' || name === 'SecurityError' ? 'camera.permissionDenied' : 'errors.cameraUnavailable');
      }
    }
    void start();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, [facing, onError]);

  const capture = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const photo = drawToJpeg(video, video.videoWidth, video.videoHeight, { mirror: facing === 'user' });
    streamRef.current?.getTracks().forEach((track) => track.stop());
    onCapture(photo.dataUrl, photo.tooDark);
  };

  return (
    <div className="flex flex-col gap-5">
      <div role="region" aria-label={copy.cameraGuideLabel} className="relative mx-auto aspect-[4/5] w-full overflow-hidden rounded-panel bg-ink">
        <video ref={videoRef} playsInline muted className={clsx('size-full object-cover', facing === 'user' && '-scale-x-100')} />
        {/* Circular face guide with a violet ring */}
        <svg aria-hidden viewBox="0 0 100 125" preserveAspectRatio="xMidYMid slice" className="pointer-events-none absolute inset-0 size-full">
          <defs>
            <mask id="cam-guide">
              <rect width="100" height="125" fill="white" />
              <circle cx="50" cy="56" r="34" fill="black" />
            </mask>
          </defs>
          <rect width="100" height="125" fill="rgb(23 20 31 / 0.45)" mask="url(#cam-guide)" />
          <circle cx="50" cy="56" r="34" fill="none" stroke="#7457F5" strokeWidth="1.2" />
        </svg>
        <p className="float-chip absolute inset-x-0 top-4 mx-auto w-max max-w-[90%] rounded-pill px-3 py-1.5 text-center text-[12px] font-semibold text-ink">
          {tt('camera.frameHint')}
        </p>
        {status === 'starting' && (
          <p role="status" className="absolute inset-0 grid place-items-center text-[14px] text-white/80">
            {copy.cameraStarting}
          </p>
        )}
        <button
          type="button"
          onClick={onClose}
          aria-label={copy.cameraClose}
          className="press absolute top-3 right-3 grid size-11 place-items-center rounded-full bg-white/90 text-ink"
        >
          <X aria-hidden className="size-5" strokeWidth={1.75} />
        </button>
      </div>
      <div className="flex items-center justify-between gap-3 px-2">
        <button
          type="button"
          onClick={() => setFacing((f) => (f === 'user' ? 'environment' : 'user'))}
          aria-label={tt('camera.switchCamera')}
          className="press grid size-12 place-items-center rounded-full bg-mist text-ink hover:bg-violet-soft"
        >
          <RefreshCw aria-hidden className="size-5" strokeWidth={1.75} />
        </button>
        <button
          type="button"
          onClick={capture}
          disabled={status !== 'live'}
          aria-label={tt('camera.capture')}
          className="press grid size-[76px] place-items-center rounded-full ring-[3px] ring-violet disabled:opacity-40"
        >
          <span className="violet-gradient size-[60px] rounded-full shadow-violet" />
        </button>
        <span className="size-12" aria-hidden />
      </div>
    </div>
  );
}

export function SelfieStep({ state, dispatch, copy, tt }: StepProps) {
  const [mode, setMode] = useState<'tips' | 'camera'>('tips');
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const cameraSupported = useSyncExternalStore(
    noopSubscribe,
    () => !!navigator.mediaDevices?.getUserMedia,
    () => false,
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    if (!isAcceptedImageFile(file)) {
      dispatch({ type: 'SELFIE_ERROR', errorKey: 'errors.unsupportedFile' });
      return;
    }
    setBusy(true);
    try {
      const photo = await prepareImageFile(file);
      dispatch({ type: 'SET_PHOTO', dataUrl: photo.dataUrl, tooDark: photo.tooDark });
    } catch {
      dispatch({ type: 'SELFIE_ERROR', errorKey: 'errors.unsupportedFile' });
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const onCameraError = useCallback(
    (key: 'camera.permissionDenied' | 'errors.cameraUnavailable') => {
      dispatch({ type: 'SELFIE_ERROR', errorKey: key });
      setMode('tips');
    },
    [dispatch],
  );

  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    setDragging(false);
    void handleFile(event.dataTransfer.files[0]);
  };

  const error = state.errorKey && (
    <Note role="alert" tone="danger">
      {tt(state.errorKey)}
    </Note>
  );

  const privacy = (
    <p className="flex items-center justify-center gap-1.5 text-center text-[12.5px] text-muted">
      <ShieldCheck aria-hidden className="size-4 shrink-0 text-mint-ink" strokeWidth={1.75} />
      {tt('common.privacyBadge')}
    </p>
  );

  const fileInput = (
    <input
      ref={inputRef}
      type="file"
      accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
      className="sr-only"
      tabIndex={-1}
      aria-hidden
      onChange={(e) => void handleFile(e.target.files?.[0])}
    />
  );

  /* ---------- "Harika görünüyorsun" confirmation ---------- */
  if (state.photo) {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <ScreenTitle title={copy.confirmTitle} className="w-full text-center [&_h1]:text-center" />
        <div className="relative mt-2">
          <RingPhoto src={state.photo} alt={copy.photoFrameLabel} size={236} />
          {state.photoTooDark ? (
            <span className="absolute -bottom-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-pill bg-butter px-3 py-1.5 text-[12.5px] font-bold whitespace-nowrap text-butter-ink shadow-float">
              <TriangleAlert aria-hidden className="size-3.5" strokeWidth={2.25} />
              {tt('camera.qualityIssues.low_light').split('.')[0]}
            </span>
          ) : (
            <span className="absolute -bottom-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-pill bg-mint px-3 py-1.5 text-[12.5px] font-bold whitespace-nowrap text-mint-ink shadow-float">
              <Check aria-hidden className="size-3.5" strokeWidth={3} />
              {copy.confirmChip}
            </span>
          )}
        </div>
        <div role="status" className="w-full text-left empty:hidden">
          {state.photoTooDark && <Note tone="warning">{tt('camera.tooDark')}</Note>}
        </div>
        {error && <div className="w-full text-left">{error}</div>}
        <div className="mt-4 flex w-full flex-col gap-2">
          <Button size="lg" fullWidth onClick={() => dispatch({ type: 'START_ANALYSIS' })} icon={<Sparkles aria-hidden className="size-4" strokeWidth={2} />}>
            {copy.selfieAnalyze}
          </Button>
          <Button variant="secondary" size="lg" fullWidth onClick={() => dispatch({ type: 'CLEAR_PHOTO' })}>
            {copy.confirmOther}
          </Button>
        </div>
        {privacy}
      </div>
    );
  }

  /* ---------- Camera ---------- */
  if (mode === 'camera') {
    return (
      <div className="flex flex-col gap-5">
        <ScreenTitle title={tt('camera.title')} backLabel={tt('common.back')} onBack={() => setMode('tips')} />
        <CameraCapture
          copy={copy}
          tt={tt}
          onClose={() => setMode('tips')}
          onError={onCameraError}
          onCapture={(dataUrl, tooDark) => {
            dispatch({ type: 'SET_PHOTO', dataUrl, tooDark });
            setMode('tips');
          }}
        />
        {privacy}
      </div>
    );
  }

  /* ---------- "En iyi açını yakala" tips ---------- */
  const tips = [
    { icon: Sun, text: tt('camera.hintLight') },
    { icon: Brush, text: tt('camera.hintNoMakeup') },
    { icon: ScanFace, text: tt('camera.hintGlasses') },
    { icon: Sparkles, text: tt('camera.hintNoFilter') },
  ];
  const avoid = [copy.tipsAvoidDark, copy.tipsAvoidFilter, copy.tipsAvoidAngle];

  return (
    <div
      className={clsx('flex flex-col gap-5 rounded-panel transition-shadow', dragging && 'shadow-[0_0_0_2px_var(--color-violet)]')}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
    >
      <ScreenTitle title={copy.tipsTitle} backLabel={tt('common.back')} onBack={() => dispatch({ type: 'QUIZ_BACK' })} />

      <section aria-labelledby="tips-well" className="rounded-card bg-mist p-4">
        <h2 id="tips-well" className="font-sans text-[14px] font-bold text-ink" style={{ fontFamily: 'var(--font-sans)' }}>
          {copy.tipsWellTitle}
        </h2>
        <ul className="mt-2.5 flex flex-col gap-2">
          {tips.map(({ icon: Icon, text }) => (
            <li key={text} className="flex gap-2.5 text-[13.5px] text-ink">
              <Icon aria-hidden className="mt-0.5 size-4 shrink-0 text-violet" strokeWidth={1.75} />
              {text}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="tips-ideal">
        <h2 id="tips-ideal" className="text-[1.25rem] text-ink">
          {copy.tipsIdealTitle}
        </h2>
        <ul className="mt-3 grid grid-cols-3 gap-2.5">
          {EXAMPLES.map((src) => (
            <li key={src} className="relative aspect-[3/4] overflow-hidden rounded-[14px] bg-mist" style={{ outline: '2.5px solid #44C06A', outlineOffset: '-2.5px' }}>
              <Image src={src} alt={copy.tipsExampleAlt} fill sizes="(min-width: 480px) 150px, 30vw" className="object-cover" />
              <span className="absolute bottom-2 left-2 grid size-6 place-items-center rounded-full bg-[#44C06A] text-white">
                <Check aria-hidden className="size-3.5" strokeWidth={3} />
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="tips-avoid">
        <h2 id="tips-avoid" className="text-[1.25rem] text-ink">
          {copy.tipsAvoidTitle}
        </h2>
        <ul className="mt-3 grid grid-cols-3 gap-2.5">
          {EXAMPLES.map((src, i) => (
            <li key={src} className="relative aspect-[3/4] overflow-hidden rounded-[14px] bg-mist" style={{ outline: '2.5px solid #F08A8A', outlineOffset: '-2.5px' }}>
              <Image src={src} alt="" fill sizes="(min-width: 480px) 150px, 30vw" className="object-cover" style={AVOID_STYLES[i]} />
              <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-pill bg-rose-soft px-2 py-0.5 text-[11px] font-bold text-rose-ink">
                <X aria-hidden className="size-3" strokeWidth={3} />
                {avoid[i]}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {error}

      <div className="flex flex-col gap-2">
        <Button
          size="lg"
          fullWidth
          loading={busy}
          onClick={() => inputRef.current?.click()}
          icon={<ImageUp aria-hidden className="size-5" strokeWidth={1.75} />}
        >
          {busy ? copy.selfiePreparing : copy.tipsCta}
        </Button>
        {cameraSupported && (
          <Button variant="secondary" size="lg" fullWidth onClick={() => setMode('camera')} icon={<Camera aria-hidden className="size-5" strokeWidth={1.75} />}>
            {tt('camera.useCamera')}
          </Button>
        )}
        {fileInput}
        <p className="mt-1 hidden text-center text-[12.5px] text-muted sm:block">{copy.selfieDrop}</p>
        <p className="text-center text-[12px] text-muted">{tt('camera.fileTypes')}</p>
      </div>
      {privacy}
    </div>
  );
}

'use client';

import clsx from 'clsx';
import { ArrowLeft, Camera, ImageUp, Lightbulb, RefreshCw, ShieldCheck, Sun, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type DragEvent } from 'react';
import { Button, Card } from '@/components/ui';
import { drawToJpeg, isAcceptedImageFile, prepareImageFile } from '@/lib/image';
import type { StepProps } from '../types';

/** Oval face guide drawn over the camera / photo. */
export function FaceGuide({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 375" preserveAspectRatio="none" aria-hidden className={clsx('pointer-events-none absolute inset-0 size-full', className)}>
      <defs>
        <mask id="face-guide-mask">
          <rect width="300" height="375" fill="white" />
          <ellipse cx="150" cy="172" rx="92" ry="124" fill="black" />
        </mask>
      </defs>
      <rect width="300" height="375" fill="rgb(43 33 36 / 0.35)" mask="url(#face-guide-mask)" />
      <ellipse cx="150" cy="172" rx="92" ry="124" fill="none" stroke="white" strokeWidth="2.5" strokeDasharray="7 7" />
    </svg>
  );
}

const noopSubscribe = () => () => undefined;

type CameraStatus = 'off' | 'starting' | 'live' | 'error';

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
    <div>
      <div
        role="region"
        aria-label={copy.cameraGuideLabel}
        className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-card bg-surface-inverse shadow-card"
      >
        <video
          ref={videoRef}
          playsInline
          muted
          className={clsx('size-full object-cover', facing === 'user' && '-scale-x-100')}
        />
        <FaceGuide />
        <p className="absolute inset-x-0 top-4 text-center text-sm font-medium text-white drop-shadow">{tt('camera.frameHint')}</p>
        {status === 'starting' && (
          <p role="status" className="absolute inset-0 grid place-items-center text-sm text-white/90">
            {copy.cameraStarting}
          </p>
        )}
        <button
          type="button"
          onClick={onClose}
          aria-label={copy.cameraClose}
          className="absolute top-3 right-3 grid size-10 place-items-center rounded-full bg-black/40 text-white backdrop-blur hover:bg-black/60"
        >
          <X aria-hidden className="size-5" />
        </button>
      </div>
      <div className="mt-5 flex items-center justify-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setFacing((f) => (f === 'user' ? 'environment' : 'user'))}
          icon={<RefreshCw aria-hidden className="size-4" />}
          disabled={status !== 'live'}
        >
          {tt('camera.switchCamera')}
        </Button>
        <button
          type="button"
          onClick={capture}
          disabled={status !== 'live'}
          aria-label={tt('camera.capture')}
          className="relative grid size-18 place-items-center rounded-full bg-surface-raised shadow-card ring-4 ring-accent/30 transition-transform hover:scale-105 disabled:opacity-50"
        >
          <span className="size-14 rounded-full bg-accent" />
        </button>
        <span className="w-[6.5rem]" aria-hidden />
      </div>
    </div>
  );
}

export function SelfieStep({ state, dispatch, copy, tt }: StepProps) {
  const [mode, setMode] = useState<'choose' | 'camera'>('choose');
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
      setMode('choose');
    },
    [dispatch],
  );

  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    setDragging(false);
    void handleFile(event.dataTransfer.files[0]);
  };

  const tips = [
    { icon: Sun, text: tt('camera.hintLight') },
    { icon: Lightbulb, text: tt('camera.hintNoMakeup') },
    { icon: Lightbulb, text: tt('camera.hintNoFilter') },
    { icon: Lightbulb, text: tt('camera.hintGlasses') },
    { icon: Lightbulb, text: tt('camera.hintStraight') },
  ];

  const error = state.errorKey && (
    <p role="alert" className="mt-4 rounded-2xl bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
      {tt(state.errorKey)}
    </p>
  );

  return (
    <div className="tonelle-enter">
      <Button variant="ghost" size="sm" className="-ml-3" onClick={() => dispatch({ type: 'QUIZ_BACK' })} icon={<ArrowLeft aria-hidden className="size-4" />}>
        {tt('common.back')}
      </Button>
      <h1 className="mt-3 text-3xl text-ink sm:text-4xl">{tt('camera.title')}</h1>
      <p className="mt-2 text-ink-muted">{tt('camera.subtitle')}</p>

      {state.photo ? (
        <div className="mt-6">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-card bg-surface-sunken shadow-card">
            {/* eslint-disable-next-line @next/next/no-img-element -- local data URL preview */}
            <img src={state.photo} alt="" className="size-full object-cover" />
            <FaceGuide className="opacity-60" />
          </div>
          {state.photoTooDark ? (
            <p role="status" className="mt-4 rounded-2xl bg-warning/15 px-4 py-3 text-sm font-medium text-ink">
              {tt('camera.tooDark')}
            </p>
          ) : (
            <p role="status" className="mt-4 text-center text-sm font-medium text-success">
              {copy.selfieReady}
            </p>
          )}
          {error}
          <div className="mt-5 flex flex-col gap-2">
            <Button size="lg" fullWidth onClick={() => dispatch({ type: 'START_ANALYSIS' })}>
              {copy.selfieAnalyze}
            </Button>
            <Button variant="ghost" fullWidth onClick={() => dispatch({ type: 'CLEAR_PHOTO' })} icon={<RefreshCw aria-hidden className="size-4" />}>
              {tt('camera.retake')}
            </Button>
          </div>
        </div>
      ) : mode === 'camera' ? (
        <div className="mt-6">
          <CameraCapture
            copy={copy}
            tt={tt}
            onClose={() => setMode('choose')}
            onError={onCameraError}
            onCapture={(dataUrl, tooDark) => {
              dispatch({ type: 'SET_PHOTO', dataUrl, tooDark });
              setMode('choose');
            }}
          />
        </div>
      ) : (
        <div className="mt-6">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={clsx(
              'relative flex flex-col items-center rounded-card border-2 border-dashed px-6 py-8 text-center transition-colors',
              dragging ? 'border-accent bg-accent-soft/60' : 'border-border-strong bg-surface-raised',
            )}
          >
            <div className="relative mb-5 h-36 w-28" aria-hidden>
              <div className="absolute inset-0 rounded-[50%] border-2 border-dashed border-blush-300 bg-blush-50" />
              <span className="tonelle-pulse-ring absolute inset-0 rounded-[50%] border-2 border-blush-300" />
              <Camera className="absolute inset-0 m-auto size-8 text-blush-400" />
            </div>
            <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
              {cameraSupported && (
                <Button size="lg" onClick={() => setMode('camera')} icon={<Camera aria-hidden className="size-5" />}>
                  {tt('camera.useCamera')}
                </Button>
              )}
              <Button
                size="lg"
                variant={cameraSupported ? 'secondary' : 'primary'}
                loading={busy}
                onClick={() => inputRef.current?.click()}
                icon={<ImageUp aria-hidden className="size-5" />}
              >
                {busy ? copy.selfiePreparing : tt('camera.upload')}
              </Button>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
              className="sr-only"
              tabIndex={-1}
              aria-hidden
              onChange={(e) => void handleFile(e.target.files?.[0])}
            />
            <p className="mt-3 hidden text-sm text-ink-muted sm:block">{copy.selfieDrop}</p>
            <p className="mt-1 text-xs text-ink-subtle">{tt('camera.fileTypes')}</p>
          </div>
          {error}
          <Card tone="sunken" padding="sm" className="mt-5">
            <h2 className="font-sans text-sm font-semibold text-ink">{copy.selfieTipsTitle}</h2>
            <ul className="mt-2.5 grid gap-2 text-sm text-ink-muted">
              {tips.map(({ icon: Icon, text }) => (
                <li key={text} className="flex gap-2">
                  <Icon aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
                  {text}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-ink-muted">
        <ShieldCheck aria-hidden className="size-4 text-success" />
        {tt('common.privacyBadge')}
      </p>
    </div>
  );
}

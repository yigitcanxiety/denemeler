'use client';

import clsx from 'clsx';
import { ArrowLeft, ArrowRight, Camera, ImageUp, RefreshCw, ShieldCheck, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type DragEvent, type ReactNode } from 'react';
import { HeatFace } from '@/components/lab/HeatFace';
import { Button } from '@/components/ui';
import { drawToJpeg, isAcceptedImageFile, prepareImageFile } from '@/lib/image';
import type { StepProps } from '../types';
import { Note, OvalGuide, RoundButton, delay } from '../ui';

const noopSubscribe = () => () => undefined;

type CameraStatus = 'off' | 'starting' | 'live' | 'error';

/** The 4:5 viewfinder frame inside the dark card. */
function Frame({ children, label, className }: { children: ReactNode; label?: string; className?: string }) {
  return (
    <div
      role={label ? 'region' : undefined}
      aria-label={label}
      className={clsx('relative mx-auto aspect-[4/5] w-full overflow-hidden rounded-[18px] bg-[#1a1210]', className)}
    >
      {children}
    </div>
  );
}

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
      <Frame label={copy.cameraGuideLabel}>
        <video ref={videoRef} playsInline muted className={clsx('size-full object-cover', facing === 'user' && '-scale-x-100')} />
        <OvalGuide />
        <p className="mono-caps absolute inset-x-0 top-4 text-center text-ink-inverse">{tt('camera.frameHint')}</p>
        {status === 'starting' && (
          <p role="status" className="mono absolute inset-0 grid place-items-center text-ink-inverse-muted">
            {copy.cameraStarting}
          </p>
        )}
        <button
          type="button"
          onClick={onClose}
          aria-label={copy.cameraClose}
          className="press absolute top-3 right-3 grid size-11 place-items-center rounded-full bg-black/45 text-white backdrop-blur hover:bg-black/65"
        >
          <X aria-hidden className="size-5" />
        </button>
      </Frame>
      <div className="mt-4 flex items-center justify-between gap-3 px-1">
        <RoundButton tone="glass" label={tt('camera.switchCamera')} onClick={() => setFacing((f) => (f === 'user' ? 'environment' : 'user'))}>
          <RefreshCw aria-hidden className="size-4" />
        </RoundButton>
        <button
          type="button"
          onClick={capture}
          disabled={status !== 'live'}
          aria-label={tt('camera.capture')}
          className="press grid size-[72px] place-items-center rounded-full ring-2 ring-accent-soft/70 disabled:opacity-40"
        >
          <span className="size-[58px] rounded-full bg-accent-soft" />
        </button>
        <span className="size-11" aria-hidden />
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
    tt('camera.hintLight'),
    tt('camera.hintNoMakeup'),
    tt('camera.hintNoFilter'),
    tt('camera.hintGlasses'),
    tt('camera.hintStraight'),
  ];

  const error = state.errorKey && (
    <Note role="alert" tone="danger">
      {tt(state.errorKey)}
    </Note>
  );

  return (
    <div className="flex flex-col gap-[10px]">
      <section className="enter ink-card neck-top p-6" style={delay(40)}>
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-[clamp(1.9rem,8.4vw,2.5rem)] text-ink-inverse">{tt('camera.title')}</h1>
          <RoundButton tone="glass" label={tt('common.back')} onClick={() => dispatch({ type: 'QUIZ_BACK' })} className="-mt-1 -mr-2">
            <ArrowLeft aria-hidden className="size-4" />
          </RoundButton>
        </div>
        <p className="mono mt-3 text-ink-inverse-muted">{tt('camera.subtitle')}</p>
      </section>

      {state.photo ? (
        <>
          <section className="enter ink-card neck-top p-3" style={delay(100)}>
            <Frame>
              {/* eslint-disable-next-line @next/next/no-img-element -- local data URL preview */}
              <img src={state.photo} alt={copy.photoFrameLabel} className="size-full object-cover" />
              <OvalGuide />
            </Frame>
          </section>
          {state.photoTooDark ? (
            <Note role="status" tone="warning">
              {tt('camera.tooDark')}
            </Note>
          ) : (
            <Note role="status" tone="success">
              {copy.selfieReady}
            </Note>
          )}
          {error}
          <div className="mt-1 flex flex-col gap-1.5">
            <Button size="lg" fullWidth className="justify-between" onClick={() => dispatch({ type: 'START_ANALYSIS' })}>
              {copy.selfieAnalyze}
              <ArrowRight aria-hidden className="size-5" />
            </Button>
            <Button variant="ghost" fullWidth onClick={() => dispatch({ type: 'CLEAR_PHOTO' })} icon={<RefreshCw aria-hidden className="size-4" />}>
              {tt('camera.retake')}
            </Button>
          </div>
        </>
      ) : mode === 'camera' ? (
        <section className="ink-card neck-top p-3 pb-4">
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
        </section>
      ) : (
        <>
          <section
            className={clsx('enter ink-card neck-top p-3 pb-5 transition-shadow', dragging && 'shadow-[inset_0_0_0_2px_var(--color-accent-soft)]')}
            style={delay(100)}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
          >
            <Frame className="max-h-[52vh] max-w-[calc(52vh*0.8)]">
              <HeatFace id="selfie-ghost" tone="night" showBody={false} animated={false} className="absolute inset-x-[18%] top-[12%] h-[70%] w-[64%] opacity-50" />
              <OvalGuide dim={false} />
              <p className="mono-caps absolute inset-x-0 bottom-4 text-center text-ink-inverse-muted">{tt('camera.frameHint')}</p>
            </Frame>
            <div className="mt-4 flex flex-col gap-2 px-1">
              {cameraSupported && (
                <Button variant="soft" size="lg" fullWidth onClick={() => setMode('camera')} icon={<Camera aria-hidden className="size-5" />}>
                  {tt('camera.useCamera')}
                </Button>
              )}
              <Button
                size="lg"
                fullWidth
                variant={cameraSupported ? 'outline-inverse' : 'soft'}
                loading={busy}
                onClick={() => inputRef.current?.click()}
                icon={<ImageUp aria-hidden className="size-5" />}
              >
                {busy ? copy.selfiePreparing : tt('camera.upload')}
              </Button>
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                className="sr-only"
                tabIndex={-1}
                aria-hidden
                onChange={(e) => void handleFile(e.target.files?.[0])}
              />
              <p className="mono mt-1 hidden text-center text-[12px] text-ink-inverse-muted sm:block">{copy.selfieDrop}</p>
              <p className="mono text-center text-[11px] text-ink-inverse-muted">{tt('camera.fileTypes')}</p>
            </div>
          </section>
          {error}
          <section className="enter rounded-card bg-paper-raised p-5" style={delay(160)}>
            <h2 className="mono-caps text-ink-muted">{copy.selfieTipsTitle}</h2>
            <ol className="mt-3 grid gap-2">
              {tips.map((text, i) => (
                <li key={text} className="mono flex gap-3 text-ink">
                  <span aria-hidden className="text-ink-subtle">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {text}
                </li>
              ))}
            </ol>
          </section>
        </>
      )}

      <p className="mono mt-3 flex items-center justify-center gap-1.5 text-center text-[11.5px] text-ink-muted">
        <ShieldCheck aria-hidden className="size-4 shrink-0 text-success" />
        {tt('common.privacyBadge')}
      </p>
    </div>
  );
}

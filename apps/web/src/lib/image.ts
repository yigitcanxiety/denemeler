import { base64DecodedLength } from '@tonelle/shared';

/** Long edge of photos we send to the API. */
export const MAX_EDGE = 1024;
/** Target payload size; comfortably under the API's 4 MB limit and fast on mobile data. */
export const TARGET_BYTES = 1.5 * 1024 * 1024;
/** JPEG qualities tried in order until the result fits `TARGET_BYTES`. */
export const QUALITY_STEPS = [0.85, 0.75, 0.65, 0.55] as const;
/** Raw files larger than this are rejected before decoding (phones rarely exceed ~12 MB). */
export const MAX_INPUT_BYTES = 25 * 1024 * 1024;

export const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'] as const;

/**
 * Scales `width × height` so the long edge is at most `maxEdge`, keeping the aspect ratio.
 * Never upscales. Returns integer pixel sizes (≥ 1).
 */
export function fitWithin(width: number, height: number, maxEdge: number = MAX_EDGE) {
  if (!(width > 0) || !(height > 0)) throw new Error('Image has no size');
  const scale = Math.min(1, maxEdge / Math.max(width, height));
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
    scale,
  };
}

/** Decoded byte size of a base64 data URL. */
export function dataUrlBytes(dataUrl: string): number {
  const comma = dataUrl.indexOf(',');
  return base64DecodedLength(comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl);
}

/**
 * Encodes with decreasing quality until the payload fits. `encode` is injected so the
 * selection logic is testable without a canvas.
 */
export function encodeWithinBudget(
  encode: (quality: number) => string,
  maxBytes: number = TARGET_BYTES,
  qualities: readonly number[] = QUALITY_STEPS,
): { dataUrl: string; quality: number; bytes: number } {
  let last: { dataUrl: string; quality: number; bytes: number } | null = null;
  for (const quality of qualities) {
    const dataUrl = encode(quality);
    const bytes = dataUrlBytes(dataUrl);
    last = { dataUrl, quality, bytes };
    if (bytes <= maxBytes) return last;
  }
  if (!last) throw new Error('No quality steps');
  return last;
}

/** Whether a picked file looks like an image we can decode. */
export function isAcceptedImageFile(file: { type: string; size: number }): boolean {
  if (file.size > MAX_INPUT_BYTES) return false;
  // Some Android pickers report an empty type; let the decoder decide in that case.
  return file.type === '' || (ACCEPTED_TYPES as readonly string[]).includes(file.type);
}

/** Average perceived brightness (0–255) of an RGBA pixel buffer, sampling every `step` pixels. */
export function averageLuminance(data: Uint8ClampedArray, step = 16): number {
  let sum = 0;
  let count = 0;
  for (let i = 0; i < data.length; i += 4 * step) {
    sum += 0.2126 * (data[i] ?? 0) + 0.7152 * (data[i + 1] ?? 0) + 0.0722 * (data[i + 2] ?? 0);
    count += 1;
  }
  return count ? sum / count : 0;
}

/** Below this average luminance a photo is considered too dark for reliable colour reading. */
export const DARK_THRESHOLD = 70;

export interface PreparedPhoto {
  dataUrl: string;
  width: number;
  height: number;
  bytes: number;
  tooDark: boolean;
}

type DrawableSource = CanvasImageSource & { width?: number; height?: number };

/**
 * Draws `source` onto a canvas no larger than MAX_EDGE on its long edge, optionally mirrored,
 * and encodes it as JPEG within TARGET_BYTES. Browser-only.
 */
export function drawToJpeg(
  source: DrawableSource,
  sourceWidth: number,
  sourceHeight: number,
  { mirror = false }: { mirror?: boolean } = {},
): PreparedPhoto {
  const { width, height } = fitWithin(sourceWidth, sourceHeight);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  if (mirror) {
    ctx.translate(width, 0);
    ctx.scale(-1, 1);
  }
  ctx.drawImage(source, 0, 0, width, height);

  // Brightness from a small sample of the centre of the frame (where the face is).
  const sw = Math.max(1, Math.round(width / 2));
  const sh = Math.max(1, Math.round(height / 2));
  const sample = ctx.getImageData(Math.round(width / 4), Math.round(height / 4), sw, sh).data;
  const tooDark = averageLuminance(sample) < DARK_THRESHOLD;

  const encoded = encodeWithinBudget((q) => canvas.toDataURL('image/jpeg', q));
  canvas.width = 0;
  canvas.height = 0;
  return { dataUrl: encoded.dataUrl, width, height, bytes: encoded.bytes, tooDark };
}

/** Decodes a picked file (respecting EXIF orientation) and downscales it. Browser-only. */
export async function prepareImageFile(file: Blob): Promise<PreparedPhoto> {
  if (typeof createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
      try {
        return drawToJpeg(bitmap, bitmap.width, bitmap.height);
      } finally {
        bitmap.close();
      }
    } catch {
      // Fall through to <img> decoding (older Safari).
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.decoding = 'async';
    img.src = url;
    await img.decode();
    return drawToJpeg(img, img.naturalWidth, img.naturalHeight);
  } finally {
    URL.revokeObjectURL(url);
  }
}

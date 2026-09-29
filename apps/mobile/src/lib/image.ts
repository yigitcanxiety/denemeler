import { MAX_IMAGE_BYTES, base64DecodedLength, parseImageDataUrl } from '@tonelle/shared';

/** Long edge (px) photos are downscaled to before upload. */
export const MAX_UPLOAD_EDGE = 1024;
/** JPEG quality used for uploads. */
export const UPLOAD_JPEG_QUALITY = 0.85;

export interface Size {
  width: number;
  height: number;
}

/**
 * Resize action for expo-image-manipulator that makes the long edge at most `maxEdge`
 * (aspect ratio preserved by passing a single dimension). Returns null when no resize is needed.
 */
export function resizeForUpload(
  size: Size,
  maxEdge: number = MAX_UPLOAD_EDGE,
): { width: number } | { height: number } | null {
  const { width, height } = size;
  if (!(width > 0) || !(height > 0)) return null;
  if (Math.max(width, height) <= maxEdge) return null;
  return width >= height ? { width: maxEdge } : { height: maxEdge };
}

/** Final dimensions after `resizeForUpload`. */
export function scaledSize(size: Size, maxEdge: number = MAX_UPLOAD_EDGE): Size {
  const longEdge = Math.max(size.width, size.height);
  if (longEdge <= maxEdge || longEdge <= 0) return { ...size };
  const ratio = maxEdge / longEdge;
  return { width: Math.round(size.width * ratio), height: Math.round(size.height * ratio) };
}

/** Wraps raw base64 (possibly with line breaks, as some Android encoders emit) in a data URL. */
export function toDataUrl(base64: string, mimeType: 'image/jpeg' | 'image/png' | 'image/webp' = 'image/jpeg'): string {
  const payload = base64.replace(/^data:[^,]*,/, '').replace(/\s+/g, '');
  return `data:${mimeType};base64,${payload}`;
}

export type ImageCheck = { ok: true; bytes: number } | { ok: false; reason: 'unsupported' | 'too_large' };

/** Validates an image data URL against the API limits before upload. */
export function checkUploadImage(dataUrl: string): ImageCheck {
  const parsed = parseImageDataUrl(dataUrl);
  if (!parsed) return { ok: false, reason: 'unsupported' };
  if (parsed.bytes > MAX_IMAGE_BYTES) return { ok: false, reason: 'too_large' };
  return { ok: true, bytes: parsed.bytes };
}

/** Approximate decoded size of a data URL (bytes), 0 if not a data URL. */
export function dataUrlBytes(dataUrl: string): number {
  const comma = dataUrl.indexOf(',');
  return comma < 0 ? 0 : base64DecodedLength(dataUrl.slice(comma + 1));
}

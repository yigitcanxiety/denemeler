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

export interface CropRect {
  originX: number;
  originY: number;
  width: number;
  height: number;
}

/**
 * Portrait (4:5) crop of a camera photo around the on-screen face oval, with room for hair and
 * neck, so the analysed and rendered photo matches what the user framed. The preview is drawn
 * "cover" (scaled to fill the screen and centred), so screen points map to photo pixels through
 * that scale. Returns null when the photo is already about that framing.
 */
export function faceCrop(
  screen: Size,
  photo: Size,
  oval: { cx: number; cy: number; rx: number; ry: number },
): CropRect | null {
  if (!(photo.width > 0) || !(photo.height > 0) || !(screen.width > 0) || !(screen.height > 0)) return null;
  const scale = Math.max(screen.width / photo.width, screen.height / photo.height);
  const dx = (screen.width - photo.width * scale) / 2;
  const dy = (screen.height - photo.height * scale) / 2;
  // Box in screen points: 1.7x the oval width, 4:5, a little lower than the oval centre (neck).
  let w = Math.min(oval.rx * 2 * 1.7, photo.width * scale);
  let h = w * 1.25;
  if (h > photo.height * scale) {
    h = photo.height * scale;
    w = h / 1.25;
  }
  const cx = oval.cx;
  const cy = oval.cy + oval.ry * 0.15;
  const toPhoto = (v: number, offset: number) => (v - offset) / scale;
  let x = toPhoto(cx - w / 2, dx);
  let y = toPhoto(cy - h / 2, dy);
  const cw = w / scale;
  const ch = h / scale;
  x = Math.min(Math.max(0, x), photo.width - cw);
  y = Math.min(Math.max(0, y), photo.height - ch);
  if (cw >= photo.width * 0.95 && ch >= photo.height * 0.95) return null;
  return { originX: Math.round(x), originY: Math.round(y), width: Math.round(cw), height: Math.round(ch) };
}

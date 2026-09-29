import { UPLOAD_JPEG_QUALITY, scaledSize } from '@/lib/image';
import type { SessionPhoto } from '@/store/app-store';

/**
 * Web (browser preview) variant of services/photo.ts: there is no file system, so the picked
 * image is downscaled on a canvas and kept only as an in-memory data URL.
 */
export function deleteTempFile(uri: string | null | undefined): void {
  if (uri?.startsWith('blob:')) URL.revokeObjectURL(uri);
}

function loadImage(uri: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Image could not be decoded'));
    img.src = uri;
  });
}

export async function preparePhoto(uri: string, width: number, height: number): Promise<SessionPhoto> {
  try {
    const img = await loadImage(uri);
    const source = { width: img.naturalWidth || width, height: img.naturalHeight || height };
    const target = scaledSize(source);
    const canvas = document.createElement('canvas');
    canvas.width = target.width;
    canvas.height = target.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas unavailable');
    ctx.drawImage(img, 0, 0, target.width, target.height);
    const dataUrl = canvas.toDataURL('image/jpeg', UPLOAD_JPEG_QUALITY);
    return { uri: dataUrl, dataUrl, width: target.width, height: target.height };
  } finally {
    deleteTempFile(uri);
  }
}

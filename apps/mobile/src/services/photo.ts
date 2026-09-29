import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { File } from 'expo-file-system';

import { UPLOAD_JPEG_QUALITY, resizeForUpload, toDataUrl } from '@/lib/image';
import type { SessionPhoto } from '@/store/app-store';

/** Best-effort removal of a temporary image file (camera/picker/manipulator cache). */
export function deleteTempFile(uri: string | null | undefined): void {
  if (!uri?.startsWith('file:')) return;
  try {
    const file = new File(uri);
    if (file.exists) file.delete();
  } catch {
    // Ignore: the OS clears the cache directory eventually.
  }
}

/**
 * Downscales a captured/picked photo to max 1024 px (long edge), re-encodes it as JPEG 0.85 and
 * returns it as a data URL. Temporary files are deleted right away; the photo only lives in
 * memory for the current session and is never persisted.
 */
export async function preparePhoto(uri: string, width: number, height: number): Promise<SessionPhoto> {
  const context = ImageManipulator.manipulate(uri);
  try {
    const resize = resizeForUpload({ width, height });
    if (resize) context.resize(resize);
    const rendered = await context.renderAsync();
    const result = await rendered.saveAsync({ format: SaveFormat.JPEG, compress: UPLOAD_JPEG_QUALITY, base64: true });
    rendered.release();
    deleteTempFile(result.uri);
    if (!result.base64) throw new Error('Image encoding failed');
    const dataUrl = toDataUrl(result.base64, 'image/jpeg');
    return { uri: dataUrl, dataUrl, width: result.width, height: result.height };
  } finally {
    context.release();
    deleteTempFile(uri);
  }
}

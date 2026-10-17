import { MOCK_IMAGE_DATA_URL } from '@tonelle/shared';
import { describe, expect, it } from 'vitest';

import { checkUploadImage, dataUrlBytes, faceCrop, resizeForUpload, scaledSize, toDataUrl } from './image';

describe('resizeForUpload', () => {
  it('limits the long edge to 1024 px', () => {
    expect(resizeForUpload({ width: 3024, height: 4032 })).toEqual({ height: 1024 });
    expect(resizeForUpload({ width: 4032, height: 3024 })).toEqual({ width: 1024 });
    expect(resizeForUpload({ width: 2000, height: 2000 })).toEqual({ width: 1024 });
  });

  it('skips small or invalid images', () => {
    expect(resizeForUpload({ width: 800, height: 1024 })).toBeNull();
    expect(resizeForUpload({ width: 0, height: 0 })).toBeNull();
  });

  it('computes final size preserving aspect ratio', () => {
    expect(scaledSize({ width: 3024, height: 4032 })).toEqual({ width: 768, height: 1024 });
    expect(scaledSize({ width: 640, height: 480 })).toEqual({ width: 640, height: 480 });
  });
});

describe('data URLs', () => {
  it('wraps base64 and strips whitespace / existing prefixes', () => {
    expect(toDataUrl('AAAA\nBBBB')).toBe('data:image/jpeg;base64,AAAABBBB');
    expect(toDataUrl('data:image/png;base64,QUJD', 'image/png')).toBe('data:image/png;base64,QUJD');
  });

  it('validates type and size', () => {
    expect(checkUploadImage(MOCK_IMAGE_DATA_URL)).toMatchObject({ ok: true });
    expect(checkUploadImage('data:image/gif;base64,AAAA')).toEqual({ ok: false, reason: 'unsupported' });
    expect(checkUploadImage(`data:image/jpeg;base64,${'A'.repeat(6_000_000)}`)).toEqual({
      ok: false,
      reason: 'too_large',
    });
  });

  it('estimates decoded bytes', () => {
    expect(dataUrlBytes('data:image/jpeg;base64,QUJD')).toBe(3);
    expect(dataUrlBytes('nope')).toBe(0);
  });
});

describe('faceCrop', () => {
  const screen = { width: 390, height: 844 };
  const oval = { cx: 195, cy: 337, rx: 128.7, ry: 167.3 };

  it('crops a portrait camera photo to a 4:5 box around the face oval', () => {
    const crop = faceCrop(screen, { width: 3024, height: 4032 }, oval);
    expect(crop).not.toBeNull();
    const c = crop!;
    expect(c.width / c.height).toBeCloseTo(0.8, 2);
    expect(c.originX).toBeGreaterThanOrEqual(0);
    expect(c.originY).toBeGreaterThanOrEqual(0);
    expect(c.originX + c.width).toBeLessThanOrEqual(3024);
    expect(c.originY + c.height).toBeLessThanOrEqual(4032);
    // Horizontally centred on the oval, and well inside the full frame.
    expect(c.originX + c.width / 2).toBeCloseTo(1512, -1);
    expect(c.width).toBeLessThan(3024);
  });

  it('returns null for unknown sizes', () => {
    expect(faceCrop(screen, { width: 0, height: 0 }, oval)).toBeNull();
  });
});

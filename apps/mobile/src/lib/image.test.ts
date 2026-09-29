import { MOCK_IMAGE_DATA_URL } from '@tonelle/shared';
import { describe, expect, it } from 'vitest';

import { checkUploadImage, dataUrlBytes, resizeForUpload, scaledSize, toDataUrl } from './image';

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

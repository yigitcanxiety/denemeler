import { describe, expect, it } from 'vitest';
import {
  MAX_EDGE,
  TARGET_BYTES,
  averageLuminance,
  dataUrlBytes,
  encodeWithinBudget,
  fitWithin,
  isAcceptedImageFile,
} from './image';

describe('fitWithin', () => {
  it('scales the long edge down to 1024 and keeps the aspect ratio', () => {
    expect(fitWithin(4032, 3024)).toEqual({ width: 1024, height: 768, scale: MAX_EDGE / 4032 });
    const portrait = fitWithin(3000, 4000);
    expect(portrait.height).toBe(1024);
    expect(portrait.width).toBe(768);
  });

  it('never upscales small images', () => {
    expect(fitWithin(640, 480)).toEqual({ width: 640, height: 480, scale: 1 });
  });

  it('handles extreme ratios and rejects empty sizes', () => {
    expect(fitWithin(10000, 10)).toEqual({ width: 1024, height: 1, scale: 1024 / 10000 });
    expect(() => fitWithin(0, 100)).toThrow();
  });

  it('keeps a 1024px RGB image within the payload budget even uncompressed-ish', () => {
    // 1024×768 JPEG at q≈0.85 is typically 150–400 KB; the budget leaves ample headroom.
    expect(TARGET_BYTES).toBeLessThan(4 * 1024 * 1024);
    expect(TARGET_BYTES).toBe(1.5 * 1024 * 1024);
  });
});

describe('encodeWithinBudget', () => {
  const fakeDataUrl = (bytes: number) => `data:image/jpeg;base64,${'A'.repeat(Math.ceil((bytes * 4) / 3))}`;

  it('returns the first quality that fits', () => {
    const sizes: Record<number, number> = { 0.85: 2_000_000, 0.75: 1_200_000, 0.65: 900_000 };
    const tried: number[] = [];
    const out = encodeWithinBudget((q) => {
      tried.push(q);
      return fakeDataUrl(sizes[q] ?? 500_000);
    });
    expect(tried).toEqual([0.85, 0.75]);
    expect(out.quality).toBe(0.75);
    expect(out.bytes).toBeLessThanOrEqual(TARGET_BYTES);
  });

  it('falls back to the lowest quality when nothing fits', () => {
    const out = encodeWithinBudget(() => fakeDataUrl(3_000_000), TARGET_BYTES, [0.8, 0.5]);
    expect(out.quality).toBe(0.5);
  });

  it('computes decoded bytes from a data URL', () => {
    expect(dataUrlBytes('data:image/jpeg;base64,QUJD')).toBe(3);
    expect(dataUrlBytes('data:image/png;base64,QUI=')).toBe(2);
  });
});

describe('file + brightness helpers', () => {
  it('accepts common image types and rejects others / huge files', () => {
    expect(isAcceptedImageFile({ type: 'image/jpeg', size: 1000 })).toBe(true);
    expect(isAcceptedImageFile({ type: 'image/heic', size: 1000 })).toBe(true);
    expect(isAcceptedImageFile({ type: '', size: 1000 })).toBe(true);
    expect(isAcceptedImageFile({ type: 'application/pdf', size: 1000 })).toBe(false);
    expect(isAcceptedImageFile({ type: 'image/png', size: 60 * 1024 * 1024 })).toBe(false);
  });

  it('measures average luminance', () => {
    const black = new Uint8ClampedArray(4 * 64);
    const white = new Uint8ClampedArray(4 * 64).fill(255);
    expect(averageLuminance(black, 1)).toBe(0);
    expect(Math.round(averageLuminance(white, 1))).toBe(255);
  });
});

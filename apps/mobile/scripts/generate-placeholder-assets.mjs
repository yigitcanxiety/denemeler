#!/usr/bin/env node
/**
 * Generates PLACEHOLDER app icon / splash PNGs (lavender background with a violet "T" monogram)
 * using only Node built-ins (zlib). Replace the files in assets/images/placeholder-* with
 * real brand artwork before release — keep the file names or update app.config.ts.
 *
 * Usage: node ./scripts/generate-placeholder-assets.mjs
 */
import { Buffer } from 'node:buffer';
import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'images');

// Mirrors src/theme.ts (v3 "Aura"): board, a near-white halo, violet, paper
const BOARD = [0xe9, 0xe5, 0xfb];
const HALO = [0xfd, 0xfc, 0xff];
const VIOLET = [0x74, 0x57, 0xf5];
const PAPER = [0xff, 0xff, 0xff];

/* ---------- PNG encoding ---------- */

const CRC_TABLE = new Uint32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(buf) {
  let c = 0xffffffff;
  for (const byte of buf) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

/** rgba: Uint8Array(width*height*4) */
function encodePng(width, height, rgba, withAlpha) {
  const channels = withAlpha ? 4 : 3;
  const raw = Buffer.alloc((width * channels + 1) * height);
  for (let y = 0; y < height; y++) {
    const rowStart = y * (width * channels + 1);
    raw[rowStart] = 0; // filter: none
    for (let x = 0; x < width; x++) {
      const src = (y * width + x) * 4;
      const dst = rowStart + 1 + x * channels;
      raw[dst] = rgba[src];
      raw[dst + 1] = rgba[src + 1];
      raw[dst + 2] = rgba[src + 2];
      if (withAlpha) raw[dst + 3] = rgba[src + 3];
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = withAlpha ? 6 : 2; // colour type RGBA / RGB
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/* ---------- Tiny rasteriser (4×4 supersampled coverage) ---------- */

function createCanvas(size, background) {
  const px = new Float32Array(size * size * 4);
  if (background) {
    for (let i = 0; i < size * size; i++) {
      px.set([background[0], background[1], background[2], 255], i * 4);
    }
  }
  return { size, px };
}

function fillShape(canvas, color, inside) {
  const { size, px } = canvas;
  const S = 4;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let hits = 0;
      for (let sy = 0; sy < S; sy++) {
        for (let sx = 0; sx < S; sx++) {
          if (inside((x + (sx + 0.5) / S) / size, (y + (sy + 0.5) / S) / size)) hits++;
        }
      }
      if (!hits) continue;
      const a = hits / (S * S);
      const i = (y * size + x) * 4;
      const dstA = px[i + 3] / 255;
      const outA = a + dstA * (1 - a);
      for (let c = 0; c < 3; c++) {
        px[i + c] = outA === 0 ? 0 : (color[c] * a + px[i + c] * dstA * (1 - a)) / outA;
      }
      px[i + 3] = outA * 255;
    }
  }
}

const rect = (x0, y0, x1, y1) => (x, y) => x >= x0 && x <= x1 && y >= y0 && y <= y1;
const circle = (cx, cy, r) => (x, y) => (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
const any = (...shapes) => (x, y) => shapes.some((s) => s(x, y));

/** A serif-style "T" centred at (cx, cy) with total height h (normalised coords). */
function monogramT(cx, cy, h) {
  const w = h * 0.78;
  const bar = h * 0.14;
  const stem = h * 0.17;
  const top = cy - h / 2;
  const bottom = cy + h / 2;
  const serif = h * 0.1;
  return any(
    rect(cx - w / 2, top, cx + w / 2, top + bar), // cross bar
    rect(cx - w / 2, top, cx - w / 2 + bar * 0.7, top + bar + serif), // left serif
    rect(cx + w / 2 - bar * 0.7, top, cx + w / 2, top + bar + serif), // right serif
    rect(cx - stem / 2, top, cx + stem / 2, bottom), // stem
    rect(cx - stem * 1.4, bottom - bar * 0.55, cx + stem * 1.4, bottom), // foot
  );
}

function toBytes(canvas) {
  return Uint8Array.from(canvas.px, (v) => Math.max(0, Math.min(255, Math.round(v))));
}

function write(name, size, draw, withAlpha) {
  const canvas = draw(size);
  const file = join(OUT_DIR, name);
  writeFileSync(file, encodePng(size, size, toBytes(canvas), withAlpha));
  console.log(`wrote ${file}`);
}

mkdirSync(OUT_DIR, { recursive: true });

// iOS / general app icon: opaque, full-bleed (iOS applies the rounded mask).
write(
  'placeholder-icon.png',
  1024,
  (size) => {
    const c = createCanvas(size, BOARD);
    fillShape(c, HALO, circle(0.5, 0.5, 0.36));
    fillShape(c, VIOLET, monogramT(0.5, 0.5, 0.4));
    return c;
  },
  false,
);

// Android adaptive icon foreground: transparent, artwork inside the 66% safe zone.
write(
  'placeholder-adaptive-icon.png',
  1024,
  (size) => {
    const c = createCanvas(size, null);
    fillShape(c, HALO, circle(0.5, 0.5, 0.26));
    fillShape(c, VIOLET, monogramT(0.5, 0.5, 0.28));
    return c;
  },
  true,
);

// Android 13+ themed (monochrome) icon: single colour on transparent.
write(
  'placeholder-monochrome-icon.png',
  1024,
  (size) => {
    const c = createCanvas(size, null);
    fillShape(c, [0, 0, 0], monogramT(0.5, 0.5, 0.28));
    return c;
  },
  true,
);

// Splash image (shown centred on the white background colour set in app.config.ts).
write(
  'placeholder-splash.png',
  512,
  (size) => {
    const c = createCanvas(size, null);
    fillShape(c, VIOLET, circle(0.5, 0.5, 0.48));
    fillShape(c, PAPER, monogramT(0.5, 0.5, 0.46));
    return c;
  },
  true,
);

write(
  'placeholder-favicon.png',
  48,
  (size) => {
    const c = createCanvas(size, VIOLET);
    fillShape(c, PAPER, monogramT(0.5, 0.5, 0.6));
    return c;
  },
  false,
);

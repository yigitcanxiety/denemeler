import { parseImageDataUrl } from '@tonelle/shared';
import type { ServerConfig } from './env';
import { ProviderError } from './errors';
import { fetchWithTimeout, readProviderJson } from './fetch';

/** Applies a text-described edit to an image. Input and output are base64 data URLs. */
export interface ImageProvider {
  readonly name: string;
  edit(imageDataUrl: string, prompt: string): Promise<string>;
}

export const RENDER_TIMEOUT_MS = 90_000;
/** Refuse to download absurdly large results from a provider CDN. */
const MAX_RESULT_BYTES = 15 * 1024 * 1024;

function requireInputImage(imageDataUrl: string) {
  const parsed = parseImageDataUrl(imageDataUrl);
  // Callers validate with RenderRequestSchema, so this is a programming error.
  if (!parsed) throw new ProviderError('render: input is not an image data URL');
  return parsed;
}

/* ---------- Gemini (Google AI Studio) ---------- */

export class GeminiImageProvider implements ImageProvider {
  readonly name = 'gemini';

  constructor(
    private readonly apiKey: string,
    private readonly model: string,
    private readonly timeoutMs = RENDER_TIMEOUT_MS,
  ) {}

  async edit(imageDataUrl: string, prompt: string): Promise<string> {
    const input = requireInputImage(imageDataUrl);
    const label = `gemini(${this.model})`;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(this.model)}:generateContent`;

    const response = await fetchWithTimeout(
      url,
      {
        method: 'POST',
        headers: { 'x-goog-api-key': this.apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ inline_data: { mime_type: input.mimeType, data: input.base64 } }, { text: prompt }],
            },
          ],
          generationConfig: { responseModalities: ['IMAGE', 'TEXT'] },
        }),
      },
      this.timeoutMs,
      label,
    );

    if (!response.ok) {
      await response.body?.cancel().catch(() => undefined);
      throw new ProviderError(`${label}: HTTP ${response.status}`);
    }
    return parseGeminiImage(await readProviderJson(response, label), label);
  }
}

interface GeminiInlineData {
  mimeType?: string;
  mime_type?: string;
  data?: string;
}

/** Returns the first inline image in a Gemini `generateContent` response as a data URL. */
export function parseGeminiImage(payload: unknown, label = 'gemini'): string {
  const p = payload as {
    candidates?: Array<{ content?: { parts?: Array<{ inlineData?: GeminiInlineData; inline_data?: GeminiInlineData }> }; finishReason?: string }>;
    promptFeedback?: { blockReason?: string };
  } | null;

  for (const candidate of p?.candidates ?? []) {
    for (const part of candidate.content?.parts ?? []) {
      const inline = part.inlineData ?? part.inline_data;
      const mime = inline?.mimeType ?? inline?.mime_type;
      if (inline?.data && mime?.startsWith('image/')) return `data:${mime};base64,${inline.data}`;
    }
  }
  const reason = p?.promptFeedback?.blockReason ?? p?.candidates?.[0]?.finishReason ?? 'no image in response';
  throw new ProviderError(`${label}: ${reason}`, 'The image could not be generated. Please try another photo.');
}

/* ---------- fal.ai ---------- */

export class FalImageProvider implements ImageProvider {
  readonly name = 'fal';

  constructor(
    private readonly apiKey: string,
    private readonly model: string,
    private readonly timeoutMs = RENDER_TIMEOUT_MS,
  ) {}

  async edit(imageDataUrl: string, prompt: string): Promise<string> {
    requireInputImage(imageDataUrl);
    const label = `fal(${this.model})`;
    const response = await fetchWithTimeout(
      `https://fal.run/${this.model}`,
      {
        method: 'POST',
        headers: { Authorization: `Key ${this.apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, image_urls: [imageDataUrl], num_images: 1, output_format: 'jpeg' }),
      },
      this.timeoutMs,
      label,
    );

    if (!response.ok) {
      await response.body?.cancel().catch(() => undefined);
      throw new ProviderError(`${label}: HTTP ${response.status}`);
    }
    const imageUrl = parseFalImageUrl(await readProviderJson(response, label), label);
    if (imageUrl.startsWith('data:image/')) return imageUrl;
    return downloadAsDataUrl(imageUrl, this.timeoutMs, label);
  }
}

/** Returns the first image URL (https or data URL) in a fal response. */
export function parseFalImageUrl(payload: unknown, label = 'fal'): string {
  const p = payload as { images?: Array<{ url?: unknown }>; image?: { url?: unknown } } | null;
  const url = p?.images?.[0]?.url ?? p?.image?.url;
  if (typeof url === 'string' && (url.startsWith('https://') || url.startsWith('data:image/'))) return url;
  throw new ProviderError(`${label}: no image in response`, 'The image could not be generated. Please try another photo.');
}

/** Downloads a generated image into memory only (never to disk) and returns it as a data URL. */
export async function downloadAsDataUrl(url: string, timeoutMs: number, label: string): Promise<string> {
  const response = await fetchWithTimeout(url, { method: 'GET' }, timeoutMs, `${label} download`);
  if (!response.ok) {
    await response.body?.cancel().catch(() => undefined);
    throw new ProviderError(`${label} download: HTTP ${response.status}`);
  }
  const contentType = (response.headers.get('content-type') ?? 'image/jpeg').split(';')[0]?.trim() ?? 'image/jpeg';
  if (!contentType.startsWith('image/')) {
    await response.body?.cancel().catch(() => undefined);
    throw new ProviderError(`${label} download: unexpected content-type ${contentType}`);
  }
  const buffer = await response.arrayBuffer();
  if (buffer.byteLength === 0 || buffer.byteLength > MAX_RESULT_BYTES) {
    throw new ProviderError(`${label} download: unexpected size ${buffer.byteLength}`);
  }
  return `data:${contentType};base64,${Buffer.from(buffer).toString('base64')}`;
}

/* ---------- Factory ---------- */

/** Returns the configured provider, or null when its key is missing (→ mock mode). */
export function createImageProvider(config: ServerConfig): ImageProvider | null {
  if (config.imageProvider === 'fal') {
    return config.fal.apiKey ? new FalImageProvider(config.fal.apiKey, config.fal.model) : null;
  }
  return config.gemini.apiKey ? new GeminiImageProvider(config.gemini.apiKey, config.gemini.model) : null;
}

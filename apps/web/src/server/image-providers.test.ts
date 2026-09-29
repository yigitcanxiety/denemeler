import { MOCK_IMAGE_DATA_URL } from '@tonelle/shared';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getServerConfig } from './env';
import {
  createImageProvider,
  FalImageProvider,
  GeminiImageProvider,
  parseFalImageUrl,
  parseGeminiImage,
} from './image-providers';

const INPUT_B64 = MOCK_IMAGE_DATA_URL.split(',')[1]!;

describe('image providers', () => {
  const fetchMock = vi.fn<typeof fetch>();
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });
  afterEach(() => vi.unstubAllGlobals());

  describe('Gemini', () => {
    it('sends inline image + prompt and reads the inline image back', async () => {
      fetchMock.mockResolvedValueOnce(
        Response.json({
          candidates: [
            { content: { parts: [{ text: 'Here is the edit' }, { inlineData: { mimeType: 'image/png', data: 'AAAA' } }] } },
          ],
        }),
      );
      const provider = new GeminiImageProvider('g-key', 'gemini-2.5-flash-image');
      await expect(provider.edit(MOCK_IMAGE_DATA_URL, 'apply makeup')).resolves.toBe('data:image/png;base64,AAAA');

      const [url, init] = fetchMock.mock.calls[0]!;
      expect(url).toBe(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent',
      );
      expect((init!.headers as Record<string, string>)['x-goog-api-key']).toBe('g-key');
      const body = JSON.parse(init!.body as string);
      expect(body.contents[0].parts).toEqual([
        { inline_data: { mime_type: 'image/png', data: INPUT_B64 } },
        { text: 'apply makeup' },
      ]);
    });

    it('parses snake_case parts and reports blocks as provider errors', () => {
      expect(
        parseGeminiImage({ candidates: [{ content: { parts: [{ inline_data: { mime_type: 'image/jpeg', data: 'BBBB' } }] } }] }),
      ).toBe('data:image/jpeg;base64,BBBB');
      expect(() => parseGeminiImage({ promptFeedback: { blockReason: 'SAFETY' } })).toThrowError(
        expect.objectContaining({ code: 'provider_error', detail: 'gemini: SAFETY' }),
      );
      expect(() => parseGeminiImage({ candidates: [{ content: { parts: [{ text: 'no' }] } }] })).toThrow();
    });

    it('maps HTTP errors to provider_error', async () => {
      fetchMock.mockResolvedValueOnce(new Response('bad key AIza...', { status: 403 }));
      await expect(new GeminiImageProvider('k', 'm').edit(MOCK_IMAGE_DATA_URL, 'p')).rejects.toMatchObject({
        code: 'provider_error',
        detail: 'gemini(m): HTTP 403',
      });
    });
  });

  describe('fal', () => {
    it('posts the documented body, downloads the result and returns a data URL', async () => {
      fetchMock
        .mockResolvedValueOnce(Response.json({ images: [{ url: 'https://v3.fal.media/files/out.jpeg' }], description: '' }))
        .mockResolvedValueOnce(
          new Response(new Uint8Array([0xff, 0xd8, 0xff]), { headers: { 'content-type': 'image/jpeg' } }),
        );
      const provider = new FalImageProvider('fal-key', 'fal-ai/nano-banana/edit');
      await expect(provider.edit(MOCK_IMAGE_DATA_URL, 'apply makeup')).resolves.toBe('data:image/jpeg;base64,/9j/');

      const [url, init] = fetchMock.mock.calls[0]!;
      expect(url).toBe('https://fal.run/fal-ai/nano-banana/edit');
      expect((init!.headers as Record<string, string>).Authorization).toBe('Key fal-key');
      expect(JSON.parse(init!.body as string)).toEqual({
        prompt: 'apply makeup',
        image_urls: [MOCK_IMAGE_DATA_URL],
        num_images: 1,
        output_format: 'jpeg',
      });
      expect(fetchMock.mock.calls[1]![0]).toBe('https://v3.fal.media/files/out.jpeg');
    });

    it('passes through data URL results and rejects missing images', () => {
      expect(parseFalImageUrl({ images: [{ url: 'data:image/jpeg;base64,AAAA' }] })).toBe('data:image/jpeg;base64,AAAA');
      expect(() => parseFalImageUrl({ images: [] })).toThrowError(expect.objectContaining({ code: 'provider_error' }));
      expect(() => parseFalImageUrl({ images: [{ url: 'http://insecure/x.jpg' }] })).toThrow();
    });

    it('rejects non-image downloads', async () => {
      fetchMock
        .mockResolvedValueOnce(Response.json({ images: [{ url: 'https://v3.fal.media/files/out.jpeg' }] }))
        .mockResolvedValueOnce(new Response('<html>', { headers: { 'content-type': 'text/html' } }));
      await expect(new FalImageProvider('k', 'm').edit(MOCK_IMAGE_DATA_URL, 'p')).rejects.toMatchObject({
        code: 'provider_error',
      });
    });
  });

  it('createImageProvider picks by IMAGE_PROVIDER and returns null without a key', () => {
    expect(createImageProvider(getServerConfig({ IMAGE_PROVIDER: 'gemini', GEMINI_API_KEY: 'x' }))?.name).toBe('gemini');
    expect(createImageProvider(getServerConfig({ IMAGE_PROVIDER: 'fal', FAL_KEY: 'x' }))?.name).toBe('fal');
    expect(createImageProvider(getServerConfig({ IMAGE_PROVIDER: 'fal', GEMINI_API_KEY: 'x' }))).toBeNull();
    expect(createImageProvider(getServerConfig({}))).toBeNull();
  });
});

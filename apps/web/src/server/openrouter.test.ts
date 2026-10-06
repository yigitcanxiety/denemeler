import { MOCK_ANALYSIS, MOCK_IMAGE_DATA_URL } from '@tonelle/shared';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { analyzeFace, messageContent, OPENROUTER_URL } from './openrouter';

const completion = (content: string) => Response.json({ choices: [{ message: { role: 'assistant', content } }] });
const options = { apiKey: 'or-key', model: 'primary/model', fallbackModel: 'fallback/model', siteUrl: 'https://tonelle.app' };
const input = { imageDataUrl: MOCK_IMAGE_DATA_URL, locale: 'en' as const };

describe('analyzeFace (OpenRouter)', () => {
  const fetchMock = vi.fn<typeof fetch>();
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  const bodyOf = (call: number) => JSON.parse(fetchMock.mock.calls[call]![1]!.body as string);

  it('returns a validated analysis and sends the expected request', async () => {
    fetchMock.mockResolvedValueOnce(completion(JSON.stringify(MOCK_ANALYSIS)));
    const result = await analyzeFace(input, options);
    expect(result).toEqual({ analysis: MOCK_ANALYSIS, model: 'primary/model' });

    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe(OPENROUTER_URL);
    const headers = init!.headers as Record<string, string>;
    expect(headers.Authorization).toBe('Bearer or-key');
    expect(headers['HTTP-Referer']).toBe('https://tonelle.app');
    expect(headers['X-Title']).toBe('Tonelle');
    const body = bodyOf(0);
    expect(body.model).toBe('primary/model');
    expect(body.response_format).toEqual({ type: 'json_object' });
    expect(body.temperature).toBeLessThanOrEqual(0.3);
    expect(body.messages[0].role).toBe('system');
    expect(body.messages[1].content).toContainEqual({ type: 'image_url', image_url: { url: MOCK_IMAGE_DATA_URL } });
  });

  it('sends reasoning_effort only when asked (Gemini would otherwise truncate the JSON)', async () => {
    fetchMock.mockImplementation(async () => completion(JSON.stringify(MOCK_ANALYSIS)));
    await analyzeFace(input, options);
    expect(bodyOf(0)).not.toHaveProperty('reasoning_effort');
    await analyzeFace(input, { ...options, reasoningEffort: 'none' });
    expect(bodyOf(1).reasoning_effort).toBe('none');
  });

  it('accepts fenced JSON and lowercase hex', async () => {
    const lower = { ...MOCK_ANALYSIS, lip: MOCK_ANALYSIS.lip.map((c) => c.toLowerCase()) };
    fetchMock.mockResolvedValueOnce(completion('```json\n' + JSON.stringify(lower) + '\n```'));
    const { analysis } = await analyzeFace(input, options);
    expect(analysis.lip).toEqual(MOCK_ANALYSIS.lip);
  });

  it('retries the primary model once on invalid JSON', async () => {
    fetchMock
      .mockResolvedValueOnce(completion('I cannot comply, sorry'))
      .mockResolvedValueOnce(completion(JSON.stringify(MOCK_ANALYSIS)));
    const result = await analyzeFace(input, options);
    expect(result.model).toBe('primary/model');
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(bodyOf(1).model).toBe('primary/model');
  });

  it('falls back to the fallback model after two invalid outputs', async () => {
    fetchMock
      .mockResolvedValueOnce(completion('{"faceDetected": true}'))
      .mockResolvedValueOnce(completion('not json'))
      .mockResolvedValueOnce(completion(JSON.stringify(MOCK_ANALYSIS)));
    const result = await analyzeFace(input, options);
    expect(result.model).toBe('fallback/model');
    expect(bodyOf(2).model).toBe('fallback/model');
  });

  it('goes straight to the fallback on an HTTP error', async () => {
    fetchMock
      .mockResolvedValueOnce(new Response('{"error":"upstream secret"}', { status: 503 }))
      .mockResolvedValueOnce(completion(JSON.stringify(MOCK_ANALYSIS)));
    const result = await analyzeFace(input, options);
    expect(result.model).toBe('fallback/model');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('throws a provider_error without leaking provider bodies when everything fails', async () => {
    fetchMock.mockImplementation(async () => new Response('upstream secret body', { status: 500 }));
    const error = await analyzeFace(input, options).catch((e: unknown) => e);
    expect(error).toMatchObject({ code: 'provider_error' });
    expect(String((error as Error).message)).not.toContain('secret');
    expect(String((error as { detail?: string }).detail)).not.toContain('secret');
  });

  it('throws no_face when the model reports faceDetected=false', async () => {
    fetchMock.mockResolvedValueOnce(completion(JSON.stringify({ faceDetected: false })));
    await expect(analyzeFace(input, options)).rejects.toMatchObject({ code: 'no_face' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('turns a timeout into a provider error', async () => {
    fetchMock.mockImplementation(
      (_url, init) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')));
        }),
    );
    await expect(
      analyzeFace(input, { ...options, fallbackModel: undefined, timeoutMs: 20 }),
    ).rejects.toMatchObject({ code: 'provider_error' });
  });

  it('reads array-form message content', () => {
    expect(messageContent({ choices: [{ message: { content: [{ type: 'text', text: '{"a":' }, { type: 'text', text: '1}' }] } }] })).toBe('{"a":1}');
    expect(messageContent({})).toBeUndefined();
  });
});

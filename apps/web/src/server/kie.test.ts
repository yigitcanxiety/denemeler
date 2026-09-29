import { MOCK_IMAGE_DATA_URL } from '@tonelle/shared';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getServerConfig, isAnalysisMock, isRenderMock } from './env';
import { createImageProvider } from './image-providers';
import { KIE_UPLOAD_URL, KieImageProvider, kieChatUrl, kieEditInput, parseKieRecord, uploadToKie } from './kie';

const uploaded = () => Response.json({ code: 200, data: { downloadUrl: 'https://tempfile.redpandaai.co/tonelle/a.png' } });
const record = (state: string, extra: Record<string, unknown> = {}) =>
  Response.json({ code: 200, data: { taskId: 't1', state, ...extra } });

describe('Kie.ai', () => {
  const fetchMock = vi.fn<typeof fetch>();
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });
  afterEach(() => vi.unstubAllGlobals());

  it('uploads a data URL and returns the hosted URL', async () => {
    fetchMock.mockResolvedValueOnce(uploaded());
    await expect(uploadToKie('k', MOCK_IMAGE_DATA_URL)).resolves.toBe('https://tempfile.redpandaai.co/tonelle/a.png');
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe(KIE_UPLOAD_URL);
    expect((init!.headers as Record<string, string>).Authorization).toBe('Bearer k');
    const body = JSON.parse(init!.body as string);
    expect(body.base64Data).toBe(MOCK_IMAGE_DATA_URL);
    expect(body.uploadPath).toBe('tonelle');
  });

  it('uploads, creates a task, polls until success and downloads the result', async () => {
    fetchMock
      .mockResolvedValueOnce(uploaded())
      .mockResolvedValueOnce(Response.json({ code: 200, data: { taskId: 't1' } }))
      .mockResolvedValueOnce(record('generating'))
      .mockResolvedValueOnce(record('success', { resultJson: '{"resultUrls":["https://tempfile.aiquickdraw.com/out.jpg"]}' }))
      .mockResolvedValueOnce(new Response(new Uint8Array([0xff, 0xd8, 0xff]), { headers: { 'content-type': 'image/jpeg' } }));
    const provider = new KieImageProvider('k', 'google/nano-banana-edit', 10_000, 1);
    await expect(provider.edit(MOCK_IMAGE_DATA_URL, 'apply makeup')).resolves.toBe('data:image/jpeg;base64,/9j/');

    const [createUrl, createInit] = fetchMock.mock.calls[1]!;
    expect(createUrl).toBe('https://api.kie.ai/api/v1/jobs/createTask');
    expect(JSON.parse(createInit!.body as string)).toEqual({
      model: 'google/nano-banana-edit',
      input: { prompt: 'apply makeup', image_urls: ['https://tempfile.redpandaai.co/tonelle/a.png'], output_format: 'jpeg', image_size: 'auto' },
    });
    expect(fetchMock.mock.calls[2]![0]).toBe('https://api.kie.ai/api/v1/jobs/recordInfo?taskId=t1');
  });

  it('maps failed tasks and bad codes to provider errors', () => {
    expect(parseKieRecord({ code: 200, data: { state: 'queuing' } })).toBeNull();
    expect(() => parseKieRecord({ code: 200, data: { state: 'fail', failCode: '500' } })).toThrowError(
      expect.objectContaining({ code: 'provider_error' }),
    );
    expect(() => parseKieRecord({ code: 402, msg: 'insufficient credits' })).toThrowError(
      expect.objectContaining({ detail: 'kie: code 402' }),
    );
  });

  it('uses image_input for Nano Banana 2 and the model-in-path chat URL', () => {
    expect(kieEditInput('nano-banana-2', 'p', 'https://x/a.jpg')).toMatchObject({ image_input: ['https://x/a.jpg'] });
    expect(kieChatUrl('gemini-3-flash')).toBe('https://api.kie.ai/gemini-3-flash/v1/chat/completions');
  });

  it('is selected automatically when it is the only key', () => {
    const config = getServerConfig({ KIE_API_KEY: 'k' });
    expect(config.analysisProvider).toBe('kie');
    expect(config.imageProvider).toBe('kie');
    expect(isAnalysisMock(config)).toBe(false);
    expect(isRenderMock(config)).toBe(false);
    expect(createImageProvider(config)?.name).toBe('kie');
    // OpenRouter stays the analysis provider when its key exists (Space Bunny).
    expect(getServerConfig({ KIE_API_KEY: 'k', OPENROUTER_API_KEY: 'o' }).analysisProvider).toBe('openrouter');
  });
});

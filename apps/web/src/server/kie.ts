import { parseImageDataUrl } from '@tonelle/shared';
import { ProviderError } from './errors';
import { fetchWithTimeout, readProviderJson } from './fetch';
import { downloadAsDataUrl, RENDER_TIMEOUT_MS, type ImageProvider } from './image-providers';

/**
 * Kie.ai: one key for Gemini chat (analysis) and Nano Banana (try-on renders).
 * Image inputs must be URLs, so photos are first sent to Kie's temporary file
 * storage (auto-deleted by Kie after 3 days; disclosed in the privacy policy).
 */
export const KIE_API_BASE = 'https://api.kie.ai';
export const KIE_UPLOAD_URL = 'https://kieai.redpandaai.co/api/file-base64-upload';
const UPLOAD_TIMEOUT_MS = 30_000;
const POLL_INTERVAL_MS = 2_000;

/** OpenAI-compatible chat endpoint; Kie puts the model in the path. */
export function kieChatUrl(model: string): string {
  return `${KIE_API_BASE}/${encodeURIComponent(model)}/v1/chat/completions`;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Uploads a base64 data URL and returns a temporary https URL for it. */
export async function uploadToKie(apiKey: string, imageDataUrl: string, timeoutMs = UPLOAD_TIMEOUT_MS): Promise<string> {
  const parsed = parseImageDataUrl(imageDataUrl);
  if (!parsed) throw new ProviderError('kie upload: input is not an image data URL');
  const ext = parsed.mimeType.split('/')[1]?.replace('jpeg', 'jpg') ?? 'jpg';
  const label = 'kie upload';
  const response = await fetchWithTimeout(
    KIE_UPLOAD_URL,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ base64Data: imageDataUrl, uploadPath: 'tonelle', fileName: `${crypto.randomUUID()}.${ext}` }),
    },
    timeoutMs,
    label,
  );
  if (!response.ok) {
    await response.body?.cancel().catch(() => undefined);
    throw new ProviderError(`${label}: HTTP ${response.status}`);
  }
  const payload = (await readProviderJson(response, label)) as {
    code?: unknown;
    data?: { downloadUrl?: unknown; fileUrl?: unknown };
  } | null;
  const url = payload?.data?.downloadUrl ?? payload?.data?.fileUrl;
  if (typeof url !== 'string' || !url.startsWith('https://')) {
    throw new ProviderError(`${label}: no file URL (code ${String(payload?.code)})`);
  }
  return url;
}

/** Builds the `input` object for a Kie image-edit model. */
export function kieEditInput(model: string, prompt: string, imageUrl: string): Record<string, unknown> {
  if (model.includes('nano-banana-2') || model.includes('nano-banana-pro')) {
    return { prompt, image_input: [imageUrl], aspect_ratio: 'auto', resolution: '1K', output_format: 'jpg' };
  }
  return { prompt, image_urls: [imageUrl], output_format: 'jpeg', image_size: 'auto' };
}

/** Reads the first result URL from a `recordInfo` payload, or null while the task is still running. */
export function parseKieRecord(payload: unknown, label = 'kie'): string | null {
  const p = payload as {
    code?: unknown;
    data?: { state?: unknown; resultJson?: unknown; failMsg?: unknown; failCode?: unknown };
  } | null;
  if (p?.code !== undefined && p.code !== 200) throw new ProviderError(`${label}: code ${String(p.code)}`);
  const data = p?.data;
  if (data?.state === 'fail') {
    throw new ProviderError(
      `${label}: task failed (${String(data.failCode ?? '')})`,
      'The image could not be generated. Please try another photo.',
    );
  }
  if (data?.state !== 'success') return null;
  let result: { resultUrls?: unknown } | undefined;
  try {
    result = typeof data.resultJson === 'string' ? JSON.parse(data.resultJson) : (data.resultJson as typeof result);
  } catch {
    throw new ProviderError(`${label}: resultJson was not JSON`);
  }
  const url = Array.isArray(result?.resultUrls) ? result.resultUrls[0] : undefined;
  if (typeof url !== 'string' || !url.startsWith('https://')) throw new ProviderError(`${label}: no result URL`);
  return url;
}

export class KieImageProvider implements ImageProvider {
  readonly name = 'kie';

  constructor(
    private readonly apiKey: string,
    private readonly model: string,
    private readonly timeoutMs = RENDER_TIMEOUT_MS,
    private readonly pollIntervalMs = POLL_INTERVAL_MS,
  ) {}

  async edit(imageDataUrl: string, prompt: string): Promise<string> {
    const label = `kie(${this.model})`;
    const deadline = Date.now() + this.timeoutMs;
    const headers = { Authorization: `Bearer ${this.apiKey}`, 'Content-Type': 'application/json' };
    const remaining = () => Math.max(1_000, deadline - Date.now());

    const imageUrl = await uploadToKie(this.apiKey, imageDataUrl, Math.min(UPLOAD_TIMEOUT_MS, remaining()));

    const created = await fetchWithTimeout(
      `${KIE_API_BASE}/api/v1/jobs/createTask`,
      { method: 'POST', headers, body: JSON.stringify({ model: this.model, input: kieEditInput(this.model, prompt, imageUrl) }) },
      remaining(),
      label,
    );
    if (!created.ok) {
      await created.body?.cancel().catch(() => undefined);
      throw new ProviderError(`${label}: HTTP ${created.status}`);
    }
    const task = (await readProviderJson(created, label)) as { code?: unknown; data?: { taskId?: unknown } } | null;
    const taskId = task?.data?.taskId;
    if (typeof taskId !== 'string') throw new ProviderError(`${label}: no taskId (code ${String(task?.code)})`);

    while (Date.now() < deadline) {
      await wait(this.pollIntervalMs);
      const status = await fetchWithTimeout(
        `${KIE_API_BASE}/api/v1/jobs/recordInfo?taskId=${encodeURIComponent(taskId)}`,
        { method: 'GET', headers: { Authorization: headers.Authorization } },
        remaining(),
        label,
      );
      if (!status.ok) {
        await status.body?.cancel().catch(() => undefined);
        throw new ProviderError(`${label}: status HTTP ${status.status}`);
      }
      const url = parseKieRecord(await readProviderJson(status, label), label);
      if (url) return downloadAsDataUrl(url, remaining(), label);
    }
    throw new ProviderError(`${label}: timed out after ${this.timeoutMs}ms`);
  }
}

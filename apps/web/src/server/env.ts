/**
 * Typed, side-effect-free reader for server environment variables.
 * Values are read on every call (cheap) so tests can stub `process.env` freely.
 */

export type ImageProviderName = 'gemini' | 'fal';

export interface ServerConfig {
  /** `TONELLE_MOCK=1` forces every capability into mock mode. */
  mockForced: boolean;
  /** Artificial latency for mock analysis responses (ms). */
  mockDelayMs: number;
  siteUrl: string;
  openRouter: {
    apiKey: string | undefined;
    model: string;
    fallbackModel: string | undefined;
  };
  imageProvider: ImageProviderName;
  gemini: { apiKey: string | undefined; model: string };
  fal: { apiKey: string | undefined; model: string };
  revenueCatSecretKey: string | undefined;
}

export const DEFAULT_ANALYSIS_MODEL = 'stealth/space-bunny-alpha';
export const DEFAULT_GEMINI_IMAGE_MODEL = 'gemini-2.5-flash-image';
export const DEFAULT_FAL_IMAGE_MODEL = 'fal-ai/nano-banana/edit';
export const DEFAULT_SITE_URL = 'https://tonelle.app';
const DEFAULT_MOCK_DELAY_MS = 600;

type Env = Record<string, string | undefined>;

/** Trims, strips a trailing inline `# comment`, and maps empty strings to undefined. */
function read(env: Env, name: string): string | undefined {
  const raw = env[name];
  if (raw === undefined) return undefined;
  const value = raw.replace(/\s+#.*$/, '').trim();
  return value === '' ? undefined : value;
}

function truthy(value: string | undefined): boolean {
  return value !== undefined && ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
}

export function getServerConfig(env: Env = process.env): ServerConfig {
  const provider = read(env, 'IMAGE_PROVIDER')?.toLowerCase();
  const delay = Number(read(env, 'TONELLE_MOCK_DELAY_MS'));
  return {
    mockForced: truthy(read(env, 'TONELLE_MOCK')),
    mockDelayMs: Number.isFinite(delay) && delay >= 0 ? delay : DEFAULT_MOCK_DELAY_MS,
    siteUrl: read(env, 'NEXT_PUBLIC_SITE_URL') ?? DEFAULT_SITE_URL,
    openRouter: {
      apiKey: read(env, 'OPENROUTER_API_KEY'),
      model: read(env, 'ANALYSIS_MODEL') ?? DEFAULT_ANALYSIS_MODEL,
      fallbackModel: read(env, 'ANALYSIS_FALLBACK_MODEL'),
    },
    imageProvider: provider === 'fal' ? 'fal' : 'gemini',
    gemini: {
      apiKey: read(env, 'GEMINI_API_KEY'),
      model: read(env, 'GEMINI_IMAGE_MODEL') ?? DEFAULT_GEMINI_IMAGE_MODEL,
    },
    fal: {
      apiKey: read(env, 'FAL_KEY'),
      model: read(env, 'FAL_IMAGE_MODEL') ?? DEFAULT_FAL_IMAGE_MODEL,
    },
    revenueCatSecretKey: read(env, 'REVENUECAT_SECRET_KEY'),
  };
}

/** Analysis is mocked when forced or when no OpenRouter key is configured. */
export function isAnalysisMock(config: ServerConfig): boolean {
  return config.mockForced || !config.openRouter.apiKey;
}

/** Rendering is mocked when forced or when the selected image provider has no key. */
export function isRenderMock(config: ServerConfig): boolean {
  if (config.mockForced) return true;
  const key = config.imageProvider === 'fal' ? config.fal.apiKey : config.gemini.apiKey;
  return !key;
}

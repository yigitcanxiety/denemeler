/**
 * Typed, side-effect-free reader for server environment variables.
 * Values are read on every call (cheap) so tests can stub `process.env` freely.
 */

export type ImageProviderName = 'gemini' | 'fal' | 'kie';
export type AnalysisProviderName = 'openrouter' | 'gemini' | 'kie';

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
  /** OpenRouter when its key is set (Space Bunny), else Google Gemini directly, else Kie.ai. */
  analysisProvider: AnalysisProviderName;
  imageProvider: ImageProviderName;
  kie: { apiKey: string | undefined; analysisModel: string; imageModel: string };
  gemini: { apiKey: string | undefined; model: string; analysisModel: string };
  fal: { apiKey: string | undefined; model: string };
  revenueCatSecretKey: string | undefined;
  /** Real renders without RevenueCat or an entitlement check, capped per IP (`TONELLE_FREE_RENDERS=1`). */
  freeRenders: boolean;
  /** Invite codes that unlock results without paying (`TONELLE_ACCESS_CODES`, comma separated, case-insensitive). */
  accessCodes: string[];
}

export const DEFAULT_ANALYSIS_MODEL = 'stealth/space-bunny-alpha';
export const DEFAULT_GEMINI_IMAGE_MODEL = 'gemini-2.5-flash-image';
export const DEFAULT_GEMINI_ANALYSIS_MODEL = 'gemini-2.5-flash';
export const DEFAULT_FAL_IMAGE_MODEL = 'fal-ai/nano-banana/edit';
export const DEFAULT_KIE_ANALYSIS_MODEL = 'gemini-3-flash';
export const DEFAULT_KIE_IMAGE_MODEL = 'google/nano-banana-edit';
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
  const openRouterKey = read(env, 'OPENROUTER_API_KEY');
  const kieKey = read(env, 'KIE_API_KEY');
  const geminiKey = read(env, 'GEMINI_API_KEY');
  // Without an explicit IMAGE_PROVIDER, use Kie.ai when it is the only image key configured.
  const imageProvider: ImageProviderName =
    provider === 'fal' || provider === 'kie' || provider === 'gemini'
      ? provider
      : kieKey && !geminiKey
        ? 'kie'
        : 'gemini';
  return {
    mockForced: truthy(read(env, 'TONELLE_MOCK')),
    mockDelayMs: Number.isFinite(delay) && delay >= 0 ? delay : DEFAULT_MOCK_DELAY_MS,
    siteUrl: read(env, 'NEXT_PUBLIC_SITE_URL') ?? DEFAULT_SITE_URL,
    openRouter: {
      apiKey: openRouterKey,
      model: read(env, 'ANALYSIS_MODEL') ?? DEFAULT_ANALYSIS_MODEL,
      fallbackModel: read(env, 'ANALYSIS_FALLBACK_MODEL'),
    },
    analysisProvider: openRouterKey ? 'openrouter' : geminiKey ? 'gemini' : kieKey ? 'kie' : 'openrouter',
    imageProvider,
    kie: {
      apiKey: kieKey,
      analysisModel: read(env, 'KIE_ANALYSIS_MODEL') ?? DEFAULT_KIE_ANALYSIS_MODEL,
      imageModel: read(env, 'KIE_IMAGE_MODEL') ?? DEFAULT_KIE_IMAGE_MODEL,
    },
    gemini: {
      apiKey: geminiKey,
      model: read(env, 'GEMINI_IMAGE_MODEL') ?? DEFAULT_GEMINI_IMAGE_MODEL,
      analysisModel: read(env, 'GEMINI_ANALYSIS_MODEL') ?? DEFAULT_GEMINI_ANALYSIS_MODEL,
    },
    fal: {
      apiKey: read(env, 'FAL_KEY'),
      model: read(env, 'FAL_IMAGE_MODEL') ?? DEFAULT_FAL_IMAGE_MODEL,
    },
    revenueCatSecretKey: read(env, 'REVENUECAT_SECRET_KEY'),
    freeRenders: truthy(read(env, 'TONELLE_FREE_RENDERS')),
    accessCodes: (read(env, 'TONELLE_ACCESS_CODES') ?? '')
      .split(',')
      .map((c) => c.trim().toUpperCase())
      .filter(Boolean),
  };
}

/** Analysis is mocked when forced or when no analysis provider has a key. */
export function isAnalysisMock(config: ServerConfig): boolean {
  return config.mockForced || (!config.openRouter.apiKey && !config.gemini.apiKey && !config.kie.apiKey);
}

/**
 * Rendering is mocked when forced, when the selected image provider has no key, or when
 * RevenueCat is not configured (paid renders cannot be verified, so show the free demo instead).
 */
export function isRenderMock(config: ServerConfig): boolean {
  if (config.mockForced || (!config.revenueCatSecretKey && !config.freeRenders)) return true;
  const key = { fal: config.fal.apiKey, kie: config.kie.apiKey, gemini: config.gemini.apiKey }[config.imageProvider];
  return !key;
}

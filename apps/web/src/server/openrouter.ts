import {
  buildAnalysisPrompt,
  buildSkinAnalysisPrompt,
  FaceAnalysisSchema,
  SkinAnalysisSchema,
  type AnalysisPrompt,
  type FaceAnalysis,
  type Locale,
  type QuizAnswers,
  type SkinAnalysis,
} from '@tonelle/shared';
import type { z } from 'zod';
import { NoFaceError, ProviderError } from './errors';
import { fetchWithTimeout, readProviderJson } from './fetch';
import { extractJson } from './json-extract';

export const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
/** Google's OpenAI-compatible endpoint; accepts the same body and base64 data URLs. */
export const GEMINI_CHAT_URL = 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions';
export const ANALYSIS_TIMEOUT_MS = 45_000;
/** Overall budget across retries + fallback, so a request never hangs for minutes. */
export const ANALYSIS_TOTAL_BUDGET_MS = 100_000;

export interface OpenRouterOptions {
  apiKey: string;
  model: string;
  fallbackModel?: string;
  siteUrl: string;
  appTitle?: string;
  timeoutMs?: number;
  totalBudgetMs?: number;
  /** Chat endpoint for a model; defaults to OpenRouter. Kie.ai puts the model in the path. */
  endpoint?: (model: string) => string;
  /** Log label prefix, e.g. `openrouter` or `kie`. */
  providerLabel?: string;
  /** OpenAI-style `reasoning_effort`; Gemini 2.5 otherwise spends `max_tokens` on thinking and truncates the JSON. */
  reasoningEffort?: 'none' | 'low';
}

export interface AnalyzeFaceInput {
  imageDataUrl: string;
  locale: Locale;
  quiz?: QuizAnswers;
  /** Hosted copy of the photo for providers that do not accept data URLs. */
  imageUrl?: string;
}

export interface AnalyzeFaceResult<T = FaceAnalysis> {
  analysis: T;
  model: string;
}

/** What to ask the model and how to validate its JSON answer. */
interface AnalysisSpec<T> {
  prompt: AnalysisPrompt;
  schema: z.ZodType<T>;
  normalize?: (value: unknown) => unknown;
}

/** Thrown when the model answered but the content was not a valid `FaceAnalysis`. */
class InvalidOutputError extends ProviderError {}

/**
 * Runs the vision analysis through OpenRouter.
 * Strategy: primary model → (invalid output) primary once more → fallback model.
 * Transport/HTTP failures on the primary skip the retry and go straight to the fallback.
 * A `faceDetected: false` answer ends the chain with `NoFaceError`.
 */
export function analyzeFace(input: AnalyzeFaceInput, options: OpenRouterOptions): Promise<AnalyzeFaceResult> {
  return runAnalysis(input, options, {
    prompt: buildAnalysisPrompt(input.locale, input.quiz),
    schema: FaceAnalysisSchema,
    normalize,
  });
}

/** Skincare analysis of the same selfie; same retry/fallback chain as `analyzeFace`. */
export function analyzeSkin(input: AnalyzeFaceInput, options: OpenRouterOptions): Promise<AnalyzeFaceResult<SkinAnalysis>> {
  return runAnalysis(input, options, { prompt: buildSkinAnalysisPrompt(input.locale), schema: SkinAnalysisSchema, normalize: normalizeIssues });
}

async function runAnalysis<T>(input: AnalyzeFaceInput, options: OpenRouterOptions, spec: AnalysisSpec<T>): Promise<AnalyzeFaceResult<T>> {
  const deadline = Date.now() + (options.totalBudgetMs ?? ANALYSIS_TOTAL_BUDGET_MS);
  const perCall = options.timeoutMs ?? ANALYSIS_TIMEOUT_MS;
  const attempts: string[] = [options.model, options.model];
  if (options.fallbackModel && options.fallbackModel !== options.model) attempts.push(options.fallbackModel);

  let lastError: ProviderError | undefined;
  for (let i = 0; i < attempts.length; i++) {
    const model = attempts[i] as string;
    // Only retry the same model when its output was malformed.
    if (i === 1 && !(lastError instanceof InvalidOutputError)) continue;
    const remaining = deadline - Date.now();
    if (remaining <= 1_000) break;
    try {
      const analysis = await callModel(model, input, options, spec, Math.min(perCall, remaining));
      return { analysis, model };
    } catch (error) {
      if (!(error instanceof ProviderError)) throw error;
      lastError = error;
      console.warn(`[analyze] attempt ${i + 1} failed: ${error.detail ?? error.message}`);
    }
  }
  throw lastError ?? new ProviderError('openrouter: analysis time budget exhausted');
}

async function callModel<T>(
  model: string,
  input: AnalyzeFaceInput,
  options: OpenRouterOptions,
  spec: AnalysisSpec<T>,
  timeoutMs: number,
): Promise<T> {
  const { prompt } = spec;
  const label = `${options.providerLabel ?? 'openrouter'}(${model})`;

  const response = await fetchWithTimeout(
    options.endpoint ? options.endpoint(model) : OPENROUTER_URL,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${options.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': options.siteUrl,
        'X-Title': options.appTitle ?? 'Tonelle',
      },
      body: JSON.stringify({
        model,
        stream: false,
        temperature: 0.2,
        max_tokens: 1500,
        response_format: { type: 'json_object' },
        ...(options.reasoningEffort ? { reasoning_effort: options.reasoningEffort } : {}),
        messages: [
          { role: 'system', content: prompt.system },
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt.user },
              { type: 'image_url', image_url: { url: input.imageUrl ?? input.imageDataUrl } },
            ],
          },
        ],
      }),
    },
    timeoutMs,
    label,
  );

  if (!response.ok) {
    // Drain without logging: provider bodies may echo request data.
    await response.body?.cancel().catch(() => undefined);
    throw new ProviderError(`${label}: HTTP ${response.status}`);
  }

  const payload = await readProviderJson(response, label);
  const content = messageContent(payload);
  if (content === undefined) {
    const apiError = (payload as { error?: { code?: unknown } } | null)?.error;
    throw new ProviderError(`${label}: no message content${apiError ? ` (error code ${String(apiError.code)})` : ''}`);
  }

  const json = extractJson(content);
  if (json === undefined) throw new InvalidOutputError(`${label}: output was not JSON`);
  if ((json as { faceDetected?: unknown }).faceDetected === false) throw new NoFaceError();

  const parsed = spec.schema.safeParse(spec.normalize ? spec.normalize(json) : json);
  if (!parsed.success) {
    const paths = parsed.error.issues
      .slice(0, 3)
      .map((issue) => issue.path.join('.') || '(root)')
      .join(', ');
    throw new InvalidOutputError(`${label}: output failed schema validation at ${paths}`);
  }
  return parsed.data;
}

/** Pulls assistant text out of an OpenAI-compatible chat completion payload. */
export function messageContent(payload: unknown): string | undefined {
  const choice = (payload as { choices?: Array<{ message?: { content?: unknown } }> } | null)?.choices?.[0];
  const content = choice?.message?.content;
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    const text = content
      .map((part: unknown) => {
        const p = part as { type?: unknown; text?: unknown };
        return typeof p?.text === 'string' ? p.text : '';
      })
      .join('');
    return text || undefined;
  }
  return undefined;
}

/** Light, safe clean-ups of common model quirks before strict validation. */
function normalize(value: unknown): unknown {
  if (typeof value !== 'object' || value === null) return value;
  const obj = { ...(value as Record<string, unknown>) };
  for (const key of ['bestColors', 'avoidColors', 'lip', 'blush', 'eyeshadow'] as const) {
    const list = obj[key];
    if (Array.isArray(list)) obj[key] = list.map((c) => (typeof c === 'string' ? c.trim().toUpperCase() : c));
  }
  return normalizeIssues(obj);
}

function normalizeIssues(value: unknown): unknown {
  if (typeof value !== 'object' || value === null) return value;
  const obj = { ...(value as Record<string, unknown>) };
  if (!Array.isArray(obj.qualityIssues) && obj.qualityIssues == null) obj.qualityIssues = [];
  return obj;
}

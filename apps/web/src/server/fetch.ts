import { ProviderError } from './errors';

export type FetchLike = typeof fetch;

/**
 * `fetch` with an AbortController timeout. Network failures and timeouts become
 * `ProviderError`s with a short, secret-free summary.
 */
export async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number,
  label: string,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch (error) {
    if (controller.signal.aborted) throw new ProviderError(`${label}: timed out after ${timeoutMs}ms`);
    const name = error instanceof Error ? error.name : 'unknown';
    throw new ProviderError(`${label}: network error (${name})`);
  } finally {
    clearTimeout(timer);
  }
}

/** Reads a JSON body, turning parse failures into a `ProviderError`. */
export async function readProviderJson(response: Response, label: string): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    throw new ProviderError(`${label}: response was not JSON`);
  }
}

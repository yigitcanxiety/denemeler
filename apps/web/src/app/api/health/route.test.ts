import { HealthResponseSchema } from '@tonelle/shared';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { GET } from './route';

describe('GET /api/health', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('reports mock flags per capability', async () => {
    vi.stubEnv('TONELLE_MOCK', '');
    vi.stubEnv('OPENROUTER_API_KEY', 'x');
    vi.stubEnv('IMAGE_PROVIDER', 'gemini');
    vi.stubEnv('GEMINI_API_KEY', '');
    const res = GET();
    expect(res.status).toBe(200);
    expect(res.headers.get('access-control-allow-origin')).toBe('*');
    expect(HealthResponseSchema.parse(await res.json())).toEqual({ ok: true, mock: { analysis: false, render: true } });
  });

  it('reports full mock when forced', async () => {
    vi.stubEnv('TONELLE_MOCK', '1');
    vi.stubEnv('OPENROUTER_API_KEY', 'x');
    expect(await GET().json()).toEqual({ ok: true, mock: { analysis: true, render: true } });
  });
});

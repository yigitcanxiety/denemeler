import { describe, expect, it } from 'vitest';
import { en } from './en';
import { tr } from './tr';

/** Structural signature: object keys recursively; arrays by length and element shape. */
function shape(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((k) => [k, shape((value as Record<string, unknown>)[k])]),
    );
  }
  return typeof value;
}

function leaves(value: unknown, path = ''): [string, unknown][] {
  if (Array.isArray(value)) return value.flatMap((v, i) => leaves(v, `${path}[${i}]`));
  if (value && typeof value === 'object')
    return Object.entries(value).flatMap(([k, v]) => leaves(v, path ? `${path}.${k}` : k));
  return [[path, value]];
}

describe('web content dictionaries', () => {
  it('tr and en have identical keys and structure', () => {
    expect(shape(tr)).toEqual(shape(en));
  });

  it('has no empty strings', () => {
    for (const dict of [tr, en]) {
      for (const [path, value] of leaves(dict)) {
        if (typeof value === 'string') expect(value.trim(), path).not.toBe('');
      }
    }
  });

  it('keeps legal section anchors identical across locales', () => {
    for (const key of ['privacy', 'kvkk', 'consent', 'terms'] as const) {
      expect(tr.legal[key].sections.map((s) => s.id)).toEqual(en.legal[key].sections.map((s) => s.id));
    }
  });

  it('has 6–8 FAQ entries and a {terms} placeholder in the consent checkbox', () => {
    expect(en.faq.items.length).toBeGreaterThanOrEqual(6);
    expect(en.faq.items.length).toBeLessThanOrEqual(8);
    expect(tr.analyze.consentTermsCheckbox).toContain('{terms}');
    expect(en.analyze.consentTermsCheckbox).toContain('{terms}');
  });
});

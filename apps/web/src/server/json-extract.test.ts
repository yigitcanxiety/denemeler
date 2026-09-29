import { describe, expect, it } from 'vitest';
import { extractJson } from './json-extract';

describe('extractJson', () => {
  it('parses plain JSON', () => {
    expect(extractJson('{"a":1}')).toEqual({ a: 1 });
  });

  it('strips ```json fences', () => {
    expect(extractJson('```json\n{"a":1,"b":[1,2]}\n```')).toEqual({ a: 1, b: [1, 2] });
  });

  it('strips bare ``` fences surrounded by prose', () => {
    expect(extractJson('Here you go:\n```\n{"a":"x"}\n```\nHope it helps!')).toEqual({ a: 'x' });
  });

  it('finds an object inside prose, respecting braces in strings', () => {
    expect(extractJson('Sure! {"summary":"use {soft} tones","n":2} Thanks.')).toEqual({
      summary: 'use {soft} tones',
      n: 2,
    });
  });

  it('skips unbalanced/invalid candidates', () => {
    expect(extractJson('{oops} then {"ok":true}')).toEqual({ ok: true });
  });

  it('returns undefined for non-JSON or primitives', () => {
    expect(extractJson('')).toBeUndefined();
    expect(extractJson('no json here')).toBeUndefined();
    expect(extractJson('42')).toBeUndefined();
    expect(extractJson('{"a":')).toBeUndefined();
  });
});

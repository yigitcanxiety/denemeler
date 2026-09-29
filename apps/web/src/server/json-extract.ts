/**
 * Extracts the first JSON object from LLM output. Handles markdown code fences and
 * prose before/after the object. Returns `undefined` when nothing parseable is found.
 */
export function extractJson(text: string): unknown {
  const trimmed = text.trim();
  if (trimmed === '') return undefined;

  const direct = tryParse(trimmed);
  if (direct !== undefined) return direct;

  // ```json ... ``` (or plain ```) fences, possibly surrounded by prose.
  const fence = /```[a-zA-Z0-9_-]*\s*\n?([\s\S]*?)```/.exec(trimmed);
  if (fence?.[1]) {
    const fenced = tryParse(fence[1].trim());
    if (fenced !== undefined) return fenced;
  }

  // Scan for balanced top-level `{...}` spans, respecting strings.
  for (let start = trimmed.indexOf('{'); start !== -1; start = trimmed.indexOf('{', start + 1)) {
    const end = findObjectEnd(trimmed, start);
    if (end === -1) continue;
    const parsed = tryParse(trimmed.slice(start, end + 1));
    if (parsed !== undefined) return parsed;
  }
  return undefined;
}

function tryParse(candidate: string): unknown {
  try {
    const value: unknown = JSON.parse(candidate);
    return typeof value === 'object' && value !== null ? value : undefined;
  } catch {
    return undefined;
  }
}

function findObjectEnd(text: string, start: number): number {
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') inString = true;
    else if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

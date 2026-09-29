#!/usr/bin/env node
/**
 * Browser preview of the app: `expo export --platform web` (SPA, app.config web.output "single")
 * post-processed so the export works when hosted at the domain root OR under any sub-path
 * (e.g. https://example.com/some/folder/), with no absolute URLs left in the output.
 *
 * How: the export is built with a placeholder base URL (experiments.baseUrl, see app.config.ts).
 * Every placeholder string in the JS is rewritten to read `globalThis.__TONELLE_BASE__`, which an
 * inline script in index.html computes from `location.pathname` before it loads the bundle.
 *
 * Without EXPO_PUBLIC_API_URL the preview runs in offline demo mode (shared mock analysis,
 * labelled DEMO in the UI). Usage:
 *   node scripts/export-web-preview.mjs [--out <dir>]      (default: dist-web)
 */
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PLACEHOLDER = '/__tonelle_base__';
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outArg = process.argv.indexOf('--out');
const outDir = path.resolve(projectRoot, outArg > -1 ? process.argv[outArg + 1] : 'dist-web');

rmSync(outDir, { recursive: true, force: true });
execFileSync('npx', ['expo', 'export', '--platform', 'web', '--output-dir', outDir], {
  cwd: projectRoot,
  stdio: 'inherit',
  env: { ...process.env, TONELLE_WEB_BASE_PLACEHOLDER: PLACEHOLDER },
});

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const escaped = PLACEHOLDER.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
let rewrites = 0;
for (const file of walk(outDir).filter((f) => f.endsWith('.js'))) {
  let code = readFileSync(file, 'utf8');
  if (!code.includes(PLACEHOLDER)) continue;
  // Inside embedded JSON (the serialized app config): drop the placeholder.
  code = code.replace(new RegExp(`\\\\"${escaped}\\\\"`, 'g'), () => (rewrites++, '\\"\\"'));
  // String literals "/__tonelle_base__/rest" → (globalThis.__TONELLE_BASE__+"/rest")
  code = code.replace(new RegExp(`"${escaped}([^"\\\\]*)"`, 'g'), (_m, rest) => {
    rewrites++;
    return `(globalThis.__TONELLE_BASE__+${JSON.stringify(rest)})`;
  });
  if (code.includes(PLACEHOLDER)) throw new Error(`Unhandled base-URL placeholder left in ${file}`);
  writeFileSync(file, code);
}

// Route segments (from src/app) are stripped from the URL to find the base on deep links.
const routes = walk(path.join(projectRoot, 'src/app'))
  .map((f) => path.relative(path.join(projectRoot, 'src/app'), f).replace(/\.tsx?$/, ''))
  .filter((r) => !r.startsWith('_') && r !== 'index' && !r.includes('+'))
  .map((r) => r.replace(/\[[^\]]+\]/g, '[^/]+').replace(/\//g, '\\/'));

const indexPath = path.join(outDir, 'index.html');
let html = readFileSync(indexPath, 'utf8');
const bundles = [...html.matchAll(/<script src="([^"]+)" defer><\/script>/g)].map((m) => m[1]);
if (bundles.length === 0) throw new Error('No bundle <script> found in index.html');
html = html.replace(/<script src="[^"]+" defer><\/script>/g, '');
html = html.replace(/<link rel="icon" href="[^"]*"\s*\/?>/, '');
const boot = `<script>
(function () {
  var path = location.pathname;
  if (/\\/index\\.html$/.test(path)) {
    path = path.replace(/index\\.html$/, '');
    history.replaceState(null, '', path + location.search + location.hash);
  }
  var m = path.match(/^(.*?)\\/(?:${routes.join('|')})\\/?$/);
  var base = (m ? m[1] : path).replace(/\\/+$/, '');
  window.__TONELLE_BASE__ = base;
  var icon = document.createElement('link');
  icon.rel = 'icon';
  icon.href = base + '/favicon.ico';
  document.head.appendChild(icon);
  ${JSON.stringify(bundles.map((b) => b.replace(PLACEHOLDER, '')))}.forEach(function (src) {
    var s = document.createElement('script');
    s.src = base + src;
    s.async = false;
    document.body.appendChild(s);
  });
})();
</script>`;
html = html.replace('</body>', `${boot}\n</body>`);
if (html.includes(PLACEHOLDER)) throw new Error('Placeholder left in index.html');
writeFileSync(indexPath, html);

const files = walk(outDir);
const bytes = files.reduce((sum, f) => sum + statSync(f).size, 0);
console.log(
  `\nWeb preview: ${outDir}\n  ${files.length} files, ${(bytes / 1024 / 1024).toFixed(2)} MB, ${rewrites} base-URL rewrites`,
);

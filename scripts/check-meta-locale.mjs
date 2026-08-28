// scripts/check-meta-locale.mjs
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const base = join(root, 'src', 'app', '[locale]', '(marketing)');

function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name === 'page.tsx') {
      const src = readFileSync(p, 'utf8');
      const hasMeta = /export async function generateMetadata/.test(src);
      const hasSet = /setRequestLocale/.test(src);
      if (hasMeta) {
        console.log(`${p.replace(root + '\\', '')} | setRequestLocale: ${hasSet}`);
      }
    }
  }
}
walk(base);

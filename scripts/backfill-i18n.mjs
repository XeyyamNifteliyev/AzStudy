// scripts/backfill-i18n.mjs — add missing keys to locale files
// Copies the missing keys (Geo.*, Chatbot.*, UniversityDetail.city,
// ProgramCombination.categoryLabel/cityLabel) from en.json into every locale
// file so the key sets are identical. Values are EN fallbacks — real
// translations can follow.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dir = join(__dirname, '..', 'src', 'messages');

function deepGet(obj, path) {
  return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}
function deepSet(obj, path, value) {
  const keys = path.split('.');
  let o = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    o[keys[i]] ??= {};
    o = o[keys[i]];
  }
  o[keys[keys.length - 1]] = value;
}

const en = JSON.parse(readFileSync(join(dir, 'en.json'), 'utf8'));

// Collect all leaf paths from en.json.
const leafPaths = [];
(function walk(node, prefix) {
  for (const [k, v] of Object.entries(node)) {
    const p = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) walk(v, p);
    else leafPaths.push(p);
  }
})(en, '');

let changed = 0;
for (const f of readdirSync(dir).filter((x) => x.endsWith('.json') && x !== 'en.json')) {
  const locale = f.replace('.json', '');
  const data = JSON.parse(readFileSync(join(dir, f), 'utf8'));
  let added = 0;
  for (const p of leafPaths) {
    if (deepGet(data, p) === undefined) {
      deepSet(data, p, deepGet(en, p));
      added++;
    }
  }
  if (added) {
    writeFileSync(join(dir, f), JSON.stringify(data, null, 2) + '\n');
    console.log(`[${locale}] added ${added} keys`);
    changed++;
  }
}
console.log(`\n✓ backfilled ${changed} locale files`);

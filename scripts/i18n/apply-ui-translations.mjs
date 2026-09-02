// Applies UI translations from scripts/i18n/dict/<locale>.json into src/messages/<locale>.json.
// Only overwrites a value when it is still identical to the EN source (preserves
// existing good translations). Keeps ICU {placeholders} responsibility with the dict.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..', '..');

const locale = process.argv[2];
if (!locale) {
  console.error('usage: node scripts/i18n/apply-ui-translations.mjs <locale>');
  process.exit(1);
}

const dictPath = join(__dirname, 'dict', `${locale}.json`);
if (!existsSync(dictPath)) {
  console.error(`no dict for ${locale}`);
  process.exit(1);
}

const dict = JSON.parse(readFileSync(dictPath, 'utf8'));
const enPath = join(root, 'src', 'messages', 'en.json');
const locPath = join(root, 'src', 'messages', `${locale}.json`);
const en = JSON.parse(readFileSync(enPath, 'utf8'));
const data = JSON.parse(readFileSync(locPath, 'utf8'));

function getFlat(obj, keys) {
  let cur = obj;
  for (const k of keys) {
    if (cur == null || typeof cur !== 'object') return undefined;
    cur = cur[k];
  }
  return cur;
}

function setFlat(obj, keys, value) {
  let cur = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (typeof cur[keys[i]] !== 'object' || cur[keys[i]] === null) cur[keys[i]] = {};
    cur = cur[keys[i]];
  }
  cur[keys[keys.length - 1]] = value;
}

let applied = 0;
let skipped = 0;
let missing = 0;
for (const [key, value] of Object.entries(dict)) {
  const keys = key.split('.');
  const enVal = getFlat(en, keys);
  const curVal = getFlat(data, keys);
  if (enVal === undefined) {
    missing++;
    console.warn(`  ! key not in en.json: ${key}`);
    continue;
  }
  if (curVal !== undefined && curVal !== enVal) {
    skipped++; // already translated differently — keep existing
    continue;
  }
  setFlat(data, keys, value);
  applied++;
}

writeFileSync(locPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log(`[${locale}] applied=${applied} skipped(existing)=${skipped} missing-in-en=${missing}`);

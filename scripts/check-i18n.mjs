// scripts/check-i18n.mjs — diff message keys across all locale files vs en.json
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const dir = join(root, 'src', 'messages');

function flatten(obj, prefix = '') {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      Object.assign(out, flatten(v, key));
    } else {
      out[key] = v;
    }
  }
  return out;
}

const files = readdirSync(dir).filter((f) => f.endsWith('.json')).sort();
const en = flatten(JSON.parse(readFileSync(join(dir, 'en.json'), 'utf8')));
const enKeys = Object.keys(en);

for (const f of files) {
  if (f === 'en.json') continue;
  const locale = f.replace('.json', '');
  const data = JSON.parse(readFileSync(join(dir, f), 'utf8'));
  const flat = flatten(data);
  const missing = enKeys.filter((k) => !(k in flat));
  const extra = Object.keys(flat).filter((k) => !(k in en));
  if (missing.length || extra.length) {
    console.log(`\n[${locale}] missing: ${missing.length} extra: ${extra.length}`);
    if (missing.length) console.log('  missing:', missing.slice(0, 60).join(', '));
    if (extra.length) console.log('  extra:', extra.slice(0, 20).join(', '));
  }
}

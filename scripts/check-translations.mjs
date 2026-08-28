#!/usr/bin/env node
import { readFileSync } from 'fs';

const c = readFileSync('src/lib/seed/universities.ts', 'utf8');
const langs = ['en','tr','az','ru','de','fr','zh','ar','fa','tk','kk','ky','bg','ur','uz','sw','so','id'];

// Split by university entries
const parts = c.split(/\{[\s\n]+id:\s*'/);
const results = [];

for (let i = 1; i < parts.length; i++) {
  const part = parts[i];
  const slugMatch = part.match(/slug:\s*'([^']+)'/);
  if (!slugMatch) continue;
  const slug = slugMatch[1];

  // Find description: { ... }
  const descMatch = part.match(/description:\s*\{/);
  if (!descMatch) {
    results.push({ slug, found: 0, missing: [...langs] });
    continue;
  }

  const descStart = descMatch.index;
  let depth = 0, started = false, descEnd = descStart;
  for (let j = descStart; j < Math.min(descStart + 5000, part.length); j++) {
    if (part[j] === '{') { depth++; started = true; }
    if (part[j] === '}') { depth--; if (depth === 0) { descEnd = j; break; } }
  }

  const descBlock = part.substring(descStart, descEnd);
  const foundLangs = [];
  for (const l of langs) {
    const re = new RegExp("\\b" + l + ":\\s*[\"']");
    if (re.test(descBlock)) foundLangs.push(l);
  }

  results.push({ slug, found: foundLangs.length, missing: langs.filter(l => !foundLangs.includes(l)) });
}

const present = results.reduce((a, r) => a + r.found, 0);
const total = results.length * langs.length;
console.log('Universitet:', results.length, '| Dil:', langs.length, '| Umumi:', total);
console.log('Hazir olan:', present, '/', total, '(' + Math.round(present/total*100) + '%)');

const incomplete = results.filter(r => r.missing.length > 0);
const complete = results.filter(r => r.missing.length === 0);
console.log('\nTam olan:', complete.length + '/' + results.length);

if (incomplete.length > 0) {
  console.log('\nEksik olanlar:');
  incomplete.forEach(r => console.log('  ' + r.slug + ': ' + r.found + '/18 eksik: ' + r.missing.join(', ')));
} else {
  console.log('\n✅ Bütün universitetlərin bütün 18 dildə description-u var!');
}

import { readFileSync, writeFileSync } from 'fs';
import names from './translate-university-names.mjs';

const path = 'src/lib/seed/universities.ts';
let content = readFileSync(path, 'utf8');

let count = 0;
for (const [slug, nameMap] of Object.entries(names)) {
  // Match the name line: name: 'Some Name',
  const nameRegex = new RegExp(
    `(slug: '${slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}',[\\s\\S]*?\\n\\s*name: )'[^']+',`,
    'm'
  );
  
  const match = content.match(nameRegex);
  if (match) {
    const localizedName = `{\n${Object.entries(nameMap).map(([lang, val]) => `      ${lang}: '${val.replace(/'/g, "\\'")}',`).join('\n')}\n    }`;
    content = content.replace(nameRegex, `$1${localizedName},`);
    count++;
    console.log(`✅ ${slug} — ${Object.keys(nameMap).length} dillər`);
  } else {
    console.log(`❌ ${slug} — tapilmadi!`);
  }
}

writeFileSync(path, content);
console.log(`\nCəmi: ${count} universitet yeniləndi`);

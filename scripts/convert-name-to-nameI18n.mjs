import { readFileSync, writeFileSync } from 'fs';

const path = 'src/lib/seed/universities.ts';
let content = readFileSync(path, 'utf8');

// Split by university entries
const parts = content.split(/(id: 'u-)/);
let count = 0;
let result = parts[0]; // keep the header

for (let i = 1; i < parts.length; i += 2) {
  const id = parts[i];
  const body = parts[i + 1] || '';
  
  // Find name: { ... }, in this entry
  const nameMatch = body.match(/(\s*name: \{)((?:\s+\w+: '[^']*',?\s*\n?)+\s*\})/);
  
  if (nameMatch) {
    const block = nameMatch[2];
    const enMatch = block.match(/en: '([^']*)'/);
    
    if (enMatch) {
      const enName = enMatch[1];
      // Replace name: { ... }, with name: '...', nameI18n: { ... },
      const newBody = body.replace(
        nameMatch[0],
        `\n    name: '${enName}',\n    nameI18n: {${block.trim().replace(/^\{/, '').replace(/\}$/, '')}  }`
      );
      result += id + newBody;
      count++;
      continue;
    }
  }
  
  result += id + body;
}

writeFileSync(path, result);
console.log(`Düzəldi: ${count} universitet`);

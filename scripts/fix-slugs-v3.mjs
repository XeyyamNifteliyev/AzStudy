#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';

const filePath = 'src/lib/seed/universities.ts';
let content = readFileSync(filePath, 'utf8');

const langs = ['ar', 'fa', 'tk', 'kk', 'ky', 'bg', 'ur', 'uz', 'sw', 'so', 'id'];

// Parse all universities with their ranges and names
const uniStartRegex = /\{\s*\n\s*id:\s*'u-[^']+'/g;
let m;
const uniStarts = [];
while ((m = uniStartRegex.exec(content)) !== null) {
  uniStarts.push(m.index);
}

const universities = [];
for (let idx = 0; idx < uniStarts.length; idx++) {
  const start = uniStarts[idx];
  const nextStart = idx < uniStarts.length - 1 ? uniStarts[idx + 1] : content.length;
  
  const block = content.substring(start, nextStart);
  const slugMatch = block.match(/slug:\s*'([^']+)'/);
  if (!slugMatch) continue;
  
  const nameMatch = block.match(/nameI18n:\s*\{/);
  if (!nameMatch) continue;
  
  const nameStart = nameMatch.index;
  let depth = 0, i = nameStart, nameEnd = -1;
  while (i < block.length) {
    if (block[i] === '{') depth++;
    else if (block[i] === '}') { if (depth === 0) { nameEnd = i; break; } depth--; }
    i++;
  }
  if (nameEnd === -1) continue;
  
  const nameBlock = block.substring(nameStart, nameEnd + 1);
  const names = {};
  const nr = /(\w+):\s*'([^']*)'/g;
  let nm;
  while ((nm = nr.exec(nameBlock)) !== null) {
    names[nm[1]] = nm[2];
  }
  
  universities.push({ start, end: nextStart, slug: slugMatch[1], names });
}

console.log(`Parsed ${universities.length} universities`);

// Process line by line, tracking which university block we're in
const lines = content.split('\n');
let currentUniIdx = 0;
let charPos = 0;
let totalFixed = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Update charPos
  const lineStart = charPos;
  charPos += line.length + 1; // +1 for \n
  
  // Check if we've passed into a new university block
  while (currentUniIdx < universities.length - 1 && lineStart >= universities[currentUniIdx].end) {
    currentUniIdx++;
  }
  
  // Check if this line has a slug-named description
  const m = line.match(/^      (ar|fa|tk|kk|ky|bg|ur|uz|sw|so|id): '([a-z][a-z0-9-]+) /);
  if (m && currentUniIdx < universities.length) {
    const lang = m[1];
    const slug = m[2];
    const uni = universities[currentUniIdx];
    
    if (lineStart >= uni.start && lineStart < uni.end) {
      const name = uni.names[lang] || uni.names.en || uni.slug;
      const old = `'${slug} `;
      const new_ = `'${name} `;
      if (line.includes(old)) {
        lines[i] = line.replace(old, new_);
        totalFixed++;
      }
    }
  }
}

content = lines.join('\n');
console.log(`Fixed ${totalFixed} lines`);

const remaining = content.match(/^      (ar|fa|tk|kk|ky|bg|ur|uz|sw|so|id): '[a-z][a-z0-9-]+ /gm);
console.log(`Remaining: ${remaining ? remaining.length : 0}`);

writeFileSync(filePath, content, 'utf8');
console.log('Saved!');

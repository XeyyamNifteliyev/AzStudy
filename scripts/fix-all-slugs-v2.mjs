#!/usr/bin/env node
/**
 * Fix ALL slug-named descriptions.
 * Uses proper brace-matching without character limits.
 */
import { readFileSync, writeFileSync } from 'fs';

const filePath = 'src/lib/seed/universities.ts';
let content = readFileSync(filePath, 'utf8');

const langs = ['ar', 'fa', 'tk', 'kk', 'ky', 'bg', 'ur', 'uz', 'sw', 'so', 'id'];

// Step 1: Find all university start positions using { \n    id: 'u-xxx'
const uniStartRegex = /\{\s*\n\s*id:\s*'u-[^']+'/g;
let m;
const uniStarts = [];
while ((m = uniStartRegex.exec(content)) !== null) {
  uniStarts.push(m.index);
}
console.log(`Found ${uniStarts.length} university blocks`);

// Step 2: For each university, extract slug and nameI18n
const universities = [];
for (let idx = 0; idx < uniStarts.length; idx++) {
  const start = uniStarts[idx];
  const nextStart = idx < uniStarts.length - 1 ? uniStarts[idx + 1] : content.length;
  const block = content.substring(start, nextStart);
  
  // Extract slug
  const slugMatch = block.match(/slug:\s*'([^']+)'/);
  if (!slugMatch) continue;
  
  // Extract nameI18n
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
  const nameLangRegex = /(\w+):\s*'([^']*)'/g;
  let nm;
  while ((nm = nameLangRegex.exec(nameBlock)) !== null) {
    names[nm[1]] = nm[2];
  }
  
  universities.push({
    start,
    end: nextStart,
    slug: slugMatch[1],
    names,
  });
}

console.log(`Extracted ${universities.length} universities with names`);

// Step 3: Find and fix all slug-named description lines
const slugLineRegex = /^      (ar|fa|tk|kk|ky|bg|ur|uz|sw|so|id): '([a-z][a-z0-9-]+) /gm;
let totalFixed = 0;

let lineMatch;
const contentLines = content.split('\n');
const newLines = [];

for (let lineIdx = 0; lineIdx < contentLines.length; lineIdx++) {
  let line = contentLines[lineIdx];
  const linePos = content.indexOf(line, newLines.join('\n').length);
  
  const m = line.match(/^      (ar|fa|tk|kk|ky|bg|ur|uz|sw|so|id): '([a-z][a-z0-9-]+) /);
  if (m) {
    const lang = m[1];
    const slug = m[2];
    
    // Find which university this line belongs to
    let uni = null;
    for (const u of universities) {
      if (linePos >= u.start && linePos < u.end) {
        uni = u;
        break;
      }
    }
    
    if (uni) {
      const name = uni.names[lang] || uni.names.en || uni.slug;
      const newVal = `'${name} `;
      line = line.replace(`'${slug} `, newVal);
      totalFixed++;
    }
  }
  
  newLines.push(line);
}

content = newLines.join('\n');
console.log(`Fixed ${totalFixed} lines`);

// Verify
const remaining = content.match(/^      (ar|fa|tk|kk|ky|bg|ur|uz|sw|so|id): '[a-z][a-z0-9-]+ /gm);
console.log(`Remaining: ${remaining ? remaining.length : 0}`);

writeFileSync(filePath, content, 'utf8');
console.log('File saved!');

#!/usr/bin/env node
/**
 * Fix ALL remaining slug-named descriptions.
 * Works line-by-line: for each line matching /^      (lang): 'slug /,
 * finds the university's nameI18n and replaces the slug with the proper name.
 */
import { readFileSync, writeFileSync } from 'fs';

const filePath = 'src/lib/seed/universities.ts';
let content = readFileSync(filePath, 'utf8');

const langs = ['ar', 'fa', 'tk', 'kk', 'ky', 'bg', 'ur', 'uz', 'sw', 'so', 'id'];

// Build a map: for each position in the file, what university are we in?
// Parse universities from the file
const uniBlocks = [];
const idRegex = /\bid:\s*'u-[^']+'/g;
let m;
while ((m = idRegex.exec(content)) !== null) {
  const uniStart = m.index;
  
  // Find slug
  const slugMatch = content.substring(uniStart, uniStart + 2000).match(/slug:\s*'([^']+)'/);
  if (!slugMatch) continue;
  
  // Find nameI18n
  const nameMatch = content.substring(uniStart, uniStart + 2000).match(/nameI18n:\s*\{/);
  if (!nameMatch) continue;
  
  const nameStart = uniStart + nameMatch.index;
  let depth = 0, i = nameStart + 10, nameEnd = -1;
  while (i < content.length && i < nameStart + 3000) {
    if (content[i] === '{') depth++;
    else if (content[i] === '}') { if (depth === 0) { nameEnd = i; break; } depth--; }
    i++;
  }
  if (nameEnd === -1) continue;
  
  const nameBlock = content.substring(nameStart, nameEnd + 1);
  const names = {};
  const nameLangRegex = /(\w+):\s*'([^']*)'/g;
  let nm;
  while ((nm = nameLangRegex.exec(nameBlock)) !== null) {
    names[nm[1]] = nm[2];
  }
  
  uniBlocks.push({
    start: uniStart,
    end: nameEnd + 5000, // generous end
    slug: slugMatch[1],
    names,
  });
}

console.log(`Parsed ${uniBlocks.length} university blocks`);

// Find all slug-named description lines
const slugLineRegex = /^      (ar|fa|tk|kk|ky|bg|ur|uz|sw|so|id): '([a-z][a-z0-9-]+) /gm;
let totalFixed = 0;
const fixes = [];

let lineMatch;
while ((lineMatch = slugLineRegex.exec(content)) !== null) {
  const pos = lineMatch.index;
  const lang = lineMatch[1];
  const slug = lineMatch[2];
  
  // Find which university this line belongs to
  let uni = null;
  for (const u of uniBlocks) {
    if (pos >= u.start && pos < u.end) {
      uni = u;
      break;
    }
  }
  
  if (!uni) {
    // Search backwards
    for (let i = uniBlocks.length - 1; i >= 0; i--) {
      if (uniBlocks[i].start < pos) {
        uni = uniBlocks[i];
        break;
      }
    }
  }
  
  if (!uni) continue;
  
  // Get proper name for this language
  const name = uni.names[lang] || uni.names.en || uni.slug;
  
  // Get the full line
  const lineEnd = content.indexOf('\n', pos);
  const fullLine = content.substring(pos, lineEnd);
  
  // Replace the slug at the beginning of the value
  const oldVal = `'${slug} `;
  const newVal = `'${name} `;
  const newLine = fullLine.replace(oldVal, newVal);
  
  if (newLine !== fullLine) {
    fixes.push({ pos, old: fullLine.substring(0, 80), new: newLine.substring(0, 80) });
    content = content.substring(0, pos) + newLine + content.substring(lineEnd);
    totalFixed++;
  }
}

console.log(`Fixed ${totalFixed} lines`);

// Verify
const remaining = content.match(/^      (ar|fa|tk|kk|ky|bg|ur|uz|sw|so|id): '[a-z][a-z0-9-]+ /gm);
console.log(`Remaining slug-named descriptions: ${remaining ? remaining.length : 0}`);

if (remaining && remaining.length > 0) {
  console.log('Sample remaining:', remaining.slice(0, 5));
}

// Brace check
let braces = 0;
for (const c of content) {
  if (c === '{') braces++;
  else if (c === '}') braces--;
}
console.log(`Brace balance: ${braces === 0 ? 'OK ✓' : 'ERROR (' + braces + ')'}`);

writeFileSync(filePath, content, 'utf8');
console.log('File saved!');

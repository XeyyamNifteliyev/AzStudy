#!/usr/bin/env node
/**
 * Clean approach:
 * 1. Read the file
 * 2. For each university block (between { id: 'u-xxx' blocks)
 * 3. For each description entry, if it starts with a slug, replace with proper name
 * 4. Remove any duplicated text within each description
 */
import { readFileSync, writeFileSync } from 'fs';

const filePath = 'src/lib/seed/universities.ts';
let content = readFileSync(filePath, 'utf8');

// Find all university blocks using the pattern:  {\n    id: 'u-xxx'
const blockStarts = [];
const regex = /\{\s*\n\s*id:\s*'u-[^']+'/g;
let m;
while ((m = regex.exec(content)) !== null) {
  blockStarts.push(m.index);
}

console.log(`Found ${blockStarts.length} university blocks`);

let totalFixed = 0;
let totalDeduped = 0;

for (let b = 0; b < blockStarts.length; b++) {
  const start = blockStarts[b];
  const end = b < blockStarts.length - 1 ? blockStarts[b + 1] : content.length;
  
  // Extract slug
  const block = content.substring(start, end);
  const slugMatch = block.match(/slug:\s*'([^']+)'/);
  if (!slugMatch) continue;
  const slug = slugMatch[1];
  
  // Extract nameI18n
  const niMatch = block.match(/nameI18n:\s*\{([\s\S]*?)\n    \}/);
  if (!niMatch) continue;
  
  const names = {};
  const nr = /(\w+):\s*'([^']*)'/g;
  let nm;
  while ((nm = nr.exec(niMatch[1])) !== null) {
    names[nm[1]] = nm[2];
  }
  
  // For each language in description, fix slug names and deduplicate
  const descLangs = ['ar', 'fa', 'tk', 'kk', 'ky', 'bg', 'ur', 'uz', 'sw', 'so', 'id'];
  
  for (const lang of descLangs) {
    // Find the description line for this language
    // Pattern: lang: 'something...'
    const langRegex = new RegExp(`(${lang}:\\s*')((?:[^'\\\\]|\\\\.)*?)(')`, 'g');
    let langMatch;
    
    while ((langMatch = langRegex.exec(block)) !== null) {
      const fullMatch = langMatch[0];
      const prefix = langMatch[1];
      let value = langMatch[2];
      const suffix = langMatch[3];
      
      // Check if value starts with slug
      if (value.startsWith(slug + ' ')) {
        // Replace slug with proper name
        const name = names[lang] || names.en || slug;
        value = name + value.substring(slug.length);
        totalFixed++;
      }
      
      // Deduplicate: if value contains repeated text
      // Split by sentence-ending periods and check for duplicates
      const sentences = value.split(/(?<=\.)\s*/);
      const unique = [];
      const seen = new Set();
      for (const s of sentences) {
        const trimmed = s.trim();
        if (trimmed && !seen.has(trimmed)) {
          seen.add(trimmed);
          unique.push(s);
        }
      }
      if (unique.length < sentences.length) {
        value = unique.join(' ');
        totalDeduped++;
      }
      
      const newValue = prefix + value + suffix;
      if (newValue !== fullMatch) {
        content = content.substring(0, start + langMatch.index) + newValue + content.substring(start + langMatch.index + fullMatch.length);
        // Re-adjust regex index since we changed the string
        langRegex.lastIndex += (newValue.length - fullMatch.length);
      }
    }
  }
}

console.log(`Fixed ${totalFixed} slug names`);
console.log(`Deduplicated ${totalDeduped} entries`);

// Verify
const remaining = content.match(/^      (ar|fa|tk|kk|ky|bg|ur|uz|sw|so|id): '[a-z][a-z0-9-]+ /gm);
console.log(`Remaining slug-named: ${remaining ? remaining.length : 0}`);

// Check for duplicated text
const dupCheck = content.match(/(\. [A-Z][^.]{20,})\1/g);
console.log(`Duplicate sentences found: ${dupCheck ? dupCheck.length : 0}`);

writeFileSync(filePath, content, 'utf8');
console.log('Saved!');

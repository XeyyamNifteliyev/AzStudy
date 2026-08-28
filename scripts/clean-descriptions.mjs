#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';

const filePath = 'src/lib/seed/universities.ts';
let content = readFileSync(filePath, 'utf8');

// Split into lines
const lines = content.split('\n');

// Build a map of university blocks: for each line index, which university are we in?
// Strategy: track current university by looking for slug: 'xxx' lines, 
// and nameI18n blocks

let currentSlug = null;
let currentNames = {};
let inNameI18n = false;
let nameI18nDepth = 0;

const universityMap = new Map(); // lineIdx -> {slug, names}

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Track slug
  const slugMatch = line.match(/^\s+slug:\s*'([^']+)'/);
  if (slugMatch) {
    currentSlug = slugMatch[1];
  }
  
  // Track nameI18n
  if (line.includes('nameI18n: {')) {
    inNameI18n = true;
    nameI18nDepth = 0;
    currentNames = {};
  }
  
  if (inNameI18n) {
    // Count braces
    for (const ch of line) {
      if (ch === '{') nameI18nDepth++;
      else if (ch === '}') nameI18nDepth--;
    }
    
    // Parse lang entries
    const langMatch = line.match(/(\w+):\s*'([^']*)'/);
    if (langMatch && nameI18nDepth >= 1) {
      currentNames[langMatch[1]] = langMatch[2];
    }
    
    if (nameI18nDepth <= 0) {
      inNameI18n = false;
    }
  }
  
  // Store university info for this line
  if (currentSlug) {
    universityMap.set(i, { slug: currentSlug, names: { ...currentNames } });
  }
}

console.log(`Mapped ${universityMap.size} lines to universities`);

// Now fix slug-named description lines
const descLangs = ['ar', 'fa', 'tk', 'kk', 'ky', 'bg', 'ur', 'uz', 'sw', 'so', 'id'];
let totalFixed = 0;
let totalDeduped = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  for (const lang of descLangs) {
    // Match: lang: 'SLUG rest of text',
    const regex = new RegExp(`^      ${lang}: '([a-z][a-z0-9-]+) (.*)'`);
    const m = line.match(regex);
    if (!m) continue;
    
    const slug = m[1];
    const rest = m[2];
    
    // Get proper name
    const uniInfo = universityMap.get(i);
    if (!uniInfo) continue;
    
    const name = uniInfo.names[lang] || uniInfo.names.en || uniInfo.slug;
    
    // Deduplicate: if rest contains the same sentence repeated
    let cleanRest = rest;
    const sentences = rest.split(/(?<=\.)\s*/);
    if (sentences.length > 1) {
      const unique = [];
      const seen = new Set();
      for (const s of sentences) {
        const key = s.trim().toLowerCase();
        if (key && !seen.has(key)) {
          seen.add(key);
          unique.push(s);
        }
      }
      if (unique.length < sentences.length) {
        cleanRest = unique.join(' ');
        totalDeduped++;
      }
    }
    
    // Replace slug with name
    const newLine = `      ${lang}: '${name} ${cleanRest}'`;
    if (newLine !== line) {
      lines[i] = newLine;
      totalFixed++;
    }
  }
  
  // Also fix lines in en/tr/az/ru/de/fr/zh that might have slugs
  for (const lang of ['en', 'tr', 'az', 'ru', 'de', 'fr', 'zh']) {
    const regex = new RegExp(`^      ${lang}: '([a-z][a-z0-9-]+) (.*)'`);
    const m = lines[i].match(regex);
    if (m && m[1].includes('-')) {
      const uniInfo = universityMap.get(i);
      if (uniInfo) {
        const name = uniInfo.names[lang] || uniInfo.names.en || m[1];
        lines[i] = lines[i].replace(`'${m[1]} `, `'${name} `);
        totalFixed++;
      }
    }
  }
}

content = lines.join('\n');
console.log(`Fixed ${totalFixed} slug names`);
console.log(`Deduplicated ${totalDeduped} entries`);

// Final verify
const remaining = content.match(/^      (ar|fa|tk|kk|ky|bg|ur|uz|sw|so|id): '[a-z][a-z0-9-]+ /gm);
console.log(`Remaining slug-named: ${remaining ? remaining.length : 0}`);

writeFileSync(filePath, content, 'utf8');
console.log('Saved!');

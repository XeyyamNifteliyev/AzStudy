#!/usr/bin/env node
/**
 * Fix ALL unescaped apostrophes in university seed data strings.
 * Handles en/tr/az/ru/de/fr/zh and any other language lines.
 */
import { readFileSync, writeFileSync } from 'fs';

const filePath = 'src/lib/seed/universities.ts';
const content = readFileSync(filePath, 'utf8');
const lines = content.split('\n');
let fixCount = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Match any language line:       xx: '...',
  const m = line.match(/^(\s+)([a-z]{2}): '(.*)',?\s*$/);
  if (!m) continue;
  
  const [, indent, lang, rawValue] = m;
  
  // Check for unescaped apostrophes
  let hasUnescaped = false;
  for (let j = 0; j < rawValue.length; j++) {
    if (rawValue[j] === "'" && (j === 0 || rawValue[j - 1] !== '\\')) {
      hasUnescaped = true;
      break;
    }
  }
  
  if (!hasUnescaped) continue;
  
  // Escape all unescaped apostrophes
  let fixed = '';
  for (let j = 0; j < rawValue.length; j++) {
    if (rawValue[j] === "'" && (j === 0 || rawValue[j - 1] !== '\\')) {
      fixed += "\\'";
    } else {
      fixed += rawValue[j];
    }
  }
  
  lines[i] = indent + lang + ": '" + fixed + "',";
  fixCount++;
}

if (fixCount > 0) {
  writeFileSync(filePath, lines.join('\n'), 'utf8');
  console.log('Fixed ' + fixCount + ' lines');
} else {
  console.log('No unescaped apostrophes found');
}

#!/usr/bin/env node
/**
 * Fix unescaped apostrophes in university descriptions.
 * A properly escaped apostrophe in JS source is \' (two chars: backslash + quote).
 * An unescaped one is just ' (one char).
 * 
 * Strategy: For each de:/fr:/zh: line, find the string value and escape
 * any ' that is NOT preceded by \.
 */
import { readFileSync, writeFileSync } from 'fs';

const filePath = 'src/lib/seed/universities.ts';
const content = readFileSync(filePath, 'utf8');
const lines = content.split('\n');
let fixCount = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Match lines like:       de: '...',  or       fr: '...'
  const m = line.match(/^(\s+)(de|fr|zh): '(.*)',?\s*$/);
  if (!m) continue;
  
  const [, indent, lang, rawValue] = m;
  
  // Check if value has any unescaped apostrophes
  // An escaped apostrophe in the file is \' (backslash + quote)
  // An unescaped one is just '
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
  console.log('Fixed ' + fixCount + ' lines with unescaped apostrophes');
} else {
  console.log('No unescaped apostrophes found');
}

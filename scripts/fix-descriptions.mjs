#!/usr/bin/env node
/**
 * Fix apostrophes in university descriptions that broke JS single-quote strings.
 * Also ensure all de/fr/zh/ar entries use escaped quotes.
 */
import { readFileSync, writeFileSync } from 'fs';

const filePath = 'src/lib/seed/universities.ts';
let content = readFileSync(filePath, 'utf8');

// Fix all de: '...' fr: '...' zh: '...' lines that contain unescaped apostrophes
// Pattern: de: '...contains'...wrong...' → de: '...contains\'...wrong\'...'
// We need to find lines like `      de: 'L'Université...` and escape the inner quotes

const lines = content.split('\n');
let fixCount = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  // Match lines like: `      de: '...'` or `      fr: '...'` or `      zh: '...'`
  const match = line.match(/^(\s+)(de|fr|zh|ru): '(.*?)',?\s*$/);
  if (match) {
    const [, indent, lang, value] = match;
    // Check if value contains unescaped apostrophes that would break the string
    // The value is what's between the outer quotes
    if (value.includes("'") && !value.includes("\\'")) {
      // Escape internal apostrophes
      const fixed = value.replace(/(?<!\\)'/g, "\\'");
      lines[i] = `${indent}${lang}: '${fixed}',`;
      fixCount++;
    }
  }
}

if (fixCount > 0) {
  content = lines.join('\n');
  writeFileSync(filePath, content, 'utf8');
  console.log(`Fixed ${fixCount} lines with unescaped apostrophes.`);
} else {
  console.log('No apostrophe fixes needed.');
}

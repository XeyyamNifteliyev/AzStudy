#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';

const filePath = 'src/lib/seed/universities.ts';
let content = readFileSync(filePath, 'utf8');

// Strategy: find lines matching de:/fr:/zh: '...' and fix apostrophes
const lines = content.split('\n');
let fixCount = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  // Match de:/fr:/zh:/ru: lines with single-quoted values
  const m = line.match(/^(\s+)(de|fr|zh|ru): '(.*)',?\s*$/);
  if (!m) continue;

  const [, indent, lang, value] = m;

  // Check for unescaped apostrophes by counting
  // An apostrophe at position 0 that's part of L' is broken
  // Count all apostrophes in value
  let count = 0;
  for (const ch of value) {
    if (ch === "'") count++;
  }

  if (count % 2 === 1) {
    // Odd number = broken string. Escape every apostrophe.
    const fixed = value.split("'").join("\\'");
    lines[i] = indent + lang + ": '" + fixed + "',";
    fixCount++;
  }
}

if (fixCount > 0) {
  writeFileSync(filePath, lines.join('\n'), 'utf8');
  console.log("Fixed " + fixCount + " lines with unescaped apostrophes");
} else {
  console.log("No broken lines found");
}

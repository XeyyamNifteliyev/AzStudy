#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';

const filePath = 'src/lib/seed/blog.ts';
let content = readFileSync(filePath, 'utf8');

// The problem: we added lines like:
//   de: "Multi-line text
// with newlines",
// But double-quoted strings can't have literal newlines in JS/TS.
// We need to either escape them or use backticks.

// Strategy: Find all the broken content entries (they start with "de: "Multi..." and have literal newlines)
// and convert them to use escaped \n

const lines = content.split('\n');
let result = [];
let inBrokenString = false;
let brokenStringContent = '';
let brokenLang = '';

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const trimmed = line.trim();

  if (!inBrokenString) {
    // Check if this line starts a broken string (de/fr/zh etc with opening " but no closing ")
    const match = trimmed.match(/^(de|fr|zh|ar|fa|tk|kk|ky|bg|ur|uz|sw|so|id): "(.+)$/);
    if (match && !match[2].endsWith('",') && !match[2].endsWith('"')) {
      // This is a broken string - start collecting
      inBrokenString = true;
      brokenLang = match[1];
      brokenStringContent = match[2];
    } else {
      result.push(line);
    }
  } else {
    // We're inside a broken string - collect until we find the closing "
    if (trimmed.endsWith('",') || trimmed === '},') {
      // End of broken string
      if (trimmed.endsWith('",')) {
        brokenStringContent += '\\n' + trimmed.slice(0, -2);
        result.push('      ' + brokenLang + ': "' + brokenStringContent + '",');
      } else {
        // This is the closing }, the broken string was missing its closing
        result.push('      ' + brokenLang + ': "' + brokenStringContent + '",');
        result.push(line);
      }
      inBrokenString = false;
      brokenStringContent = '';
      brokenLang = '';
    } else {
      brokenStringContent += '\\n' + trimmed;
    }
  }
}

writeFileSync(filePath, result.join('\n'), 'utf8');
console.log('Fixed broken content strings');

#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';

const filePath = 'src/lib/seed/universities.ts';
let content = readFileSync(filePath, 'utf8');

// Fix double-escaped: \\\\' → \\' (four backslashes + quote → one backslash + quote)
// In the file: \\\\' means the JS source has literal \\' which is wrong
// We want: \' which is the correct JS escape
const before = content;
content = content.replace(/\\\\'/g, "\\'");

// Also fix triple-escaped if any
content = content.replace(/\\\\\\'/g, "\\'");

const changes = before !== content;
if (changes) {
  writeFileSync(filePath, content, 'utf8');
  console.log("Fixed double-escaped apostrophes");
} else {
  console.log("No double-escapes found");
}

import { readFileSync, writeFileSync } from 'fs';

const path = 'src/lib/seed/universities.ts';
let content = readFileSync(path, 'utf8');

// Find all lines matching:  lang: 'some value with ' inside',
// The trick: match from the opening quote to the LAST quote before the comma
const regex = /^(\s*\w+: ')(.*)(',?)$/;

const lines = content.split('\n');
let fixed = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const m = line.match(regex);
  if (m) {
    const prefix = m[1]; // "      fr: '"
    let value = m[2];    // everything between first and last quote
    const suffix = m[3]; // ","
    
    // Check if the value itself contains unescaped apostrophes
    // (not preceded by a backslash)
    const needsFix = /(?<!\\)'/;
    if (needsFix.test(value)) {
      value = value.replace(/(?<!\\)'/g, "\\'");
      lines[i] = prefix + value + suffix;
      fixed++;
    }
  }
}

content = lines.join('\n');
writeFileSync(path, content);
console.log(`Düzəldi: ${fixed} satır`);

#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';

const filePath = 'src/lib/seed/universities.ts';
let content = readFileSync(filePath, 'utf8');

// Pattern: after a language line like "      id: '...'," the next line should be "    },\n  },\n  {"
// But currently it's "  },\n  {" (missing the university closing brace)
// Fix: replace "      id: '...',\n  },\n  {" with "      id: '...',\n    },\n  },\n  {"

content = content.replace(
  /(\s{6}id:\s*'[^']+',)\n  \},\n  \{/g,
  '$1\n    },\n  },\n  {'
);

writeFileSync(filePath, content, 'utf8');
console.log('Fixed missing closing braces');

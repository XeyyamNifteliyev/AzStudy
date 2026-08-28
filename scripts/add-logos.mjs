#!/usr/bin/env node
/**
 * Add logoImage field to every university in universities.ts
 */
import { readFileSync, writeFileSync } from 'fs';

const path = 'src/lib/seed/universities.ts';
let content = readFileSync(path, 'utf8');

// Find all heroImage lines and add logoImage after each one
const lines = content.split('\n');
const newLines = [];
let currentSlug = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Track current slug
  const slugMatch = line.match(/slug: '([^']+)'/);
  if (slugMatch) {
    currentSlug = slugMatch[1];
  }
  
  newLines.push(line);
  
  // After heroImage line, add logoImage
  if (line.trim().startsWith('heroImage:') && currentSlug) {
    // Find the indentation
    const indent = line.match(/^(\s*)/)[1];
    newLines.push(`${indent}logoImage: universityLogoImages['${currentSlug}'] || universityHero('${currentSlug}'),`);
  }
}

writeFileSync(path, newLines.join('\n'));
console.log('Done! Added logoImage to all universities');

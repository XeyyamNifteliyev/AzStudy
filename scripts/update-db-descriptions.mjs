#!/usr/bin/env node
/**
 * Update Supabase database description_i18n for all universities.
 * Reads from universities.ts seed file and updates the database.
 */
import { readFileSync } from 'fs';
import pg from 'pg';

// Read DATABASE_URL
const env = readFileSync('.env.local', 'utf8');
const dbMatch = env.match(/DATABASE_URL=(.+)/);
if (!dbMatch) { console.error('No DATABASE_URL'); process.exit(1); }
const dbUrl = dbMatch[1].trim();

const pool = new pg.Pool({ connectionString: dbUrl });

// Read universities.ts to extract descriptions
const tsContent = readFileSync('src/lib/seed/universities.ts', 'utf8');

// Parse all university blocks
const uniStartRegex = /\{\s*\n\s*id:\s*'u-[^']+'/g;
let m;
const starts = [];
while ((m = uniStartRegex.exec(tsContent)) !== null) starts.push(m.index);

const universities = [];

for (let b = 0; b < starts.length; b++) {
  const start = starts[b];
  const end = b < starts.length - 1 ? starts[b + 1] : tsContent.length;
  const block = tsContent.substring(start, end);
  
  // Extract slug
  const slugMatch = block.match(/slug:\s*'([^']+)'/);
  if (!slugMatch) continue;
  const slug = slugMatch[1];
  
  // Extract description block
  const descStart = block.indexOf('description: {');
  if (descStart === -1) continue;
  
  let depth = 0, i = descStart + 13, descEnd = -1;
  while (i < block.length) {
    if (block[i] === '{') depth++;
    else if (block[i] === '}') { if (depth === 0) { descEnd = i; break; } depth--; }
    i++;
  }
  if (descEnd === -1) continue;
  
  const descBlock = block.substring(descStart + 13, descEnd);
  
  // Extract all language descriptions
  const descriptions = {};
  const allLangs = ['en', 'tr', 'az', 'ru', 'de', 'fr', 'zh', 'ar', 'fa', 'tk', 'kk', 'ky', 'bg', 'ur', 'uz', 'sw', 'so', 'id'];
  
  for (const lang of allLangs) {
    const langRegex = new RegExp(`${lang}:\\s*'((?:[^'\\\\]|\\\\.)*?)'`);
    const langMatch = descBlock.match(langRegex);
    if (langMatch) {
      // Unescape any unicode escapes
      let val = langMatch[1];
      val = val.replace(/\\u([0-9a-fA-F]{4})/g, (_, code) => String.fromCharCode(parseInt(code, 16)));
      descriptions[lang] = val;
    }
  }
  
  universities.push({ slug, descriptions });
}

console.log(`Parsed ${universities.length} universities from seed file`);

// Update each university in the database
let updated = 0;
let errors = 0;

for (const uni of universities) {
  try {
    // Get current description_i18n
    const result = await pool.query(
      'SELECT description_i18n FROM universities WHERE slug = $1',
      [uni.slug]
    );
    
    if (result.rows.length === 0) {
      console.log(`  SKIP: ${uni.slug} (not found in DB)`);
      continue;
    }
    
    const currentDesc = result.rows[0].description_i18n || {};
    
    // Merge: keep existing, add new from seed file
    const newDesc = { ...currentDesc };
    let changed = false;
    
    for (const [lang, desc] of Object.entries(uni.descriptions)) {
      if (!newDesc[lang] || newDesc[lang] !== desc) {
        newDesc[lang] = desc;
        changed = true;
      }
    }
    
    if (changed) {
      await pool.query(
        'UPDATE universities SET description_i18n = $1 WHERE slug = $2',
        [JSON.stringify(newDesc), uni.slug]
      );
      updated++;
      const newLangs = Object.keys(newDesc).join(', ');
      console.log(`  UPDATED: ${uni.slug} (${newLangs})`);
    } else {
      console.log(`  OK: ${uni.slug} (no changes)`);
    }
  } catch (e) {
    errors++;
    console.error(`  ERROR: ${uni.slug}: ${e.message}`);
  }
}

console.log(`\nDone: ${updated} updated, ${errors} errors`);
await pool.end();

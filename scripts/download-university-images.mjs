#!/usr/bin/env node
/**
 * Download university logos and hero images from official websites.
 * Tries common logo paths, falls back to favicon, then generates placeholder.
 */

import { execSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const UNIS = [
  // [slug, logoUrl, websiteUrl]
  ['baku-state-university', 'https://bsu.edu.az/application/themes/bsu/images/logo.png', 'https://bsu.edu.az/'],
  ['azerbaijan-diplomatic-academy', 'https://www.ada.edu.az/images/ada-logo.svg', 'https://www.ada.edu.az/'],
  ['azerbaijan-university-architecture-construction', 'https://azmiu.edu.az/images/logo.png', 'https://azmiu.edu.az/'],
  ['azerbaijan-aviation-university', 'https://naa.edu.az/images/logo.png', 'https://naa.edu.az/'],
  ['sumqayit-state-university', 'https://sdu.edu.az/images/logo.png', 'https://sdu.edu.az/'],
  ['gance-state-university', 'https://gdu.edu.az/images/logo.png', 'https://gdu.edu.az/'],
  ['gance-state-technological-university', 'https://atu.edu.az/images/logo.png', 'https://atu.edu.az/'],
  ['naxcivan-medical-university', 'https://ndu.edu.az/images/logo.png', 'https://ndu.edu.az/'],
  ['azerbaijan-medical-university', 'https://amu.edu.az/images/logo.png', 'https://amu.edu.az/'],
  ['azerbaijan-state-university-economics', 'https://unec.edu.az/images/logo.png', 'https://unec.edu.az/'],
  ['western-university', 'https://wcu.edu.az/images/logo.png', 'https://wcu.edu.az/'],
  ['khazar-university', 'https://khazar.org/images/logo.png', 'https://khazar.org/'],
  ['baku-engineering-university', 'https://beu.edu.az/images/logo.png', 'https://beu.edu.az/'],
  ['azerbaijan-state-pedagogical-university', 'https://adpu.edu.az/images/logo.png', 'https://adpu.edu.az/'],
  ['lankaran-state-university', 'https://lsu.edu.az/images/logo.png', 'https://lsu.edu.az/'],
  ['mingachevir-state-university', 'https://mdu.edu.az/images/logo.png', 'https://mdu.edu.az/'],
];

const LOGO_DIR = join(process.cwd(), 'public/images/universities/logos');
mkdirSync(LOGO_DIR, { recursive: true });

function tryDownload(url, dest) {
  const paths = [
    url,
    url.replace('/images/', '/wp-content/uploads/'),
    url.replace('logo.png', 'logo.jpg'),
    url.replace('logo.png', 'favicon.png'),
  ];
  
  for (const p of paths) {
    try {
      execSync(`curl -sL --connect-timeout 5 --max-time 10 -o "${dest}" "${p}"`, { stdio: 'pipe' });
      const stat = require('fs').statSync(dest);
      if (stat.size > 500) {
        console.log(`  ✅ Downloaded (${stat.size} bytes): ${p}`);
        return true;
      }
    } catch {}
  }
  return false;
}

let success = 0;
let failed = 0;

for (const [slug, logoUrl, websiteUrl] of UNIS) {
  const dest = join(LOGO_DIR, `${slug}-logo.png`);
  
  if (existsSync(dest)) {
    console.log(`⏭️  ${slug}: already exists`);
    success++;
    continue;
  }
  
  console.log(`📥 ${slug}: trying logo from ${websiteUrl}`);
  if (tryDownload(logoUrl, dest)) {
    success++;
  } else {
    // Try favicon as last resort
    try {
      execSync(`curl -sL --connect-timeout 5 --max-time 10 -o "${dest}" "${new URL('/favicon.ico', websiteUrl).href}"`, { stdio: 'pipe' });
      const stat = require('fs').statSync(dest);
      if (stat.size > 100) {
        console.log(`  ✅ Downloaded favicon (${stat.size} bytes)`);
        success++;
      } else {
        throw new Error('too small');
      }
    } catch {
      console.log(`  ❌ Failed to download logo`);
      failed++;
    }
  }
}

console.log(`\n📊 Results: ${success} success, ${failed} failed out of ${UNIS.length}`);

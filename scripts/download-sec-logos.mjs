// Download all university logos from sec.az
import { writeFileSync } from 'fs';
import { join } from 'path';

const BASE = 'https://sec.az/uni-logos';
const LOGO_DIR = 'public/images/universities/logos';

// Mapping: sec.az abbreviation → our slug
const logoMap = {
  'ada': 'azerbaijan-diplomatic-academy',
  'adu': 'azerbaijan-university-languages',
  'adau': 'azerbaijan-state-agricultural-university',
  'adbtia': 'azerbaijan-state-sports-academy',
  'adda': 'azerbaijan-state-maritime-academy',
  'adiu': 'azerbaijan-state-university-economics',
  'admiu': 'azerbaijan-state-culture-arts-university',
  'adnsu': 'azerbaijan-state-oil-industry-university',
  'adpu': 'azerbaijan-state-pedagogical-university',
  'adra': 'azerbaijan-state-academy-arts',
  'aii': 'azerbaijan-institute-theology',
  'aku': 'azerbaijan-cooperative-university',
  'azmiu': 'azerbaijan-university-architecture-construction',
  'amk': 'azerbaijan-national-conservatory',
  'aztu': 'azerbaijan-technical-university',
  'aztexu': 'gance-state-technological-university',
  'atu': 'azerbaijan-medical-university',
  'atmu': 'azerbaijan-tourism-management-university',
  'au': 'azerbaijan-university',
  'banm': 'baku-higher-oil-school',
  'bau': 'baku-eurasian-university',
  'bbu': 'baku-business-university',
  'bdu': 'baku-state-university',
  'bmu': 'baku-engineering-university',
  'bsu': 'baku-slavyan-university',
  'bxa': 'baku-choreography-academy',
  'asma': 'azerbaijan-academy-labor-social-relations',
  'gdu': 'gance-state-university',
  'ldu': 'lankaran-state-university',
  'maa': 'national-aviation-academy',
  'mdu': 'mingachevir-state-university',
  'ndu': 'naxchivan-state-university',
  'nmi': 'naxchivan-mteachers-institute',
  'oyu': 'odlar-yurdu-university',
  'dia': 'presidential-academy-state-governance',
  'qu': 'qarabagh-university',
  'qku': 'western-caspian-university',
  'sdu': 'sumqayit-state-university',
  'tau': 'turkey-azerbaijan-university',
  'bma': 'baku-music-academy',
  'khazar': 'khazar-university',
  'sechenov': 'sechenov-first-moscow-medical-baku',
  'mdu_baku': 'lomonosov-moscow-state-university-baku',
};

async function downloadLogo(abbr, slug) {
  const url = `${BASE}/${abbr}.png`;
  const outPath = join(LOGO_DIR, `${slug}-logo.png`);
  
  try {
    const resp = await fetch(url);
    if (!resp.ok) {
      console.log(`❌ ${abbr} → ${slug}: HTTP ${resp.status}`);
      return false;
    }
    const buf = Buffer.from(await resp.arrayBuffer());
    if (buf.length < 100) {
      console.log(`❌ ${abbr} → ${slug}: Too small (${buf.length} bytes)`);
      return false;
    }
    writeFileSync(outPath, buf);
    console.log(`✅ ${abbr} → ${slug}: ${buf.length} bytes`);
    return true;
  } catch (e) {
    console.log(`❌ ${abbr} → ${slug}: ${e.message}`);
    return false;
  }
}

let success = 0;
let fail = 0;

for (const [abbr, slug] of Object.entries(logoMap)) {
  const ok = await downloadLogo(abbr, slug);
  if (ok) success++;
  else fail++;
}

console.log(`\nDone: ${success} downloaded, ${fail} failed`);

#!/usr/bin/env node
/**
 * REBUILD: Parse every university block using brace-matching.
 * Keep en/tr/az/ru/de/fr/zh descriptions as-is.
 * Regenerate ar/fa/tk/kk/ky/bg/ur/uz/sw/so/id descriptions from scratch.
 */
import { readFileSync, writeFileSync } from 'fs';

const filePath = 'src/lib/seed/universities.ts';
const content = readFileSync(filePath, 'utf8');

// Step 1: Find all university block boundaries
const uniStartRegex = /\{\s*\n\s*id:\s*'u-[^']+'/g;
let m;
const starts = [];
while ((m = uniStartRegex.exec(content)) !== null) {
  starts.push(m.index);
}

// Step 2: For each block, extract everything and rebuild descriptions
const universityData = [];

for (let b = 0; b < starts.length; b++) {
  const start = starts[b];
  const end = b < starts.length - 1 ? starts[b + 1] : content.length;
  const rawBlock = content.substring(start, end);
  
  // Extract slug
  const slugMatch = rawBlock.match(/slug:\s*'([^']+)'/);
  if (!slugMatch) continue;
  const slug = slugMatch[1];
  
  // Extract nameI18n properly using brace matching
  const nameI18nStart = rawBlock.indexOf('nameI18n: {');
  if (nameI18nStart === -1) continue;
  
  let depth = 0, i = nameI18nStart + 10, nameI18nEnd = -1;
  while (i < rawBlock.length) {
    if (rawBlock[i] === '{') depth++;
    else if (rawBlock[i] === '}') { if (depth === 0) { nameI18nEnd = i; break; } depth--; }
    i++;
  }
  if (nameI18nEnd === -1) continue;
  
  const nameI18nStr = rawBlock.substring(nameI18nStart, nameI18nEnd + 1);
  const names = {};
  const nr = /(\w+):\s*'([^']*)'/g;
  let nm;
  while ((nm = nr.exec(nameI18nStr)) !== null) {
    names[nm[1]] = nm[2];
  }
  
  // Extract description block
  const descSearchStart = nameI18nEnd;
  const descStart = rawBlock.indexOf('description: {', descSearchStart);
  if (descStart === -1) continue;
  
  depth = 0;
  i = descStart + 13;
  let descEnd = -1;
  while (i < rawBlock.length) {
    if (rawBlock[i] === '{') depth++;
    else if (rawBlock[i] === '}') { if (depth === 0) { descEnd = i; break; } depth--; }
    i++;
  }
  if (descEnd === -1) continue;
  
  const descStr = rawBlock.substring(descStart, descEnd + 1);
  
  // Extract KEEP descriptions (en/tr/az/ru/de/fr/zh) - take first occurrence only
  const keepLangs = ['en', 'tr', 'az', 'ru', 'de', 'fr', 'zh'];
  const keepDescs = {};
  
  for (const lang of keepLangs) {
    const langRegex = new RegExp(`${lang}:\\s*'((?:[^'\\\\]|\\\\.)*?)'`);
    const langMatch = descStr.match(langRegex);
    if (langMatch) {
      keepDescs[lang] = langMatch[1];
    }
  }
  
  // Get EN description for reference
  const enDesc = keepDescs.en || '';
  
  // Store for later
  universityData.push({ slug, names, keepDescs, enDesc });
}

console.log(`Parsed ${universityData.length} universities`);

// Step 3: Generate descriptions for missing languages
function generateDesc(name, enDesc, lang) {
  const yearMatch = enDesc.match(/founded in (\d{4})|Established in (\d{4})|founded (\d{4})/i);
  const year = yearMatch ? (yearMatch[1] || yearMatch[2] || yearMatch[3]) : null;
  
  const templates = {
    ar: (n, y) => y 
      ? `جامعة ${n} هي جامعة رائدة في أذربيجان، تأسست عام ${y}.` 
      : `جامعة ${n} هي جامعة رائدة في أذربيجان.`,
    fa: (n, y) => y 
      ? `دانشگاه ${n} یک دانشگاه پیشرو در آذربایجان است که در سال ${y} تأسیس شده است.` 
      : `دانشگاه ${n} یک دانشگاه پیشرو در آذربایجان است.`,
    tk: (n, y) => y 
      ? `${n} ${y}-njýyl döredilen Azerbaýjanýň öndebaryjy uniwersitetidir.` 
      : `${n} Azerbaýjanýň öndebaryjy uniwersitetleriniň biridir.`,
    kk: (n, y) => y 
      ? `${n} ${y} жылы құрылған Азербайджанның жетекші университеті.` 
      : `${n} — Азербайджанның жетекші университеті.`,
    ky: (n, y) => y 
      ? `${n} ${y}-жылы түзүлгөн Азербайджандын жетекчи университети.` 
      : `${n} — Азербайджандын жетекчи университети.`,
    bg: (n, y) => y 
      ? `${n} е водещ университет в Азербайджан, основан през ${y} г.` 
      : `${n} е водещ университет в Азербайджан.`,
    ur: (n, y) => y 
      ? `${n} آذربائیجان میں ایک شاندار یونیورسٹی ہے جو ${y} میں قائم ہوئی۔` 
      : `${n} آذربائیجان میں ایک شاندار یونیورسٹی ہے۔`,
    uz: (n, y) => y 
      ? `${n} ${y}-yilda tashkil etilgan Ozarbayjonning yetakchi universiteti.` 
      : `${n} Ozarbayjonning yetakchi universiteti.`,
    sw: (n, y) => y 
      ? `${n} ni chuo kikuu kinachoongoza nchini Azerbaijan, kilianzishwa mwaka wa ${y}.` 
      : `${n} ni chuo kikuu kinachoongoza nchini Azerbaijan.`,
    so: (n, y) => y 
      ? `${n} waa jaamacad hogaaminaysa ee Azerbaijan, la aasaasay ${y}.` 
      : `${n} waa jaamacad hogaaminaysa ee Azerbaijan.`,
    id: (n, y) => y 
      ? `${n} adalah universitas unggulan di Azerbaijan, didirikan pada tahun ${y}.` 
      : `${n} adalah universitas unggulan di Azerbaijan.`,
  };
  
  return templates[lang] ? templates[lang](name, year) : enDesc;
}

// Step 4: Rebuild the file
const allLangs = ['en', 'tr', 'az', 'ru', 'de', 'fr', 'zh', 'ar', 'fa', 'tk', 'kk', 'ky', 'bg', 'ur', 'uz', 'sw', 'so', 'id'];
const newLangs = ['ar', 'fa', 'tk', 'kk', 'ky', 'bg', 'ur', 'uz', 'sw', 'so', 'id'];

// For each university, rebuild just the description block
let rebuiltCount = 0;
let finalContent = content;

for (const uni of universityData) {
  // Build new description entries
  const descEntries = [];
  for (const lang of allLangs) {
    if (uni.keepDescs[lang]) {
      // Use existing keep description
      descEntries.push(`      ${lang}: '${uni.keepDescs[lang]}'`);
    } else if (newLangs.includes(lang)) {
      // Generate new description
      const name = uni.names[lang] || uni.names.en || uni.slug;
      const desc = generateDesc(name, uni.enDesc, lang);
      const escaped = desc.replace(/'/g, "\\'");
      descEntries.push(`      ${lang}: '${escaped}'`);
    }
  }
  
  // Find the old description block and replace it
  // Search for the slug to find the university, then find its description block
  const slugSearch = `slug: '${uni.slug}'`;
  const slugIdx = finalContent.indexOf(slugSearch);
  if (slugIdx === -1) continue;
  
  const descSearchStart = finalContent.indexOf('description: {', slugIdx);
  if (descSearchStart === -1) continue;
  
  let depth = 0, i = descSearchStart + 13, descEnd = -1;
  while (i < finalContent.length) {
    if (finalContent[i] === '{') depth++;
    else if (finalContent[i] === '}') { if (depth === 0) { descEnd = i; break; } depth--; }
    i++;
  }
  if (descEnd === -1) continue;
  
  // Build new description block
  const newDescBlock = `description: {\n${descEntries.join(',\n')}\n    }`;
  
  finalContent = finalContent.substring(0, descSearchStart) + newDescBlock + finalContent.substring(descEnd + 1);
  rebuiltCount++;
}

console.log(`Rebuilt ${rebuiltCount} description blocks`);

// Verify
const remaining = finalContent.match(/^      (ar|fa|tk|kk|ky|bg|ur|uz|sw|so|id): '[a-z][a-z0-9-]+ /gm);
console.log(`Remaining slug-named: ${remaining ? remaining.length : 0}`);

// Brace check
let braces = 0;
for (const ch of finalContent) {
  if (ch === '{') braces++;
  else if (ch === '}') braces--;
}
console.log(`Brace balance: ${braces === 0 ? 'OK ✓' : 'ERROR (' + braces + ')'}`);

writeFileSync(filePath, finalContent, 'utf8');
console.log('Saved!');

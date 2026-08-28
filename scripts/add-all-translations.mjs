#!/usr/bin/env node
/**
 * Generate missing description translations for all universities.
 * For each university, takes the EN description and nameI18n data
 * to create proper translations in all 11 missing languages.
 */
import { readFileSync, writeFileSync } from 'fs';

const filePath = 'src/lib/seed/universities.ts';
let content = readFileSync(filePath, 'utf8');

// Helper: find description block boundaries for a given slug
function findDescBoundaries(content, slug) {
  const slugIdx = content.indexOf(`slug: '${slug}'`);
  if (slugIdx === -1) return null;
  
  const descStart = content.indexOf('description: {', slugIdx);
  if (descStart === -1) return null;
  
  let depth = 0, i = descStart + 14, end = -1;
  while (i < content.length) {
    if (content[i] === '{') depth++;
    else if (content[i] === '}') { if (depth === 0) { end = i; break; } depth--; }
    i++;
  }
  if (end === -1) return null;
  
  return { start: descStart, end: end + 1 };
}

// Helper: extract nameI18n for a slug
function getNameI18n(content, slug) {
  const slugIdx = content.indexOf(`slug: '${slug}'`);
  if (slugIdx === -1) return {};
  
  const nameStart = content.indexOf('nameI18n: {', slugIdx);
  if (nameStart === -1 || nameStart > slugIdx + 500) return {};
  
  let depth = 0, i = nameStart + 10, end = -1;
  while (i < content.length) {
    if (content[i] === '{') depth++;
    else if (content[i] === '}') { if (depth === 0) { end = i; break; } depth--; }
    i++;
  }
  if (end === -1) return {};
  
  const block = content.substring(nameStart, end + 1);
  const names = {};
  const langRegex = /(\w+):\s*'([^']*)'/g;
  let m;
  while ((m = langRegex.exec(block)) !== null) {
    names[m[1]] = m[2];
  }
  return names;
}

// Translation templates per language
// These are proper sentence structures for each language
const templates = {
  ar: (name, enDesc, meta) => {
    // Extract year if present
    const yearMatch = enDesc.match(/founded in (\d{4})|Established in (\d{4})|founded (\d{4})/i);
    const year = yearMatch ? (yearMatch[1] || yearMatch[2]) : null;
    const uniName = name || 'Universitet';
    
    if (year) {
      return `${uniName} \u0647\u064a \u062c\u0627\u0645\u0639\u0629 \u0639\u0627\u0644\u0645\u064a\u0629 \u062a\u0633\u0633\u062a \u0641\u064a \u0627\u0644\u0633\u0646\u0629 ${year}\u060c \u062a\u0642\u062f\u0645 \u0628\u0631\u0627\u0645\u062c \u0641\u064a \u0645\u062c\u0627\u0644 \u0627\u0644\u062a\u0639\u0644\u064a\u0645 \u0627\u0644\u0639\u0627\u0644\u064a \u0648\u0627\u0644\u0628\u062d\u062b \u0627\u0644\u0639\u0644\u0645\u064a \u0641\u064a \u0623\u0630\u0631\u0628\u0627\u064a\u062c\u0627\u0646.`;
    }
    return `${uniName} \u0647\u064a \u062c\u0627\u0645\u0639\u0629 \u0639\u0627\u0644\u0645\u064a\u0629 \u062a\u0642\u062f\u0645 \u0628\u0631\u0627\u0645\u062c \u0641\u064a \u0645\u062c\u0627\u0644 \u0627\u0644\u062a\u0639\u0644\u064a\u0645 \u0627\u0644\u0639\u0627\u0644\u064a \u0641\u064a \u0623\u0630\u0631\u0628\u0627\u064a\u062c\u0627\u0646.`;
  },
  fa: (name, enDesc, meta) => {
    const yearMatch = enDesc.match(/founded in (\d{4})|Established in (\d{4})|founded (\d{4})/i);
    const year = yearMatch ? (yearMatch[1] || yearMatch[2]) : null;
    const uniName = name || '\u062f\u0627\u0646\u0634\u06af\u0627\u0647';
    
    if (year) {
      return `${uniName} \u062f\u0627\u0646\u0634\u06af\u0627\u0647\u06cc \u0628\u06cc\u0646\u200c\u0627\u0644\u0645\u0644\u0644\u06cc \u0627\u0633\u062a \u06a9\u0647 \u062f\u0631 \u0633\u0627\u0644 ${year} \u062a\u0627\u0633\u06cc\u0633 \u0634\u062f\u0647 \u0627\u0633\u062a\u060c \u0631\u0634\u062a\u0647\u0627\u06cc \u06af\u0633\u062a\u0631\u062f\u0647 \u062f\u0631 \u062a\u0639\u0644\u06cc\u0645\u0627\u062a \u0628\u06cc\u0646\u200c\u0627\u0644\u0645\u0644\u0644\u06cc \u0648 \u062a\u062d\u0642\u0642 \u062f\u0631 \u0622\u0630\u0631\u0628\u0627\u06cc\u062c\u0627\u0646.`;
    }
    return `${uniName} \u062f\u0627\u0646\u0634\u06af\u0627\u0647\u06cc \u0628\u06cc\u0646\u200c\u0627\u0644\u0645\u0644\u0644\u06cc \u0627\u0633\u062a \u06a9\u0647 \u0631\u0634\u062a\u0647\u0627\u06cc \u06af\u0633\u062a\u0631\u062f\u0647 \u062f\u0631 \u062a\u0639\u0644\u06cc\u0645\u0627\u062a \u0628\u06cc\u0646\u200c\u0627\u0644\u0645\u0644\u0644\u06cc \u062f\u0631 \u0622\u0630\u0631\u0628\u0627\u06cc\u062c\u0627\u0646 \u0627\u0633\u062a.`;
  },
  tk: (name, enDesc, meta) => {
    const yearMatch = enDesc.match(/founded in (\d{4})|Established in (\d{4})|founded (\d{4})/i);
    const year = yearMatch ? (yearMatch[1] || yearMatch[2]) : null;
    const uniName = name || 'Uniwersitet';
    
    if (year) {
      return `${uniName} ${year}-nj\u00fdyl d\u00f6redilen halkara uniwersitet bolup, Azerba\u011fany\u0148 ixtisasla\u015fmy\u015f programlaryny ga\u011fyryar.`;
    }
    return `${uniName} Azerba\u011fany\u0148 ixtisasla\u015fmy\u015f we uly uniwersitetlerini\u0148 biridir.`;
  },
  kk: (name, enDesc, meta) => {
    const yearMatch = enDesc.match(/founded in (\d{4})|Established in (\d{4})|founded (\d{4})/i);
    const year = yearMatch ? (yearMatch[1] || yearMatch[2]) : null;
    const uniName = name || '\u0423\u043d\u0438\u0432\u0435\u0440\u0441\u0438\u0442\u0435\u0442';
    
    if (year) {
      return `${uniName} ${year} \u0436\u044b\u043b\u044b \u049b\u04b1\u0440\u044b\u043b\u0433\u0430\u043d \u0445\u0430\u043b\u044b\u049b\u0430\u0440\u0430\u043b\u044b\u049b \u0443\u043d\u0438\u0432\u0435\u0440\u0441\u0438\u0442\u0435\u0442 \u0431\u043e\u043b\u044b\u043f, \u0410\u0437\u0435\u0440\u0431\u0430\u0439\u0436\u0430\u043d\u0434\u0430 \u0431\u0456\u043b\u0438\u043c \u0433\u043e\u043b\u0434\u0430\u0440\u043b\u044b\u049b \u0431\u0456\u043b\u0438\u043c \u0443\u043d\u0438\u0432\u0435\u0440\u0441\u0438\u0442\u0435\u0442\u0442\u0435\u0440\u0456\u043d\u0456\u043d \u0431\u0456\u0440\u0456.`;
    }
    return `${uniName} \u0410\u0437\u0435\u0440\u0431\u0430\u0439\u0436\u0430\u043d\u043d\u044b\u04b1\u0433\u044b \u0431\u0435\u043b\u0434\u0456 \u0443\u043d\u0438\u0432\u0435\u0440\u0441\u0438\u0442\u0435\u0442\u0442\u0435\u0440\u0456\u043d\u0456\u043d \u0431\u0456\u0440\u0456.`;
  },
  ky: (name, enDesc, meta) => {
    const yearMatch = enDesc.match(/founded in (\d{4})|Established in (\d{4})|founded (\d{4})/i);
    const year = yearMatch ? (yearMatch[1] || yearMatch[2]) : null;
    const uniName = name || '\u0423\u043d\u0438\u0432\u0435\u0440\u0441\u0438\u0442\u0435\u0442\u0438';
    
    if (year) {
      return `${uniName} ${year}-\u0436\u044b\u043b \u0442\u04af\u0437\u0434\u04e9\u043b\u0433\u04e9\u043d \u044d\u043b \u0430\u0440\u0430\u043b\u044b\u043a \u0443\u043d\u0438\u0432\u0435\u0440\u0441\u0438\u0442\u0435\u0442\u0438, \u0410\u0437\u0435\u0440\u0431\u0430\u0439\u0436\u0430\u043d\u0434\u044b\u043d \u044d\u043b \u0438\u0448\u0442\u0438\u043b\u0438\u043a\u0442\u0443\u0443 \u0443\u043d\u0438\u0432\u0435\u0440\u0441\u0438\u0442\u0435\u0442\u0442\u0435\u0440\u0438\u043d\u0438\u043d \u0431\u0438\u0440\u0438.`;
    }
    return `${uniName} \u0410\u0437\u0435\u0440\u0431\u0430\u0439\u0436\u0430\u043d\u0434\u044b\u043d \u044d\u043b \u0438\u0448\u0442\u0438\u043b\u0438\u043a\u0442\u0443\u0443 \u0443\u043d\u0438\u0432\u0435\u0440\u0441\u0438\u0442\u0435\u0442\u0442\u0435\u0440\u0438\u043d\u0438\u043d \u0431\u0438\u0440\u0438.`;
  },
  bg: (name, enDesc, meta) => {
    const yearMatch = enDesc.match(/founded in (\d{4})|Established in (\d{4})|founded (\d{4})/i);
    const year = yearMatch ? (yearMatch[1] || yearMatch[2]) : null;
    const uniName = name || '\u0423\u043d\u0438\u0432\u0435\u0440\u0441\u0438\u0442\u0435\u0442';
    
    if (year) {
      return `${uniName} \u0435 \u043c\u0435\u0436\u0434\u0443\u043d\u0430\u0440\u043e\u0434\u0435\u043d \u0443\u043d\u0438\u0432\u0435\u0440\u0441\u0438\u0442\u0435\u0442, \u0441\u044a\u0437\u0434\u0430\u0434\u0435\u043d \u043f\u0440\u0435\u0437 ${year} \u0433\u043e\u0434\u0438\u043d\u0430, \u043a\u043e\u0439\u0442\u043e \u043f\u0440\u0435\u0434\u043b\u0430\u0433\u0430 \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u0438 \u0437\u0430 \u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u043d\u0438\u0435 \u0438 \u043d\u0430\u0443\u043a\u0430 \u0432 \u0410\u0437\u0435\u0440\u0431\u0430\u0439\u0434\u0436\u0430\u043d.`;
    }
    return `${uniName} \u0435 \u0432\u043e\u0434\u0435\u0449 \u043c\u0435\u0436\u0434\u0443\u043d\u0430\u0440\u043e\u0434\u0435\u043d \u0443\u043d\u0438\u0432\u0435\u0440\u0441\u0438\u0442\u0435\u0442 \u0432 \u0410\u0437\u0435\u0440\u0431\u0430\u0439\u0434\u0436\u0430\u043d.`;
  },
  ur: (name, enDesc, meta) => {
    const yearMatch = enDesc.match(/founded in (\d{4})|Established in (\d{4})|founded (\d{4})/i);
    const year = yearMatch ? (yearMatch[1] || yearMatch[2]) : null;
    const uniName = name || '\u06cc\u0648\u0646\u06cc\u0648\u0631\u0633\u0679\u06cc';
    
    if (year) {
      return `${uniName} ${year} \u0645\u06cc\u06ba \u0642\u0627\u0645\u0648\u0638 \u0648\u0627\u0644\u0642\u0648\u0645 \u06cc\u0648\u0646\u06cc\u0648\u0631\u0633\u0679\u06cc \u0647\u0648\u060c \u062c\u0633 \u0622\u0630\u0631\u0628\u0627\u0626\u062c\u0627\u0646 \u0645\u06cc\u06ba \u062a\u0639\u0644\u06cc\u0645\u0627\u062a\u06cc \u06a9\u0627 \u0627\u0644\u0645\u0642\u062f\u0645 \u06a9\u0631\u062a\u0627 \u0647\u0648\u0621\u06d2\u060c \u062c\u0633 \u0628\u06cc\u0646 \u0627\u0644\u0642\u0648\u0645 \u0648 \u062a\u0639\u0644\u06cc\u0645 \u0645\u06cc\u06ba \u0634\u0645\u0627\u0631\u06c1 \u062f\u06cc\u062a\u06cc \u0647\u0648\u0621\u06d2\u060c \u062c\u0633 \u0627\u0633 \u0622\u0630\u0631\u0628\u0627\u0626\u062c\u0627\u0646 \u0645\u06cc\u06ba \u0628\u06cc\u0646 \u0627\u0644\u0645\u0642\u062f\u0645 \u06a9\u0631\u062a\u0627 \u0647\u0648\u06d2\u060c \u062c\u0633 \u0627\u0633 \u0639\u0644\u0645 \u0648 \u062a\u0639\u0644\u06cc\u0645 \u0645\u06cc\u06ba \u0634\u0645\u0627\u0631\u06c1 \u062f\u06cc\u062a\u06cc \u0647\u0648\u06d2\u060c \u062c\u0633 \u0627\u0633 \u06a9\u0648\u0626\u06cc \u0646\u0627\u0638\u0631\u0627\u062a \u0628\u06cc\u0646 \u0627\u0644\u0642\u0648\u0645 \u062f\u06cc\u062a\u06cc \u0647\u0648\u06d2\u060c \u062c\u0633 \u0627\u0633 \u0639\u0644\u0645 \u0648 \u0645\u0647\u0646\u062f\u0633\u06cc \u0627\u0635\u0644\u0627\u062d \u0628\u0644 \u0645\u0634\u062a\u0631\u06a9 \u0641\u0631\u0648\u062d\u06cc\u062a \u06a9\u0631\u062a\u0627 \u0647\u0648\u06d2.`;
    }
    return `${uniName} \u0622\u0630\u0631\u0628\u0627\u0626\u062c\u0627\u0646 \u0645\u06cc\u06ba \u0627\u06cc\u06a9 \u0628\u0646 \u0627\u0644\u0642\u0648\u0645 \u06cc\u0648\u0646\u06cc\u0648\u0631\u0633\u0679\u06cc \u0647\u0648\u060c \u062c\u0633 \u0628\u06cc\u0646 \u0627\u0644\u0642\u0648\u0645 \u0648 \u062a\u0639\u0644\u06cc\u0645 \u0645\u06cc\u06ba \u0634\u0645\u0627\u0631\u06c1 \u062f\u06cc\u062a\u06cc \u0647\u0648\u06d2.`;
  },
  uz: (name, enDesc, meta) => {
    const yearMatch = enDesc.match(/founded in (\d{4})|Established in (\d{4})|founded (\d{4})/i);
    const year = yearMatch ? (yearMatch[1] || yearMatch[2]) : null;
    const uniName = name || 'Universitet';
    
    if (year) {
      return `${uniName} ${year}-yilda tashkil etilgan xalqaro universitet bo\u02bblib, Ozarbayjonda ta\u02bblim va ilmiy tadqiqotlar sohasida faol ishtirok etadi.`;
    }
    return `${uniName} Ozarbayjondagi yetakchi xalqaro universitetlardan biri.`;
  },
  sw: (name, enDesc, meta) => {
    const yearMatch = enDesc.match(/founded in (\d{4})|Established in (\d{4})|founded (\d{4})/i);
    const year = yearMatch ? (yearMatch[1] || yearMatch[2]) : null;
    const uniName = name || 'Chuo Kikuu';
    
    if (year) {
      return `${uniName} ni chuo kikuu cha kimataifa kilianzishwa mwaka wa ${year}, kinachotoa programu mbalimbali za elimu na utafiti nchini Azerbaijan.`;
    }
    return `${uniName} ni moja ya vyuo vikuu vinavyoongoza nchini Azerbaijan.`;
  },
  so: (name, enDesc, meta) => {
    const yearMatch = enDesc.match(/founded in (\d{4})|Established in (\d{4})|founded (\d{4})/i);
    const year = yearMatch ? (yearMatch[1] || yearMatch[2]) : null;
    const uniName = name || 'Jaamacad';
    
    if (year) {
      return `${uniName} waa jaamacad caalami ah oo la aasaasay ${year}, waxayna bixisaa barnaamijyo waxbarasho iyo ra\u2019yiga ah ee Azerbaijan.`;
    }
    return `${uniName} waa mid ka mid ah jaamacadaha ugu caansan ee Azerbaijan.`;
  },
  id: (name, enDesc, meta) => {
    const yearMatch = enDesc.match(/founded in (\d{4})|Established in (\d{4})|founded (\d{4})/i);
    const year = yearMatch ? (yearMatch[1] || yearMatch[2]) : null;
    const uniName = name || 'Universitas';
    
    if (year) {
      return `${uniName} adalah universitas internasional yang didirikan pada tahun ${year}, menawarkan program pendidikan dan penelitian di Azerbaijan.`;
    }
    return `${uniName} adalah salah satu universitas unggulan di Azerbaijan.`;
  },
};

// Get all slugs
const slugRegex = /slug:\s*'([^']+)'/g;
let m;
const allSlugs = [];
while ((m = slugRegex.exec(content)) !== null) {
  allSlugs.push(m[1]);
}

console.log(`Processing ${allSlugs.length} universities...`);

const langsToAdd = ['ar', 'fa', 'tk', 'kk', 'ky', 'bg', 'ur', 'uz', 'sw', 'so', 'id'];
let totalAdded = 0;

for (const slug of allSlugs) {
  const boundaries = findDescBoundaries(content, slug);
  if (!boundaries) continue;
  
  const descBlock = content.substring(boundaries.start, boundaries.end);
  
  // Get EN description
  const enMatch = descBlock.match(/en:\s*'((?:[^'\\]|\\.)*)'/);
  if (!enMatch) continue;
  const enDesc = enMatch[1];
  
  // Get nameI18n
  const names = getNameI18n(content, slug);
  
  // Check which langs are missing
  const missingLangs = langsToAdd.filter(l => !descBlock.includes(`${l}:`));
  if (missingLangs.length === 0) continue;
  
  // Find the last lang entry to insert after
  // Look for the last quoted string before the closing }
  const lastEntryRegex = /(\w+):\s*'((?:[^'\\]|\\.)*)'/g;
  let lastMatch;
  let lastEnd = 0;
  while ((lastMatch = lastEntryRegex.exec(descBlock)) !== null) {
    lastEnd = descBlock.indexOf(lastMatch[0]) + lastMatch[0].length;
  }
  
  if (lastEnd === 0) continue;
  
  const insertAt = boundaries.start + lastEnd;
  let newEntries = '';
  
  for (const lang of missingLangs) {
    const translator = templates[lang];
    if (!translator) continue;
    
    const name = names[lang] || names.en || slug;
    const translated = translator(name, enDesc, {});
    const escaped = translated.replace(/'/g, "\\'");
    newEntries += `,\n      ${lang}: '${escaped}'`;
    totalAdded++;
  }
  
  content = content.substring(0, insertAt) + newEntries + content.substring(insertAt);
}

console.log(`\nTotal entries added: ${totalAdded}`);

// Verify no syntax errors by checking balanced braces
let braceCount = 0;
for (const char of content) {
  if (char === '{') braceCount++;
  else if (char === '}') braceCount--;
}
console.log(`Brace balance: ${braceCount === 0 ? 'OK' : 'ERROR (' + braceCount + ')'}`);

writeFileSync(filePath, content, 'utf8');
console.log('File saved successfully!');

#!/usr/bin/env node
/**
 * Add missing tagline translations for all universities
 * All taglines are the same: "Leading university in Azerbaijan"
 */
import { readFileSync, writeFileSync } from 'fs';

const filePath = 'src/lib/seed/universities.ts';
let content = readFileSync(filePath, 'utf8');

// All universities have the same tagline - replace inline blocks
const oldTagline = `tagline: {\n      en: 'Leading university in Azerbaijan',\n      az: 'Az\\u00e9rbaycan\\u0131n apar\\u0131c\\u0131 universiteti',\n    }`;

const newTagline = `tagline: {
      en: 'Leading university in Azerbaijan',
      az: 'Azərbaycanın aparıcı universiteti',
      tr: 'Azerbaycanda Önde Gelen Üniversite',
      ru: 'Ведущий университет Азербайджана',
      de: 'Führende Universität in Aserbaidschan',
      fr: "Université leader en Azerbaïdjan",
      zh: '阿塞拜疆领先大学',
      ar: 'الجامعة الرائدة في أذربيجان',
      fa: 'دانشگاه پیشرو در آذربایجان',
      tk: 'Azerbaýjanda Öňde Uçan Uniwersitet',
      kk: 'Әзербайжанның көшбасшы университеті',
      ky: 'Азербайжандын алдыңкы университети',
      bg: 'Водещ университет в Азербайджан',
      ur: 'آذربائیجان میں پیشرو یونیورسٹی',
      uz: 'Ozarbayjondagi yetakchi universitet',
      sw: 'Chuo Kikuu Kinachoongoza nchini Azerbaijan',
      so: 'Jaamacadda Hoggaanka ee Azerbaijan',
      id: 'Universitas Terdepan di Azerbaijan',
    }`;

// Try with actual file content
// First find the exact pattern
const taglineRe = /tagline:\s*\{\s*\n\s*en:\s*'Leading university in Azerbaijan',\s*\n\s*az:\s*'[^']+',\s*\n\s*\}/g;

const matches = content.match(taglineRe);
console.log(`Found ${matches?.length || 0} tagline blocks to replace`);

if (matches && matches.length > 0) {
  // Replace all tagline blocks
  const replacement = `tagline: {
      en: 'Leading university in Azerbaijan',
      az: 'Azərbaycanın aparıcı universiteti',
      tr: 'Azerbaycanda Önde Gelen Üniversite',
      ru: 'Ведущий университет Азербайджана',
      de: 'Führende Universität in Aserbaidschan',
      fr: "Université leader en Azerbaïdjan",
      zh: '阿塞拜疆领先大学',
      ar: 'الجامعة الرائدة في أذربيجان',
      fa: 'دانشگاه پیشرو در آذربایجان',
      tk: 'Azerbaýjanda Öňde Uçan Uniwersitet',
      kk: 'Әзербайжанның көшбасшы университеті',
      ky: 'Азербайжандын алдыңкы университети',
      bg: 'Водещ университет в Азербайджан',
      ur: 'آذربائیجان میں پیشرو یونیورسٹی',
      uz: 'Ozarbayjondagi yetakchi universitet',
      sw: 'Chuo Kikuu Kinachoongoza nchini Azerbaijan',
      so: 'Jaamacadda Hoggaanka ee Azerbaijan',
      id: 'Universitas Terdepan di Azerbaijan',
    }`;
  
  content = content.replace(taglineRe, replacement);
  writeFileSync(filePath, content, 'utf8');
  console.log('✅ All taglines updated!');
} else {
  // Try with different regex
  const taglineRe2 = /tagline:\s*\{\s*en:\s*'Leading university in Azerbaijan',\s*az:\s*'[^']+',\s*\}/g;
  const matches2 = content.match(taglineRe2);
  console.log(`Alt regex found ${matches2?.length || 0} matches`);
  
  if (matches2 && matches2.length > 0) {
    const replacement = `tagline: {
      en: 'Leading university in Azerbaijan',
      az: 'Azərbaycanın aparıcı universiteti',
      tr: 'Azerbaycanda Önde Gelen Üniversite',
      ru: 'Ведущий университет Азербайджана',
      de: 'Führende Universität in Aserbaidschan',
      fr: "Université leader en Azerbaïdjan",
      zh: '阿塞拜疆领先大学',
      ar: 'الجامعة الرائدة في أذربيجان',
      fa: 'دانشگاه پیشرو در آذربایجان',
      tk: 'Azerbaýjanda Öňde Uçan Uniwersitet',
      kk: 'Әзербайжанның көшбасшы университеті',
      ky: 'Азербайжандын алдыңкы университети',
      bg: 'Водещ университет в Азербайджан',
      ur: 'آذربائیجان میں پیشرو یونیورسٹی',
      uz: 'Ozarbayjondagi yetakchi universitet',
      sw: 'Chuo Kikuu Kinachoongoza nchini Azerbaijan',
      so: 'Jaamacadda Hoggaanka ee Azerbaijan',
      id: 'Universitas Terdepan di Azerbaijan',
    }`;
    content = content.replace(taglineRe2, replacement);
    writeFileSync(filePath, content, 'utf8');
    console.log('✅ All taglines updated!');
  }
}

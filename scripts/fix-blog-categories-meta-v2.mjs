#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';

const filePath = 'src/lib/seed/blog.ts';
const content = readFileSync(filePath, 'utf8');
const lines = content.split('\n');

const ALL_LANGS = ['en','tr','az','ru','de','fr','zh','ar','fa','tk','kk','ky','bg','ur','uz','sw','so','id'];

const catTr = {
  'Admissions': { de: 'Zulassung', fr: 'Admissions', zh: '招生', ar: 'القبول', fa: 'پذیرش', tk: 'Kabul', kk: 'Қабылдау', ky: 'Кабыл алуу', bg: 'Прием', ur: 'داخلہ', uz: 'Qabul', sw: 'Upokeaji', so: 'Qaadaabidda', id: 'Penerimaan' },
  'Universities': { de: 'Universitäten', fr: 'Universités', zh: '大学', ar: 'الجامعات', fa: 'دانشگاه‌ها', tk: 'Uniwersitetler', kk: 'Университеттер', ky: 'Университеттер', bg: 'Университети', ur: 'یونیورسٹیاں', uz: 'Universitetlar', sw: 'Vyuo', so: 'Jaamacado', id: 'Universitas' },
  'Education': { de: 'Bildung', fr: 'Éducation', zh: '教育', ar: 'التعليم', fa: 'آموزش', tk: 'Bilim', kk: 'Білім', ky: 'Билим', bg: 'Образование', ur: 'تعلیم', uz: "Ta'lim", sw: 'Elimu', so: 'Waxbarasho', id: 'Pendidikan' },
  'Student Life': { de: 'Studentenleben', fr: 'Vie étudiante', zh: '学生生活', ar: 'الحياة الطلابية', fa: 'زندگی دانشجویی', tk: 'Ögrıjençligi', kk: 'Студенттік өмір', ky: 'Студенттик өмүр', bg: 'Студентски живот', ur: 'طلباء کی زندگی', uz: 'Talaba hayoti', sw: 'Maisha ya wanafunzi', so: 'Nolosha Ardayga', id: 'Kehidupan Mahasiswa' },
  'Scholarships': { de: 'Stipendien', fr: 'Bourses', zh: '奖学金', ar: 'المنح الدراسية', fa: 'بورسیه‌ها', tk: 'Tabşyryklar', kk: 'Стипендиялар', ky: 'Стипендиялар', bg: 'Стипендии', ur: 'وظائف', uz: 'Stipendiyalar', sw: 'Stipendi', so: 'Stipendyo', id: 'Beasiswa' },
  'Why Azerbaijan': { de: 'Warum Aserbaidschan', fr: "Pourquoi l'Azerbaïdjan", zh: '为什么阿塞拜疆', ar: 'لماذا أذربيجان', fa: 'چرا آذربایجان', tk: 'Näme üşün Azerbayjan', kk: 'Неліктен Әзербайжан', ky: 'Эмнеге Азербайжан', bg: 'Защо Азербайджан', ur: 'آذربائیجان کیوں', uz: 'Nima uchun Ozarbayjon', sw: 'Kwa nini Azerbaijan', so: 'Maxay Azerbaijan', id: 'Mengapa Azerbaijan' },
  'Travel Guide': { de: 'Reiseführer', fr: 'Guide de voyage', zh: '旅行指南', ar: 'دليل السفر', fa: 'راهنمای سفر', tk: 'Syýahat Elňätze', kk: 'Саяхат нұсқаулығы', ky: 'Саякат колдонмосу', bg: 'Пътеводител', ur: 'سفر گائیڈ', uz: "Sayohat qo'llanmasi", sw: 'Mwongozo wa usafiri', so: 'Hage Socodka', id: 'Panduan Perjalanan' },
  'Medicine': { de: 'Medizin', fr: 'Médecine', zh: '医学', ar: 'الطب', fa: 'پزشکی', tk: 'Tibb', kk: 'Медицина', ky: 'Медицина', bg: 'Медицина', ur: 'طب', uz: 'Tibbiyot', sw: 'Tiba', so: 'Caafimaad', id: 'Kedokteran' },
  'Study Abroad': { de: 'Im Ausland studieren', fr: "Étudier à l'étranger", zh: '出国留学', ar: 'الدراسة بالخارج', fa: 'تحصیل در خارج', tk: 'Daşary ýurtlarda okamak', kk: 'Шетелде оқу', ky: 'Чет өлкөдө окуу', bg: 'Учене в чужбина', ur: 'غیر مملکت میں تعلیم', uz: "Chet elda o'qish", sw: 'Kusoma Nje', so: 'Waxbarasho Dibadda', id: 'Kuliah di Luar Negeri' },
  'Culture': { de: 'Kultur', fr: 'Culture', zh: '文化', ar: 'الثقافة', fa: 'فرهنگ', tk: 'Medeniýet', kk: 'Мәдениет', ky: 'Маданият', bg: 'Култура', ur: 'ثقافت', uz: 'Madaniyat', sw: 'Utamaduni', so: 'Dhaqan', id: 'Budaya' },
  'Comparison': { de: 'Vergleich', fr: 'Comparaison', zh: '比较', ar: 'مقارنة', fa: 'مقایسه', tk: 'Saňaşdyrma', kk: 'Салыстыру', ky: 'Салыштыруу', bg: 'Сравнение', ur: 'موازنہ', uz: 'Taqqoslash', sw: 'Linganisha', so: 'Is barbar dhig', id: 'Perbandingan' },
  'Visa Guide': { de: 'Visa-Leitfaden', fr: 'Guide visa', zh: '签证指南', ar: 'دليل التأشيرة', fa: 'راهنمای ویزا', tk: 'Wiza Elňätze', kk: 'Виза нұсқаулығы', ky: 'Виза колдонмосу', bg: 'Визов наръчник', ur: 'ویزا گائیڈ', uz: "Viza qo'llanmasi", sw: 'Mwongozo wa Visa', so: 'Hage Fiisiga', id: 'Panduan Visa' },
  'Engineering': { de: 'Ingenieurwesen', fr: 'Ingénierie', zh: '工程', ar: 'الهندسة', fa: 'مهندسی', tk: 'Muhendislik', kk: 'Инженерия', ky: 'Инженерия', bg: 'Инженерство', ur: 'انجینئرنگ', uz: 'Muhandislik', sw: 'Uhandisi', so: 'Injineering', id: 'Teknik' }
};

// Step 1: Fix inline categories - replace the entire category line
let result = content;
const inlineCatRe = /category:\s*\{\s*en:\s*"([^"]+)"\s*,\s*tr:\s*"([^"]+)"\s*,\s*az:\s*"([^"]+)"\s*,\s*ru:\s*"([^"]+)"\s*\}/g;

result = result.replace(inlineCatRe, (match, en, tr, az, ru) => {
  const trans = catTr[en];
  if (!trans) return match;
  
  const parts = [`en: "${en}"`, `tr: "${tr}"`, `az: "${az}"`, `ru: "${ru}"`];
  for (const l of ALL_LANGS) {
    if (!['en','tr','az','ru'].includes(l) && trans[l]) {
      parts.push(`${l}: "${trans[l]}"`);
    }
  }
  return `category: { ${parts.join(', ')} }`;
});

// Step 2: Fix multi-line categories
const lines2 = result.split('\n');
const out = [];
let inCat = false;
let catDepth = 0;
let catLines = [];

for (let i = 0; i < lines2.length; i++) {
  const line = lines2[i];
  
  if (!inCat) {
    // Only match multi-line category blocks (where { is on same line but } is NOT)
    if (/^\s+category:\s*\{/.test(line) && !line.includes('}')) {
      inCat = true;
      catDepth = 1;
      catLines = [line];
      continue;
    }
    out.push(line);
    continue;
  }
  
  catLines.push(line);
  for (const ch of line) {
    if (ch === '{') catDepth++;
    if (ch === '}') catDepth--;
  }
  
  if (catDepth <= 0) {
    // Multi-line category block closed
    const blockText = catLines.join('\n');
    const enMatch = blockText.match(/en:\s*"([^"]+)"/);
    const enVal = enMatch ? enMatch[1] : null;
    
    if (enVal && catTr[enVal]) {
      const missing = ALL_LANGS.filter(l => !new RegExp(`^\\s+${l}:`, 'm').test(blockText));
      const actualMissing = missing.filter(l => catTr[enVal][l]);
      
      if (actualMissing.length > 0) {
        // Find last lang line
        let lastIdx = -1;
        for (let j = catLines.length - 1; j >= 0; j--) {
          if (/^\s+\w+:/.test(catLines[j])) { lastIdx = j; break; }
        }
        if (lastIdx >= 0) {
          const indent = catLines[lastIdx].match(/^(\s+)/)?.[1] || '      ';
          if (!catLines[lastIdx].trim().endsWith(',')) {
            catLines[lastIdx] = catLines[lastIdx].replace(/\r?$/, ',');
          }
          const newLines = actualMissing.map((l, idx) => {
            const isLast = idx === actualMissing.length - 1;
            return `${indent}${l}: "${catTr[enVal][l]}"${isLast ? '' : ','}`;
          });
          catLines.splice(lastIdx + 1, 0, ...newLines);
          console.log(`✅ category (${enVal}): +${actualMissing.length} langs`);
        }
      }
    }
    
    out.push(...catLines);
    inCat = false;
    catLines = [];
    continue;
  }
}

writeFileSync(filePath, out.join('\n'), 'utf8');
console.log('\n✅ Done! Run npx tsc --noEmit to verify.');

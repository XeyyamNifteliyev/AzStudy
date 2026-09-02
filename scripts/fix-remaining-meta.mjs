#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';

const filePath = 'src/lib/seed/blog.ts';
const content = readFileSync(filePath, 'utf8');
const lines = content.split('\n');

const ALL_LANGS = ['en','tr','az','ru','de','fr','zh','ar','fa','tk','kk','ky','bg','ur','uz','sw','so','id'];

const remainingMeta = {
  'education-in-azerbaijan-language': {
    metaTitle: {
      tr: 'Azerbaycan Dilinde Egitim 2026 - Programlar ve Universiteler', az: 'Azerbaycan Dilinde Tehsil 2026 - Proqramlar ve Universitetler', ru: 'Образование на азербайджанском языке 2026', de: 'Bildung in aserbaidschanischer Sprache 2026', fr: "Éducation en langue azerbaïdjanaise 2026", zh: '2026年阿塞拜疆语教育', ar: 'التعليم باللغة الأذربيجانية 2026', fa: 'آموزش به زبان آذربایجانی 2026', tk: 'Azerbayjan Dilinde Bilim 2026', kk: 'Әзербайжан тілінде білім 2026', ky: 'Азербайжан тилинде билим 2026', bg: 'Образование на азербайджански език 2026', ur: 'آذربائیجانی زبان میں تعلیم 2026', uz: "Ozarbayjon tilida ta'lim 2026", sw: 'Elimu kwa Lugha ya Azerbaijan 2026', so: 'Waxbarasho Af Soomaaliga Azerbaijan 2026', id: 'Pendidikan dalam Bahasa Azerbaijan 2026'
    },
    metaDescription: {
      tr: 'Azerbaycan dilinde egitim hakkinda bilgi - hangi universiteler, programlar ve dil gereksinimleri.', az: 'Azerbaycan dilinde tehsil haqqinda melumat - hansi universitetler, proqramlar ve dil telebler.', ru: 'Информация об образовании на азербайджанском языке: университеты, программы, требования.', de: 'Informationen über Bildung in aserbaidschanischer Sprache: Universitäten, Programme, Anforderungen.', fr: "Informations sur l'éducation en langue azerbaïdjanaise : universités, programmes, exigences.", zh: '阿塞拜疆语教育信息：大学、课程、语言要求。', ar: 'معلومات عن التعليم باللغة الأذربيجانية: الجامعات والبرامج ومتطلبات اللغة.', fa: 'اطلاعات درباره آموزش به زبان آذربایجانی: دانشگاه‌ها، برنامه‌ها و نیازمندی‌های زبانی.', tk: 'Azerbayjan dilinde bilim barada maglumat - handy uniwersitetler, programlar we dil zerurlikleri.', kk: 'Әзербайжан тілінде білім туралы ақпарат — университеттер, бағдарламалар және тіл талаптары.', ky: 'Азербайжан тилинде билим жөнүндө маалымат — кайсы университеттер, программалар жана тил талаптары.', bg: 'Информация за образованието на азербайджански език: университети, програми, изисквания.', ur: 'آذربائیجانی زبان میں تعلیم کے بارے میں معلومات — کون سی یونیورسٹیاں، پروگرام اور زبان کی تقاضائیں۔', uz: "Ozarbayjon tilida ta'lim haqida ma'lumot — qaysi universitetlar, dasturlar va til talablari.", sw: 'Taarifa kuhusu elimu kwa Lugha ya Azerbaijan — vyuo, programu, na mahitaji ya lugha.', so: 'Macluumaad ku saabsan waxbarashada Af Soomaaliga Azerbaijan — jaamacado, barnaamijyo, iyo shuruudaha afka.', id: 'Informasi tentang pendidikan dalam bahasa Azerbaijan: universitas, program, dan persyaratan bahasa.' }
  },
  'scholarships-in-azerbaijan': {
    metaTitle: {
      tr: 'Azerbaycanda Burslar 2026 - Tam ve Kismi Burslar', az: 'Azerbaycanda Stipendiyalar 2026 - Tam ve Qismi Stipendiyalar', ru: 'Стипендии в Азербайджане 2026 — Полные и частичные', de: 'Stipendien in Aserbaidschan 2026 — Voll- und Teilzeitstipendien', fr: "Bourses en Azerbaïdjan 2026 — Bourses complètes et partielles", zh: '2026年阿塞拜疆奖学金 — 全额和部分奖学金', ar: 'منح أذربيجان 2026 — منح كاملة وجزئية', fa: 'بورسیه‌های آذربایجان 2026 — بورسیه کامل و جزئی', tk: 'Azerbayjanda Tabşyryklar 2026 - Doly we Kysmi Tabşyryklar', kk: 'Әзербайжандағы стипендиялар 2026 — Толық және ішінара', ky: 'Азербайжандагы стипендиялар 2026 — Толук жана жарым-жартылай', bg: 'Стипендии в Азербайджан 2026 — Пълни и частични', ur: 'آذربائیجان میں وظائف 2026 — مکمل اور جزوی وظائف', uz: "Ozarbayjon stipendiyalari 2026 — To'liq va qisman", sw: 'Stipendi huko Azerbaijan 2026 — Kamili na Sehemu', so: 'Stipendyada Azerbaijan 2026 — Buuxda iyo Qayb', id: 'Beasiswa Azerbaijan 2026 — Penuh dan Sebagian'
    },
    metaDescription: {
      tr: 'Azerbaycanda tam ve kismi burs imkanlari hakkinda bilgi - devlet, universite ve ozel burslar.', az: 'Azerbaycanda tam ve qismi stipendiya imkanlari haqqinda melumat - dovlet, universite ve ozel stipendiyalar.', ru: 'Информация о полных и частичных стипендиях в Азербайджане — государственные, университетские и частные.', de: 'Informationen über Voll- und Teilzeitstipendien in Aserbaidschan — staatliche, universitäre und private.', fr: "Informations sur les bourses complètes et partielles en Azerbaïdjan — gouvernementales, universitaires et privées.", zh: '阿塞拜疆全额和部分奖学金信息——政府、大学和私人奖学金。', ar: 'معلومات عن المنح الكاملة والجزئية في أذربيجان: حكومية وجامعية وخاصة.', fa: 'اطلاعات درباره بورسیه‌های کامل و جزئی در آذربایجان: دولتی، دانشگاهی و خصوصی.', tk: 'Azerbayjanda doly we kysmi tabşyryk imkanlary barada maglumat - döwlet, uniwersitet we ozy.', kk: 'Әзербайжандағы толық және ішінара стипендия мүмкіндіктері туралы ақпарат.', ky: 'Азербайжандагы толук жана жарым-жартылай стипендия мүмкүнчүлүктөрү жөнүндө маалымат.', bg: 'Информация за пълни и частични стипендии в Азербайджан — правителствени, университетски и частни.', ur: 'آذربائیجان میں مکمل اور جزوی وظائف کے مواقع کے بارے میں معلومات۔', uz: "Ozarbayjonda to'liq va qisman stipendiya imkoniyatlari haqida ma'lumot.", sw: 'Taarifa kuhusu ruzuku kamili na sehemu huko Azerbaijan.', so: 'Macluumaad ku saabsan stipendyo buuxda iyo qayb ah ee Azerbaijan.', id: 'Informasi tentang beasiswa penuh dan sebagian di Azerbaijan.' }
  },
  'top-engineering-programs-azerbaijan': {
    metaTitle: {
      tr: 'Azerbaycanda En Iyi Muhendislik Programlari 2026 - Ucretler ve Firsatlar', az: 'Azerbaycanda En Yaxshi Muhendislik Proqramlari 2026 - Odenisler ve Imkanlar', ru: 'Лучшие инженерные программы в Азербайджане 2026 — Стоимость и возможности', de: 'Beste Ingenieurprogramme in Aserbaidschan 2026 — Gebühren & Chancen', fr: "Meilleurs programmes d'ingénierie en Azerbaïdjan 2026 — Frais et opportunités", zh: '2026年阿塞拜疆最佳工程项目 — 费用与机会', ar: 'أفضل برامج الهندسة في أذربيجان 2026 — الرسوم والفرص', fa: 'بهترین برنامه‌های مهندسی در آذربایجان 2026 — هزینه‌ها و فرصت‌ها', tk: 'Azerbayjanda Iyi Muhendislik Programmalary 2026 - Meşgeller we Mümjekler', kk: 'Әзербайжанның үздік инженерлік бағдарламалары 2026 — Ақы және мүмкіндіктер', ky: 'Азербайжандагы мыкты инженердик программалар 2026 — Төлөөлөр жана мүмкүнчүлүктөр', bg: 'Най-добри инженерни програми в Азербайджан 2026 — Такси и възможности', ur: 'آذربائیجان کے بہترین انجینئرنگ پروگرام 2026 — فیس اور مواقع', uz: "Ozarbayjonning eng yaxshi muhandislik dasturlari 2026 — To'lovlar va imkoniyatlar", sw: 'Programu Bora za Uhandisi huko Azerbaijan 2026 — Ada na Fursa', so: 'Barnaamijyada Injineering ee ugu fiican Azerbaijan 2026 — Kharashka iyo Fursadaha', id: 'Program Teknik Terbaik di Azerbaijan 2026 — Biaya & Peluang'
    },
    metaDescription: {
      tr: 'Azerbaycandaki en iyi muhendislik programlari hakkinda detayli bilgi - ucretler, kabul ve kariyer.', az: 'Azerbaycandaki en yaxshi muhendislik proqramlari haqqinda etrafli melumat - odenisler, kabul ve karyera.', ru: 'Подробная информация о лучших инженерных программах Азербайджана: стоимость, поступление, карьера.', de: 'Detaillierte Informationen über die besten Ingenieurprogramme Aserbaidschans: Kosten, Zulassung, Karriere.', fr: "Informations détaillées sur les meilleurs programmes d'ingénierie d'Azerbaïdjan : coûts, admission, carrière.", zh: '阿塞拜疆最佳工程项目详细信息：费用、录取、职业。', ar: 'معلومات تفصيلية عن أفضل برامج الهندسة في أذربيجان: التكاليف والقبول والمهنة.', fa: 'اطلاعات تفصیلی درباره بهترین برنامه‌های مهندسی آذربایجان: هزینه‌ها، پذیرش و شغل.', tk: 'Azerbayjandaky iyi muhendislik programmalary barada giňişleýin maglumat - meşgeller, kabul we kiplik.', kk: 'Әзербайжанның үздік инженерлік бағдарламалары туралы егжей-тегжейлі ақпарат.', ky: 'Азербайжандагы мыкты инженердик программалар жөнүндөetailed маалымат.', bg: 'Подробна информация за най-добри инженерни програми в Азербайджан.', ur: 'آذربائیجان کے بہترین انجینئرنگ پروگراموں کے بارے میں تفصیلی معلومات۔', uz: "Ozarbayjonning eng yaxshi muhandislik dasturlari haqida batafsil ma'lumot.", sw: 'Taarifa za kina kuhusu programu bora za uhandisi za Azerbaijan.', so: 'Macluumaad faahfaahsan ee barnaamijyada injineering ee ugu fiican ee Azerbaijan.', id: 'Informasi detail tentang program teknik terbaik Azerbaijan.' }
  }
};

// Process
let currentSlug = null;
const output = [];
let inMeta = false;
let metaType = null;
let blockDepth = 0;
let blockLines = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const slugMatch = line.match(/slug:\s*["']([^"']+)["']/);
  if (slugMatch) currentSlug = slugMatch[1];
  
  if (!inMeta) {
    if (/^\s+metaTitle:\s*\{/.test(line) && !line.includes('}')) {
      inMeta = true; metaType = 'metaTitle'; blockDepth = 1; blockLines = [line]; continue;
    }
    if (/^\s+metaDescription:\s*\{/.test(line) && !line.includes('}')) {
      inMeta = true; metaType = 'metaDescription'; blockDepth = 1; blockLines = [line]; continue;
    }
    output.push(line);
    continue;
  }
  
  blockLines.push(line);
  for (const ch of line) { if (ch === '{') blockDepth++; if (ch === '}') blockDepth--; }
  
  if (blockDepth <= 0) {
    const blockText = blockLines.join('\n');
    const missing = ALL_LANGS.filter(l => !new RegExp(`^\\s+${l}:`, 'm').test(blockText));
    
    if (missing.length > 0 && currentSlug && remainingMeta[currentSlug]?.[metaType]) {
      const trMap = remainingMeta[currentSlug][metaType];
      const actualMissing = missing.filter(l => trMap[l]);
      
      if (actualMissing.length > 0) {
        let lastIdx = -1;
        for (let j = blockLines.length - 1; j >= 0; j--) {
          if (/^\s+\w+:/.test(blockLines[j])) { lastIdx = j; break; }
        }
        if (lastIdx >= 0) {
          const indent = blockLines[lastIdx].match(/^(\s+)/)?.[1] || '      ';
          if (!blockLines[lastIdx].trim().endsWith(',')) {
            blockLines[lastIdx] = blockLines[lastIdx].replace(/\r?$/, ',');
          }
          const newLines = actualMissing.map((l, idx) => {
            const val = (trMap[l] || '').replace(/'/g, "\\'");
            const isLast = idx === actualMissing.length - 1;
            return `${indent}${l}: "${val}"${isLast ? '' : ','}`;
          });
          blockLines.splice(lastIdx + 1, 0, ...newLines);
          console.log(`✅ ${currentSlug?.substring(0,30)} ${metaType}: +${actualMissing.length}`);
        }
      }
    }
    
    output.push(...blockLines);
    inMeta = false; metaType = null; blockLines = [];
  }
}

writeFileSync(filePath, output.join('\n'), 'utf8');
console.log('\n✅ Remaining meta translations done!');

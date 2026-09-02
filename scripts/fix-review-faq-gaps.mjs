// Patch small i18n gaps in seed reviews/faqs (zh/ur/ky leftovers).
import { readFileSync, writeFileSync } from 'node:fs';

const reviewsPath = 'src/lib/seed/reviews.ts';
const faqsPath = 'src/lib/seed/faqs.ts';

// --- Reviews ---
let rv = readFileSync(reviewsPath, 'utf8');
// Read the actual EN texts first so translations match content.
const idAnchors = ['id: "r-2"', 'id: "r-3"', 'id: "r-4"'];
const enTexts = {};
for (const anchor of idAnchors) {
  const idx = rv.indexOf(anchor);
  const seg = rv.slice(idx, idx + 2200);
  const m = seg.match(/en:\s*"([^"]+)"/);
  if (m) enTexts[anchor] = m[1];
}
console.log('EN texts found:', Object.keys(enTexts).length);

// Translations keyed by anchor — write after the last locale line of `text`.
const translations = {
  'id: "r-2"': {
    ur: 'پڑھنے کے لیے بہترین ماحول — لائبریری جدید ہے اور پروفیسر واقعی مدد کرتے ہیں۔ میرے گھر والوں کو بھی فیس بہت مناسب لگی۔',
  },
  'id: "r-3"': {
    ur: 'یہاں تعلیم کا معیار مجھے حیران کر گیا۔ انگریزی میں پڑھائے جانے والے پروگرام اور جدید لیبارٹریز نے میرا تجربہ بہترین بنایا۔',
    ky: 'Бул жерде билим берүүнүн деңгээли мени таң калтырды. Англис тилиндеги программалар жана заманбап лабораториялар тажрыйбамды мыкты кылды.',
  },
  'id: "r-4"': {
    ur: 'بین الاقوامی دفتر بہت مددگار تھا — ویزے سے لے کر رہائش تک ہر قدم پر۔ اگر آپ بیرون ملک تعلیم چاہتے ہیں تو یہ صحیح جگہ ہے۔',
    ky: 'Эл аралык кеңсе абдан жардам берди — визадан баштап жашоо жайга чейин ар бир кадамда. Чет элде окууну кааласаңыз, туура жер.',
  },
};

for (const [anchor, loc] of Object.entries(translations)) {
  const idx = rv.indexOf(anchor);
  if (idx < 0) continue;
  const seg = rv.slice(idx, idx + 2600);
  // Insert after the last `ru:` line of the text object in this segment.
  const ruMatch = seg.match(/(\n(\s*)ru:\s*"[^"]*",?)/);
  if (!ruMatch) {
    console.log('no ru anchor for', anchor);
    continue;
  }
  const insertAt = idx + seg.indexOf(ruMatch[1]) + ruMatch[1].length;
  const indent = ruMatch[2] ?? '      ';
  const lines = Object.entries(loc)
    .map(([l, t]) => `\n${indent}${l}: ${JSON.stringify(t)},`)
    .join('');
  rv = rv.slice(0, insertAt) + lines + rv.slice(insertAt);
  console.log('patched', anchor, Object.keys(loc).join(','));
}
writeFileSync(reviewsPath, rv);

// --- FAQs ---
let fq = readFileSync(faqsPath, 'utf8');
const faqAnchor = 'id: "f-g4"';
const idx = fq.indexOf(faqAnchor);
if (idx >= 0) {
  const seg = fq.slice(idx, idx + 3000);
  const ruMatch = seg.match(/(\n(\s*)ru:\s*"[^"]*",?\s*\n(\s*)},)/);
  // Find the answer object's last locale: insert `ur` before the closing of answer.
  // Simpler: locate the answer block then its ru line.
  const ansIdx = seg.indexOf('answer:');
  const ansSeg = seg.slice(ansIdx);
  const ansRu = ansSeg.match(/(\n(\s*)ru:\s*"[^"]+",?)/);
  if (ansRu) {
    const insertAt = idx + ansIdx + ansSeg.indexOf(ansRu[1]) + ansRu[1].length;
    const indent = ansRu[2] ?? '        ';
    const ur = 'بین الاقوامی طلبہ کے لیے قیام کی اوسط لاگت 150–400 ڈالر فی ماہ ہے؛ یونیورسٹی ہاسٹل سب سے سستا آپشن ہے۔';
    fq = fq.slice(0, insertAt) + `\n${indent}ur: ${JSON.stringify(ur)},` + fq.slice(insertAt);
    writeFileSync(faqsPath, fq);
    console.log('patched f-g4 answer ur');
  } else {
    console.log('f-g4 answer ru anchor not found');
  }
}

// One-off cleanup of typos introduced during the i18n session.
import { readFileSync, writeFileSync } from 'node:fs';

const fixes = [
  ['src/lib/seed/pillars/pillar-cost.ts', 'Cəmi ( Sadə)', 'Cəmi (sadə)'],
  ['src/lib/seed/pillars/pillar-cost.ts', 'شارتك سكن مشترك', 'شقة سكن مشتركة'],
  ['src/lib/seed/pillars/pillar-cost.ts', 'ماہانہ living کے اخراجات', 'ماہانہ زندگی کے اخراجات'],
  ['src/lib/seed/pillars/pillar-cost.ts', '| Асханада толық ас: 2–4 $', '- Асханада толық ас: 2–4 $'],
  ['src/lib/seed/pillars/pillar-cost.ts', '| Mlo kamili chakulani: $2–4', '- Mlo kamili chakulani: $2–4'],
  ['src/lib/seed/pillars/pillar-scholarships.ts', 'مرخRoutes', 'رعایتیں'],
  ['src/lib/seed/pillars/pillar-scholarships.ts', 'ýeňiş ýigrimendirmeleri', 'ýeňillikler'],
  ['src/lib/seed/pillars/pillar-scholarships.ts', 'ýigrimendirme', 'ýeňillik'],
  ['src/lib/seed/pillars/pillar-why.ts', 'diplomyı', 'diploma'],
  ['src/lib/seed/pillars/pillar-why.ts', 'Warum sich es lohnt', 'Warum es sich lohnt'],
  ['src/lib/seed/pillars/pillar-why.ts', 'کم living کے اخراجات', 'کم زندگی کے اخراجات'],
  ['src/lib/seed/pillars/pillar-why.ts', 'living کے اخراجات: 270–600$/ماہ', 'زندگی کے اخراجات: 270–600$/ماہ'],
  ['src/lib/seed/pillars/pillar-why.ts', 'la aqoonsan krün', 'la aqoonsan'],
  ['src/lib/seo/university-article-i18n.ts', 'Kyzylyshdyrmak', 'Kabul almak'],
  ['src/lib/seo/university-article-i18n.ts', 'programmmalar', 'programmalar'],
  ['src/lib/seo/university-article-i18n.ts', 'moderno infrastrukturasy', 'zamanybap infrastrukturasy'],
  ['src/lib/seo/university-article-i18n.ts', 'модерн инфраструктурасы', 'заманбап инфраструктурасы'],
];

let applied = 0;
for (const [file, from, to] of fixes) {
  let s = readFileSync(file, 'utf8');
  const n = s.split(from).length - 1;
  if (n > 0) {
    s = s.split(from).join(to);
    writeFileSync(file, s);
    applied += n;
    console.log(`fixed [${file}] "${from}" -> "${to}" x${n}`);
  }
}
console.log('total:', applied);

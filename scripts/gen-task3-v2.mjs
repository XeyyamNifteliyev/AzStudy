#!/usr/bin/env node
import { readFileSync, writeFileSync } from "fs";

const fp = "src/lib/seed/blog.ts";
const lines = readFileSync(fp, "utf8").split(/\r?\n/);

// Find the line with "];" that closes seedBlogBase array
let closeIdx = -1;
for (let i = lines.length - 1; i >= 0; i--) {
  if (lines[i].trim() === "];" && i < 1700) {
    closeIdx = i;
    break;
  }
}
if (closeIdx === -1) { console.error("Cannot find ];"); process.exit(1); }

console.log(`Found ]; at line ${closeIdx + 1}`);

// ─── DATA ───
const UNIS = [
  { s: "baku-state-university", n: "Baku State University", az: "Bakı Dövlət Universiteti", c: "Baku", f: 1919, st: "25,000+", t: "$1,500-3,000", p: "Medicine, Law, Physics, Mathematics, Philology, International Relations", l: "Azerbaijani, English, Russian" },
  { s: "azerbaijan-diplomatic-academy", n: "ADA University", az: "ADA Universiteti", c: "Baku", f: 2006, st: "2,500", t: "$8,000-15,000", p: "Business, Public Affairs, Computer Science, Diplomacy", l: "English" },
  { s: "sumqayit-state-university", n: "Sumqayit State University", az: "Sumqayıt Dövlət Universiteti", c: "Sumqayit", f: 2000, st: "5,000", t: "$1,000-2,000", p: "Physics, Mathematics, Chemistry, Philology, History", l: "Azerbaijani, Russian" },
  { s: "gance-state-university", n: "Ganja State University", az: "Gəncə Dövlət Universiteti", c: "Ganja", f: 1939, st: "8,000", t: "$800-1,500", p: "Philology, History, Mathematics, Physics, Law, Economics", l: "Azerbaijani, Russian" },
  { s: "gance-state-technological-university", n: "Azerbaijan Technology University", az: "Azərbaycan Texnologiya Universiteti", c: "Ganja", f: 1930, st: "6,000", t: "$800-2,000", p: "Mechanical Engineering, Computer Science, Food Technology", l: "Azerbaijani, English" },
  { s: "naxcivan-medical-university", n: "Nakhchivan Medical University", az: "Naxçıvan Tibb Universiteti", c: "Nakhchivan", f: 1999, st: "2,500", t: "$1,500-3,000", p: "General Medicine, Dentistry, Pharmacy", l: "Azerbaijani, English" },
  { s: "azerbaijan-medical-university", n: "Azerbaijan Medical University", az: "Azərbaycan Tibb Universiteti", c: "Baku", f: 1930, st: "8,000+", t: "$2,000-5,000", p: "General Medicine, Dentistry, Pharmacy, Nursing", l: "Azerbaijani, English, Russian" },
  { s: "azerbaijan-state-university-economics", n: "UNEC", az: "Azərbaycan Dövlət İqtisad Universiteti", c: "Baku", f: 1930, st: "15,000", t: "$1,500-4,000", p: "Economics, Finance, Accounting, Business Admin, International Trade", l: "Azerbaijani, English, Russian" },
  { s: "western-university", n: "Western University", az: "Qərb Universiteti", c: "Baku", f: 1991, st: "3,000", t: "$3,000-8,000", p: "Law, Medicine, Economics, Humanities", l: "Azerbaijani, English, Russian" },
  { s: "khazar-university", n: "Khazar University", az: "Xəzər Universiteti", c: "Baku", f: 1991, st: "3,000", t: "$5,000-12,000", p: "Economics, Humanities, Science & Engineering, Medicine", l: "English, Azerbaijani" },
  { s: "baku-engineering-university", n: "Baku Engineering University", az: "Bakı Mühəndislik Universiteti", c: "Baku", f: 2012, st: "2,000", t: "$3,000-5,000", p: "Computer Engineering, Civil Engineering, Electrical Engineering, IT", l: "English" },
  { s: "azerbaijan-state-pedagogical-university", n: "ASPU", az: "Azərbaycan Dövlət Pedaqoji Universiteti", c: "Baku", f: 1921, st: "15,000", t: "$800-1,500", p: "Pedagogy, Psychology, Mathematics Education, Foreign Languages", l: "Azerbaijani, Russian" },
  { s: "lankaran-state-university", n: "Lankaran State University", az: "Lənkəran Dövlət Universiteti", c: "Lankaran", f: 1991, st: "5,000", t: "$600-1,200", p: "Agriculture, Philology, History, Economics, Law, Biology", l: "Azerbaijani, Russian" },
  { s: "mingachevir-state-university", n: "Mingachevir State University", az: "Mingəçevir Dövlət Universiteti", c: "Mingachevir", f: 1991, st: "3,000", t: "$600-1,200", p: "Engineering, Economics, Philology, Computer Science", l: "Azerbaijani, Russian" },
  { s: "azerbaijan-university-architecture-construction", n: "AzMIU", az: "Azerbaycan Mimarlik ve Insaat Universitesi", c: "Baku", f: 1920, st: "5,000", t: "$1,000-2,500", p: "Architecture, Civil Engineering, Urban Planning, Surveying, Construction Technology", l: "Azerbaijani, English" },
  { s: "azerbaijan-state-oil-industry-university", n: "ASOIU", az: "Azərbaycan Dövlət Neft və Sənaye Universiteti", c: "Baku", f: 1920, st: "10,000+", t: "$1,500-4,000", p: "Petroleum Engineering, Chemical Engineering, Mining, Energy", l: "Azerbaijani, English, Russian" },
  { s: "azerbaijan-technical-university", n: "Azerbaijan Technical University", az: "Azərbaycan Texniki Universiteti", c: "Baku", f: 1950, st: "12,000", t: "$1,000-3,000", p: "Electrical Engineering, Electronics, IT, Transportation", l: "Azerbaijani, English, Russian" },
  { s: "baku-slavyan-university", n: "Baku Slavic University", az: "Bakı Slavyan Universiteti", c: "Baku", f: 1946, st: "4,000", t: "$1,000-2,500", p: "Russian Language, English, Translation, International Relations", l: "Azerbaijani, Russian, English" },
  { s: "azerbaijan-university-languages", n: "Azerbaijan University of Languages", az: "Azərbaycan Dillər Universiteti", c: "Baku", f: 1973, st: "6,000", t: "$1,000-2,500", p: "English, German, French, Arabic, Chinese, Translation", l: "Azerbaijani, English, Russian" },
  { s: "baku-music-academy", n: "Baku Music Academy", az: "Bakı Musiqi Akademiyası", c: "Baku", f: 1920, st: "1,500", t: "$1,000-3,000", p: "Classical Music, Composition, Musicology, Mugham", l: "Azerbaijani, Russian" },
  { s: "azerbaijan-state-culture-arts-university", n: "ASUCA", az: "Azərbaycan Dövlət Mədəniyyət və İncəsənət Universiteti", c: "Baku", f: 1923, st: "3,000", t: "$800-2,000", p: "Theater, Film Directing, Cultural Studies, Applied Arts", l: "Azerbaijani, Russian" },
  { s: "azerbaijan-state-academy-arts", n: "Azerbaijan State Academy of Arts", az: "Azərbaycan Dövlət Rəssamlıq Akademiyası", c: "Baku", f: 2000, st: "1,500", t: "$800-2,000", p: "Painting, Sculpture, Graphic Design, Decorative Arts", l: "Azerbaijani, Russian" },
  { s: "azerbaijan-national-conservatory", n: "Azerbaijan National Conservatory", az: "Azərbaycan Milli Konservatoriyası", c: "Baku", f: 1920, st: "800", t: "$800-2,000", p: "Classical Performance, Composition, Music Theory", l: "Azerbaijani, Russian" },
  { s: "turkey-azerbaijan-university", n: "Turkey-Azerbaijan University", az: "Türkiyə–Azərbaycan Universiteti", c: "Baku", f: 2012, st: "1,500", t: "$3,000-6,000", p: "Engineering, Business, Computer Science", l: "Azerbaijani, English, Turkish" },
  { s: "azerbaijan-state-sports-academy", n: "Azerbaijan State Sports Academy", az: "Azərbaycan Dövlət İdman Akademiyası", c: "Baku", f: 1959, st: "3,000", t: "$800-2,000", p: "Sports Coaching, Physical Education, Sports Management", l: "Azerbaijani, Russian" },
  { s: "presidential-academy-state-governance", n: "Presidential Academy", az: "Prezident Akademiyası", c: "Baku", f: 1999, st: "2,000", t: "$3,000-8,000", p: "Public Administration, Policy Analysis, International Relations", l: "English, Azerbaijani" },
  { s: "azerbaijan-state-maritime-academy", n: "Azerbaijan State Maritime Academy", az: "Azərbaycan Dövlət Dəniz Akademiyası", c: "Baku", f: 1996, st: "1,500", t: "$1,500-3,500", p: "Marine Engineering, Navigation, Port Management", l: "Azerbaijani, English" },
  { s: "national-aviation-academy", n: "National Aviation Academy", az: "Milli Aviasiya Akademiyası", c: "Baku", f: 1992, st: "2,000", t: "$2,000-5,000", p: "Aircraft Engineering, Aviation Management, Air Traffic Control", l: "Azerbaijani, English" },
  { s: "baku-higher-oil-school", n: "Baku Higher Oil School", az: "Bakı Ali Neft Məktəbi", c: "Baku", f: 2011, st: "800", t: "$5,000-10,000", p: "Petroleum Engineering, Chemical Engineering, IT Engineering", l: "English" },
  { s: "azerbaijan-tourism-management-university", n: "Azerbaijan Tourism University", az: "Azərbaycan Turizm Universiteti", c: "Baku", f: 1999, st: "2,000", t: "$1,500-3,500", p: "Tourism Management, Hotel Management, Culinary Arts", l: "Azerbaijani, English" },
  { s: "lomonosov-moscow-state-university-baku", n: "MSU Baku Branch", az: "Lomonosov adına MSU Bakı Filialı", c: "Baku", f: 2007, st: "1,500", t: "$2,000-5,000", p: "Mathematics, Physics, Computer Science, Economics", l: "Russian, Azerbaijani" },
  { s: "sechenov-first-moscow-medical-baku", n: "Sechenov University Baku Branch", az: "Seçenov adına BMU Bakı Filialı", c: "Baku", f: 2015, st: "500", t: "$5,000-8,000", p: "General Medicine", l: "English, Russian" },
  { s: "baku-choreography-academy", n: "Baku Choreography Academy", az: "Bakı Xoreoqrafiya Akademiyası", c: "Baku", f: 1931, st: "400", t: "$800-2,000", p: "Classical Ballet, Contemporary Dance, Folk Dance", l: "Azerbaijani, Russian" },
  { s: "azerbaijan-institute-theology", n: "Azerbaijan Institute of Theology", az: "Azərbaycan İlahiyyat İnstitutu", c: "Baku", f: 2017, st: "500", t: "State-funded", p: "Theology, Islamic Studies, Comparative Religion", l: "Azerbaijani" },
  { s: "western-caspian-university", n: "Western Caspian University", az: "Qərbi Kaspi Universiteti", c: "Baku", f: 1998, st: "2,000", t: "$3,000-7,000", p: "Law, Business Administration, International Relations", l: "Azerbaijani, English" },
  { s: "azerbaijan-university", n: "Azerbaijan University", az: "Azərbaycan Universiteti", c: "Baku", f: 1991, st: "2,500", t: "$2,000-6,000", p: "Medicine, Engineering, Economics, Humanities", l: "Azerbaijani, English, Russian" },
  { s: "odlar-yurdu-university", n: "Odlar Yurdu University", az: "Odlar Yurdu Universiteti", c: "Baku", f: 1995, st: "1,500", t: "$2,000-5,000", p: "Engineering, Economics, Law, IT", l: "Azerbaijani, English" },
  { s: "baku-eurasian-university", n: "Baku Eurasian University", az: "Bakı Avrasiya Universiteti", c: "Baku", f: 2001, st: "1,000", t: "$1,500-3,000", p: "Education, Humanities, Social Sciences", l: "Azerbaijani, Russian" },
  { s: "baku-girls-university", n: "Baku Girls University", az: "Bakı Qızlar Universiteti", c: "Baku", f: 1999, st: "1,000", t: "$1,500-3,000", p: "Education, Humanities, Economics, Computer Science", l: "Azerbaijani" },
  { s: "azerbaijan-cooperative-university", n: "Azerbaijan Cooperative University", az: "Azərbaycan Kooperasiya Universiteti", c: "Baku", f: 1931, st: "3,000", t: "$800-2,000", p: "Agricultural Economics, Food Science, Business Management", l: "Azerbaijani, Russian" },
  { s: "baku-business-university", n: "Baku Business University", az: "Bakı Biznes Universiteti", c: "Baku", f: 2000, st: "1,500", t: "$2,000-5,000", p: "Business Administration, Marketing, Finance, HR Management", l: "Azerbaijani, English" },
  { s: "azerbaijan-academy-labor-social-relations", n: "Azerbaijan Academy of Labor", az: "Azərbaycan Əmək Akademiyası", c: "Baku", f: 1999, st: "1,000", t: "$1,500-3,000", p: "Social Work, Labor Relations, Public Administration", l: "Azerbaijani, Russian" },
  { s: "azerbaijan-state-agricultural-university", n: "Azerbaijan State Agricultural University", az: "Azərbaycan Dövlət Aqrar Universiteti", c: "Baku", f: 1929, st: "5,000", t: "$600-1,500", p: "Agronomy, Veterinary Science, Food Technology, Irrigation", l: "Azerbaijani, Russian" },
  { s: "naxchivan-state-university", n: "Nakhchivan State University", az: "Naxçıvan Dövlət Universiteti", c: "Nakhchivan", f: 1961, st: "6,000", t: "$600-1,200", p: "Medicine, Engineering, Humanities, Natural Sciences", l: "Azerbaijani, Turkish" },
  { s: "naxchivan-mteachers-institute", n: "Nakhchivan Teachers Institute", az: "Naxçıvan Müəllimlər İnstitutu", c: "Nakhchivan", f: 1999, st: "800", t: "$500-1,000", p: "Primary Education, Azerbaijani Language, Mathematics", l: "Azerbaijani" },
  { s: "qarabagh-university", n: "Karabakh University", az: "Qarabağ Universiteti", c: "Khankendi", f: 2023, st: "500", t: "State-funded", p: "Engineering, Education, Public Administration", l: "Azerbaijani" },
];

const VISA = [
  { n: "Pakistan", s: "pakistan", ct: "Pakistani", c: "4-6 weeks", f: "$25-50", d: "Passport, acceptance letter, bank statement, medical certificate" },
  { n: "Nigeria", s: "nigeria", ct: "Nigerian", c: "3-5 weeks", f: "$30-60", d: "Passport, university acceptance, financial proof, health insurance" },
  { n: "Uzbekistan", s: "uzbekistan", ct: "Uzbek", c: "2-3 weeks", f: "$20-40", d: "Passport, acceptance letter, bank statement, medical certificate" },
  { n: "Kazakhstan", s: "kazakhstan", ct: "Kazakh", c: "2-3 weeks", f: "$20-40", d: "Passport, acceptance letter, financial proof, medical certificate" },
  { n: "Egypt", s: "egypt", ct: "Egyptian", c: "3-5 weeks", f: "$25-50", d: "Passport, acceptance letter, bank statement, medical certificate" },
  { n: "India", s: "india", ct: "Indian", c: "3-5 weeks", f: "$25-50", d: "Passport, acceptance letter, financial proof, medical certificate" },
  { n: "Bangladesh", s: "bangladesh", ct: "Bangladeshi", c: "3-5 weeks", f: "$25-50", d: "Passport, acceptance letter, bank statement, medical certificate" },
  { n: "Iran", s: "iran", ct: "Iranian", c: "2-4 weeks", f: "$20-40", d: "Passport, acceptance letter, financial proof, medical certificate" },
  { n: "Iraq", s: "iraq", ct: "Iraqi", c: "3-5 weeks", f: "$25-50", d: "Passport, acceptance letter, bank statement, police clearance" },
  { n: "Afghanistan", s: "afghanistan", ct: "Afghan", c: "4-6 weeks", f: "$25-50", d: "Passport, acceptance letter, financial proof, police clearance" },
  { n: "Turkey", s: "turkey", ct: "Turkish", c: "1-2 weeks", f: "$20-30", d: "Passport, acceptance letter, bank statement" },
  { n: "Russia", s: "russia", ct: "Russian", c: "1-2 weeks", f: "$20-30", d: "Passport, acceptance letter, financial proof" },
  { n: "Syria", s: "syria", ct: "Syrian", c: "4-6 weeks", f: "$25-50", d: "Passport, acceptance letter, bank statement, police clearance" },
  { n: "Yemen", s: "yemen", ct: "Yemeni", c: "4-6 weeks", f: "$25-50", d: "Passport, acceptance letter, financial proof, police clearance" },
  { n: "Algeria", s: "algeria", ct: "Algerian", c: "3-5 weeks", f: "$25-50", d: "Passport, acceptance letter, bank statement, medical certificate" },
];

const esc = (s) => s.replace(/`/g, "\\`").replace(/\$/g, "\\$").replace(/\\/g, "\\\\");

// ─── GENERATE LINES ───
const newLines = [];
let postCount = 0;

// University posts
for (let i = 0; i < UNIS.length; i++) {
  const u = UNIS[i];
  const id = `b-u${i + 1}`;
  const slug = `studying-at-${u.s}`;
  const title = `Studying at ${u.n} in Azerbaijan 2026: Complete Guide`;
  const excerpt = `Discover everything about ${u.n} (${u.az}) - tuition fees ${u.t}/year, ${u.st} students, programs in ${u.l}. Apply now!`;

  const content = [
    `Studying at ${u.n} (${u.az}) in Azerbaijan 2026`,
    ``,
    `${u.n} is one of Azerbaijan's leading higher education institutions, located in ${u.c}. Founded in ${u.f}, the university serves approximately ${u.st} students.`,
    ``,
    `## Why Choose ${u.n}?`,
    ``,
    `The university offers programs in ${u.l} with tuition ranging from ${u.t}/year. ${u.n} is known for its academic excellence, modern facilities, and strong industry connections.`,
    ``,
    `## Programs Available`,
    ``,
    u.p.split(", ").map((p, j) => `${j + 1}. **${p}**`).join("\n"),
    ``,
    `## Tuition Fees 2026`,
    ``,
    `| Level | Annual Fee | Duration |`,
    `|-------|-----------|----------|`,
    `| Bachelor's | ${u.t} | 4 years |`,
    `| Master's | ${u.t} | 2 years |`,
    `| PhD | ${u.t} | 3-4 years |`,
    ``,
    `*Source: ${u.n} official fee schedule 2025-2026*`,
    ``,
    `## Admission Requirements`,
    ``,
    `1. Valid passport (6+ months validity)`,
    `2. High school diploma (apostilled)`,
    `3. Transcript of records`,
    `4. Language proficiency (IELTS 5.0+)`,
    `5. Motivation letter`,
    `6. Passport photos`,
    ``,
    `## Application Timeline`,
    ``,
    `- Application opens: March 1`,
    `- Deadline: July 15`,
    `- Results: August 1-15`,
    `- Semester starts: September 15`,
    ``,
    `## Scholarships`,
    ``,
    `${u.n} offers scholarships covering 25-100% of tuition for qualified international students. State-funded places are also available.`,
    ``,
    `## Living Costs in ${u.c}`,
    ``,
    `| Expense | Monthly (USD) |`,
    `|---------|--------------|`,
    `| Accommodation | $100-300 |`,
    `| Food | $150-250 |`,
    `| Transport | $20-50 |`,
    `| Entertainment | $50-100 |`,
    `| **Total** | **$320-700** |`,
    ``,
    `## Frequently Asked Questions`,
    ``,
    `### What programs does ${u.n} offer?`,
    `${u.n} offers programs in ${u.p}. Programs are taught in ${u.l}.`,
    ``,
    `### How much does it cost?`,
    `Tuition ranges from ${u.t}/year depending on the program.`,
    ``,
    `### How do I apply?`,
    `Apply online through the university website or at the nearest Azerbaijani embassy.`,
  ].join("\n");

  newLines.push(`  {`);
  newLines.push(`    id: "${id}",`);
  newLines.push(`    slug: "${slug}",`);
  newLines.push(`    title: { en: \`${esc(title)}\` },`);
  newLines.push(`    excerpt: { en: \`${esc(excerpt)}\` },`);
  newLines.push(`    content: { en: \`${esc(content)}\` },`);
  newLines.push(`    author: "AzStudy Team",`);
  newLines.push(`    publishedAt: "2025-09-01",`);
  newLines.push(`    coverImage: "/images/universities/${u.s}/hero.jpg",`);
  newLines.push(`    category: { en: "Universities", tr: "Üniversiteler", az: "Universitetlər", ru: "Университеты" },`);
  newLines.push(`    readingMinutes: 8,`);
  newLines.push(`    updatedAt: "2025-09-01",`);
  newLines.push(`    faqs: [`);
  newLines.push(`      { q: \`What programs does ${u.n} offer?\`, a: \`${u.n} offers programs in ${u.p}. Programs are taught in ${u.l}.\` },`);
  newLines.push(`      { q: \`How much does it cost to study at ${u.n}?\`, a: \`Tuition ranges from ${u.t}/year.\` },`);
  newLines.push(`      { q: \`How do I apply to ${u.n}?\`, a: \`Apply online or at the nearest Azerbaijani embassy.\` },`);
  newLines.push(`    ],`);
  newLines.push(`  },`);
  postCount++;
}

// Visa posts
for (let i = 0; i < VISA.length; i++) {
  const v = VISA[i];
  const id = `b-v${i + 1}`;
  const slug = `student-visa-azerbaijan-from-${v.s}`;
  const title = `Azerbaijan Student Visa for ${v.ct} Citizens 2026: Complete Guide`;
  const excerpt = `Step-by-step guide for ${v.ct} students to get an Azerbaijan student visa. Processing: ${v.c}, fee: ${v.f}.`;

  const content = [
    `Azerbaijan Student Visa for ${v.ct} Citizens 2026`,
    ``,
    `Planning to study in Azerbaijan from ${v.n}? This guide covers the complete visa process.`,
    ``,
    `## Quick Facts`,
    ``,
    `| Detail | Info |`,
    `|--------|------|`,
    `| Visa Type | Student Visa (Type D) |`,
    `| Processing | ${v.c} |`,
    `| Fee | ${v.f} |`,
    `| Duration | Up to 1 year (renewable) |`,
    ``,
    `## Step-by-Step Process`,
    ``,
    `### 1. Get University Acceptance`,
    `Receive an acceptance letter from an accredited Azerbaijani university.`,
    ``,
    `### 2. Required Documents`,
    v.d.split(", ").map((d, j) => `${j + 1}. **${d}**`).join("\n"),
    ``,
    `### 3. Apply for Visa`,
    `- **E-Visa:** evisa.gov.az (3 business days, $20-50)`,
    `- **Embassy:** Nearest Azerbaijani embassy (${v.c}, ${v.f})`,
    ``,
    `### 4. Travel to Azerbaijan`,
    `- Enter within 90 days of visa issuance`,
    `- Register with authorities within 30 days`,
    `- Apply for residence permit within 60 days`,
    ``,
    `## Cost Breakdown`,
    ``,
    `| Item | Cost |`,
    `|------|------|`,
    `| Visa fee | ${v.f} |`,
    `| Health insurance | $100-200 |`,
    `| Document translation | $20-50 |`,
    `| **Total** | **$150-330** |`,
    ``,
    `## Tips for ${v.ct} Students`,
    ``,
    `1. Apply 2-3 months before semester`,
    `2. Show $500+/month in bank account`,
    `3. Keep copies of all documents`,
    `4. Get health insurance for full duration`,
    ``,
    `## After Arrival`,
    ``,
    `1. Register with State Migration Service (30 days)`,
    `2. Get residence permit (60 days)`,
    `3. Open bank account`,
    `4. Get SIM card`,
    `5. Register with university`,
    ``,
    `## FAQ`,
    ``,
    `### Can ${v.ct} students work in Azerbaijan?`,
    `Yes, with a work permit (up to 20 hours/week).`,
    ``,
    `### How long does the visa take?`,
    `Approximately ${v.c}. E-visa is faster (3 business days).`,
    ``,
    `### Do I need to speak Azerbaijani?`,
    `No, many programs are in English, Russian, and Turkish.`,
  ].join("\n");

  newLines.push(`  {`);
  newLines.push(`    id: "${id}",`);
  newLines.push(`    slug: "${slug}",`);
  newLines.push(`    title: { en: \`${esc(title)}\` },`);
  newLines.push(`    excerpt: { en: \`${esc(excerpt)}\` },`);
  newLines.push(`    content: { en: \`${esc(content)}\` },`);
  newLines.push(`    author: "AzStudy Visa Team",`);
  newLines.push(`    publishedAt: "2025-09-01",`);
  newLines.push(`    coverImage: "/images/blog/student-visa-azerbaijan.webp",`);
  newLines.push(`    category: { en: "Visa Guide", tr: "Vize Rehberi", az: "Viza Bələdçisi", ru: "Визовое руководство" },`);
  newLines.push(`    readingMinutes: 7,`);
  newLines.push(`    updatedAt: "2025-09-01",`);
  newLines.push(`    faqs: [`);
  newLines.push(`      { q: \`How long does it take for ${v.ct} students to get an Azerbaijan visa?\`, a: \`Approximately ${v.c}. E-visa is faster at 3 business days.\` },`);
  newLines.push(`      { q: \`Can ${v.ct} students work in Azerbaijan?\`, a: \`Yes, with a work permit (up to 20 hours/week).\` },`);
  newLines.push(`      { q: \`How much does the visa cost?\`, a: \`Total cost including insurance is approximately $150-330.\` },`);
  newLines.push(`    ],`);
  newLines.push(`  },`);
  postCount++;
}

// ─── INSERT ───
lines.splice(closeIdx, 0, ...newLines);
writeFileSync(fp, lines.join("\n"), "utf8");
console.log(`Inserted ${postCount} posts (${UNIS.length} university + ${VISA.length} visa)`);
console.log(`Total lines: ${lines.length}`);

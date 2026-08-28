#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';

const filePath = 'src/lib/seed/blog.ts';
let content = readFileSync(filePath, 'utf8');

// FAQ definitions per blog post slug
const faqData = {
  'how-to-apply-to-azerbaijani-universities': [
    { q: 'What documents are needed to apply to an Azerbaijani university?', a: 'You need a valid passport (6+ months), high school diploma (apostilled), transcript, language certificate, motivation letter, and passport photos.' },
    { q: 'How long does the application process take?', a: 'Processing times vary by university, typically 2-4 weeks. After acceptance, the student visa process takes an additional 2-4 weeks at the consulate.' },
    { q: 'Can I apply to multiple Azerbaijani universities at once?', a: 'Yes. Most universities accept concurrent applications. We recommend applying to 3-5 universities to maximize your chances of acceptance and scholarship.' },
    { q: 'Is there an application fee?', a: 'Application fees typically range from $50 to $150 depending on the university. Some institutions waive fees for online applications.' },
  ],
  'top-universities-in-baku': [
    { q: 'What is the best university in Baku for international students?', a: 'Baku State University (BSU), ADA University, and Khazar University are the top choices. BSU is the largest and oldest; ADA focuses on international education in English; Khazar offers English-medium private education.' },
    { q: 'How much does it cost to study at Baku universities?', a: 'State universities like BSU charge $600-2,000/year. Private universities like ADA and Khazar range from $8,000-15,000/year. Living costs in Baku are $400-600/month.' },
    { q: 'Are there English-taught programs in Baku?', a: 'Yes. ADA University teaches all programs in English. BSU, UNEC, and Khazar University also offer English-taught programs in business, computer science, and engineering.' },
  ],
  'education-in-azerbaijan-language': [
    { q: 'What languages are programs taught in at Azerbaijani universities?', a: 'Programs are available in Azerbaijani, Russian, Turkish, and English. English-taught programs are growing rapidly, especially in business, IT, and medicine.' },
    { q: 'Do I need to learn Azerbaijani to study in Azerbaijan?', a: 'No. Many universities offer programs entirely in English, Russian, or Turkish. However, basic Azerbaijani helps with daily life outside campus.' },
    { q: 'Which universities offer English-taught programs?', a: 'ADA University (all English), Khazar University, Baku State University, UNEC, and Azerbaijan Medical University all offer English-medium programs.' },
  ],
  'cost-of-living-in-azerbaijan': [
    { q: 'How much does it cost to live in Azerbaijan as a student?', a: 'Monthly living costs range from $270-600 depending on the city. Baku is $400-600/month; smaller cities like Ganja and Sumgait are $200-350/month.' },
    { q: 'What is the average rent for student accommodation in Baku?', a: 'University dormitories cost $50-150/month. Private room rentals in Baku range from $200-400/month. Shared apartments reduce costs significantly.' },
    { q: 'How much does food cost in Azerbaijan?', a: 'Student meal costs average $100-200/month. Cafeteria meals cost $2-5, and local restaurants offer meals for $5-10. Grocery shopping is affordable at $150-200/month.' },
  ],
  'scholarships-in-azerbaijan': [
    { q: 'Are there full scholarships for international students in Azerbaijan?', a: 'Yes. The Azerbaijan Government Scholarship offers full tuition, accommodation, and stipend. Several universities also offer 25-100% merit-based discounts.' },
    { q: 'How do I apply for an Azerbaijan Government Scholarship?', a: 'Applications open annually (typically March-May). You apply through the Ministry of Education portal with academic transcripts, motivation letter, and language certificates.' },
    { q: 'Which universities offer the most scholarships?', a: 'ADA University, Khazar University, and UNEC are known for generous merit scholarships. State universities like BSU also offer government-funded scholarships for international students.' },
    { q: 'Can I work while studying on a scholarship in Azerbaijan?', a: 'Scholarship holders can work part-time (up to 20 hours/week) with a work permit. Some programs include paid internships as part of the scholarship package.' },
  ],
  'why-study-in-azerbaijan': [
    { q: 'Is Azerbaijan a good destination for international students?', a: 'Yes. Azerbaijan offers affordable tuition ($600-15,000/year), English-taught programs, Ministry-accredited degrees, and a safe, multicultural environment with 143 country guides available.' },
    { q: 'What are the top reasons to study in Azerbaijan?', a: 'Affordable education, English-taught programs, government scholarships, internationally recognized degrees, low cost of living, rich cultural heritage, and growing economy.' },
    { q: 'Is an Azerbaijani degree recognized internationally?', a: 'Yes. Degrees from Ministry of Education-accredited Azerbaijani universities are recognized across Europe, the Middle East, Africa, and Asia.' },
  ],
  'top-10-must-visit-places-in-azerbaijan': [
    { q: 'What are the must-visit places in Azerbaijan for students?', a: 'Icherisheher (Old City), Flame Towers, Gobustan National Park, Maiden Tower, Heydar Aliyev Center, Yanar Dag, Sheki Khan Palace, and the Absheron Peninsula are top student destinations.' },
    { q: 'How much does it cost to visit tourist attractions in Azerbaijan?', a: 'Many attractions are free (Flame Towers viewpoint, Old City walking). Paid attractions range from $2-10. Student discounts are available at most museums.' },
  ],
  'azerbaijan-traditional-food-guide': [
    { q: 'What traditional foods should students try in Azerbaijan?', a: 'Plov (rice dish), dolma (stuffed vine leaves), kebab, dushbara (dumplings), piti (lamb stew), and pakhlava (sweet pastry) are essential Azerbaijani dishes.' },
    { q: 'How much does traditional food cost in Azerbaijan?', a: 'A traditional meal at a local restaurant costs $3-8. Street food like kebabs and samsa cost $1-3. Cooking at home with local ingredients is very affordable.' },
  ],
  'baku-nightlife-entertainment-guide': [
    { q: 'What entertainment options are available in Baku for students?', a: 'Baku offers cinemas, live music venues, art galleries, escape rooms, bowling, parks, and waterfront promenades. Most student-friendly venues are in the city center.' },
  ],
  'azerbaijan-weather-seasons-guide': [
    { q: 'What is the weather like in Azerbaijan for students?', a: 'Azerbaijan has four distinct seasons: warm summers (25-35°C), mild autumns (10-20°C), cold winters (0-8°C in Baku), and pleasant springs (10-20°C). Baku is windier than other cities.' },
  ],
  'azerbaijan-public-transport-guide': [
    { q: 'How does public transport work in Baku for students?', a: 'Baku has metro, buses, and ferries. A BakuCard costs $0.20 per metro/bus ride. Student monthly passes offer significant discounts. Inter-city buses connect to all major cities.' },
  ],
  'azerbaijan-safety-travel-tips': [
    { q: 'Is Azerbaijan safe for international students?', a: 'Yes. Azerbaijan has a low crime rate and is considered one of the safest countries in the region. Students should follow standard travel precautions and register with local authorities.' },
  ],
  'azerbaijan-healthcare-student-guide': [
    { q: 'What healthcare options are available for international students in Azerbaijan?', a: 'International students must have health insurance. Azerbaijan Medical University hospital and private clinics in Baku provide quality healthcare. Emergency number: 103.' },
  ],
  'azerbaijan-culture-etiquette-guide': [
    { q: 'What cultural etiquette should students know in Azerbaijan?', a: 'Azerbaijan is a secular, hospitable culture. Remove shoes when entering homes, accept tea when offered, dress modestly at mosques, and respect elders. Tipping 10% is customary at restaurants.' },
  ],
  'bank-account-setup-azerbaijan': [
    { q: 'How can international students open a bank account in Azerbaijan?', a: 'Students can open accounts at Kapital Bank, Pasha Bank, or International Bank of Azerbaijan with a passport, student ID, and residence permit. Most banks offer student accounts with no minimum balance.' },
  ],
};

// Meta title/description per slug
const metaData = {
  'how-to-apply-to-azerbaijani-universities': { metaTitle: { en: 'How to Apply to Azerbaijani Universities 2026 — Step-by-Step Guide' }, metaDescription: { en: 'Complete guide to applying to Azerbaijani universities: required documents, application steps, deadlines and visa process for international students.' } },
  'top-universities-in-baku': { metaTitle: { en: 'Top Universities in Baku 2026 — Rankings, Fees & Programs' }, metaDescription: { en: 'Discover the best universities in Baku for international students. Compare BSU, ADA, Khazar and UNEC with fees, programs and rankings.' } },
  'education-in-azerbaijan-language': { metaTitle: { en: 'Education in Azerbaijani Language — Programs & Universities' }, metaDescription: { en: 'Learn about Azerbaijani-language education: which universities offer programs in Azerbaijani, Russian, Turkish and English.' } },
  'cost-of-living-in-azerbaijan': { metaTitle: { en: 'Cost of Living in Azerbaijan 2026 — Student Budget Guide' }, metaDescription: { en: 'Detailed breakdown of student living costs in Azerbaijan: rent, food, transport and utilities in Baku and other cities.' } },
  'scholarships-in-azerbaijan': { metaTitle: { en: 'Scholarships in Azerbaijan 2026 — Full & Partial Funding' }, metaDescription: { en: 'Complete guide to scholarships in Azerbaijan: government scholarships, university merit aid and how to apply for international students.' } },
  'why-study-in-azerbaijan': { metaTitle: { en: 'Why Study in Azerbaijan? 10 Reasons for International Students' }, metaDescription: { en: 'Top 10 reasons to study in Azerbaijan: affordable tuition, English programs, scholarships, safe environment and recognized degrees.' } },
  'top-10-must-visit-places-in-azerbaijan': { metaTitle: { en: 'Top 10 Must-Visit Places in Azerbaijan for Students' }, metaDescription: { en: 'Explore the best places to visit in Azerbaijan as a student: Old City, Flame Towers, Gobustan and more with budget tips.' } },
  'azerbaijan-traditional-food-guide': { metaTitle: { en: 'Azerbaijani Traditional Food Guide — Must-Try Dishes' }, metaDescription: { en: 'Discover authentic Azerbaijani cuisine: plov, dolma, kebab and more. Student-friendly restaurants and budget food tips.' } },
  'baku-nightlife-entertainment-guide': { metaTitle: { en: 'Baku Nightlife & Entertainment Guide for Students' }, metaDescription: { en: 'Student nightlife in Baku: cinemas, music venues, parks and entertainment. Budget-friendly things to do after class.' } },
  'azerbaijan-weather-seasons-guide': { metaTitle: { en: 'Azerbaijan Weather & Seasons — Student Guide' }, metaDescription: { en: 'What to expect from Azerbaijan weather: seasonal temperatures, what to pack and how weather affects student life.' } },
  'azerbaijan-public-transport-guide': { metaTitle: { en: 'Azerbaijan Public Transport Guide — Baku Metro & Buses' }, metaDescription: { en: 'Complete student guide to public transport in Azerbaijan: metro, buses, BakuCard and inter-city travel with costs.' } },
  'azerbaijan-safety-travel-tips': { metaTitle: { en: 'Azerbaijan Safety Tips for International Students' }, metaDescription: { en: 'Is Azerbaijan safe? Safety tips, emergency contacts and travel advice for international students studying in Azerbaijan.' } },
  'azerbaijan-healthcare-student-guide': { metaTitle: { en: 'Healthcare in Azerbaijan — Student Medical Guide' }, metaDescription: { en: 'Healthcare options for international students in Azerbaijan: insurance requirements, hospitals and emergency services.' } },
  'azerbaijan-culture-etiquette-guide': { metaTitle: { en: 'Azerbaijan Culture & Etiquette — Student Guide' }, metaDescription: { en: 'Understand Azerbaijani culture: customs, etiquette, religion and social norms for international students.' } },
  'bank-account-setup-azerbaijan': { metaTitle: { en: 'How to Open a Bank Account in Azerbaijan as a Student' }, metaDescription: { en: 'Step-by-step guide to opening a bank account in Azerbaijan for international students: required documents and best banks.' } },
};

// Strategy: for each post, find its closing `readingMinutes:` line and add faqs, metaTitle, metaDescription, updatedAt before it
let editCount = 0;

for (const [slug, faqs] of Object.entries(faqData)) {
  const meta = metaData[slug];
  
  // Find the post block by slug
  const slugPattern = `slug: "${slug}"`;
  const slugIdx = content.indexOf(slugPattern);
  if (slugIdx === -1) {
    console.log(`SKIP: slug "${slug}" not found`);
    continue;
  }

  // Find the readingMinutes line after this slug
  const afterSlug = content.substring(slugIdx);
  const rmMatch = afterSlug.match(/readingMinutes:\s*(\d+)/);
  if (!rmMatch) {
    console.log(`SKIP: readingMinutes not found for ${slug}`);
    continue;
  }
  
  const rmIdx = slugIdx + afterSlug.indexOf(rmMatch[0]);
  const insertPoint = rmIdx + rmMatch[0].length;
  
  // Check if faqs already exist
  const nearbyText = content.substring(slugIdx, insertPoint + 200);
  if (nearbyText.includes('faqs:')) {
    console.log(`SKIP: ${slug} already has faqs`);
    continue;
  }
  
  // Build the insertion text
  let insertion = ',\n    readingMinutes: ' + rmMatch[1];
  
  // Build the faqs array
  const faqLines = faqs.map(fq => `      { q: "${fq.q.replace(/"/g, '\\"')}", a: "${fq.a.replace(/"/g, '\\"').replace(/\\\\'/g, "\\'")}" }`);
  
  insertion = ',\n';
  insertion += `    readingMinutes: ${rmMatch[1]},\n`;
  insertion += `    updatedAt: "2025-08-25",\n`;
  
  if (meta) {
    const metaTitleEn = meta.metaTitle?.en?.replace(/"/g, '\\"') || '';
    const metaDescEn = meta.metaDescription?.en?.replace(/"/g, '\\"') || '';
    insertion += `    metaTitle: {\n      en: "${metaTitleEn}",\n    },\n`;
    insertion += `    metaDescription: {\n      en: "${metaDescEn}",\n    },\n`;
  }
  
  insertion += `    faqs: [\n${faqLines.join(',\n')},\n    ],`;
  
  // Replace: remove old readingMinutes line and add new content
  const oldReadingMinutes = `readingMinutes: ${rmMatch[1]}`;
  const newContent = `readingMinutes: ${rmMatch[1]},\n    updatedAt: "2025-08-25",${meta ? `\n    metaTitle: {\n      en: "${meta.metaTitle?.en?.replace(/"/g, '\\"') || ''}",\n    },\n    metaDescription: {\n      en: "${meta.metaDescription?.en?.replace(/"/g, '\\"') || ''}",\n    },` : ''}\n    faqs: [\n${faqLines.join(',\n')},\n    ],`;
  
  // Find the exact old string
  const searchStr = `readingMinutes: ${rmMatch[1]},\n  },`;
  const replaceStr = `readingMinutes: ${rmMatch[1]},\n    updatedAt: "2025-08-25",${meta ? `\n    metaTitle: {\n      en: "${meta.metaTitle?.en?.replace(/"/g, '\\"') || ''}",\n    },\n    metaDescription: {\n      en: "${meta.metaDescription?.en?.replace(/"/g, '\\"') || ''}",\n    },` : ''}\n    faqs: [\n${faqLines.join(',\n')},\n    ],\n  },`;
  
  if (content.includes(searchStr)) {
    content = content.replace(searchStr, replaceStr);
    editCount++;
    console.log(`OK: ${slug}`);
  } else {
    console.log(`SKIP: search string not found for ${slug}`);
  }
}

writeFileSync(filePath, content, 'utf8');
console.log(`\nDone! Updated ${editCount} blog posts with FAQs and meta data.`);

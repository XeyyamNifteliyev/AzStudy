#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';

const filePath = 'src/lib/seed/blog.ts';
let content = readFileSync(filePath, 'utf8');

const faqData = {
  'top-10-must-visit-places-in-azerbaijan': [
    { q: 'What are the must-visit places in Azerbaijan for students?', a: 'Icherisheher (Old City), Flame Towers, Gobustan National Park, Maiden Tower, Heydar Aliyev Center, Yanar Dag, Sheki Khan Palace, and the Absheron Peninsula are top student destinations.' },
    { q: 'How much does it cost to visit tourist attractions in Azerbaijan?', a: 'Many attractions are free (Flame Towers viewpoint, Old City walking). Paid attractions range from $2-10. Student discounts are available at most museums.' },
  ],
  'student-life-in-baku-azerbaijan': [
    { q: 'What is student life like in Baku?', a: 'Baku offers a vibrant student scene with modern campuses, affordable cafes, waterfront walks, cultural events, and a mix of traditional and contemporary entertainment.' },
    { q: 'Where do international students live in Baku?', a: 'Most international students live in university dormitories ($50-150/month) or shared apartments in the city center ($200-400/month).' },
  ],
  'best-universities-medicine-azerbaijan': [
    { q: 'Which are the best medical universities in Azerbaijan?', a: 'Azerbaijan Medical University (AMU) is the leading medical school, followed by ADA University health programs. Both offer WHO-recognized general medicine and dentistry programs.' },
    { q: 'How much does medical school cost in Azerbaijan?', a: 'General medicine programs cost $3,000-8,000/year at state universities and $8,000-15,000/year at private institutions. Duration is 6 years for MBBS equivalent.' },
    { q: 'Are medical degrees from Azerbaijan recognized internationally?', a: 'Yes. AMU degrees are recognized by WHO, and graduates can sit for USMLE, PLAB and other international licensing exams.' },
  ],
  'azerbaijan-best-budget-study-destination': [
    { q: 'Why is Azerbaijan a budget-friendly study destination?', a: 'State university tuition starts at $600/year, living costs are $270-600/month, and government scholarships cover full tuition plus accommodation for qualified students.' },
    { q: 'How does Azerbaijan compare cost-wise to Turkey or Russia?', a: 'Azerbaijan is 20-40% cheaper than Turkey and 15-30% cheaper than Russia for comparable programs, with lower living costs and similar quality of education.' },
  ],
  'azerbaijani-culture-traditions-guide': [
    { q: 'What are important Azerbaijani cultural traditions for students to know?', a: 'Hospitality (offering tea), tea culture, Novruz celebrations, mugham music, carpet weaving, and the importance of family and respect for elders are key traditions.' },
    { q: 'Is Azerbaijan a religious country?', a: 'Azerbaijan is officially secular. While predominantly Muslim, the country practices a moderate, tolerant form. Mosques, churches and synagogues coexist peacefully.' },
  ],
  'azerbaijan-weather-climate-students': [
    { q: 'What is the climate like in Azerbaijan?', a: 'Azerbaijan has diverse microclimates: Baku is windy with mild winters (0-8C) and warm summers (25-35C). Mountain regions are colder; southern lowlands are subtropical.' },
    { q: 'What should students pack for Azerbaijan?', a: 'Layered clothing for variable weather, a windproof jacket for Baku, comfortable walking shoes, and an umbrella. Summers are warm; winters require warm clothing.' },
  ],
  'best-day-trips-from-baku': [
    { q: 'What are the best day trips from Baku for students?', a: 'Gobustan rock art reserve, mud volcanoes, Absheron peninsula, Sheki (3-hour train), Naftalan oil baths, and Gabala adventure park are popular student day trips.' },
    { q: 'How much do day trips from Baku cost?', a: 'Organized tours cost $15-50. Public transport to nearby destinations costs $2-5. Gobustan national park entrance is $5 for students.' },
  ],
  'azerbaijan-vs-turkey-study-abroad': [
    { q: 'Should I study in Azerbaijan or Turkey?', a: 'Azerbaijan offers lower tuition ($600-2,000 vs $2,000-10,000 in Turkey), lower living costs, and a growing international education sector. Turkey has more universities and global recognition.' },
    { q: 'Which country has better scholarship opportunities?', a: 'Both countries offer government scholarships. Azerbaijan Turkiye Burslari is generous; Azerbaijan Government Scholarship covers full costs. Application competition varies by year.' },
    { q: 'Are degrees from Azerbaijan or Turkey more recognized?', a: 'Turkish universities generally have higher global rankings and more international recognition. However, Azerbaijani degrees from accredited institutions are accepted in most countries.' },
  ],
  'student-visa-azerbaijan-complete-guide': [
    { q: 'How do I get a student visa for Azerbaijan?', a: 'After receiving your acceptance letter, apply at the nearest Azerbaijani consulate with: passport, acceptance letter, financial proof, photos, and medical certificate. Processing takes 2-4 weeks.' },
    { q: 'How long is a student visa valid in Azerbaijan?', a: 'Initial student visas are valid for the duration of your first academic year. You then convert to a residence permit, renewable annually for the duration of your studies.' },
    { q: 'Do I need to register after arriving in Azerbaijan?', a: 'Yes. You must register with the State Migration Service within 30 days of arrival. Your university international office typically assists with this process.' },
    { q: 'Can I work on a student visa in Azerbaijan?', a: 'Yes. Student visa holders can apply for a work permit for part-time employment (up to 20 hours/week) after registering with migration services.' },
  ],
  'top-engineering-programs-azerbaijan': [
    { q: 'What are the best engineering programs in Azerbaijan?', a: 'Top engineering fields: petroleum engineering (ASOIU), civil engineering (AzMIU), computer science (BSU), electrical engineering (ADNSU), and telecommunications (ADNSU).' },
    { q: 'How much do engineering programs cost in Azerbaijan?', a: 'State university engineering programs cost $800-2,500/year. Private institutions like Khazar charge $5,000-10,000/year. Scholarships reduce costs significantly.' },
  ],
};

let editCount = 0;

for (const [slug, faqs] of Object.entries(faqData)) {
  const slugPattern = `slug: "${slug}"`;
  const slugIdx = content.indexOf(slugPattern);
  if (slugIdx === -1) { console.log(`SKIP: ${slug} not found`); continue; }

  const afterSlug = content.substring(slugIdx);
  const rmMatch = afterSlug.match(/readingMinutes:\s*(\d+)/);
  if (!rmMatch) { console.log(`SKIP: readingMinutes not found for ${slug}`); continue; }
  
  const rmIdx = slugIdx + afterSlug.indexOf(rmMatch[0]);
  const insertPoint = rmIdx + rmMatch[0].length;
  
  // Check if faqs already exist
  const nearbyText = content.substring(slugIdx, insertPoint + 50);
  if (nearbyText.includes('faqs:')) { console.log(`SKIP: ${slug} already has faqs`); continue; }
  
  // Build faq lines
  const faqLines = faqs.map(fq => `      { q: ${JSON.stringify(fq.q)}, a: ${JSON.stringify(fq.a)} }`);
  
  // The readingMinutes line might or might not have trailing comma
  const readingMinutesLine = `readingMinutes: ${rmMatch[1]}`;
  const readingMinutesLineComma = `readingMinutes: ${rmMatch[1]},`;
  
  // Find the closing },  after this post
  const closingPattern = `\n  },\n`;
  const closingIdx = content.indexOf(closingPattern, insertPoint);
  if (closingIdx === -1) { console.log(`SKIP: closing not found for ${slug}`); continue; }
  
  // Replace the readingMinutes + closing block
  const oldBlock = content.substring(rmIdx, closingIdx + 3); // up to "  },"
  const newBlock = `readingMinutes: ${rmMatch[1]},\n    updatedAt: "2025-08-25",\n    faqs: [\n${faqLines.join(',\n')},\n    ],\n  },`;
  
  content = content.substring(0, rmIdx) + newBlock + content.substring(closingIdx + 3);
  editCount++;
  console.log(`OK: ${slug}`);
}

writeFileSync(filePath, content, 'utf8');
console.log(`\nDone! Updated ${editCount} blog posts.`);

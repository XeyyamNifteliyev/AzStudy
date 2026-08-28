#!/usr/bin/env node
/**
 * Fix all broken description translations.
 * Problem: slug names (e.g. "baku-state-university") were used as university names
 * in template-based translations. This script replaces them with proper nameI18n names.
 */
import { readFileSync, writeFileSync } from 'fs';

const filePath = 'src/lib/seed/universities.ts';
let content = readFileSync(filePath, 'utf8');

// Languages that need fixing (template-based)
const langsToFix = ['ar', 'fa', 'tk', 'kk', 'ky', 'bg', 'ur', 'uz', 'sw', 'so', 'id'];

// Known bad patterns — slug as name in description
const slugPattern = /^[a-z0-9-]+\s/;

function parseUniversityBlocks(content) {
  const blocks = [];
  const regex = /\{\s*\n\s*id:\s*'([^']+)'/g;
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    const startIdx = match.index;
    
    // Find slug
    const slugMatch = content.substring(startIdx, startIdx + 2000).match(/slug:\s*'([^']+)'/);
    if (!slugMatch) continue;
    const slug = slugMatch[1];
    
    // Find nameI18n block (before description)
    const nameI18nMatch = content.substring(startIdx, startIdx + 3000).match(/nameI18n:\s*\{/);
    if (!nameI18nMatch) continue;
    
    const nameI18nStart = startIdx + nameI18nMatch.index;
    let depth = 0, i = nameI18nStart + nameI18nMatch[0].length - 1, nameI18nEnd = -1;
    while (i < content.length) {
      if (content[i] === '{') depth++;
      else if (content[i] === '}') {
        if (depth === 0) { nameI18nEnd = i + 1; break; }
        depth--;
      }
      i++;
    }
    if (nameI18nEnd === -1) continue;
    
    const nameI18nBlock = content.substring(nameI18nStart, nameI18nEnd);
    const names = {};
    // Parse nameI18n entries
    const nameRegex = /(\w+):\s*'([^']*)'/g;
    let nm;
    while ((nm = nameRegex.exec(nameI18nBlock)) !== null) {
      names[nm[1]] = nm[2];
    }
    
    // Find description block
    const descSearch = content.substring(nameI18nEnd, nameI18nEnd + 3000);
    const descMatch = descSearch.match(/description:\s*\{/);
    if (!descMatch) continue;
    
    const descStart = nameI18nEnd + descMatch.index;
    depth = 0;
    i = descStart + descMatch[0].length - 1;
    let descEnd = -1;
    while (i < content.length) {
      if (content[i] === '{') depth++;
      else if (content[i] === '}') {
        if (depth === 0) { descEnd = i + 1; break; }
        depth--;
      }
      i++;
    }
    if (descEnd === -1) continue;
    
    blocks.push({ slug, names, descStart, descEnd, descBlock: content.substring(descStart, descEnd) });
  }
  
  return blocks;
}

const blocks = parseUniversityBlocks(content);
console.log(`Found ${blocks.length} university blocks`);

// Build proper descriptions for each university
const properDescriptions = {
  'baku-state-university': {
    en: 'Baku State University (BSU) is the oldest and largest university in Azerbaijan, founded in 1919. It offers a wide range of programs across sciences, humanities, law, medicine and engineering.',
    az: 'Bakı Dövlət Universiteti (BDU) Azərbaycanın ən qədim və ən iri universitetidir, 1919-ci ildə təsis olunmuşdur. Elm, humanitar elmlər, hüquq, tibb və mühəndislik sahələrində geniş proqramlar təklif edir.',
    tr: 'Bakü Devlet Üniversitesi (BSU), 1919\'da kurulan Azerbaycan\'ın en eski ve en büyük üniversitesidir. Fen, sosyal bilimler, hukuk, tıp ve mühendislik alanlarında geniş programlar sunmaktadır.',
    ru: 'Бакинский государственный университет (БГУ) — старейший и крупнейший университет Азербайджана, основанный в 1919 году. Предлагает широкий спектр программ в области науки, гуманитарных наук, права, медицины и инженерии.',
    de: 'Die Staatliche Universität Baku (BSU) ist die älteste und größte Universität Aserbaidschans, gegründet 1919. Sie bietet ein breites Spektrum an Programmen in Naturwissenschaften, Geisteswissenschaften, Recht, Medizin und Ingenieurwesen.',
    fr: 'L\'Université d\'État de Bakou (BSU) est la plus ancienne et la plus grande université d\'Azerbaïdjan, fondée en 1919. Elle propose un large éventail de programmes en sciences, sciences humaines, droit, médecine et ingénierie.',
    zh: '巴库国立大学（BSU）是阿塞拜疆最古老、规模最大的大学，成立于1919年。该校提供科学、人文、法律、医学和工程等多个领域的广泛课程。',
    ar: 'جامعة باكو الحكومية (بوجا) هي أقدم وأكبر جامعة في أذربيجان، تأسست عام 1919. تقدم مجموعة واسعة من البرامج في العلوم والآداب والقانون والطب والهندسة.',
    fa: 'دانشگاه دولتی باکو (بوجا) قدیمی‌ترین و بزرگ‌ترین دانشگاه آذربایجان است که در سال 1919 تأسیس شده است. این دانشگاه طیف گسترده‌ای از رشته‌ها در علوم، علوم انسانی، حقوق، پزشکی و مهندسی ارائه می‌دهد.',
    tk: 'Bakü Döwlet Uniwersiteti (BSU) Azerbaýjanýň iň gadym we iň uly uniwersitetidir, 1919-njýyl döredilen. Ol, fen, humanitar, hukuk, tıb we muhandislik sahalarýnda giň giň programlar gurnaýar.',
    kk: 'Баку мемлекеттік университеті (БМУ) — Азербайджанның ең кәрі және ең үлкен университеті, 1919 жылы құрылған. Ол ғылым, гуманитарлық ғылымдар, құқық, медицина және инженерия салаларында кең бағдарламалар ұсынады.',
    ky: 'Баку мамлекеттик университети (БМУ) — Азербайджандын эң байыркы жана эң чоң университети, 1919-жылы түзүлгөн. Ал илим, гуманитардык илимдер, укук, дарыгерлик жана инженердик тармактарда кеңири программаларды сунат.',
    bg: 'Бакинският държавен университет (БДУ) е най-старият и най-голям университет в Азербайджан, основан през 1919 г. Предлага широк спектър от програми в областта на науките, хуманитарните науки, правото, медицината и инженерството.',
    ur: 'یونیورسٹی باکو اسٹیٹ (بی ایس یو) آذربائیجان کی سب سے پرانی اور سب سے بڑی یونیورسٹی ہے جو 1919 میں قائم ہوئی۔ یہ سائنس، ہیومنیٹیز، قانون، طب اور انجینئرنگ میں وسیع پروگرامز پیش کرتی ہے۔',
    uz: 'Boku davlat universiteti (BDU) Ozarbayjonning eng qadimgi va eng katta universiteti, 1919-yilda tashkil etilgan. Fan, gumanitar fanlar, huquq, tibbiyot va muhandislik sohalarida keng dasturlarni taklif etadi.',
    sw: 'Chuo Kikuu cha Baku (BSU) ni chuo kikuu cha zamani zaidi na kikubwa zaidi nchini Azerbaijan, kilianzishwa mwaka wa 1919. Kinatoa programu mbalimbali katika sayansi, sayansi za kijamii, sheria, tiba na uhandisi.',
    so: 'Jaamacadda Dawladda ee Baku (BSU) waa jaamacadda ugu da\'da weyn iyo ugu weyn ee Azerbaijan, la aasaasay 1919. Waxay bixisa barnaamijyo badan oo ku saabsan sayniska, culuunta, sharciga, caafimaadka iyo injineerinka.',
    id: 'Universitas Negeri Baku (BSU) adalah universitas tertua dan terbesar di Azerbaijan, didirikan pada tahun 1919. Universitas ini menawarkan berbagai program dalam sains, humaniora, hukum, kedokteran, dan teknik.',
  },
  'azerbaijan-diplomatic-academy': {
    en: 'ADA University is a leading international university in Baku, offering programs in international relations, public policy, business and computer science in English.',
    az: 'ADA Universiteti Bakıda beynəlxalq münasibətlər, dövlət siyasəti, biznes və kompüter elmləri sahələrində ingilis dilində proqramlar təklif edən aparıcı beynəlxalq universitetdir.',
    tr: 'ADA Üniversitesi, Bakü\'de uluslararası ilişkiler, kamu politikası, işletme ve bilgisayar bilimleri alanlarında İngilizce programlar sunan önde gelen bir uluslararası üniversitedir.',
    ru: 'Университет ADA — ведущий международный университет в Баку, предлагающий программы по международным отношениям, государственной политике, бизнесу и информатике на английском языке.',
    de: 'Die ADA-Universität ist eine führende internationale Universität in Baku, die englischsprachige Programme in Politikwirtschaft, Informatik, Business und internationalen Beziehungen anbietet.',
    fr: 'L\'Université ADA est une université internationale de premier plan à Bakou, proposant des programmes en anglais en relations internationales, politique publique, commerce et informatique.',
    zh: 'ADA大学是巴库领先的国际大学，提供英语授课的国际关系、公共政策、商业和计算机科学等课程。',
    ar: 'جامعة ADA هي جامعة عالمية رائدة في باكو، تقدم برامج باللغة الإنجليزية في العلاقات الدولية والسياسة العامة والأعمال وعلوم الحاسوب.',
    fa: 'دانشگاه ADA یک دانشگاه بین‌المللی پیشرو در باکو است که برنامه‌هایی به زبان انگلیسی در روابط بین‌الملل، سیاست عمومی، کسب‌وکار و علوم کامپیوتر ارائه می‌دهد.',
    tk: 'ADA Uniwersiteti Bakýuda halkara mynasabatlar, seýyet siýaseti, buisnes we kompýuter ilmleri sahasýnda Iňlis dilinde programlar gurnaýan öndebaryjy halkara uniwersitetdir.',
    kk: 'ADA Университеті — Бакудағы жетекші халықаралық университет, халықаралық қарым-қатынастар, мемлекеттік саясат, бизнес және компьютер ғылымдары бойынша ағылшын тілінде бағдарламалар ұсынады.',
    ky: 'ADA Университети — Бакудагы жетекчи эл аралык университет, эл аралык мамилелер, мамлекеттик саясат, бизнес жана компьютер илимдери боюнча англис тилинде программаларды сунат.',
    bg: 'Университет ADA е водещ международен университет в Баку, предлагащ програми на английски език в областта на международните отношения, публичната политика, бизнеса и компютърните науки.',
    ur: 'یونیورسٹی ای ڈی اے بакو میں ایک شاندار بین الاقوامی یونیورسٹی ہے جو بین الاقوامی تعلقات، عوامی پالیسی، کاروبار اور کمپیوٹر سائنس میں انگریزی میں پروگرامز پیش کرتی ہے۔',
    uz: 'ADA Universiteti Bokuda xalqaro munosabatlar, siyosat, biznes va kompyuter fanlari bo\'yicha ingliz tilida dasturlarni taklif etuvchi yetakchi xalqaro universitet.',
    sw: 'Chuo Kikuu cha ADA ni chuo kikuu kimoja kinachofanya kazi kimataifa nchini Azerbaijan, kinachotoa programu kwa Kiingereza katika uhusiano wa kimataifa, siasa, biashara na sayansi ya kompyuta.',
    so: 'Jaamacadda ADA waa jaamacad caalami ah oo hogaaminaysa ee Azerbaijan, oo bixisa barnaamijyo Ingiriisi ku qoran oo ku saabsan xiriirka caalamiga ah, siyaasadda, ganacsiga iyo sayniska kombuyuutarka.',
    id: 'Universitas ADA adalah universitas internasional unggulan di Azerbaijan, menawarkan program berbahasa Inggris dalam hubungan internasional, kebijakan publik, bisnis, dan ilmu komputer.',
  },
};

// For universities not in properDescriptions, generate from nameI18n + EN
function generateFromNameI18n(nameI18n, enDesc, slug) {
  const result = {};
  for (const lang of langsToFix) {
    const name = nameI18n[lang] || nameI18n.en || slug;
    
    // Extract year from EN description
    const yearMatch = enDesc.match(/founded in (\d{4})|established in (\d{4})|founded (\d{4})/i);
    const year = yearMatch ? (yearMatch[1] || yearMatch[2] || yearMatch[3]) : null;
    
    // Generate description based on name and year
    const templates = {
      ar: (n, y) => y ? `جامعة ${n} هي جامعة رائدة في أذربيجان، تأسست عام ${y}.` : `جامعة ${n} هي جامعة رائدة في أذربيجان.`,
      fa: (n, y) => y ? `دانشگاه ${n} یک دانشگاه پیشرو در آذربایجان است که در سال ${y} تأسیس شده است.` : `دانشگاه ${n} یک دانشگاه پیشرو در آذربایجان است.`,
      tk: (n, y) => y ? `${n} ${y}-njýyl döredilen Azerbaýjanýň öndebaryjy uniwersitetidir.` : `${n} Azerbaýjanýň öndebaryjy uniwersitetleriniň biridir.`,
      kk: (n, y) => y ? `${n} ${y} жылы құрылған Азербайджанның жетекші университеті.` : `${n} — Азербайджанның жетекші университеті.`,
      ky: (n, y) => y ? `${n} ${y}-жылы түзүлгөн Азербайджандын жетекчи университети.` : `${n} — Азербайджандын жетекчи университети.`,
      bg: (n, y) => y ? `${n} е водещ университет в Азербайджан, основан през ${y} г.` : `${n} е водещ университет в Азербайджан.`,
      ur: (n, y) => y ? `${n} آذربائیجان میں ایک شاندار یونیورسٹی ہے جو ${y} میں قائم ہوئی۔` : `${n} آذربائیجان میں ایک شاندار یونیورسٹی ہے۔`,
      uz: (n, y) => y ? `${n} ${y}-yilda tashkil etilgan Ozarbayjonning yetakchi universiteti.` : `${n} Ozarbayjonning yetakchi universiteti.`,
      sw: (n, y) => y ? `${n} ni chuo kikuu kinachoongoza nchini Azerbaijan, kilianzishwa mwaka wa ${y}.` : `${n} ni chuo kikuu kinachoongoza nchini Azerbaijan.`,
      so: (n, y) => y ? `${n} waa jaamacad hogaaminaysa ee Azerbaijan, la aasaasay ${y}.` : `${n} waa jaamacad hogaaminaysa ee Azerbaijan.`,
      id: (n, y) => y ? `${n} adalah universitas unggulan di Azerbaijan, didirikan pada tahun ${y}.` : `${n} adalah universitas unggulan di Azerbaijan.`,
    };
    
    result[lang] = templates[lang] ? templates[lang](name, year) : enDesc;
  }
  return result;
}

let totalFixed = 0;

for (const block of blocks) {
  const enDesc = block.names.en || '';
  
  // Check if descriptions need fixing
  const descContent = block.descBlock;
  let needsFix = false;
  
  for (const lang of langsToFix) {
    const langRegex = new RegExp(`${lang}:\\s*'([^']*)'`);
    const langMatch = descContent.match(langRegex);
    if (!langMatch) { needsFix = true; break; }
    const val = langMatch[1];
    // Check if value starts with a slug
    if (/^[a-z][a-z0-9-]+\s/.test(val)) {
      needsFix = true;
      break;
    }
  }
  
  if (!needsFix) continue;
  
  // Get EN description from desc block
  const enDescMatch = descContent.match(/en:\s*'((?:[^'\\]|\\.)*)'/);
  if (!enDescMatch) continue;
  const enDescription = enDescMatch[1];
  
  // Generate proper descriptions
  const newDescs = generateFromNameI18n(block.names, enDescription, block.slug);
  
  // Replace each lang's description in the file
  for (const lang of langsToFix) {
    const val = newDescs[lang];
    if (!val) continue;
    
    // Find and replace the specific lang entry in description block
    const langRegex = new RegExp(`(\\s*${lang}:\\s*')((?:[^'\\\\]|\\\\.)*)(')`);
    const matchInBlock = descContent.match(langRegex);
    if (!matchInBlock) continue;
    
    // Escape single quotes
    const escaped = val.replace(/'/g, "\\'");
    const oldStr = matchInBlock[0];
    const newStr = `\n      ${lang}: '${escaped}'`;
    
    // Find this exact occurrence in the full content
    const searchFrom = block.descStart;
    const fullMatch = content.substring(searchFrom, block.descEnd).match(langRegex);
    if (fullMatch) {
      const posInContent = content.indexOf(fullMatch[0], searchFrom);
      if (posInContent !== -1) {
        content = content.substring(0, posInContent) + newStr + content.substring(posInContent + fullMatch[0].length);
        totalFixed++;
      }
    }
  }
}

console.log(`Fixed ${totalFixed} description entries`);

// Verify syntax
let braceCount = 0;
for (const char of content) {
  if (char === '{') braceCount++;
  else if (char === '}') braceCount--;
}
console.log(`Brace balance: ${braceCount === 0 ? 'OK ✓' : 'ERROR (' + braceCount + ')'}`);

writeFileSync(filePath, content, 'utf8');
console.log('File saved!');

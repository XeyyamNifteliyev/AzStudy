#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';

const filePath = 'src/lib/seed/universities.ts';
let content = readFileSync(filePath, 'utf8');

// BSU fixes (lines 71-81)
const bsuFixes = [
  ["ar: 'baku-state-university هي جامعة عالمية تسست في السنة 1919، تقدم برامج في مجال التعليم العالي والبحث العلمي في أذربايجان.'",
   "ar: 'جامعة باكو الحكومية (بوجا) هي أقدم وأكبر جامعة في أذربيجان، تأسست عام 1919. تقدم مجموعة واسعة من البرامج في العلوم والآداب والقانون والطب والهندسة.'"],
  ["fa: 'baku-state-university دانشگاهی بین‌المللی است که در سال 1919 تاسیس شده است، رشتهای گسترده در تعلیمات بین‌المللی و تحقق در آذربایجان.'",
   "fa: 'دانشگاه دولتی باکو (بوجا) قدیمی‌ترین و بزرگ‌ترین دانشگاه آذربایجان است که در سال 1919 تأسیس شده است. این دانشگاه طیف گسترده‌ای از رشته‌ها در علوم، علوم انسانی، حقوق، پزشکی و مهندسی ارائه می‌دهد.'"],
  ["tk: 'baku-state-university 1919-njýyl döredilen halkara uniwersitet bolup, Azerbağanyň ixtisaslaşmyş programlaryny gağyryar.'",
   "tk: 'Bakü Döwlet Uniwersiteti (BSU) Azerbaýjanýň iň gadym we iň uly uniwersitetidir, 1919-njýyl döredilen. Ol, fen, humanitar, hukuk, tıb we muhandislik sahalarýnda giň giň programlar gurnaýar.'"],
  ["kk: 'baku-state-university 1919 жылы құрылган халықаралық университет болып, Азербайжанда білим голдарлық білим университеттерінін бірі.'",
   "kk: 'Баку мемлекеттік университеті (БМУ) — Азербайджанның ең кәрі және ең үлкен университеті, 1919 жылы құрылған. Ол ғылым, гуманитарлық ғылымдар, құқық, медицина және инженерия салаларында кең бағдарламалар ұсынады.'"],
  ["ky: 'baku-state-university 1919-жыл түздөлгөн эл аралык университети, Азербайжандын эл иштиликтуу университеттеринин бири.'",
   "ky: 'Баку мамлекеттик университети (БМУ) — Азербайджандын эң байыркы жана эң чоң университети, 1919-жылы түзүлгөн. Ал илим, гуманитардык илимдер, укук, дарыгерлик жана инженердик тармактарда кеңири программаларды сунат.'"],
  ["bg: 'baku-state-university е международен университет, създаден през 1919 година, който предлага програми за образование и наука в Азербайджан.'",
   "bg: 'Бакинският държавен университет (БДУ) е най-старият и най-голям университет в Азербайджан, основан през 1919 г. Предлага широк спектър от програми в областта на науките, хуманитарните науки, правото, медицината и инженерството.'"],
  ["ur: 'baku-state-university 1919 میں قاموظ والقوم یونیورسٹی هو، جس آذربائجان میں تعلیماتی کا المقدم کرتا هوءے، جس بین القوم و تعلیم میں شمارہ دیتی هوءے، جس اس آذربائجان میں بین المقدم کرتا هوے، جس اس علم و تعلیم میں شمارہ دیتی هوے، جس اس کوئی ناظرات بین القوم دیتی هوے، جس اس علم و مهندسی اصلاح بل مشترک فروحیت کرتا هوے.'",
   "ur: 'یونیورسٹی باکو اسٹیٹ (بی ایس یو) آذربائیجان کی سب سے پرانی اور سب سے بڑی یونیورسٹی ہے جو 1919 میں قائم ہوئی۔ یہ سائنس، ہیومنیٹیز، قانون، طب اور انجینئرنگ میں وسیع پروگرامز پیش کرتی ہے۔'"],
  ["uz: 'baku-state-university 1919-yilda tashkil etilgan xalqaro universitet boʻlib, Ozarbayjonda taʻlim va ilmiy tadqiqotlar sohasida faol ishtirok etadi.'",
   "uz: 'Boku davlat universiteti (BDU) Ozarbayjonning eng qadimgi va eng katta universiteti, 1919-yilda tashkil etilgan. Fan, gumanitar fanlar, huquq, tibbiyot va muhandislik sohalarida keng dasturlarni taklif etadi.'"],
  ["sw: 'baku-state-university ni chuo kikuu cha kimataifa kilianzishwa mwaka wa 1919, kinachotoa programu mbalimbali za elimu na utafiti nchini Azerbaijan.'",
   "sw: 'Chuo Kikuu cha Baku (BSU) ni chuo kikuu cha zamani zaidi na kikubwa zaidi nchini Azerbaijan, kilianzishwa mwaka wa 1919. Kinatoa programu mbalimbali katika sayansi, sayansi za kijamii, sheria, tiba na uhandisi.'"],
  ["so: 'baku-state-university waa jaamacad caalami ah oo la aasaasay 1919, waxayna bixisaa barnaamijyo waxbarasho iyo ra'yiga ah ee Azerbaijan.'",
   "so: 'Jaamacadda Dawladda ee Baku (BSU) waa jaamacadda ugu da\\'da weyn iyo ugu weyn ee Azerbaijan, la aasaasay 1919. Waxay bixisa barnaamijyo badan oo ku saabsan sayniska, culuunta, sharciga, caafimaadka iyo injineerinka.'"],
  ["id: 'baku-state-university adalah universitas internasional yang didirikan pada tahun 1919, menawarkan program pendidikan dan penelitian di Azerbaijan.'",
   "id: 'Universitas Negeri Baku (BSU) adalah universitas tertua dan terbesar di Azerbaijan, didirikan pada tahun 1919. Universitas ini menawarkan berbagai program dalam sains, humaniora, hukum, kedokteran, dan teknik.'"],
];

// ADA fixes
const adaFixes = [
  ["ar: 'azerbaijan-diplomatic-academy دانشگاهی بین‌المللی است که رشتهای گسترده در تعلیمات بین‌المللی در آذربایجان است.'",
   "ar: 'جامعة ADA هي جامعة عالمية رائدة في باكو، تقدم برامج باللغة الإنجليزية في العلاقات الدولية والسياسة العامة والأعمال وعلوم الحاسوب.'"],
  ["fa: 'azerbaijan-diplomatic-academy دانشگاهی بین‌المللی است که رشتهای گسترده در تعلیمات بین‌المللی در آذربایجان است.'",
   "fa: 'دانشگاه ADA یک دانشگاه بین‌المللی پیشرو در باکو است که برنامه‌هایی به زبان انگلیسی در روابط بین‌الملل، سیاست عمومی، کسب‌وکار و علوم کامپیوتر ارائه می‌دهد.'"],
];

const allFixes = [...bsuFixes, ...adaFixes];
let count = 0;

for (const [oldStr, newStr] of allFixes) {
  if (content.includes(oldStr)) {
    content = content.replace(oldStr, newStr);
    count++;
    console.log(`Fixed: ${oldStr.substring(0, 40)}...`);
  } else {
    console.log(`Not found: ${oldStr.substring(0, 40)}...`);
  }
}

// Now fix ALL remaining universities with slug names in descriptions
// Find all lines where description starts with a slug pattern
const slugLines = content.match(/^      (ar|fa|tk|kk|ky|bg|ur|uz|sw|so|id): '[a-z][a-z0-9-]+ /gm);
if (slugLines) {
  console.log(`\nFound ${slugLines.length} more slug-named descriptions`);
  
  // For each, extract slug and replace with name from nameI18n
  for (const line of slugLines) {
    const match = line.match(/^      (\w+): '([a-z][a-z0-9-]+) /);
    if (!match) continue;
    const [, lang, slug] = match;
    
    // Find the university this description belongs to
    const lineIdx = content.indexOf(line);
    // Search backwards for the nearest slug: 'xxx'
    const beforeContent = content.substring(Math.max(0, lineIdx - 5000), lineIdx);
    const slugMatch = beforeContent.match(/slug:\s*'([^']+)'/g);
    if (!slugMatch) continue;
    const uniSlug = slugMatch[slugMatch.length - 1].match(/slug:\s*'([^']+)'/)[1];
    
    // Find nameI18n for this lang
    const nameI18nIdx = content.lastIndexOf('nameI18n: {', lineIdx);
    if (nameI18nIdx === -1) continue;
    
    let depth = 0, i = nameI18nIdx + 10, nameEnd = -1;
    while (i < content.length && i < nameI18nIdx + 3000) {
      if (content[i] === '{') depth++;
      else if (content[i] === '}') { if (depth === 0) { nameEnd = i; break; } depth--; }
      i++;
    }
    if (nameEnd === -1) continue;
    
    const nameBlock = content.substring(nameI18nIdx, nameEnd + 1);
    const nameRegex = new RegExp(`${lang}:\\s*'([^']*)'`);
    const nameMatch = nameBlock.match(nameRegex);
    
    let name;
    if (nameMatch && nameMatch[1]) {
      name = nameMatch[1];
    } else {
      // Fallback to English name
      const enMatch = nameBlock.match(/en:\s*'([^']*)'/);
      name = enMatch ? enMatch[1] : uniSlug;
    }
    
    // Replace the slug with the proper name
    const oldLine = line;
    const newLine = `      ${lang}: '${name} `;
    const currentLineIdx = content.indexOf(oldLine);
    if (currentLineIdx !== -1) {
      content = content.substring(0, currentLineIdx) + newLine + content.substring(currentLineIdx + oldLine.length);
      count++;
    }
  }
}

console.log(`\nTotal fixes: ${count}`);

// Verify
const remaining = content.match(/^      (ar|fa|tk|kk|ky|bg|ur|uz|sw|so|id): '[a-z][a-z0-9-]+ /gm);
console.log(`Remaining slug-named descriptions: ${remaining ? remaining.length : 0}`);

writeFileSync(filePath, content, 'utf8');
console.log('File saved!');

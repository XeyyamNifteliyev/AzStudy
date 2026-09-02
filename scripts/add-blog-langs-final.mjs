#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';

const filePath = 'src/lib/seed/blog.ts';
let content = readFileSync(filePath, 'utf8');

const allLangs = ['en','tr','az','ru','de','fr','zh','ar','fa','tk','kk','ky','bg','ur','uz','sw','so','id'];

const titleMap = {
  "top-10-must-visit-places-in-azerbaijan": {de:"Die besten Reiseziele in Aserbaidschan",fr:"Meilleures destinations en Azerbaïdjan",zh:"阿塞拜疆最佳旅游目的地",ar:"أفضل معالم السياحة في أذربيجان",fa:"بهترین مقاصد سیاحتی آذربایجان",tk:"Azerbaýjandyň iň gowy meşleri",kk:"Азербайджанның ең жақсы орындары",ky:"Азербайджандын эң жакшы жайлары",bg:"Най-добри дестинации",ur:"بہترین سیاحتی مقامات",uz:"Eng yaxshi sayohat joylari",sw:"Maeneo Bora ya Kusafiri",so:"Goobaha Ugu Fiican",id:"Destinasi Terbaik"},
  "student-life-in-baku-azerbaijan": {de:"Leben und Studium in Baku",fr:"Vivre et étudier à Bakou",zh:"在巴库学习和生活",ar:"الحياة والدراسة في باكو",fa:"زندگی و تحصیل در باکو",tk:"Bakýadadyk duýz we okuw",kk:"Бакыда тұру және оқу",ky:"Бакыда жашоо жана окуу",bg:"Живот и учение в Баку",ur:"باکو میں رہائش اور تعلیم",uz:"Bokuda yashash va o'qish",sw:"Kuishi na Kusoma Baku",so:"Noolaha iyo Waxbarashada Baku",id:"Living and Studying in Baku"},
  "best-universities-medicine-azerbaijan": {de:"Medizin in Aserbaidschan",fr:"Médecine en Azerbaïdjan",zh:"阿塞拜疆医学教育",ar:"الطب في أذربيجان",fa:"پزشکی در آذربایجان",tk:"Azerbaýjanda tibb",kk:"Азербайджанда медицина",ky:"Азербайджанда медицина",bg:"Медицина в Азербайджан",ur:"طب آذربائیجان میں",uz:"Tibbiyot",sw:"Tiba",so:"Caafimaad",id:"Kedokteran"},
  "azerbaijan-best-budget-study-destination": {de:"Aserbaidschan günstiges Studienziel",fr:"Azerbaïdjan destination abordable",zh:"阿塞拜疆经济型留学目的地",ar:"أذربيجان وجهة دراسة ميسورة",fa:"آذربایجان مقصد ارزان",tk:"Azerbaýjan archan bilim merkezi",kk:"Азербайджан арзан білім мекені",ky:"Азербайджан арзан билим мекени",bg:"Азербайджан достъпно образование",ur:"آذربائیجان سستی تعلیم",uz:"Ozarboyjon arzon ta'lim",sw:"Azerbaijan nafuu kwa elimu",so:"Azerbaijan qiimo jaban",id:"Azerbaijan budget"},
  "azerbaijani-culture-traditions-guide": {de:"Kultur und Traditionen",fr:"Culture et traditions",zh:"文化和传统指南",ar:"الثقافة والتقاليد",fa:"فرهنگ و سنت‌ها",tk:"Medeniýet we gelenekler",kk:"Мәдениет мен дәстүрлер",ky:"Маданият жана салт-адеттер",bg:"Култура и традиции",ur:"ثقافت اور روایات",uz:"Madaniyat va an'analar",sw:"Utamaduni na Mila",so:"Dhaqan iyo Dhaqan",id:"Budaya dan Tradisi"},
  "azerbaijan-weather-climate-students": {de:"Wetter und Klima",fr:"Météo et climat",zh:"天气和气候",ar:"الطقس والمناخ",fa:"آب و هوا",tk:"Howa we iklmy",kk:"Ауа райы",ky:"Аба ырайы",bg:"Време и климат",ur:"موسم اور آب و ہوا",uz:"Ob-havo va iqlim",sw:"Hali ya Hewa",so:"Cimilada",id:"Cuaca dan Iklim"},
  "azerbaijan-vs-turkey-study-abroad": {de:"Aserbaidschan vs Türkei",fr:"Azerbaïdjan vs Turquie",zh:"阿塞拜疆vs土耳其",ar:"أذربيجان مقابل تركيا",fa:"آذربایجان در برابر ترکیه",tk:"Azerbaýjan we Türkiýe",kk:"Азербайджан түрсімен",ky:"Азербайджан Түркиямен",bg:"Азербайджан срещу Турция",ur:"آذربائیجان بنامہ ترکیہ",uz:"Ozarboyjon va Turkiya",sw:"Azerbaijan dhidi ya Uturuki",so:"Azerbaijan vs Turkey",id:"Azerbaijan vs Turki"},
  "student-visa-azerbaijan-complete-guide": {de:"Studentenvisum Leitfaden",fr:"Visa étudiant guide",zh:"学生签证指南",ar:"دليل فيزا الطالب",fa:"راهنمای ویزای دانشجویی",tk:"Wiza giwlagy",kk:"Виза нұсқаулығы",ky:"Виза нускасы",bg:"Наръчник за виза",ur:"طالب علم ویزا رہنما",uz:"Talaba vizasi qo'llanmasi",sw:"Mwongozo wa Visa",so:"Hage Fiisaha",id:"Panduan Visa"},
  "top-engineering-programs-azerbaijan": {de:"Top Ingenieurprogramme",fr:"Meilleurs programmes",zh:"最佳工程项目",ar:"أفضل برامج الهندسة",fa:"بهترین برنامه‌های مهندسی",tk:"Iň iýi muhandislik",kk:"Үздік инженерлік",ky:"Эң мыкты инженердик",bg:"Най-добри инженерни",ur:"بہترین انجینئرنگ",uz:"Eng yaxshi muhandislik",sw:"Programu Bora",so:"Barnaamijyada Engineering",id:"Program Studi Teknik"}
};

const excerptMap = {
  "top-10-must-visit-places-in-azerbaijan": {de:"Die besten Reiseziele.",fr:"Meilleures destinations.",zh:"最佳旅游目的地。",ar:"أفضل معالم السياحة.",fa:"بهترین مقاصد سیاحتی.",tk:"Iň gowy meşleri.",kk:"Ең жақсы орындары.",ky:"Эң жакшы жайлары.",bg:"Най-добри дестинации.",ur:"بہترین مقامات.",uz:"Eng yaxshi joylar.",sw:"Maeneo Bora.",so:"Goobaha Ugu Fiican.",id:"Destinasi Terbaik."},
  "student-life-in-baku-azerbaijan": {de:"Studentenleben in Baku.",fr:"Vie étudiante à Bakou.",zh:"巴库学生生活。",ar:"حياة الطلاب في باكو.",fa:"زندگی دانشجویی در باکو.",tk:"Bakýadaky okuwalylar ömri.",kk:"Бакыдағы студенттік өмір.",ky:"Бакыдагы студенттик жашоо.",bg:"Студентски живот в Баку.",ur:"باکو میں طالب علم کی زندگی.",uz:"Bokuda talaba hayoti.",sw:"Maisha ya Wanafunzi Baku.",so:"Nolaha Ardayga Baku.",id:"Kehidupan Mahasiswa Baku."},
  "best-universities-medicine-azerbaijan": {de:"Medizinische Bildung.",fr:"Éducation médicale.",zh:"医学教育。",ar:"التعليم الطبي.",fa:"آموزش پزشکی.",tk:"Tibb bilimi.",kk:"Медициналық білім.",ky:"Медициналык билим.",bg:"Медицинско образование.",ur:"طبی تعلیم.",uz:"Tibbiyot ta'limi.",sw:"Elimu ya Matibabu.",so:"Waxbarashada Caafimaadka.",id:"Pendidikan Kedokteran."},
  "azerbaijan-best-budget-study-destination": {de:"Günstiges Studienziel.",fr:"Destination abordable.",zh:"经济型留学目的地。",ar:"وجهة دراسة ميسورة.",fa:"مقصد ارزان.",tk:"Archan bilim merkezi.",kk:"Арзан білім мекені.",ky:"Арзан билим мекени.",bg:"Достъпно образование.",ur:"سستی تعلیم کا مقصد.",uz:"Arzon ta'lim maskani.",sw:"Nafuu kwa elimu.",so:"Qiimo jaban waxbarasho.",id:"Destinasi budget."},
  "azerbaijani-culture-traditions-guide": {de:"Kultur und Traditionen.",fr:"Culture et traditions.",zh:"文化和传统。",ar:"الثقافة والتقاليد.",fa:"فرهنگ و سنت‌ها.",tk:"Medeniýet we gelenekler.",kk:"Мәдениет мен дәстүрлер.",ky:"Маданият жана салт-адеттер.",bg:"Култура и традиции.",ur:"ثقافت اور روایات.",uz:"Madaniyat va an'analar.",sw:"Utamaduni na Mila.",so:"Dhaqan iyo Dhaqan.",id:"Budaya dan Tradisi."},
  "azerbaijan-weather-climate-students": {de:"Wetter und Klima.",fr:"Météo et climat.",zh:"天气和气候。",ar:"الطقس والمناخ.",fa:"آب و هوا.",tk:"Howa we iklmy.",kk:"Ауа райы.",ky:"Аба ырайы.",bg:"Време и климат.",ur:"موسم.",uz:"Ob-havo.",sw:"Hali ya Hewa.",so:"Cimilada.",id:"Cuaca."},
  "azerbaijan-vs-turkey-study-abroad": {de:"Aserbaidschan vs Türkei.",fr:"Azerbaïdjan vs Turquie.",zh:"阿塞拜疆vs土耳其。",ar:"أذربيجان مقابل تركيا.",fa:"آذربایجان در برابر ترکیه.",tk:"Azerbaýjan we Türkiýe.",kk:"Азербайджан түрсімен.",ky:"Азербайджан Түркиямен.",bg:"Азербайджан срещу Турция.",ur:"آذربائیجان بنامہ ترکیہ.",uz:"Ozarboyjon va Turkiya.",sw:"Azerbaijan dhidi ya Uturuki.",so:"Azerbaijan vs Turkey.",id:"Azerbaijan vs Turki."},
  "student-visa-azerbaijan-complete-guide": {de:"Studentenvisum Leitfaden.",fr:"Visa étudiant guide.",zh:"学生签证指南。",ar:"دليل فيزا الطالب.",fa:"راهنمای ویزای دانشجویی.",tk:"Wiza giwlagy.",kk:"Виза нұсқаулығы.",ky:"Виза нускасы.",bg:"Наръчник за виза.",ur:"طالب علم ویزا رہنما.",uz:"Talaba vizasi qo'llanmasi.",sw:"Mwongozo wa Visa.",so:"Hage Fiisaha.",id:"Panduan Visa."},
  "top-engineering-programs-azerbaijan": {de:"Top Ingenieurprogramme.",fr:"Meilleurs programmes.",zh:"最佳工程项目。",ar:"أفضل برامج الهندسة.",fa:"بهترین برنامه‌ها.",tk:"Iň iýi muhandislik.",kk:"Үздік инженерлік.",ky:"Эң мыкты инженердик.",bg:"Най-добри инженерни.",ur:"بہترین انجینئرنگ.",uz:"Eng yaxshi muhandislik.",sw:"Programu Bora.",so:"Barnaamijyada Engineering.",id:"Program Studi Teknik."}
};

const lines = content.split('\n');
let result = [];
let currentSlug = '';
let inBlock = '';
let blockStartLine = -1;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const trimmed = line.trim();

  const slugMatch = trimmed.match(/slug: "([^"]+)"/);
  if (slugMatch) currentSlug = slugMatch[1];

  if (trimmed === 'title: {') { inBlock = 'title'; blockStartLine = i; }
  else if (trimmed === 'excerpt: {') { inBlock = 'excerpt'; blockStartLine = i; }

  if (inBlock && trimmed === '},') {
    const map = inBlock === 'title' ? titleMap : excerptMap;
    if (map[currentSlug]) {
      const existingLangs = [];
      for (let j = blockStartLine + 1; j < i; j++) {
        const t = lines[j].trim();
        for (const l of allLangs) {
          if (t.startsWith(l + ':') && !existingLangs.includes(l)) existingLangs.push(l);
        }
      }

      const missing = allLangs.filter(l => !existingLangs.includes(l));
      if (missing.length > 0) {
        // Find the last language line and ensure it has a comma
        for (let j = i - 1; j > blockStartLine; j--) {
          const t = lines[j].trim();
          for (const l of allLangs) {
            if (t.startsWith(l + ':') && !t.endsWith(',')) {
              // Add comma to the last language line
              lines[j] = lines[j].replace(/"(\s*)$/, '",');
              break;
            }
          }
          if (lines[j].trim().startsWith('ru:') || lines[j].trim().startsWith('az:') || lines[j].trim().startsWith('tr:')) break;
        }

        // Add missing languages
        for (const l of missing) {
          if (map[currentSlug][l]) {
            result.push('      ' + l + ': "' + map[currentSlug][l] + '",');
          }
        }
      }
    }
    inBlock = '';
  }

  result.push(lines[i]);
}

writeFileSync(filePath, result.join('\n'), 'utf8');
console.log('Added missing translations with comma fix');

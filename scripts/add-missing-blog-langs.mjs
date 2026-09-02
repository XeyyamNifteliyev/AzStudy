#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';

const filePath = 'src/lib/seed/blog.ts';
let content = readFileSync(filePath, 'utf8');

const allLangs = ['en','tr','az','ru','de','fr','zh','ar','fa','tk','kk','ky','bg','ur','uz','sw','so','id'];

// Translation maps keyed by slug
const titleMap = {
  "top-10-must-visit-places-in-azerbaijan": {de:"Die besten Reiseziele in Aserbaidschan",fr:"Meilleures destinations en Azerbaïdjan",zh:"阿塞拜疆最佳旅游目的地",ar:"أفضل معالم السياحة في أذربيجان",fa:"بهترین مقاصد سیاحتی آذربایجان",tk:"Azerbaýjandyň iň gowy meşleri",kk:"Азербайджанның ең жақсы орындары",ky:"Азербайджандын эң жакшы жайлары",bg:"Най-добри дестинации",ur:"بہترین سیاحتی مقامات",uz:"Eng yaxshi sayohat joylari",sw:"Maeneo Bora ya Kusafiri",so:"Goobaha Ugu Fiican",id:"Destinasi Terbaik"},
  "student-life-in-baku-azerbaijan": {de:"Leben und Studium in Baku",fr:"Vivre et étudier à Bakou",zh:"在巴库学习和生活",ar:"الحياة والدراسة في باكو",fa:"زندگی و تحصیل در باکو",tk:"Bakýadadyk duýz we okuw",kk:"Бакыда тұру және оқу",ky:"Бакыда жашоо жана окуу",bg:"Живот и учение в Баку",ur:"باکو میں رہائش اور تعلیم",uz:"Bokuda yashash va o'qish",sw:"Kuishi na Kusoma Baku",so:"Noolaha iyo Waxbarashada Baku",id:"Living and Studying in Baku"},
  "best-universities-medicine-azerbaijan": {de:"Medizin in Aserbaidschan",fr:"Médecine en Azerbaïdjan",zh:"阿塞拜疆医学教育",ar:"الطب في أذربيجان",fa:"پزشکی در آذربایجان",tk:"Azerbaýjanda tibb",kk:"Азербайджанда медицина",ky:"Азербайджанда медицина",bg:"Медицина в Азербайджан",ur:"طب آذربائیجان میں",uz:"Tibbiyot Ozarbayjonda",sw:"Tiba nchini Azerbaijan",so:"Caafimaad Azerbaijan",id:"Kedokteran di Azerbaijan"},
  "azerbaijan-best-budget-study-destination": {de:"Aserbaidschan günstiges Studienziel",fr:"Azerbaïdjan destination abordable",zh:"阿塞拜疆经济型留学目的地",ar:"أذربيجان وجهة دراسة ميسورة التكلفة",fa:"آذربایجان مقصد ارزان تحصیل",tk:"Azerbaýjan archan bilim merkezi",kk:"Азербайджан арзан білім мекені",ky:"Азербайджан арзан билим мекени",bg:"Азербайджан достъпно образование",ur:"آذربائیجان سستی تعلیم کا مقصد",uz:"Ozarboyjon arzon ta'lim maskani",sw:"Azerbaijan nafuu kwa elimu",so:"Azerbaijan qiimo jaban waxbarasho",id:"Azerbaijan destinasi studi budget"},
  "azerbaijani-culture-traditions-guide": {de:"Kultur und Traditionen Aserbaidschan",fr:"Culture et traditions azerbaïdjanaises",zh:"阿塞拜疆文化和传统指南",ar:"دليل الثقافة والتقاليد الأذربيجانية",fa:"راهنمای فرهنگ و سنت‌های آذربایجان",tk:"Azerbaýjanyň medeniýeti we gelenekleri giwlagy",kk:"Азербайджан мәдениеті мен дәстүрлері",ky:"Азербайджандын маданияты жана салт-адеттери",bg:"Наръчник за културата и традициите",ur:"آذربائیجانی ثقافت اور روایات کا رہنما",uz:"Ozarboyjon madaniyati va an'analar qo'llanmasi",sw:"Mwongozo wa Utamaduni wa Azerbaijan",so:"Hage Dhaqanka Azerbaijan",id:"Panduan Budaya Azerbaijan"},
  "azerbaijan-weather-climate-students": {de:"Wetter und Klima in Aserbaidschan",fr:"Météo et climat en Azerbaïdjan",zh:"阿塞拜疆天气和气候",ar:"الطقس المناخ في أذربيجان",fa:"آب و هوای آذربایجان",tk:"Azerbaýjandyň howa we iklmy",kk:"Азербайджанның ауа райы мен климаты",ky:"Азербайджандынavaşы жана климаты",bg:"Времето и климата в Азербайджан",ur:"آذربائیجان کا موسم اور آب و ہوا",uz:"Ozarboyjon ob-havosi va iqlimi",sw:"Hali ya Hewa ya Azerbaijan",so:"Cimilada Azerbaijan",id:"Cuaca dan Iklim Azerbaijan"},
  "azerbaijan-vs-turkey-study-abroad": {de:"Aserbaidschan vs Türkei zum Studieren",fr:"Azerbaïdjan vs Turquie pour étudier",zh:"阿塞拜疆vs土耳其留学对比",ar:"أذربيجان مقابل تركيا للدراسة",fa:"آذربایجان در برابر ترکیه برای تحصیل",tk:"Azerbaýjan we Türkiýe okamak üçün",kk:"Азербайджан түрсімен салыстыру",ky:"Азербайджан Түркиямен салыштыруу",bg:"Азербайджан срещу Турция",ur:"آذربائیجان بنامہ ترکیہ",uz:"Ozarboyjon va Turkiya ta'limi",sw:"Azerbaijan dhidi ya Uturuki",so:"Azerbaijan vs Turkey",id:"Azerbaijan vs Turki"},
  "student-visa-azerbaijan-complete-guide": {de:"Studentenvisum Aserbaidschan Leitfaden",fr:"Visa étudiant Azerbaïdjan guide complet",zh:"阿塞拜疆学生签证完全指南",ar:"دليل فيزا الطالب في أذربيجان",fa:"راهنمای کامل ویزای دانشجویی آذربایجان",tk:"Azerbaýjan wiza giwlagy",kk:"Азербайджан виза нұсқаулығы",ky:"Азербайджан виза нускасы",bg:"Пълен наръчник за студентска виза",ur:"آذربائیجان طالب علم ویزا مکمل رہنما",uz:"Ozarboyjon talaba vizasi to'liq qo'llanmasi",sw:"Mwongozo Kamili wa Visa ya Mwanafunzi",so:"Hage Buuxda ee Fiisaha Ardayga",id:"Panduan Lengkap Visa Pelajar Azerbaijan"},
  "top-engineering-programs-azerbaijan": {de:"Top Ingenieurprogramme Aserbaidschan",fr:"Meilleurs programmes d'ingénierie Azerbaïdjan",zh:"阿塞拜疆最佳工程项目",ar:"أفضل برامج الهندسة في أذربيجان",fa:"بهترین برنامه‌های مهندسی آذربایجان",tk:"Azerbaýjandyň iň iýi muhandislik programmalary",kk:"Азербайджанның үздік инженерлік бағдарламалары",ky:"Азербайджандын эң мыкты инженердик программалары",bg:"Най-добри инженерни програми",ur:"آذربائیجان میں بہترین انجینئرنگ پروگرام",uz:"Ozarboyjonning eng yaxshi muhandislik dasturlari",sw:"Programu Bora za Uhandisi Azerbaijan",so:"Barnaamijyada Engineering Azerbaijan",id:"Program Studi Teknik Terbaik Azerbaijan"}
};

const excerptMap = {
  "top-10-must-visit-places-in-azerbaijan": {de:"Die besten Reiseziele in Aserbaidschan.",fr:"Meilleures destinations en Azerbaïdjan.",zh:"阿塞拜疆最佳旅游目的地。",ar:"أفضل معالم السياحة في أذربيجان.",fa:"بهترین مقاصد سیاحتی آذربایجان.",tk:"Azerbaýjandyň iň gowy meşleri.",kk:"Азербайджанның ең жақсы орындары.",ky:"Азербайджандын эң жакшы жайлары.",bg:"Най-добри дестинации.",ur:"بہترین سیاحتی مقامات.",uz:"Eng yaxshi sayohat joylari.",sw:"Maeneo Bora ya Kusafiri.",so:"Goobaha Ugu Fiican.",id:"Destinasi Terbaik."},
  "student-life-in-baku-azerbaijan": {de:"Alles über Studentenleben in Baku.",fr:"Tout sur la vie étudiante à Bakou.",zh:"关于巴库学生生活的一切。",ar:"كل ما يتعلق بحياة الطلاب في باكو.",fa:"همه چیز درباره زندگی دانشجویی در باکو.",tk:"Bakýadadyk duýz we okuw barada.",kk:"Бакыдағы студенттік өмір туралы.",ky:"Бакыдагы студенттик жашоо тууралуу.",bg:"Всичко за студентския живот в Баку.",ur:"باکو میں طالب علم کی زندگی کے بارے میں سب کچھ.",uz:"Bokuda talaba hayoti haqida.",sw:"Kuhusu maisha ya wanafunzi Baku.",so:"Wixii ku saabsan nolaha ardayga Baku.",id:"Semua tentang kehidupan mahasiswa di Baku."},
  "best-universities-medicine-azerbaijan": {de:"Medizinische Bildung in Aserbaidschan.",fr:"Éducation médicale en Azerbaïdjan.",zh:"阿塞拜疆医学教育。",ar:"التعليم الطبي في أذربيجان.",fa:"آموزش پزشکی در آذربایجان.",tk:"Azerbaýjanda tibb bilimi.",kk:"Азербайджандағы медициналық білім.",ky:"Азербайджандагы медициналык билим.",bg:"Медицинско образование в Азербайджан.",ur:"آذربائیجان میں طبی تعلیم.",uz:"Ozarboyjonda tibbiyot ta'limi.",sw:"Elimu ya Matibabu nchini Azerbaijan.",so:"Waxbarashada Caafimaadka Azerbaijan.",id:"Pendidikan Kedokteran Azerbaijan."},
  "azerpaijan-best-budget-study-destination": {de:"Aserbaidschan als günstiges Studienziel.",fr:"Azerbaïdjan destination abordable.",zh:"阿塞拜疆经济型留学目的地。",ar:"أذربيجان وجهة دراسة ميسورة.",fa:"آذربایجان مقصد ارزان.",tk:"Azerbaýjan archan bilim merkezi.",kk:"Азербайджан арзан білім мекені.",ky:"Азербайджан арзан билим мекени.",bg:"Азербайджан достъпно образование.",ur:"آذربائیجان سستی تعلیم.",uz:"Ozarboyjon arzon ta'lim.",sw:"Azerbaijan nafuu kwa elimu.",so:"Azerbaijan qiimo jaban.",id:"Azerbaijan destinasi budget."},
  "azerbaijani-culture-traditions-guide": {de:"Kultur und Traditionen in Aserbaidschan.",fr:"Culture et traditions en Azerbaïdjan.",zh:"阿塞拜疆文化和传统。",ar:"الثقافة والتقاليد في أذربيجان.",fa:"فرهنگ و سنت‌های آذربایجان.",tk:"Azerbaýjanyň medeniýeti we gelenekleri.",kk:"Азербайджанның мәдениеті мен дәстүрлері.",ky:"Азербайджандын маданияты жана салт-адеттери.",bg:"Култура и традиции в Азербайджан.",ur:"آذربائیجان کی ثقافت اور روایات.",uz:"Ozarboyjon madaniyati va an'analar.",sw:"Utamaduni na Mila za Azerbaijan.",so:"Dhaqanka Azerbaijan.",id:"Budaya Azerbaijan."},
  "azerbaijan-weather-climate-students": {de:"Wetter und Klima in Aserbaidschan.",fr:"Météo et climat en Azerbaïdjan.",zh:"阿塞拜疆天气和气候。",ar:"الطقس والمناخ في أذربيجان.",fa:"آب و هوای آذربایجان.",tk:"Azerbaýjandyň howa we iklmy.",kk:"Азербайджанның ауа райы.",ky:"Азербайджандынacockавашы.",bg:"Времето в Азербайджан.",ur:"آذربائیجان کا موسم.",uz:"Ozarboyjon ob-havosi.",sw:"Hali ya Hewa ya Azerbaijan.",so:"Cimilada Azerbaijan.",id:"Cuaca Azerbaijan."},
  "azerbaijan-vs-turkey-study-abroad": {de:"Aserbaidschan vs Türkei.",fr:"Azerbaïdjan vs Turquie.",zh:"阿塞拜疆vs土耳其。",ar:"أذربيجان مقابل تركيا.",fa:"آذربایجان در برابر ترکیه.",tk:"Azerbaýjan we Türkiýe.",kk:"Азербайджан түрсімен.",ky:"Азербайджан Түркиямен.",bg:"Азербайджан срещу Турция.",ur:"آذربائیجان بنامہ ترکیہ.",uz:"Ozarboyjon va Turkiya.",sw:"Azerbaijan dhidi ya Uturuki.",so:"Azerbaijan vs Turkey.",id:"Azerbaijan vs Turki."},
  "student-visa-azerbaijan-complete-guide": {de:"Studentenvisum Aserbaidschan.",fr:"Visa étudiant Azerbaïdjan.",zh:"阿塞拜疆学生签证。",ar:"فيزا الطالب في أذربيجان.",fa:"ویزای دانشجویی آذربایجان.",tk:"Azerbaýjan wizasy.",kk:"Азербайджан визасы.",ky:"Азербайджан визасы.",bg:"Студентска виза.",ur:"طالب علم ویزا آذربائیجان.",uz:"Talaba vizasi.",sw:"Visa ya Mwanafunzi.",so:"Fiisaha Ardayga.",id:"Visa Pelajar."},
  "top-engineering-programs-azerbaijan": {de:"Top Ingenieurprogramme.",fr:"Meilleurs programmes d'ingénierie.",zh:"最佳工程项目。",ar:"أفضل برامج الهندسة.",fa:"بهترین برنامه‌های مهندسی.",tk:"Iň iýi muhandislik programmalary.",kk:"Үздік инженерлік бағдарламалары.",ky:"Эң мыкты инженердик программалары.",bg:"Най-добри инженерни програми.",ur:"بہترین انجینئرنگ پروگرام.",uz:"Eng yaxshi muhandislik dasturlari.",sw:"Programu Bora za Uhandisi.",so:"Barnaamijyada Engineering.",id:"Program Studi Teknik."}
};

// Process line by line
const lines = content.split('\n');
let result = [];
let currentSlug = '';
let inBlock = ''; // 'title' or 'excerpt'
let blockStartLine = -1;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const trimmed = line.trim();

  // Track slug
  const slugMatch = trimmed.match(/slug: "([^"]+)"/);
  if (slugMatch) currentSlug = slugMatch[1];

  // Track block start
  if (trimmed === 'title: {') { inBlock = 'title'; blockStartLine = i; }
  else if (trimmed === 'excerpt: {') { inBlock = 'excerpt'; blockStartLine = i; }

  // When we hit the closing }, of a block, add missing languages before it
  if (inBlock && trimmed === '},') {
    const map = inBlock === 'title' ? titleMap : excerptMap;
    if (map[currentSlug]) {
      // Find which languages already exist
      const existingLangs = [];
      for (let j = blockStartLine + 1; j < i; j++) {
        const t = lines[j].trim();
        for (const l of allLangs) {
          if (t.startsWith(l + ':') && !existingLangs.includes(l)) existingLangs.push(l);
        }
      }

      const missing = allLangs.filter(l => !existingLangs.includes(l));
      for (const l of missing) {
        if (map[currentSlug][l]) {
          result.push('      ' + l + ': "' + map[currentSlug][l] + '",');
        }
      }
    }
    inBlock = '';
  }

  result.push(line);
}

writeFileSync(filePath, result.join('\n'), 'utf8');
console.log('Added missing translations');

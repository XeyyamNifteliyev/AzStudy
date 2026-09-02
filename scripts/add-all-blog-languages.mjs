#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';

const filePath = 'src/lib/seed/blog.ts';
let content = readFileSync(filePath, 'utf8');

const allLangs = ['en','tr','az','ru','de','fr','zh','ar','fa','tk','kk','ky','bg','ur','uz','sw','so','id'];

// Title translations for all 15 posts (only missing ones)
const titles = {
  1: {de:"Anleitung zur Bewerbung an aserbaidschanischen Universitäten",fr:"Guide pour postuler aux universités azerbaïdjanaises",zh:"阿塞拜疆大学申请指南",ar:"دليل التقديم على الجامعات الأذربيجانية",fa:"راهنمای درخواست به دانشگاه‌های آذربایجان",tk:"Azerbayjan universitetlerine bawsuruw giwlagy",kk:"Азербайджан университеттеріне өтініш беру нұсқаулығы",ky:"Азербайджан университеттерине кандидат алу нускасы",bg:"Ръководство за кандидатстване в азербайджански университети",ur:"آذربائیجانی یونیورسٹیوں میں درخواست کا مکمل رہنما",uz:"Ozarbayjon universitetlariga hujjat topshirish qo'llanmasi",sw:"Mwongozo wa kuomba vyuo vya Azerbaijan",so:"Hage codsiga jaamacadaha Azerbaijan",id:"Panduan Melamar Universitas Azerbaijan"},
  2: {de:"Die besten Universitäten in Baku",fr:"Les meilleures universités de Bakou",zh:"巴库最佳大学",ar:"أفضل الجامعات في باكو",fa:"بهترین دانشگاه‌های باکو",tk:"Bakýadaky iň iýi uniwersitetleri",kk:"Бакыдағы үздік университеттер",ky:"Бакыдагы мыкты университеттер",bg:"Най-добри университети в Баку",ur:"باکو میں بہترین یونیورسٹیاں",uz:"Bokudagi eng yaxshi universitetlar",sw:"Vyuo Bora vya Elimu ya Juu huko Baku",so:"Jaamacadaha ugu fiican ee Baku",id:"Universitas Terbaik di Baku"},
  3: {de:"Bildung in aserbaidschanischer Sprache",fr:"Enseignement en langue azerbaïdjanaise",zh:"阿塞拜疆语教育",ar:"التعليم باللغة الأذربيجانية",fa:"آموزش به زبان آذربایجانی",tk:"Azerbayjan dilinde okuw",kk:"Азербайджан тілінде білім",ky:"Азербайджан тилинде билим",bg:"Образование на азербайджански език",ur:"آذربائیجانی زبان میں تعلیم",uz:"Ozarbayjon tilida ta'lim",sw:"Elimu kwa Lugha ya Azerbaijan",so:"Waxbarashada Afafka Azerbaijan",id:"Pendidikan dalam Bahasa Azerbaijan"},
  4: {de:"Lebenshaltungskosten in Aserbaidschan",fr:"Coût de la vie en Azerbaïdjan",zh:"阿塞拜疆生活成本",ar:"تكلفة المعيشة في أذربيجان",fa:"هزینه زندگی در آذربایجان",tk:"Azerbaýjanda ýaşam得起starteri",kk:"Азербайджандағы тұрмыс шығындары",ky:"Азербайджандагы турмуш чыгындары",bg:"Разходи за живот в Азербайджан",ur:"آذربائیجان میں رہائش کی قیمت",uz:"Ozarbayjonda yashash xarajatlari",sw:"Gharama za Maisha nchini Azerbaijan",so:"Qarashyada Nolaha Azerbaijan",id:"Biaya Hidup di Azerbaijan"},
  5: {de:"Stipendien in Aserbaidschan",fr:"Bourses en Azerbaïdjan",zh:"阿塞拜疆奖学金",ar:"منح الدراسة في أذربيجان",fa:"بورسیه‌های آذربایجان",tk:"Azerbaýjanda burslar",kk:"Азербайджандағы стипендиялар",ky:"Азербайджандагы стипендиялар",bg:"Стипендии в Азербайджан",ur:"آذربائیجان میں اسکالرشپ",uz:"Ozarbayjonda grantlar",sw:"Stipendi nchini Azerbaijan",so:"Stipend-yoinka Azerbaijan",id:"Beasiswa di Azerbaijan"},
  6: {de:"10 Gründe, in Aserbaidschan zu studieren",fr:"10 raisons d'étudier en Azerbaïdjan",zh:"在阿塞拜疆学习的10个理由",ar:"10 أسباب للدراسة في أذربيجان",fa:"10 دلیل برای تحصیل در آذربایجان",tk:"Azerbaýjanda okamagyň 10 sebäbi",kk:"Азербайджанда оқудың 10 себебі",ky:"Азербайджанда окуунун 10 себеби",bg:"10 причини да учите в Азербайджан",ur:"آذربائیجان میں پڑھنے کی 10 وجوہات",uz:"Ozarbayjonda o'qishning 10 sababi",sw:"Sababu 10 za Kusoma nchini Azerbaijan",so:"10 Sabab ee lagu barto Azerbaijan",id:"10 Alasan Belajar di Azerbaijan"},
  7: {de:"Die besten Reiseziele in Aserbaidschan",fr:"Les meilleures destinations en Azerbaïdjan",zh:"阿塞拜疆最佳旅游目的地",ar:"أفضل وجهات السياحة في أذربيجان",fa:"بهترین مقاصد سیاحتی آذربایجان",tk:"Azerbaýjandyň iň gowy syýahat merkezleri",kk:"Азербайджанның ең жақсы саяхат орындары",ky:"Азербайджандын эң жакшы саяхат жайлары",bg:"Най-добри дестинации в Азербайджан",ur:"آذربائیجان میں بہترین سیاحتی مقامات",uz:"Ozarbayjonning eng yaxshi sayohat joylari",sw:"Maeneo Bora ya Kusafiri Azerbaijan",so:"Goobaha Ugu Fiican ee Dalxiiska Azerbaijan",id:"Destinasi Wisata Terbaik di Azerbaijan"},
  8: {de:"Leben und Studium in Baku",fr:"Vivre et étudier à Bakou",zh:"在巴库学习和生活",ar:"الحياة والدراسة في باكو",fa:"زندگی و تحصیل در باکو",tk:"Bakýada duýz we okuw",kk:"Бакыда тұру және оқу",ky:"Бакыда жашоо жана окуу",bg:"Живот и учение в Баку",ur:"باکو میں رہائش اور تعلیم",uz:"Bokuda yashash va o'qish",sw:"Kuishi na Kusoma Baku",so:"Noolaha iyo Waxbarashada Baku",id:"Living and Studying in Baku"},
  9: {de:"Medizin in Aserbaidschan studieren",fr:"Étudier la médecine en Azerbaïdjan",zh:"在阿塞拜疆学医",ar:"دراسة الطب في أذربيجان",fa:"تحصیل پزشکی در آذربایجان",tk:"Azerbaýjanda tibb okamak",kk:"Азербайджанда медицина оқу",ky:"Азербайджанда медицина окуу",bg:"Студия на медицина в Азербайджан",ur:"آذربائیجان میں طب کی تعلیم",uz:"Ozarbayjonda tibbiyot o'qish",sw:"Kusoma Tiba nchini Azerbaijan",so:"Waxbarashada Caafimaadka Azerbaijan",id:"Belajar Kedokteran di Azerbaijan"},
  10: {de:"Aserbaidschans Hochschulbildung",fr:"L'enseignement supérieur en Azerbaïdjan",zh:"阿塞拜疆高等教育",ar:"التعليم العالي في أذربيجان",fa:"آموزش عالی در آذربایجان",tk:"Azerbaýjanyň.omg şyragy",kk:"Азербайджанның жоғары білімі",ky:"Азербайджандын жогорку билими",bg:"Висше образование в Азербайджан",ur:"آذربائیجان میں تعلیم عالی",uz:"Ozarbayjonning oliy ta'limi",sw:"Elimu ya Juu ya Azerbaijan",so:"Waxbarashada Sare ee Azerbaijan",id:"Pendidikan Tinggi di Azerbaijan"},
  11: {de:"Aserbaidschanische Kultur und Traditionen",fr:"Culture et traditions azerbaïdjanaises",zh:"阿塞拜疆文化和传统",ar:"الثقافة والتقاليد الأذربيجانية",fa:"فرهنگ و سنت‌های آذربایجان",tk:"Azerbaýjanyň medeniýeti we gelenekleri",kk:"Азербайджанның мәдениеті мен дәстүрлері",ky:"Азербайджандын маданияты жана салт-адеттери",bg:"Азербайджанска култура и традиции",ur:"آذربائیجانی ثقافت اور روایات",uz:"Ozarbayjon madaniyati va an'analar",sw:"Utamaduni na Mila za Azerbaijan",so:"Dhaqanka iyo Dhaqanka Azerbaijan",id:"Budaya dan Tradisi Azerbaijan"},
  12: {de:"Die besten Universitäten in Baku 2026",fr:"Meilleures universités de Bakou 2026",zh:"2026巴库最佳大学",ar:"أفضل جامعات باكو 2026",fa:"بهترین دانشگاه‌های باکو ۲۰۲۶",tk:"2026-njýyl Bakýadaky iň iýi uniwersitetleri",kk:"2026 жылдың Бакыдағы үздік университеттері",ky:"2026-жылдын Бакыдагы мыкты университеттери",bg:"Най-добри университети в Баку 2026",ur:"2026 باکو میں بہترین یونیورسٹیاں",uz:"2026 Bokudagi eng yaxshi universitetlar",sw:"Vyuo Bora vya Baku 2026",so:"Jaamacadaha Ugu Fiican ee Baku 2026",id:"Universitas Terbaik di Baku 2026"},
  13: {de:"Medizinische Bildung in Aserbaidschan 2026",fr:"Éducation médicale en Azerbaïdjan 2026",zh:"2026阿塞拜疆医学教育",ar:"التعليم الطبي في أذربيجان 2026",fa:"آموزش پزشکی آذربایجان ۲۰۲۶",tk:"2026-njýyl Azerbaýjanda tibb bilimi",kk:"2026 Азербайджандағы медициналық білім",ky:"2026 Азербайджандагы медициналык билим",bg:"Медицинско образование в Азербайджан 2026",ur:"2026 آذربائیجان میں طبی تعلیم",uz:"2026 Ozarbayjonda tibbiyot ta'limi",sw:"Elimu ya Matibabu Azerbaijan 2026",so:"Waxbarashada Caafimaadka Azerbaijan 2026",id:"Pendidikan Kedokteran Azerbaijan 2026"},
  14: {de:"Die besten Universitäten in Aserbaidschan 2026",fr:"Meilleures universités d'Azerbaïdjan 2026",zh:"2026阿塞拜疆最佳大学",ar:"أفضل جامعات أذربيجان 2026",fa:"بهترین دانشگاه‌های آذربایجان ۲۰۲۶",tk:"2026-njýyl Azerbaýjandyň iň iýi uniwersitetleri",kk:"2026 Азербайджанның үздік университеттері",ky:"2026 Азербайджандын мыкты университеттери",bg:"Най-добри университети в Азербайджан 2026",ur:"2026 آذربائیجان میں بہترین یونیورسٹیاں",uz:"2026 Ozarbayjonning eng yaxshi universitetlari",sw:"Vyuo Bora vya Azerbaijan 2026",so:"Jaamacadaha Ugu Fiican ee Azerbaijan 2026",id:"Universitas Terbaik di Azerbaijan 2026"},
  15: {de:"Aserbaidschans Hochschulsystem",fr:"Système d'enseignement supérieur en Azerbaïdjan",zh:"阿塞拜疆高等教育体系",ar:"نظام التعليم العالي في أذربيجان",fa:"نظام آموزش عالی آذربایجان",tk:"Azerbaýjanyň boosting bilim sistemi",kk:"Азербайджанның жоғары білім жүйесі",ky:"Азербайджандын жогорку билим системасы",bg:"Система на висшето образование в Азербайджан",ur:"آذربائیجان کا نظام تعلیم عالی",uz:"Ozarbayjonning oliy ta'lim tizimi",sw:"Mfumo wa Elimu ya Juu ya Azerbaijan",so:"Nidaamka Waxbarashada Sare ee Azerbaijan",id:"Sistem Pendidikan Tinggi Azerbaijan"}
};

// Excerpt translations for all 15 posts
const excerpts = {
  1: {de:"Vollständiger Leitfaden für die Bewerbung an aserbaidschanischen Universitäten.",fr:"Guide complet pour postuler aux universités azerbaïdjanaises.",zh:"阿塞拜疆大学申请完全指南。",ar:"دليل شامل للتقديم على الجامعات الأذربيجانية.",fa:"راهنمای کامل درخواست به دانشگاه‌های آذربایجان.",tk:"Azerbaýjan universitetlerine bawsuruw tolyk giwlagy.",kk:"Азербайджан университеттеріне өтініш беру толық нұсқаулығы.",ky:"Азербайджан университеттерине кандидат алу толук нускасы.",bg:"Пълно ръководство за кандидатстване в азербайджански университети.",ur:"آذربائیجانی یونیورسٹیوں میں درخواست کا مکمل رہنما.",uz:"Ozarbayjon universitetlariga hujjat topshirish to'liq qo'llanmasi.",sw:"Mwongozo kamili wa kuomba vyuo vya Azerbaijan.",so:"Hage buuxda ee codsiga jaamacadaha Azerbaijan.",id:"Panduan lengkap melamar universitas Azerbaijan."},
  2: {de:"Entdecken Sie die besten Universitäten in Baku.",fr:"Découvrez les meilleures universités de Bakou.",zh:"探索巴库最佳大学。",ar:"اكتشف أفضل جامعات باكو.",fa:"بهترین دانشگاه‌های باکو را کشف کنید.",tk:"Bakýadaky iň iýi uniwersitetleri saýla.",kk:"Бакыдағы үздік университеттерді ашыңыз.",ky:"Бакыдагы мыкты университеттерди ачыңыз.",bg:"Открийте най-добри университети в Баку.",ur:"باکو میں بہترین یونیورسٹیاں دریافت کریں.",uz:"Bokudagi eng yaxshi universitetlarni kashf eting.",sw:"Gundua vyuo bora vya Baku.",so:"Kaacooy jaamacadaha ugu fiican ee Baku.",id:"Temukan universitas terbaik di Baku."},
  3: {de:"Erfahren Sie mehr über das Bildungssystem der aserbaidschanischen Sprache.",fr:"Apprenez le système d'enseignement en langue azerbaïdjanaise.",zh:"了解阿塞拜疆语言教育体系。",ar:"تعرف على نظام التعليم باللغة الأذربيجانية.",fa:"درباره سیستم آموزش زبان آذربایجانی اطلاعات کسب کنید.",tk:"Azerbaýjan dilinde bilim sistemi haýnda öwreniň.",kk:"Азербайджан тілінде білім жүйесі туралы біліңіз.",ky:"Азербайджан тилиндеги билим системасы тууралуу билиңиз.",bg:"Научете повече за системата на образование на азербайджански език.",ur:"آذربائیجانی زبان کی تعلیمی نظام کے بارے میں معلومات حاصل کریں.",uz:"Ozarbayjon tilida ta'lim tizimi haqida bilib oling.",sw:"Jifunze kuhusu mfumo wa elimu kwa lugha ya Azerbaijan.",so:"Wax ka baro nidaamka waxbarashada Afafka Azerbaijan.",id:"Pelajari sistem pendidikan bahasa Azerbaijan."},
  4: {de:"Lebenshaltungskosten in Aserbaidschan im Vergleich.",fr:"Coûts de la vie en Azerbaïdjan comparés.",zh:"阿塞拜疆生活成本对比。",ar:"تكلفة المعيشة في أذربيجان مقارنة.",fa:"هزینه زندگی در آذربایجان در مقایسه.",tk:"Azerbaýjanda ýaşam starteri sanawda.",kk:"Азербайджандағы тұрмыс шығындары салыстырмалы.",ky:"Азербайджандагы турмуш чыгындары салыштырмалуу.",bg:"Разходи за живот в Азербайджан в сравнение.",ur:"آذربائیجان میں رہائش کی قیمت کا موازنہ.",uz:"Ozarbayjonda yashash xarajatlari solishtirilgan.",sw:"Gharama za maisha nchini Azerbaijan.",so:"Qarashyada nolaha Azerbaijan.",id:"Biaya hidup di Azerbaijan."},
  5: {de:"Alles über Stipendien für internationale Studierende.",fr:"Tout sur les bourses pour étudiants internationaux.",zh:"国际学生奖学金全攻略。",ar:"كل ما يتعلق بمنح الدراسة للطلاب الدوليين.",fa:"همه چیز درباره بورسیه‌های دانشجویان بین‌المللی.",tk:"Dünýä úlkelere giren okuwalylaryň burslary barada.",kk:"Халықаралық студенттерге арналған стипендиялар туралы.",ky:"Эл аралык студенттерге стипендиялар тууралуу.",bg:"Всичко за стипендиите за международни студенти.",ur:"بین الاقوامی طلباء کے لیے اسکالرشپ کے بارے میں سب کچھ.",uz:"Xalqaro talabalar uchun grantlar haqida.",sw:"Kila kitu kuhusu stiperendi za wanafunzi wa kimataifa.",so:"Wax kasta oo ku saabsan stipend-yoinka ardayda caalamiga ah.",id:"Semua tentang beasiswa untuk mahasiswa internasional."},
  6: {de:"10 Top-Gründe, in Aserbaidschan zu studieren.",fr:"10 raisons d'étudier en Azerbaïdjan.",zh:"在阿塞拜疆学习的10大理由。",ar:"10 أسباب للدراسة في أذربيجان.",fa:"10 دلیل برای تحصیل در آذربایجان.",tk:"Azerbaýjanda okamagyň 10 sebäbi.",kk:"Азербайджанда оқудың 10 себебі.",ky:"Азербайджанда окуунун 10 себеби.",bg:"10 причини да учите в Азербайджан.",ur:"آذربائیجان میں پڑھنے کی 10 وجوہات.",uz:"Ozarbayjonda o'qishning 10 sababi.",sw:"Sababu 10 za Kusoma nchini Azerbaijan.",so:"10 Sabab oo lagu barto Azerbaijan.",id:"10 Alasan Belajar di Azerbaijan."},
  7: {de:"Die besten Reiseziele in Aserbaidschan.",fr:"Les meilleures destinations en Azerbaïdjan.",zh:"阿塞拜疆最佳旅游目的地。",ar:"أفضل وجهات السياحة في أذربيجان.",fa:"بهترین مقاصد سیاحتی آذربایجان.",tk:"Azerbaýjandyň iň gowy meşgeleri.",kk:"Азербайджанның ең жақсы саяхат орындары.",ky:"Азербайджандын эң жакшы жайлары.",bg:"Най-добри дестинации в Азербайджан.",ur:"آذربائیجان میں بہترین سیاحتی مقامات.",uz:"Ozarbayjonning eng yaxshi sayohat joylari.",sw:"Maeneo Bora ya Kusafiri Azerbaijan.",so:"Goobaha Ugu Fiican ee Dalxiiska Azerbaijan.",id:"Destinasi Wisata Terbaik di Azerbaijan."},
  8: {de:"Alles über Studentenleben in Baku.",fr:"Tout sur la vie étudiante à Bakou.",zh:"关于巴库学生生活的一切。",ar:"كل ما يتعلق بحياة الطلاب في باكو.",fa:"همه چیز درباره زندگی دانشجویی در باکو.",tk:"Bakýada sáp okuwalylar ömrü barada.",kk:"Бакыдағы студенттік өмір туралы.",ky:"Бакыдагы студенттик жашоо тууралуу.",bg:"Всичко за студентския живот в Баку.",ur:"باکو میں طالب علم کی زندگی کے بارے میں سب کچھ.",uz:"Bokuda talaba hayoti haqida.",sw:"Kuhusu maisha ya wanafunzi Baku.",so:"Wixii ku saabsan nolaha ardayga Baku.",id:"Semua tentang kehidupan mahasiswa di Baku."},
  9: {de:"Medizinische Bildung in Aserbaidschan.",fr:"Éducation médicale en Azerbaïdjan.",zh:"阿塞拜疆医学教育。",ar:"التعليم الطبي في أذربيجان.",fa:"آموزش پزشکی در آذربایجان.",tk:"Azerbaýjanda tibb bilimi.",kk:"Азербайджандағы медициналық білім.",ky:"Азербайджандагы медициналык билим.",bg:"Медицинско образование в Азербайджан.",ur:"آذربائیجان میں طبی تعلیم.",uz:"Ozarbayjonda tibbiyot ta'limi.",sw:"Elimu ya Matibabu Azerbaijan.",so:"Waxbarashada Caafimaadka Azerbaijan.",id:"Pendidikan Kedokteran Azerbaijan."},
  10: {de:"Hochschulbildung in Aserbaidschan im Vergleich.",fr:"Enseignement supérieur en Azerbaïdjan comparé.",zh:"阿塞拜疆高等教育对比。",ar:"التعليم العالي في أذربيجان مقارنة.",fa:"آموزش عالی آذربایجان مقایسه شده.",tk:"Azerbaýjanyň.omg bilimi sanawda.",kk:"Азербайджанның жоғары білімі салыстырмалы.",ky:"Азербайджандын жогорку билими салыштырмалуу.",bg:"Висше образование в Азербайджан в сравнение.",ur:"آذربائیجان کی تعلیم عالی کا موازنہ.",uz:"Ozarbayjonning oliy ta'limi solishtirilgan.",sw:"Elimu ya Juu ya Azerbaijan.",so:"Waxbarashada Sare ee Azerbaijan.",id:"Pendidikan Tinggi di Azerbaijan."}
};

function getPostSlug(num) {
  const slugs = {1:"how-to-apply-to-azerbaijani-universities",2:"top-universities-in-baku",3:"education-in-azerbaijani-language",4:"cost-of-living-in-azerbaijan",5:"scholarships-in-azerbaijan",6:"why-study-in-azerbaijan",7:"travel-guide-azerbaijan",8:"student-life-in-baku",9:"medical-education-azerbaijan",10:"cost-comparison-azerbaijan",11:"azerbaijan-culture-traditions",12:"best-universities-baku",13:"medical-education-2026",14:"best-universities-azerbaijan-2026",15:"azerbaijan-higher-education"};
  return slugs[num] || '';
}

// Strategy: for each post, find its title block and add missing languages
// Then find its excerpt block and add missing languages
// Then find its content block and add missing languages

const lines = content.split('\n');
let result = [];
let postNum = 0;
let currentSlug = '';
let inBlock = ''; // 'title', 'excerpt', 'content', or ''
let braceDepth = 0;
let blockStartLine = -1;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const slugMatch = line.match(/slug:\s*"([^"]+)"/);
  if (slugMatch) currentSlug = slugMatch[1];

  // Track when we enter a block
  if (line.match(/^\s+title:\s*\{$/)) { inBlock = 'title'; braceDepth = 1; }
  else if (line.match(/^\s+excerpt:\s*\{$/)) { inBlock = 'excerpt'; braceDepth = 1; }
  else if (line.match(/^\s+content:\s*\{$/)) { inBlock = 'content'; braceDepth = 1; }

  // Find which post we're on
  if (line.match(/^\s+id:\s*"b-\d+"/)) {
    const idMatch = line.match(/id:\s*"b-(\d+)"/);
    if (idMatch) postNum = parseInt(idMatch[1]);
  }

  // When we close a block, add missing languages
  if (inBlock && line.trim() === '},') {
    const postSlug = currentSlug;
    let translations = {};

    if (inBlock === 'title' && titles[postNum]) translations = titles[postNum];
    else if (inBlock === 'excerpt' && excerpts[postNum]) translations = excerpts[postNum];

    if (Object.keys(translations).length > 0) {
      // Check which languages are already present
      const existingLangs = [];
      for (let j = i - 1; j >= 0; j--) {
        const prevLine = lines[j].trim();
        if (prevLine === '{' || prevLine === 'title: {' || prevLine === 'excerpt: {' || prevLine === 'content: {') break;
        for (const l of allLangs) {
          if (prevLine.startsWith(l + ':') && !existingLangs.includes(l)) existingLangs.push(l);
        }
      }

      // Add missing languages before the closing },
      const missingLangs = allLangs.filter(l => !existingLangs.includes(l));
      if (missingLangs.length > 0) {
        // Insert missing languages before the current line
        const indent = '      ';
        for (const l of missingLangs) {
          if (translations[l]) {
            result.push(indent + l + ': "' + translations[l] + '",');
          }
        }
      }
    }

    inBlock = '';
  }

  result.push(line);
}

writeFileSync(filePath, result.join('\n'), 'utf8');
console.log('Added missing languages to all blog posts');

import { readFileSync, writeFileSync } from 'fs';

const path = 'src/lib/seed/universities.ts';
let content = readFileSync(path, 'utf8');

const remaining = {
  'baku-state-university': {en:'Baku State University',az:'Bakı Dövlət Universiteti',ru:'Бакинский государственный университет',tr:'Bakü Devlet Üniversitesi',ar:'جامعة باكو الحكومية',fa:'دانشگاه دولتی باکو',zh:'巴库国立大学',de:'Staatliche Universität Baku',fr:"Université d'État de Bakou",hi:'बाकू राज्य विश्वविद्यालय',ko:'바쿠 국립대학교',pt:'Universidade Estatal de Baku',ja:'バクー国立大学',id:'Universitas Negeri Baku',bn:'বাকু স্টেট ইউনিভার্সিটি',ur:'یونیورسٹی باکو اسٹیٹ',sw:'Chuo Kikuu cha Baku',tk:'Bäkülä döwlet uniwersiteti'},
  'gance-state-university': {en:'Ganja State University',az:'Gəncə Dövlət Universiteti',ru:'Гянджинский государственный университет',tr:'Gence Devlet Üniversitesi',ar:'جامعة جانجة الحكومية',fa:'دانشگاه دولتی گنجه',zh:'占贾国立大学',de:'Staatliche Universität Gəncə',fr:"Université d'État de Gandja",hi:'गंजा स्टेट यूनिवर्सिटी',ko:'간자 국립대학교',pt:'Universidade Estatal de Gəncə',ja:'ガンジャ国立大学',id:'Universitas Negeri Ganja',bn:'গঞ্জা স্টেট ইউনিভার্সিটি',ur:'گنجه اسٹیٹ یونیورسٹی',sw:'Chuo Kikuu cha Ganja',tk:'Gence Döwlet uniwersiteti'},
  'azerbaijan-medical-university': {en:'Azerbaijan Medical University',az:'Azərbaycan Tibb Universiteti',ru:'Азербайджанский медицинский университет',tr:'Azerbaycan Tıp Üniversitesi',ar:'جامعة أذربيجان الطبية',fa:'دانشگاه پزشکی آذربایجان',zh:'阿塞拜疆医科大学',de:'Medizinische Universität Aserbaidschan',fr:"Université de médecine d'Azerbaïdjan",hi:'अज़रबैजान मेडिकल यूनिवर्सिटी',ko:'아제르바이잔 의과대학교',pt:'Universidade Médica do Azerbaijão',ja:'アゼルバイジャン医科大学',id:'Universitas Kedokteran Azerbaijan',bn:'আজারবাইজান মেডিকেল ইউনিভার্সিটি',ur:'آذربائیجان میڈیکل یونیورسٹی',sw:'Chuo Kikuu cha Tiba cha Azerbaijan',tk:'Azerbaýjan medisina uniwersiteti'},
  'khazar-university': {en:'Khazar University',az:'Xəzər Universiteti',ru:'Хазарский университет',tr:'Hazar Üniversitesi',ar:'جامعة خزر',fa:'دانشگاه خزر',zh:'里海大学',de:'Khazar Universität',fr:'Université Khazar',hi:'ख़ज़ार यूनिवर्सिटी',ko:'카스피 대학교',pt:'Universidade Khazar',ja:'カスピ海大学',id:'Universitas Khazar',bn:'খাজার ইউনিভার্সিটি',ur:'خزر یونیورسٹی',sw:'Chuo Kikuu cha Khazar',tk:'Hazar uniwersiteti'},
  'baku-engineering-university': {en:'Baku Engineering University',az:'Bakı Mühəndislik Universiteti',ru:'Бакинский инженерный университет',tr:'Bakü Mühendislik Üniversitesi',ar:'جامعة باكو للهندسة',fa:'دانشگاه مهندسی باکو',zh:'巴库工程大学',de:'Technische Universität Baku',fr:"Université d'ingénierie de Bakou",hi:'बाकू इंजीनियरिंग यूनिवर्सिटी',ko:'바쿠 공과대학교',pt:'Universidade de Engenharia de Baku',ja:'バクー工科大学',id:'Universitas Teknik Baku',bn:'বাকু ইঞ্জিনিয়ারিং ইউনিভার্সিটি',ur:'یونیورسٹی باکو انجینئرنگ',sw:'Chuo Kikuu cha Uhandisi cha Baku',tk:'Bäkülä mühendislik uniwersiteti'},
  'azerbaijan-state-pedagogical-university': {en:'Azerbaijan State Pedagogical University',az:'Azərbaycan Dövlət Pedaqoji Universiteti',ru:'Азербайджанский государственный педагогический университет',tr:'Azerbaycan Devlet Pedagoji Üniversitesi',ar:'جامعة أذربيجان الحكومية التربوية',fa:'دانشگاه دولتی پداگوژیک آذربایجان',zh:'阿塞拜疆国立师范大学',de:'Staatliche Pädagogische Universität Aserbaidschan',fr:"Université pédagogique d'État d'Azerbaïdjan",hi:'अज़रबैजान स्टेट पेडागोजिकल यूनिवर्सिटी',ko:'아제르바이잔 국립교육대학교',pt:'Universidade Pedagógica Estatal do Azerbaijão',ja:'アゼルバイジャン国立教育大学',id:'Universitas Pendidikan Negeri Azerbaijan',bn:'আজারবাইজান স্টেট পেডাগোজিক্যাল ইউনিভার্সিটি',ur:'آذربائیجان اسٹیٹ پیڈاگوجیکل یونیورسٹی',sw:'Chuo Kikuu cha Elimu cha Azerbaijan',tk:'Azerbaýjan Döwlet pedagogiki uniwersiteti'},
  'qarabagh-university': {en:'Karabakh University',az:'Qarabağ Universiteti',ru:'Карабахский университет',tr:'Karabağ Üniversitesi',ar:'جامعة قره باغ',fa:'دانشگاه قره‌باغ',zh:'卡拉巴赫大学',de:'Karabach-Universität',fr:'Université du Haut-Karabakh',hi:'कराबाख यूनिवर्सिटी',ko:'카라바흐 대학교',pt:'Universidade de Karabakh',ja:'カラバフ大学',id:'Universitas Karabakh',bn:'কারাবাখ ইউনিভার্সিটি',ur:'قرا باغ یونیورسٹی',sw:'Chuo Kikuu cha Karabakh',tk:'Garabaý uniwersiteti'},
};

let count = 0;
for (const [slug, nameMap] of Object.entries(remaining)) {
  // Pattern: name: 'English Name',\n    slug: 'xxx',
  const regex = new RegExp(`(\\s*name: )'[^']+',(\\n\\s*slug: '${slug}')`, 'm');
  if (regex.test(content)) {
    const lines = Object.entries(nameMap).map(([lang, val]) => `      ${lang}: '${val}',`).join('\n');
    const replacement = `$1{\n${lines}\n    },$2`;
    content = content.replace(regex, replacement);
    count++;
    console.log(`✅ ${slug}`);
  } else {
    console.log(`❌ ${slug} — pattern not found`);
  }
}

writeFileSync(path, content);
console.log(`\nDuzəldi: ${count}`);

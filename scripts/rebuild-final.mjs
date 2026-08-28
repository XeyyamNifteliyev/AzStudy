#!/usr/bin/env node
import { writeFileSync } from 'fs';

// All 46 universities with correct, unique IDs
const universities = [
  { id: 'u-bsu', name: 'Baku State University', slug: 'baku-state-university', cityId: 'c-baku', year: 1919, students: 30000, ranking: 1, state: true, logo: 'BSU', featured: true, langs: ['az', 'en', 'ru'], nameI18n: { en: 'Baku State University', az: 'Bakı Dövlət Universiteti', ru: 'Бакинский государственный университет', tr: 'Bakü Devlet Üniversitesi', ar: 'جامعة باكو الحكومية', fa: 'دانشگاه دولتی باکو', zh: '巴库国立大学', de: 'Staatliche Universität Baku', fr: "Université d'État de Bakou", tk: 'Bäkülä döwlet uniwersiteti', kk: 'Баку мемлекеттік университеті', ky: 'Баку мамлекеттик университети', bg: 'Бакински държавен университет', ur: 'یونیورسٹی باکو اسٹیٹ', uz: 'Boku davlat universiteti', sw: 'Chuo Kikuu cha Baku', so: 'Jaamacadda Dawladda ee Baku', id: 'Universitas Negeri Baku' }},
  { id: 'u-ada', name: 'ADA University', slug: 'azerbaijan-diplomatic-academy', cityId: 'c-baku', year: 2006, students: 2000, ranking: 5, state: true, logo: 'ADA', featured: true, langs: ['en', 'az'], nameI18n: { en: 'ADA University', az: 'ADA Universiteti', ru: 'Университет АДА', tr: 'ADA Üniversitesi', ar: 'جامعة ADA', fa: 'دانشگاه ADA', zh: 'ADA大学', de: 'ADA-Universität', fr: 'Université ADA' }},
  { id: 'u-odu', name: 'Azerbaijan University of Architecture and Construction', slug: 'azerbaijan-university-architecture-construction', cityId: 'c-baku', year: 1920, students: 5000, ranking: 8, state: true, logo: 'ADNSU', featured: false, langs: ['az', 'ru'], nameI18n: { en: 'Azerbaijan University of Architecture and Construction', az: 'Azərbaycan Memarlıq və İnşaat Universiteti', ru: 'Азербайджанский архитектурно-строительный университет', tr: 'Azerbaycan Mimarlık ve İnşaat Üniversitesi' }},
  { id: 'u-sdu', name: 'Sumqayit State University', slug: 'sumqayit-state-university', cityId: 'c-sumqayit', year: 2000, students: 6000, ranking: 15, state: true, logo: 'SSU', featured: false, langs: ['az', 'en'], nameI18n: { en: 'Sumqayit State University', az: 'Sumqayıt Dövlət Universiteti', ru: 'Сумгаитский государственный университет', tr: 'Sumqayıt Devlet Üniversitesi' }},
  { id: 'u-gsu', name: 'Ganja State University', slug: 'gance-state-university', cityId: 'c-ganja', year: 1939, students: 5000, ranking: 12, state: true, logo: 'GSU', featured: false, langs: ['az'], nameI18n: { en: 'Ganja State University', az: 'Gəncə Dövlət Universiteti', ru: 'Гянджинский государственный университет', tr: 'Gence Devlet Üniversitesi', ar: 'جامعة جانجة الحكومية', fa: 'دانشگاه دولتی گنجه' }},
  { id: 'u-gtu', name: 'Ganja State Technological University', slug: 'gance-state-technological-university', cityId: 'c-ganja', year: 1930, students: 4000, ranking: 18, state: true, logo: 'GSTU', featured: false, langs: ['az'], nameI18n: { en: 'Ganja State Technological University', az: 'Azərbaycan Texnologiya Universiteti', ru: 'Азербайджанский технологический университет' }},
  { id: 'u-nmu', name: 'Nakhchivan Medical University', slug: 'naxcivan-medical-university', cityId: 'c-nakhchivan', year: 1999, students: 2000, ranking: 20, state: true, logo: 'NMU', featured: false, langs: ['az'], nameI18n: { en: 'Nakhchivan Medical University', az: 'Naxçıvan Tibb Universiteti', ru: 'Нахичеванский медицинский университет' }},
  { id: 'u-amu', name: 'Azerbaijan Medical University', slug: 'azerbaijan-medical-university', cityId: 'c-baku', year: 1930, students: 8000, ranking: 4, state: true, logo: 'AMU', featured: true, langs: ['az', 'en', 'ru'], nameI18n: { en: 'Azerbaijan Medical University', az: 'Azərbaycan Tibb Universiteti', ru: 'Азербайджанский медицинский университет', tr: 'Azerbaycan Tıp Üniversitesi', ar: 'جامعة أذربيجان الطبية', fa: 'دانشگاه پزشکی آذربایجان', zh: '阿塞拜疆医科大学' }},
  { id: 'u-unec', name: 'Azerbaijan State University of Economics (UNEC)', slug: 'azerbaijan-state-university-economics', cityId: 'c-baku', year: 1930, students: 15000, ranking: 3, state: true, logo: 'UNEC', featured: true, langs: ['az', 'en', 'ru'], nameI18n: { en: 'Azerbaijan State University of Economics (UNEC)', az: 'Azərbaycan Dövlət İqtisad Universiteti', ru: 'Азербайджанский государственный экономический университет', tr: 'Azerbaycan Devlet Ekonomi Üniversitesi' }},
  { id: 'u-wu', name: 'Western University', slug: 'western-university', cityId: 'c-baku', year: 1991, students: 3000, ranking: 25, state: false, logo: 'WU', featured: false, langs: ['az', 'en'], nameI18n: { en: 'Western University', az: 'Qərb Universiteti', ru: 'Западный университет', tr: 'Batı Üniversitesi' }},
  { id: 'u-ku', name: 'Khazar University', slug: 'khazar-university', cityId: 'c-baku', year: 1991, students: 2500, ranking: 10, state: false, logo: 'KU', featured: true, langs: ['az', 'en'], nameI18n: { en: 'Khazar University', az: 'Xəzər Universiteti', ru: 'Хазарский университет', tr: 'Hazar Üniversitesi', ar: 'جامعة خزر', fa: 'دانشگاه خزر', zh: '里海大学' }},
  { id: 'u-beu', name: 'Baku Engineering University', slug: 'baku-engineering-university', cityId: 'c-baku', year: 2012, students: 4000, ranking: 22, state: false, logo: 'BEU', featured: false, langs: ['az'], nameI18n: { en: 'Baku Engineering University', az: 'Bakı Mühəndislik Universiteti', ru: 'Бакинский инженерный университет', tr: 'Bakü Mühendislik Üniversitesi', ar: 'جامعة باكو للهندسة', fa: 'دانشگاه مهندسی باکو', zh: '巴库工程大学' }},
  { id: 'u-adpu', name: 'Azerbaijan State Pedagogical University', slug: 'azerbaijan-state-pedagogical-university', cityId: 'c-baku', year: 1921, students: 7000, ranking: 14, state: true, logo: 'ADPU', featured: false, langs: ['az', 'ru'], nameI18n: { en: 'Azerbaijan State Pedagogical University', az: 'Azərbaycan Dövlət Pedaqoji Universiteti', ru: 'Азербайджанский государственный педагогический университет', tr: 'Azerbaycan Devlet Pedagoji Üniversitesi', ar: 'جامعة أذربيجان الحكومية التربوية', fa: 'دانشگاه دولتی پداگوژیک آذربایجان', zh: '阿塞拜疆国立师范大学' }},
  { id: 'u-lsu', name: 'Lankaran State University', slug: 'lankaran-state-university', cityId: 'c-lankaran', year: 1991, students: 4000, ranking: 16, state: true, logo: 'LSU', featured: false, langs: ['az'], nameI18n: { en: 'Lankaran State University', az: 'Lənkəran Dövlət Universiteti', ru: 'Ленкоранский государственный университет', tr: 'Lenkeran Devlet Üniversitesi' }},
  { id: 'u-mgu', name: 'Mingachevir State University', slug: 'mingachevir-state-university', cityId: 'c-mingachevir', year: 1991, students: 2500, ranking: 24, state: true, logo: 'MGU', featured: false, langs: ['az'], nameI18n: { en: 'Mingachevir State University', az: 'Mingəçevir Dövlət Universiteti', ru: 'Мингечевирский государственный университет', tr: 'Mingachevir Devlet Üniversitesi' }},
  { id: 'u-asoiu', name: 'Azerbaijan State Oil and Industry University', slug: 'azerbaijan-state-oil-industry-university', cityId: 'c-baku', year: 1920, students: 10000, ranking: 6, state: true, logo: 'ASOIU', featured: false, langs: ['az', 'en', 'ru'], nameI18n: { en: 'Azerbaijan State Oil and Industry University', az: 'Azərbaycan Dövlət Neft və Sənaye Universiteti', ru: 'Азербайджанский государственный университет нефти и промышленности' }},
  { id: 'u-atu', name: 'Azerbaijan Technical University', slug: 'azerbaijan-technical-university', cityId: 'c-baku', year: 1950, students: 8000, ranking: 7, state: true, logo: 'ATU', featured: false, langs: ['az', 'ru'], nameI18n: { en: 'Azerbaijan Technical University', az: 'Azərbaycan Texniki Universiteti', ru: 'Азербайджанский технический университет', tr: 'Azerbaycan Teknik Üniversitesi' }},
  { id: 'u-bslu', name: 'Baku Slavic University', slug: 'baku-slavyan-university', cityId: 'c-baku', year: 1946, students: 3000, ranking: 17, state: true, logo: 'BSL', featured: false, langs: ['az', 'ru'], nameI18n: { en: 'Baku Slavic University', az: 'Bakı Slavyan Universiteti', ru: 'Бакинский славянский университет' }},
  { id: 'u-adlu', name: 'Azerbaijan University of Languages', slug: 'azerbaijan-university-languages', cityId: 'c-baku', year: 1973, students: 6000, ranking: 11, state: true, logo: 'ADLU', featured: false, langs: ['az', 'en'], nameI18n: { en: 'Azerbaijan University of Languages', az: 'Azərbaycan Dillər Universiteti', ru: 'Азербайджанский университет языков' }},
  { id: 'u-bma', name: 'Baku Music Academy', slug: 'baku-music-academy', cityId: 'c-baku', year: 1920, students: 1500, ranking: 30, state: true, logo: 'BMA', featured: false, langs: ['az'], nameI18n: { en: 'Baku Music Academy', az: 'Üzeyir Hacıbəyli adına Bakı Musiqi Akademiyası', ru: 'Бакинская музыкальная академия' }},
  { id: 'u-adcu', name: 'Azerbaijan State University of Culture and Arts', slug: 'azerbaijan-state-culture-arts-university', cityId: 'c-baku', year: 1923, students: 2000, ranking: 28, state: true, logo: 'ADC', featured: false, langs: ['az'], nameI18n: { en: 'Azerbaijan State University of Culture and Arts', az: 'Azərbaycan Dövlət Mədəniyyət və İncəsənət Universiteti', ru: 'Азербайджанский государственный университет культуры и искусства' }},
  { id: 'u-adasa', name: 'Azerbaijan State Academy of Arts', slug: 'azerbaijan-state-academy-arts', cityId: 'c-baku', year: 2000, students: 800, ranking: 35, state: true, logo: 'ADAA', featured: false, langs: ['az'], nameI18n: { en: 'Azerbaijan State Academy of Arts', az: 'Azərbaycan Dövlət Rəssamlıq Akademiyası', ru: 'Азербайджанская государственная академия художеств' }},
  { id: 'u-amk', name: 'Azerbaijan National Conservatory', slug: 'azerbaijan-national-conservatory', cityId: 'c-baku', year: 1920, students: 1000, ranking: 38, state: true, logo: 'ANC', featured: false, langs: ['az'], nameI18n: { en: 'Azerbaijan National Conservatory', az: 'Azərbaycan Milli Konservatoriyası', ru: 'Азербайджанская национальная консерватория' }},
  { id: 'u-tau', name: 'Turkey-Azerbaijan University', slug: 'turkey-azerbaijan-university', cityId: 'c-baku', year: 2012, students: 500, ranking: 40, state: true, logo: 'TAU', featured: false, langs: ['az', 'tr', 'en'], nameI18n: { en: 'Turkey-Azerbaijan University', az: 'Türkiyə–Azərbaycan Universiteti', ru: 'Турецко-Азербайджанский университет', tr: 'Türkiye-Azerbaycan Üniversitesi' }},
  { id: 'u-asa', name: 'Azerbaijan State Sports Academy', slug: 'azerbaijan-state-sports-academy', cityId: 'c-baku', year: 1959, students: 3000, ranking: 32, state: true, logo: 'ASSA', featured: false, langs: ['az'], nameI18n: { en: 'Azerbaijan State Sports Academy', az: 'Azərbaycan Dövlət Bədən Tərbiyəsi və İdman Akademiyası', ru: 'Азербайджанская государственная академия спорта' }},
  { id: 'u-paida', name: 'Presidential Academy of Public Administration', slug: 'presidential-academy-state-governance', cityId: 'c-baku', year: 1999, students: 1500, ranking: 21, state: true, logo: 'PA', featured: false, langs: ['az', 'en'], nameI18n: { en: 'Presidential Academy of Public Administration', az: 'Azərbaycan Respublikası Prezidenti yanında Dövlət İdarəçilik Akademiyası', ru: 'Академия государственного управления при Президенте Азербайджана' }},
  { id: 'u-adda', name: 'Azerbaijan State Maritime Academy', slug: 'azerbaijan-state-maritime-academy', cityId: 'c-baku', year: 1996, students: 1000, ranking: 36, state: true, logo: 'ADMA', featured: false, langs: ['az'], nameI18n: { en: 'Azerbaijan State Maritime Academy', az: 'Azərbaycan Dövlət Dəniz Akademiyası', ru: 'Азербайджанская государственная морская академия' }},
  { id: 'u-maa', name: 'National Aviation Academy', slug: 'national-aviation-academy', cityId: 'c-baku', year: 1992, students: 2000, ranking: 26, state: true, logo: 'MAA', featured: false, langs: ['az'], nameI18n: { en: 'National Aviation Academy', az: 'Milli Aviasiya Akademiyası', ru: 'Национальная авиационная академия', tr: 'Milli Havacılık Akademisi' }},
  { id: 'u-bhos', name: 'Baku Higher Oil School', slug: 'baku-higher-oil-school', cityId: 'c-baku', year: 2011, students: 1500, ranking: 19, state: true, logo: 'BHOS', featured: false, langs: ['az', 'en'], nameI18n: { en: 'Baku Higher Oil School', az: 'Bakı Ali Neft Məktəbi', ru: 'Бакинская высшая нефтяная школа', tr: 'Bakü Yüksek Petrol Okulu' }},
  { id: 'u-atmu', name: 'Azerbaijan Tourism and Management University', slug: 'azerbaijan-tourism-management-university', cityId: 'c-baku', year: 1999, students: 2000, ranking: 23, state: true, logo: 'ATMU', featured: false, langs: ['az', 'en'], nameI18n: { en: 'Azerbaijan Tourism and Management University', az: 'Azərbaycan Turizm və Menecment Universiteti', ru: 'Азербайджанский университет туризма и менеджмента', ar: 'جامعة أذربيجان للسياحة والإدارة', fa: 'دانشگاه گردشگری و مدیریت آذربایجان', zh: '阿塞拜疆旅游与管理大学' }},
  { id: 'u-msu', name: 'Lomonosov Moscow State University Baku Branch', slug: 'lomonosov-moscow-state-university-baku', cityId: 'c-baku', year: 2007, students: 1000, ranking: 27, state: true, logo: 'MSU', featured: false, langs: ['ru'], nameI18n: { en: 'Lomonosov Moscow State University Baku Branch', az: 'M.V. Lomonosov adına Moskva Dövlət Universitetinin Bakı filialı', ru: 'Бакинский филиал МГУ им. М.В. Ломоносова' }},
  { id: 'u-sechenov', name: 'Sechenov First Moscow Medical University Baku Branch', slug: 'sechenov-first-moscow-medical-baku', cityId: 'c-baku', year: 2015, students: 500, ranking: 42, state: true, logo: 'SMU', featured: false, langs: ['ru'], nameI18n: { en: 'Sechenov First Moscow Medical University Baku Branch', az: 'İ.M. Seçenov adına Birinci Moskva Dövlət Tibb Universitetinin Bakı filialı', ru: 'Бакинский филиал Первого МГМУ им. И.М. Сеченова' }},
  { id: 'u-bxa', name: 'Baku Choreography Academy', slug: 'baku-choreography-academy', cityId: 'c-baku', year: 1931, students: 500, ranking: 41, state: true, logo: 'BXA', featured: false, langs: ['az'], nameI18n: { en: 'Baku Choreography Academy', az: 'Bakı Xoreoqrafiya Akademiyası', ru: 'Бакинская хореографическая академия' }},
  { id: 'u-ait', name: 'Azerbaijan Institute of Theology', slug: 'azerbaijan-institute-theology', cityId: 'c-baku', year: 2017, students: 500, ranking: 43, state: true, logo: 'AIT', featured: false, langs: ['az'], nameI18n: { en: 'Azerbaijan Institute of Theology', az: 'Azərbaycan İlahiyyat İnstitutu', ru: 'Азербайджанский институт теологии' }},
  { id: 'u-wcu', name: 'Western Caspian University', slug: 'western-caspian-university', cityId: 'c-baku', year: 1998, students: 2000, ranking: 29, state: false, logo: 'WCU', featured: false, langs: ['az', 'en'], nameI18n: { en: 'Western Caspian University', az: 'Qərbi Kaspi Universiteti', ru: 'Западно-Каспийский университет', tr: 'Batı Hazar Üniversitesi' }},
  { id: 'u-au', name: 'Azerbaijan University', slug: 'azerbaijan-university', cityId: 'c-baku', year: 1991, students: 1500, ranking: 33, state: false, logo: 'AU', featured: false, langs: ['az', 'en'], nameI18n: { en: 'Azerbaijan University', az: 'Azərbaycan Universiteti', ru: 'Азербайджанский университет' }},
  { id: 'u-oyu', name: 'Odlar Yurdu University', slug: 'odlar-yurdu-university', cityId: 'c-baku', year: 1995, students: 1000, ranking: 37, state: false, logo: 'OYU', featured: false, langs: ['az'], nameI18n: { en: 'Odlar Yurdu University', az: 'Odlar Yurdu Universiteti', ru: 'Университет «Одлар Юрду»' }},
  { id: 'u-beur', name: 'Baku Eurasian University', slug: 'baku-eurasian-university', cityId: 'c-baku', year: 2001, students: 1500, ranking: 34, state: false, logo: 'BEUR', featured: false, langs: ['az'], nameI18n: { en: 'Baku Eurasian University', az: 'Bakı Avrasiya Universiteti', ru: 'Бакинский евразийский университет' }},
  { id: 'u-bgu', name: 'Baku Girls University', slug: 'baku-girls-university', cityId: 'c-baku', year: 1999, students: 2000, ranking: 31, state: false, logo: 'BGU', featured: false, langs: ['az'], nameI18n: { en: 'Baku Girls University', az: 'Bakı Qızlar Universiteti', ru: 'Бакинский женский университет' }},
  { id: 'u-acu', name: 'Azerbaijan Cooperative University', slug: 'azerbaijan-cooperative-university', cityId: 'c-baku', year: 1931, students: 3000, ranking: 20, state: true, logo: 'ACU', featured: false, langs: ['az'], nameI18n: { en: 'Azerbaijan Cooperative University', az: 'Azərbaycan Kooperasiya Universiteti', ru: 'Азербайджанский кооперативный университет' }},
  { id: 'u-bbu', name: 'Baku Business University', slug: 'baku-business-university', cityId: 'c-baku', year: 2000, students: 2000, ranking: 30, state: false, logo: 'BBU', featured: false, langs: ['az', 'en'], nameI18n: { en: 'Baku Business University', az: 'Bakı Biznes Universiteti', ru: 'Бакинский бизнес-университет' }},
  { id: 'u-aalsra', name: 'Azerbaijan Academy of Labor and Social Relations', slug: 'azerbaijan-academy-labor-social-relations', cityId: 'c-baku', year: 1999, students: 1000, ranking: 39, state: true, logo: 'AALS', featured: false, langs: ['az'], nameI18n: { en: 'Azerbaijan Academy of Labor and Social Relations', az: 'Azərbaycan Əmək və Sosial Münasibətlər Akademiyası', ru: 'Азербайджанская академия труда и социальных отношений' }},
  { id: 'u-asau', name: 'Azerbaijan State Agricultural University', slug: 'azerbaijan-state-agricultural-university', cityId: 'c-ganja', year: 1929, students: 5000, ranking: 13, state: true, logo: 'ASAU', featured: false, langs: ['az'], nameI18n: { en: 'Azerbaijan State Agricultural University', az: 'Azərbaycan Dövlət Aqrar Universiteti', ru: 'Азербайджанский государственный аграрный университет' }},
  { id: 'u-nsu', name: 'Nakhchivan State University', slug: 'naxchivan-state-university', cityId: 'c-nakhchivan', year: 1961, students: 3000, ranking: 19, state: true, logo: 'NSU', featured: false, langs: ['az'], nameI18n: { en: 'Nakhchivan State University', az: 'Naxçıvan Dövlət Universiteti', ru: 'Нахичеванский государственный университет' }},
  { id: 'u-nmi', name: 'Nakhchivan Teachers Institute', slug: 'naxchivan-mteachers-institute', cityId: 'c-nakhchivan', year: 1999, students: 500, ranking: 44, state: true, logo: 'NTI', featured: false, langs: ['az'], nameI18n: { en: 'Nakhchivan Teachers Institute', az: 'Naxçıvan Müəllimlər İnstitutu', ru: 'Нахичеванский учительский институт' }},
  { id: 'u-qu', name: 'Karabakh University', slug: 'qarabagh-university', cityId: 'c-khankendi', year: 2023, students: 1000, ranking: 45, state: true, logo: 'KU', featured: false, langs: ['az'], nameI18n: { en: 'Karabakh University', az: 'Qarabağ Universiteti', ru: 'Карабахский университет' }},
];

const allLangs = ['en', 'tr', 'az', 'ru', 'de', 'fr', 'zh', 'ar', 'fa', 'tk', 'kk', 'ky', 'bg', 'ur', 'uz', 'sw', 'so', 'id'];

function getDesc(name, year, lang) {
  const templates = {
    en: (n, y) => y ? `${n} is a leading university in Azerbaijan, founded in ${y}.` : `${n} is a leading university in Azerbaijan.`,
    tr: (n, y) => y ? `${n}, ${y}'da kurulan Azerbaycan'ın önde gelen üniversitesidir.` : `${n}, Azerbaycan'ın önde gelen üniversitesidir.`,
    az: (n, y) => y ? `${n} Azərbaycanın aparıcı universitetidir, ${y}-ci ildə təsis olunub.` : `${n} Azərbaycanın aparıcı universitetidir.`,
    ru: (n, y) => y ? `${n} — ведущий университет Азербайджана, основанный в ${y} году.` : `${n} — ведущий университет Азербайджана.`,
    de: (n, y) => y ? `${n} ist eine führende Universität Aserbaidschans, gegründet ${y}.` : `${n} ist eine führende Universität Aserbaidschans.`,
    fr: (n, y) => y ? `${n} est une université de premier plan en Azerbaïdjan, fondée en ${y}.` : `${n} est une université de premier plan en Azerbaïdjan.`,
    zh: (n, y) => y ? `${n}是阿塞拜疆领先的大学，成立于${y}年。` : `${n}是阿塞拜疆领先的大学。`,
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
  return templates[lang] ? templates[lang](name, year) : templates.en(name, year);
}

let file = `import type { University } from '@/types';
import { seedImages, universityHero } from './images';
import { universityLogoImages } from './university-images';

export const seedUniversities: University[] = [
`;

for (const uni of universities) {
  const n = uni.name;
  const y = uni.year;
  file += `  {
    id: '${uni.id}',
    name: '${n.replace(/'/g, "\\'")}',
    nameI18n: {\n`;
  for (const [lang, val] of Object.entries(uni.nameI18n)) {
    file += `      ${lang}: '${val.replace(/'/g, "\\'")}',\n`;
  }
  file += `    },
    slug: '${uni.slug}',
    cityId: '${uni.cityId}',
    foundedYear: ${y},
    studentCount: ${uni.students},
    ranking: ${uni.ranking},
    accreditation: 'AR Ministry of Education Accredited',
    isState: ${uni.state},
    logoText: '${uni.logo}',
    heroImage: universityHero('${uni.slug}'),
    logoImage: universityLogoImages['${uni.slug}'] || universityHero('${uni.slug}'),
    gallery: [universityHero('${uni.slug}'), seedImages.campusLibrary, seedImages.students],
    languages: [${uni.langs.map(l => `'${l}'`).join(', ')}],
    featured: ${uni.featured},
    tagline: {
      en: 'Leading university in Azerbaijan',
      az: 'Azərbaycanın aparıcı universiteti',
    },
    description: {\n`;
  for (const lang of allLangs) {
    const uniName = uni.nameI18n[lang] || uni.nameI18n.en || n;
    const desc = getDesc(uniName, y, lang);
    file += `      ${lang}: '${desc.replace(/'/g, "\\'")}',\n`;
  }
  file += `    },
  },
`;
}

file += `];
`;

writeFileSync('src/lib/seed/universities.ts', file, 'utf8');
console.log(`Generated file with ${universities.length} universities`);
console.log(`File size: ${(file.length / 1024).toFixed(1)} KB`);

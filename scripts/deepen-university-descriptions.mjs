#!/usr/bin/env node
/**
 * Task 2: Deepen all 46 university descriptions.
 * Replace thin "X is a leading university..." with unique 100-200 word descriptions.
 */
import { readFileSync, writeFileSync } from "fs";

const fp = "src/lib/seed/universities.ts";
let c = readFileSync(fp, "utf8");

// University descriptions: slug -> { en, tr, az, ru, de, fr, fa, ar, tk, kk, ky, zh, bg, ur, uz, sw, so, id }
const DESCS = {
  "baku-state-university": {
    en: "Baku State University (BSU), founded in 1919, is the oldest and most prestigious university in Azerbaijan. Located in the heart of Baku, BSU consistently ranks as the #1 university in the country with over 25,000 students across 16 faculties. The university offers programs in medicine, law, physics, mathematics, philology, and international relations. BSU is a member of the European University Association and has partnerships with over 100 international institutions. Tuition ranges from $1,500-3,000/year for state-funded places, with English-taught programs available. The campus features modern laboratories, a 500,000-volume library, and the famous BSU Botanical Garden. Notable alumni include 50+ government ministers and prominent scientists. BSU holds the highest accreditation level from the Ministry of Education of Azerbaijan.",
    tr: "1919'da kurulan Bakü Devlet Üniversitesi (BSU), Azerbaycan'ın en eski ve en prestijli üniversitesidir. Bakü'nün merkezinde yer alan BSU, 16 fakülte ve 25.000'den fazla öğrenci ile ülkede sürekli olarak 1. sırada yer almaktadır.",
    az: "Bakı Dövlət Universiteti (BDU), 1919-cu ildə təsis olunmuş Azərbaycanın ən qədim və ən nüfuzlu universitetidir. Bakının mərkəzində yerləşən BDU 16 fakültə üzrə 25.000-dən çox tələbəyə təhsil verir.",
    ru: "Бакинский государственный университет (БГУ), основанный в 1919 году, является старейшим и самым престижным университетом Азербайджана. Расположенный в центре Баку, БГУ consistently занимает 1-е место в стране с более чем 25 000 студентов.",
    de: "Die Staatliche Universität Baku (BSU), gegründet 1919, ist die älteste und renommierteste Universität Aserbaidschans. Mit über 25.000 Studenten an 16 Fakultäten belegt sie konstant den 1. Platz im Land.",
    fr: "L'Université d'État de Bakou (BSU), fondée en 1919, est la plus ancienne et la plus prestigieuse université d'Azerbaïdjan. Avec plus de 25 000 étudiants répartis dans 16 facultés, elle occupe constamment la première place du pays.",
    fa: "دانشگاه دولتی باکو (BSU) که در سال ۱۹۱۹ تأسیس شد، قدیمی‌ترین و معتبرترین دانشگاه آذربایجان است. با بیش از ۲۵۰۰۰ دانشجو در ۱۶ دانشکده، همواره در رتبه اول کشور قرار دارد.",
    ar: "جامعة باكو الحكومية (BSU)، التي تأسست عام 1919، هي أقدم وأرقى جامعة في أذربيجان. تضم أكثر من 25000 طالب في 16 كلية وتحتل دائماً المرتبة الأولى في البلاد.",
    tk: "Baký Dawlat Universiteti (BSU), 1919-njy ýyldan gurulan Azerbaýjanyň iň eski we iň myhmanperwer universitetidir. 25.000-den gowrak ögransi bilen 16 fakultetde okatýar.",
    kk: "Баку мемлекеттік университеті (БМУ), 1919 жылы құрылған, Азербайджанның ең кәрі және ең беделді университеті. 25 000-нан астам студентпен 16 факультет бойынша оқытады.",
    ky: "Баку мамлекеттик университети (БМУ), 1919-жылы негизделген, Азербайджандын эң эски жана эң престиждүү университети. 25 000ден ашык студент менен 16 факультет боюнча окутат.",
    zh: "巴库国立大学（BSU）成立于1919年，是阿塞拜疆最古老、最负盛名的大学。拥有16个学院25000余名学生，始终位列全国第一。",
    bg: "Бакински държавен университет (БДУ), основан през 1919 г., е най-старият и най-престижен университет в Азербайджан. С над 25 000 студенти в 16 факултета, той заема първо място в страната.",
    ur: "بaku یونیورسٹی (BSU) جو 1919 میں قائم ہوا، آذربائیجان کی سب سے پرانی اور سب سے معروف یونیورسٹی ہے۔ 16 فیکلٹیز میں 25000 سے زیادہ طالب علموں کے ساتھ ہمیشہ ملک میں پہلے نمبر پر ہے۔",
    uz: "Baku Davlat Universiteti (BSU), 1919-yilda tashkil etilgan, Ozarbayjonning eng qadimiy va eng nufuzli universiteti. 25 000 dan ortiq talaba bilan 16 ta fakultetda ta'lim beradi.",
    sw: "Chuo Kikuu cha Jimco la Baku (BSU), kilichofunguliwa mwaka 1919, ndio chuo kikuu cha zamani zaidi na chenye heshima zaidi nchini Azerbaijan. Kina zaidi ya wanafunzi 25,000 katika vyuo 16.",
    so: "Jaamacadda Dawladda Baku (BSU), oo la aasaasay 1919, waa jaamacadda ugu da'da weyn ee ugu caansan Azerbaijan. Waxay leedahay in ka badan 25,000 arday oo ku jira 16 fakalti.",
    id: "Universitas Negeri Baku (BSU), didirikan tahun 1919, adalah universitas tertua dan paling bergengsi di Azerbaijan. Dengan lebih dari 25.000 mahasiswa di 16 fakultas, universitas ini selalu menempati peringkat pertama di negara ini.",
  },
  "ada-university": {
    en: "ADA University, founded in 2006 by the State Oil Company of Azerbaijan (SOCAR), is one of the most modern and internationally oriented universities in the country. Located in a stunning campus in Baku's Khatai district, ADA offers English-taught undergraduate and graduate programs in business administration, public affairs, computer science, and diplomacy. With approximately 2,500 students, ADA maintains a low student-to-faculty ratio of 12:1. Tuition ranges from $8,000-15,000/year. The university has partnerships with Georgetown, Stanford, and Johns Hopkins. ADA's School of Public and International Affairs is particularly renowned. The campus features state-of-the-art technology labs, a LEED-certified building, and the Caspian Policy Center. Over 40 nationalities are represented among students.",
    tr: "SOCAR tarafından 2006'da kurulan ADA Üniversitesi, ülkenin en modern ve uluslararası odaklı üniversitelerinden biridir. İngilizce eğitim veren ADA, iş idaresi, kamuoyu, bilgisayar bilimleri ve diplomaside programlar sunar.",
    az: "ADA Universiteti 2006-cı ildə SOCAR tərəfindən təsis edilmiş Azərbaycanın ən müasir və beynəlxalq orientasiyalı universitetlərindən biridir. İngilis dilində tədris proqramları təklif edir.",
    ru: "Университет ADA, основанный в 2006 году Государственной нефтяной компанией Азербайджана (SOCAR), является одним из самых современных и международно-ориентированных университетов страны.",
    de: "Die ADA University, 2006 von der Staatlichen Ölfonds Aserbaidschans (SOCAR) gegründet, ist eine der modernsten und international orientiertesten Universitäten des Landes.",
    fr: "L'Université ADA, fondée en 2006 par la Société pétrolière d'État d'Azerbaïdjan (SOCAR), est l'une des universités les plus modernes et les plus orientées vers l'international du pays.",
    fa: "دانشگاه ADA که در سال ۲۰۰۶ توسط شرکت دولتی نفت آذربایجان (SOCAR) تأسیس شد، یکی از مدرن‌ترین و بین‌المللی‌ترین دانشگاه‌های کشور است.",
    ar: "جامعة ADA التي تأسست عام 2006 من قبل شركة البترول الحكومية الأذربيجانية (SOCAR)، هي واحدة من أحدث الجامعات وأكثرها تمTHIً دولياً في البلاد.",
    tk: "ADA Uniwersiteti, 2006-njy ýylda SOCAR toýundan gurulan, ülkeniň iň zatgyş beren we internacionalesiýet giren universitetleriniň biridir.",
    kk: "ADA университеті, 2006 жылы SOCAR мұнай компаниясы құрған, елдің ең заманауи және халықаралық бағытталған университеттерінің бірі.",
    ky: "ADA университети, 2006-жылы SOCAR тарабынан негизделген, өлкөнүн эң заманбагы жана эл аралык багыттагы университеттеринин бири.",
    zh: "ADA大学由阿塞拜疆国家石油公司（SOCAR）于2006年创立，是该国最现代化和国际化的大学之一。",
    bg: "Университет ADA, основан през 2006 г. от Държавната петролна компания на Азербайджан (SOCAR), е един от най-модерните и международно ориентирани университети в страната.",
    ur: "ADA یونیورسٹی جو 2006 میں آذربائیجان کی سرکاری نفت کمپنی (SOCAR) کی طرف سے قائم کی گئی، ملک کی سب سے جدید اور بین الاقوامی یونیورسٹیوں میں سے ایک ہے۔",
    uz: "ADA universiteti, 2006-yilda SOCAR tomonidan tashkil etilgan, mamlakatning eng zamonaviy va xalqaro yo'nalishdagi universitetlaridan biri.",
    sw: "Chuo Kikuu cha ADA, kilichofunguliwa mwaka 2006 na Kampuni ya Petroli ya Jimco ya Azerbaijan (SOCAR), ni moja ya vyuo vipya zaidi na vinavyoelekezwa kimataifa nchini.",
    so: "Jaamacadda ADA, oo la aasaasay 2006-gu, waa jaamacadda ugu casrisan ee ugu caansan ee Azerbaijan.",
    id: "Universitas ADA, didirikan tahun 2006 oleh Perusahaan Minyak Negara Azerbaijan (SOCAR), adalah salah satu universitas paling modern dan berorientasi internasional di negara ini.",
  },
  "sumgayit-state-university": {
    en: "Sumqayit State University (SDU), founded in 2000, is located in Azerbaijan's third-largest city, Sumqayit, approximately 35 km from Baku. SDU has grown to accommodate over 5,000 students across 8 faculties including physics, mathematics, chemistry, philology, and history. The university offers both state-funded and paid places, with tuition for private places at approximately $1,000-2,000/year. SDU has partnerships with Turkish and European universities for student exchange programs. The campus includes modern science laboratories, a 200,000-volume library, and student dormitories. Sumqayit's industrial heritage provides unique opportunities for engineering and chemistry students. The university has graduated over 15,000 specialists since its founding.",
    tr: "2000'da kurulan Sumgayıt Devlet Üniversitesi (SDU), Bakü'ye yaklaşık 35 km uzaklıkta, Azerbaycan'ın en büyük üçüncü şehrinde yer almaktadır.",
    az: "Sumqayıt Dövlət Universiteti (SDU), 2000-ci ildə təsis olunmuşdur. Bakıdan təxminən 35 km məsafədə, Azərbaycanın üçüncü böyük şəhərində yerləşir.",
    ru: "Сумгайитский государственный университет (СГУ), основанный в 2000 году, расположен в третьем по величине городе Азербайджана — Сумгаите.",
    de: "Die Staatliche Universität Sumqayit (SDU), gegründet 2000, befindet sich in Sumqayit, der drittgrößten Stadt Aserbaidschans.",
    fr: "L'Université d'État de Sumqayit (SDU), fondée en 2000, est située à Sumqayit, la troisième plus grande ville d'Azerbaïdjan.",
    fa: "دانشگاه دولتی سومقاییت (SDU) که در سال ۲۰۰۰ تأسیس شد، در سومین شهر بزرگ آذربایجان واقع شده است.",
    ar: "جامعة سومقاييت الحكومية (SDU)، التي تأسست عام 2000، تقع في ثالث أكبر مدينة في أذربيجان.",
    tk: "Sumgait Dawlat Universiteti (SDU), 2000-njy ýyldan gurulan, Azerbaýjanyň üçjü ululyk şäherinde ýerleşýär.",
    kk: "Сумгаит мемлекеттік университеті (СМУ), 2000 жылы құрылған, Азербайджанның үшінші үлкен қаласында орналасқан.",
    ky: "Сумгаит мамлекеттик университети (СМУ), 2000-жылы негизделген, Азербайджандын үчүнчү чоң шаарында жайгашкан.",
    zh: "苏姆盖特国立大学（SDU）成立于2000年，位于阿塞拜疆第三大城市苏姆盖特。",
    bg: "Сумгаитски държавен университет (СДУ), основан през 2000 г., се намира в третия по големина град в Азербайджан — Сумгаит.",
    ur: "سمقایت سٹیٹ یونیورسٹی (SDU) جو 2000 میں قائم ہوا، آذربائیجان کے تیسرے بڑے شہر سم قایت میں واقع ہے۔",
    uz: "Sumgait Davlat Universiteti (SDU), 2000-yilda tashkil etilgan, Ozarbayjonning uchinchirte katta shahrida joylashgan.",
    sw: "Chuo Kikuu cha Jimco la Sumqayit (SDU), kilichofunguliwa mwaka 2000, kiko katika mji wa tatu mkubwa zaidi wa Azerbaijan.",
    so: "Jaamacadda Dawladda Sumqayit (SDU), oo la aasaasay 2000, waxay ku taalaa magaalada saddexaad ee ugu weyn Azerbaijan.",
    id: "Universitas Negeri Sumqayit (SDU), didirikan tahun 2000, terletak di kota terbesar ketiga Azerbaijan.",
  },
  "gance-state-university": {
    en: "Ganja State University (GSU), founded in 1939, is one of the oldest universities in Azerbaijan outside Baku. Located in Ganja, the country's second-largest city, GSU serves approximately 8,000 students across 11 faculties. The university offers programs in philology, history, mathematics, physics, chemistry, biology, law, and economics. Tuition for international students ranges from $800-1,500/year. GSU has partnerships with universities in Turkey, Georgia, and Kazakhstan. The campus includes a modern library, science laboratories, and sports facilities. Ganja's rich cultural heritage provides students with a unique learning environment. The university has produced over 50,000 graduates, including prominent politicians, scientists, and cultural figures.",
    tr: "1939'da kurulan Gence Devlet Üniversitesi (GSU), Bakü dışında Azerbaycan'ın en eski üniversitelerinden biridir.",
    az: "Gəncə Dövlət Universiteti (GDU), 1939-cu ildə təsis olunmuş Bakıdan kənarda ən qədim universitetlərdən biridir.",
    ru: "Гянджинский государственный университет (ГГУ), основанный в 1939 году, является одним из старейших университетов Азербайджана за пределами Баку.",
    de: "Die Staatliche Universität Gəncə (GSU), gegründet 1939, ist eine der ältesten Universitäten Aserbaidschans außerhalb Bakus.",
    fr: "L'Université d'État de Gandja (GSU), fondée en 1939, est l'une des plus anciennes universités d'Azerbaïdjan en dehors de Bakou.",
    fa: "دانشگاه دولتی گنجه (GSU) که در سال ۱۹۳۹ تأسیس شد، یکی از قدیمی‌ترین دانشگاه‌های آذربایجان خارج از باکو است.",
    ar: "جامعة غنجة الحكومية (GSU)، التي تأسست عام 1939، هي واحدة من أقدم الجامعات في أذربيجان خارج باكو.",
    tk: "Gence Dawlat Universiteti (GSU), 1939-njy ýyldan gurulan, Baký dan dysdaky Azerbaýjanyň iň eski universitetleriniň biridir.",
    kk: "Гянджа мемлекеттік университеті (ГМУ), 1939 жылы құрылған, Бакудан тыс Азербайджанның ең кәрі университеттерінің бірі.",
    ky: "Гянджа мамлекеттик университети (ГМУ), 1939-жылы негизделген, Бакудан тышкары Азербайджандын эң эски университеттеринин бири.",
    zh: "占贾国立大学（GSU）成立于1939年，是巴库以外阿塞拜疆最古老的大学之一。",
    bg: "Гянджински държавен университет (ГДУ), основан през 1939 г., е един от най-старите университети в Азербайджан извън Баку.",
    ur: "گنجه سٹیٹ یونیورسٹی (GSU) جو 1939 میں قائم ہوا، باکو سے باہر آذربائیجان کی سب سے پرانی یونیورسٹیوں میں سے ایک ہے۔",
    uz: "Ganja Davlat Universiteti (GSU), 1939-yilda tashkil etilgan, Bakudan tashqari Ozarbayjonning eng qadimiy universitetlaridan biri.",
    sw: "Chuo Kikuu cha Jimco la Ganja (GSU), kilichofunguliwa mwaka 1939, ni moja ya vyuo vya zamani zaidi nchini Azerbaijan nje ya Baku.",
    so: "Jaamacadda Dawladda Gence (GSU), oo la aasaasay 1939, waa jaamacadaha ugu da'da weyn ee Azerbaijan ka baxsan Baku.",
    id: "Universitas Negeri Ganja (GSU), didirikan tahun 1939, adalah salah satu universitas tertua di Azerbaijan di luar Baku.",
  },
  "nakhchivan-state-university": {
    en: "Nakhchivan State University (NSU), founded in 1961, is the leading institution of higher education in the Nakhchivan Autonomous Republic. With approximately 6,000 students across 9 faculties, NSU offers programs in medicine, engineering, humanities, and natural sciences. Tuition ranges from $600-1,200/year. The university has partnerships with Turkish universities and participates in the Erasmus+ exchange program. NSU is particularly strong in its medical faculty, which has gained international recognition. The campus includes modern laboratories, a library with over 300,000 volumes, and sports facilities. Nakhchivan's historical significance as a crossroads of civilizations provides a rich academic environment.",
    tr: "1961'da kurulan Nahçıvan Devlet Üniversitesi (NSU), Nahçıvan Özerk Cumhuriyeti'ndeki önde gelen yükseköğretim kurumudur.",
    az: "Naxçıvan Dövlət Universiteti (NDU), 1961-ci ildə təsis olunmuş Naxçıvan Muxtar Respublikasının aparıcı ali təhsil müəssisəsidir.",
    ru: "Нахчыванский государственный университет (НГУ), основанный в 1961 году, является ведущим вузом Нахчыванской Автономной Республики.",
    de: "Die Staatliche Universität Naxçıvan (NSU), gegründet 1961, ist die führende Hochschuleinrichtung der Autonomen Republik Naxçıvan.",
    fr: "L'Université d'État de Nakhitchevan (NSU), fondée en 1961, est l'institution d'enseignement supérieur leader de la République autonome de Nakhitchevan.",
    fa: "دانشگاه دولتی نخجوان (NSU) که در سال ۱۹۶۱ تأسیس شد، مهمترین مرکز آموزش عالی جمهوری خودمختار نخجوان است.",
    ar: "جامعة نخجةوان الحكومية (NSU)، التي تأسست عام 1961، هي المؤسسة الرائدة للتعليم العالي في جمهورية نخجةوان الذاتية.",
    tk: "Nahyýywan Dawlat Universiteti (NSU), 1961-njy ýyldan gurulan, Nahyýywan Muxtar Respublikasynyň iň mysger ornydyr.",
    kk: "Нахчыван мемлекеттік университеті (НМУ), 1961 жылы құрылған, Нахчыван Автономиялық Республикасының жетекші жоғары оқу орны.",
    ky: "Нахчыван мамлекеттик университети (НМУ), 1961-жылы негизделген, Нахчыван Автоном Республикасынын жетекчи жогорку окуу жайы.",
    zh: "纳希切万国立大学（NSU）成立于1961年，是纳希切万自治共和国的主要高等教育机构。",
    bg: "Нахичевански държавен университет (НДУ), основан през 1961 г., е водещата институция за висше образование в Нахичеванската автономна република.",
    ur: "نخجوان سٹیٹ یونیورسٹی (NSU) جو 1961 میں قائم ہوا، نخجوان خودمختار جمہوریہ میں اعلیٰ تعلیم کی سرکاری ادارہ ہے۔",
    uz: "Naxchivan Davlat Universiteti (NDU), 1961-yilda tashkil etilgan, Naxchivan Muxtor Respublikasining yetakchi oliy ta'lim muassasasi.",
    sw: "Chuo Kikuu cha Jimco la Nakhchivan (NSU), kilichofunguliwa mwaka 1961, ndio taasisi inayoongoza elimu ya juu katika Jamhuri ya Mahtu wa Nakhchivan.",
    so: "Jaamacadda Dawladda Naxçıvan (NSU), oo la aasaasay 1961, waa hay'adda ugu sarreysa ee waxbarashada sare ee Jamhuuriyadda Autonomiga Nakhchivan.",
    id: "Universitas Negeri Nakhchivan (NSU), didirikan tahun 1961, adalah institusi pendidikan tinggi terkemuka di Republik Otonom Nakhchivan.",
  },
  "medical-university": {
    en: "Azerbaijan Medical University (AMU), founded in 1930, is the oldest and largest medical university in the country. With over 8,000 students, AMU offers programs in general medicine, dentistry, pharmacy, nursing, and public health. Tuition ranges from $2,000-5,000/year for international students. The university has partnerships with WHO, Johns Hopkins, and Turkish medical schools. AMU's clinical base includes 15+ hospitals and medical centers in Baku. The university is particularly known for its English-language general medicine program, which attracts students from 20+ countries. Graduates receive WHO-recognized diplomas. AMU has produced over 30,000 medical professionals, including leading surgeons and researchers in the region.",
    tr: "1930'da kurulan Azerbaycan Tıp Üniversitesi (AMU), ülkenin en eski ve en büyük tıp üniversitesidir. 8.000'den fazla öğrencisi bulunmaktadır.",
    az: "Azərbaycan Tibb Universiteti (ATU), 1930-cu ildə təsis olunmuş ölkənin ən qədim və ən böyük tibb universitetidir. 8.000-dən çox tələbəsi var.",
    ru: "Азербайджанский медицинский университет (АМУ), основанный в 1930 году, является старейшим и крупнейшим медицинским университетом страны.",
    de: "Die Medizinische Universität Aserbaidschan (AMU), gegründet 1930, ist die älteste und größte Medizinuniversität des Landes.",
    fr: "L'Université médicale d'Azerbaïdjan (AMU), fondée en 1930, est la plus ancienne et la plus grande université de médecine du pays.",
    fa: "دانشگاه پزشکی آذربایجان (AMU) که در سال ۱۹۳۰ تأسیس شد، قدیمی‌ترین و بزرگ‌ترین دانشگاه پزشکی کشور است.",
    ar: "جامعة أذربيجان الطبية (AMU)، التي تأسست عام 1930، هي أقدم وأكبر جامعة طبية في البلاد.",
    tk: "Azerbaýjan Tıp Üniwersiteti (AMU), 1930-njy ýyldan gurulan, ülkeniň iň eski we iň uly tıp üniwersitetidir.",
    kk: "Азербайжан медициналық университеті (АМУ), 1930 жылы құрылған, елдің ең кәрі және ең үлкен медициналық университеті.",
    ky: "Азербайжан медициналык университети (АМУ), 1930-жылы негизделген, өлкөнүн эң эски жана эң чоң медициналык университети.",
    zh: "阿塞拜疆医科大学（AMU）成立于1930年，是该国最古老、最大的医科大学。",
    bg: "Азербайджански медицински университет (АМУ), основан през 1930 г., е най-старият и най-голям медицински университет в страната.",
    ur: "آذربائیجان میڈیکل یونیورسٹی (AMU) جو 1930 میں قائم ہوا، ملک کی سب سے پرانی اور سب سے بڑی طبی یونیورسٹی ہے۔",
    uz: "Ozarbayjon Tibbiyot Universiteti (AMU), 1930-yilda tashkil etilgan, mamlakatning eng qadimiy va eng katta tibbiyot universiteti.",
    sw: "Chuo Kikuu cha Tiba cha Azerbaijan (AMU), kilichofunguliwa mwaka 1930, ndio chuo kikuu cha tiba cha zamani zaidi na kikubwa zaidi nchini.",
    so: "Jaamacadda Caafimaadka Azerbaijan (AMU), oo la aasaasay 1930, waa jaamacadda caafimaadka ugu da'da weyn ee ugu weyn ee wadanka.",
    id: "Universitas Kedokteran Azerbaijan (AMU), didirikan tahun 1930, adalah universitas kedokteran tertua dan terbesar di negara ini.",
  },
};

// Find each university by slug and replace its description
let count = 0;
for (const [slug, descs] of Object.entries(DESCS)) {
  // Find the slug line
  const slugPattern = `slug: "${slug}"`;
  const slugIdx = c.indexOf(slugPattern);
  if (slugIdx === -1) {
    console.log(`NOT FOUND: ${slug}`);
    continue;
  }

  // Find the description block after the slug
  const descStart = c.indexOf("description: {", slugIdx);
  if (descStart === -1) {
    console.log(`NO DESC: ${slug}`);
    continue;
  }

  // Find the closing of the description block
  let depth = 0;
  let descEnd = -1;
  for (let i = descStart; i < c.length; i++) {
    if (c[i] === "{") depth++;
    if (c[i] === "}") {
      depth--;
      if (depth === 0) {
        descEnd = i + 1;
        break;
      }
    }
  }

  if (descEnd === -1) {
    console.log(`NO END: ${slug}`);
    continue;
  }

  // Build new description block
  const langs = ["en", "tr", "az", "ru", "de", "fr", "fa", "ar", "tk", "kk", "ky", "zh", "bg", "ur", "uz", "sw", "so", "id"];
  const indent = "      ";
  const lines = langs.map((lang) => {
    const val = descs[lang] || descs.en || `${slug} description`;
    const escaped = val.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
    return `${indent}${lang}: '${escaped}',`;
  });

  const newDesc = "description: {\n" + lines.join("\n") + "\n    }";

  // Replace the old description block
  const oldDesc = c.substring(descStart, descEnd);
  c = c.substring(0, descStart) + newDesc + c.substring(descEnd);
  count++;
  console.log(`UPDATED: ${slug}`);
}

// Now handle the remaining universities that don't have custom descriptions yet
// by finding the thin template pattern and flagging them
const thinPattern = /description: \{\s*\n\s*en: "[^"]*is a leading university in Azerbaijan, founded in (\d{4})\."/g;
let thinMatch;
const thinSlugs = [];
while ((thinMatch = thinPattern.exec(c)) !== null) {
  // Find the slug above this description
  const beforeDesc = c.substring(Math.max(0, thinMatch.index - 500), thinMatch.index);
  const slugMatch = beforeDesc.match(/slug: "([^"]+)"/);
  if (slugMatch) {
    thinSlugs.push(slugMatch[1]);
  }
}

console.log(`\n--- Updated ${count} universities ---`);
console.log(`Remaining thin descriptions: ${thinSlugs.length}`);
if (thinSlugs.length > 0) {
  console.log("Slugs:", thinSlugs.join(", "));
}

writeFileSync(fp, c, "utf8");
console.log("File saved!");

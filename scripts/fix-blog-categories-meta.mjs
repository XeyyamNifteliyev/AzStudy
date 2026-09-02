#!/usr/bin/env node
/**
 * Add all missing translations for blog categories, metaTitle, metaDescription
 */
import { readFileSync, writeFileSync } from 'fs';

const filePath = 'src/lib/seed/blog.ts';
const lines = readFileSync(filePath, 'utf8').split('\n');

const ALL_LANGS = ['en','tr','az','ru','de','fr','zh','ar','fa','tk','kk','ky','bg','ur','uz','sw','so','id'];

// Category translations (13 unique categories)
const catTr = {
  'Admissions': { de: 'Zulassung', fr: 'Admissions', zh: '招生', ar: 'القبول', fa: 'پذیرش', tk: 'Kabul', kk: 'Қабылдау', ky: 'Кабыл алуу', bg: 'Прием', ur: 'داخلہ', uz: 'Qabul', sw: 'Upokeaji', so: 'Qaadaabidda', id: 'Penerimaan' },
  'Universities': { de: 'Universitäten', fr: 'Universités', zh: '大学', ar: 'الجامعات', fa: 'دانشگاه‌ها', tk: 'Uniwersitetler', kk: 'Университеттер', ky: 'Университеттер', bg: 'Университети', ur: 'یونیورسٹیاں', uz: 'Universitetlar', sw: 'Vyuo', so: 'Jaamacado', id: 'Universitas' },
  'Education': { de: 'Bildung', fr: 'Éducation', zh: '教育', ar: 'التعليم', fa: 'آموزش', tk: 'Bilim', kk: 'Білім', ky: 'Билим', bg: 'Образование', ur: 'تعلیم', uz: 'Ta\'lim', sw: 'Elimu', so: 'Waxbarasho', id: 'Pendidikan' },
  'Student Life': { de: 'Studentenleben', fr: 'Vie étudiante', zh: '学生生活', ar: 'الحياة الطلابية', fa: 'زندگی دانشجویی', tk: 'Ögrıjençligi', kk: 'Студенттік өмір', ky: 'Студенттик өмүр', bg: 'Студентски живот', ur: 'طلباء کی زندگی', uz: 'Talaba hayoti', sw: 'Maisha ya wanafunzi', so: 'Nolosha Ardayga', id: 'Kehidupan Mahasiswa' },
  'Scholarships': { de: 'Stipendien', fr: 'Bourses', zh: '奖学金', ar: 'المنح الدراسية', fa: 'بورسیه‌ها', tk: 'Tabşyryklar', kk: 'Стипендиялар', ky: 'Стипендиялар', bg: 'Стипендии', ur: 'وظائف', uz: 'Stipendiyalar', sw: 'Stipendi', so: 'Stipendyo', id: 'Beasiswa' },
  'Why Azerbaijan': { de: 'Warum Aserbaidschan', fr: 'Pourquoi l\'Azerbaïdjan', zh: '为什么阿塞拜疆', ar: 'لماذا أذربيجان', fa: 'چرا آذربایجان', tk: 'Näme üşün Azerbayjan', kk: 'Неліктен Әзербайжан', ky: 'Эмнеге Азербайжан', bg: 'Защо Азербайджан', ur: 'آذربائیجان کیوں', uz: 'Nima uchun Ozarbayjon', sw: 'Kwa nini Azerbaijan', so: 'Maxay Azerbaijan', id: 'Mengapa Azerbaijan' },
  'Travel Guide': { de: 'Reiseführer', fr: 'Guide de voyage', zh: '旅行指南', ar: 'دليل السفر', fa: 'راهنمای سفر', tk: 'Syýahat Elňätze', kk: 'Саяхат нұсқаулығы', ky: 'Саякат колдонмосу', bg: 'Пътеводител', ur: 'سفر گائیڈ', uz: 'Sayohat qo\'llanmasi', sw: 'Mwongozo wa usafiri', so: 'Hage Socodka', id: 'Panduan Perjalanan' },
  'Medicine': { de: 'Medizin', fr: 'Médecine', zh: '医学', ar: 'الطب', fa: 'پزشکی', tk: 'Tibb', kk: 'Медицина', ky: 'Медицина', bg: 'Медицина', ur: 'طب', uz: 'Tibbiyot', sw: 'Tiba', so: 'Caafimaad', id: 'Kedokteran' },
  'Study Abroad': { de: 'Im Ausland studieren', fr: 'Étudier à l\'étranger', zh: '出国留学', ar: 'الدراسة بالخارج', fa: 'تحصیل در خارج', tk: 'Daşary ýurtlarda okamak', kk: 'Шетелде оқу', ky: 'Чет өлкөдө окуу', bg: 'Учене в чужбина', ur: 'غیر مملکت میں تعلیم', uz: 'Chet elda o\'qish', sw: 'Kusoma Nje', so: 'Waxbarasho Dibadda', id: 'Kuliah di Luar Negeri' },
  'Culture': { de: 'Kultur', fr: 'Culture', zh: '文化', ar: 'الثقافة', fa: 'فرهنگ', tk: 'Medeniýet', kk: 'Мәдениет', ky: 'Маданият', bg: 'Култура', ur: 'ثقافت', uz: 'Madaniyat', sw: 'Utamaduni', so: 'Dhaqan', id: 'Budaya' },
  'Comparison': { de: 'Vergleich', fr: 'Comparaison', zh: '比较', ar: 'مقارنة', fa: 'مقایسه', tk: 'Saňaşdyrma', kk: 'Салыстыру', ky: 'Салыштыруу', bg: 'Сравнение', ur: 'موازنہ', uz: 'Taqqoslash', sw: 'Linganisha', so: 'Is barbar dhig', id: 'Perbandingan' },
  'Visa Guide': { de: 'Visa-Leitfaden', fr: 'Guide visa', zh: '签证指南', ar: 'دليل التأشيرة', fa: 'راهنمای ویزا', tk: 'Wiza Elňätze', kk: 'Виза нұсқаулығы', ky: 'Виза колдонмосу', bg: 'Визов наръчник', ur: 'ویزا گائیڈ', uz: 'Viza qo\'llanmasi', sw: 'Mwongozo wa Visa', so: 'Hage Fiisiga', id: 'Panduan Visa' },
  'Engineering': { de: 'Ingenieurwesen', fr: 'Ingénierie', zh: '工程', ar: 'الهندسة', fa: 'مهندسی', tk: 'Muhendislik', kk: 'Инженерия', ky: 'Инженерия', bg: 'Инженерство', ur: 'انجینئرنگ', uz: 'Muhandislik', sw: 'Uhandisi', so: 'Injineering', id: 'Teknik' }
};

// Blog meta translations (slug -> { en, tr, az, ru, ... })
const metaTr = {
  'student-life-in-baku-azerbaijan': {
    metaTitle: { de: 'Studentenleben in Baku 2026 — Kosten, Unterkünfte, Campus', fr: 'Vie étudiante à Bakou 2026 — Coûts, logements, campus', zh: '2026年巴库学生生活 — 费用、住宿、校园', ar: 'الحياة الطلابية في باكو 2026 — التكاليف والسكن والحرم', fa: 'زندگی دانشجویی در باکو 2026 — هزینه‌ها، خوابگاه، دانشگاه', tk: 'Bakydaky Ögrıjençligi 2026 — Meşgeller, Örlük, Kampýs', kk: 'Бакудағы студенттік өмір 2026 — Шығыстар, жатақхана, кампус', ky: 'Бакудагы студенттик өмүр 2026 — Чыгашалар, жатакана, кампус', bg: 'Студентски живот в Баку 2026 — Разходи, настаняване, кампус', ur: 'باکو میں طلباء کی زندگی 2026 — اخراجات، رہائش، کیمپس', uz: 'Bakuda talaba hayoti 2026 — Xarajatlar, turar joy, kampus', sw: 'Maisha ya wanafunzi huko Baku 2026 — Gharama, makazi, kampasi', so: 'Nolosha Ardayga ee Baku 2026 — Kharashyo, Degmo, Kampas', id: 'Kehidupan Mahasiswa di Baku 2026 — Biaya, Akomodasi, Kampus' },
    metaDescription: { de: 'Leben als Student in Baku: Lebenshaltungskosten, Wohnheim-Unterkünfte, Campus-Leben und Tipps für internationale Studierende in Aserbaidschan.', fr: 'Vivre en étudiant à Bakou : coût de la vie, logements en résidence, vie de campus et conseils pour les étudiants internationaux.', zh: '在巴库的学生生活：生活费用、宿舍住宿、校园生活和国际学生小贴士。', ar: 'الحياة الطلابية في باكو: تكاليف المعيشة، الإقامة في الإسكان الجامعي، الحياة الحرمية ونصائح للطلاب الدوليين.', fa: 'زندگی دانشجویی در باکو: هزینه‌های زندگی، اقامت در خوابگاه، زندگی دانشگاهی و نکاتی برای دانشجویان بین‌المللی.', tk: 'Bakyda ögrıjençligi: Duran meşguliýet meşgeleri, ýatakhana ýaşaýyşy, kampýs ýaşaýyşy we milletlerara ögrıjençler üçin maslahatlar.', kk: 'Бакуда студент болу: өмір сүру құны, жатақхана, кампус өмірі және халықаралық студенттерге арналған кеңестер.', ky: 'Бакуда студент болу: жашоо чыгашалары, жатакана, кампус өмүрү жана эл аралык студенттерге арналган кеңештер.', bg: 'Студентски живот в Баку: разходи за живот, настаняване в общежитие, живот в кампус и съвети за международни студенти.', ur: 'باکو میں طلباء کی زندگی: رہائش کی اخراجات، ہاسٹل میں رہائش، کیمپس زندگی اور بین الاقوامی طلباء کے لیے مشورے۔', uz: 'Bakuda talaba bo\'lish: hayot xarajatlari, turar joy, kampus hayoti va xalqaro talabalar uchun maslahatlar.', sw: 'Kuishi kama mwanafunzi huko Baku: gharama za maisha, makazi ya hosteli, maisha ya kampasi na vidokezo kwa wanafunzi wa kimataifa.', so: 'Nolosha Ardayga ee Baku: Kharashyada nolosha, degmada hoyga, nolosha kampaska iyo talooyin ardayda caalamiga ah.', id: 'Kehidupan Mahasiswa di Baku: biaya hidup, asrama, kehidupan kampus, dan tips untuk mahasiswa internasional.' }
  },
  'best-universities-medicine-azerbaijan': {
    metaTitle: { de: 'Medizin studieren in Aserbaidschan 2026 — Beste Universitäten & Kosten', fr: 'Étudier la médecine en Azerbaïdjan 2026 — Meilleures universités et coûts', zh: '2026年阿塞拜疆医学院 — 最佳大学与费用', ar: 'الطب في أذربيجان 2026 — أفضل الجامعات والتكاليف', fa: 'پزشکی در آذربایجان 2026 — بهترین دانشگاه‌ها و هزینه‌ها', tk: 'Azerbayjanda Tibb Okamak 2026 — Iň Gowy Uniwersitetler we Meşgeller', kk: 'Әзербайжанда медицина оқу 2026 — Үздік университеттер мен шығыстар', ky: 'Азербайжанда медицина окуу 2026 — Мыкты университеттер жана чыгашалар', bg: 'Медицина в Азербайджан 2026 — Най-добри университети и разходи', ur: 'آذربائیجان میں طب 2026 — بہترین یونیورسٹیاں اور اخراجات', uz: 'Ozarbayjonda tibbiyot o\'qish 2026 — Eng yaxshi universitetlar va xarajatlar', sw: 'Kusoma Tiba huko Azerbaijan 2026 — Vyuo Bora na Gharama', so: 'Caafimaadka Waxbarasho ee Azerbaijan 2026 — Jaamacadaha Ugu Fiican iyo Kharashyada', id: 'Kedokteran di Azerbaijan 2026 — Universitas Terbaik & Biaya' },
    metaDescription: { de: 'Vergleich der besten medizinischen Universitäten in Aserbaidschan: Zulassung, Studiengebühre und Anerkennung für internationale Studierende.', fr: 'Comparaison des meilleures universités médicales en Azerbaïdjan : admission, frais et reconnaissance pour les étudiants internationaux.', zh: '比较阿塞拜疆最好的医学院：录取要求、学费和国际学生认可。', ar: 'مقارنة أفضل الجامعات الطبية في أذربيجان: القبول والرسوم والاعتماد للطلاب الدوليين.', fa: 'مقایسه بهترین دانشگاه‌های پزشکی آذربایجان: پذیرش، شهریه و تاییدیه برای دانشجویان بین‌المللی.', tk: 'Azerbayjandaky iň gowy tibb uniwersitetlerini saňaşdyrma: Kabul, meşgeller we milletlerara ögrıjençler üçin tanyşyk.', kk: 'Әзербайжанның үздік медициналық университеттерін салыстыру: Қабылдау, оқу ақысы және халықаралық студенттерге танылу.', ky: 'Азербайжандагы мыкты медициналык университеттерди салыштыруу: Кабыл алуу, оку акысы жана эл аралык студенттерге таанылу.', bg: 'Сравнение на най-добрите медицински университети в Азербайджан: прием, такси и признание за международни студенти.', ur: 'آذربائیجان کی بہترین طبی یونیورسٹیوں کا موازنہ: داخلہ، فیس اور بین الاقوامی طلباء کی تسلیم۔', uz: 'Ozarbayjonning eng yaxshi tibbiyot universitetlarini taqqoslash: Qabul, to\'lovlar va xalqaro talabalar uchun tan olish.', sw: 'Linganisha vyuo bora vya matibabu huko Azerbaijan: Upokeaji, ada na utambulisho kwa wanafunzi wa kimataifa.', so: 'Is barbar dhig jaamacadaha caafimaadka ee ugu fiican ee Azerbaijan: Qaadaabidda, kharashka iyo aqoonsiga ardayda caalamiga ah.', id: 'Bandingkan universitas kedokteran terbaik di Azerbaijan: penerimaan, biaya, dan pengakuan untuk mahasiswa internasional.' }
  },
  'azerbaijan-best-budget-study-destination': {
    metaTitle: { de: 'Aserbaidschan: Günstigstes Studienziel 2026', fr: 'Azerbaïdjan : destination d\'étude la moins chère 2026', zh: '阿塞拜疆：2026年最实惠的留学目的地', ar: 'أذربيجان: أرخص وجهة دراسة 2026', fa: 'آذربایجان: ارزان‌ترین مقصد تحصیلی 2026', tk: 'Azerbayjan: Iň aralykly bilim meqsedi 2026', kk: 'Әзербайжан: Ең арзан оқу бағыты 2026', ky: 'Азербайжан: Эң арзан окуу багыты 2026', bg: 'Азербайджан: Най-евтина дестинация за обучение 2026', ur: 'آذربائیجان: سب سے سستی تعلیمی منزل 2026', uz: 'Ozarbayjon: Eng arzon ta\'lim manzili 2026', sw: 'Azerbaijan: Enye gharama nafuu zaidi ya elimu 2026', so: 'Azerbaijan: Meesha Waxbarashada ee ugu jaban 2026', id: 'Azerbaijan: Destinasi Kuliah Termurah 2026' },
    metaDescription: { de: 'Warum Aserbaidschan das günstigste Studienziel ist: Vergleich der Lebenshaltungskosten, Studiengebühren und Lebensqualität.', fr: 'Pourquoi l\'Azerbaïdjan est la destination d\'étude la moins chère : comparaison des coûts, frais de scolarité et qualité de vie.', zh: '为什么阿塞拜疆是最实惠的留学目的地：生活费用、学费和生活质量比较。', ar: 'لماذا أذربيجان هي أرخص وجهة دراسة: مقارنة تكاليف المعيشة والرسوم وجودة الحياة.', fa: 'چرا آذربایجان ارزان‌ترین مقصد تحصیلی است: مقایسه هزینه‌های زندگی، شهریه و کیفیت زندگی.', tk: 'Näme üşün Azerbayjan iň aralykly bilim meqsedidir: Duran meşguliýet meşgeleri, okat meşgeli we ýaşaýyş gyzyklarynyň saňaşdyrmasy.', kk: 'Неліктен Әзербайжан ең арзан оқу бағыты: Өмір сүру құны, оқу ақысы және өмір сапасын салыстыру.', ky: 'Эмнеге Азербайжан эң арзан окуу багыты: Жашоо чыгашалары, оку акысы жана жашоо сапатынын салыштыруусу.', bg: 'Защо Азербайджан е най-евтината дестинация за обучение: сравнение на разходите, таксите и качеството на живот.', ur: 'آذربائیجان سب سے سستی تعلیمی منزل کیوں ہے: رہائش کی اخراجات، فیس اور زندگی کے معیار کا موازنہ۔', uz: 'Nima uchun Ozarbayjon eng arzon ta\'lim manzili: Hayot xarajatlari, to\'lovlar va hayot sifatini taqqoslash.', sw: 'Kwa nini Azerbaijan ni enye gharama nafuu zaidi: linganisha gharama za maisha, ada na ubora wa maisha.', so: 'Maxay Azerbaijan meesha waxbarashada ee ugu jaban tahay: Is barbaridda kharashyada nolosha, kharashka iyo tayada nolosha.', id: 'Mengapa Azerbaijan destinasi kuliah termurah: perbandingan biaya hidup, biaya kuliah, dan kualitas hidup.' }
  },
  'scholarships-study-azerbaijan': {
    metaTitle: { de: 'Stipendien in Aserbaidschan 2026 — Vollständiger Leitfaden', fr: 'Bourses en Azerbaïdjan 2026 — Guide complet', zh: '2026年阿塞拜疆奖学金 — 完整指南', ar: 'منح أذربيجان 2026 — دليل شامل', fa: 'بورسیه‌های آذربایجان 2026 — راهنمای کامل', tk: 'Azerbayjandaky Tabşyryklar 2026 — Doly Elňätze', kk: 'Әзербайжандағы стипендиялар 2026 — Толық нұсқаулық', ky: 'Азербайжандагы стипендиялар 2026 — Толук колдонмо', bg: 'Стипендии в Азербайджан 2026 — Пълен наръчник', ur: 'آذربائیجان میں وظائف 2026 — مکمل رہنما', uz: 'Ozarbayjon stipendiyalari 2026 — To\'liq qo\'llanma', sw: 'Stipendi huko Azerbaijan 2026 — Mwongozo Kamili', so: 'Stipendyada Azerbaijan 2026 — Hage Dhamaystiran', id: 'Beasiswa Azerbaijan 2026 — Panduan Lengkap' },
    metaDescription: { de: 'Vollständiger Leitfaden zu Stipendien für das Studium in Aserbaidschan: Regierungsstipendien, Universitätsförderung und Bewerbungstipps.', fr: 'Guide complet des bourses pour étudier en Azerbaïdjan : bourses gouvernementales, financement universitaire et conseils de candidature.', zh: '阿塞拜疆留学奖学金完整指南：政府奖学金、大学资助和申请建议。', ar: 'دليل شامل للمنح الدراسية للدراسة في أذربيجان: منح حكومية وتمويل جامعي ونصائح التقديم.', fa: 'راهنمای کامل بورسیه‌های تحصیلی در آذربایجان: بورسیه‌های دولتی، کمک‌هزینه دانشگاهی و نکات درخواست.', tk: 'Azerbayjanda okamak üçin tabşyryklaryň doly elňätze: Döwlet tabşyryklary, uniwersitet tölegi we başvuru maslahatlary.', kk: 'Әзербайжанда оқу үшін стипендиялар бойынша толық нұсқаулық: Үкімет стипендиялары, университет қаржыландыруы және өтініш бойынша кеңестер.', ky: 'Азербайжанда окуу үчүн стипендиялар боюнча толук колдонмо: Өкмөт стипендиялары, университет каржылоосу жана арыз берүү боюнча кеңештер.', bg: 'Пълен наръчник за стипендии за обучение в Азербайджан: правителствени стипендии, университетско финансиране и съвети за кандидатстване.', ur: 'آذربائیجان میں تعلیم کے لیے وظائف کا مکمل رہنما: سرکاری وظائف، یونیورسٹی فنڈنگ اور درخواست کے مشورے۔', uz: 'Ozarbayjonda o\'qish uchun stipendiyalar bo\'yicha to\'liq qo\'llanma: Hukumat stipendiyalari, universitet moliyalashtirishi va ariza maslahatlari.', sw: 'Mwongozo kamili wa stipendi za kusoma huko Azerbaijan: stipendi za serikali, ufadhili wa vyuo na vidokezo vya maombi.', so: 'Hage dhamaystiran ee stipendyada waxbarashada Azerbaijan: Stipendyo dawladeed, maaliyadda jaamacadaha iyo talooyinka codsiga.', id: 'Panduan lengkap beasiswa kuliah di Azerbaijan: beasiswa pemerintah, pendanaan universitas, dan tips pendaftaran.' }
  },
  'why-study-in-azerbaijan': {
    metaTitle: { de: 'Warum in Aserbaidschan studieren? Top-10 Gründe 2026', fr: 'Pourquoi étudier en Azerbaïdjan ? Top 10 raisons 2026', zh: '为什么在阿塞拜疆学习？2026年十大理由', ar: 'لماذا الدراسة في أذربيجان؟ أسباب أولى 2026', fa: 'چرا در آذربایجان تحصیل کنیم؟ ۱۰ دلیل برتر 2026', tk: 'Näme üşün Azerbayjanda okamaly? 10 esasy sebäp 2026', kk: 'Неліктен Әзербайжанда оқу керек? 10 негізгі себеп 2026', ky: 'Эмнеге Азербайжанда окуу керек? 10 негизги себеп 2026', bg: 'Защо да учите в Азербайджан? Топ 10 причини 2026', ur: 'آذربائیجان میں کیوں پڑھیں؟ 2026 کے 10 اہم وجوہات', uz: 'Nima uchun Ozarbayjonda o\'qish kerak? 10 ta asosiy sabab 2026', sw: 'Kwa nini kusoma huko Azerbaijan? Sababu 10 Bora 2026', so: 'Maxay Lagu Barta Azerbaijan? 10 Sababood ee Ugu Sarreeye 2026', id: 'Mengapa Kuliah di Azerbaijan? 10 Alasan Utama 2026' },
    metaDescription: { de: 'Entdecken Sie die Top-Gründe für ein Studium in Aserbaidschan: bezahlbare Bildung, kulturelle Vielfalt, Karrieremöglichkeiten und mehr.', fr: 'Découvrez les principales raisons d\'étudier en Azerbaïdjan : éducation abordable, diversité culturelle, opportunités de carrière et plus.', zh: '了解在阿塞拜疆学习的十大理由：可负担的教育、文化多样性、职业机会等。', ar: 'اكتشف أسباب الدراسة في أذربيجان: تعليم بأسعار معقولة، تنوع ثقافي، فرص مهنية والمزيد.', fa: 'دلایل اصلی تحصیل در آذربایجان را کشف کنید: آموزش مقرون به صرفه، تنوع فرهنگی، فرصت‌های شغلی و موارد دیگر.', tk: 'Azerbayjanda okamaýyň esasy sebäplerini açyň: aralykly bilim, medeni girdeş, kiplik mümjekleri we başgalary.', kk: 'Әзербайжанда оқудың негізгі себептерін ашыңыз: қолжетімді білім, мәдени әртүрлілік, мансап мүмкіндіктері және т.б.', ky: 'Азербайжанда окуунун негизги себептерин ачыңыз: жеткиликтүү билим, маданий ар түрдүүлүк, кесиптик мүмкүнчүлүктөр ж.б.', bg: 'Открийте причините да учите в Азербайджан: достъпно образование, културно разнообразие, кариерни възможности и още.', ur: 'آذربائیجان میں پڑھنے کی اہم وجوہات دریافت کریں: سستی تعلیم، ثقافتی تنوع، پیشہ ورانہ مواقع۔', uz: 'Ozarbayjonda o\'qishning asosiy sabablarini kashf eting: arzon ta\'lim, madaniy xilma-xillik, kasbiy imkoniyatlar.', sw: 'Gundua sababu kuu za kusoma huko Azerbaijan: elimu ya bei nafuu, utofauti wa kitamaduni, fursa za kazi na zaidi.', so: 'Ka gaar sababaha ugu waaweyn ee waxbarashada Azerbaijan: waxbarasho jaban, kala duwanaansho dhaqameed, fursado shaqo iyo wixii la mid ah.', id: 'Temukan alasan utama kuliah di Azerbaijan: pendidikan terjangkau, keragaman budaya, peluang karir, dan lainnya.' }
  },
  'azerbaijan-visa-guide-students': {
    metaTitle: { de: 'Aserbaidschan Visum für Studenten 2026 — Komplettleitfaden', fr: 'Visa Azerbaïdjan pour étudiants 2026 — Guide complet', zh: '2026年阿塞拜疆学生签证 — 完整指南', ar: 'تأشيرة أذربيجان للطلاب 2026 — دليل شامل', fa: 'ویزای آذربایجان برای دانشجویان 2026 — راهنمای کامل', tk: 'Azerbayjan Ögrıjençlaryň Wizasy 2026 — Doly Elňätze', kk: 'Әзербайжан студенттеріне виза 2026 — Толық нұсқаулық', ky: 'Азербайжан студенттерине виза 2026 — Толук колдонмо', bg: 'Виза за Азербайджан за студенти 2026 — Пълен наръчник', ur: 'طلباء کے لیے آذربائیجان ویزا 2026 — مکمل رہنما', uz: 'Ozarbayjon talabalar vizasi 2026 — To\'liq qo\'llanma', sw: 'Visa ya Azerbaijan kwa Wanafunzi 2026 — Mwongozo Kamili', so: 'Fiisiga Azerbaijan ee Ardayda 2026 — Hage Dhamaystiran', id: 'Visa Azerbaijan untuk Pelajar 2026 — Panduan Lengkap' },
    metaDescription: { de: 'Alles über das Studentenvisum für Aserbaidschan: Antragsprozess, benötigte Dokumente, Kosten und Verlängerung.', fr: 'Tout sur le visa étudiant pour l\'Azerbaïdjan : processus de demande, documents requis, coûts et renouvellement.', zh: '关于阿塞拜疆学生签证的一切：申请流程、所需文件、费用和续签。', ar: 'كل ما تحتاج لمعرفته عن تأشيرة الطلاب لأذربيجان: عملية التقديم، المستندات المطلوبة، التكاليف والتجديد.', fa: 'همه چیزهایی که باید درباره ویزای دانشجویی آذربایجان بدانید: فرآیند درخواست، مدارک مورد نیاز، هزینه‌ها و تمدید.', tk: 'Azerbayjan ögrıjenç wizasy barada hepisi: Başvuru prosesi, zerur belgiler, meşgeller we gaýtadan uzatma.', kk: 'Әзербайжан студенттік визасы туралы бәрі: Өтініш процесі, қажетті құжаттар, шығыстар және ұзарту.', ky: 'Азербайжан студенттик визасы жөнүндө бардык нерсе: Арыз берүү процесси, керектүү документтер, чыгашалар жана узартуу.', bg: 'Всичко за студентската виза за Азербайджан: процес на кандидатстване, необходими документи, разходи и подновяване.', ur: 'طلباء کی آذربائیجان ویزا کے بارے میں سب کچھ: درخواست کا عمل، ضروری دستاویزات، اخراجات اور تجدید۔', uz: 'Ozarbayjon talabalar vizasi haqida hammasi: Ariza jarayoni, kerakli hujjatlar, xarajatlar va yangilash.', sw: 'Kila kitu kuhusu visa ya wanafunzi wa Azerbaijan: mchakato wa maombi, hati zinazohitajika, gharama na ukarabati.', so: 'Wax kasta oo ku saabsan fiisiga ardayga Azerbaijan: habka codsiga, dukumentyada loo baahan yahay, kharashka iyo cusbooneysiinta.', id: 'Semua tentang visa pelajar Azerbaijan: proses pendaftaran, dokumen yang diperlukan, biaya, dan perpanjangan.' }
  },
  'azerbaijan-vs-turkey-comparison': {
    metaTitle: { de: 'Aserbaidschan vs. Türkei: Studienvergleich 2026', fr: 'Azerbaïdjan vs Turquie : comparaison des études 2026', zh: '阿塞拜疆 vs 土耳其：2026年留学比较', ar: 'أذربيجان مقابل تركيا: مقارنة الدراسة 2026', fa: 'آذربایجان در مقابل ترکیه: مقایسه تحصیلی 2026', tk: 'Azerbayjan we Türkiýe: Bilim Saňaşdyrmasy 2026', kk: 'Әзербайжан vs Түркия: Оқуды салыстыру 2026', ky: 'Азербайжан vs Түркия: Окууну салыштыруу 2026', bg: 'Азербайджан vs Турция: Сравнение на обучението 2026', ur: 'آذربائیجان بنام ترکی: تعلیمی موازنہ 2026', uz: 'Ozarbayjon vs Turkiya: Ta\'limni taqqoslash 2026', sw: 'Azerbaijan dhidi ya Uturuki: Linganisha Elimu 2026', so: 'Azerbaijan vs. Turkiga: Is barbaridda Waxbarashada 2026', id: 'Azerbaijan vs Turki: Perbandingan Kuliah 2026' },
    metaDescription: { de: 'Detaillierter Vergleich zwischen Studium in Aserbaidschan und der Türkei: Kosten, Qualität, Visa und Lebensqualität.', fr: 'Comparaison détaillée entre étudier en Azerbaïdjan et en Turquie : coûts, qualité, visa et qualité de vie.', zh: '阿塞拜疆与土耳其留学详细比较：费用、质量、签证和生活质量。', ar: 'مقارنة تفصيلية بين الدراسة في أذربيجان وتركيا: التكاليف والجودة وجودة الحياة.', fa: 'مقایسه تفصیلی تحصیل در آذربایجان و ترکیه: هزینه‌ها، کیفیت، ویزا و کیفیت زندگی.', tk: 'Azerbayjan we Türkiyede bilimiň giňişleýin saňaşdyrmasy: Meşgeller, hillik, wiza we ýaşaýyş gyzyklary.', kk: 'Әзербайжан мен Түркияда оқудың егжей-тегжейлі салыстыруы: шығыстар, сапа, виза және өмір сапасы.', ky: 'Азербайжан жана Түркияда окуунун жөнөкөй салыштыруусу: чыгашалар, сапаты, виза жана жашоо сапаты.', bg: 'Подробно сравнение на обучението в Азербайджан и Турция: разходи, качество, виза и качество на живот.', ur: 'آذربائیجان اور ترکی میں تعلیم کا تفصیلی موازنہ: اخراجات، معیار، ویزا اور زندگی کا معیار۔', uz: 'Ozarbayjon va Turkiyada o\'qishning batafsil taqqoslash: Xarajatlar, sifat, viza va hayot sifati.', sw: 'Linganisha kwa undani kusoma huko Azerbaijan na Uturuki: gharama, ubora, visa na ubora wa maisha.', so: 'Is barbar detail ah waxbarashada Azerbaijan iyo Turkiga: kharashyo, tayo, fiiso iyo tayada nolosha.', id: 'Perbandingan detail kuliah di Azerbaijan dan Turki: biaya, kualitas, visa, dan kualitas hidup.' }
  },
  'best-engineering-programs-azerbaijan': {
    metaTitle: { de: 'Beste Ingenieurprogramme in Aserbaidschan 2026', fr: 'Meilleurs programmes d\'ingénierie en Azerbaïdjan 2026', zh: '2026年阿塞拜疆最佳工程项目', ar: 'أفضل برامج الهندسة في أذربيجان 2026', fa: 'بهترین برنامه‌های مهندسی در آذربایجان 2026', tk: 'Azerbayjandaky Iň Gowy Muhendislik Programmalary 2026', kk: 'Әзербайжанның үздік инженерлік бағдарламалары 2026', ky: 'Азербайжандагы мыкты инженердик программалар 2026', bg: 'Най-добри инженерни програми в Азербайджан 2026', ur: 'آذربائیجان کے بہترین انجینئرنگ پروگرام 2026', uz: 'Ozarbayjonning eng yaxshi muhandislik dasturlari 2026', sw: 'Programu Bora za Uhandisi huko Azerbaijan 2026', so: 'Barnaamijyada Injineering ee ugu fiican Azerbaijan 2026', id: 'Program Teknik Terbaik di Azerbaijan 2026' },
    metaDescription: { de: 'Entdecken Sie die besten Ingenieurprogramme in Aserbaidschan: Petroleum, Informatik, Bauingenieurwesen und mehr.', fr: 'Découvrez les meilleurs programmes d\'ingénierie en Azerbaïdjan : pétrole, informatique, génie civil et plus.', zh: '探索阿塞拜疆最好的工程项目：石油、计算机科学、土木工程等。', ar: 'اكتشف أفضل برامج الهندسة في أذربيجان: النفط، علوم الحاسوب، الهندسة المدنية والمزيد.', fa: 'بهترین برنامه‌های مهندسی آذربایجان را کشف کنید: نفت، علوم کامپیوتر، مهندسی عمران و موارد دیگر.', tk: 'Azerbayjandaky iň gowy muhendislik programmalaryny açyň: Nefit, kompýuter syýamlary, gwirindislik we beýlekileri.', kk: 'Әзербайжанның үздік инженерлік бағдарламаларын ашыңыз: Мұнай, компьютер ғылымдары, құрылыс инженериясы және т.б.', ky: 'Азербайжандагы мыкты инженердик программаларды ачыңыз: Нефть, компьютер илимдери, курулуш инженериясы ж.б.', bg: 'Открийте най-добрите инженерни програми в Азербайджан: петрол, компютърни науки, строително инженерство и още.', ur: 'آذربائیجان کے بہترین انجینئرنگ پروگرام دریافت کریں: نفتی، کمپیوٹر سائنس، سول انجینئرنگ۔', uz: 'Ozarbayjonning eng yaxshi muhandislik dasturlarini kashf eting: Neft, kompyuter fanlari, qurilish muhandisligi.', sw: 'Gundua programu bora za uhandisi huko Azerbaijan: mafuta, sayansi ya kompyuta, uhandisi wa ujenzi na zaidi.', so: 'Barnaamijyada Injineering ee ugu fiican Azerbaijan ka hel: saliid, sayniska kombuyuutarka, injineerinka dhismaha.', id: 'Temukan program teknik terbaik di Azerbaijan: minyak, ilmu komputer, teknik sipil, dan lainnya.' }
  },
  'azerbaijani-language-students': {
    metaTitle: { de: 'Aserbaidschanische Sprache lernen 2026 — Leitfaden für Studenten', fr: 'Apprendre l\'azerbaïdjanais 2026 — Guide pour étudiants', zh: '2026年学习阿塞拜疆语 — 学生指南', ar: 'تعلم اللغة الأذربيجانية 2026 — دليل الطلاب', fa: 'یادگیری زبان آذربایجانی 2026 — راهنمای دانشجویان', tk: 'Azerbayjança dilini öwrenmek 2026 — Ögrıjençleriň Elňätze', kk: 'Әзербайжан тілін үйрену 2026 — Студенттерге арналған нұсқаулық', ky: 'Азербайжан тилин үйрөнүү 2026 — Студенттерге арналган колдонмо', bg: 'Научете азербайджански 2026 — Наръчник за студенти', ur: 'آذربائیجانی زبان سیکھیں 2026 — طلباء کے لیے گائیڈ', uz: 'Ozarbayjon tilini o\'rganish 2026 — Talabalar uchun qo\'llanma', sw: 'Jifunze lugha ya Azerbaijan 2026 — Mwongozo kwa Wanafunzi', so: 'Baro af Soomaaliga Azerbaijan 2026 — Hage Ardayda', id: 'Belajar Bahasa Azerbaijan 2026 — Panduan untuk Pelajar' },
    metaDescription: { de: 'Lernen Sie die Grundlagen der aserbaidschanischen Sprache: Alphabet, Grundwortschatz, Grammatik und Tipps für den schnellen Fortschritt.', fr: 'Apprenez les bases de l\'azerbaïdjanais : alphabet, vocabulaire de base, grammaire et conseils pour progresser rapidement.', zh: '学习阿塞拜疆语基础：字母表、基础词汇、语法和快速进步技巧。', ar: 'تعلم أساسيات اللغة الأذربيجانية: الأبجدية والمفردات والقواعد ونصائح التقدم السريع.', fa: 'اساسات زبان آذربایجانی را بیاموزید: الفبا، واژگان پایه، دستور زبان و نکات پیشرفت سریع.', tk: 'Azerbayjança diliniň esasy zatlaryny öwreniň: Elifba, esasy söz Zapas, grammatika we çalt ösüş maslahatlary.', kk: 'Әзербайжан тілінің негіздерін үйреніңіз: Әліпби, негізгі сөз қоры, грамматика және жылдам даму бойынша кеңестер.', ky: 'Азербайжан тилинин негиздерин үйрөңүз: Алфавит, негизги сөз запасы, грамматика жана ылдам өсүү боюнча кеңештер.', bg: 'Научете основите на азербайджанския език: азбука, основен речник, граматика и съвети за бърз напредък.', ur: 'آذربائیجانی زبان کی بنیادی باتیں سیکھیں: حروف تہجی، بنیادی ذخیرہ الفاظ، گرامر اور تیز پیشرفت کے مشورے۔', uz: 'Ozarbayjon tilining asoslarini o\'rganing: Alifbo, asosiy lug\'at, grammatika va tez o\'sish maslahatlari.', sw: 'Jifunze misingi ya lugha ya Alphabet, msingi wa maneno, sarufi na vidokezo vya maendeleo ya haraka.', so: 'Baro asaaska af Soomaaliga: Alifba, erayada aasaaska ah, garmar iyo talooyin horumar degdeg ah.', id: 'Pelajari dasar bahasa Azerbaijan: Abjad, kosakata dasar, tata bahasa, dan tips kemajuan cepat.' }
  },
  'baku-vs-other-cities-students': {
    metaTitle: { de: 'Baku vs. andere Städte: Wo studieren? 2026', fr: 'Baku vs autres villes : où étudier ? 2026', zh: '巴库 vs 其他城市：在哪里学习？2026', ar: 'باكو مقابل المدن الأخرى: أين تدرس؟ 2026', fa: 'باکو در مقابل شهرهای دیگر: کجا تحصیل کنیم؟ 2026', tk: 'Baka we beýleki şäherler: Nirede okamaly? 2026', kk: 'Баку басқа қалалармен: Қайда оқу керек? 2026', ky: 'Баку башка шаарлар менен: Кайда окуу керек? 2026', bg: 'Баку срещу други градове: Къде да учите? 2026', ur: 'باکو بنام دوسرے شہر: کہاں پڑھیں؟ 2026', uz: 'Baku boshqa shaharlarga nisbatan: Qayerda o\'qish kerak? 2026', sw: 'Baku dhidi ya miji mingine: Wapi kusoma? 2026', so: 'Baku vs magaalo kale: Xage loo barto? 2026', id: 'Baku vs kota lain: Kuliah di mana? 2026' },
    metaDescription: { de: 'Vergleichen Sie Baku mit anderen aserbaidschanischen Städten für das Studium: Kosten, Universitäten, Lebensqualität.', fr: 'Comparez Bakou avec d\'autres villes azerbaïdjanaises pour étudier : coûts, universités, qualité de vie.', zh: '比较巴库与阿塞拜疆其他城市的留学情况：费用、大学、生活质量。', ar: 'قارن بين باكو والمدن الأذربيجانية الأخرى للدراسة: التكاليف والجامعات وجودة الحياة.', fa: 'باکو را با شهرهای دیگر آذربایجان برای تحصیل مقایسه کنید: هزینه‌ها، دانشگاه‌ها و کیفیت زندگی.', tk: 'Bakanyň beýleki Azerbayjan şäherleri bilen saňaşdyrmasy: Meşgeller, uniwersiteler we ýaşaýyş gyzyklary.', kk: 'Бакуды басқа Әзербайжан қалаларымен салыстыру: Шығыстар, университеттер және өмір сапасы.', ky: 'Бакуну башка Азербайжан шаарлары менен салыштыруу: Чыгашалар, университеттер жана жашоо сапаты.', bg: 'Сравнете Баку с други азербайджански градове за обучение: разходи, университети, качество на живот.', ur: 'باکو کو دوسرے آذربائیجانی شہروں سے موازنہ کریں: اخراجات، یونیورسٹیاں، زندگی کا معیار۔', uz: 'Bakuni boshqa Ozarbayjon shaharlari bilan taqqoslash: Xarajatlar, universitetlar va hayot sifati.', sw: 'Linganisha Baku na miji mingine ya Azerbaijan kwa masomo: gharama, vyuo, ubora wa maisha.', so: 'Is barbar Baku iyo magaalooyinka kale ee Azerbaijan waxbarashada: kharashyo, jaamacado, tayada nolosha.', id: 'Bandingkan Baku dengan kota Azerbaijan lain untuk kuliah: biaya, universitas, kualitas hidup.' }
  }
};

// Now process the file
let currentPostId = null;
let inBlock = false;
let blockType = null;
let blockDepth = 0;
let blockLines = [];
const output = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Detect post ID
  const idMatch = line.match(/id:\s*["'](b-\d+)["']/);
  if (idMatch) currentPostId = idMatch[1];
  
  if (!inBlock) {
    // Detect category block
    const catMatch = line.match(/^(\s*)category:\s*\{/);
    const metaTMatch = line.match(/^(\s*)metaTitle:\s*\{/);
    const metaDMatch = line.match(/^(\s*)metaDescription:\s*\{/);
    
    if (catMatch) { inBlock = true; blockType = 'category'; blockDepth = 1; blockLines = [line]; continue; }
    if (metaTMatch) { inBlock = true; blockType = 'metaTitle'; blockDepth = 1; blockLines = [line]; continue; }
    if (metaDMatch) { inBlock = true; blockType = 'metaDescription'; blockDepth = 1; blockLines = [line]; continue; }
    
    output.push(line);
    continue;
  }
  
  blockLines.push(line);
  for (const ch of line) {
    if (ch === '{') blockDepth++;
    if (ch === '}') blockDepth--;
  }
  
  if (blockDepth <= 0) {
    const blockText = blockLines.join('\n');
    
    // Get the EN value for this block
    const enMatch = blockText.match(/en:\s*["']([^"']+)["']/);
    const enValue = enMatch ? enMatch[1] : null;
    
    const missing = ALL_LANGS.filter(l => !new RegExp(`^\\s+${l}:`, 'm').test(blockText));
    
    if (missing.length > 0 && enValue) {
      let trMap = null;
      
      if (blockType === 'category') {
        trMap = catTr[enValue];
      } else if (blockType === 'metaTitle' || blockType === 'metaDescription') {
        // Get slug for meta lookups
        const slugMatch = output.join('\n').match(/slug:\s*["']([^"']+)["']\s*,?\s*\n[\s\S]*$/);
        // Find slug from recent lines
        for (let j = output.length - 1; j >= Math.max(0, output.length - 10); j--) {
          const sm = output[j].match(/slug:\s*["']([^"']+)["']/);
          if (sm) {
            const slug = sm[1];
            trMap = metaTr[slug]?.[blockType];
            break;
          }
        }
      }
      
      if (trMap) {
        const actualMissing = missing.filter(l => trMap[l]);
        if (actualMissing.length > 0) {
          // Find last lang line
          let lastLangIdx = -1;
          for (let j = blockLines.length - 1; j >= 0; j--) {
            if (/^\s+\w+:/.test(blockLines[j])) {
              lastLangIdx = j;
              break;
            }
          }
          
          if (lastLangIdx >= 0) {
            const indent = blockLines[lastLangIdx].match(/^(\s+)/)?.[1] || '    ';
            if (!blockLines[lastLangIdx].trim().endsWith(',')) {
              blockLines[lastLangIdx] = blockLines[lastLangIdx].replace(/\r?$/, ',');
            }
            
            const newLines = actualMissing.map((l, idx) => {
              const val = trMap[l] || '';
              const isLast = idx === actualMissing.length - 1;
              return `${indent}${l}: "${val}"${isLast ? '' : ','}`;
            });
            
            blockLines.splice(lastLangIdx + 1, 0, ...newLines);
            console.log(`✅ ${blockType} (${enValue?.substring(0,20)}): +${actualMissing.length} langs`);
          }
        }
      }
    }
    
    output.push(...blockLines);
    inBlock = false;
    blockType = null;
    blockLines = [];
  }
}

writeFileSync(filePath, output.join('\n'), 'utf8');
console.log('\n✅ Blog categories + meta translations done!');

#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';

const filePath = 'src/lib/seed/blog.ts';
const content = readFileSync(filePath, 'utf8');
const lines = content.split('\n');

const ALL_LANGS = ['en','tr','az','ru','de','fr','zh','ar','fa','tk','kk','ky','bg','ur','uz','sw','so','id'];

const metaTranslations = {
  'how-to-apply-to-azerbaijani-universities': {
    metaTitle: {
      tr: 'Azerbaycan Universitelerine Nasil Basvurulur 2026', az: 'Azerbaycan Universitetlerine Nelic Muraciet Etmek Olar 2026', ru: 'Как поступить в азербайджанские университеты 2026', de: 'Bewerbung an aserbaidschanische Universitäten 2026', fr: "Comment postuler aux universités azerbaïdjanaises 2026", zh: '2026年阿塞拜疆大学申请指南', ar: 'كيفية التقدم للجامعات الأذربيجانية 2026', fa: 'نحوه درخواست به دانشگاه‌های آذربایجان 2026', tk: 'Azerbayjan Uniwersitetlerine Nädip Başvuru Edilär 2026', kk: 'Әзербайжан университеттеріне қалай түсуге болады 2026', ky: 'Азербайжан университеттерине кантип арыз берүү 2026', bg: 'Как да кандидатствате в азербайджански университети 2026', ur: 'آذربائیجان کی یونیورسٹیوں میں کیسے اپلائی کریں 2026', uz: 'Ozarbayjon universitetlariga qanday hujjat topshirish 2026', sw: 'Jinsi ya kuomba katika vyuo vikuu vya Azerbaijan 2026', so: 'Sida loo diiwaan galiyo jaamacadaha Azerbaijan 2026', id: 'Cara Melamar ke Universitas Azerbaijan 2026'
    },
    metaDescription: {
      tr: 'Azerbaycan universitelerine basvuru Sureci, Belgeler, Son Tarihler ve Vize Hakkinda Tam Rehber.', az: 'Azerbaycan universitetlerine muraciet prosesi, senedler, muddetler ve viza haqqinda teliki bIlgi.', ru: 'Полное руководство по поступлению в азербайджанские университеты: документы, сроки и виза.', de: 'Vollständiger Leitfaden zur Bewerbung an aserbaidschanische Universitäten: Dokumente, Fristen und Visa.', fr: "Guide complet pour postuler aux universités azerbaïdjanaises : documents, délais et visa.", zh: '阿塞拜疆大学申请完整指南：所需文件、截止日期和签证流程。', ar: 'دليل شامل للتقدم للجامعات الأذربيجانية: المستندات والمواعيد النهائية وعملية التأشيرة.', fa: 'راهنمای کامل درخواست به دانشگاه‌های آذربایجان: مدارک مورد نیاز، مهلت‌ها و فرآیند ویزا.', tk: 'Azerbayjan uniwersitetlerine basvuru prosedy, belgeler, soňky meýdanlyklar we wiza hakkynda doly elňat.', kk: 'Әзербайжан университеттеріне түсу бойынша толық нұсқаулық: құжаттар, мерзімдер және виза.', ky: 'Азербайжан университеттерине арыз берүү боюнча толук колдонмо: документтер, мөөнөттөр жана виза.', bg: 'Пълен наръчник за кандидатстване в азербайджански университети: документи, срокове и виза.', ur: 'آذربائیجان کی یونیورسٹیوں میں داخلے کا مکمل رہنما: ضروری دستاویزات، آخری تاریخ اور ویزا عمل.', uz: "Ozarbayjon universitetlariga ariza topshirish bo'yicha to'liq qo'llanma: hujjatlar, muddatlar va viza jarayoni.", sw: 'Mwongozo kamili wa kuomba vyuo vikuu vya Azerbaijan: hati, tarehe za mwisho, na mchakato wa visa.', so: 'Hage dhamaystiran ee codsiga jaamacadaha Azerbaijan: dukumentyo, waqtiyada ugu dambeeya, iyo habka fiisiga.', id: 'Panduan lengkap melamar universitas Azerbaijan: dokumen, tenggat waktu, dan proses visa.' }
  },
  'top-universities-in-baku': {
    metaTitle: {
      tr: "Bakudaki En Iyi Universiteler 2026 - Siralamalar", az: "Bakidaki En Yaxshi Universitetler 2026 - Reytingler", ru: 'Лучшие университеты Баку 2026 — Рейтинги', de: 'Die besten Universitäten in Baku 2026 — Rankings', fr: "Meilleures universités de Bakou 2026 — Classements", zh: '2026年巴库最佳大学 — 排名', ar: 'أفضل الجامعات في باكو 2026 — تصنيفات', fa: 'بهترین دانشگاه‌های باکو 2026 — رتبه‌بندی', tk: 'Bakudaky Iyi Uniwersitetler 2026 - Derejeler', kk: 'Бакудың үздік университеттері 2026 — Рейтингтер', ky: 'Бакудагы мыкты университеттер 2026 — Рейтингдер', bg: 'Най-добри университети в Баку 2026 — Класации', ur: 'باکو میں بہترین یونیورسٹیاں 2026 — ریٹنگ', uz: 'Bakuning eng yaxshi universitetlari 2026 — Reytinglar', sw: 'Vyuo Bora vya Baku 2026 — Majukumu', so: 'Jaamacadaha ugu fiican ee Baku 2026 — Dhibcaha', id: 'Universitas Terbaik di Baku 2026 — Peringkat'
    },
    metaDescription: {
      tr: "Bakudaki en iyi universiteler hakkinda bilgi - BDU, ADA, UNEC ve daha fazlasi.", az: "Bakidaki en yaxshi universitetler haqqinda melumat - BDU, ADA, UNEC ve daha cox.", ru: 'Информация о лучших университетах Баку — БГУ, ADA, УНЕК и других.', de: 'Informationen über die besten Universitäten in Baku — BSU, ADA, UNEC und mehr.', fr: "Informations sur les meilleures universités de Bakou — BSU, ADA, UNEC et plus.", zh: '关于巴库最佳大学的信息——BSU、ADA、UNEC等。', ar: 'معلومات عن أفضل الجامعات في باكو — جامعة باكو الحكومية، ADA، UNEC والمزيد.', fa: 'اطلاعاتی درباره بهترین دانشگاه‌های باکو — دانشگاه دولتی باکو، ADA، UNEC و موارد دیگر.', tk: 'Bakudaky iyi uniwersitetler barada maglumat - BDU, ADA, UNEC we kop.', kk: 'Бакудың үздік университеттері туралы ақпарат — БГУ, ADA, ҰНЕК және т.б.', ky: 'Бакудагы мыкты университеттер жөнүндө маалымат — БГУ, ADA, УНЕК ж.б.', bg: 'Информация за най-добри университети в Баку — СУ, ADA, УНЕК и още.', ur: 'باکو کی بہترین یونیورسٹیوں کے بارے میں معلومات — BSU، ADA، UNEC۔', uz: "Bakuning eng yaxshi universitetlari haqida ma'lumot — BSU, ADA, UNEC.", sw: 'Taarifa kuhusu vyuo bora vya Baku — BSU, ADA, UNEC na zaidi.', so: 'Macluumaad ku saabsan jaamacadaha ugu fiican ee Baku — BSU, ADA, UNEC iyo wax badan.', id: 'Informasi tentang universitas terbaik di Baku — BSU, ADA, UNEC, dan lainnya.' }
  },
  'cost-of-living-in-azerbaijan': {
    metaTitle: {
      tr: 'Azerbaycanda Yasam Maliyetleri 2026 - Ogrenci Rehberi', az: 'Azerbaycanda Yasayis Xercleri 2026 - Telebe Bilgilendirme', ru: 'Расходы на жизнь в Азербайджане 2026 — Руководство для студентов', de: 'Lebenshaltungskosten in Aserbaidschan 2026 — Studentenleitfaden', fr: "Coût de la vie en Azerbaïdjan 2026 — Guide étudiant", zh: '2026年阿塞拜疆生活费用 — 学生指南', ar: 'تكلفة المعيشة في أذربيجان 2026 — دليل الطلاب', fa: 'هزینه زندگی در آذربایجان 2026 — راهنمای دانشجویان', tk: 'Azerbayjanda Yasam Meşgeleri 2026 - Ogrıjenç Elňätze', kk: 'Әзербайжандағы өмір сүру құны 2026 — Студенттерге арналған нұсқаулық', ky: 'Азербайжандагы жашоо чыгашалары 2026 — Студенттерге арналган колдонмо', bg: 'Разходи за живот в Азербайджан 2026 — Наръчник за студенти', ur: 'آذربائیجان میں رہائش کی قیمتیں 2026 — طلباء کا رہنما', uz: "Ozarbayjon hayot xarajatlari 2026 — Talabalar uchun qo'llanma", sw: 'Gharama za maisha huko Azerbaijan 2026 — Mwongozo wa wanafunzi', so: 'Kharashyada Nolosha ee Azerbaijan 2026 — Hage Ardayda', id: 'Biaya Hidup di Azerbaijan 2026 — Panduan Mahasiswa'
    },
    metaDescription: {
      tr: 'Azerbaycanda ogrenci yasam maliyetleri hakkinda detayli bilgi - konaklama, yemek,ulasim.', az: 'Azerbaycanda telebe yasayis xercleri haqqinda etrafli melumat - yashayis, yemek, nəqliyyat.', ru: 'Подробная информация о расходах на жизнь студентов в Азербайджане — жилье, еда, транспорт.', de: 'Detaillierte Informationen über die Lebenshaltungskosten für Studenten in Aserbaidschan.', fr: 'Informations détaillées sur le coût de la vie étudiante en Azerbaïdjan.', zh: '阿塞拜疆学生生活费用详细信息——住宿、饮食、交通。', ar: 'معلومات تفصيلية عن تكاليف المعيشة للطلاب في أذربيجان.', fa: 'اطلاعات تفصیلی درباره هزینه‌های زندگی دانشجویی در آذربایجان.', tk: 'Azerbayjanda ogrıjenç yasam meşgeleri barada giňişleýin maglumat.', kk: 'Әзербайжандағы студенттік өмір құны туралы егжей-тегжейлі ақпарат.', ky: 'Азербайжандагы студенттик жашоо чыгашалары жөнүндөetailed маалымат.', bg: 'Подробна информация за разходите за студентски живот в Азербайджан.', ur: 'آذربائیجان میں طلباء کی رہائش کی اخراجات کے بارے میں تفصیلی معلومات۔', uz: "Ozarbayjon talaba hayoti xarajatlari haqida batafsil ma'lumot.", sw: 'Taarifa za kina kuhusu gharama za maisha ya wanafunzi huko Azerbaijan.', so: 'Macluumaad faahfaahsan ee kharashyada nolosha ardayga Azerbaijan.', id: 'Informasi detail tentang biaya hidup mahasiswa di Azerbaijan.' }
  },
  'scholarships-study-azerbaijan': {
    metaTitle: {
      tr: 'Azerbaycanda Burslar 2026 - Tam Rehber', az: 'Azerbaycanda Stipendiyalar 2026 - Teliki Bilgilendirme', ru: 'Стипендии в Азербайджане 2026 — Полное руководство', de: 'Stipendien in Aserbaidschan 2026 — Vollständiger Leitfaden', fr: "Bourses en Azerbaïdjan 2026 — Guide complet", zh: '2026年阿塞拜疆奖学金 — 完整指南', ar: 'منح أذربيجان 2026 — دليل شامل', fa: 'بورسیه‌های آذربایجان 2026 — راهنمای کامل', tk: 'Azerbayjanda Tabşyryklar 2026 - Doly Elňätze', kk: 'Әзербайжандағы стипендиялар 2026 — Толық нұсқаулық', ky: 'Азербайжандагы стипендиялар 2026 — Толук колдонмо', bg: 'Стипендии в Азербайджан 2026 — Пълен наръчник', ur: 'آذربائیجان میں وظائف 2026 — مکمل رہنما', uz: "Ozarbayjon stipendiyalari 2026 — To'liq qo'llanma", sw: 'Stipendi huko Azerbaijan 2026 — Mwongozo Kamili', so: 'Stipendyada Azerbaijan 2026 — Hage Dhamaystiran', id: 'Beasiswa Azerbaijan 2026 — Panduan Lengkap'
    },
    metaDescription: {
      tr: 'Azerbaycanda egitim burslari hakkinda bilgi - devlet burslari, universite destekleri.', az: 'Azerbaycanda tehsil stipendyalari haqqinda melumat - dovlet stipendyalari, universite destekleri.', ru: 'Информация о стипендиях для обучения в Азербайджане — государственные и университетские.', de: 'Informationen über Stipendien zum Studium in Aserbaidschan — staatliche und universitäre.', fr: "Informations sur les bourses d'études en Azerbaïdjan — bourses gouvernementales et universitaires.", zh: '阿塞拜疆留学奖学金信息——政府奖学金和大学资助。', ar: 'معلومات عن المنح الدراسية في أذربيجان — منح حكومية وتمويل جامعي.', fa: 'اطلاعات درباره بورسیه‌های تحصیلی در آذربایجان — بورسیه‌های دولتی و دانشگاهی.', tk: 'Azerbayjanda bilim tabşyryklary barada maglumat - döwlet tabşyryklary, uniwersitet goldawlary.', kk: 'Әзербайжандағы стипендиялар туралы ақпарат — мемлекеттік және университеттік.', ky: 'Азербайжандагы стипендиялар жөнүндө маалымат — өкмөттүк жана университеттик.', bg: 'Информация за стипендии за обучение в Азербайджан — правителствени и университетски.', ur: 'آذربائیجان میں تعلیمی وظائف کے بارے میں معلومات — سرکاری اور یونیورسٹی وظائف۔', uz: "Ozarbayjon ta'lim stipendiyalari haqida ma'lumot — davlat va universitet.", sw: 'Taarifa kuhusu ruzuku za elimu huko Azerbaijan — za serikali na vyuo.', so: 'Macluumaad ku saabsan stipendyada waxbarashada Azerbaijan — kuwa dawladeed iyo jaamacadeed.', id: 'Informasi tentang beasiswa kuliah di Azerbaijan — beasiswa pemerintah dan universitas.' }
  },
  'why-study-in-azerbaijan': {
    metaTitle: {
      tr: 'Neden Azerbaycanda Okumali? 10 Onemli Neden 2026', az: 'Niyede Azerbaycanda Tehsil Almaliyiq? 10 Esas Səbəb 2026', ru: 'Почему учиться в Азербайджане? 10 причин 2026', de: 'Warum in Aserbaidschan studieren? 10 Gründe 2026', fr: "Pourquoi étudier en Azerbaïdjan ? 10 raisons 2026", zh: '为什么在阿塞拜疆学习？2026年10大理由', ar: 'لماذا الدراسة في أذربيجان؟ 10 أسباب 2026', fa: 'چرا در آذربایجان تحصیل کنیم؟ ۱۰ دلیل 2026', tk: 'Näme üşün Azerbayjanda Okamaly? 10 Sebäp 2026', kk: 'Неліктен Әзербайжанда оқу керек? 10 себеп 2026', ky: 'Эмнеге Азербайжанда окуу керек? 10 себеп 2026', bg: 'Защо да учите в Азербайджан? 10 причини 2026', ur: 'آذربائیجان میں کیوں پڑھیں؟ 10 اہم وجوہات 2026', uz: "Nima uchun Ozarbayjonda o'qish kerak? 10 sabab 2026", sw: 'Kwa nini kusoma huko Azerbaijan? Sababu 10 2026', so: 'Maxay Lagu Barta Azerbaijan? 10 Sababood 2026', id: 'Mengapa Kuliah di Azerbaijan? 10 Alasan 2026'
    },
    metaDescription: {
      tr: 'Azerbaycanda okumak icin en iyi 10 neden - uygun fiyat, kulturel cesitlilik, kariyer firsatlari.', az: 'Azerbaycanda tehsil almaq icin en yaxshi 10 sebeb - ferqi qiymet, medeni cesitlilik, karyera imkanlari.', ru: 'Топ-10 причин учиться в Азербайджане: доступное образование, культура, карьера.', de: 'Top-10 Gründe für ein Studium in Aserbaidschan: Bildung, Kultur, Karriere.', fr: 'Top 10 des raisons d\'étudier en Azerbaïdjan : éducation, culture, carrière.', zh: '在阿塞拜疆学习的十大理由：教育、文化、职业。', ar: 'أسباب أولى للدراسة في أذربيجان: التعليم والثقافة والمهنة.', fa: '۱۰ دلیل برتر برای تحصیل در آذربایجان: آموزش، فرهنگ، شغل.', tk: 'Azerbayjanda okamaýyň 10 iň gowy sebäpi - bilim, medeniýet, kiplik.', kk: 'Әзербайжанда оқудың 10 үздік себебі — білім, мәдениет, мансап.', ky: 'Азербайжанда окуунун 10 мыкты себеби — билим, маданият, кесип.', bg: 'Топ 10 причини да учите в Азербайджан — образование, култура, кариера.', ur: 'آذربائیجان میں پڑھنے کی 10 بہترین وجوہات: تعلیم، ثقافت، کیریئر۔', uz: "Ozarbayjonda o'qishning 10 ta eng yaxshi sababi — ta'lim, madaniyat, kasbiy.", sw: 'Sababu 10 bora za kusoma huko Azerbaijan — elimu, utamaduni, kazi.', so: '10 Sababood ee ugu fiican waxbarashada Azerbaijan — waxbarasho, dhaqan, shaqo.', id: '10 Alasan Utama Kuliah di Azerbaijan — pendidikan, budaya, karir.' }
  },
  'azerbaijan-visa-guide-students': {
    metaTitle: {
      tr: 'Azerbaycan Ogrenci Vizesi Rehberi 2026', az: 'Azerbaycan Telebe Vizesi Bilgilendirme 2026', ru: 'Визовое руководство для студентов Азербайджана 2026', de: 'Aserbaidschan Studentenvisum Leitfaden 2026', fr: "Guide visa étudiant Azerbaïdjan 2026", zh: '2026年阿塞拜疆学生签证指南', ar: 'دليل تأشيرة الطلاب الأذربيجانية 2026', fa: 'راهنمای ویزای دانشجویی آذربایجان 2026', tk: 'Azerbayjan Ogrıjenç Wizasy Elňätze 2026', kk: 'Әзербайжан студенттік виза нұсқаулығы 2026', ky: 'Азербайжан студенттик виза колдонмосу 2026', bg: 'Наръчник за студентска виза за Азербайджан 2026', ur: 'آذربائیجان طلباء ویزا رہنما 2026', uz: "Ozarbayjon talabalar vizasi qo'llanmasi 2026", sw: 'Mwongozo wa Visa ya Wanafunzi wa Azerbaijan 2026', so: 'Hage Fiisiga Ardayga ee Azerbaijan 2026', id: 'Panduan Visa Pelajar Azerbaijan 2026'
    },
    metaDescription: {
      tr: 'Azerbaycan ogrenci vizesi icin gerekli belgeler, surecler ve ipuclari hakkinda bilgi.', az: 'Azerbaycan telebe vizesi ucun lazimi senedler, prosesler ve maslahatlar haqqinda melumat.', ru: 'Информация о документах, процессе и советах для получения студенческой визы в Азербайджан.', de: 'Informationen über Dokumente, Prozesse und Tipps für das Studentenvisum in Aserbaidschan.', fr: "Informations sur les documents, processus et conseils pour le visa étudiant en Azerbaïdjan.", zh: '阿塞拜疆学生签证所需文件、流程和建议。', ar: 'معلومات عن المستندات والعملية والنصائح للتأشيرة الطلابية في أذربيجان.', fa: 'اطلاعات درباره مدارک، فرآیند و نکات ویزای دانشجویی آذربایجان.', tk: 'Azerbayjan ogrıjenç wizasy üçin zerur belgiler, prosesler we maslahatlar barada maglumat.', kk: 'Әзербайжан студенттік визасы үшін қажетті құжаттар, процестер және кеңестер туралы ақпарат.', ky: 'Азербайжан студенттик визасы үчүн керектүү документтер, процесс жана кеңештер жөнүндө маалымат.', bg: 'Информация за документи, процеси и съвети за студентска виза в Азербайджан.', ur: 'آذربائیجان ویزا کے لیے ضروری دستاویزات، عمل اور مشورے کے بارے میں معلومات۔', uz: "Ozarbayjon vizasi uchun kerakli hujjatlar, jarayonlar va maslahatlar haqida ma'lumot.", sw: 'Taarifa kuhusu hati, michakato na vidokezo kwa visa ya wanafunzi wa Azerbaijan.', so: 'Macluumaad ku saabsan dukumentyada, hababka iyo talooyinka fiisiga ardayga Azerbaijan.', id: 'Informasi tentang dokumen, proses, dan tips visa pelajar Azerbaijan.' }
  },
  'azerbaijan-vs-turkey-comparison': {
    metaTitle: {
      tr: 'Azerbaycan ve Turkiye Karsilastirmasi 2026', az: 'Azerbaycan ve Turkiye Mukaayisesi 2026', ru: 'Сравнение Азербайджана и Турции 2026', de: 'Vergleich Aserbaidschan vs Türkei 2026', fr: "Comparaison Azerbaïdjan vs Turquie 2026", zh: '阿塞拜疆与土耳其比较 2026', ar: 'مقارنة أذربيجان وتركيا 2026', fa: 'مقایسه آذربایجان و ترکیه 2026', tk: 'Azerbayjan we Türkiýe Saňaşdyrmasy 2026', kk: 'Әзербайжан мен Түркияны салыстыру 2026', ky: 'Азербайжан менен Түркиянын салыштыруусу 2026', bg: 'Сравнение Азербайджан и Турция 2026', ur: 'آذربائیجان اور ترکی کا موازنہ 2026', uz: "Ozarbayjon va Turkiyani taqqoslash 2026", sw: 'Linganisha Azerbaijan na Uturuki 2026', so: 'Is barbaridda Azerbaijan iyo Turkiga 2026', id: 'Perbandingan Azerbaijan vs Turki 2026'
    },
    metaDescription: {
      tr: 'Azerbaycan ve Turkiye arasindaki farkli konularda detayli karsilastirma.', az: 'Azerbaycan ve Turkiye arasindaki ferqli mevzularda etrafli mukayise.', ru: 'Подробное сравнение различных аспектов Азербайджана и Турции.', de: 'Detaillierter Vergleich verschiedener Aspekte Aserbaidschans und der Türkei.', fr: "Comparaison détaillée de différents aspects de l'Azerbaïdjan et de la Turquie.", zh: '阿塞拜疆和土耳其各方面的详细比较。', ar: 'مقارنة تفصيلية بين مختلف جوانب أذربيجان وتركيا.', fa: 'مقایسه تفصیلی جنبه‌های مختلف آذربایجان و ترکیه.', tk: 'Azerbayjan we Türkiýe arasyndaky different mevzularda giňişleýin saňaşdyrma.', kk: 'Әзербайжан мен Түркияның әртүрлі аспектілерінің егжей-тегжейлі салыстыруы.', ky: 'Азербайжан менен Түркиянын ар түрлү аспекттеринин жөнөкөй салыштыруусу.', bg: 'Подробно сравнение на различни аспекти на Азербайджан и Турция.', ur: 'آذربائیجان اور ترکی کے مختلف پہلوؤں کا تفصیلی موازنہ۔', uz: "Ozarbayjon va Turkiyaning turli jihatlari haqida batafsil taqqoslash.", sw: 'Linganisha kwa undani mitazamo tofauti ya Azerbaijan na Uturuki.', so: 'Is barbardetail ah dhinacyo kala duwan ee Azerbaijan iyo Turkiga.', id: 'Perbandingan detail berbagai aspek Azerbaijan dan Turki.' }
  },
  'best-engineering-programs-azerbaijan': {
    metaTitle: {
      tr: 'Azerbaycanda En Iyi Muhendislik Programlari 2026', az: 'Azerbaycanda En Yaxshi Muhendislik Proqramlari 2026', ru: 'Лучшие инженерные программы в Азербайджане 2026', de: 'Beste Ingenieurprogramme in Aserbaidschan 2026', fr: "Meilleurs programmes d'ingénierie en Azerbaïdjan 2026", zh: '2026年阿塞拜疆最佳工程项目', ar: 'أفضل برامج الهندسة في أذربيجان 2026', fa: 'بهترین برنامه‌های مهندسی در آذربایجان 2026', tk: 'Azerbayjanda Iyi Muhendislik Programmalary 2026', kk: 'Әзербайжанның үздік инженерлік бағдарламалары 2026', ky: 'Азербайжандагы мыкты инженердик программалар 2026', bg: 'Най-добри инженерни програми в Азербайджан 2026', ur: 'آذربائیجان کے بہترین انجینئرنگ پروگرام 2026', uz: "Ozarbayjonning eng yaxshi muhandislik dasturlari 2026", sw: 'Programu Bora za Uhandisi huko Azerbaijan 2026', so: 'Barnaamijyada Injineering ee ugu fiican Azerbaijan 2026', id: 'Program Teknik Terbaik di Azerbaijan 2026'
    },
    metaDescription: {
      tr: 'Azerbaycandaki en iyi muhendislik programlari hakkinda bilgi - petrol, bilgisayar, insaat.', az: 'Azerbaycandaki en yaxshi muhendislik proqramlari haqqinda melumat - nefit, komputer, inşaat.', ru: 'Информация о лучших инженерных программах Азербайджана — нефть, компьютеры, строительство.', de: 'Informationen über die besten Ingenieurprogramme Aserbaidschans — Erdöl, IT, Bau.', fr: "Informations sur les meilleurs programmes d'ingénierie d'Azerbaïdjan — pétrole, informatique, BTP.", zh: '阿塞拜疆最佳工程项目信息——石油、计算机、建筑。', ar: 'معلومات عن أفضل برامج الهندسة في أذربيجان — النفط والحواسيب والبناء.', fa: 'اطلاعات درباره بهترین برنامه‌های مهندسی آذربایجان — نفت، کامپیوتر، عمران.', tk: 'Azerbayjandaky iyi muhendislik programmalary barada maglumat - nefit, kompyuter, inşaat.', kk: 'Әзербайжанның үздік инженерлік бағдарламалары туралы ақпарат — мұнай, IT, құрылыс.', ky: 'Азербайжандагы мыкты инженердик программалар жөнүндө маалымат — нефть, компьютер, курулуш.', bg: 'Информация за най-добри инженерни програми в Азербайджан — петрол, IT, строителство.', ur: 'آذربائیجان کے بہترین انجینئرنگ پروگراموں کے بارے میں معلومات — نفتی، آئی ٹی، تعمیرات۔', uz: "Ozarbayjonning eng yaxshi muhandislik dasturlari haqida ma'lumot — neft, IT, qurilish.", sw: 'Taarifa kuhusu programu bora za uhandisi za Azerbaijan — mafuta, IT, ujenzi.', so: 'Macluumaad ku saabsan barnaamijyada injineering ee ugu fiican ee Azerbaijan — saliid, IT, dhismo.', id: 'Informasi tentang program teknik terbaik Azerbaijan — minyak, IT, konstruksi.' }
  }
};

// Process file
let currentSlug = null;
const output = [];
let inMeta = false;
let metaType = null;
let blockDepth = 0;
let blockLines = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Track current slug
  const slugMatch = line.match(/slug:\s*["']([^"']+)["']/);
  if (slugMatch) currentSlug = slugMatch[1];
  
  if (!inMeta) {
    if (/^\s+metaTitle:\s*\{/.test(line) && !line.includes('}')) {
      inMeta = true; metaType = 'metaTitle'; blockDepth = 1; blockLines = [line]; continue;
    }
    if (/^\s+metaDescription:\s*\{/.test(line) && !line.includes('}')) {
      inMeta = true; metaType = 'metaDescription'; blockDepth = 1; blockLines = [line]; continue;
    }
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
    const missing = ALL_LANGS.filter(l => !new RegExp(`^\\s+${l}:`, 'm').test(blockText));
    
    if (missing.length > 0 && currentSlug && metaTranslations[currentSlug]?.[metaType]) {
      const trMap = metaTranslations[currentSlug][metaType];
      const actualMissing = missing.filter(l => trMap[l]);
      
      if (actualMissing.length > 0) {
        let lastIdx = -1;
        for (let j = blockLines.length - 1; j >= 0; j--) {
          if (/^\s+\w+:/.test(blockLines[j])) { lastIdx = j; break; }
        }
        if (lastIdx >= 0) {
          const indent = blockLines[lastIdx].match(/^(\s+)/)?.[1] || '      ';
          if (!blockLines[lastIdx].trim().endsWith(',')) {
            blockLines[lastIdx] = blockLines[lastIdx].replace(/\r?$/, ',');
          }
          const newLines = actualMissing.map((l, idx) => {
            const val = (trMap[l] || '').replace(/'/g, "\\'");
            const isLast = idx === actualMissing.length - 1;
            return `${indent}${l}: "${val}"${isLast ? '' : ','}`;
          });
          blockLines.splice(lastIdx + 1, 0, ...newLines);
          console.log(`✅ ${currentSlug?.substring(0,25)} ${metaType}: +${actualMissing.length}`);
        }
      }
    }
    
    output.push(...blockLines);
    inMeta = false;
    metaType = null;
    blockLines = [];
  }
}

writeFileSync(filePath, output.join('\n'), 'utf8');
console.log('\n✅ Blog meta translations done!');

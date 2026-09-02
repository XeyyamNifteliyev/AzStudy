#!/usr/bin/env node
/**
 * Translate 9 non-pillar blog posts (b-7 to b-16) to 14 missing languages.
 * Strategy: find "ru:" line in title/excerpt/content/meta blocks,
 * insert new language lines after it.
 */
import { readFileSync, writeFileSync } from "fs";

const fp = "src/lib/seed/blog.ts";
let c = readFileSync(fp, "utf8");
const lines = c.split("\n");

// Translation data per post: { postSlug, titles, excerpts, contentIntros, metaTitles, metaDescs }
const POSTS = [
  {
    slug: "top-10-must-visit-places-in-azerbaijan",
    titles: {
      de: "Die 10 besten Reiseziele in Aserbaidschan für Studierende",
      fr: "Les 10 incontournables en Azerbaïdjan pour les étudiants",
      fa: "۱۰ مقصد ضروری در آذربایجان برای دانشجویان",
      ar: "أفضل 10 أماكن يجب زيارتها في أذربيجان للطلاب",
      tk: "Öürnbergler üçin Azerbaýjanda 10 arassa ýer",
      kk: "Азербайжандағы студенттер үшін міндетті түрде баруға тиісті 10 орын",
      ky: "Азербайжандагы студенттер үчүн сөзсүз барыш керек болгон 10 жер",
      zh: "阿塞拜疆学生必去的10个地方",
      bg: "10-те задължителни места в Азербайджан за студенти",
      ur: "آذربائیجان میں طالب علموں کے لیے 10 لازمی مقامات",
      uz: "O'zbekiston talabalari uchun Azarbayjonda albatta borish kerak bo'lgan 10 joy",
      sw: "Mikono 10 lazima ya kutembelea huko Azerbaijan kwa wanafunzi",
      so: "10 meelood ee laga maarmaan ah ee Azerbaijan oo ardayda loogu talagalay",
      id: "10 Tempat Wajib Dikunjungi di Azerbaijan untuk Mahasiswa",
    },
    excerpts: {
      de: "Entdecken Sie die atemberaubendsten Reiseziele in Aserbaidschan — von der Altstadt bis zu den Feuerbergen.",
      fr: "Découvrez les destinations les plus époustouflantes d'Azerbaïdjan — de la vieille ville aux montagnes de feu.",
      fa: "زیباترین مقاصد آذربایجان را کشف کنید — از خیابان‌های باستانی تا کوه‌های آتشین.",
      ar: "اكتشف أجمل الوجهات في أذربيجان — من شوارع المدينة القديمة إلى جبال النار.",
      tk: "Azerbaýjanyň ajaýyp syýahat syýahasyny açyň — GOňşy Galaýyň kadanýardan",
      kk: "Азербайжанның ең таңғаларлық бағыттарын ашыңыз — қала ішінен от тауларына дейін",
      ky: "Азербайжандын эң таасирлүү жерлерин ачыңыз — эски шаардан от тоолорго чейин",
      zh: "探索阿塞拜疆最令人惊叹的目的地——从古城到火焰山。",
      bg: "Открийте най-зашеметяващите дестинации в Азербайджан — от Стария град до огнените планини.",
      ur: "آذربائیجان کے حیرت انگیز مقامات دریافت کریں — قدیم شہر سے لے کر آتش پہاڑوں تک۔",
      uz: "Ozarbayjonning eng hayratomuz yo'nalishlarini kashf eting — qadimiy shahardan olovli tog'largacha.",
      sw: "Gundua vivutio vya kushangaza zaidi vya Azerbaijan — kutoka mji wa kale hadi milima ya moto.",
      so: "Kaal oo ku raaxo meelaha ugu yaabka badan ee Azerbaijan — oo ay ku jiraan magaalada qadiimiga ah iyo buuraha dabka.",
      id: "Jelajahi destinasi paling menakjubkan di Azerbaijan — dari kota kuno hingga gunung api.",
    },
  },
  {
    slug: "student-life-in-baku-azerbaijan",
    titles: {
      de: "Studentenleben in Baku: Was Sie erwartet",
      fr: "La vie étudiante à Bakou : ce qu'il faut savoir",
      fa: "زندگی دانشجویی در باکو: چه انتظاراتی داشته باشیم",
      ar: "حياة الطالب في باكو: ماذا تتوقع",
      tk: "Bakowyň Ögr Ansi Ýaşady: Nädip Syýahat Etmek Bolar",
      kk: "Бакудағы студенттік өмір: Не күтуге болады",
      ky: "Бакудагы студенттик жашоо: Эмне күтсө болот",
      zh: "巴库的学生生活：需要了解的一切",
      bg: "Студентски живот в Баку: Какво да очаквате",
      ur: "بaku میں طالب علموں کی زندگی: کیا توقع رکھیں",
      uz: "Bakuda talaba hayoti: Nimalarni kutish kerak",
      sw: "Maisha ya wanafunzi huko Baku: Nini cha kutarajia",
      so: "Nolosha Ardayda ee Baku: Waxa Aad U Baahan Tahay Inaad Ogaato",
      id: "Kehidupan Mahasiswa di Baku: Apa yang Perlu Diketahui",
    },
    excerpts: {
      de: "Alles, was Sie über das Studentenleben in Baku wissen müssen — von der Campus-Kultur bis zu Wochenendabenteuern.",
      fr: "Tout ce qu'il faut savoir sur la vie étudiante à Bakou — de la culture du campus aux aventures du week-end.",
      fa: "هر آنچه باید درباره زندگی دانشجویی در باکو بدانید — از فرهنگ دانشگاهی تا ماجراهای آخر هفته.",
      ar: "كل ما تحتاج معرفته عن حياة الطالب في باكو — من ثقافة الحرم الجامعي إلى مغامرات عطلة نهاية الأسبوع.",
      tk: "Bakowyň ögransi ýaşady hakda bilmeniz gerekän her zat.",
      kk: "Бакудағы студенттік өмір туралы білу қажет нәрселердің барлығы.",
      ky: "Бакудагы студенттик жашоо жөнүндө билишиңиз керек болгон нерселердин баары.",
      zh: "关于巴库学生生活您需要知道的一切。",
      bg: "Всичко, което трябва да знаете за студентския живот в Баку.",
      ur: "بaku میں طالب علموں کی زندگی کے بارے میں وہ سب کچھ جو آپ جاننا چاہتے ہیں۔",
      uz: "Bakuda talaba hayoti haqida bilishingiz kerak bo'lgan hamma narsa.",
      sw: "Kila kitu unachohitaji kujua kuhusu maisha ya wanafunzi huko Baku.",
      so: "Wixii aad u baahan tahay inaad ka ogaato nolosha ardayda ee Baku.",
      id: "Semua yang perlu Anda ketahui tentang kehidupan mahasiswa di Baku.",
    },
  },
  {
    slug: "best-universities-medicine-azerbaijan",
    titles: {
      de: "Die besten Universitäten für Medizin in Aserbaidschan",
      fr: "Meilleures universités de médecine en Azerbaïdjan",
      fa: "بهترین دانشگاه‌های پزشکی در آذربایجان",
      ar: "أفضل الجامعات للطب في أذربيجان",
      tk: "Azerbaýjanda Tip Egitimi üçin Iyi Uniwersitetler",
      kk: "Азербайжандағы медицина үшін үздік университеттер",
      ky: "Азербайжандагы медицина үчүн мыкты университеттер",
      zh: "阿塞拜疆最佳医科大学",
      bg: "Най-добри университети за медицина в Азербайджан",
      ur: "آذربائیجان میں طب کے لیے بہترین یونیورسٹیاں",
      uz: "Ozarbayjonda tibbiyot uchun eng yaxshi universitetlar",
      sw: "Chuo Kikuu Bora kwa Tiba huko Azerbaijan",
      so: "Jaamicadaha ugu fiican ee Caafimaadka ee Azerbaijan",
      id: "Universitas Terbaik untuk Kedokteran di Azerbaijan",
    },
    excerpts: {
      de: "Vergleichen Sie medizinische Universitäten in Aserbaidschan — Studiengebühren, Programme und Karriereperspektiven.",
      fr: "Comparez les universités de médecine en Azerbaïdjan — frais, programmes et perspectives de carrière.",
      fa: "دانشگاه‌های پزشکی آذربایجان را مقایسه کنید — شهریه، برنامه‌ها و دورنمای شغلی.",
      ar: "قارن بين الجامعات الطبية في أذربيجان — الرسوم والبرامج وآفاق العمل.",
      tk: "Azerbaýjandaky tip universitetlerini saňaşdyryň.",
      kk: "Азербайжандағы медициналық университеттерді салыстырыңыз.",
      ky: "Азербайжандагы медициналык университеттерди салыштырыңыз.",
      zh: "比较阿塞拜疆的医科大学——学费、项目和职业前景。",
      bg: "Сравнете медицинските университети в Азербайджан — такси, програми и кариерни перспективи.",
      ur: "آذربائیجان میں طبی یونیورسٹیوں کا موازنہ کریں۔",
      uz: "Ozarbayjondagi tibbiyot universitetlarini solishtiring.",
      sw: "Linganisha vyuo vya tiba huko Azerbaijan — ada, programu, na fursa za kazi.",
      so: "Is barbar dhig jaamicadaha caafimaadka ee Azerbaijan — kharaashka, barnaamijyada, iyo fursadaha shaqada.",
      id: "Bandingkan universitas kedokteran di Azerbaijan — biaya, program, dan prospek karier.",
    },
  },
  {
    slug: "azerbaijan-best-budget-study-destination",
    titles: {
      de: "Warum Aserbaidschan das beste Budget-Studienziel ist",
      fr: "Pourquoi l'Azerbaïdjan est la meilleure destination d'études abordables",
      fa: "چرا آذربایجان بهترین مقصد تحصیلی ارزان است",
      ar: "لماذا أذربيجان هي أفضل وجهة دراسة بأسعار معقولة",
      tk: "Näden Azerbaýjan iýbi buýjetli okuýeri syýahasynyň syýahasynyň syýahasynyň",
      kk: "Неліктен Азербайжан ең жақсы бюджеттік оқу бағыты",
      ky: "Эмне үчүн Азербайжан эң жакшы бюджеттик окуу багыты",
      zh: "为什么阿塞拜疆是最佳性价比留学目的地",
      bg: "Защо Азербайджан е най-добрата бюджетна дестинация за обучение",
      ur: "آذربائیجان بہترین بجٹ تعلیمی مقصد کیوں ہے",
      uz: "Nima uchun Ozarbayjon eng yaxshi byudjetli ta'lim manzili",
      sw: "Kwa nini Azerbaijan ni lengo bora zaidi la elimu ya bajeti",
      so: "Maxaa Azerbaijan u tahay meesha ugu fiican ee waxbarashada kharashka yar",
      id: "Mengapa Azerbaijan adalah Destinasi Studi Budget Terbaik",
    },
    excerpts: {
      de: "Vergleichen Sie Studienkosten in Aserbaidschan mit der Türkei, Russland und Europa.",
      fr: "Comparez les coûts d'études en Azerbaïdjan avec la Turquie, la Russie et l'Europe.",
      fa: "هزینه‌های تحصیل در آذربایجان را با ترکیه، روسیه و اروپا مقایسه کنید.",
      ar: "قارن تكاليف الدراسة في أذربيجان مع تركيا وروسيا وأوروبا.",
      tk: "Azerbaýjanda okudyjy syýahatlaryň bahalaryny Türkistan, Rusiýa we Ýuwropa bilen saňaşdyryň.",
      kk: "Азербайжандағы оқу шығындарын Түркия, Ресей және Еуропамен салыстырыңыз.",
      ky: "Азербайжандагы окуу чыгымдарын Түркия, Орусия жана Европа менен салыштырыңыз.",
      zh: "比较阿塞拜疆与土耳其、俄罗斯和欧洲的留学费用。",
      bg: "Сравнете разходите за обучение в Азербайджан с Турция, Русия и Европа.",
      ur: "آذربائیجان میں تعلیم کی اقسام کا ترکی، روس اور یورپ سے موازنہ کریں۔",
      uz: "Ozarbayjonda o'qish xarajatlarini Turkiya, Rossiya va Yevropa bilan solishtiring.",
      sw: "Linganisha gharama za masomo huko Azerbaijan na Uturuki, Urusi na Ulaya.",
      so: "Is barbar dhig kharashka waxbarashada ee Azerbaijan la barbar dhig Turkiga, Ruushka, iyo Yurub.",
      id: "Bandingkan biaya kuliah di Azerbaijan dengan Turki, Rusia, dan Eropa.",
    },
  },
  {
    slug: "azerbaijani-culture-traditions-guide",
    titles: {
      de: "Aserbaidschanische Kultur und Traditionen: Ein Studierendenführer",
      fr: "Culture et traditions azerbaïdjanaises : un guide pour étudiants",
      fa: "فرهنگ و سنت‌های آذربایجانی: راهنمای دانشجویان",
      ar: "ثقافة وتقاليد أذربيجانية: دليل الطلاب",
      tk: "Azerbaýjan kültüri we gelenekleri: Ögransi elňätze",
      kk: "Азербайжан мәдениеті мен дәстүрлері: Студенттерге арналған нұсқаулық",
      ky: "Азербайжан маданияты жана салт-жөнөкөйлөрү: Студенттер үчүн колдонмо",
      zh: "阿塞拜疆文化和传统：学生指南",
      bg: "Култура и традиции на Азербайджан: Студентски наръчник",
      ur: "آذربائیجانی ثقافت اور روایات: طالب علموں کا رہنما",
      uz: "Ozarbayjon madaniyati va an'analar: Talabalar uchun qo'llanma",
      sw: "Utamaduni na mila za Azerbaijan: Mwongozo kwa Wanafunzi",
      so: "Dhaqanka iyo Dhaqanka Azerbaijan: Hiddaha Ardayda",
      id: "Budaya dan Tradisi Azerbaijan: Panduan Mahasiswa",
    },
    excerpts: {
      de: "Erfahren Sie mehr über die aserbaidschanische Kultur, Traditionen und Gebräuche.",
      fr: "Apprenez la culture, les traditions et les coutumes azerbaïdjanaises.",
      fa: "با فرهنگ، سنت‌ها و آداب و رسوم آذربایجانی آشنا شوید.",
      ar: "تعرّف على الثقافة والتقاليد والعادات الأذربيجانية.",
      tk: "Azerbaýjan kültüri, gelenekleri we adetleri hakda bilgi ediniň.",
      kk: "Азербайжан мәдениеті, дәстүрлері мен әдет-ғұрыптары туралы біліңіз.",
      ky: "Азербайжан маданияты, салт-жөнөкөйлөрү жана адат-өрнөктөрү жөнүндө билиңиз.",
      zh: "了解阿塞拜疆文化、传统和习俗。",
      bg: "Научете за азербайджанската култура, традиции и обичаи.",
      ur: "آذربائیجانی ثقافت، روایات اور رسم و رواج کے بارے میں جانیں۔",
      uz: "Ozarbayjon madaniyati, an'analar va odatlari haqida bilib oling.",
      sw: "Jifunze kuhusu utamaduni, mila na desturi za Azerbaijan.",
      so: "Wax ku saabsan dhaqanka, dhaqanka iyo caadooyinka Azerbaijan.",
      id: "Pelajari budaya, tradisi, dan adat istiadat Azerbaijan.",
    },
  },
  {
    slug: "azerbaijan-weather-climate-students",
    titles: {
      de: "Wetter und Klima in Aserbaidschan: Was Studierende wissen sollten",
      fr: "Météo et climat en Azerbaïdjan : ce que les étudiants doivent savoir",
      fa: "آب و هوای آذربایجان: آنچه دانشجویان باید بدانند",
      ar: "الطقس والمناخ في أذربيجان: ما يجب على الطلاب معرفته",
      tk: "Azerbaýjanda howa we iýlim: Ögransi bilmen gerek",
      kk: "Азербайжандағы ауа-райы мен климат: Студенттер білуі тиіс",
      ky: "Азербайжандагы аба ырайы жана климат: Студенттер билиши керек",
      zh: "阿塞拜疆天气和气候：学生须知",
      bg: "Време и климат в Азербайджан: Какво трябва да знаят студентите",
      ur: "آذربائیجان میں موسم اور موسم: طالب علموں کو کیا معلوم ہونا چاہیے",
      uz: "Ozarbayjon ob-havosi va iqlimi: Talabalar bilmishi kerak",
      sw: "Hali ya hewa na tabianchi huko Azerbaijan: Wanafunzi wajue",
      so: "Cimilada iyo Cimilada Azerbaijan: Waxa ay Ardaydu U Baahan Yihiin Inay Ogaadaan",
      id: "Cuaca dan Iklim di Azerbaijan: Yang Perlu Diketahui Mahasiswa",
    },
    excerpts: {
      de: "Was Studierende über das Wetter und Klima in Aserbaidschan wissen müssen.",
      fr: "Ce que les étudiants doivent savoir sur la météo et le climat en Azerbaïdjan.",
      fa: "آنچه دانشجویان باید درباره آب و هوای آذربایجان بدانند.",
      ar: "ما يجب على الطلاب معرفته عن الطقس والمناخ في أذربيجان.",
      tk: "Azerbaýjanda howa we iýlim hakda ögransi bilmen gerek.",
      kk: "Студенттер Азербайжанның ауа-райы мен климаты туралы не білуі керек.",
      ky: "Студенттер Азербайжандын аба ырайы жана климаты жөнүндө эмне билиши керек.",
      zh: "学生需要了解的阿塞拜疆天气和气候信息。",
      bg: "Какво трябва да знаят студентите за времето и климата в Азербайджан.",
      ur: "طالب علموں کو آذربائیجان کے موسم کے بارے میں کیا معلوم ہونا چاہیے۔",
      uz: "Talabalar Ozarbayjon ob-havosi va iqlimi haqida nima bilmalari kerak.",
      sw: "Wanafunzi wajue kuhusu hali ya hewa na tabianchi ya Azerbaijan.",
      so: "Waxa ay Ardaydu U Baahan Yihiin Inay Ka Ogaadaan Cimilada Azerbaijan.",
      id: "Yang perlu diketahui mahasiswa tentang cuaca dan iklim Azerbaijan.",
    },
  },
  {
    slug: "azerbaijan-vs-turkey-study-abroad",
    titles: {
      de: "Aserbaidschan vs. Türkei: Was ist besser fürs Studium im Ausland?",
      fr: "Azerbaïdjan vs Turquie : quel est le meilleur pour étudier à l'étranger ?",
      fa: "آذربایجان در مقابل ترکیه: کدام برای تحصیل در خارج بهتر است؟",
      ar: "أذربيجان مقابل تركيا: أيهما أفضل للدراسة في الخارج؟",
      tk: "Azerbaýjan we Türkiýe: Hangisi başgada okamak üçin gowy?",
      kk: "Азербайжан және Түркия: Шетелде оқу үшін қайсысы жақсы?",
      ky: "Азербайжан жана Түркия: Чет өлкөдө окуу үчүн кайсысы жакшы?",
      zh: "阿塞拜疆 vs 土耳其：哪个更适合出国留学？",
      bg: "Азербайджан срещу Турция: Коя е по-добра за обучение в чужбина?",
      ur: "آذربائیجان بنام ترکیہ: کون سا غیر مملکت میں تعلیم کے لیے بہتر ہے؟",
      uz: "Ozarbayjon vs Turkiya: Qaysi biri chet elda o'qish uchun yaxshiroq?",
      sw: "Azerbaijan dhidi ya Uturuki: Kipi bora kwa masomo nje ya nchi?",
      so: "Azerbaijan vs Turkiga: Kamaa ayaa u fiican waxbarashada dibadda?",
      id: "Azerbaijan vs Turki Mana yang Lebih Baik untuk Studi di Luar Negeri?",
    },
    excerpts: {
      de: "Detaillierter Vergleich zwischen Studium in Aserbaidschan und der Türkei.",
      fr: "Comparaison détaillée entre études en Azerbaïdjan et en Turquie.",
      fa: "مقایسه جزئیات تحصیل در آذربایجان و ترکیه.",
      ar: "مقارنة تفصيلية بين الدراسة في أذربيجان وتركيا.",
      tk: "Azerbaýjan we Türkiýedeki okudyjy syýahatlaryň giňişleýin saňaşdyrmasy.",
      kk: "Азербайжан мен Түркиядағы оқудың егжей-тегжейлі салыстыруы.",
      ky: "Азербайжан жана Түркияда окуунун-detail салыштыруусу.",
      zh: "阿塞拜疆与土耳其留学详细对比。",
      bg: "Подробно сравнение между обучението в Азербайджан и Турция.",
      ur: "آذربائیجان اور ترکیہ میں تعلیم کا تفصیلی موازنہ۔",
      uz: "Ozarbayjon va Turkiyada o'qishning batafsil solishtiruvi.",
      sw: "Ulinganisho wa kina kuhusu masomo huko Azerbaijan na Uturuki.",
      so: "Is barbar dhig faahfaahsan ee waxbarashada Azerbaijan iyo Turkiga.",
      id: "Perbandingan detail studi di Azerbaijan vs Turki.",
    },
  },
  {
    slug: "student-visa-azerbaijan-complete-guide",
    titles: {
      de: "Studentenvisum für Aserbaidschan: Komplettleitfaden 2025",
      fr: "Visa étudiant pour l'Azerbaïdjan : guide complet 2025",
      fa: "ویزای دانشجویی آذربایجان: راهنمای کامل 2025",
      ar: "تأشيرة الطالب لأذربيجان: الدليل الكامل 2025",
      tk: "Azerbaýjana Ögransi Wizasy: Dolu Elňätze 2025",
      kk: "Азербайжандағы студенттік виза: Толық нұсқаулық 2025",
      ky: "Азербайжандагы студенттик виза: Толук колдонмо 2025",
      zh: "阿塞拜疆学生签证：完整指南 2025",
      bg: "Студентска виза за Азербайджан: Пълен наръчник 2025",
      ur: "آذربائیجان کے لیے طالب علم ویزا: مکمل رہنما 2025",
      uz: "Ozarboyjon talaba vizasi: To'liq qo'llanma 2025",
      sw: "Visa ya Wanafunzi kwa Azerbaijan: Mwongozo Kamili 2025",
      so: "Fiisiga Ardayga ee Azerbaijan: Hiddaha Buuxda 2025",
      id: "Visa Pelajar untuk Azerbaijan: Panduan Lengkap 2025",
    },
    excerpts: {
      de: "Alles über die Beantragung eines Studentenvisums für Aserbaidschan.",
      fr: "Tout ce qu'il faut savoir pour obtenir un visa étudiant en Azerbaïdjan.",
      fa: "هر آنچه درباره دریافت ویزای دانشجویی آذربایجان باید بدانید.",
      ar: "كل ما تحتاج معرفته للحصول على تأشيرة طالب لأذربيجان.",
      tk: "Azerbaýjan ögransi wizasyny nädip almak mulýamok.",
      kk: "Азербайжан студенттік визасын алу туралы білу қажет нәрселер.",
      ky: "Азербайжан студенттик визасын алу жөнүндө билишиңиз керек нерселердин баары.",
      zh: "关于获取阿塞拜疆学生签证您需要知道的一切。",
      bg: "Всичко, което трябва да знаете за получаването на студентска виза за Азербайджан.",
      ur: "آذربائیجان سے طالب علم ویزا حاصل کرنے کے لیے وہ سب کچھ جو آپ جاننا چاہتے ہیں۔",
      uz: "Ozarboyjon talaba vizasini olish haqida bilishingiz kerak bo'lgan hamma narsa.",
      sw: "Kila kitu unachohitaji kujua kuhusu upatikani wa visa ya wanafunzi kwa Azerbaijan.",
      so: "Wixii aad u baahan tahay inaad ka ogaato helitaanka fiisiga ardayga ee Azerbaijan.",
      id: "Semua yang perlu Anda ketahui tentang mendapatkan visa pelajar untuk Azerbaijan.",
    },
  },
  {
    slug: "top-engineering-programs-azerbaijan",
    titles: {
      de: "Die besten Ingenieurprogramme in Aserbaidschan für internationale Studierende",
      fr: "Meilleurs programmes d'ingénierie en Azerbaïdjan pour les étudiants internationaux",
      fa: "بهترین برنامه‌های مهندسی در آذربایجان برای دانشجویان بین‌المللی",
      ar: "أفضل برامج الهندسة في أذربيجان للطلاب الدوليين",
      tk: "Dünýä ögransylary üçin Azerbaýjandaky iýgi muhendislik programmalary",
      kk: "Халықаралық студенттер үшін Азербайжанның үздік инженерлік бағдарламалары",
      ky: "Эл аралык студенттер үчүн Азербайжандагы мыкты инженердик программалар",
      zh: "面向国际学生的阿塞拜疆顶级工程项目",
      bg: "Най-добри инженерни програми в Азербайджан за международни студенти",
      ur: "بین الاقوامی طالب علموں کے لیے آذربائیجان کے بہترین انجینئرنگ پروگرام",
      uz: "Xalqaro talabalar uchun Ozarbayjonning eng yaxshi muhandislik dasturlari",
      sw: "Programu Bora za Uhandisi huko Azerbaijan kwa Wanafunzi wa Kimataifa",
      so: "Barnaamijyada Injineering ee ugu fiican Azerbaijan oo loogu talagalay Ardayda Caalamiga ah",
      id: "Program Teknik Terbaik di Azerbaijan untuk Mahasiswa Internasional",
    },
    excerpts: {
      de: "Entdecken Sie die besten Ingenieurprogramme in Aserbaidschan — von Petroleum bis Informatik.",
      fr: "Découvrez les meilleurs programmes d'ingénierie en Azerbaïdjan — du pétrole à l'informatique.",
      fa: "بهترین برنامه‌های مهندسی آذربایجان را کشف کنید — از نفت تا علوم کامپیوتر.",
      ar: "اكتشف أفضل برامج الهندسة في أذربيجان — من هندسة البترول إلى علوم الحاسوب.",
      tk: "Azerbaýjandaky iýgi muhendislik programmalary açyň — neft muhendisliginden kompýuter ilmine.",
      kk: "Азербайжанның үздік инженерлік бағдарламаларын ашыңыз — мұнай инженериясынан计算机 ғылымына дейін.",
      ky: "Азербайжандагы мыкты инженердик программаларды ачыңыз — мунай инженериясынан компьютер илимине чейин.",
      zh: "探索阿塞拜疆最佳工程项目——从石油工程到计算机科学。",
      bg: "Открийте най-добрите инженерни програми в Азербайджан — от петролна инженерия до компютърни науки.",
      ur: "آذربائیجان کے بہترین انجینئرنگ پروگرام دریافت کریں — نفت انجینئرنگ سے کمپیائر سائنس تک۔",
      uz: "Ozarbayjonning eng yaxshi muhandislik dasturlarini kashf eting — neft muhandisligidan kompyuter faniga.",
      sw: "Gundua programu bora za uhandisi huko Azerbaijan — kutoka uhandisi wa mafuta hadi sayansi ya kompyuta.",
      so: "Kaalis barnaamijyada injineering ee ugu fiican Azerbaijan — injineerinta saliidda ilaa sayniska kombiyuutarka.",
      id: "Jelajahi program teknik terbaik di Azerbaijan — dari teknik minyak hingga ilmu komputer.",
    },
  },
];

// Process each post
for (const post of POSTS) {
  const idLine = lines.findIndex(
    (l) => l.includes(`slug: "${post.slug}"`) || l.includes(`slug: '${post.slug}'`)
  );
  if (idLine === -1) {
    console.log(`Post not found: ${post.slug}`);
    continue;
  }

  // Find title block: look for first "ru:" after idLine
  const titleRuIdx = findRuLine(idLine, "title");
  if (titleRuIdx !== -1) {
    const insert = buildLangLines(post.titles, "    ");
    lines.splice(titleRuIdx + 1, 0, ...insert);
    // Recalculate line offsets after insertion
    recalc();
  }

  // Find excerpt block
  const excerptRuIdx = findRuLine(idLine, "excerpt");
  if (excerptRuIdx !== -1) {
    const insert = buildLangLines(post.excerpts, "    ");
    lines.splice(excerptRuIdx + 1, 0, ...insert);
    recalc();
  }
}

function findRuLine(startIdx, section) {
  // Search forward from startIdx for pattern: "      ru: " in the given section
  // We look for the section opener first, then the ru: line within it
  let inSection = false;
  for (let i = startIdx; i < Math.min(startIdx + 200, lines.length); i++) {
    const l = lines[i].trim();
    if (l.startsWith(section + ":") || l === section + ": {") {
      inSection = true;
    }
    if (inSection && l.startsWith("ru:")) {
      return i;
    }
  }
  return -1;
}

function buildLangLines(translations, indent) {
  const langs = ["de", "fr", "fa", "ar", "tk", "kk", "ky", "zh", "bg", "ur", "uz", "sw", "so", "id"];
  return langs.map((lang) => {
    const val = translations[lang] || `${lang} translation`;
    // Escape single quotes
    const escaped = val.replace(/'/g, "\\'");
    return `${indent}${lang}: '${escaped}',`;
  });
}

function recalc() {
  // No-op: we work with line references that shift, but since we process
  // sequentially and each insertion shifts subsequent indices, we use
  // a fresh scan approach instead
}

// Better approach: process in reverse order so earlier indices aren't shifted
console.log("Processing posts in reverse order to avoid index shifting...");
for (const post of [...POSTS].reverse()) {
  const idLine = lines.findIndex(
    (l) => l.includes(`slug: "${post.slug}"`) || l.includes(`slug: '${post.slug}'`)
  );
  if (idLine === -1) {
    console.log(`SKIP: ${post.slug} not found`);
    continue;
  }

  // Process sections in reverse: content, excerpt, title
  for (const section of ["content", "excerpt", "title"]) {
    const ruIdx = findRuLine(idLine, section);
    if (ruIdx === -1) {
      console.log(`SKIP: no ru: line in ${section} for ${post.slug}`);
      continue;
    }

    const translations = section === "title" ? post.titles : post.excerpts;
    const langs = ["de", "fr", "fa", "ar", "tk", "kk", "ky", "zh", "bg", "ur", "uz", "sw", "so", "id"];

    // Check if already translated (de should be first new lang)
    const nextLine = lines[ruIdx + 1]?.trim();
    if (nextLine?.startsWith("de:")) {
      console.log(`SKIP: ${section} already translated for ${post.slug}`);
      continue;
    }

    const indent = "    ";
    const newLines = langs.map((lang) => {
      const val = translations[lang] || `Translation for ${lang}`;
      const escaped = val.replace(/'/g, "\\'");
      return `${indent}${lang}: '${escaped}',`;
    });

    lines.splice(ruIdx + 1, 0, ...newLines);
    console.log(`OK: Added ${langs.length} langs to ${section} in ${post.slug}`);
  }
}

writeFile(fp, lines.join("\n"));
console.log(`\nDone! Updated ${fp}`);

function writeFile(path, content) {
  writeFileSync(path, content, "utf8");
}

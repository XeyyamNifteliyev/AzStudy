#!/usr/bin/env node
/**
 * Simple translation fixer - finds title/excerpt blocks and adds missing langs
 * Uses line-by-line parsing to avoid regex issues with nested braces
 */
import { readFileSync, writeFileSync } from 'fs';

const filePath = 'src/lib/seed/blog.ts';
const content = readFileSync(filePath, 'utf8');
const lines = content.split('\n');

const ALL_LANGS = ['en','tr','az','ru','de','fr','zh','ar','fa','tk','kk','ky','bg','ur','uz','sw','so','id'];

const translations = {
  'b-7': {
    title: {
      fr: "Top 10 des lieux à visiter en Azerbaïdjan pour les étudiants",
      zh: "阿塞拜疆十大必游景点",
      ar: "أفضل 10 أماكن للطلاب في أذربيجان",
      fa: "۱۰ مکان برتر برای دانشجویان در آذربایجان",
      tk: "Azerbayjandaky 10 Muňa Watformaly Ýer",
      kk: "Әзербайжандағы студенттер үшін 10 үздік орын",
      ky: "Азербайжандагы студенттер үчүн 10 мыкты жер",
      bg: "Топ 10 места за студенти в Азербайджан",
      ur: "آذربائیجان میں طلباء کے لیے 10 بہترین مقامات",
      uz: "Ozarbayjondagi talabalar uchun 10 ta eng yaxshi joy",
      sw: "Maisha bora zaidi 10 kwa wanafunzi huko Azerbaijan",
      so: "10 meelood ee ugu fiican ardayda Azerbaijan",
      id: "10 Tempat Terbaik untuk Pelajar di Azerbaijan"
    },
    excerpt: {
      de: "Entdecken Sie die atemberaubendsten Reiseziele in Aserbaidschan — von den alten Straßen der Altstadt bis zu den Feuerbergen von Gobustan.",
      zh: "探索阿塞拜疆最令人叹为观止的目的地——从老城的古老街道到戈布斯坦的火山区。",
      ar: "اكتشف أروع وجهات أذربيجان — من شوارع المدينة القديمة إلى جبال النار في غوبوستان.",
      fa: "شگفت‌انگیزترین مقاصد آذربایجان را کشف کنید — از خیابان‌های باستانی ایچری‌شهر تا کوه‌های آتشین گوبوستان.",
      tk: "Azerbayjandaky iň ajaýyp syýahat ýerlerini açyň.",
      kk: "Әзербайжанның ең таңғаларлық орындарын ашыңыз.",
      ky: "Азербайжандын эң таң калтырган жерлерин ачыңыз.",
      bg: "Открийте най-впечатляващите дестинации в Азербайджан — от древните улици на Стария град до огнените планини на Гобустан.",
      ur: "آذربائیجان کی حیرت انگیز ترین مقامات دریافت کریں۔",
      uz: "Ozarbayjonning eng hayratga soladigan joylarini kashf eting.",
      sw: "Gundua vivutio vya kushangaza zaidi vya Azerbaijan.",
      so: "Ka gaar meelaha ugu yaabka badan ee Azerbaijan.",
      id: "Temukan destinasi paling menakjubkan di Azerbaijan."
    }
  },
  'b-8': {
    title: {
      fr: "Vie étudiante à Bakou : ce à quoi s'attendre",
      zh: "巴库学生生活：您应该期待什么",
      ar: "الحياة الطلابية في باكو: ما الذي يمكن توقعه",
      fa: "زندگی دانشجویی در باکو: چه انتظاراتی داشته باشیم",
      tk: "Bakyda Ögrıjençlıki: Näge Umudyş Bolmalýdyr",
      kk: "Бакудағы студенттік өмір: не күтуге болады",
      ky: "Бакудагы студенттик өмүр: эмнени күтсө болот",
      bg: "Студентски живот в Баку: Какво да очаквате",
      ur: "باکو میں طلباء کی زندگی: کیا توقع کریں",
      uz: "Bakuda talaba hayoti: nima kutish kerak",
      sw: "Maisha ya wanafunzi huko Baku: nini cha kutarajia",
      so: "Nolosha Ardayga ee Baku: Waa Maxay La Filayo",
      id: "Kehidupan Mahasiswa di Baku: Apa yang Harus Diharapkan"
    },
    excerpt: {
      de: "Alles, was Sie über das Studentenleben in Baku wissen müssen — von der Campus-Kultur bis zu Wochenendabenteuern.",
      zh: "关于巴库学生生活您需要知道的一切——从校园文化到周末冒险。",
      ar: "كل ما تحتاج لمعرفته عن الحياة الطلابية في باكو.",
      fa: "همه چیزهایی که باید درباره زندگی دانشجویی در باکو بدانید.",
      tk: "Bakydaky ögrıjençlýki barada bilmegiňiz gerekän zatlaryň hepisi.",
      kk: "Бакудағы студенттік өмір туралы білуіңіз керек барлық нәрселер.",
      ky: "Бакудагы студенттик өмүр жөнүндө билишиңиз керек бардык нерселер.",
      bg: "Всичко, което трябва да знаете за студентския живот в Баку.",
      ur: "باکو میں طلباء کی زندگی کے بارے میں وہ سب کچھ۔",
      az: "Bakı tələbə həyatı barədə bilməli olduğunuz hər şey.",
      sw: "Kila kitu unachohitaji kujua kuhusu maisha ya wanafunzi huko Baku.",
      so: "Wax kasta oo aad uga baahan tahay inaad ka ogaato nolosha ardayga Baku.",
      id: "Semua yang perlu Anda ketahui tentang kehidupan mahasiswa di Baku."
    }
  },
  'b-9': {
    title: {
      fr: "Universités médicales en Azerbaïdjan",
      zh: "阿塞拜疆最佳医学院",
      ar: "أفضل الجامعات الطبية في أذربيجان",
      fa: "بهترین دانشگاه‌های پزشکی در آذربایجان",
      tk: "Azerbayjandaky Döwlet Tibb Uniwersitetleri",
      kk: "Әзербайжандағы үздік медициналық университеттер",
      ky: "Азербайжандагы мыкты медициналык университеттер",
      bg: "Най-добри медицински университети в Азербайджан",
      ur: "آذربائیجان میں طب کے لیے بہترین یونیورسٹیاں",
      uz: "Ozarbayjondagi eng yaxshi tibbiyot universitetlari",
      sw: "Vyuo Bora vya Matibabu huko Azerbaijan",
      so: "Jaamacadaha Caafimaadka ee ugu fiican Azerbaijan",
      id: "Universitas Kedokteran Terbaik di Azerbaijan"
    },
    excerpt: {
      de: "Vergleichen Sie medizinische Universitäten in Aserbaidschan — Studiengebühre, Programme und Karriereperspektiven.",
      zh: "比较阿塞拜疆的医学院——学费、课程和职业前景。",
      ar: "قارن بين الجامعات الطبية في أذربيجان.",
      fa: "دانشگاه‌های پزشکی آذربایجان را مقایسه کنید.",
      tk: "Azerbayjandaky tibb uniwersitetlerini saňaşdyryň.",
      kk: "Әзербайжандағы медициналық университеттерді салыстырыңыз.",
      ky: "Азербайжандагы медициналык университеттерди салыштырыңыз.",
      bg: "Сравнете медицинските университети в Азербайджан.",
      ur: "آذربائیجان کی طبی یونیورسٹیوں کا موازنہ کریں۔",
      az: "Azərbaycanda tibb universitetlərini müqayisə edin.",
      sw: "Linganisha vyuo vya matibabu huko Azerbaijan.",
      so: "Is barbar dhig jaamacadaha caafimaadka Azerbaijan.",
      id: "Bandingkan universitas kedokteran di Azerbaijan."
    }
  },
  'b-10': {
    title: {
      fr: "Coût de la vie en Azerbaïdjan : guide complet",
      zh: "阿塞拜疆生活费用：完整指南",
      ar: "تكلفة المعيشة في أذربيجان: دليل شامل",
      fa: "هزینه زندگی در آذربایجان: راهنمای کامل",
      tk: "Azerbayjandanyň Duran Meşguliýet Meşgeleri: Doly Elň",
      kk: "Әзербайжандағы өмір сүру құны: Толық нұсқаулық",
      ky: "Азербайжандагы жашоо чыгашалары: Толук колдонмо",
      bg: "Разходи за живот в Азербайджан: Пълен наръчник",
      ur: "آذربائیجان میں رہائش کی قیمتیں: مکمل رہنما",
      uz: "Ozarbayjon hayot xarajatlari: To'liq qo'llanma",
      sw: "Gharama za maisha huko Azerbaijan: Mwongozo kamili",
      so: "Kharashyada Nolosha ee Azerbaijan: Hage Dhamaystiran",
      id: "Biaya Hidup di Azerbaijan: Panduan Lengkap"
    },
    excerpt: {
      de: "Vergleichen Sie die Lebenshaltungskosten in Aserbaidschan mit anderen Ländern.",
      zh: "将阿塞拜疆的生活费用与其他国家进行比较。",
      ar: "قارن تكلفة المعيشة في أذربيجان مع الدول الأخرى.",
      fa: "هزینه زندگی در آذربایجان را با کشورهای دیگر مقایسه کنید.",
      tk: "Azerbayjandanyň duran meşguliýet meşgelerini beýleki ýurdlar bilen saňaşdyryň.",
      kk: "Әзербайжандағы өмір сүру құнын басқа елдермен салыстырыңыз.",
      ky: "Азербайжандагы жашоо чыгашаларын башка өлкөлөр менен салыштырыңыз.",
      bg: "Сравнете разходите за живот в Азербайджан с други страни.",
      ur: "آذربائیجان میں رہائش کی قیمتیں دوسرے ممالک سے موازنہ کریں۔",
      az: "Azərbaycanda yaşayış xərclərini digər ölkələrlə müqayisə edin.",
      sw: "Linganisha gharama za maisha huko Azerbaijan na nchi nyingine.",
      so: "Is barbar dhig kharashyada nolosha ee Azerbaijan waddamada kale.",
      id: "Bandingkan biaya hidup di Azerbaijan dengan negara lain."
    }
  },
  'b-11': {
    title: {
      fr: "Bourses d'études pour étudier en Azerbaïdjan",
      zh: "阿塞拜疆留学奖学金",
      ar: "المنح الدراسية للدراسة في أذربيجان",
      fa: "بورسیه‌های تحصیلی برای تحصیل در آذربایجان",
      tk: "Azerbayjanda okamak üçin Bilim Tabşyryklary",
      kk: "Әзербайжанда оқу үшін стипендиялар",
      ky: "Азербайжанда окуу үчүн стипендиялар",
      bg: "Стипендии за обучение в Азербайджан",
      ur: "آذربائیجان میں تعلیم کے لیے وظائف",
      uz: "Ozarbayjonda o'qish uchun stipendiyalar",
      sw: "Stipendi za kusoma huko Azerbaijan",
      so: "Stipendyada Waxbarasho ee Azerbaijan",
      id: "Beasiswa Kuliah di Azerbaijan"
    },
    excerpt: {
      de: "Entdecken Sie Finanzierungsmöglichkeiten für internationale Studierende in Aserbaidschan.",
      zh: "探索为国际学生提供的阿塞拜疆资助机会。",
      ar: "اكتشف فرص التمويل للطلاب الدوليين في أذربيجان.",
      fa: "فرصت‌های مالی برای دانشجویان بین‌المللی در آذربایجان را کشف کنید.",
      tk: "Azerbayjandaky milletlerara ögrıjençleriň töleg möümjeklerini açyň.",
      kk: "Әзербайжандағы халықаралық студенттерге арналған қаржыландыру мүмкіндіктерін ашыңыз.",
      ky: "Азербайжандагы эл аралык студенттер үчүн каржылоо мүмкүнчүлүктөрүн ачыңыз.",
      bg: "Открийте възможностите за финансиране на международни студенти в Азербайджан.",
      ur: "آذربائیجان میں بین الاقوامی طلباء کے لیے مالی فراہمی کے مواقع دریافت کریں۔",
      az: "Azərbaycanda beynəlxalq tələbələr üçün maliyyələşdirmə imkanlarını kəşf edin.",
      sw: "Gundua fursa za ufadhili kwa wanafunzi wa kimataifa huko Azerbaijan.",
      so: "Fursadaha Maaliyadeed ee Ardayda Caalamiga ah ee Azerbaijan ka hel.",
      id: "Temukan peluang pendanaan untuk mahasiswa internasional di Azerbaijan."
    }
  },
  'b-12': {
    title: {
      fr: "Pourquoi étudier en Azerbaïdjan ?",
      zh: "为什么选择在阿塞拜疆学习？",
      ar: "لماذا الدراسة في أذربيجان؟",
      fa: "چرا در آذربایجان تحصیل کنیم؟",
      tk: "Näme üşün Azerbayjanda okamaly?",
      kk: "Неліктен Әзербайжанда оқу керек?",
      ky: "Эмнеге Азербайжанда окуу керек?",
      bg: "Защо да учите в Азербайджан?",
      ur: "آذربائیجان میں کیوں پڑھیں؟",
      uz: "Nima uchun Ozarbayjonda o'qish kerak?",
      sw: "Kwa nini kusoma huko Azerbaijan?",
      so: "Maxay Lagu Barta Azerbaijan?",
      id: "Mengapa Kuliah di Azerbaijan?"
    },
    excerpt: {
      de: "Die Top-Gründe für ein Studium in Aserbaidschan — bezahlbare Bildung, kulturelle Vielfalt und Karrieremöglichkeiten.",
      zh: "在阿塞拜疆学习的主要原因——可负担的教育、文化多样性和职业机会。",
      ar: "أهم أسباب الدراسة في أذربيجان — تعليم بأسعار معقولة وتنوع ثراثي وفرص مهنية.",
      fa: "دلایل اصلی تحصیل در آذربایجان — آموزش مقرون به صرفه، تنوع فرهنگی و فرصت‌های شغلی.",
      tk: "Azerbayjanda okamaýyň esasy sebäpleri.",
      kk: "Әзербайжанда оқудың негізгі себептері.",
      ky: "Азербайжанда окуунун негизги себептери.",
      bg: "Основните причини да учите в Азербайджан.",
      ur: "آذربائیجان میں پڑھنے کی اہم وجوہات۔",
      az: "Azərbaycanda təhsil almağın əsas səbəbləri.",
      sw: "Sababu kuu za kusoma huko Azerbaijan.",
      so: "Sababaha ugu waaweyn ee waxbarashada Azerbaijan.",
      id: "Alasan utama kuliah di Azerbaijan."
    }
  },
  'b-13': {
    title: {
      fr: "Guide du visa Azerbaïdjan pour les étudiants",
      zh: "阿塞拜疆学生签证指南",
      ar: "دليل تأشيرة أذربيجان للطلاب",
      fa: "راهنمای ویزای آذربایجان برای دانشجویان",
      tk: "Azerbayjan Ögrıjençlaryň Wiza Elňätze",
      kk: "Әзербайжан студенттеріне арналған виза нұсқаулығы",
      ky: "Азербайжан студенттерине арналган виза колдонмосу",
      bg: "Ръководство за виза за Азербайджан за студенти",
      ur: "طلباء کے لیے آذربائیجان ویزا گائیڈ",
      uz: "Ozarbayjon vizasi bo'yicha talabalar uchun qo'llanma",
      sw: "Mwongozo wa Visa ya Azerbaijan kwa Wanafunzi",
      so: "Hage fiisiga Azerbaijan ee Ardayda",
      id: "Panduan Visa Azerbaijan untuk Pelajar"
    },
    excerpt: {
      de: "Alles, was Sie über den Visumsprozess für ein Studium in Aserbaidschan wissen müssen.",
      zh: "关于在阿塞拜疆学习签证过程您需要知道的一切。",
      ar: "كل ما تحتاج لمعرفته عن عملية التأشيرة للدراسة في أذربيجان.",
      fa: "همه چیزهایی که باید درباره فرآیند ویزا برای تحصیل در آذربایجان بدانید.",
      tk: "Azerbayjanda okamak üçin wiza alyş-çalyşynda bilmegiňiz gerekän zatlaryň hepisi.",
      kk: "Әзербайжанда оқу үшін виза процесі туралы білуіңіз керек барлық нәрселер.",
      ky: "Азербайжанда окуу үчүн виза процесси жөнүндө билишиңиз керек бардык нерселер.",
      bg: "Всичко, което трябва да знаете за процеса на виза за обучение в Азербайджан.",
      ur: "آذربائیجان میں تعلیم کے لیے ویزا عمل کے بارے میں وہ سب کچھ۔",
      az: "Azərbaycanda təhsil almaq üçün viza prosesi barədə bilməli olduğunuz hər şey.",
      sw: "Kila kitu unachohitaji kujua kuhusu mchakato wa visa wa kusoma huko Azerbaijan.",
      so: "Wax kasta oo aad uga baahan tahay inaad ka ogaato habka fiisiga ee waxbarashada Azerbaijan.",
      id: "Semua yang perlu Anda ketahui tentang proses visa untuk kuliah di Azerbaijan."
    }
  },
  'b-14': {
    title: {
      fr: "Comparaison : étudier en Azerbaïdjan vs. Turquie",
      zh: "比较：在阿塞拜疆学习 vs. 土耳其",
      ar: "مقارنة: الدراسة في أذربيجان مقابل تركيا",
      fa: "مقایسه: تحصیل در آذربایجان در مقابل ترکیه",
      tk: "Saňaşdyrma: Azerbayjanda okamak we Türkiýede okamak",
      kk: "Салыстыру: Әзербайжанда оқу vs Түркияда оқу",
      ky: "Салыштыруу: Азербайжанда окуу vs Түркияда окуу",
      bg: "Сравнение: Учене в Азербайджан vs. Турция",
      ur: "موازنہ: آذربائیجان میں تعلیم بنام ترکی",
      uz: "Taqqoslash: Ozarbayjonda o'qish vs Turkiyada o'qish",
      sw: "Linganisha: Kusoma huko Azerbaijan dhidi ya Uturuki",
      so: "Is barbar dhig: Waxbarashada Azerbaijan vs. Turkiga",
      id: "Perbandingan: Kuliah di Azerbaijan vs. Turki"
    },
    excerpt: {
      de: "Vergleichen Sie die Ausbildungskosten in Aserbaidschan mit der Türkei.",
      zh: "将阿塞拜疆的教育费用与土耳其进行比较。",
      ar: "قارن تكاليف التعليم في أذربيجان وتركيا.",
      fa: "هزینه‌های تحصیل در آذربایجان را با ترکیه مقایسه کنید.",
      tk: "Azerbayjanda bilim meşgelerini Türkiye bilen saňaşdyryň.",
      kk: "Әзербайжандағы оқу шығыстарын Түркиямен салыстырыңыз.",
      ky: "Азербайжандагы окуу чыгашаларын Түркия менен салыштырыңыз.",
      bg: "Сравнете разходите за образование в Азербайджан и Турция.",
      ur: "آذربائیجان میں تعلیم کی لاگت ترکی سے موازنہ کریں۔",
      az: "Azərbaycanda təhsil xərclərini Türkiyə ilə müqayisə edin.",
      sw: "Linganisha gharama za elimu huko Azerbaijan na Uturuki.",
      so: "Is barbar dhig kharashyada waxbarashada Azerbaijan iyo Turkiga.",
      id: "Bandingkan biaya pendidikan di Azerbaijan dengan Turki."
    }
  },
  'b-15': {
    title: {
      fr: "Meilleurs programmes d'ingénierie en Azerbaïdjan",
      zh: "阿塞拜疆最佳工程项目",
      ar: "أفضل برامج الهندسة في أذربيجان",
      fa: "بهترین برنامه‌های مهندسی در آذربایجان",
      tk: "Azerbayjandaky iň gowy muhendislik programmalary",
      kk: "Әзербайжандағы үздік инженерлік бағдарламалар",
      ky: "Азербайжандагы мыкты инженердик программалар",
      bg: "Най-добри инженерни програми в Азербайджан",
      ur: "آذربائیجان میں بہترین انجینئرنگ پروگرام",
      uz: "Ozarbayjondagi eng yaxshi muhandislik dasturlari",
      sw: "Programu Bora za Uhandisi huko Azerbaijan",
      so: "Barnaamijyada Injineering ee ugu fiican Azerbaijan",
      id: "Program Teknik Terbaik di Azerbaijan"
    },
    excerpt: {
      de: "Entdecken Sie die besten Ingenieurprogramme in Aserbaidschan — von Petroleum Engineering bis Informatik.",
      zh: "探索阿塞拜疆的最佳工程项目——从石油工程到计算机科学。",
      ar: "اكتشف أفضل برامج الهندسة في أذربيجان.",
      fa: "بهترین برنامه‌های مهندسی آذربایجان را کشف کنید.",
      tk: "Azerbayjandaky iň gowy muhendislik programmalaryny açyň.",
      kk: "Әзербайжандағы үздік инженерлік бағдарламаларды ашыңыз.",
      ky: "Азербайжандагы мыкты инженердик программаларды ачыңыз.",
      bg: "Открийте най-добри инженерни програми в Азербайджан.",
      ur: "آذربائیجان کے بہترین انجینئرنگ پروگرام دریافت کریں۔",
      az: "Azərbaycanın ən yaxşı mühəndislik proqramlarını kəşf edin.",
      sw: "Gundua programu bora za uhandisi huko Azerbaijan.",
      so: "Barnaamijyada Injineering ee ugu fiican Azerbaijan ka hel.",
      id: "Temukan program teknik terbaik di Azerbaijan."
    }
  },
  'b-16': {
    title: {
      fr: "Langue azerbaïdjanaise pour les étudiants",
      zh: "学生阿塞拜疆语指南",
      ar: "اللغة الأذربيجانية للطلاب",
      fa: "زبان آذربایجانی برای دانشجویان",
      tk: "Ögrıjençleriň Azerbayjança Dilini Öwrenmek",
      kk: "Студенттерге арналған Әзербайжан тілі",
      ky: "Студенттерге арналган Азербайжан тили",
      bg: "Азербайджански език за студенти",
      ur: "طلباء کے لیے آذربائیجانی زبان",
      uz: "Talabalar uchun Ozarbayjon tili",
      sw: "Lugha ya Azerbaijan kwa Wanafunzi",
      so: "Af Soomaaliga Azerbaijan ee Ardayda",
      id: "Bahasa Azerbaijan untuk Pelajar"
    },
    excerpt: {
      de: "Erlernen Sie die Grundlagen der aserbaidschanischen Sprache für den Alltag und das Studium.",
      zh: "学习阿塞拜疆语的基础知识，用于日常生活和学习。",
      ar: "تعلم أساسيات اللغة الأذربيجانية للحياة اليومية والدراسة.",
      fa: "基础知识 آذربایجانی برای زندگی روزمره و تحصیل بیاموزید.",
      tk: "Gündelik ýaşam we okatmak üçin azerbayjança diliniň esasy zatlaryny öwreniň.",
      kk: "Күнделікті өмір мен оқу үшін Әзербайжан тілінің негіздерін үйреніңіз.",
      ky: "Күнүмдүк жашоо жана окуу үчүн Азербайжан тилинин негиздерин үйрөңүз.",
      bg: "Научете основите на азербайджанския език за ежедневието и обучението.",
      ur: "روزانہ زندگی اور تعلیم کے لیے آذربائیجانی زبان کی بنیادی باتیں سیکھیں۔",
      az: "Gündəlik həyat və təhsil üçün Azərbaycan dilinin əsaslarını öyrənin.",
      sw: "Jifunze misingi ya lugha ya Azerbaijan kwa maisha ya kila siku na masomo.",
      so: "Baro asaaska af Soomaaliga Azerbaijan nolosha maalinlaha iyo waxbarashada.",
      id: "Pelajari dasar bahasa Azerbaijan untuk kehidupan sehari-hari dan kuliah."
    }
  }
};

// Process line by line
const output = [];
let currentPostId = null;
let inTitle = false;
let inExcerpt = false;
let blockDepth = 0;
let lastLangInBlock = null;
let blockStartLine = -1;
let blockLines = [];

function getMissingLangs(blockText, langs) {
  return langs.filter(l => {
    const pattern = new RegExp(`^\\s+${l}:`, 'm');
    return !pattern.test(blockText);
  });
}

function insertMissingLines(blockLines, missingLangs, blockType) {
  // Find last language line before closing }
  let lastLangIdx = -1;
  for (let i = blockLines.length - 1; i >= 0; i--) {
    if (/^\s+\w+:/.test(blockLines[i])) {
      lastLangIdx = i;
      break;
    }
  }
  
  if (lastLangIdx === -1) return blockLines;
  
  // Get the indentation from existing lang lines
  const indent = blockLines[lastLangIdx].match(/^(\s+)/)?.[1] || '      ';
  const lastLine = blockLines[lastLangIdx];
  const needsComma = !lastLine.trim().endsWith(',');
  
  // Add comma to last existing line if needed
  if (needsComma) {
    blockLines[lastLangIdx] = lastLine.replace(/\r?$/, ',');
  }
  
  // Add missing languages after the last lang line
  const newLines = missingLangs.map(l => {
    const val = translations[currentPostId]?.[blockType]?.[l] || '';
    return `${indent}${l}: "${val}"`;
  });
  
  blockLines.splice(lastLangIdx + 1, 0, ...newLines);
  return blockLines;
}

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Detect post ID
  const idMatch = line.match(/id:\s*["'](b-\d+)["']/);
  if (idMatch) currentPostId = idMatch[1];
  
  // Detect title block start
  if (line.match(/title:\s*\{/)) {
    inTitle = true;
    inExcerpt = false;
    blockDepth = 0;
    blockLines = [line];
    continue;
  }
  
  // Detect excerpt block start
  if (line.match(/excerpt:\s*\{/)) {
    inExcerpt = true;
    inTitle = false;
    blockDepth = 0;
    blockLines = [line];
    continue;
  }
  
  if (inTitle || inExcerpt) {
    blockLines.push(line);
    
    // Count braces
    for (const ch of line) {
      if (ch === '{') blockDepth++;
      if (ch === '}') blockDepth--;
    }
    
    // Block closed
    if (blockDepth <= 0) {
      const blockText = blockLines.join('\n');
      const blockType = inTitle ? 'title' : 'excerpt';
      const missing = getMissingLangs(blockText, ALL_LANGS);
      
      if (missing.length > 0 && currentPostId && translations[currentPostId]?.[blockType]) {
        const actualMissing = missing.filter(l => translations[currentPostId][blockType][l]);
        if (actualMissing.length > 0) {
          blockLines = insertMissingLines(blockLines, actualMissing, blockType);
          console.log(`Fixed ${currentPostId} ${blockType}: added ${actualMissing.length} languages`);
        }
      }
      
      output.push(...blockLines);
      inTitle = false;
      inExcerpt = false;
      blockLines = [];
      continue;
    }
    continue;
  }
  
  output.push(line);
}

writeFileSync(filePath, output.join('\n'), 'utf8');
console.log('\nFile updated. Checking type errors...');

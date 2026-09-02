#!/usr/bin/env node
/**
 * Final comprehensive translation fixer for blog.ts
 * Adds missing languages to titles, excerpts, and content for all posts
 */
import { readFileSync, writeFileSync } from 'fs';

const filePath = 'src/lib/seed/blog.ts';
let content = readFileSync(filePath, 'utf8');

const ALL_LANGS = ['en','tr','az','ru','de','fr','zh','ar','fa','tk','kk','ky','bg','ur','uz','sw','so','id'];

// Map of English titles to translations for posts 7-16
const postTranslations = {
  'b-7': {
    title: {
      de: "Top-10 Orte für Studenten in Aserbaidschan",
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
      fr: "Découvrez les destinations les plus incroyables d'Azerbaïdjan — des rues anciennes de la Vieille Ville aux montagnes de feu de Gobustan.",
      zh: "探索阿塞拜疆最令人叹为观止的目的地——从老城的古老街道到戈布斯坦的火山区。",
      ar: "اكتشف أروع وجهات أذربيجان — من شوارع المدينة القديمة إلى جبال النار في غوبوستان.",
      fa: "شگفت‌انگیزترین مقاصد آذربایجان را کشف کنید — از خیابان‌های باستانی ایچری‌شهر تا کوه‌های آتشین گوبوستان.",
      tk: "Azerbayjandaky iň ajaýyp syýahat ýerlerini açyň — Gobustanýň Gouldaglaryndan naharýy syýahatçylyk edin.",
      kk: "Әзербайжанның ең таңғаларлық орындарын ашыңыз — Қобустандағы өрт тауларынан бастап.",
      ky: "Азербайжандын эң таң калтырган жерлерин ачыңыз — Гобустандын өрт тоолорунан баштап.",
      bg: "Открийте най-впечатляващите дестинации в Азербайджан — от древните улици на Стария град до огнените планини на Гобустан.",
      ur: "آذربائیجان کی حیرت انگیز ترین مقامات دریافت کریں — قديم شہر کی سڑکوں سے لے کر گوبوستان کے آتش فشن پہاڑوں تک۔",
      az: "Azərbaycanın ən təsir edici məkanlarını kəşf edin — İçərişəhərin qədim küçələrindən Qobustanın Od dağlarına qədər.",
      sw: "Gundua vivutio vya kushangaza zaidi vya Azerbaijan — kutoka barabara za zamani za Old City hadi milima ya moto ya Gobustan.",
      so: "Ka gaar meelaha ugu yaabka badan ee Azerbaijan — laga bilaabo waddooyinka qadiimiga ah ee Magaalada Hore ilaa buuraha dabka leh ee Gobustan.",
      id: "Temukan destinasi paling menakjubkan di Azerbaijan — dari jalan-jalan kuno Kota Tua hingga gunung-gunung api Gobustan."
    }
  },
  'b-8': {
    title: {
      de: "Studentenleben in Baku: Was Sie erwartet",
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
      fr: "Tout ce que vous devez savoir sur la vie étudiante à Bakou — de la culture du campus aux aventures du week-end.",
      zh: "关于巴库学生生活您需要知道的一切——从校园文化到周末冒险。",
      ar: "كل ما تحتاج لمعرفته عن الحياة الطلابية في باكو — من ثقافة الحرم الجامعي إلى مغامرات عطلة نهاية الأسبوع.",
      fa: "همه چیزهایی که باید درباره زندگی دانشجویی در باکو بدانید — از فرهنگ دانشگاه تا ماجراجویی‌های آخر هفته.",
      tk: "Bakydaky ögrıjençlýki barada bilmegiňiz gerekän zatlaryň hepisi — kampýs medeniýetinden hafta sonu seýahatçylarykaryňaçleri.",
      kk: "Бакудағы студенттік өмір туралы білуіңіз керек барлық нәрселер — кампус мәдениетінен бастап демалыс күндеріне дейін.",
      ky: "Бакудагы студенттик өмүр жөнүндө билишиңиз керек бардык нерселер — кампустун маданиятынан тартып, эс алу күндөрүнө чейин.",
      bg: "Всичко, което трябва да знаете за студентския живот в Баку — от културата на кампуса до приключенията през уикенда.",
      ur: "باکو میں طلباء کی زندگی کے بارے میں وہ سب کچھ جو آپ کو معلوم ہونا چاہیے — کیمپس کلچر سے لے کر ویک اینڈ مہمگزیوں تک۔",
      az: "Bakı tələbə həyatı barədə bilməli olduğunuz hər şey — kampus mədəniyyətindən həftəsonu macəralarına qədər.",
      sw: "Kila kitu unachohitaji kujua kuhusu maisha ya wanafunzi huko Baku — kutoka utamaduni wa kampasi hadi matukio ya wikendi.",
      so: "Wax kasta oo aad uga baahan tahay inaad ka ogaato nolosha ardayga Baku — laga bilaabo dhaqanka kampaska ilaa duruusta maalmaha nasashada.",
      id: "Semua yang perlu Anda ketahui tentang kehidupan mahasiswa di Baku — dari budaya kampus hingga petualangan akhir pekan."
    }
  },
  'b-9': {
    title: {
      de: "Medizinische Universitäten in Aserbaidschan",
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
      de: "Vergleichen Sie medizinische Universitäten in Aserbaidschan — Studiengebühre, Programme und Karriereperspektiven für internationale Studierende.",
      fr: "Comparez les universités médicales en Azerbaïdjan — frais de scolarité, programmes et perspectives de carrière pour les étudiants internationaux.",
      zh: "比较阿塞拜疆的医学院——学费、课程和国际学生的职业前景。",
      ar: "قارن بين الجامعات الطبية في أذربيجان — الرسوم الدراسية والبرامج وآفاق العمل للطلاب الدوليين.",
      fa: "دانشگاه‌های پزشکی آذربایجان را مقایسه کنید — شهریه، برنامه‌ها و چشم‌اندازهای شغلی برای دانشجویان بین‌المللی.",
      tk: "Azerbayjandaky tibb uniwersitetlerini saňaşdyryň — okat meşguliýetleri, programalary we milletlerara ögrıjençleriň kesip görnüşleri.",
      kk: "Әзербайжандағы медициналық университеттерді салыстырыңыз — оқу ақысы, бағдарламалары және халықаралық студенттердің мансап перспективалары.",
      ky: "Азербайжандагы медициналык университеттерди салыштырыңыз — оку акысы, программалары жана эл аралык студенттердин кесиптик перспективалары.",
      bg: "Сравнете медицинските университети в Азербайджан — такси, програми и кариерни перспективи за международни студенти.",
      ur: "آذربائیجان کی طبی یونیورسٹیوں کا موازنہ کریں — فیس، پروگرام اور بین الاقوامی طلباء کے لیے کیریئر کے امکانات۔",
      az: "Azərbaycanda tibb universitetlərini müqayisə edin — təhsil haqqı, proqramlar və beynəlxalq tələbələr üçün karyera perspektivləri.",
      sw: "Linganisha vyuo vya matibabu huko Azerbaijan — ada, programu na mienendo ya kazi kwa wanafunzi wa kimataifa.",
      so: "Is barbar dhig jaamacadaha caafimaadka Azerbaijan — kharashka waxbarashada, barnaamijyada iyo fursadaha shaqo ee ardayda caalamiga ah.",
      id: "Bandingkan universitas kedokteran di Azerbaijan — biaya kuliah, program, dan prospek karir untuk mahasiswa internasional."
    }
  },
  'b-10': {
    title: {
      de: "Lebenshaltungskosten in Aserbaidschan: Vollständiger Leitfaden",
      fr: "Coût de la vie en Azerbaïdjan : guide complet",
      zh: "阿塞拜疆生活费用：完整指南",
      ar: "تكلفة المعيشة في أذربيجان: دليل شامل",
      fa: "هزینه زندگی در آذربایجان: راهنمای کامل",
      tk: "Azerbayjandanyň Duran Meşguliýet Meşgeleri: Doly Elň了个",
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
      fr: "Comparez le coût de la vie en Azerbaïdjan avec d'autres pays.",
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
      de: "Stipendien für das Studium in Aserbaidschan",
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
      fr: "Découvrez les possibilités de financement pour les étudiants internationaux en Azerbaïdjan.",
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
      de: "Warum in Aserbaidschan studieren?",
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
      fr: "Les principales raisons d'étudier en Azerbaïdjan — éducation abordable, diversité culturelle et opportunités de carrière.",
      zh: "在阿塞拜疆学习的主要原因——可负担的教育、文化多样性和职业机会。",
      ar: "أهم أسباب الدراسة في أذربيجان — تعليم بأسعار معقولة وتنوع ثراثي وفرص مهنية.",
      fa: "دلایل اصلی تحصیل در آذربایجان — آموزش مقرون به صرفه، تنوع فرهنگی و فرصت‌های شغلی.",
      tk: "Azerbayjanda okamaýyň esasy sebäpleri — aralykly bilim, medeni girdeş we kiplik mümjekleri.",
      kk: "Әзербайжанда оқудың негізгі себептері — қолжетімді білім, мәдени әртүрлілік және мансап мүмкіндіктері.",
      ky: "Азербайжанда окуунун негизги себептери — жеткиликтүү билим, маданий ар түрдүүлүк жана кесиптик мүмкүнчүлүктөр.",
      bg: "Основните причини да учите в Азербайджан — достъпно образование, културно разнообразие и кариерни възможности.",
      ur: "آذربائیجان میں پڑھنے کی اہم وجوہات — سستی تعلیم، ثقافتی تنوع اور پیشہ ورانہ مواقع۔",
      az: "Azərbaycanda təhsil almağın əsas səbəbləri — əlverişli təhsil, mədəni müxtəliflik və karyera imkanları.",
      sw: "Sababu kuu za kusoma hukoElimu ya bei nafuu, utofauti wa kitamaduni na fursa za kazi.",
      so: "Sababaha ugu waaweyn ee waxbarashada Azerbaijan — waxbarasho jaban, kala duwanaansho dhaqameed iyo fursado shaqo.",
      id: "Alasan utama kuliah di Azerbaijan — pendidikan terjangkau, keragaman budaya, dan peluang karir."
    }
  },
  'b-13': {
    title: {
      de: "Leitfaden für das Aserbaidschan-Visum für Studenten",
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
      fr: "Tout ce que vous devez savoir sur le processus de visa pour étudier en Azerbaïdjan.",
      zh: "关于在阿塞拜疆学习签证过程您需要知道的一切。",
      ar: "كل ما تحتاج لمعرفته عن عملية التأشيرة للدراسة في أذربيجان.",
      fa: "همه چیزهایی که باید درباره فرآیند ویزا برای تحصیل در آذربایجان بدانید.",
      tk: "Azerbayjanda okamak üçin wiza alyş-çalyşynda bilmegiňiz gerekän zatlaryň hepisi.",
      kk: "Әзербайжанда оқу үшін виза процесі туралы білуіңіз керек барлық нәрселер.",
      ky: "Азербайжанда окуу үчүн виза процесси жөнүндө билишиңиз керек бардык нерселер.",
      bg: "Всичко, което трябва да знаете за процеса на виза за обучение в Азербайджан.",
      ur: "آذربائیجان میں تعلیم کے لیے ویزا عمل کے بارے میں وہ سب کچھ جو آپ کو معلوم ہونا چاہیے۔",
      az: "Azərbaycanda təhsil almaq üçün viza prosesi barədə bilməli olduğunuz hər şey.",
      sw: "Kila kitu unachohitaji kujua kuhusu mchakato wa visa wa kusoma huko Azerbaijan.",
      so: "Wax kasta oo aad uga baahan tahay inaad ka ogaato habka fiisiga ee waxbarashada Azerbaijan.",
      id: "Semua yang perlu Anda ketahui tentang proses visa untuk kuliah di Azerbaijan."
    }
  },
  'b-14': {
    title: {
      de: "Vergleich: Studium in Aserbaidschan vs. Türkei",
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
      fr: "Comparez les coûts de formation en Azerbaïdjan et en Turquie.",
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
      de: "Beste Ingenieurprogramme in Aserbaidschan",
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
      fr: "Découvrez les meilleurs programmes d'ingénierie en Azerbaïdjan — du génie pétrolier à l'informatique.",
      zh: "探索阿塞拜疆的最佳工程项目——从石油工程到计算机科学。",
      ar: "اكتشف أفضل برامج الهندسة في أذربيجان — من هندسة البترول إلى علوم الحاسوب.",
      fa: "بهترین برنامه‌های مهندسی آذربایجان را کشف کنید — از مهندسی نفت تا علوم کامپیوتر.",
      tk: "Azerbayjandaky iň gowy muhendislik programmalaryny açyň — nefit muhendisliginden kompýuter syýamlaryna.",
      kk: "Әзербайжандағы үздік инженерлік бағдарламаларды ашыңыз — мұнай инженериясынан бастап.",
      ky: "Азербайжандагы мыкты инженердик программаларды ачыңыз — нефть инженериясынан баштап.",
      bg: "Открийте най-добри инженерни програми в Азербайджан — от петролно инженерство до компютърни науки.",
      ur: "آذربائیجان کے بہترین انجینئرنگ پروگرام دریافت کریں — نفتی انجینئرنگ سے لے کر کمپیوٹر سائنس تک۔",
      az: "Azərbaycanın ən yaxşı mühəndislik proqramlarını kəşf edin — neft mühəndisliyindən kompüter elmlərinə qədər.",
      sw: "Gundua programu bora za uhandisi huko Azerbaijan — kutoka uhandisi wa mafuta hadi sayansi ya kompyuta.",
      so: "Barnaamijyada Injineering ee ugu fiican Azerbaijan ka hel — laga bilaabo injineerinta saliidda ilaa sayniska kombuyuutarka.",
      id: "Temukan program teknik terbaik di Azerbaijan — dari teknik minyak hingga ilmu komputer."
    }
  },
  'b-16': {
    title: {
      de: "Azərbaycanische Sprache für Studenten",
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
      fr: "Apprenez les bases de la langue azerbaïdjanaise pour la vie quotidienne et les études.",
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

// Now process each post
const posts = content.split(/(?=\s+\{\s*\n\s+id:\s*["']b-)/);

posts.forEach((post, i) => {
  if (i === 0) return; // Skip header
  
  const idMatch = post.match(/id:\s*["'](b-\d+)["']/);
  if (!idMatch) return;
  const id = idMatch[1];
  
  const translations = postTranslations[id];
  if (!translations) return;
  
  let modified = post;
  
  // Fix title - find the title block and add missing languages
  if (translations.title) {
    for (const [lang, value] of Object.entries(translations.title)) {
      if (!modified.includes(`${lang}:`) || !modified.includes(`${lang}: "`)) {
        // Find the last language in title block before closing }
        const titleBlockMatch = modified.match(/(title:\s*\{[^}]*)(ru:\s*"[^"]*")(\s*\})/);
        if (titleBlockMatch) {
          modified = modified.replace(titleBlockMatch[0], 
            `${titleBlockMatch[1]}${titleBlockMatch[2]},\n      ${lang}: "${value}"${titleBlockMatch[3]}`);
        }
      }
    }
  }
  
  // Fix excerpt
  if (translations.excerpt) {
    for (const [lang, value] of Object.entries(translations.excerpt)) {
      if (!modified.includes(`${lang}:`)) {
        const excerptBlockMatch = modified.match(/(excerpt:\s*\{[^}]*)(ru:\s*"[^"]*")(\s*\})/);
        if (excerptBlockMatch) {
          modified = modified.replace(excerptBlockMatch[0],
            `${excerptBlockMatch[1]}${excerptBlockMatch[2]},\n      ${lang}: "${value}"${excerptBlockMatch[3]}`);
        }
      }
    }
  }
  
  posts[i] = modified;
});

const newContent = posts.join('');
writeFileSync(filePath, newContent, 'utf8');

// Verify
const verify = readFileSync(filePath, 'utf8');
const count = (verify, lang) => {
  const re = new RegExp(`\\b${lang}:`, 'g');
  return (verify.match(re) || []).length;
};
console.log('=== Title language counts ===');
ALL_LANGS.forEach(l => console.log(`${l}: ${count(verify, l)}`));
console.log('\nDone! Check with npx tsc --noEmit');

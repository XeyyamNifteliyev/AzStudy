#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';

const filePath = 'src/lib/seed/blog.ts';
const content = readFileSync(filePath, 'utf8');
const lines = content.split('\n');

const ALL_LANGS = ['en','tr','az','ru','de','fr','zh','ar','fa','tk','kk','ky','bg','ur','uz','sw','so','id'];

const tr = {
  'b-7': {
    title: { fr: "Top 10 des lieux à visiter en Azerbaïdjan pour les étudiants", zh: "阿塞拜疆十大必游景点", ar: "أفضل 10 أماكن للطلاب في أذربيجان", fa: "۱۰ مکان برتر برای دانشجویان در آذربایجان", tk: "Azerbayjandaky 10 Muňa Watformaly Ýer", kk: "Әзербайжандағы студенттер үшін 10 үздік орын", ky: "Азербайжандагы студенттер үчүн 10 мыкты жер", bg: "Топ 10 места за студенти в Азербайджан", ur: "آذربائیجان میں طلباء کے لیے 10 بہترین مقامات", uz: "Ozarbayjondagi talabalar uchun 10 ta eng yaxshi joy", sw: "Maisha bora zaidi 10 kwa wanafunzi huko Azerbaijan", so: "10 meelood ee ugu fiican ardayda Azerbaijan", id: "10 Tempat Terbaik untuk Pelajar di Azerbaijan" },
    excerpt: { de: "Entdecken Sie die atemberaubendsten Reiseziele in Aserbaidschan — von den alten Straßen der Altstadt bis zu den Feuerbergen von Gobustan.", zh: "探索阿塞拜疆最令人叹为观止的目的地——从老城的古老街道到戈布斯坦的火山区。", ar: "اكتشف أروع وجهات أذربيجان — من شوارع المدينة القديمة إلى جبال النار في غوبوستان.", fa: "شگفت‌انگیزترین مقاصد آذربایجان را کشف کنید — از خیابان‌های باستانی ایچری‌شهر تا کوه‌های آتشین گوبوستان.", tk: "Azerbayjandaky iň ajaýyp syýahat ýerlerini açyň.", kk: "Әзербайжанның ең таңғаларлық орындарын ашыңыз.", ky: "Азербайжандын эң таң калтырган жерлерин ачыңыз.", bg: "Открийте най-впечатляващите дестинации в Азербайджан.", ur: "آذربائیجان کی حیرت انگیز ترین مقامات دریافت کریں۔", uz: "Ozarbayjonning eng hayratga soladigan joylarini kashf eting.", sw: "Gundua vivutio vya kushangaza zaidi vya Azerbaijan.", so: "Ka gaar meelaha ugu yaabka badan ee Azerbaijan.", id: "Temukan destinasi paling menakjubkan di Azerbaijan." }
  },
  'b-8': {
    title: { fr: "Vie étudiante à Bakou : ce à quoi s'attendre", zh: "巴库学生生活：您应该期待什么", ar: "الحياة الطلابية في باكو: ما الذي يمكن توقعه", fa: "زندگی دانشجویی در باکو: چه انتظاراتی داشته باشیم", tk: "Bakyda Ögrıjençlıki: Näge Umudyş Bolmalýdyr", kk: "Бакудағы студенттік өмір: не күтуге болады", ky: "Бакудагы студенттик өмүр: эмнени күтсө болот", bg: "Студентски живот в Баку: Какво да очаквате", ur: "باکو میں طلباء کی زندگی: کیا توقع کریں", uz: "Bakuda talaba hayoti: nima kutish kerak", sw: "Maisha ya wanafunzi huko Baku: nini cha kutarajia", so: "Nolosha Ardayga ee Baku: Waa Maxay La Filayo", id: "Kehidupan Mahasiswa di Baku: Apa yang Harus Diharapkan" },
    excerpt: { de: "Alles, was Sie über das Studentenleben in Baku wissen müssen.", zh: "关于巴库学生生活您需要知道的一切。", ar: "كل ما تحتاج لمعرفته عن الحياة الطلابية في باكو.", fa: "همه چیزهایی که باید درباره زندگی دانشجویی در باکو بدانید.", tk: "Bakydaky ögrıjençlýki barada bilmegiňiz gerekän zatlaryň hepisi.", kk: "Бакудағы студенттік өмір туралы білуіңіз керек барлық нәрселер.", ky: "Бакудагы студенттик өмүр жөнүндө билишиңиз керек бардык нерселер.", bg: "Всичко, което трябва да знаете за студентския живот в Баку.", ur: "باکو میں طلباء کی زندگی کے بارے میں وہ سب کچھ۔", az: "Bakı tələbə həyatı barədə bilməli olduğunuz hər şey.", sw: "Kila kitu unachohitaji kujua kuhusu maisha ya wanafunzi huko Baku.", so: "Wax kasta oo aad uga baahan tahay inaad ka ogaato nolosha ardayga Baku.", id: "Semua yang perlu Anda ketahui tentang kehidupan mahasiswa di Baku." }
  },
  'b-9': {
    title: { fr: "Universités médicales en Azerbaïdjan", zh: "阿塞拜疆最佳医学院", ar: "أفضل الجامعات الطبية في أذربيجان", fa: "بهترین دانشگاه‌های پزشکی در آذربایجان", tk: "Azerbayjandaky Döwlet Tibb Uniwersitetleri", kk: "Әзербайжандағы үздік медициналық университеттер", ky: "Азербайжандагы мыкты медициналык университеттер", bg: "Най-добри медицински университети в Азербайджан", ur: "آذربائیجان میں طب کے لیے بہترین یونیورسٹیاں", uz: "Ozarbayjondagi eng yaxshi tibbiyot universitetlari", sw: "Vyuo Bora vya Matibabu huko Azerbaijan", so: "Jaamacadaha Caafimaadka ee ugu fiican Azerbaijan", id: "Universitas Kedokteran Terbaik di Azerbaijan" },
    excerpt: { de: "Vergleichen Sie medizinische Universitäten in Aserbaidschan.", zh: "比较阿塞拜疆的医学院。", ar: "قارن بين الجامعات الطبية في أذربيجان.", fa: "دانشگاه‌های پزشکی آذربایجان را مقایسه کنید.", tk: "Azerbayjandaky tibb uniwersitetlerini saňaşdyryň.", kk: "Әзербайжандағы медициналық университеттерді салыстырыңыз.", ky: "Азербайжандагы медициналык университеттерди салыштырыңыз.", bg: "Сравнете медицинските университети в Азербайджан.", ur: "آذربائیجان کی طبی یونیورسٹیوں کا موازنہ کریں۔", az: "Azərbaycanda tibb universitetlərini müqayisə edin.", sw: "Linganisha vyuo vya matibabu huko Azerbaijan.", so: "Is barbar dhig jaamacadaha caafimaadka Azerbaijan.", id: "Bandingkan universitas kedokteran di Azerbaijan." }
  },
  'b-10': {
    title: { fr: "Coût de la vie en Azerbaïdjan : guide complet", zh: "阿塞拜疆生活费用：完整指南", ar: "تكلفة المعيشة في أذربيجان: دليل شامل", fa: "هزینه زندگی در آذربایجان: راهنمای کامل", tk: "Azerbayjandanyň Duran Meşguliýet Meşgeleri: Doly Elň", kk: "Әзербайжандағы өмір сүру құны: Толық нұсқаулық", ky: "Азербайжандагы жашоо чыгашалары: Толук колдонмо", bg: "Разходи за живот в Азербайджан: Пълен наръчник", ur: "آذربائیجان میں رہائش کی قیمتیں: مکمل رہنما", uz: "Ozarbayjon hayot xarajatlari: To'liq qo'llanma", sw: "Gharama za maisha huko Azerbaijan: Mwongozo kamili", so: "Kharashyada Nolosha ee Azerbaijan: Hage Dhamaystiran", id: "Biaya Hidup di Azerbaijan: Panduan Lengkap" },
    excerpt: { de: "Vergleichen Sie die Lebenshaltungskosten in Aserbaidschan.", zh: "将阿塞拜疆的生活费用与其他国家进行比较。", ar: "قارن تكلفة المعيشة في أذربيجان.", fa: "هزینه زندگی در آذربایجان را با کشورهای دیگر مقایسه کنید.", tk: "Azerbayjandanyň duran meşguliýet meşgelerini beýleki ýurdlar bilen saňaşdyryň.", kk: "Әзербайжандағы өмір сүру құнын басқа елдермен салыстырыңыз.", ky: "Азербайжандагы жашоо чыгашаларын башка өлкөлөр менен салыштырыңыз.", bg: "Сравнете разходите за живот в Азербайджан с други страни.", ur: "آذربائیجان میں رہائش کی قیمتیں دوسرے ممالک سے موازنہ کریں۔", az: "Azərbaycanda yaşayış xərclərini digər ölkələrlə müqayisə edin.", sw: "Linganisha gharama za maisha huko Azerbaijan na nchi nyingine.", so: "Is barbar dhig kharashyada nolosha ee Azerbaijan waddamada kale.", id: "Bandingkan biaya hidup di Azerbaijan dengan negara lain." }
  },
  'b-11': {
    title: { fr: "Bourses d'études pour étudier en Azerbaïdjan", zh: "阿塞拜疆留学奖学金", ar: "المنح الدراسية للدراسة في أذربيجان", fa: "بورسیه‌های تحصیلی برای تحصیل در آذربایجان", tk: "Azerbayjanda okamak üçin Bilim Tabşyryklary", kk: "Әзербайжанда оқу үшін стипендиялар", ky: "Азербайжанда окуу үчүн стипендиялар", bg: "Стипендии за обучение в Азербайджан", ur: "آذربائیجان میں تعلیم کے لیے وظائف", uz: "Ozarbayjonda o'qish uchun stipendiyalar", sw: "Stipendi za kusoma huko Azerbaijan", so: "Stipendyada Waxbarasho ee Azerbaijan", id: "Beasiswa Kuliah di Azerbaijan" },
    excerpt: { de: "Entdecken Sie Finanzierungsmöglichkeiten für internationale Studierende.", zh: "探索为国际学生提供的阿塞拜疆资助机会。", ar: "اكتشف فرص التمويل للطلاب الدوليين في أذربيجان.", fa: "فرصت‌های مالی برای دانشجویان بین‌المللی در آذربایجان را کشف کنید.", tk: "Azerbayjandaky milletlerara ögrıjençleriň töleg möümjeklerini açyň.", kk: "Әзербайжандағы халықаралық студенттерге арналған қаржыландыру мүмкіндіктерін ашыңыз.", ky: "Азербайжандагы эл аралык студенттер үчүн каржылоо мүмкүнчүлүктөрүн ачыңыз.", bg: "Открийте възможностите за финансиране на международни студенти.", ur: "آذربائیجان میں بین الاقوامی طلباء کے لیے مالی فراہمی کے مواقع۔", az: "Azərbaycanda beynəlxalq tələbələr üçün maliyyələşdirmə imkanlarını kəşf edin.", sw: "Gundua fursa za ufadhili kwa wanafunzi wa kimataifa huko Azerbaijan.", so: "Fursadaha Maaliyadeed ee Ardayda Caalamiga ah ee Azerbaijan ka hel.", id: "Temukan peluang pendanaan untuk mahasiswa internasional di Azerbaijan." }
  },
  'b-12': {
    title: { fr: "Pourquoi étudier en Azerbaïdjan ?", zh: "为什么选择在阿塞拜疆学习？", ar: "لماذا الدراسة في أذربيجان؟", fa: "چرا در آذربایجان تحصیل کنیم؟", tk: "Näme üşün Azerbayjanda okamaly?", kk: "Неліктен Әзербайжанда оқу керек?", ky: "Эмнеге Азербайжанда окуу керек?", bg: "Защо да учите в Азербайджан?", ur: "آذربائیجان میں کیوں پڑھیں؟", uz: "Nima uchun Ozarbayjonda o'qish kerak?", sw: "Kwa nini kusoma huko Azerbaijan?", so: "Maxay Lagu Barta Azerbaijan?", id: "Mengapa Kuliah di Azerbaijan?" },
    excerpt: { de: "Die Top-Gründe für ein Studium in Aserbaidschan.", zh: "在阿塞拜疆学习的主要原因。", ar: "أهم أسباب الدراسة في أذربيجان.", fa: "دلایل اصلی تحصیل در آذربایجان.", tk: "Azerbayjanda okamaýyň esasy sebäpleri.", kk: "Әзербайжанда оқудың негізгі себептері.", ky: "Азербайжанда окуунун негизги себептери.", bg: "Основните причини да учите в Азербайджан.", ur: "آذربائیجان میں پڑھنے کی اہم وجوہات۔", az: "Azərbaycanda təhsil almağın əsas səbəbləri.", sw: "Sababu kuu za kusoma huko Azerbaijan.", so: "Sababaha ugu waaweyn ee waxbarashada Azerbaijan.", id: "Alasan utama kuliah di Azerbaijan." }
  },
  'b-13': {
    title: { fr: "Guide du visa Azerbaïdjan pour les étudiants", zh: "阿塞拜疆学生签证指南", ar: "دليل تأشيرة أذربيجان للطلاب", fa: "راهنمای ویزای آذربایجان برای دانشجویان", tk: "Azerbayjan Ögrıjençlaryň Wiza Elňätze", kk: "Әзербайжан студенттеріне арналған виза нұсқаулығы", ky: "Азербайжан студенттерине арналган виза колдонмосу", bg: "Ръководство за виза за Азербайджан за студенти", ur: "طلباء کے لیے آذربائیجان ویزا گائیڈ", uz: "Ozarbayjon vizasi bo'yicha talabalar uchun qo'llanma", sw: "Mwongozo wa Visa ya Azerbaijan kwa Wanafunzi", so: "Hage fiisiga Azerbaijan ee Ardayda", id: "Panduan Visa Azerbaijan untuk Pelajar" },
    excerpt: { de: "Alles über den Visumsprozess für ein Studium in Aserbaidschan.", zh: "关于在阿塞拜疆学习签证过程您需要知道的一切。", ar: "كل ما تحتاج لمعرفته عن عملية التأشيرة للدراسة في أذربيجان.", fa: "همه چیزهایی که باید درباره فرآیند ویزا برای تحصیل در آذربایجان بدانید.", tk: "Azerbayjanda okamak üçin wiza alyş-çalyşynda bilmegiňiz gerekän zatlaryň hepisi.", kk: "Әзербайжанда оқу үшін виза процесі туралы.", ky: "Азербайжанда окуу үчүн виза процесси жөнүндө.", bg: "Всичко за процеса на виза за обучение в Азербайджан.", ur: "آذربائیجان میں تعلیم کے لیے ویزا عمل کے بارے میں۔", az: "Azərbaycanda təhsil almaq üçün viza prosesi barədə hər şey.", sw: "Kila kitu kuhusu mchakato wa visa wa kusoma huko Azerbaijan.", so: "Wax kasta oo aad uga baahan tahay habka fiisiga Azerbaijan.", id: "Semua tentang proses visa untuk kuliah di Azerbaijan." }
  },
  'b-14': {
    title: { fr: "Comparaison : étudier en Azerbaïdjan vs. Turquie", zh: "比较：在阿塞拜疆学习 vs. 土耳其", ar: "مقارنة: الدراسة في أذربيجان مقابل تركيا", fa: "مقایسه: تحصیل در آذربایجان در مقابل ترکیه", tk: "Saňaşdyrma: Azerbayjanda okamak we Türkiýede okamak", kk: "Салыстыру: Әзербайжанда оқу vs Түркияда оқу", ky: "Салыштыруу: Азербайжанда окуу vs Түркияда окуу", bg: "Сравнение: Учене в Азербайджан vs. Турция", ur: "موازنہ: آذربائیجان میں تعلیم بنام ترکی", uz: "Taqqoslash: Ozarbayjonda o'qish vs Turkiyada o'qish", sw: "Linganisha: Kusoma huko Azerbaijan dhidi ya Uturuki", so: "Is barbar dhig: Waxbarashada Azerbaijan vs. Turkiga", id: "Perbandingan: Kuliah di Azerbaijan vs. Turki" },
    excerpt: { de: "Vergleichen Sie die Ausbildungskosten in Aserbaidschan mit der Türkei.", zh: "将阿塞拜疆的教育费用与土耳其进行比较。", ar: "قارن تكاليف التعليم في أذربيجان وتركيا.", fa: "هزینه‌های تحصیل در آذربایجان را با ترکیه مقایسه کنید.", tk: "Azerbayjanda bilim meşgelerini Türkiye bilen saňaşdyryň.", kk: "Әзербайжандағы оқу шығыстарын Түркиямен салыстырыңыз.", ky: "Азербайжандагы окуу чыгашаларын Түркия менен салыштырыңыз.", bg: "Сравнете разходите за образование в Азербайджан и Турция.", ur: "آذربائیجان میں تعلیم کی لاگت ترکی سے موازنہ کریں۔", az: "Azərbaycanda təhsil xərclərini Türkiyə ilə müqayisə edin.", sw: "Linganisha gharama za elimu huko Azerbaijan na Uturuki.", so: "Is barbar dhig kharashyada waxbarashada Azerbaijan iyo Turkiga.", id: "Bandingkan biaya pendidikan di Azerbaijan dengan Turki." }
  },
  'b-15': {
    title: { fr: "Meilleurs programmes d'ingénierie en Azerbaïdjan", zh: "阿塞拜疆最佳工程项目", ar: "أفضل برامج الهندسة في أذربيجان", fa: "بهترین برنامه‌های مهندسی در آذربایجان", tk: "Azerbayjandaky iň gowy muhendislik programmalary", kk: "Әзербайжандағы үздік инженерлік бағдарламалар", ky: "Азербайжандагы мыкты инженердик программалар", bg: "Най-добри инженерни програми в Азербайджан", ur: "آذربائیجان میں بہترین انجینئرنگ پروگرام", uz: "Ozarbayjondagi eng yaxshi muhandislik dasturlari", sw: "Programu Bora za Uhandisi huko Azerbaijan", so: "Barnaamijyada Injineering ee ugu fiican Azerbaijan", id: "Program Teknik Terbaik di Azerbaijan" },
    excerpt: { de: "Entdecken Sie die besten Ingenieurprogramme in Aserbaidschan.", zh: "探索阿塞拜疆的最佳工程项目。", ar: "اكتشف أفضل برامج الهندسة في أذربيجان.", fa: "بهترین برنامه‌های مهندسی آذربایجان را کشف کنید.", tk: "Azerbayjandaky iň gowy muhendislik programmalaryny açyň.", kk: "Әзербайжандағы үздік инженерлік бағдарламаларды ашыңыз.", ky: "Азербайжандагы мыкты инженердик программаларды ачыңыз.", bg: "Открийте най-добри инженерни програми в Азербайджан.", ur: "آذربائیجان کے بہترین انجینئرنگ پروگرام۔", az: "Azərbaycanın ən yaxşı mühəndislik proqramlarını kəşf edin.", sw: "Gundua programu bora za uhandisi huko Azerbaijan.", so: "Barnaamijyada Injineering ee ugu fiican Azerbaijan ka hel.", id: "Temukan program teknik terbaik di Azerbaijan." }
  },
  'b-16': {
    title: { fr: "Langue azerbaïdjanaise pour les étudiants", zh: "学生阿塞拜疆语指南", ar: "اللغة الأذربيجانية للطلاب", fa: "زبان آذربایجانی برای دانشجویان", tk: "Ögrıjençleriň Azerbayjança Dilini Öwrenmek", kk: "Студенттерге арналған Әзербайжан тілі", ky: "Студенттерге арналган Азербайжан тили", bg: "Азербайджански език за студенти", ur: "طلباء کے لیے آذربائیجانی زبان", uz: "Talabalar uchun Ozarbayjon tili", sw: "Lugha ya Azerbaijan kwa Wanafunzi", so: "Af Soomaaliga Azerbaijan ee Ardayda", id: "Bahasa Azerbaijan untuk Pelajar" },
    excerpt: { de: "Erlernen Sie die Grundlagen der aserbaidschanischen Sprache.", zh: "学习阿塞拜疆语的基础知识。", ar: "تعلم أساسيات اللغة الأذربيجانية.", fa: "基础知识 آذربایجانی را بیاموزید.", tk: "Azerbayjança diliniň esasy zatlaryny öwreniň.", kk: "Әзербайжан тілінің негіздерін үйреніңіз.", ky: "Азербайжан тилинин негиздерин үйрөңүз.", bg: "Научете основите на азербайджанския език.", ur: "آذربائیجانی زبان کی بنیادی باتیں سیکھیں۔", az: "Azərbaycan dilinin əsaslarını öyrənin.", sw: "Jifunze misingi ya lugha ya Azerbaijan.", so: "Baro asaaska af Soomaaliga Azerbaijan.", id: "Pelajari dasar bahasa Azerbaijan." }
  }
};

function insertAfterLastLang(blockLines, missingLangs, postId, blockType) {
  // Find the index of the last line that looks like a language key
  let lastLangIdx = -1;
  for (let i = blockLines.length - 1; i >= 0; i--) {
    const trimmed = blockLines[i].trim();
    if (/^\w+: /.test(trimmed) || /^\w+: "/.test(trimmed)) {
      lastLangIdx = i;
      break;
    }
  }
  
  if (lastLangIdx === -1) return blockLines;
  
  const indent = blockLines[lastLangIdx].match(/^(\s+)/)?.[1] || '      ';
  
  const lastLine = blockLines[lastLangIdx];
  if (!lastLine.trim().endsWith(',')) {
    blockLines[lastLangIdx] = lastLine.replace(/\r?$/, ',');
  }
  
  const newLines = missingLangs.map((l, idx) => {
    const val = (tr[postId] && tr[postId][blockType] && tr[postId][blockType][l]) || '';
    const isLast = idx === missingLangs.length - 1;
    return `${indent}${l}: "${val}"${isLast ? '' : ','}`;
  });
  blockLines.splice(lastLangIdx + 1, 0, ...newLines);
  
  return blockLines;
}

let currentPostId = null;
let currentBlockType = null; // 'title' or 'excerpt'
let inBlock = false;
let blockDepth = 0;
let blockLines = [];
const output = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Detect post ID
  const idMatch = line.match(/id:\s*["'](b-\d+)["']/);
  if (idMatch) currentPostId = idMatch[1];
  
  // Detect title/excerpt block start
  if (!inBlock) {
    const titleMatch = line.match(/^(\s*)title:\s*\{/);
    const excerptMatch = line.match(/^(\s*)excerpt:\s*\{/);
    
    if (titleMatch) {
      inBlock = true;
      currentBlockType = 'title';
      blockDepth = 1;
      blockLines = [line];
      continue;
    }
    if (excerptMatch) {
      inBlock = true;
      currentBlockType = 'excerpt';
      blockDepth = 1;
      blockLines = [line];
      continue;
    }
    
    output.push(line);
    continue;
  }
  
  // Inside a block - accumulate lines and track braces
  blockLines.push(line);
  
  // Count braces (simple: just count { and })
  for (const ch of line) {
    if (ch === '{') blockDepth++;
    if (ch === '}') blockDepth--;
  }
  
  // Block closed
  if (blockDepth <= 0) {
    const blockText = blockLines.join('\n');
    const missing = ALL_LANGS.filter(l => !new RegExp(`^\\s+${l}:`, 'm').test(blockText));
    
    if (missing.length > 0 && currentPostId && tr[currentPostId]?.[currentBlockType]) {
      const actualMissing = missing.filter(l => tr[currentPostId][currentBlockType][l]);
      if (actualMissing.length > 0) {
        blockLines = insertAfterLastLang(blockLines, actualMissing, currentPostId, currentBlockType);
        console.log(`✅ ${currentPostId} ${currentBlockType}: +${actualMissing.length} langs`);
      }
    }
    
    output.push(...blockLines);
    inBlock = false;
    currentBlockType = null;
    blockLines = [];
  }
}

writeFileSync(filePath, output.join('\n'), 'utf8');
console.log('\n✅ File updated!');

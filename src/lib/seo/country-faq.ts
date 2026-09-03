/**
 * FAQ content for the "study in Azerbaijan from {country}" landing pages
 * (AEO: extractable answer blocks + FAQPage JSON-LD on 143 high-intent
 * pages that previously had none).
 *
 * Tokens are replaced per request:
 *   {country} — the localized country name
 *   {unis}    — 2-3 localized university names served on this page
 *
 * Answers are deliberately data-safe: numbers come from the site's own
 * published ranges (state tuition, ~$400/month Baku living) and never invent
 * a per-university fee.
 */
type FaqTemplate = {
  q1: string;
  a1: string;
  q2: string;
  a2: string;
  q3: string;
  a3: string;
};

export const COUNTRY_FAQ_TEMPLATES: Record<string, FaqTemplate> = {
  en: {
    q1: "Do students from {country} need a visa to study in Azerbaijan?",
    a1: "Yes. Students from {country} need a valid Azerbaijani study visa, which is issued on the basis of the university admission letter. AzStudy supports the whole process — admission, documents and arrival.",
    q2: "How much does it cost to study in Azerbaijan?",
    a2: "State universities start at about $600–1,000 per year, private Baku universities can reach about $15,000, and living in Baku costs roughly $400 per month. Exact tuition is shown on each university's page.",
    q3: "Which universities in Azerbaijan accept students from {country}?",
    a3: "Universities in Azerbaijan accept international students from {country}. Popular choices on this page include: {unis}.",
  },
  az: {
    q1: "{country} tələbələrinə Azərbaycanda təhsil üçün viza lazımdırmı?",
    a1: "Bəli. {country} tələbələrinə universitetdən qəbul məktubu əsasında verilən Azərbaycan tələbə vizası lazımdır. AzStudy bütün prosesdə — qəbul, sənədlər və gəlişdə dəstək olur.",
    q2: "Azərbaycanda təhsil nə qədər başa gəlir?",
    a2: "Dövlət universitetlərində təhsil haqqı ildə təxminən 600–1,000 ABŞ dollarından başlayır, özəl Bakı universitetlərində 15,000 dollaradək çata bilər, Bakıda yaşayış isə ayda təqribən 400 dollardır. Dəqiq qiymətlər hər universitetin səhifəsində göstərilir.",
    q3: "Hansı Azərbaycan universitetləri {country} tələbələrini qəbul edir?",
    a3: "Azərbaycan universitetləri {country} tələbələrini qəbul edir. Bu səhifədəki populyar seçimlər: {unis}.",
  },
  ru: {
    q1: "Нужна ли студентам из {country} виза для учёбы в Азербайджане?",
    a1: "Да. Студентам из {country} нужна действующая учебная виза Азербайджана, которая выдаётся на основании письма о зачислении. AzStudy сопровождает весь путь — поступление, документы и приезд.",
    q2: "Сколько стоит учёба в Азербайджане?",
    a2: "В государственных вузах обучение стоит от примерно 600–1000 долларов в год, в частных бакинских вузах — до 15000 долларов, жизнь в Баку — около 400 долларов в месяц. Точные цены указаны на странице каждого вуза.",
    q3: "Какие университеты Азербайджана принимают студентов из {country}?",
    a3: "Университеты Азербайджана принимают иностранных студентов из {country}. Популярные варианты на этой странице: {unis}.",
  },
  tr: {
    q1: "{country} öğrencilerinin Azerbaycan'da okumak için vizeye ihtiyacı var mı?",
    a1: "Evet. {country} öğrencilerinin, üniversite kabul mektubuna dayanarak verilen geçerli bir Azerbaycan öğrenci vizesine ihtiyacı vardır. AzStudy kabul, belgeler ve varış dahil tüm süreçte destek sağlar.",
    q2: "Azerbaycan'da eğitim ne kadar?",
    a2: "Devlet üniversitelerinde yıllık ücret yaklaşık 600–1.000 dolardan başlar, özel Bakü üniversitelerinde 15.000 dolara kadar çıkabilir; Bakü'de yaşam ise ayda yaklaşık 400 dolar tutar. Kesin ücretler her üniversitenin sayfasında belirtilir.",
    q3: "Azerbaycan'daki hangi üniversiteler {country} öğrencilerini kabul ediyor?",
    a3: "Azerbaycan üniversiteleri {country} öğrencilerini kabul etmektedir. Bu sayfadaki popüler seçenekler: {unis}.",
  },
  de: {
    q1: "Brauchen Studierende aus {country} ein Visum für ein Studium in Aserbaidschan?",
    a1: "Ja. Studierende aus {country} benötigen ein gültiges aserbaidschanisches Studienvisum, das auf der Grundlage des Zulassungsbescheids ausgestellt wird. AzStudy begleitet den gesamten Weg — Zulassung, Unterlagen und Ankunft.",
    q2: "Wie viel kostet ein Studium in Aserbaidschan?",
    a2: "Staatliche Universitäten beginnen bei etwa 600–1.000 US-Dollar pro Jahr, private Universitäten in Baku können bis zu 15.000 US-Dollar kosten, das Leben in Baku etwa 400 US-Dollar pro Monat. Genaue Gebühren stehen auf jeder Universitätseite.",
    q3: "Welche Universitäten in Aserbaidschan nehmen Studierende aus {country} auf?",
    a3: "Universitäten in Aserbaidschan nehmen internationale Studierende aus {country} auf. Beliebte Optionen auf dieser Seite: {unis}.",
  },
  fr: {
    q1: "Les étudiants de {country} ont-ils besoin d'un visa pour étudier en Azerbaïdjan ?",
    a1: "Oui. Les étudiants de {country} doivent être titulaires d'un visa d'études azerbaïdjanais valide, délivré sur la base de la lettre d'admission. AzStudy accompagne tout le parcours — admission, documents et arrivée.",
    q2: "Combien coûte un étudier en Azerbaïdjan ?",
    a2: "Les universités publiques commencent à environ 600–1 000 $ par an, les universités privées de Bakou peuvent atteindre environ 15 000 $, et vivre à Bakou coûte environ 400 $ par mois. Les frais exacts figurent sur la page de chaque université.",
    q3: "Quelles universités d'Azerbaïdjan acceptent les étudiants de {country} ?",
    a3: "Les universités azerbaïdjanaises acceptent les étudiants internationaux de {country}. Les choix populaires de cette page : {unis}.",
  },
  ar: {
    q1: "هل يحتاج طلاب {country} إلى تأشيرة للدراسة في أذربيجان؟",
    a1: "نعم. يحتاج طلاب {country} إلى تأشيرة دراسية أذربيجانية صالحة تُمنح بناءً على خطاب القبول الجامعي. يساعدك AzStudy في كامل العملية — القبول والوثائق والوصول.",
    q2: "كم تكلفة الدراسة في أذربيجان؟",
    a2: "تبدأ رسوم الجامعات الحكومية من حوالي 600–1000 دولار سنويًا، وقد تصل في جامعات باكو الخاصة إلى نحو 15000 دولار، بينما تبلغ تكاليف المعيشة في باكو حوالي 400 دولار شهريًا. تُعرض الرسوم الدقيقة في صفحة كل جامعة.",
    q3: "ما هي الجامعات الأذربيجانية التي تقبل طلاب {country}؟",
    a3: "تقبل الجامعات الأذربيجانية الطلاب الدوليين من {country}. من الخيارات الشائعة في هذه الصفحة: {unis}.",
  },
  fa: {
    q1: "آیا دانشجویان {country} برای تحصیل در آذربایجان به ویزا نیاز دارند؟",
    a1: "بله. دانشجویان {country} به ویزای تحصیلی معتبر آذربایجان نیاز دارند که بر اساس نامه پذیرش دانشگاه صادر می‌شود. AzStudy در تمام مسیر — پذیرش، مدارک و ورود — همراه شماست.",
    q2: "هزینه تحصیل در آذربایجان چقدر است؟",
    a2: "شهریه دانشگاه‌های دولتی از حدود ۶۰۰ تا ۱۰۰۰ دلار در سال شروع می‌شود، دانشگاه‌های خصوصی باکو تا حدود ۱۵۰۰۰ دلار و هزینه زندگی در باکو حدود ۴۰۰ دلار در ماه است. هزینه دقیق در صفحه هر دانشگاه آمده است.",
    q3: "کدام دانشگاه‌های آذربایجان دانشجویان {country} را می‌پذیرند؟",
    a3: "دانشگاه‌های آذربایجان دانشجویان بین‌المللی از {country} را می‌پذیرند. گزینه‌های محبوب این صفحه: {unis}.",
  },
  zh: {
    q1: "{country}的学生去阿塞拜疆留学需要签证吗？",
    a1: "需要。来自{country}的学生需要持有有效的阿塞拜疆学生签证，该签证根据大学录取通知书签发。AzStudy 全程协助——录取、文件和抵达。",
    q2: "在阿塞拜疆留学费用是多少？",
    a2: "公立大学每年约 600–1000 美元起，巴库私立大学最高可达约 15000 美元，在巴库生活每月约 400 美元。具体学费见各大学页面。",
    q3: "阿塞拜疆哪些大学接收{country}的学生？",
    a3: "阿塞拜疆大学接收来自{country}的国际学生。本页的热门选择：{unis}。",
  },
  tk: {
    q1: "{country} talypalaryna Azerbaýjanda okamak üçin wiza gerekmi?",
    a1: "Hawa. {country} talypalaryna uniwersitetiň kabul haty esasynda berilýän güýjli Azerbaýjan okuw wizasy gerek. AzStudy bütün prosesde — kabul, resminamalar we gelişde goldaw berýär.",
    q2: "Azerbaýjanda okamak näçe çykdajy?",
    a2: "Döwlet uniwersitetlerinde ýyllyk töleg takmynan 600–1000 dollardan başlaýar, hususy Baku uniwersitetlerinde 15000 dollar çenli baryp biler, Bakuda ýaşaýyş bolsa aýda takmynan 400 dollar. Takyk bahalar her uniwersitetiň sahypasynda.",
    q3: "Azerbaýjanyň haýsy uniwersitetleri {country} talypalaryny kabul edýär?",
    a3: "Azerbaýjan uniwersitetleri {country} dan halkara talypalaryny kabul edýär. Bu sahypadaky meşhur saýlamalar: {unis}.",
  },
  kk: {
    q1: "{country} студенттеріне Әзірбайжанда оқу үшін виза қажет пе?",
    a1: "Иә. {country} студенттеріне университеттің қабылдау хаты негізінде берілетін жарамды Әзірбайжан студенттік визасы қажет. AzStudy бүкіл процесте — қабылдау, құжаттар және келу — көмектеседі.",
    q2: "Әзірбайжанда оқу қанша тұрады?",
    a2: "Мемлекеттік университеттерде жылдық ақы шамамен 600–1000 доллардан басталады, жеке Баку университеттерінде 15000 долларға дейін жетуі мүмкін, Бакуде тұру айына шамамен 400 доллар. Нақты бағалар әр университеттің парақшасында.",
    q3: "Әзірбайжанның қандай университеттері {country} студенттерін қабылдайды?",
    a3: "Әзірбайжан университеттері {country} студенттерін қабылдайды. Осы парақшадағы танымал таңдаулар: {unis}.",
  },
  ky: {
    q1: "{country} студенттерине Азербайжанда окуу үчүн виза керекпи?",
    a1: "Ооба. {country} студенттерине университеттин кабыл алуу катынын негизинде берилүүчү жарактуу Азербайжан студенттик визасы керек. AzStudy бүт процесс боюнча — кабыл алуу, документтер жана келүү — жардам берет.",
    q2: "Азербайжанда окуу канча турат?",
    a2: "Мамлекеттик университеттерде жылдык акы болжол менен 600–1000 доллардан башталат, жеке Баку университеттеринде 15000 долларга чейин жетиши мүмкүн, Бакуда жашоо айына болжол менен 400 доллар. Так баалар ар бир университеттин баракчасында.",
    q3: "Азербайжандын кайсы университеттери {country} студенттерин кабыл алат?",
    a3: "Азербайжан университеттери {country} студенттерин кабыл алат. Бул баракчадагы популярдуу тандоолор: {unis}.",
  },
  bg: {
    q1: "Нужна ли на студентите от {country} виза за следване в Азербайджан?",
    a1: "Да. Студентите от {country} се нуждаят от валидна азербайджанска студентска виза, издадена въз основа на писмото за приемане. AzStudy подкрепя целия процес — приемане, документи и пристигане.",
    q2: "Колко струва следването в Азербайджан?",
    a2: "Държавните университети започват от около 600–1000 долара годишно, частните университети в Баку могат да достигнат около 15 000 долара, а животът в Баку струва около 400 долара месечно. Точните такси са показани на страницата на всеки университет.",
    q3: "Кои университети в Азербайджан приемат студенти от {country}?",
    a3: "Университетите в Азербайджан приемат чуждестранни студенти от {country}. Популярни избори на тази страница: {unis}.",
  },
  ur: {
    q1: "کیا {country} کے طلبہ کو آذربائیجان میں تعلیم کے لیے ویزا درکار ہے؟",
    a1: "جی ہاں۔ {country} کے طلبہ کو درست آذربائیجانی طلبہ ویزا درکار ہے، جو یونیورسٹی کے داخلے کے خط کی بنیاد پر جاری ہوتا ہے۔ AzStudy پورے عمل میں — داخلہ، دستاویزات اور آمد — مدد فراہم کرتا ہے۔",
    q2: "آذربائیجان میں تعلیم کی لاگت کتنی ہے؟",
    a2: "سرکاری یونیورسٹیوں میں سالانہ فیس تقریباً 600–1000 ڈالر سے شروع ہوتی ہے، باکو کی نجی یونیورسٹیاں تقریباً 15000 ڈالر تک جا سکتی ہیں، اور باکو میں رہائش ماہانہ تقریباً 400 ڈالر ہے۔ درست فیسیں ہر یونیورسٹی کے صفحے پر دی گئی ہیں۔",
    q3: "آذربائیجان کی کون سی یونیورسٹیاں {country} کے طلبہ کو داخلہ دیتی ہیں؟",
    a3: "آذربائیجان کی یونیورسٹیاں {country} کے بین الاقوامی طلبہ کو داخلہ دیتی ہیں۔ اس صفحے کے مقبول انتخاب: {unis}۔",
  },
  uz: {
    q1: "{country} talabalari Ozarbayjonda o'qish uchun viza kerakmi?",
    a1: "Ha. {country} talabalari universitetning qabul xati asosida beriladigan amaldagi Ozarbayjon talaba vizasiga muhtoj. AzStudy butun jarayonda — qabul, hujjatlar va kelishda yordam beradi.",
    q2: "Ozarbayjonda o'qish qancha turadi?",
    a2: "Davlat universitetlarida yillik to'lov taxminan 600–1000 dollardan boshlanadi, xususiy Boku universitetlarida 15000 dollargacha yetishi mumkin, Bokuda yashash esa oyiga taxminan 400 dollar. Aniq narxlar har bir universitet sahifasida ko'rsatilgan.",
    q3: "Ozarbayjonning qaysi universitetlari {country} talabalarini qabul qiladi?",
    a3: "Ozarbayjon universitetlari {country} dan xalqaro talabalarni qabul qiladi. Ushbu sahifadagi mashhur tanlovlar: {unis}.",
  },
  sw: {
    q1: "Je, wanafunzi kutoka {country} wanahitaji visa kusoma nchini Azerbaijan?",
    a1: "Ndiyo. Wanafunzi kutoka {country} wanahitaji visa halali ya kusoma ya Azerbaijan, inayotolewa kwa msingi wa barua ya kukubaliwa chuoni. AzStudy inasaidia mchakato mzima — kukubaliwa, nyaraka na kuwasili.",
    q2: "Kusoma nchini Azerbaijan kunagharimu kiasi gani?",
    a2: "Vyuo vya umma vinaanza takriban dola 600–1000 kwa mwaka, vyuo vya kibinafsi vya Baku vinaweza kufikia dola 15000, na kuishi Baku kunagharimu takriban dola 400 kwa mwezi. Ada kamili zinaonyeshwa kwenye ukurasa wa kila chuo.",
    q3: "Ni vyuo vipi vya Azerbaijan vinavyokubali wanafunzi kutoka {country}?",
    a3: "Vyuo vya Azerbaijan vinakubali wanafunzi wa kimataifa kutoka {country}. Chaguo maarufu kwenye ukurasa huu: {unis}.",
  },
  so: {
    q1: "Ma ardayda ka yimid {country} waxay u baahan yihiin fiisaha si ay wax ugu bartaan Asarbeejan?",
    a1: "Haa. Ardayda ka yimid {country} waxay u baahan yihiin fiiso waxbarasho oo Asarbeejan ah oo ansax ah, kaas oo lagu soo saaro warqadda gelitaanka jaamacadda. AzStudy waxay ku caawisaa habka oo dhan — gelitaanka, dukumintiyada iyo imaatinka.",
    q2: "Imisa ayay ku kacdaa waxbarashada dalka Asarbeejan?",
    a2: "Jaamacadaha dawladda waxay ka bilaabmaan qiyaastii $600–1,000 sannadkii, jaamacadaha gaarka ah ee Baku waxay gaari karaan ilaa $15,000, nolosha Baku-na waxay ku kacdaa qiyaastii $400 bishii. Qiimaha saxda ah waxaa lagu muujiyey bogga jaamacad kasta.",
    q3: "Jaamacadahee ee Asarbeejan ayaa aqbalaysa ardayda ka yimid {country}?",
    a3: "Jaamacadaha Asarbeejan waxay aqbalaan ardayda caalamiga ah ee ka yimid {country}. Xulashooyinka caanka ah ee boggan: {unis}.",
  },
  id: {
    q1: "Apakah pelajar dari {country} perlu visa untuk kuliah di Azerbaijan?",
    a1: "Ya. Pelajar dari {country} harus memiliki visa pelajar Azerbaijan yang sah, yang diterbitkan berdasarkan surat penerimaan universitas. AzStudy mendampingi seluruh proses — penerimaan, dokumen, dan kedatangan.",
    q2: "Berapa biaya kuliah di Azerbaijan?",
    a2: "Universitas negeri mulai sekitar $600–1.000 per tahun, universitas swasta di Baku dapat mencapai sekitar $15.000, dan biaya hidup di Baku sekitar $400 per bulan. Biaya pasti tertera di halaman tiap universitas.",
    q3: "Universitas mana di Azerbaijan yang menerima pelajar dari {country}?",
    a3: "Universitas di Azerbaijan menerima pelajar internasional dari {country}. Pilihan populer di halaman ini: {unis}.",
  },
};

export function getCountryFaqTemplate(locale: string): FaqTemplate {
  return COUNTRY_FAQ_TEMPLATES[locale] ?? COUNTRY_FAQ_TEMPLATES.en;
}

/** Fill {country}/{unis} tokens in a template string. */
export function fillFaq(
  template: string,
  vars: { country: string; unis: string },
): string {
  return template
    .replaceAll("{country}", vars.country)
    .replaceAll("{unis}", vars.unis);
}

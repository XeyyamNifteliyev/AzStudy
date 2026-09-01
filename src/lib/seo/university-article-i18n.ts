/**
 * AEO/i18n: localized template strings for the per-university article
 * generator (Klaster 5, seo.md). Every string supports {placeholders}
 * interpolated by university-articles.ts. Keeping the copy here (not inline
 * in the generator) lets all 46 articles × 18 locales render fully
 * translated long-form content.
 */

export interface UniArticleTemplate {
  typeState: string;
  typePrivate: string;
  intro: string;
  whyTitle: string;
  whyBody: string;
  admTitle: string;
  admIntlTitle: string;
  docs: string[];
  tlTitle: string;
  tl: [string, string, string, string];
  feesTitle: string;
  tbl: [string, string, string];
  tblRows: [string, string, string];
  tblDurations: [string, string, string];
  feesSource: string;
  programsTitle: string;
  programsBody: string;
  scholarshipsTitle: string;
  scholarshipsState: string;
  scholarshipsPrivate: string;
  lifeTitle: string;
  lifeBaku: string;
  lifeOther: string;
  howTitle: string;
  steps: string[];
  faqTitle: string;
  faqs: Array<[string, string]>;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  category: string;
}

export const UNI_ARTICLE_TEMPLATES: Record<string, UniArticleTemplate> = {
  en: {
    typeState: "state",
    typePrivate: "private",
    intro:
      "{name} is a {type} university located in {city}, Azerbaijan, founded in {founded}. With approximately {students} students, it is one of the key institutions for higher education in the region.",
    whyTitle: "Why Study at {name}?",
    whyBody:
      "{name} offers internationally recognized degrees, affordable tuition fees ({tuitionRange}/year), and programs taught in {langList}. The university has {students} students and a strong reputation in {city}'s academic community.",
    admTitle: "Admission Requirements",
    admIntlTitle: "For International Students",
    docs: [
      "Valid passport (minimum 6 months validity)",
      "High school diploma or equivalent (apostilled)",
      "Transcript of records",
      "Language proficiency certificate (IELTS 5.0+ or equivalent)",
      "Motivation letter",
      "Passport-sized photographs",
    ],
    tlTitle: "Application Timeline",
    tl: [
      "Application opens: March 1",
      "Deadline: July 15",
      "Results: August 1-15",
      "Semester starts: September 15",
    ],
    feesTitle: "Tuition Fees 2026",
    tbl: ["Program Level", "Annual Fee (USD)", "Duration"],
    tblRows: ["Bachelor's", "Master's", "PhD"],
    tblDurations: ["4 years", "2 years", "3-4 years"],
    feesSource: "*Source: {name} official fee schedule 2025-2026*",
    programsTitle: "Programs Available",
    programsBody:
      "The university offers programs in {langList} across multiple faculties including engineering, business, medicine, humanities and social sciences.",
    scholarshipsTitle: "Scholarships",
    scholarshipsState:
      "As a state university, {name} participates in the Azerbaijan Government Scholarship program offering full tuition waivers and monthly stipends for qualified international students.",
    scholarshipsPrivate:
      "{name} offers merit-based scholarships of 25-100% for international students with strong academic records.",
    lifeTitle: "Student Life in {city}",
    lifeBaku:
      "{city} is one of Azerbaijan's most vibrant capitals with modern infrastructure, rich cultural heritage and affordable living costs ($400-600/month).",
    lifeOther:
      "{city} is one of Azerbaijan's most welcoming cities with a growing student community and low cost of living ($200-350/month).",
    howTitle: "How to Apply",
    steps: [
      "Visit the university's official website",
      "Choose your program and check language requirements",
      "Prepare and submit required documents",
      "Pay the application fee ({appFee})",
      "Attend the entrance exam (if required)",
      "Receive acceptance letter",
      "Apply for student visa",
      "Register upon arrival in Azerbaijan",
    ],
    faqTitle: "Frequently Asked Questions",
    faqs: [
      [
        "What language are programs taught in at {name}?",
        "Programs at {name} are taught in {langList}. English-taught programs are available for international students.",
      ],
      [
        "How much does it cost to study at {name}?",
        "Tuition at {name} ranges from {tuitionRange} per year depending on the program level and field of study.",
      ],
      [
        "Are there scholarships at {name}?",
        "Yes. Scholarships covering 25-100% of tuition are available for qualified international students.",
      ],
    ],
    excerpt:
      "Complete guide to studying at {name} in {city}, Azerbaijan: admission requirements, tuition fees 2026, programs, scholarships and student life for international students.",
    metaTitle: "{name} 2026 — Fees, Programs & Admission Guide",
    metaDescription:
      "Study at {name} in {city}: tuition fees 2026, programs, admission requirements and scholarships for international students.",
    category: "Universities",
  },
  tr: {
    typeState: "devlet",
    typePrivate: "özel",
    intro:
      "{name}, Azerbaycan'ın {city} şehrinde bulunan, {founded} yılında kurulmuş bir {type} üniversitesidir. Yaklaşık {students} öğrencisiyle bölgenin en önemli yükseköğretim kurumlarından biridir.",
    whyTitle: "{name}'de Neden Okumalısınız?",
    whyBody:
      "{name}, uluslararası geçerliliğe sahip diploması, uygun öğrenci ücretleri ({tuitionRange}/yıl) ve {langList} dillerinde verilen eğitim programları sunar. Üniversite, {students} öğrenciye sahiptir ve {city}'deki akademik camiada güçlü bir itibara sahiptir.",
    admTitle: "Başvuru Koşulları",
    admIntlTitle: "Uluslararası Öğrenciler İçin",
    docs: [
      "Geçerli pasaport (en az 6 ay geçerlilik)",
      "Lise diploması veya dengi (apostilli)",
      "Transkript",
      "Dil yeterlilik belgesi (IELTS 5.0+ veya dengi)",
      "Motivasyon mektubu",
      "Vesikalık fotoğraf",
    ],
    tlTitle: "Başvuru Takvimi",
    tl: [
      "Başvurular açılır: 1 Mart",
      "Son tarih: 15 Temmuz",
      "Sonuçlar: 1-15 Ağustos",
      "Dönem başlangıcı: 15 Eylül",
    ],
    feesTitle: "2026 Öğrenci Ücretleri",
    tbl: ["Program Düzeyi", "Yıllık Ücret (USD)", "Süre"],
    tblRows: ["Lisans", "Yüksek Lisans", "Doktora"],
    tblDurations: ["4 yıl", "2 yıl", "3-4 yıl"],
    feesSource: "*Kaynak: {name} resmi ücret listesi 2025-2026*",
    programsTitle: "Sunulan Programlar",
    programsBody:
      "Üniversite; mühendislik, işletme, tıp, beşeri bilimler ve sosyal bilimler dahil birçok fakültede {langList} dillerinde programlar sunmaktadır.",
    scholarshipsTitle: "Burslar",
    scholarshipsState:
      "Devlet üniversitesi olarak {name}, uluslararası öğrenciler için tam ücret muafiyeti ve aylık burs sunan Azerbaycan Devlet Burs Programı'na katılmaktadır.",
    scholarshipsPrivate:
      "{name}, güçlü akademik geçmişe sahip uluslararası öğrencilere %25-100 oranında başarı bursları sunmaktadır.",
    lifeTitle: "{city}'de Öğrenci Hayatı",
    lifeBaku:
      "{city}, modern altyapısı, zengin kültürel mirası ve uygun yaşam maliyetleriyle (ayda 400-600$) Azerbaycan'ın en canlı başkentlerinden biridir.",
    lifeOther:
      "{city}, büyüyen öğrenci topluluğu ve düşük yaşam maliyetiyle (ayda 200-350$) Azerbaycan'ın en misafirperver şehirlerinden biridir.",
    howTitle: "Nasıl Başvurulur",
    steps: [
      "Üniversitenin resmi web sitesini ziyaret edin",
      "Programınızı seçin ve dil şartlarını kontrol edin",
      "Gerekli belgeleri hazırlayıp başvurun",
      "Başvuru ücretini ödeyin ({appFee})",
      "Gerekirse giriş sınavına katılın",
      "Kabul mektubunu alın",
      "Öğrenci vizesine başvurun",
      "Azerbaycan'a varışta kayıt yaptırın",
    ],
    faqTitle: "Sık Sorulan Sorular",
    faqs: [
      [
        "{name}'de programlar hangi dilde okutuluyor?",
        "{name} programları {langList} dillerinde okutulmaktadır. Uluslararası öğrenciler için İngilizce programlar mevcuttur.",
      ],
      [
        "{name}'de okumak ne kadara mal oluyor?",
        "{name} öğrenci ücretleri, program düzeyine ve alana göre yıllık {tuitionRange} aralığındadır.",
      ],
      [
        "{name}'de burs var mı?",
        "Evet. Nitelikli uluslararası öğrenciler için ücretin %25-100'ünü kapsayan burslar mevcuttur.",
      ],
    ],
    excerpt:
      "{city}, Azerbaycan'daki {name} üniversitesinde okumak için eksiksiz rehber: başvuru koşulları, 2026 ücretleri, programlar, burslar ve öğrenci hayatı.",
    metaTitle: "{name} 2026 — Ücretler, Programlar ve Başvuru Rehberi",
    metaDescription:
      "{city}'deki {name} üniversitesinde okuyun: 2026 öğrenci ücretleri, programlar, başvuru koşulları ve burslar.",
    category: "Üniversiteler",
  },
  az: {
    typeState: "dövlət",
    typePrivate: "özəl",
    intro:
      "{name} Azərbaycanın {city} şəhərində yerləşən, {founded}-ci ildə təsis olunmuş {type} universitetidir. Təxminən {students} tələbəsi ilə regionun əsas ali təhsil müəssisələrindən biridir.",
    whyTitle: "{name}-da Niyə Təhsil Almalısınız?",
    whyBody:
      "{name} beynəlxalq tanınan diplomlar, əlverişli təhsil haqları ({tuitionRange}/il) və {langList} dillərində tədris olunan proqramlar təklif edir. Universitetin {students} tələbəsi var və {city} akademik icmasında güclü nüfuza malikdir.",
    admTitle: "Qəbul Tələbləri",
    admIntlTitle: "Xarici Tələbələr Üçün",
    docs: [
      "Etibarlı pasport (ən azı 6 ay etibarlılıq müddəti)",
      "Orta məktəb attestatı və ya ekvivalenti (apostillə)",
      "Transkript",
      "Dil bilik sertifikatı (IELTS 5.0+ və ya ekvivalenti)",
      "Motivasiya məktubu",
      "Pasport ölçülü şəkillər",
    ],
    tlTitle: "Müraciət Təqvimi",
    tl: [
      "Müraciətlər açılır: 1 mart",
      "Son tarix: 15 iyul",
      "Nəticələr: 1-15 avqust",
      "Semestr başlayır: 15 sentyabr",
    ],
    feesTitle: "Təhsil Haqları 2026",
    tbl: ["Proqram Səviyyəsi", "İllik Haqq (USD)", "Müddət"],
    tblRows: ["Bakalavr", "Magistratura", "Doktorantura"],
    tblDurations: ["4 il", "2 il", "3-4 il"],
    feesSource: "*Mənbə: {name} rəsmi haqq cədvəli 2025-2026*",
    programsTitle: "Mövcud Proqramlar",
    programsBody:
      "Universitet mühəndislik, biznes, tibb, humanitar və ictimai elmlər daxil olmaqla bir çox fakültə üzrə {langList} dillərində proqramlar təklif edir.",
    scholarshipsTitle: "Təqaüdlər",
    scholarshipsState:
      "Dövlət universiteti kimi {name} layiqli xarici tələbələr üçün tam təhsil haqqından azad olma və aylıq təqaüd təklif edən Azərbaycan Dövlət Təqaüd Proqramında iştirak edir.",
    scholarshipsPrivate:
      "{name} güclü akademik göstəricilərə malik xarici tələbələr üçün 25-100% həcmində nailiyyət təqaüdləri təklif edir.",
    lifeTitle: "{city}-da Tələbə Həyatı",
    lifeBaku:
      "{city} müasir infrastrukturu, zəngin mədəni irsi və əlverişli yaşayış xərcləri (ayda 400-600$) ilə Azərbaycanın ən canlı paytaxtlarından biridir.",
    lifeOther:
      "{city} böyüyən tələbə icması və aşağı yaşayış xərcləri (ayda 200-350$) ilə Azərbaycanın ən mehmanpərvər şəhərlərindən biridir.",
    howTitle: "Necə Müraciət Etməli",
    steps: [
      "Universitetin rəsmi veb-saytına daxil olun",
      "Proqramınızı seçin və dil tələblərini yoxlayın",
      "Lazımi sənədləri hazırlayıb təqdim edin",
      "Müraciət haqqını ödəyin ({appFee})",
      "Giriş imtahanında iştirak edin (tələb olunarsa)",
      "Qəbul məktubunu alın",
      "Tələbə vizası üçün müraciət edin",
      "Azərbaycana gəlişdən sonra qeydiyyatdan keçin",
    ],
    faqTitle: "Tez-tez Verilən Suallar",
    faqs: [
      [
        "{name}-da proqramlar hansı dildə tədris olunur?",
        "{name} proqramları {langList} dillərində tədris olunur. Xarici tələbələr üçün ingilis dilli proqramlar mövcuddur.",
      ],
      [
        "{name}-da təhsil almaq neçəyə başa gəlir?",
        "{name} təhsil haqları proqram səviyyəsindən və ixtisasdan asılı olaraq illik {tuitionRange} aralığındadır.",
      ],
      [
        "{name}-da təqaüd varmı?",
        "Bəli. Layiqli xarici tələbələr üçün təhsil haqqının 25-100%-ni əhatə edən təqaüdlər mövcuddur.",
      ],
    ],
    excerpt:
      "{city}, Azərbaycanda {name} universitetində təhsil almaq üçün tam bələdçi: qəbul tələbləri, 2026 təhsil haqları, proqramlar, təqaüdlər və tələbə həyatı.",
    metaTitle: "{name} 2026 — Qiymətlər, Proqramlar və Qəbul Bələdçisi",
    metaDescription:
      "{city}-dəki {name} universitetində oxuyun: 2026 təhsil haqları, proqramlar, qəbul tələbləri və təqaüdlər.",
    category: "Universitetlər",
  },
  ru: {
    typeState: "государственный",
    typePrivate: "частный",
    intro:
      "{name} — {type} университет в городе {city}, Азербайджан, основанный в {founded} году. С примерно {students} студентами это одно из ключевых высших учебных заведений региона.",
    whyTitle: "Почему стоит учиться в {name}?",
    whyBody:
      "{name} предлагает международно признанные дипломы, доступную стоимость обучения ({tuitionRange}/год) и программы на языках {langList}. В университете учатся {students} студентов, он пользуется сильной репутацией в академическом сообществе {city}.",
    admTitle: "Требования для поступления",
    admIntlTitle: "Для иностранных студентов",
    docs: [
      "Действующий паспорт (минимум 6 месяцев)",
      "Аттестат о среднем образовании или эквивалент (с апостилем)",
      "Выписка оценок",
      "Сертификат знания языка (IELTS 5.0+ или эквивалент)",
      "Мотивационное письмо",
      "Фотографии паспортного формата",
    ],
    tlTitle: "Календарь подачи",
    tl: [
      "Приём документов: с 1 марта",
      "Дедлайн: 15 июля",
      "Результаты: 1–15 августа",
      "Начало семестра: 15 сентября",
    ],
    feesTitle: "Стоимость обучения 2026",
    tbl: ["Уровень программы", "Плата в год (USD)", "Длительность"],
    tblRows: ["Бакалавриат", "Магистратура", "Докторантура"],
    tblDurations: ["4 года", "2 года", "3–4 года"],
    feesSource: "*Источник: официальный прайс {name} 2025–2026*",
    programsTitle: "Доступные программы",
    programsBody:
      "Университет предлагает программы на языках {langList} на многочисленных факультетах, включая инженерию, бизнес, медицину, гуманитарные и социальные науки.",
    scholarshipsTitle: "Стипендии",
    scholarshipsState:
      "Как государственный университет, {name} участвует в программе Правительственной стипендии Азербайджана, предоставляющей полное покрытие обучения и ежемесячные стипендии иностранным студентам.",
    scholarshipsPrivate:
      "{name} предлагает стипендии за достижения в размере 25–100% для иностранных студентов с сильной академической успеваемостью.",
    lifeTitle: "Студенческая жизнь в {city}",
    lifeBaku:
      "{city} — одна из самых оживлённых столиц Азербайджана с современной инфраструктурой, богатым культурным наследием и доступной стоимостью жизни ($400–600/мес).",
    lifeOther:
      "{city} — один из самых гостеприимных городов Азербайджана с растущим студенческим сообществом и низкой стоимостью жизни ($200–350/мес).",
    howTitle: "Как поступить",
    steps: [
      "Посетите официальный сайт университета",
      "Выберите программу и проверьте языковые требования",
      "Подготовьте и подайте необходимые документы",
      "Оплатите сбор за подачу ({appFee})",
      "Сдайте вступительный экзамен (если требуется)",
      "Получите письмо о зачислении",
      "Подайте на студенческую визу",
      "Зарегистрируйтесь по прибытии в Азербайджан",
    ],
    faqTitle: "Часто задаваемые вопросы",
    faqs: [
      [
        "На каких языках ведётся обучение в {name}?",
        "Программы в {name} ведутся на языках {langList}. Для иностранных студентов доступны англоязычные программы.",
      ],
      [
        "Сколько стоит учёба в {name}?",
        "Стоимость обучения в {name} — от {tuitionRange} в год в зависимости от уровня программы и специальности.",
      ],
      [
        "Есть ли стипендии в {name}?",
        "Да. Иностранным студентам доступны стипендии, покрывающие 25–100% стоимости обучения.",
      ],
    ],
    excerpt:
      "Полное руководство по учёбе в {name} в {city}, Азербайджан: требования, стоимость 2026, программы, стипендии и студенческая жизнь.",
    metaTitle: "{name} 2026 — Стоимость, программы и поступление",
    metaDescription:
      "Учёба в {name} ({city}): стоимость обучения 2026, программы, требования и стипендии для иностранных студентов.",
    category: "Университеты",
  },
  de: {
    typeState: "staatliche",
    typePrivate: "private",
    intro:
      "{name} ist eine {type} Universität in {city}, Aserbaidschan, gegründet {founded}. Mit rund {students} Studierenden gehört sie zu den wichtigsten Hochschuleinrichtungen der Region.",
    whyTitle: "Warum an der {name} studieren?",
    whyBody:
      "{name} bietet international anerkannte Abschlüsse, erschwingliche Studiengebühren ({tuitionRange}/Jahr) und Programme in {langList}. Die Universität zählt {students} Studierende und genießt in der Akademischen Gemeinschaft von {city} einen starken Ruf.",
    admTitle: "Zulassungsvoraussetzungen",
    admIntlTitle: "Für internationale Studierende",
    docs: [
      "Gültiger Reisepass (mindestens 6 Monate Gültigkeit)",
      "Abiturzeugnis oder Äquivalent (apostilliert)",
      "Notenübersicht",
      "Sprachzertifikat (IELTS 5.0+ oder Äquivalent)",
      "Motivationsschreiben",
      "Passfotos",
    ],
    tlTitle: "Bewerbungsfristen",
    tl: [
      "Bewerbung startet: 1. März",
      "Frist: 15. Juli",
      "Ergebnisse: 1.–15. August",
      "Semesterbeginn: 15. September",
    ],
    feesTitle: "Studiengebühren 2026",
    tbl: ["Programmebene", "Jahresgebühr (USD)", "Dauer"],
    tblRows: ["Bachelor", "Master", "Promotion"],
    tblDurations: ["4 Jahre", "2 Jahre", "3–4 Jahre"],
    feesSource: "*Quelle: offizielle Gebührenordnung der {name} 2025–2026*",
    programsTitle: "Verfügbare Programme",
    programsBody:
      "Die Universität bietet Programme in {langList} an zahlreichen Fakultäten an, darunter Ingenieurwesen, Wirtschaft, Medizin, Geistes- und Sozialwissenschaften.",
    scholarshipsTitle: "Stipendien",
    scholarshipsState:
      "Als staatliche Universität nimmt {name} am Stipendienprogramm der Regierung Aserbaidschans teil, das qualifizierten internationalen Studierenden volle Gebührenbefreiung und monatliche Stipendien bietet.",
    scholarshipsPrivate:
      "{name} bietet leistungsbezogene Stipendien von 25–100 % für internationale Studierende mit starken akademischen Leistungen.",
    lifeTitle: "Studentenleben in {city}",
    lifeBaku:
      "{city} ist eine der lebendigsten Hauptstädte Aserbaidschans mit moderner Infrastruktur, reichem Kulturerbe und erschwinglichen Lebenshaltungskosten (400–600 $/Monat).",
    lifeOther:
      "{city} ist eine der gastfreundlichsten Städte Aserbaidschans mit wachsender Studierendengemeinschaft und niedrigen Lebenshaltungskosten (200–350 $/Monat).",
    howTitle: "So bewerben Sie sich",
    steps: [
      "Besuchen Sie die offizielle Website der Universität",
      "Wählen Sie Ihr Programm und prüfen Sie die Sprachanforderungen",
      "Bereiten Sie die erforderlichen Dokumente vor und reichen Sie sie ein",
      "Zahlen Sie die Bewerbungsgebühr ({appFee})",
      "Nehmen Sie an der Aufnahmeprüfung teil (falls erforderlich)",
      "Erhalten Sie den Zulassungsbescheid",
      "Beantragen Sie das Studentenvisum",
      "Registrieren Sie sich nach Ankunft in Aserbaidschan",
    ],
    faqTitle: "Häufig gestellte Fragen",
    faqs: [
      [
        "In welchen Sprachen wird an der {name} unterrichtet?",
        "Die Programme an {name} werden in {langList} unterrichtet. Englischsprachige Programme stehen internationalen Studierenden offen.",
      ],
      [
        "Wie viel kostet das Studium an der {name}?",
        "Die Studiengebühren an {name} liegen je nach Programmebene und Fach zwischen {tuitionRange} pro Jahr.",
      ],
      [
        "Gibt es Stipendien an der {name}?",
        "Ja. Qualifizierten internationalen Studierenden stehen Stipendien von 25–100 % der Studiengebühren zur Verfügung.",
      ],
    ],
    excerpt:
      "Vollständiger Ratgeber für ein Studium an der {name} in {city}, Aserbaidschan: Zulassung, Studiengebühren 2026, Programme, Stipendien und Studentenleben.",
    metaTitle: "{name} 2026 — Gebühren, Programme & Zulassung",
    metaDescription:
      "Studieren Sie an der {name} in {city}: Studiengebühren 2026, Programme, Zulassungsvoraussetzungen und Stipendien für internationale Studierende.",
    category: "Universitäten",
  },
  fr: {
    typeState: "publique",
    typePrivate: "privée",
    intro:
      "{name} est une université {type} située à {city}, en Azerbaïdjan, fondée en {founded}. Avec environ {students} étudiants, c'est l'une des principales institutions d'enseignement supérieur de la région.",
    whyTitle: "Pourquoi étudier à {name} ?",
    whyBody:
      "{name} propose des diplômes reconnus internationalement, des frais de scolarité abordables ({tuitionRange}/an) et des programmes enseignés en {langList}. L'université compte {students} étudiants et jouit d'une solide réputation dans la communauté académique de {city}.",
    admTitle: "Conditions d'admission",
    admIntlTitle: "Pour les étudiants internationaux",
    docs: [
      "Passeport valide (minimum 6 mois de validité)",
      "Baccalauréat ou équivalent (apostillé)",
      "Relevé de notes",
      "Certificat de langue (IELTS 5.0+ ou équivalent)",
      "Lettre de motivation",
      "Photos d'identité",
    ],
    tlTitle: "Calendrier de candidature",
    tl: [
      "Ouverture des candidatures : 1er mars",
      "Date limite : 15 juillet",
      "Résultats : 1er–15 août",
      "Début du semestre : 15 septembre",
    ],
    feesTitle: "Frais de scolarité 2026",
    tbl: ["Niveau du programme", "Frais annuels (USD)", "Durée"],
    tblRows: ["Licence", "Master", "Doctorat"],
    tblDurations: ["4 ans", "2 ans", "3–4 ans"],
    feesSource: "*Source : grille tarifaire officielle de {name} 2025–2026*",
    programsTitle: "Programmes proposés",
    programsBody:
      "L'université propose des programmes en {langList} dans de nombreuses facultés, notamment ingénierie, gestion, médecine, sciences humaines et sociales.",
    scholarshipsTitle: "Bourses",
    scholarshipsState:
      "En tant qu'université publique, {name} participe au programme de bourses du gouvernement azerbaïdjanais offrant des exonérations complètes et des allocations mensuelles aux étudiants internationaux méritants.",
    scholarshipsPrivate:
      "{name} propose des bourses au mérite de 25 à 100 % pour les étudiants internationaux au dossier académique solide.",
    lifeTitle: "La vie étudiante à {city}",
    lifeBaku:
      "{city} est l'une des capitales les plus animées d'Azerbaïdjan, avec des infrastructures modernes, un riche patrimoine culturel et un coût de la vie abordable (400–600 $/mois).",
    lifeOther:
      "{city} est l'une des villes les plus accueillantes d'Azerbaïdjan, avec une communauté étudiante grandissante et un faible coût de la vie (200–350 $/mois).",
    howTitle: "Comment postuler",
    steps: [
      "Visitez le site officiel de l'université",
      "Choisissez votre programme et vérifiez les exigences linguistiques",
      "Préparez et soumettez les documents requis",
      "Payez les frais de dossier ({appFee})",
      "Passez l'examen d'entrée (si requis)",
      "Recevez la lettre d'admission",
      "Faites une demande de visa étudiant",
      "Inscrivez-vous à votre arrivée en Azerbaïdjan",
    ],
    faqTitle: "Questions fréquentes",
    faqs: [
      [
        "Dans quelles langues enseigne-t-on à {name} ?",
        "Les programmes de {name} sont enseignés en {langList}. Des programmes en anglais sont disponibles pour les étudiants internationaux.",
      ],
      [
        "Combien coûte l'étude à {name} ?",
        "Les frais à {name} vont de {tuitionRange} par an selon le niveau et le domaine du programme.",
      ],
      [
        "Y a-t-il des bourses à {name} ?",
        "Oui. Des bourses couvrant 25 à 100 % des frais sont disponibles pour les étudiants internationaux qualifiés.",
      ],
    ],
    excerpt:
      "Guide complet pour étudier à {name} à {city}, Azerbaïdjan : conditions d'admission, frais 2026, programmes, bourses et vie étudiante.",
    metaTitle: "{name} 2026 — Frais, programmes & admission",
    metaDescription:
      "Étudier à {name} à {city} : frais de scolarité 2026, programmes, conditions d'admission et bourses pour étudiants internationaux.",
    category: "Universités",
  },
  ar: {
    typeState: "حكومية",
    typePrivate: "خاصة",
    intro:
      "{name} جامعة {type} تقع في {city}، أذربيجان، تأسست عام {founded}. بحوالي {students} طالب، تُعد من المؤسسات التعليمية العليا الرئيسية في المنطقة.",
    whyTitle: "لماذا الدراسة في {name}؟",
    whyBody:
      "تقدم {name} شهادات معترفاً بها دولياً، ورسوماً دراسية ميسورة ({tuitionRange}/سنة)، وبرامج تُدرَّس باللغات {langList}. تضم الجامعة {students} طالب وتحظى بسمعة قوية في المجتمع الأكاديمي في {city}.",
    admTitle: "شروط القبول",
    admIntlTitle: "للطلاب الدوليين",
    docs: [
      "جواز سفر ساري المفعول (6 أشهر على الأقل)",
      "شهادة الثانوية العامة أو ما يعادلها (مصدّقة بالأبوستيل)",
      "كشف الدرجات",
      "شهادة إتقان اللغة (IELTS 5.0+ أو ما يعادلها)",
      "رسالة الدوافع",
      "صور بحجم جواز السفر",
    ],
    tlTitle: "جدول التقديم",
    tl: [
      "فتح التقديم: 1 مارس",
      "الموعد النهائي: 15 يوليو",
      "النتائج: 1-15 أغسطس",
      "بداية الفصل: 15 سبتمبر",
    ],
    feesTitle: "الرسوم الدراسية 2026",
    tbl: ["مستوى البرنامج", "الرسوم السنوية (دولار)", "المدة"],
    tblRows: ["البكالوريوس", "الماجستير", "الدكتوراه"],
    tblDurations: ["4 سنوات", "سنتان", "3-4 سنوات"],
    feesSource: "*المصدر: قائمة الرسوم الرسمية لـ {name} 2025-2026*",
    programsTitle: "البرامج المتاحة",
    programsBody:
      "تقدم الجامعة برامج باللغات {langList} في كليات متعددة تشمل الهندسة وإدارة الأعمال والطب والعلوم الإنسانية والاجتماعية.",
    scholarshipsTitle: "المنح الدراسية",
    scholarshipsState:
      "كونها جامعة حكومية، تشارك {name} في برنامج المنح الحكومية الأذربيجاني الذي يوفر إعفاءً كاملاً من الرسوم ورواتب شهرية للطلاب الدوليين المؤهلين.",
    scholarshipsPrivate:
      "تقدم {name} منحاً دراسية على أساس الجدارة بنسبة 25-100% للطلاب الدوليين ذوي السجل الأكاديمي القوي.",
    lifeTitle: "الحياة الطلابية في {city}",
    lifeBaku:
      "{city} من أكثر عواصم أذربيجان حيوية، ببنية تحتية حديثة وتراث ثقافي غني وتكاليف معيشة ميسورة (400-600 دولار/شهرياً).",
    lifeOther:
      "{city} من أكثر مدن أذربيجان ترحيباً، بمجتمع طلابي متنام وتكلفة معيشة منخفضة (200-350 دولار/شهرياً).",
    howTitle: "كيفية التقديم",
    steps: [
      "زر الموقع الرسمي للجامعة",
      "اختر برنامجك وتحقق من متطلبات اللغة",
      "جهّز المستندات المطلوبة وقدّمها",
      "ادفع رسوم التقديم ({appFee})",
      "احضر امتحان القبول (إذا لزم)",
      "استلم خطاب القبول",
      "قدّم على تأشيرة الطالب",
      "سجّل عند الوصول إلى أذربيجان",
    ],
    faqTitle: "الأسئلة الشائعة",
    faqs: [
      [
        "بأي لغة تُدرَّس البرامج في {name}؟",
        "تُدرَّس البرامج في {name} باللغات {langList}. وتتوفر برامج باللغة الإنجليزية للطلاب الدوليين.",
      ],
      [
        "كم تكلفة الدراسة في {name}؟",
        "تتراوح الرسوم في {name} من {tuitionRange} سنوياً حسب مستوى البرنامج والتخصص.",
      ],
      [
        "هل توجد منح في {name}؟",
        "نعم. تتوفر منح تغطي 25-100% من الرسوم للطلاب الدوليين المؤهلين.",
      ],
    ],
    excerpt:
      "دليل كامل للدراسة في {name} بـ{city}، أذربيجان: شروط القبول، الرسوم 2026، البرامج، المنح والحياة الطلابية.",
    metaTitle: "{name} 2026 — الرسوم والبرامج ودليل القبول",
    metaDescription:
      "ادرس في {name} بـ{city}: الرسوم الدراسية 2026، البرامج، شروط القبول والمنح للطلاب الدوليين.",
    category: "الجامعات",
  },
  fa: {
    typeState: "دولتی",
    typePrivate: "غیردولتی",
    intro:
      "{name} یک دانشگاه {type} در {city}، آذربایجان است که در سال {founded} تأسیس شده است. با حدود {students} دانشجو، یکی از مؤسسات کلیدی آموزش عالی در منطقه است.",
    whyTitle: "چرا در {name} تحصیل کنیم؟",
    whyBody:
      "{name} مدارک معتبر بین‌المللی، شهریه مقرون‌به‌صرفه ({tuitionRange}/سال) و برنامه‌های تحصیلی به زبان‌های {langList} ارائه می‌دهد. این دانشگاه {students} دانشجو دارد و در جامعه دانشگاهی {city} اعتبار زیادی دارد.",
    admTitle: "شرایط پذیرش",
    admIntlTitle: "برای دانشجویان بین‌المللی",
    docs: [
      "گذرنامه معتبر (حداقل ۶ ماه اعتبار)",
      "دیپلم دبیرستان یا معادل آن (با اپوستیل)",
      "ریزنمرات",
      "گواهی زبان (IELTS ۵.۰+ یا معادل)",
      "انگیزه‌نامه",
      "عکس پاسپورتی",
    ],
    tlTitle: "تقویم ثبت‌نام",
    tl: [
      "شروع ثبت‌نام: ۱ مارس",
      "مهلت: ۱۵ ژوئیه",
      "نتایج: ۱–۱۵ اوت",
      "شروع ترم: ۱۵ سپتامبر",
    ],
    feesTitle: "شهریه ۲۰۲۶",
    tbl: ["مقطع", "شهریه سالانه (دلار)", "مدت"],
    tblRows: ["کارشناسی", "کارشناسی ارشد", "دکتری"],
    tblDurations: ["۴ سال", "۲ سال", "۳–۴ سال"],
    feesSource: "*منبع: لیست رسمی شهریه {name} ۲۰۲۵–۲۰۲۶*",
    programsTitle: "رشته‌های موجود",
    programsBody:
      "دانشگاه در دانشکده‌های متعدد از جمله مهندسی، مدیریت، پزشکی، علوم انسانی و اجتماعی، برنامه‌هایی به زبان‌های {langList} ارائه می‌دهد.",
    scholarshipsTitle: "بورسیه‌ها",
    scholarshipsState:
      "به عنوان دانشگاهی دولتی، {name} در برنامه بورسیه دولت آذربایجان شرکت می‌کند که شامل معافیت کامل از شهریه و کمک‌هزینه ماهیانه برای دانشجویان بین‌المللی واجد شرایط است.",
    scholarshipsPrivate:
      "{name} برای دانشجویان بین‌المللی با سابقه تحصیلی قوی، بورسیه‌های شایستگی ۲۵ تا ۱۰۰ درصدی ارائه می‌دهد.",
    lifeTitle: "زندگی دانشجویی در {city}",
    lifeBaku:
      "{city} با زیرساخت مدرن، میراث فرهنگی غنی و هزینه زندگی مناسب (۴۰۰–۶۰۰ دلار در ماه) از پررونق‌ترین پایتخت‌های آذربایجان است.",
    lifeOther:
      "{city} با جامعه دانشجویی رو به رشد و هزینه زندگی پایین (۲۰۰–۳۵۰ دلار در ماه) از خوش‌نوازترین شهرهای آذربایجان است.",
    howTitle: "نحوه ثبت‌نام",
    steps: [
      "به وب‌سایت رسمی دانشگاه سر بزنید",
      "رشته خود را انتخاب و شرایط زبانی را بررسی کنید",
      "مدارک لازم را آماده و ارسال کنید",
      "هزینه ثبت‌نام را پرداخت کنید ({appFee})",
      "در آزمون ورودی شرکت کنید (در صورت نیاز)",
      "نامه پذیرش را دریافت کنید",
      "برای ویزای تحصیلی اقدام کنید",
      "پس از ورود به آذربایجان ثبت‌نام کنید",
    ],
    faqTitle: "سؤالات متداول",
    faqs: [
      [
        "برنامه‌های {name} به چه زبانی ارائه می‌شوند؟",
        "برنامه‌های {name} به زبان‌های {langList} ارائه می‌شوند و برنامه‌های انگلیسی‌زبان برای دانشجویان بین‌المللی موجود است.",
      ],
      [
        "هزینه تحصیل در {name} چقدر است؟",
        "شهریه {name} بسته به مقطع و رشته، از {tuitionRange} در سال شروع می‌شود.",
      ],
      [
        "آیا در {name} بورسیه وجود دارد؟",
        "بله. برای دانشجویان بین‌المللی واجد شرایط بورسیه‌های ۲۵ تا ۱۰۰ درصدی موجود است.",
      ],
    ],
    excerpt:
      "راهنمای کامل تحصیل در {name} در {city}، آذربایجان: شرایط پذیرش، شهریه ۲۰۲۶، رشته‌ها، بورسیه‌ها و زندگی دانشجویی.",
    metaTitle: "{name} ۲۰۲۶ — شهریه، رشته‌ها و راهنمای پذیرش",
    metaDescription:
      "تحصیل در {name} در {city}: شهریه ۲۰۲۶، رشته‌ها، شرایط پذیرش و بورسیه‌های دانشجویان بین‌المللی.",
    category: "دانشگاه‌ها",
  },
  zh: {
    typeState: "公立",
    typePrivate: "私立",
    intro:
      "{name}是位于阿塞拜疆{city}的一所{type}大学，成立于{founded}年。学校拥有约{students}名学生，是该地区重要的高等教育机构之一。",
    whyTitle: "为什么选择在{name}学习？",
    whyBody:
      "{name}提供国际认可的学位、实惠的学费（{tuitionRange}/年）以及以{langList}授课的课程。该校拥有{students}名学生，在{city}学术界享有良好声誉。",
    admTitle: "入学要求",
    admIntlTitle: "国际学生",
    docs: [
      "有效护照（至少6个月有效期）",
      "高中文凭或同等学历（需公证认证）",
      "成绩单",
      "语言能力证书（雅思5.0+或同等水平）",
      "个人陈述/动机信",
      "护照尺寸照片",
    ],
    tlTitle: "申请时间表",
    tl: [
      "申请开放：3月1日",
      "截止日期：7月15日",
      "录取结果：8月1-15日",
      "开学日期：9月15日",
    ],
    feesTitle: "2026年学费",
    tbl: ["课程层级", "年费（美元）", "学制"],
    tblRows: ["本科", "硕士", "博士"],
    tblDurations: ["4年", "2年", "3-4年"],
    feesSource: "*资料来源：{name}官方2025-2026学年收费标准*",
    programsTitle: "开设课程",
    programsBody:
      "该大学以{langList}授课，开设工程、商科、医学、人文与社会科学等众多院系的课程。",
    scholarshipsTitle: "奖学金",
    scholarshipsState:
      "作为公立大学，{name}参与阿塞拜疆政府奖学金项目，为符合条件的国际学生提供全额学费减免和月度津贴。",
    scholarshipsPrivate: "{name}为学业优秀的国际学生提供25%-100%的择优奖学金。",
    lifeTitle: "{city}的学生生活",
    lifeBaku:
      "{city}是阿塞拜疆最充满活力的首都之一，基础设施现代化，文化遗产丰富，生活费用适中（每月400-600美元）。",
    lifeOther:
      "{city}是阿塞拜疆最受欢迎的城市之一，学生社区不断壮大，生活费用低廉（每月200-350美元）。",
    howTitle: "申请流程",
    steps: [
      "访问大学官方网站",
      "选择课程并查看语言要求",
      "准备并提交所需文件",
      "支付申请费（{appFee}）",
      "参加入学考试（如需要）",
      "接收录取通知书",
      "申请学生签证",
      "抵达阿塞拜疆后办理注册",
    ],
    faqTitle: "常见问题",
    faqs: [
      [
        "{name}的课程用什么语言授课？",
        "{name}的课程以{langList}授课，并为国际学生提供英文授课课程。",
      ],
      [
        "在{name}学习需要多少费用？",
        "{name}的学费根据课程层级和专业不同，每年{tuitionRange}不等。",
      ],
      [
        "{name}有奖学金吗？",
        "有。为符合条件的国际学生提供覆盖学费25%-100%的奖学金。",
      ],
    ],
    excerpt:
      "在阿塞拜疆{city}的{name}大学学习的完整指南：入学要求、2026年学费、课程、奖学金和国际学生的校园生活。",
    metaTitle: "{name} 2026 — 学费、课程与入学指南",
    metaDescription:
      "在{city}的{name}学习：2026年学费、课程、入学要求和国际学生奖学金。",
    category: "大学",
  },
  ur: {
    typeState: "سرکاری",
    typePrivate: "نجی",
    intro:
      "{name} آذربائیجان کے شہر {city} میں واقع ایک {type} یونیورسٹی ہے جو {founded} میں قائم ہوئی۔ تقریباً {students} طلبہ کے ساتھ یہ خطے کے اہم ترین اعلیٰ تعلیمی اداروں میں سے ایک ہے۔",
    whyTitle: "{name} میں کیوں پڑھیں؟",
    whyBody:
      "{name} بین الاقوامی سطح پر تسلیم شدہ ڈگریاں، مناسب فیس ({tuitionRange}/سال) اور {langList} زبانوں میں پڑھائے جانے والے پروگرام پیش کرتی ہے۔ یونیورسٹی میں {students} طلبہ ہیں اور {city} کی تعلیمی برادری میں اس کی مضبوط ساکھ ہے۔",
    admTitle: "داخلے کی شرائط",
    admIntlTitle: "بین الاقوامی طلبہ کے لیے",
    docs: [
      "معتبر پاسپورٹ (کم از کم 6 ماہ کی میعاد)",
      "ہائی اسکول ڈپلومہ یا مساوی (اٹیسٹڈ)",
      "ٹرانسکرپٹ",
      "زبان کی سند (IELTS 5.0+ یا مساوی)",
      "محرکاتی خط",
      "پاسپورٹ سائز کی تصاویر",
    ],
    tlTitle: "درخواست کا شیڈول",
    tl: [
      "درخواستیں شروع: یکم مارچ",
      "آخری تاریخ: 15 جولائی",
      "نتائج: یکم تا 15 اگست",
      "سمسٹر کا آغاز: 15 ستمبر",
    ],
    feesTitle: "2026 فیس",
    tbl: ["پروگرام کی سطح", "سالانہ فیس (USD)", "دورانیہ"],
    tblRows: ["بیچلر", "ماسٹر", "پی ایچ ڈی"],
    tblDurations: ["4 سال", "2 سال", "3-4 سال"],
    feesSource: "*ماخذ: {name} سرکاری فیس فہرست 2025-2026*",
    programsTitle: "دستیاب پروگرام",
    programsBody:
      "یونیورسٹی انجینئرنگ، بزنس، طب، ہیومنٹیز اور سوشل سائنسز سمیت متعدد شعبوں میں {langList} زبانوں میں پروگرام پیش کرتی ہے۔",
    scholarshipsTitle: "اسکالرشپ",
    scholarshipsState:
      "سرکاری یونیورسٹی ہونے کے ناطے {name} آذربائیجان گورنمنٹ اسکالرشپ پروگرام میں شامل ہے جو اہل بین الاقوامی طلبہ کو مکمل فیس معافی اور ماہانہ الاؤنس فراہم کرتا ہے۔",
    scholarshipsPrivate:
      "{name} مضبوط تعلیمی ریکارڈ رکھنے والے بین الاقوامی طلبہ کے لیے 25-100% میرٹ پر مبنی اسکالرشپ پیش کرتی ہے۔",
    lifeTitle: "{city} میں طالبِ علم زندگی",
    lifeBaku:
      "{city} جدید انفراسٹرکچر، دولت مند ثقافتی ورثہ اور مناسب زندگی کے اخراجات (ماہانہ $400-600) کے ساتھ آذربائیجان کے زیادہ تر پرجوش دارالحکومتوں میں سے ایک ہے۔",
    lifeOther:
      "{city} بڑھتے طلبہ کمیونٹی اور کم زندگی کے اخراجات (ماہانہ $200-350) کے ساتھ آذربائیجان کے مہمان نواز شہروں میں سے ایک ہے۔",
    howTitle: "درخواست کیسے دیں",
    steps: [
      "یونیورسٹی کی سرکاری ویب سائٹ دیکھیں",
      "اپنا پروگرام منتخب کریں اور زبان کی شرائط چیک کریں",
      "مطلوبہ دستاویزات تیار کر کے جمع کریں",
      "درخواست فیس ادا کریں ({appFee})",
      "داخلہ امتحان میں شرکت کریں (اگر ضروری ہو)",
      "قبولیت کا خط وصول کریں",
      "اسٹوڈنٹ ویزے کی درخواست دیں",
      "آذربائیجان پہنچ کر رجسٹر کریں",
    ],
    faqTitle: "عام سوالات",
    faqs: [
      [
        "{name} میں پروگرام کس زبان میں پڑھائے جاتے ہیں؟",
        "{name} کے پروگرام {langList} زبانوں میں پڑھائے جاتے ہیں۔ بین الاقوامی طلبہ کے لیے انگریزی پروگرام دستیاب ہیں۔",
      ],
      [
        "{name} میں پڑھنے کا خرچ کتنا ہے؟",
        "{name} کی فیس پروگرام کی سطح اور شعبے کے مطابق سالانہ {tuitionRange} تک ہے۔",
      ],
      [
        "کیا {name} میں اسکالرشپ ہے؟",
        "جی ہاں۔ اہل بین الاقوامی طلبہ کے لیے فیس کا 25-100% احاطہ کرنے والی اسکالرشپس موجود ہیں۔",
      ],
    ],
    excerpt:
      "{city}، آذربائیجان میں {name} یونیورسٹی میں تعلیم کا مکمل رہنمائی: داخلے کی شرائط، 2026 فیس، پروگرام، اسکالرشپ اور طالبِ علم زندگی۔",
    metaTitle: "{name} 2026 — فیس، پروگرام اور داخلہ گائیڈ",
    metaDescription:
      "{city} میں {name} میں پڑھیں: 2026 فیس، پروگرام، داخلے کی شرائط اور بین الاقوامی طلبہ کے لیے اسکالرشپ۔",
    category: "یونیورسٹیاں",
  },
  uz: {
    typeState: "davlat",
    typePrivate: "xususiy",
    intro:
      "{name} — Ozarbayjonning {city} shahrida joylashgan, {founded}da tashkil etilgan {type} universitet. Taxminan {students} talaba bilan mintaqadagi asosiy oliy ta'lim muassasalaridan biri.",
    whyTitle: "{name}da nima uchun o'qish kerak?",
    whyBody:
      "{name} xalqaro e'tirof etilgan diplomlar, arzon o'qish to'lovi ({tuitionRange}/yil) va {langList} tillarida o'tiladigan dasturlarni taklif qiladi. Universitetda {students} talaba tahsil oladi va {city} akademik jamoasida kuchli obro'ga ega.",
    admTitle: "Qabul talablari",
    admIntlTitle: "Xalqaro talabalar uchun",
    docs: [
      "Amal qiladigan pasport (kamida 6 oy amal qiladi)",
      "O'rta ta'lim diplomi yoki tengi (apostil bilan)",
      "Transkript",
      "Til sertifikati (IELTS 5.0+ yoki tengi)",
      "Motivatsiya xati",
      "Pasport o'lchamidagi rasmlar",
    ],
    tlTitle: "Ariza taqvimi",
    tl: [
      "Arizalar ochiladi: 1-mart",
      "Oxirgi muddat: 15-iyul",
      "Natijalar: 1-15-avgust",
      "Semestr boshlanishi: 15-sentyabr",
    ],
    feesTitle: "O'qish to'lovi 2026",
    tbl: ["Dastur darajasi", "Yillik to'lov (USD)", "Davomiyligi"],
    tblRows: ["Bakalavr", "Magistratura", "Doktorantura"],
    tblDurations: ["4 yil", "2 yil", "3-4 yil"],
    feesSource: "*Manba: {name} rasmiy to'lov jadvali 2025-2026*",
    programsTitle: "Taklif etiladigan dasturlar",
    programsBody:
      "Universitet muhandislik, biznes, tibbiyot, gumanitar va ijtimoiy fanlar kabi ko'plab fakultetlarda {langList} tillarida dasturlar taklif qiladi.",
    scholarshipsTitle: "Grantlar",
    scholarshipsState:
      "Davlat universiteti sifatida {name} Ozarbayjon hukumati grant dasturida qatnashadi — malakali xalqaro talabalarga to'liq to'lov imtiyozlari va oylik stipendiya beriladi.",
    scholarshipsPrivate:
      "{name} kuchli akademik ko'rsatkichlarga ega xalqaro talabalar uchun 25-100% li merit-grantlar taklif qiladi.",
    lifeTitle: "{city}dagi talabalar hayoti",
    lifeBaku:
      "{city} zamonaviy infratuzilma, boy madaniy meros va arzon turmush xarajatlari (oyiga $400-600) bilan Ozarbayjonning eng jonli poytaxtlaridan biri.",
    lifeOther:
      "{city} o'sib borayotgan talabalar jamoasi va past turmush xarajatlari (oyiga $200-350) bilan Ozarbayjonning eng mehmondo'st shaharlaridan biri.",
    howTitle: "Qanday ariza beriladi",
    steps: [
      "Universitetning rasmiy saytini oching",
      "Dasturingizni tanlang va talablarni tekshiring",
      "Kerakli hujjatlarni tayyorlab topshiring",
      "Ariza to'lovini amalga oshiring ({appFee})",
      "Kirish imtihonida qatnashing (agar kerak bo'lsa)",
      "Qabul xatini oling",
      "Talaba vizasiga ariza bering",
      "Ozarbayjonga kelgach ro'yxatdan o'ting",
    ],
    faqTitle: "Ko'p so'raladigan savollar",
    faqs: [
      [
        "{name}da dasturlar qaysi tilda o'tiladi?",
        "{name} dasturlari {langList} tillarida o'tiladi. Xalqaro talabalar uchun ingliz tilidagi dasturlar bor.",
      ],
      [
        "{name}da o'qish qancha turadi?",
        "{name}da to'lov dastur darajasi va yo'nalishga qarab yiliga {tuitionRange} oralig'ida.",
      ],
      [
        "{name}da grant bormi?",
        "Ha. Malakali xalqaro talabalar uchun to'lovning 25-100% ini qoplaydigan grantlar bor.",
      ],
    ],
    excerpt:
      "{city}, Ozarbayjondagi {name} universitetida o'qish uchun to'liq qo'llanma: qabul talablari, 2026 to'lovlar, dasturlar, grantlar va talabalar hayoti.",
    metaTitle: "{name} 2026 — to'lovlar, dasturlar va qabul qo'llanmasi",
    metaDescription:
      "{city}dagi {name}da o'qish: 2026 to'lovlar, dasturlar, qabul talablari va grantlar.",
    category: "Universitetlar",
  },
  kk: {
    typeState: "мемлекеттік",
    typePrivate: "жеке",
    intro:
      "{name} — Әзірбайжанның {city} қаласында орналасқан, {founded} жылы құрылған {type} университет. Шамамен {students} студенті бар, өңірдегі негізгі жоғары білім орындарының бірі.",
    whyTitle: "{name} неде оқу керек?",
    whyBody:
      "{name} халықаралық деңгейде танылған дипломдар, қолжетімді оқу ақысы ({tuitionRange}/жыл) және {langList} тілдерінде оқытылатын бағдарламалар ұсынады. Университетте {students} студент оқиды, {city} академиялық қауымдастығында күшті беделге ие.",
    admTitle: "Қабылдау талаптары",
    admIntlTitle: "Халықаралық студенттер үшін",
    docs: [
      "Жарамды паспорт (кемінде 6 ай жарамды)",
      "Орта білім туралы аттестат немесе теңдесі (апостильмен)",
      "Транскрипт",
      "Тіл сертификаты (IELTS 5.0+ немесе теңдесі)",
      "Мотивациялық хат",
      "Паспорт өлшемді фотосуреттер",
    ],
    tlTitle: "Өтініш күнтізбесі",
    tl: [
      "Өтініш ашылады: 1 наурыз",
      "Соңғы мерзім: 15 шілде",
      "Нәтижелер: 1-15 тамыз",
      "Семестр басталуы: 15 қыркүйек",
    ],
    feesTitle: "Оқу ақысы 2026",
    tbl: ["Бағдарлама деңгейі", "Жылдық ақы (USD)", "Ұзақтығы"],
    tblRows: ["Бакалавриат", "Магистратура", "Докторантура"],
    tblDurations: ["4 жыл", "2 жыл", "3-4 жыл"],
    feesSource: "*Дереккөз: {name} ресми ақы кестесі 2025-2026*",
    programsTitle: "Ұсынылатын бағдарламалар",
    programsBody:
      "Университет инженерия, бизнес, медицина, гуманитарлық және әлеуметтік ғылымдар секілді көптеген факультеттерде {langList} тілдерінде бағдарламалар ұсынады.",
    scholarshipsTitle: "Гранттар",
    scholarshipsState:
      "Мемлекеттік университет ретінде {name} Әзірбайжан үкіметінің грант бағдарламасына қатысады — білікті халықаралық студенттерге толық ақы шегеруі мен айлық стипендия беріледі.",
    scholarshipsPrivate:
      "{name} күшті академиялық көрсеткіштері бар халықаралық студенттерге 25-100% мерииттік гранттар ұсынады.",
    lifeTitle: "{city} қаласындағы студенттік өмір",
    lifeBaku:
      "{city} заманауи инфрақұрылымы, бай мәдени мұрасы және қолжетімді тұрмыс шығындары (айына $400-600) бар Әзірбайжанның ең қарқынды астаналарының бірі.",
    lifeOther:
      "{city} өсіп келе жатқан студенттік қауымдастығы мен төмен тұрмыс шығындары (айына $200-350) бар Әзірбайжанның ең қонақжай қалаларының бірі.",
    howTitle: "Қалай өтінім беру керек",
    steps: [
      "Университеттің ресми сайтын ашыңыз",
      "Бағдарламаңызды таңдап, тіл талаптарын тексеріңіз",
      "Қажетті құжаттарды дайындап тапсырыңыз",
      "Өтініш ақысын төлеңіз ({appFee})",
      "Кіру емтиханына қатысыңыз (қажет болса)",
      "Қабылдау хатын алыңыз",
      "Студенттік визаға өтініш беріңіз",
      "Әзірбайжанға келгеннен кейін тіркеліңіз",
    ],
    faqTitle: "Жиі қойылатын сұрақтар",
    faqs: [
      [
        "{name} бағдарламалары қандай тілде оқытылады?",
        "{name} бағдарламалары {langList} тілдерінде оқытылады. Халықаралық студенттерге ағылшын тіліндегі бағдарламалар бар.",
      ],
      [
        "{name} оқу қанша тұрады?",
        "{name} оқу ақысы бағдарлама деңгейі мен саласына қарай жылына {tuitionRange} аралығында.",
      ],
      [
        "{name} грант бар ма?",
        "Иә. Білікті халықаралық студенттерге ақының 25-100%-ын қамтитын гранттар бар.",
      ],
    ],
    excerpt:
      "Әзірбайжанның {city} қаласындағы {name} университетінде оқу бойынша толық нұсқаулық: қабылдау талаптары, 2026 ақылары, бағдарламалар, гранттар және студенттік өмір.",
    metaTitle: "{name} 2026 — ақылар, бағдарламалар және қабылдау",
    metaDescription:
      "{city} қаласындағы {name} оқыңыз: 2026 оқу ақысы, бағдарламалар, қабылдау талаптары мен гранттар.",
    category: "Университеттер",
  },
  ky: {
    typeState: "мамлекеттик",
    typePrivate: "жеке",
    intro:
      "{name} — Азербайжандын {city} шаарында жайгашкан, {founded}-жылы негизделген {type} университет. Тактап {students} студент менен региондогу негизги жогорку билим берүү мекемелеринин бири.",
    whyTitle: "{name} эмне үчүн окуу керек?",
    whyBody:
      "{name} эл аралык деңгээлде таанылган дипломдорду, арзан окуу акысын ({tuitionRange}/жыл) жана {langList} тилдеринде окутулган программаларды сунуштайт. Университетте {students} студент окуйт, {city} академиялык коомчулугунда күчтүү абройго ээ.",
    admTitle: "Кабыл алуу талаптары",
    admIntlTitle: "Эл аралык студенттер үчүн",
    docs: [
      "Жарактуу паспорт (кеминде 6 ай жарактуу)",
      "Орто билим diplому же теңдеги (апостиль менен)",
      "Транскрипт",
      "Тил сертификаты (IELTS 5.0+ же теңдеги)",
      "Мотивациялык кат",
      "Паспорт өлчөмүндөгү сүрөттөр",
    ],
    tlTitle: "Арыз жылнаамасы",
    tl: [
      "Арыз ачылат: 1-март",
      "Акыркы мөөнөт: 15-июль",
      "Натыйжалар: 1-15-август",
      "Семестр башталышы: 15-сентябрь",
    ],
    feesTitle: "Окуу акысы 2026",
    tbl: ["Программа деңгээли", "Жылдык акы (USD)", "Узактыгы"],
    tblRows: ["Бакалавриат", "Магистратура", "Докторантура"],
    tblDurations: ["4 жыл", "2 жыл", "3-4 жыл"],
    feesSource: "*Булак: {name} расмий акы кестеси 2025-2026*",
    programsTitle: "Сунушталган программалар",
    programsBody:
      "Университет инженерия, бизнес, медицина, гуманитардык жана коомдук илимдер сыяктуу көп факультеттерде {langList} тилдеринде программалар сунуштайт.",
    scholarshipsTitle: "Гранттар",
    scholarshipsState:
      "Мамлекеттик университет катары {name} Азербайжан өкмөтүнүн грант программасына катышат — жөндөөлүү эл аралык студенттерге толук акыдан бошотуу жана айлык стипендия берилет.",
    scholarshipsPrivate:
      "{name} күчтүү академиялык көрсөткүчтөрү бар эл аралык студенттерге 25-100% мериит гранттарын сунуштайт.",
    lifeTitle: "{city} шаарындагы студенттик жашоо",
    lifeBaku:
      "{city} заманбап инфраструктурасы, бай маданий мурасы жана арзан жашоо чыгашалары (айына $400-600) менен Азербайжандын эң жандуу борборлорунун бири.",
    lifeOther:
      "{city} өсүп жаткан студенттик коомчулугу жана төмөн жашоо чыгашалары (айына $200-350) менен Азербайжандын эң коноктордуу шаарларынын бири.",
    howTitle: "Кантип арыз берүү керек",
    steps: [
      "Университеттин расмий сайтын ачыңыз",
      "Программаңызды тандап, тил талаптарын текшериңиз",
      "Керектүү документтерди даярдап тапшырыңыз",
      "Арыз акысын төлөңүз ({appFee})",
      "Кирүү экзаменине катышыңыз (зарыл болсо)",
      "Кабыл алуу каттын алыңыз",
      "Студенттик визага арыз бериңиз",
      "Азербайжанга келгенден кийин катталыңыз",
    ],
    faqTitle: "Көп берилүүчү суроолор",
    faqs: [
      [
        "{name} программалары кайсы тилде окутулат?",
        "{name} программалары {langList} тилдеринде окутулат. Эл аралык студенттер үчүн англис тилиндеги программалар бар.",
      ],
      [
        "{name} окуу канча турат?",
        "{name} окуу акысы программанын деңгээлине жана багытына жараша жылына {tuitionRange} аралыгында.",
      ],
      [
        "{name} грант барбы?",
        "Ооба. Жөндөөлүү эл аралык студенттер үчүн акынын 25-100% жаап турган гранттар бар.",
      ],
    ],
    excerpt:
      "Азербайжандын {city} шаарындагы {name} университетинде окуу боюнча толук колдонмо: кабыл алуу талаптары, 2026 акылар, программалар, гранттар жана студенттик жашоо.",
    metaTitle: "{name} 2026 — акылар, программалар жана кабыл алуу",
    metaDescription:
      "{city} шаарындагы {name} окуңуз: 2026 окуу акысы, программалар, кабыл алуу талаптары жана гранттар.",
    category: "Университеттер",
  },
  tk: {
    typeState: "döwlet",
    typePrivate: "hususy",
    intro:
      "{name} — Azerbaýjanyň {city} şäherinde ýerleşýän, {founded} ýylda esaslandyrylan {type} uniwersitet. Takmynan {students} talyp bilen sebitdäki esasy ýokary okuw edaralarynyň biri.",
    whyTitle: "{name} näme üçin okamaly?",
    whyBody:
      "{name} halkara derejede ykrar edilen diplomlary, arzan okuw tölegi ({tuitionRange}/ýyl) we {langList} dillerinde okadylýan programmalary hödürleýär. Uniwersitetde {students} talyp okap, {city} akademik jemgyýetinde güýçli abraýa eýe.",
    admTitle: "Kabul talaplary",
    admIntlTitle: "Halkara talyplar üçin",
    docs: [
      "Hukukly pasport (iň azy 6 aý hukukly)",
      "Orta bilim diplomy ýa-da deňi (apostil bilen)",
      "Transkript",
      "Dil sertifikaty (IELTS 5.0+ ýa-da deňi)",
      "Motiwasiýa hat",
      "Pasport ölçegli suratlar",
    ],
    tlTitle: "Arz mejlisi",
    tl: [
      "Arzlar açylýar: 1-nji mart",
      "Soňky möhlet: 15-nji iýul",
      "Netijeler: 1-15-nji awgust",
      "Semestriň başy: 15-nji sentýabr",
    ],
    feesTitle: "Okuw tölegi 2026",
    tbl: ["Programma derejesi", "Ýyllyk töleg (USD)", "Dowamlylygy"],
    tblRows: ["Bakalawr", "Magistratura", "Doktorantura"],
    tblDurations: ["4 ýyl", "2 ýyl", "3-4 ýyl"],
    feesSource: "*Gözleg çeşmesi: {name} resmi töleg sanawy 2025-2026*",
    programsTitle: "Hödürlenýän programmalar",
    programsBody:
      "Uniwersitet inženerçilik, biznes, lukmançylyk, gumanitar we jemgyýetçilik ylymlary ýaly köp fakultetlerde {langList} dillerinde programmalar hödürleýär.",
    scholarshipsTitle: "Grantlar",
    scholarshipsState:
      "Döwlet uniwersiteti hökmünde {name} Azerbaýjan hökümetiniň grant programmasyna gatnaşýar — hünärli halkara talyplara doly töleg-iňgal we aýlyk stipendiýa berilýär.",
    scholarshipsPrivate:
      "{name} güýçli akademik görkezijileri bolan halkara talyplara 25-100% haýyşly grantlary hödürleýär.",
    lifeTitle: "{city} şäherindäki talyplar durmuşy",
    lifeBaku:
      "{city} zamanybap infrastrukturasy, baý medeni mirasy we arzan ýaşaýyş çykdaýjylary (aýda $400-600) bilen Azerbaýjanyň iň janly paýtagtlarynyň biri.",
    lifeOther:
      "{city} ösýän talyplar jemgyýeti we pes ýaşaýyş çykdaýjylary (aýda $200-350) bilen Azerbaýjanyň iň myhmansöýer şäherleriniň biri.",
    howTitle: "Nähili arz berilýär",
    steps: [
      "Uniwersitetiň resmi saýtyny açyň",
      "Programmaňyzy saýlaň we dil talaplaryny barlaň",
      "Gerekli resminamalary taýýarlap beriň",
      "Arz tölegini töläň ({appFee})",
      "Giriş synagyna gatnaşyň (eger gerek bolsa)",
      "Kabul hatyny alyň",
      "Talyplar wizasyna arz beriň",
      "Azerbaýjana gelenden soň ýazyl",
    ],
    faqTitle: "Köp soralýan sowallar",
    faqs: [
      [
        "{name} programmalary haýsy dilde okadylýar?",
        "{name} programmalary {langList} dillerinde okadylýar. Halkara talyplar üçin iňlis dilindäki programmalar bar.",
      ],
      [
        "{name} okuw näçe durýar?",
        "{name} tölegi programma derejesine we ugryna görä ýylda {tuitionRange} aralygynda.",
      ],
      [
        "{name} grant barmy?",
        "Hawa. Hünärli halkara talyplara tölegiň 25-100%-ini örtýän grantlar bar.",
      ],
    ],
    excerpt:
      "Azerbaýjanyň {city} şäherindäki {name} uniwersitetinde okamak barada doly gollanma: kabul talaplary, 2026 tölegler, programmalar, grantlar we talyplar durmuşy.",
    metaTitle: "{name} 2026 — tölegler, programmalar we kabul gollanmasy",
    metaDescription:
      "{city} şäherindäki {name} okuň: 2026 tölegler, programmalar, kabul talaplary we grantlar.",
    category: "Uniwersitetler",
  },
  bg: {
    typeState: "държавен",
    typePrivate: "частен",
    intro:
      "{name} е {type} университет в град {city}, Азербайджан, основан през {founded} г. С около {students} студенти той е една от ключовите институции за висше образование в региона.",
    whyTitle: "Защо да учите в {name}?",
    whyBody:
      "{name} предлага международно признати дипломи, достъпни такси ({tuitionRange}/година) и програми, преподавани на {langList}. Университетът има {students} студенти и силен авторитет в академичната общност на {city}.",
    admTitle: "Изисквания за прием",
    admIntlTitle: "За международни студенти",
    docs: [
      "Валиден паспорт (минимум 6 месеца валидност)",
      "Диплома за средно образование или еквивалент (с апостил)",
      "Извлечение на оценките",
      "Сертификат за език (IELTS 5.0+ или еквивалент)",
      "Мотивационно писмо",
      "Снимки паспортен формат",
    ],
    tlTitle: "Календар за кандидатстване",
    tl: [
      "Кандидатстване отваря: 1 март",
      "Краен срок: 15 юли",
      "Резултати: 1–15 август",
      "Начало на семестъра: 15 септември",
    ],
    feesTitle: "Такси за обучение 2026",
    tbl: ["Ниво на програмата", "Годишна такса (USD)", "Продължителност"],
    tblRows: ["Бакалавриат", "Магистратура", "Докторантура"],
    tblDurations: ["4 години", "2 години", "3–4 години"],
    feesSource: "*Източник: официалната тарифа на {name} 2025–2026*",
    programsTitle: "Предлагани програми",
    programsBody:
      "Университетът предлага програми на {langList} в многобройни факултети, включително инженерство, бизнес, медицина, хуманитарни и социални науки.",
    scholarshipsTitle: "Стипендии",
    scholarshipsState:
      "Като държавен университет {name} участва в стипендиалната програма на правителството на Азербайджан, предлагаща пълно освобождаване от такси и месечни стипендии за квалифицирани международни студенти.",
    scholarshipsPrivate:
      "{name} предлага стипендии за постижения от 25–100% за международни студенти със силен академичен профил.",
    lifeTitle: "Студентски живот в {city}",
    lifeBaku:
      "{city} е една от най-динамичните столици на Азербайджан с модерна инфраструктура, богато културно наследство и достъпни разходи за живот ($400–600/месец).",
    lifeOther:
      "{city} е един от най-гостоприемните градове на Азербайджан с нарастваща студентска общност и ниски разходи за живот ($200–350/месец).",
    howTitle: "Как да кандидатствате",
    steps: [
      "Посетете официалния сайт на университета",
      "Изберете програма и проверете езиковите изисквания",
      "Подгответе и подайте необходимите документи",
      "Платете таксата за кандидатстване ({appFee})",
      "Явете се на вступителен изпит (ако е необходим)",
      "Получете писмото за прием",
      "Кандидатствайте за студентска виза",
      "Регистрирайте се след пристигането в Азербайджан",
    ],
    faqTitle: "Често задавани въпроси",
    faqs: [
      [
        "На какви езици се преподават програмите в {name}?",
        "Програмите в {name} се преподават на {langList}. За международни студенти има програми на английски.",
      ],
      [
        "Колко струва обучението в {name}?",
        "Таксите в {name} варират от {tuitionRange} годишно в зависимост от нивото и направлениято на програмата.",
      ],
      [
        "Има ли стипендии в {name}?",
        "Да. За квалифицирани международни студенти има стипендии, покриващи 25–100% от таксите.",
      ],
    ],
    excerpt:
      "Пълен наръчник за обучение в {name} в {city}, Азербайджан: изисквания, такси 2026, програми, стипендии и студентски живот.",
    metaTitle: "{name} 2026 — Такси, програми и прием",
    metaDescription:
      "Учете в {name} в {city}: такси за обучение 2026, програми, изисквания и стипендии за международни студенти.",
    category: "Университети",
  },
  id: {
    typeState: "negeri",
    typePrivate: "swasta",
    intro:
      "{name} adalah universitas {type} yang terletak di {city}, Azerbaijan, didirikan pada {founded}. Dengan sekitar {students} mahasiswa, ini adalah salah satu institusi pendidikan tinggi utama di kawasan ini.",
    whyTitle: "Mengapa Kuliah di {name}?",
    whyBody:
      "{name} menawarkan gelar yang diakui secara internasional, biaya kuliah terjangkau ({tuitionRange}/tahun), dan program yang diajarkan dalam bahasa {langList}. Universitas ini memiliki {students} mahasiswa dan reputasi kuat di komunitas akademik {city}.",
    admTitle: "Persyaratan Pendaftaran",
    admIntlTitle: "Untuk Mahasiswa Internasional",
    docs: [
      "Paspor yang masih berlaku (minimal 6 bulan)",
      "Ijazah SMA atau setara (dilegalisasi apostil)",
      "Transkrip nilai",
      "Sertifikat kemampuan bahasa (IELTS 5.0+ atau setara)",
      "Surat motivasi",
      "Foto ukuran paspor",
    ],
    tlTitle: "Jadwal Pendaftaran",
    tl: [
      "Pendaftaran dibuka: 1 Maret",
      "Batas akhir: 15 Juli",
      "Hasil: 1–15 Agustus",
      "Semester dimulai: 15 September",
    ],
    feesTitle: "Biaya Kuliah 2026",
    tbl: ["Jenjang", "Biaya Tahunan (USD)", "Durasi"],
    tblRows: ["Sarjana", "Magister", "Doktoral"],
    tblDurations: ["4 tahun", "2 tahun", "3-4 tahun"],
    feesSource: "*Sumber: daftar biaya resmi {name} 2025-2026*",
    programsTitle: "Program yang Tersedia",
    programsBody:
      "Universitas menawarkan program dalam bahasa {langList} di berbagai fakultas termasuk teknik, bisnis, kedokteran, humaniora, dan ilmu sosial.",
    scholarshipsTitle: "Beasiswa",
    scholarshipsState:
      "Sebagai universitas negeri, {name} berpartisipasi dalam program Beasiswa Pemerintah Azerbaijan yang menawarkan pembebasan biaya penuh dan tunjangan bulanan bagi mahasiswa internasional yang memenuhi syarat.",
    scholarshipsPrivate:
      "{name} menawarkan beasiswa berprestasi sebesar 25-100% bagi mahasiswa internasional dengan rekam akademik kuat.",
    lifeTitle: "Kehidupan Mahasiswa di {city}",
    lifeBaku:
      "{city} adalah salah satu ibu kota paling dinamis di Azerbaijan dengan infrastruktur modern, warisan budaya kaya, dan biaya hidup terjangkau ($400-600/bulan).",
    lifeOther:
      "{city} adalah salah satu kota paling ramah di Azerbaijan dengan komunitas mahasiswa yang terus berkembang dan biaya hidup rendah ($200-350/bulan).",
    howTitle: "Cara Mendaftar",
    steps: [
      "Kunjungi situs resmi universitas",
      "Pilih program Anda dan periksa persyaratan bahasa",
      "Siapkan dan ajukan dokumen yang diperlukan",
      "Bayar biaya pendaftaran ({appFee})",
      "Ikuti ujian masuk (jika diperlukan)",
      "Terima surat penerimaan",
      "Ajukan visa pelajar",
      "Daftar ulang setelah tiba di Azerbaijan",
    ],
    faqTitle: "Pertanyaan Umum",
    faqs: [
      [
        "Dalam bahasa apa program di {name} diajarkan?",
        "Program di {name} diajarkan dalam bahasa {langList}. Program berbahasa Inggris tersedia untuk mahasiswa internasional.",
      ],
      [
        "Berapa biaya kuliah di {name}?",
        "Biaya kuliah di {name} berkisar {tuitionRange} per tahun tergantung jenjang dan bidang program.",
      ],
      [
        "Apakah ada beasiswa di {name}?",
        "Ya. Tersedia beasiswa yang mencakup 25-100% biaya kuliah bagi mahasiswa internasional yang memenuhi syarat.",
      ],
    ],
    excerpt:
      "Panduan lengkap kuliah di {name} di {city}, Azerbaijan: persyaratan pendaftaran, biaya kuliah 2026, program, beasiswa, dan kehidupan mahasiswa.",
    metaTitle: "{name} 2026 — Biaya, Program & Panduan Pendaftaran",
    metaDescription:
      "Kuliah di {name} di {city}: biaya kuliah 2026, program, persyaratan pendaftaran, dan beasiswa.",
    category: "Universitas",
  },
  sw: {
    typeState: "ya umma",
    typePrivate: "binafsi",
    intro:
      "{name} ni chuo {type} kilichoko {city}, Azerbaijan, kilichoanzishwa mwaka {founded}. Kwa takriban wanafunzi {students}, ni moja ya taasisi kuu za elimu ya juu katika eneo hilo.",
    whyTitle: "Kwa Nini Kusoma katika {name}?",
    whyBody:
      "{name} hutoa shahada zinazotambulika kimataifa, ada nafuu ({tuitionRange}/mwaka), na programu zinazofundishwa kwa lugha za {langList}. Chuo kina wanafunzi {students} na umaarufu mkubwa katika jamii ya kielimu ya {city}.",
    admTitle: "Masharti ya Kujiandikisha",
    admIntlTitle: "Kwa Wanafunzi wa Kimataifa",
    docs: [
      "Pasipoti halali (angalau miezi 6)",
      "Cheti cha sekondari au sawa nacho (kiwe na apostile)",
      "Cheti cha matokeo (transkripti)",
      "Cheti cha lugha (IELTS 5.0+ au sawa)",
      "Barua ya motisha",
      "Picha za ukubwa wa pasipoti",
    ],
    tlTitle: "Ratiba ya Maombi",
    tl: [
      "Maombi yanafunguliwa: Machi 1",
      "Mwishu: Julai 15",
      "Matokeo: Agosti 1-15",
      "Semesta huanza: Septemba 15",
    ],
    feesTitle: "Ada za Masomo 2026",
    tbl: ["Kiwango cha Programu", "Ada ya Mwaka (USD)", "Muda"],
    tblRows: ["Shahada ya kwanza", "Shahada ya uzamili", "Ndaktari"],
    tblDurations: ["Miaka 4", "Miaka 2", "Miaka 3-4"],
    feesSource: "*Chanzo: orodha rasmi ya ada ya {name} 2025-2026*",
    programsTitle: "Programu Zilizopo",
    programsBody:
      "Chuo hutoa programu kwa lugha za {langList} katika idara nyingi ikiwa ni pamoja na uhandisi, biashara, tiba, masomo ya kijamii na jamii.",
    scholarshipsTitle: "Ufadhili",
    scholarshipsState:
      "Kama chuo cha umma, {name} hushiriki katika mpango wa Ufadhili wa Serikali ya Azerbaijan unaotoa kusamehewa ada kamili na posa ya kila mwezi kwa wanafunzi wa kimataifa wanaostahili.",
    scholarshipsPrivate:
      "{name} hutoa ufadhili wa wanafunzi bora kwa asilimia 25-100% kwa wanafunzi wa kimataifa wenye rekodi bora za masomo.",
    lifeTitle: "Maisha ya Wanafunzi {city}",
    lifeBaku:
      "{city} ni miongoni mwa miji mikuu inayovuma zaidi ya Azerbaijan yenye miundombinu ya kisasa, urithi tajiri wa kitamaduni na gharama nafuu za maisha ($400-600/mwezi).",
    lifeOther:
      "{city} ni miongoni mwa miji ya kirafiki zaidi ya Azerbaijan yenye jumuiya ya wanafunzi inayokua na gharama ndogo ya maisha ($200-350/mwezi).",
    howTitle: "Jinsi ya Kutuma Maombi",
    steps: [
      "Tembelea tovuti rasmi ya chuo",
      "Chagua programu yako na angalia mahitaji ya lugha",
      "Andaa na wasilisha hati zinazohitajika",
      "Lipa ada ya maombi ({appFee})",
      "Hudhuria mtihani wa kujiandikisha (kama inahitajika)",
      "Pokea barua ya kukubaliwa",
      "Omba visa ya mwanafunzi",
      "Jisajili ukifika Azerbaijan",
    ],
    faqTitle: "Maswali Yanayoulizwa Mara Kwa Mara",
    faqs: [
      [
        "Programu za {name} hufundishwa kwa lugha gani?",
        "Programu za {name} hufundishwa kwa lugha za {langList}. Kuna programu kwa Kiingereza kwa wanafunzi wa kimataifa.",
      ],
      [
        "Ni gharama gani kusoma {name}?",
        "Ada ya {name} huanzia {tuitionRange} kwa mwaka kulingana na kiwango na fani ya programu.",
      ],
      [
        "Kuna ufadhili {name}?",
        "Ndiyo. Kuna ufadhili unaofunika asilimia 25-100% ya ada kwa wanafunzi wa kimataifa wanaostahili.",
      ],
    ],
    excerpt:
      "Mwongozo kamili wa kusoma katika {name} ilioko {city}, Azerbaijan: masharti ya kujiandikisha, ada 2026, programu, ufadhili na maisha ya wanafunzi.",
    metaTitle: "{name} 2026 — Ada, Programu na Mwongozo wa Kujiandikisha",
    metaDescription:
      "Soma katika {name} ilioko {city}: ada za masomo 2026, programu, masharti ya kujiandikisha na ufadhili.",
    category: "Vyuo",
  },
  so: {
    typeState: "dawladadeed",
    typePrivate: "gaar ah",
    intro:
      "{name} waa jaamacad {type} oo ku taal {city}, Azerbaijan, oo la aasaasay {founded}. Qiyaastii {students} arday, waxay ka mid tahay machadyada ugu muhiimsan ee waxbarashada sare ee gobolka.",
    whyTitle: "Maxaad {name} ku bartaan?",
    whyBody:
      "{name} waxay bixisaa darajooyin adduunka laga yaqaan, kharash lacag jaban ({tuitionRange}/sannad), iyo barnaamijyo luuqadaha {langList} lagu barto. Jaamacaddu waxay leedahay {students} arday waxayna leedahay magac wanaagsan oo bulshada waxbarashada {city}.",
    admTitle: "Shuruudaha Gelitaanka",
    admIntlTitle: "Ardayda Caalamiga ah",
    docs: [
      "Baasaboort sax ah (ugu yaraan 6 bilood)",
      "Diploma dugsi sare ama wax la mid ah (apostille leh)",
      "Dukumiintii dhammaan barashada",
      "Shahaadada luuqadda (IELTS 5.0+ ama wax la mid ah)",
      "Warqadda himilaha",
      "Sawirro baasaboort",
    ],
    tlTitle: "Jadwalka Codsiga",
    tl: [
      "Codsigu furma: Maarso 1",
      "Waqtigii ugu dambeeyay: Luulyo 15",
      "Natiijooyinka: Agoosto 1-15",
      "Semestarka bilaabmaa: Sebtembar 15",
    ],
    feesTitle: "Kharashka Waxbarashada 2026",
    tbl: ["Heerka Barnaamijka", "Kharashka Sannadka (USD)", "Muddada"],
    tblRows: ["Bachelor", "Master", "Doktor"],
    tblDurations: ["4 sannad", "2 sannad", "3-4 sannad"],
    feesSource: "*Isha: liiska rasmiga ah ee kharashka {name} 2025-2026*",
    programsTitle: "Barnaamijyada La Bixiyo",
    programsBody:
      "Jaamacaddu waxay bixisaa barnaamijyo luuqadaha {langList} faakulati badan oo ay ku jiraan injineerninka, ganacsiga, caafimaadka, culuumta bulshada iyo taariikhda.",
    scholarshipsTitle: "Deeqaha",
    scholarshipsState:
      "Sidii jaamacad dawladadeed, {name} waxay ka qaybgashay barnaamijka Deeqda Dowladda Azerbaijan oo bixiya dhimis kharash buuxa iyo lacag bil kasta ardayda caalamiga ah ee mutaysan.",
    scholarshipsPrivate:
      "{name} waxay bixisaa deeqo aqbal 25-100% ardayda caalamiga ah ee leh taariikh waxbarasho oo wanaagsan.",
    lifeTitle: "Nolosha Ardayda {city}",
    lifeBaku:
      "{city} waa mid ka mid ah magaalooyinka ugu firfircoon Azerbaijan oo leh Daarul-muuqaal casri ah, dhaqan aad u badan iyo kharash nololeed oo qaalisan ($400-600/bil).",
    lifeOther:
      "{city} waa mid ka mid ah magaalooyinka ugu soo dhaweyn Azerbaijan oo leh bulsho arday oo koraysa iyo kharash nololeed oo hooseeya ($200-350/bil).",
    howTitle: "Sida Loo Codso",
    steps: [
      "Booqo bogga rasmiga ah ee jaamacadda",
      "Dooro barnaamijkaaga oo hubi shuruudaha luuqadda",
      "Diyaari oo gudbi dukumiintiyada loo baahan yahay",
      "Bixi kharashka codsiga ({appFee})",
      "Ka qayb qaado imtixanka gelitaanka (haddii loo baahdo)",
      "Hel warqadda aqballa",
      "U codso fiiska ardayga",
      "Is diyaari marka aad Azerbaijan timaado",
    ],
    faqTitle: "Su'aalaha La Weydiin Badan",
    faqs: [
      [
        "Luqadda ay barnaamijyada {name} lagu barto waa maxay?",
        "Barnaamijyada {name} waxaa lagu bartaa luuqadaha {langList}. Waxaa jira barnaamijyo Ingiriisi ardayda caalamiga ah.",
      ],
      [
        "Immisa ayay tahay waxbarashada {name}?",
        "Kharashka {name} waa laga bilaabo {tuitionRange} sannadkii iyadoo ku xiran heerka iyo qaybta barnaamijka.",
      ],
      [
        "Ma jiraan deeqo {name}?",
        "Haa. Waxaa jira deeqo daboolaya 25-100% ee kharashka ardayda caalamiga ah ee mutaysan.",
      ],
    ],
    excerpt:
      "Hagis buuxa oo ku saabsan waxbarashada {name} ku taal {city}, Azerbaijan: shuruudaha gelitaanka, kharashka 2026, barnaamijyada, deeqaha iyo nolosha ardayda.",
    metaTitle: "{name} 2026 — Kharash, Barnaamij & Hagis Gelitaan",
    metaDescription:
      "Ku bar {name} ku taal {city}: kharashka waxbarashada 2026, barnaamijyo, shuruudaha gelitaanka iyo deeqo.",
    category: "Jaamacado",
  },
};

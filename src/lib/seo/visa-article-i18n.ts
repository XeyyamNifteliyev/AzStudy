/**
 * AEO/i18n: localized template strings for the per-country student-visa
 * article generator (src/lib/seo/visa-articles.ts). Every string supports
 * {country} — replaced with the localized country name (e.g. "Pakistan",
 * "Пакистан", "باكستان"). Keeping the copy here lets all 15 visa articles ×
 * 18 locales render fully translated long-form content.
 *
 * Facts are deliberately data-safe and universal (state-market estimates the
 * site already publishes): embassy processing ~4–6 weeks, e-visa ~3 business
 * days, visa fee $25–50, entry within 90 days, migration registration in 30
 * days, residence permit in 60 days.
 */

export interface VisaArticleTemplate {
  /** Page title — includes {country}. */
  title: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  category: string;
  /**
   * Markdown paragraphs of the article body. Items are joined with a blank
   * line; an item may itself contain newlines (lists, tables).
   */
  content: string[];
  /** Three FAQ pairs — {country} is interpolated. */
  faqs: Array<[string, string]>;
}

export const VISA_ARTICLE_TEMPLATES: Record<string, VisaArticleTemplate> = {
  en: {
    title:
      "Azerbaijan Student Visa for Students from {country} 2026: Complete Guide",
    excerpt:
      "Step-by-step guide for students from {country}: how to get an Azerbaijan student visa (Type D) — documents, fees, processing time and arrival checklist.",
    metaTitle: "Azerbaijan Student Visa from {country} 2026 — Complete Guide",
    metaDescription:
      "How students from {country} get an Azerbaijan student visa: requirements, documents, $25–50 fee, 4–6 weeks processing and what to do after arrival.",
    category: "Visa Guide",
    content: [
      `Planning to study in Azerbaijan from {country}? This guide covers the complete student visa (Type D) process — from your university acceptance letter to registering in Azerbaijan after arrival.`,
      `## Quick Facts

| Detail | Info |
|--------|------|
| Visa type | Student visa (Type D) |
| Processing time | 4–6 weeks (e-visa: ~3 business days) |
| Fee | $25–50 |
| Duration | Up to 1 year, renewable |
| Entry window | Within 90 days of issuance |
| Registration | With State Migration Service within 30 days of arrival |`,
      `## Student Visa Process Step by Step

The first step for every student from {country} is an official acceptance letter from an accredited Azerbaijani university. You apply for the visa only after you hold this letter, because it is the core document of the application.`,
      `### 1. Required Documents

1. **Passport** — valid at least 6 months beyond your planned stay
2. **University acceptance letter** from an accredited Azerbaijani university
3. **Bank statement** proving funds for tuition and living costs
4. **Medical certificate** and basic health insurance
5. **Passport photos** (3.5 × 4.5 cm) and the completed application form`,
      `### 2. Apply for the Visa

- **E-visa** — evisa.gov.az: processed in about 3 business days, $20–50, suitable for shorter stays
- **Embassy / consulate** — nearest Azerbaijani embassy: 4–6 weeks, $25–50; this is the route used for full student (Type D) visas

Submit your documents 2–3 months before the semester starts so there is enough time for processing and travel planning.`,
      `### 3. Travel to Azerbaijan

- Enter the country within 90 days of the visa being issued
- Register with the State Migration Service within 30 days of arrival
- Apply for a temporary residence permit within 60 days if your course lasts more than one semester`,
      `## Cost Breakdown

| Item | Cost |
|------|------|
| Visa fee | $25–50 |
| Health insurance | $100–200 |
| Document translation and legalisation | $20–50 |
| **Approximate total** | **$150–330** |`,
      `## Tips for Students from {country}

1. Start the visa process 2–3 months before your course begins
2. Keep at least $500 per month available in your bank account as proof of funds
3. Keep copies of every document — digital and printed
4. Buy health insurance that covers your entire stay in Azerbaijan`,
      `## After You Arrive in Azerbaijan

1. Register with the State Migration Service (within 30 days)
2. Get a temporary residence permit (within 60 days)
3. Open a bank account and get a local SIM card
4. Register at your university and receive your student ID
5. Confirm your accommodation address with the migration service`,
    ],
    faqs: [
      [
        "How long does it take to get an Azerbaijan student visa from {country}?",
        "Applying through the embassy takes about 4–6 weeks. The e-visa route is faster — usually around 3 business days.",
      ],
      [
        "Can students from {country} work while studying in Azerbaijan?",
        "Yes — with a work permit. International students may work up to 20 hours per week during term time.",
      ],
      [
        "Do students from {country} need to speak Azerbaijani to get a visa?",
        "No. Many Azerbaijani universities teach in English, Russian and Turkish, so the visa process does not require Azerbaijani language skills.",
      ],
    ],
  },
  az: {
    title:
      "{country} tələbələri üçün Azərbaycan təhsil vizası 2026: Tam Bələdçi",
    excerpt:
      "{country} tələbələri üçün addım-addım bələdçi: Azərbaycan təhsil vizası (D tipli) — sənədlər, rüsumlar, emal müddəti və gəliş yoxlama siyahısı.",
    metaTitle: "{country} tələbələri üçün Azərbaycan təhsil vizası 2026",
    metaDescription:
      "{country} tələbələri Azərbaycan təhsil vizasını necə alır: tələblər, sənədlər, 25–50 ABŞ dolları rüsum, 4–6 həftə emal və gəlişdən sonra görüləcək işlər.",
    category: "Viza Bələdçisi",
    content: [
      `{country} tələbəsi olaraq Azərbaycanda təhsil almağı planlayırsınız? Bu bələdçi tam təhsil vizası (D tipli) prosesini əhatə edir — universitetdən qəbul məktubundan tutmuş Azərbaycana gəlişdən sonra qeydiyyata qədər.`,
      `## Qısa Məlumat

| Detal | Məlumat |
|-------|---------|
| Viza növü | Təhsil vizası (D tipli) |
| Emal müddəti | 4–6 həftə (e-viza: ~3 iş günü) |
| Rüsum | 25–50 ABŞ dolları |
| Müddət | 1 ilədək, yenilənə bilər |
| Giriş pəncərəsi | Verildikdən sonra 90 gün ərzində |
| Qeydiyyat | Gəlişdən sonra 30 gün ərzində Dövlət Miqrasiya Xidmətində |`,
      `## Təhsil Vizası Prosesi Addım-addım

{country} tələbələri üçün ilk addım akkreditə olunmuş Azərbaycan universitetindən rəsmi qəbul məktubudur. Vizaya yalnız bu məktubu aldıqdan sonra müraciət edirsiniz, çünki o, ərizənin əsas sənədidir.`,
      `### 1. Tələb olunan sənədlər

1. **Pasport** — planlaşdırılan qalma müddətindən ən azı 6 ay artıq etibarlı
2. **Universitetdən qəbul məktubu** — akkreditə olunmuş Azərbaycan universitetindən
3. **Bank çıxarışı** — təhsil və yaşayış xərclərini təsdiq edən
4. **Tibbi arayış** və əsas sağlamlıq sığortası
5. **Şəkil** (3.5 × 4.5 sm) və doldurulmuş ərizə forması`,
      `### 2. Vizaya müraciət

- **E-viza** — evisa.gov.az: təxminən 3 iş gününə hazır olur, 20–50 ABŞ dolları, qısa qalmalar üçün uyğundur
- **Səfirlik / konsulluq** — ən yaxın Azərbaycan səfirliyi: 4–6 həftə, 25–50 ABŞ dolları; tam təhsil (D tipli) vizası üçün bu yol istifadə olunur

Sənədləri semestrin başlamasına 2–3 ay qalmış təqdim edin ki, emal və səyahət planlaması üçün kifayət qədər vaxt olsun.`,
      `### 3. Azərbaycana səyahət

- Vizənin verildiyi tarixdən 90 gün ərzində ölkəyə daxil olun
- Gəlişdən sonra 30 gün ərzində Dövlət Miqrasiya Xidmətində qeydiyyatdan keçin
- Təhsiliniz bir semestrdən çox davam edərsə, 60 gün ərzində müvəqqəti yaşayış icazəsi üçün müraciət edin`,
      `## Xərc bölgüsü

| Maddə | Qiymət |
|-------|--------|
| Viza rüsumu | 25–50 ABŞ dolları |
| Sağlamlıq sığortası | 100–200 ABŞ dolları |
| Sənədlərin tərcüməsi və leqallaşdırılması | 20–50 ABŞ dolları |
| **Təxmini cəmi** | **150–330 ABŞ dolları** |`,
      `## {country} tələbələri üçün məsləhətlər

1. Viza prosesinə kurs başlamazdan 2–3 ay əvvəl başlayın
2. Bank hesabınızda ayda ən azı 500 ABŞ dolları məbləğində vəsait saxlayın
3. Hər sənədin surətini — elektron və çap formasında qoruyun
4. Azərbaycandakı bütün qalma müddətini əhatə edən sağlamlıq sığortası alın`,
      `## Azərbaycana gəlişdən sonra

1. Dövlət Miqrasiya Xidmətində qeydiyyatdan keçin (30 gün ərzində)
2. Müvəqqəti yaşayış icazəsi alın (60 gün ərzində)
3. Bank hesabı açın və yerli SIM kart alın
4. Universitetdə qeydiyyatdan keçin və tələbə biletinizi alın
5. Yaşayış ünvanınızı miqrasiya xidmətinə təsdiqləyin`,
    ],
    faqs: [
      [
        "{country} tələbələri üçün Azərbaycan təhsil vizası nə qədər vaxta hazır olur?",
        "Səfirlik vasitəsilə müraciət təxminən 4–6 həftə çəkir. E-viza daha sürətlidir — adətən 3 iş günü ərzində.",
      ],
      [
        "{country} tələbələri Azərbaycanda təhsil alarkən işləyə bilərmi?",
        "Bəli — iş icazəsi ilə. Beynəlxalq tələbələr dərs dövründə həftədə 20 saata qədər işləyə bilərlər.",
      ],
      [
        "{country} tələbələrinə viza almaq üçün Azərbaycan dili bilmək lazımdırmı?",
        "Xeyr. Azərbaycan universitetlərinin çoxu ingilis, rus və türk dillərində tədris aparır, ona görə viza prosesi Azərbaycan dili bilikləri tələb etmir.",
      ],
    ],
  },
  ru: {
    title:
      "Учебная виза в Азербайджан для студентов из {country} 2026: полное руководство",
    excerpt:
      "Пошаговое руководство для студентов из {country}: как получить учебную визу Азербайджана (тип D) — документы, сборы, сроки и чек-лист после прибытия.",
    metaTitle: "Учебная виза в Азербайджан из {country} 2026 — руководство",
    metaDescription:
      "Как студентам из {country} получить учебную визу Азербайджана: требования, документы, сбор 25–50 $, оформление 4–6 недель и действия после прибытия.",
    category: "Визовое руководство",
    content: [
      `Планируете учиться в Азербайджане из {country}? Это руководство охватывает весь процесс получения учебной визы (тип D) — от письма о зачислении в университет до регистрации после прибытия.`,
      `## Краткая информация

| Параметр | Значение |
|----------|----------|
| Тип визы | Учебная виза (тип D) |
| Срок оформления | 4–6 недель (электронная виза: ~3 рабочих дня) |
| Сбор | 25–50 $ |
| Срок действия | До 1 года, продлевается |
| Въезд | В течение 90 дней после выдачи |
| Регистрация | В Государственной миграционной службе в течение 30 дней |`,
      `## Процесс получения визы шаг за шагом

Первый шаг для каждого студента из {country} — официальное письмо о зачислении от аккредитованного азербайджанского университета. К визе обращаются только после получения этого письма, так как оно является основным документом заявки.`,
      `### 1. Необходимые документы

1. **Загранпаспорт** — действителен минимум 6 месяцев после планируемого пребывания
2. **Письмо о зачислении** из аккредитованного азербайджанского университета
3. **Выписка с банковского счёта**, подтверждающая средства на обучение и жизнь
4. **Медицинская справка** и базовая страховка
5. **Фото 3,5 × 4,5 см** и заполненная анкета`,
      `### 2. Подача заявления на визу

- **Электронная виза** — evisa.gov.az: около 3 рабочих дней, 20–50 $, подходит для коротких поездок
- **Посольство / консульство** — ближайшее посольство Азербайджана: 4–6 недель, 25–50 $; этот путь используется для полной учебной визы (тип D)

Подавайте документы за 2–3 месяца до начала семестра, чтобы осталось время на оформление и планирование поездки.`,
      `### 3. Поездка в Азербайджан

- Въезжайте в страну в течение 90 дней с момента выдачи визы
- Зарегистрируйтесь в Государственной миграционной службе в течение 30 дней после прибытия
- Подайте на временный вид на жительство в течение 60 дней, если обучение длится больше одного семестра`,
      `## Расходы

| Позиция | Стоимость |
|---------|-----------|
| Визовый сбор | 25–50 $ |
| Медицинская страховка | 100–200 $ |
| Перевод и легализация документов | 20–50 $ |
| **Примерный итог** | **150–330 $** |`,
      `## Советы студентам из {country}

1. Начинайте визовый процесс за 2–3 месяца до начала обучения
2. Держите на счёте минимум 500 $ в месяц в качестве подтверждения средств
3. Храните копии всех документов — электронные и бумажные
4. Купите страховку, покрывающую весь срок пребывания в Азербайджане`,
      `## После прибытия в Азербайджан

1. Зарегистрируйтесь в Государственной миграционной службе (в течение 30 дней)
2. Получите временный вид на жительство (в течение 60 дней)
3. Откройте банковский счёт и купите местную SIM-карту
4. Зарегистрируйтесь в университете и получите студенческий билет
5. Подтвердите адрес проживания в миграционной службе`,
    ],
    faqs: [
      [
        "Сколько занимает оформление учебной визы Азербайджана из {country}?",
        "Обращение через посольство занимает около 4–6 недель. Электронная виза быстрее — обычно около 3 рабочих дней.",
      ],
      [
        "Могут ли студенты из {country} работать во время учёбы в Азербайджане?",
        "Да — с разрешением на работу. Иностранные студенты могут работать до 20 часов в неделю во время учёбы.",
      ],
      [
        "Нужно ли студентам из {country} знать азербайджанский язык для получения визы?",
        "Нет. Многие азербайджанские университеты преподают на английском, русском и турецком, поэтому знание азербайджанского для визы не требуется.",
      ],
    ],
  },
  tr: {
    title:
      "{country} Öğrencileri için Azerbaycan Öğrenci Vizesi 2026: Kapsamlı Rehber",
    excerpt:
      "{country} öğrencileri için adım adım rehber: Azerbaycan öğrenci vizesi (D tipi) — belgeler, ücretler, işlem süresi ve varış sonrası kontrol listesi.",
    metaTitle: "{country} için Azerbaycan Öğrenci Vizesi 2026 — Rehber",
    metaDescription:
      "{country} öğrencileri Azerbaycan öğrenci vizesini nasıl alır: şartlar, belgeler, 25–50 $ ücret, 4–6 hafta işlem süresi ve varış sonrası yapılacaklar.",
    category: "Vize Rehberi",
    content: [
      `{country} öğrencisi olarak Azerbaycan'da okumayı mı planlıyorsunuz? Bu rehber, öğrenci vizesi (D tipi) sürecinin tamamını kapsar — üniversite kabul mektubundan Azerbaycan'a varış sonrası kayda kadar.`,
      `## Hızlı Bilgiler

| Detay | Bilgi |
|-------|-------|
| Vize türü | Öğrenci vizesi (D tipi) |
| İşlem süresi | 4–6 hafta (e-vize: ~3 iş günü) |
| Ücret | 25–50 $ |
| Süre | 1 yıla kadar, yenilenebilir |
| Giriş | Vizenin verilmesinden sonraki 90 gün içinde |
| Kayıt | Varıştan sonra 30 gün içinde Devlet Göç Servisi'nde |`,
      `## Öğrenci Vizesi Süreci Adım Adım

{country} öğrencileri için ilk adım, akredite bir Azerbaycan üniversitesinden resmî kabul mektubudur. Vizeye yalnızca bu mektubu aldıktan sonra başvurulur çünkü başvurunun temel belgesidir.`,
      `### 1. Gerekli Belgeler

1. **Pasaport** — planlanan kalıştan en az 6 ay daha geçerli
2. **Üniversite kabul mektubu** — akredite bir Azerbaycan üniversitesinden
3. **Banka hesap dökümü** — öğrenim ve yaşam giderlerini kanıtlayan
4. **Sağlık raporu** ve temel sağlık sigortası
5. **Vesikalık fotoğraf** (3,5 × 4,5 cm) ve doldurulmuş başvuru formu`,
      `### 2. Vize Başvurusu

- **E-vize** — evisa.gov.az: yaklaşık 3 iş gününde hazır, 20–50 $, kısa kalışlar için uygun
- **Büyükelçilik / konsolosluk** — en yakın Azerbaycan büyükelçiliği: 4–6 hafta, 25–50 $; tam öğrenci (D tipi) vizesi için bu yol kullanılır

Belgeleri dönem başlamadan 2–3 ay önce teslim edin ki işlem ve seyahat planlaması için yeterli zaman olsun.`,
      `### 3. Azerbaycan'a Seyahat

- Vizenin verilmesinden itibaren 90 gün içinde ülkeye giriş yapın
- Varıştan sonra 30 gün içinde Devlet Göç Servisi'ne kaydolun
- Eğitiminiz bir dönemden uzun sürerse 60 gün içinde geçici ikamet iznine başvurun`,
      `## Maliyet Dökümü

| Kalem | Ücret |
|-------|-------|
| Vize ücreti | 25–50 $ |
| Sağlık sigortası | 100–200 $ |
| Belge tercümesi ve tasdiki | 20–50 $ |
| **Yaklaşık toplam** | **150–330 $** |`,
      `## {country} Öğrencileri için İpuçları

1. Vize sürecine derslerden 2–3 ay önce başlayın
2. Banka hesabınızda ayda en az 500 $ bulundurun
3. Tüm belgelerin kopyalarını — dijital ve basılı — saklayın
4. Azerbaycan'daki tüm kalış sürenizi kapsayan sağlık sigortası yaptırın`,
      `## Azerbaycan'a Vardıktan Sonra

1. Devlet Göç Servisi'ne kaydolun (30 gün içinde)
2. Geçici ikamet izni alın (60 gün içinde)
3. Banka hesabı açın ve yerel SIM kart alın
4. Üniversitede kaydolun ve öğrenci kimliğinizi alın
5. İkamet adresinizi göç servisine bildirin`,
    ],
    faqs: [
      [
        "{country} öğrencileri için Azerbaycan öğrenci vizesi ne kadar sürede çıkar?",
        "Büyükelçilik üzerinden başvuru yaklaşık 4–6 hafta sürer. E-vize daha hızlıdır — genellikle 3 iş günü içinde.",
      ],
      [
        "{country} öğrencileri Azerbaycan'da okurken çalışabilir mi?",
        "Evet — çalışma izniyle. Uluslararası öğrenciler dönem içinde haftada 20 saate kadar çalışabilir.",
      ],
      [
        "{country} öğrencilerinin vize almak için Azerbaycanca bilmesi gerekir mi?",
        "Hayır. Azerbaycan üniversitelerinin çoğu İngilizce, Rusça ve Türkçe eğitim verir; vize süreci Azerbaycanca bilgisi gerektirmez.",
      ],
    ],
  },
  de: {
    title:
      "Aserbaidschan-Studentenvisum für Studierende aus {country} 2026: Kompletter Leitfaden",
    excerpt:
      "Schritt-für-Schritt-Leitfaden für Studierende aus {country}: So erhalten Sie ein aserbaidschanisches Studentenvisum (Typ D) — Unterlagen, Gebühren, Bearbeitungszeit und Checkliste nach der Ankunft.",
    metaTitle: "Studentenvisum Aserbaidschan aus {country} 2026 — Leitfaden",
    metaDescription:
      "Wie Studierende aus {country} ein aserbaidschanisches Studentenvisum erhalten: Voraussetzungen, Unterlagen, 25–50 $ Gebühr, 4–6 Wochen Bearbeitung und Tipps nach der Ankunft.",
    category: "Visaleitfaden",
    content: [
      `Planen Sie ein Studium in Aserbaidschan aus {country}? Dieser Leitfaden behandelt den kompletten Prozess für das Studentenvisum (Typ D) — vom Zulassungsbescheid der Universität bis zur Anmeldung nach der Ankunft.`,
      `## Kurzüberblick

| Angabe | Info |
|--------|------|
| Visumart | Studentenvisum (Typ D) |
| Bearbeitungszeit | 4–6 Wochen (E-Visum: ~3 Werktage) |
| Gebühr | 25–50 $ |
| Gültigkeit | Bis zu 1 Jahr, verlängerbar |
| Einreise | Innerhalb von 90 Tagen nach Ausstellung |
| Anmeldung | Innerhalb von 30 Tagen bei der Migrationsbehörde |`,
      `## Der Visumsprozess Schritt für Schritt

Der erste Schritt für jeden Studierenden aus {country} ist der offizielle Zulassungsbescheid einer akkreditierten aserbaidschanischen Universität. Erst danach beantragt man das Visum, denn dieser Bescheid ist das Kerndokument der Bewerbung.`,
      `### 1. Erforderliche Unterlagen

1. **Reisepass** — mindestens 6 Monate über den geplanten Aufenthalt hinaus gültig
2. **Zulassungsbescheid** einer akkreditierten aserbaidschanischen Universität
3. **Kontoauszug** als Nachweis der Mittel für Studien- und Lebenskosten
4. **Medizinisches Attest** und eine Grundkrankenversicherung
5. **Passfoto (3,5 × 4,5 cm)** und ausgefülltes Antragsformular`,
      `### 2. Visum beantragen

- **E-Visum** — evisa.gov.az: in etwa 3 Werktagen fertig, 20–50 $, für kürzere Aufenthalte geeignet
- **Botschaft / Konsulat** — nächste aserbaidschanische Botschaft: 4–6 Wochen, 25–50 $; dieser Weg gilt für das volle Studentenvisum (Typ D)

Reichen Sie die Unterlagen 2–3 Monate vor Semesterbeginn ein, damit genug Zeit für Bearbeitung und Reiseplanung bleibt.`,
      `### 3. Reise nach Aserbaidschan

- Reisen Sie innerhalb von 90 Tagen nach der Visumausstellung ein
- Melden Sie sich innerhalb von 30 Tagen nach der Ankunft bei der Migrationsbehörde an
- Beantragen Sie eine befristete Aufenthaltserlaubnis innerhalb von 60 Tagen, wenn Ihr Studium länger als ein Semester dauert`,
      `## Kostenübersicht

| Posten | Kosten |
|--------|--------|
| Visumgebühr | 25–50 $ |
| Krankenversicherung | 100–200 $ |
| Übersetzung und Legalisation der Unterlagen | 20–50 $ |
| **Ungefähre Gesamtkosten** | **150–330 $** |`,
      `## Tipps für Studierende aus {country}

1. Beginnen Sie den Visumsprozess 2–3 Monate vor Kursbeginn
2. Halten Sie mindestens 500 $ pro Monat als Nachweis auf dem Konto bereit
3. Bewahren Sie Kopien aller Unterlagen — digital und ausgedruckt
4. Schließen Sie eine Krankenversicherung für den gesamten Aufenthalt ab`,
      `## Nach Ihrer Ankunft in Aserbaidschan

1. Melden Sie sich bei der Migrationsbehörde an (innerhalb von 30 Tagen)
2. Holen Sie die befristete Aufenthaltserlaubnis (innerhalb von 60 Tagen)
3. Eröffnen Sie ein Bankkonto und besorgen Sie eine lokale SIM-Karte
4. Schreiben Sie sich an der Universität ein und erhalten Sie Ihren Studierendenausweis
5. Bestätigen Sie Ihre Wohnadresse bei der Migrationsbehörde`,
    ],
    faqs: [
      [
        "Wie lange dauert ein Studentenvisum für Aserbaidschan aus {country}?",
        "Der Antrag über die Botschaft dauert etwa 4–6 Wochen. Das E-Visum ist schneller — meist etwa 3 Werktage.",
      ],
      [
        "Dürfen Studierende aus {country} während des Studiums in Aserbaidschan arbeiten?",
        "Ja — mit einer Arbeitserlaubnis. Internationale Studierende dürfen während des Semesters bis zu 20 Stunden pro Woche arbeiten.",
      ],
      [
        "Müssen Studierende aus {country} für das Visum Aserbaidschanisch sprechen?",
        "Nein. Viele aserbaidschanische Universitäten unterrichten auf Englisch, Russisch und Türkisch — Aserbaidschanischkenntnisse sind für das Visum nicht nötig.",
      ],
    ],
  },
  fr: {
    title:
      "Visa étudiant Azerbaïdjan pour les étudiants de {country} 2026 : guide complet",
    excerpt:
      "Guide pas à pas pour les étudiants de {country} : comment obtenir le visa étudiant azerbaïdjanais (type D) — documents, frais, délais et liste de contrôle après l'arrivée.",
    metaTitle:
      "Visa étudiant Azerbaïdjan depuis {country} 2026 — guide complet",
    metaDescription:
      "Comment les étudiants de {country} obtiennent le visa étudiant azerbaïdjanais : conditions, documents, frais de 25–50 $, traitement en 4–6 semaines et démarches après l'arrivée.",
    category: "Guide des visas",
    content: [
      `Vous prévoyez d'étudier en Azerbaïdjan depuis {country} ? Ce guide couvre tout le processus du visa étudiant (type D) — de la lettre d'admission de l'université à l'enregistrement après votre arrivée.`,
      `## Informations rapides

| Détail | Info |
|--------|------|
| Type de visa | Visa étudiant (type D) |
| Délai de traitement | 4–6 semaines (e-visa : ~3 jours ouvrables) |
| Frais | 25–50 $ |
| Durée | Jusqu'à 1 an, renouvelable |
| Entrée | Dans les 90 jours suivant la délivrance |
| Enregistrement | Auprès du Service des migrations dans les 30 jours |`,
      `## Le processus de visa étape par étape

Pour chaque étudiant de {country}, la première étape est une lettre d'admission officielle d'une université azerbaïdjanaise accréditée. On ne demande le visa qu'après avoir reçu cette lettre, car elle constitue le document central de la demande.`,
      `### 1. Documents requis

1. **Passeport** — valide au moins 6 mois au-delà du séjour prévu
2. **Lettre d'admission** d'une université azerbaïdjanaise accréditée
3. **Relevé bancaire** prouvant les fonds pour les études et la vie sur place
4. **Certificat médical** et assurance santé de base
5. **Photo d'identité (3,5 × 4,5 cm)** et formulaire de demande rempli`,
      `### 2. Demande de visa

- **E-visa** — evisa.gov.az : traité en ~3 jours ouvrables, 20–50 $, adapté aux séjours courts
- **Ambassade / consulat** — ambassade d'Azerbaïdjan la plus proche : 4–6 semaines, 25–50 $ ; c'est la voie utilisée pour le visa étudiant complet (type D)

Soumettez vos documents 2–3 mois avant le début du semestre afin de laisser le temps au traitement et à l'organisation du voyage.`,
      `### 3. Voyage vers l'Azerbaïdjan

- Entrez dans le pays dans les 90 jours suivant la délivrance du visa
- Enregistrez-vous auprès du Service des migrations dans les 30 jours suivant l'arrivée
- Demandez un titre de séjour temporaire dans les 60 jours si votre cursus dépasse un semestre`,
      `## Répartition des coûts

| Poste | Coût |
|-------|------|
| Frais de visa | 25–50 $ |
| Assurance santé | 100–200 $ |
| Traduction et légalisation des documents | 20–50 $ |
| **Total approximatif** | **150–330 $** |`,
      `## Conseils pour les étudiants de {country}

1. Commencez les démarches 2–3 mois avant le début du cursus
2. Gardez au moins 500 $ par mois sur votre compte comme preuve de fonds
3. Conservez des copies de chaque document — numériques et papier
4. Prenez une assurance couvrant toute la durée du séjour en Azerbaïdjan`,
      `## Après votre arrivée en Azerbaïdjan

1. Enregistrez-vous auprès du Service des migrations (dans les 30 jours)
2. Obtenez un titre de séjour temporaire (dans les 60 jours)
3. Ouvrez un compte bancaire et prenez une carte SIM locale
4. Inscrivez-vous à l'université et recevez votre carte d'étudiant
5. Confirmez votre adresse de résidence auprès du service des migrations`,
    ],
    faqs: [
      [
        "Combien de temps faut-il pour obtenir un visa étudiant azerbaïdjanais depuis {country} ?",
        "La demande via l'ambassade prend environ 4–6 semaines. L'e-visa est plus rapide — généralement environ 3 jours ouvrables.",
      ],
      [
        "Les étudiants de {country} peuvent-ils travailler pendant leurs études en Azerbaïdjan ?",
        "Oui — avec un permis de travail. Les étudiants internationaux peuvent travailler jusqu'à 20 heures par semaine pendant les cours.",
      ],
      [
        "Les étudiants de {country} doivent-ils parler azerbaïdjanais pour obtenir le visa ?",
        "Non. De nombreuses universités azerbaïdjanaises enseignent en anglais, russe et turc, donc le processus de visa n'exige pas de connaissances en azéri.",
      ],
    ],
  },
  ar: {
    title: "تأشيرة الدراسة في أذربيجان للطلاب من {country} 2026: دليل شامل",
    excerpt:
      "دليل خطوة بخطوة للطلاب من {country}: كيفية الحصول على تأشيرة الدراسة الأذربيجانية (النوع D) — الوثائق والرسوم ومدة المعالجة وقائمة ما بعد الوصول.",
    metaTitle: "تأشيرة دراسة أذربيجان من {country} 2026 — دليل شامل",
    metaDescription:
      "كيف يحصل الطلاب من {country} على تأشيرة الدراسة الأذربيجانية: المتطلبات والوثائق ورسوم 25–50 دولارًا ومعالجة خلال 4–6 أسابيع وإجراءات ما بعد الوصول.",
    category: "دليل التأشيرات",
    content: [
      `هل تخطط للدراسة في أذربيجان من {country}؟ يغطي هذا الدليل عملية تأشيرة الدراسة الكاملة (النوع D) — من خطاب القبول الجامعي إلى التسجيل بعد الوصول.`,
      `## معلومات سريعة

| التفاصيل | المعلومة |
|----------|----------|
| نوع التأشيرة | تأشيرة دراسة (النوع D) |
| مدة المعالجة | 4–6 أسابيع (التأشيرة الإلكترونية: ~3 أيام عمل) |
| الرسوم | 25–50 دولارًا |
| المدة | حتى سنة واحدة، قابلة للتجديد |
| الدخول | خلال 90 يومًا من الإصدار |
| التسجيل | لدى دائرة الهجرة خلال 30 يومًا من الوصول |`,
      `## عملية التأشيرة خطوة بخطوة

الخطوة الأولى لكل طالب من {country} هي الحصول على خطاب قبول رسمي من جامعة أذربيجانية معتمدة. لا يُقدَّم طلب التأشيرة إلا بعد الحصول على هذا الخطاب، لأنه المستند الأساسي للطلب.`,
      `### 1. الوثائق المطلوبة

1. **جواز السفر** — صالح لمدة 6 أشهر على الأقل بعد مدة الإقامة المخطط لها
2. **خطاب القبول الجامعي** من جامعة أذربيجانية معتمدة
3. **كشف حساب بنكي** يثبت توفر الأموال للدراسة والمعيشة
4. **شهادة طبية** وتأمين صحي أساسي
5. **صور شخصية (3.5 × 4.5 سم)** واستمارة الطلب معبأة`,
      `### 2. التقديم على التأشيرة

- **التأشيرة الإلكترونية** — evisa.gov.az: تُنجز خلال ~3 أيام عمل، 20–50 دولارًا، مناسبة للإقامات القصيرة
- **السفارة / القنصلية** — أقرب سفارة أذربيجانية: 4–6 أسابيع، 25–50 دولارًا؛ هذا هو المسار المعتمد لتأشيرة الدراسة الكاملة (النوع D)

قدّم وثائقك قبل 2–3 أشهر من بدء الفصل الدراسي حتى يتوفر وقت كافٍ للمعالجة وترتيب السفر.`,
      `### 3. السفر إلى أذربيجان

- ادخل البلاد خلال 90 يومًا من إصدار التأشيرة
- سجّل لدى دائرة الهجرة خلال 30 يومًا من الوصول
- تقدّم للحصول على تصريح إقامة مؤقت خلال 60 يومًا إذا استمرت دراستك أكثر من فصل دراسي`,
      `## تفصيل التكاليف

| البند | التكلفة |
|-------|---------|
| رسوم التأشيرة | 25–50 دولارًا |
| التأمين الصحي | 100–200 دولار |
| ترجمة وتصديق الوثائق | 20–50 دولارًا |
| **الإجمالي التقريبي** | **150–330 دولارًا** |`,
      `## نصائح للطلاب من {country}

1. ابدأ إجراءات التأشيرة قبل 2–3 أشهر من بدء الدراسة
2. احتفظ بما لا يقل عن 500 دولار شهريًا في حسابك البنكي كدليل على توفر الأموال
3. احتفظ بنسخ من كل وثيقة — رقمية وورقية
4. اشترِ تأمينًا صحيًا يغطي كامل مدة إقامتك في أذربيجان`,
      `## بعد وصولك إلى أذربيجان

1. سجّل لدى دائرة الهجرة الحكومية (خلال 30 يومًا)
2. احصل على تصريح الإقامة المؤقت (خلال 60 يومًا)
3. افتح حسابًا بنكيًا واحصل على شريحة هاتف محلية
4. سجّل في الجامعة واحصل على بطاقة الطالب
5. أكّد عنوان إقامتك لدى دائرة الهجرة`,
    ],
    faqs: [
      [
        "كم تستغرق تأشيرة الدراسة الأذربيجانية من {country}؟",
        "يستغرق التقديم عبر السفارة حوالي 4–6 أسابيع. التأشيرة الإلكترونية أسرع — عادة نحو 3 أيام عمل.",
      ],
      [
        "هل يمكن للطلاب من {country} العمل أثناء الدراسة في أذربيجان؟",
        "نعم — بتصريح عمل. يمكن للطلاب الدوليين العمل حتى 20 ساعة أسبوعيًا خلال فترة الدراسة.",
      ],
      [
        "هل يحتاج الطلاب من {country} إلى معرفة اللغة الأذربيجانية للحصول على التأشيرة؟",
        "لا. تدرّس معظم الجامعات الأذربيجانية بالإنجليزية والروسية والتركية، لذا لا تتطلب التأشيرة معرفة اللغة الأذربيجانية.",
      ],
    ],
  },
  fa: {
    title: "ویزای تحصیلی آذربایجان برای دانشجویان {country} ۲۰۲۶: راهنمای کامل",
    excerpt:
      "راهنمای گام‌به‌گام برای دانشجویان {country}: نحوه دریافت ویزای تحصیلی آذربایجان (نوع D) — مدارک، هزینه‌ها، مدت بررسی و چک‌لیست پس از ورود.",
    metaTitle: "ویزای تحصیلی آذربایجان از {country} ۲۰۲۶ — راهنمای کامل",
    metaDescription:
      "دانشجویان {country} چگونه ویزای تحصیلی آذربایجان را دریافت می‌کنند: شرایط، مدارک، هزینه ۲۵ تا ۵۰ دلار، بررسی در ۴ تا ۶ هفته و اقدامات پس از ورود.",
    category: "راهنمای ویزا",
    content: [
      `آیا قصد تحصیل در آذربایجان از {country} را دارید؟ این راهنما کل فرایند ویزای تحصیلی (نوع D) را پوشش می‌دهد — از نامه پذیرش دانشگاه تا ثبت‌نام پس از ورود.`,
      `## اطلاعات سریع

| جزئیات | اطلاعات |
|--------|---------|
| نوع ویزا | ویزای تحصیلی (نوع D) |
| مدت بررسی | ۴ تا ۶ هفته (ویزای الکترونیکی: حدود ۳ روز کاری) |
| هزینه | ۲۵ تا ۵۰ دلار |
| مدت اعتبار | تا ۱ سال، قابل تمدید |
| ورود | ظرف ۹۰ روز از صدور |
| ثبت‌نام | نزد اداره مهاجرت ظرف ۳۰ روز از ورود |`,
      `## فرایند ویزا گام‌به‌گام

اولین قدم برای هر دانشجوی {country} دریافت نامه پذیرش رسمی از یک دانشگاه معتبر آذربایجان است. درخواست ویزا تنها پس از دریافت این نامه انجام می‌شود، زیرا سند اصلی درخواست است.`,
      `### ۱. مدارک موردنیاز

1. **گذرنامه** — حداقل ۶ ماه پس از مدت اقامت برنامه‌ریزی‌شده معتبر
2. **نامه پذیرش دانشگاه** از یک دانشگاه معتبر آذربایجان
3. **صورتحساب بانکی** که تأمین هزینه‌های تحصیل و زندگی را نشان دهد
4. **گواهی پزشکی** و بیمه سلامت پایه
5. **عکس پرسنلی (۳.۵ × ۴.۵ سانتی‌متر)** و فرم درخواست تکمیل‌شده`,
      `### ۲. درخواست ویزا

- **ویزای الکترونیکی** — evisa.gov.az: حدود ۳ روز کاری، ۲۰ تا ۵۰ دلار، مناسب اقامت‌های کوتاه
- **سفارت / کنسولگری** — نزدیک‌ترین سفارت آذربایجان: ۴ تا ۶ هفته، ۲۵ تا ۵۰ دلار؛ این مسیر برای ویزای کامل تحصیلی (نوع D) استفاده می‌شود

مدارک را ۲ تا ۳ ماه پیش از شروع ترم ارسال کنید تا زمان کافی برای بررسی و برنامه‌ریزی سفر باشد.`,
      `### ۳. سفر به آذربایجان

- ظرف ۹۰ روز از صدور ویزا وارد کشور شوید
- ظرف ۳۰ روز از ورود نزد اداره مهاجرت دولتی ثبت‌نام کنید
- اگر دوره شما بیش از یک ترم طول می‌کشد، ظرف ۶۰ روز برای مجوز اقامت موقت اقدام کنید`,
      `## تفکیک هزینه‌ها

| مورد | هزینه |
|------|-------|
| هزینه ویزا | ۲۵ تا ۵۰ دلار |
| بیمه سلامت | ۱۰۰ تا ۲۰۰ دلار |
| ترجمه و تأیید مدارک | ۲۰ تا ۵۰ دلار |
| **مجموع تقریبی** | **۱۵۰ تا ۳۳۰ دلار** |`,
      `## نکات برای دانشجویان {country}

۱. فرایند ویزا را ۲ تا ۳ ماه پیش از شروع دوره آغاز کنید
۲. حداقل ۵۰۰ دلار در ماه در حساب بانکی خود نگه دارید
۳. از همه مدارک نسخه — دیجیتال و چاپی — نگه دارید
۴. بیمه‌ای تهیه کنید که تمام مدت اقامت شما در آذربایجان را پوشش دهد`,
      `## پس از ورود به آذربایجان

۱. نزد اداره مهاجرت دولتی ثبت‌نام کنید (ظرف ۳۰ روز)
۲. مجوز اقامت موقت بگیرید (ظرف ۶۰ روز)
۳. حساب بانکی باز کنید و سیم‌کارت محلی بخرید
۴. در دانشگاه ثبت‌نام کنید و کارت دانشجویی بگیرید
۵. آدرس محل سکونت خود را نزد اداره مهاجرت تأیید کنید`,
    ],
    faqs: [
      [
        "دریافت ویزای تحصیلی آذربایجان از {country} چقدر طول می‌کشد؟",
        "درخواست از طریق سفارت حدود ۴ تا ۶ هفته طول می‌کشد. ویزای الکترونیکی سریع‌تر است — معمولاً حدود ۳ روز کاری.",
      ],
      [
        "آیا دانشجویان {country} هنگام تحصیل در آذربایجان می‌توانند کار کنند؟",
        "بله — با مجوز کار. دانشجویان بین‌المللی می‌توانند حداکثر ۲۰ ساعت در هفته در طول دوره تحصیل کار کنند.",
      ],
      [
        "آیا دانشجویان {country} برای دریافت ویزا باید آذربایجانی بلد باشند؟",
        "خیر. بسیاری از دانشگاه‌های آذربایجان به زبان‌های انگلیسی، روسی و ترکی تدریس می‌کنند، بنابراین ویزا به دانش زبان آذربایجانی نیاز ندارد.",
      ],
    ],
  },
  zh: {
    title: "{country}学生申请阿塞拜疆学生签证2026：完整指南",
    excerpt:
      "{country}学生分步指南：如何申请阿塞拜疆学生签证（D类）——所需文件、费用、办理时间和抵达后的核对清单。",
    metaTitle: "{country}申请阿塞拜疆学生签证2026——完整指南",
    metaDescription:
      "{country}学生如何获得阿塞拜疆学生签证：要求、文件、25-50美元费用、4-6周办理时间以及抵达后需要做的事。",
    category: "签证指南",
    content: [
      `计划从{country}到阿塞拜疆留学？本指南涵盖完整的学生签证（D类）流程——从大学录取通知书到抵达后的登记注册。`,
      `## 快速信息

| 项目 | 信息 |
|------|------|
| 签证类型 | 学生签证（D类） |
| 办理时间 | 4–6周（电子签证约3个工作日） |
| 费用 | 25–50美元 |
| 有效期 | 最长1年，可续签 |
| 入境时限 | 签发后90天内 |
| 登记 | 抵达后30天内向国家移民局登记 |`,
      `## 学生签证流程分步说明

对于来自{country}的每位学生，第一步是获得阿塞拜疆认证大学的正式录取通知书。只有在收到这封信之后才能申请签证，因为它是申请的核心文件。`,
      `### 1. 所需文件

1. **护照**——有效期需超过计划停留时间至少6个月
2. **大学录取通知书**——来自阿塞拜疆认证大学
3. **银行对账单**——证明有足够资金支付学费和生活费
4. **体检证明**和基本医疗保险
5. **护照照片（3.5 × 4.5厘米）**和填写完整的申请表`,
      `### 2. 申请签证

- **电子签证**——evisa.gov.az：约3个工作日办结，20–50美元，适合短期停留
- **大使馆/领事馆**——最近的阿塞拜疆大使馆：4–6周，25–50美元；这是办理完整学生签证（D类）的途径

请在开学前2–3个月提交材料，以便有足够时间办理和安排行程。`,
      `### 3. 前往阿塞拜疆

- 在签证签发后90天内入境
- 抵达后30天内向国家移民局登记
- 如果课程超过一个学期，请在60天内申请临时居留许可`,
      `## 费用明细

| 项目 | 费用 |
|------|------|
| 签证费 | 25–50美元 |
| 医疗保险 | 100–200美元 |
| 文件翻译和公证 | 20–50美元 |
| **预计总计** | **150–330美元** |`,
      `## 给{country}学生的建议

1. 在课程开始前2–3个月启动签证流程
2. 银行账户中每月至少保留500美元作为资金证明
3. 保存每份文件的副本——电子版和纸质版
4. 购买覆盖整个阿塞拜疆停留期间的医疗保险`,
      `## 抵达阿塞拜疆后

1. 向国家移民局登记（30天内）
2. 办理临时居留许可（60天内）
3. 开设银行账户并购买当地SIM卡
4. 在大学注册并获得学生证
5. 向移民局确认你的居住地址`,
    ],
    faqs: [
      [
        "从{country}申请阿塞拜疆学生签证需要多长时间？",
        "通过大使馆申请大约需要4–6周。电子签证更快——通常约3个工作日。",
      ],
      [
        "{country}学生在阿塞拜疆学习期间可以打工吗？",
        "可以——持有工作许可。国际学生在学期内每周最多可工作20小时。",
      ],
      [
        "{country}学生申请签证需要会说阿塞拜疆语吗？",
        "不需要。许多阿塞拜疆大学用英语、俄语和土耳其语授课，因此签证流程不要求阿塞拜疆语能力。",
      ],
    ],
  },
  bg: {
    title:
      "Студентска виза за Азербайджан за студенти от {country} 2026: пълно ръководство",
    excerpt:
      "Ръководство стъпка по стъпка за студенти от {country}: как да получите студентска виза за Азербайджан (тип D) — документи, такси, срокове и списък след пристигането.",
    metaTitle: "Студентска виза за Азербайджан от {country} 2026 — ръководство",
    metaDescription:
      "Как студенти от {country} получават студентска виза за Азербайджан: изисквания, документи, такса 25–50 долара, обработка 4–6 седмици и действия след пристигане.",
    category: "Визово ръководство",
    content: [
      `Планирате ли да учите в Азербайджан от {country}? Това ръководство обхваща целия процес за студентска виза (тип D) — от писмото за приемане до регистрацията след пристигането.`,
      `## Кратка информация

| Детайл | Инфо |
|--------|------|
| Тип виза | Студентска виза (тип D) |
| Срок на обработка | 4–6 седмици (е-виза: ~3 работни дни) |
| Такса | 25–50 долара |
| Срок на валидност | До 1 година, подлежи на подновяване |
| Влизане | В рамките на 90 дни от издаването |
| Регистрация | В Държавната миграционна служба в рамките на 30 дни |`,
      `## Процесът стъпка по стъпка

Първата стъпка за всеки студент от {country} е официално писмо за приемане от акредитиран азербайджански университет. Виза се кандидатства само след получаване на това писмо, тъй като то е основният документ на заявлението.`,
      `### 1. Необходими документи

1. **Паспорт** — валиден поне 6 месеца след планирания престой
2. **Писмо за приемане** от акредитиран азербайджански университет
3. **Банково извлечение** за средства за обучение и живот
4. **Медицинско свидетелство** и основна здравна застраховка
5. **Снимка (3,5 × 4,5 см)** и попълнен формуляр за кандидатстване`,
      `### 2. Кандидатстване за виза

- **Е-виза** — evisa.gov.az: около 3 работни дни, 20–50 долара, подходяща за кратки престои
- **Посолство / консулство** — най-близкото посолство на Азербайджан: 4–6 седмици, 25–50 долара; този път се използва за пълната студентска виза (тип D)

Подайте документите 2–3 месеца преди началото на семестъра, за да остане време за обработка и планиране на пътуването.`,
      `### 3. Пътуване до Азербайджан

- Влезте в страната в рамките на 90 дни от издаването на визата
- Регистрирайте се в Държавната миграционна служба в рамките на 30 дни от пристигането
- Кандидатствайте за временно пребиваване в рамките на 60 дни, ако обучението е по-дълго от един семестър`,
      `## Разбивка на разходите

| Позиция | Разход |
|---------|--------|
| Визова такса | 25–50 долара |
| Здравна застраховка | 100–200 долара |
| Превод и легализация на документи | 20–50 долара |
| **Приблизително общо** | **150–330 долара** |`,
      `## Съвети за студенти от {country}

1. Започнете процеса 2–3 месеца преди началото на курса
2. Поддържайте минимум 500 долара на месец в банковата сметка
3. Съхранявайте копия на всички документи — цифрови и хартиени
4. Вземете здравна застраховка за целия престой в Азербайджан`,
      `## След пристигане в Азербайджан

1. Регистрирайте се в Държавната миграционна служба (в рамките на 30 дни)
2. Получете временно пребиваване (в рамките на 60 дни)
3. Открийте банкова сметка и вземете местна SIM карта
4. Регистрирайте се в университета и вземете студентска карта
5. Потвърдете адреса на пребиваване пред миграционната служба`,
    ],
    faqs: [
      [
        "Колко време отнема студентска виза за Азербайджан от {country}?",
        "Заявлението чрез посолството отнема около 4–6 седмици. Е-визата е по-бърза — обикновено около 3 работни дни.",
      ],
      [
        "Могат ли студенти от {country} да работят по време на следване в Азербайджан?",
        "Да — с разрешение за работа. Международните студенти могат да работят до 20 часа седмично по време на обучението.",
      ],
      [
        "Трябва ли студенти от {country} да говорят азербайджански за визата?",
        "Не. Много азербайджански университети преподават на английски, руски и турски, така че визата не изисква познания по азербайджански.",
      ],
    ],
  },
  tk: {
    title:
      "{country} talypalary üçin Azerbaýjan okuw wizasy 2026: Doly gollanma",
    excerpt:
      "{country} talypalary üçin ädimme-ädim gollanma: Azerbaýjan okuw wizasyny (D görnüşi) nädip almaly — resminamalar, tölegler, gaýtadan işlemek wagty we geleniňizden soňky sanaw.",
    metaTitle: "{country} üçin Azerbaýjan okuw wizasy 2026 — gollanma",
    metaDescription:
      "{country} talypalary Azerbaýjan okuw wizasyny nädip alýar: talaplar, resminamalar, 25–50 dollar töleg, 4–6 hepde gaýtadan işlemek we geleniňizden soň nämeler etmeli.",
    category: "Wiza gollanmasy",
    content: [
      `{country} dan Azerbaýjanda okamagy meýilleşdirýärsiňizmi? Bu gollanma okuw wizasynyň (D görnüşi) ähli prosesini öz içine alýar — uniwersitetiň kabul hatyndan başlap, gelenden soň hasaba durmaklyga çenli.`,
      `## Gysga maglumat

| Jikme-jiklik | Maglumat |
|--------------|----------|
| Wiza görnüşi | Okuw wizasy (D görnüşi) |
| Gaýtadan işlemek wagty | 4–6 hepde (e-wiza: ~3 iş güni) |
| Töleg | 25–50 dollar |
| Möhleti | 1 ýyla çenli, täzeläp bolýar |
| Girmek | Berlen wagtyndan 90 gün içinde |
| Hasaba durmak | Gelenden soň 30 gün içinde Döwlet Migrasiýa Gullugynda |`,
      `## Okuw wizasy ädimme-ädim

{country} talypalary üçin ilkinji ädim akkreditlenen Azerbaýjan uniwersitetinden resmi kabul hatydyr. Wiza diňe şu haty alandan soň soralýar, sebäbi ol ýüz tutmagyň esasy resminamasy.`,
      `### 1. Gerekli resminamalar

1. **Pasport** — meýilleşdirilen galyşdan azyndan 6 aý köp wagt güýjli
2. **Uniwersitetiň kabul haty** — akkreditlenen Azerbaýjan uniwersitetinden
3. **Bank hasabaty** — okuw we ýaşaýyş çykdajylaryny tassyklaýan
4. **Lukmançylyk şahadatnamasy** we esasy saglyk ätiýaçlygy
5. **Surat (3.5 × 4.5 sm)** we doldurylan ýüz tutma blankasy`,
      `### 2. Wiza üçin ýüz tutmak

- **E-wiza** — evisa.gov.az: takmynan 3 iş gününde taýýar, 20–50 dollar, gysga galyşlar üçin amatly
- **Ilçihana / konsullyk** — iň ýakyn Azerbaýjan ilçihanasy: 4–6 hepde, 25–50 dollar; doly okuw (D görnüşli) wizasy üçin şu ýol ulanylýar

Resminamalary semestr başlamazdan 2–3 aý öň tabşyryň, gaýtadan işlemek we syýahat meýilnamasy üçin ýeterlik wagt bolsun.`,
      `### 3. Azerbaýjana syýahat

- Wiza berlen wagtyndan 90 gün içinde ýurda giriň
- Gelenden soň 30 gün içinde Döwlet Migrasiýa Gullugynda hasaba duruň
- Okuwuňyz bir semestrdan uzak dowam edýän bolsa, 60 gün içinde wagtlaýyn ýaşaýyş rugsady üçin ýüz tutuň`,
      `## Çykdajylaryň bölünişi

| Madda | Bahasy |
|-------|--------|
| Wiza tölegi | 25–50 dollar |
| Saglyk ätiýaçlygy | 100–200 dollar |
| Resminamalaryň terjimesi we tassyklanmagy | 20–50 dollar |
| **Takmynan jemi** | **150–330 dollar** |`,
      `## {country} talypalary üçin maslahatlar

1. Wiza prosesine okuw başlamazdan 2–3 aý öň başlaň
2. Bank hasabyňyzda aýda azyndan 500 dollar saklaň
3. Her resminamanyň nusgasyny — sanly we kagyz görnüşinde — saklaň
4. Azerbaýjandaky ähli galyş wagtyňyzy öz içine alýan saglyk ätiýaçlygyny alyň`,
      `## Azerbaýjana geleniňizden soň

1. Döwlet Migrasiýa Gullugynda hasaba duruň (30 gün içinde)
2. Wagtlaýyn ýaşaýyş rugsadyny alyň (60 gün içinde)
3. Bank hasaby açyň we ýerli SIM kartoçka alyň
4. Uniwersitetde hasaba duruň we talyp hatyny alyň
5. Ýaşaýyş salgyňyzy migrasiýa gullugyna tassyklaň`,
    ],
    faqs: [
      [
        "{country} üçin Azerbaýjan okuw wizasy nähili wagtda taýýar bolýar?",
        "Ilçihana arkaly ýüz tutmak takmynan 4–6 hepde dowam edýär. E-wiza has çalt — adatça 3 iş gününde.",
      ],
      [
        "{country} talypalary Azerbaýjanda okaýarka işläp bilermi?",
        "Hawa — iş rugsady bilen. Halkara talyplar okuw döwründe hepdede 20 sagada çenli işläp bilerler.",
      ],
      [
        "{country} talypalaryna wiza almak üçin Azerbaýjan dilini bilmek gerekmi?",
        "Ýok. Azerbaýjan uniwersitetleriniň köpüsi iňlis, rus we türk dillerinde sapak geçýär, şonuň üçin wiza prosesi Azerbaýjan dili bilimini talap etmeýär.",
      ],
    ],
  },
  kk: {
    title:
      "{country} студенттеріне арналған Әзірбайжан студенттік визасы 2026: толық нұсқаулық",
    excerpt:
      "{country} студенттеріне арналған қадамдық нұсқаулық: Әзірбайжан студенттік визасын (D түрі) қалай алуға болады — құжаттар, алымдар, өңдеу мерзімі және келгеннен кейінгі тізім.",
    metaTitle: "{country} үшін Әзірбайжан студенттік визасы 2026 — нұсқаулық",
    metaDescription:
      "{country} студенттері Әзірбайжан студенттік визасын қалай алады: талаптар, құжаттар, 25–50 доллар алым, 4–6 апта өңдеу және келгеннен кейінгі қадамдар.",
    category: "Виза нұсқаулығы",
    content: [
      `{country} ішінен Әзірбайжанда оқуды жоспарлап отырсыз ба? Бұл нұсқаулық студенттік визаның (D түрі) толық процесін қамтиды — университеттің қабылдау хатынан келгеннен кейінгі тіркелуге дейін.`,
      `## Қысқаша ақпарат

| Дерек | Ақпарат |
|-------|---------|
| Виза түрі | Студенттік виза (D түрі) |
| Өңдеу мерзімі | 4–6 апта (электронды виза: ~3 жұмыс күні) |
| Алым | 25–50 доллар |
| Мерзімі | 1 жылға дейін, ұзартылады |
| Кіру | Берілгеннен кейін 90 күн ішінде |
| Тіркелу | Келгеннен кейін 30 күн ішінде Мемлекеттік көші-қон қызметінде |`,
      `## Виза процесі қадам бойынша

{country} студенті үшін бірінші қадам — аккредиттелген Әзірбайжан университетінен ресми қабылдау хаты. Визаға тек осы хатты алғаннан кейін өтініш беріледі, өйткені ол өтінімнің негізгі құжаты болып табылады.`,
      `### 1. Қажетті құжаттар

1. **Паспорт** — жоспарланған тұру мерзімінен кемінде 6 айға артық жарамды
2. **Университеттің қабылдау хаты** — аккредиттелген Әзірбайжан университетінен
3. **Банк үзіндісі** — оқу және тұру шығындарын растайтын
4. **Медициналық анықтама** және негізгі сақтандыру
5. **Сурет (3,5 × 4,5 см)** және толтырылған өтініш формасы`,
      `### 2. Визаға өтініш беру

- **Электронды виза** — evisa.gov.az: шамамен 3 жұмыс күнінде дайын, 20–50 доллар, қысқа сапарларға қолайлы
- **Елшілік / консулдық** — ең жақын Әзірбайжан елшілігі: 4–6 апта, 25–50 доллар; толық студенттік (D түрі) виза үшін осы жол қолданылады

Құжаттарды семестр басталмастан 2–3 ай бұрын тапсырыңыз, өңдеу мен сапарды жоспарлауға жеткілікті уақыт болуы үшін.`,
      `### 3. Әзірбайжанға сапар

- Виза берілгеннен кейін 90 күн ішінде елге кіріңіз
- Келгеннен кейін 30 күн ішінде Мемлекеттік көші-қон қызметінде тіркеліңіз
- Оқуыңыз бір семестрден ұзаққа созылса, 60 күн ішінде уақытша тұруға рұқсат сұраңыз`,
      `## Шығындардың бөлінуі

| Бап | Құны |
|-----|------|
| Виза алымы | 25–50 доллар |
| Медициналық сақтандыру | 100–200 доллар |
| Құжаттарды аудару және заңдастыру | 20–50 доллар |
| **Шамамен барлығы** | **150–330 доллар** |`,
      `## {country} студенттеріне кеңестер

1. Виза процесін курс басталмастан 2–3 ай бұрын бастаңыз
2. Банк шотыңызда айына кемінде 500 доллар ұстаңыз
3. Әр құжаттың көшірмесін — цифрлық және қағаз — сақтаңыз
4. Әзірбайжандағы бүкіл тұру мерзімін қамтитын сақтандыру алыңыз`,
      `## Әзірбайжанға келгеннен кейін

1. Мемлекеттік көші-қон қызметінде тіркеліңіз (30 күн ішінде)
2. Уақытша тұруға рұқсат алыңыз (60 күн ішінде)
3. Банк шотын ашып, жергілікті SIM карта алыңыз
4. Университетте тіркеліп, студенттік картаңызды алыңыз
5. Тұрғылықты мекенжайыңызды көші-қон қызметінде растаңыз`,
    ],
    faqs: [
      [
        "{country} үшін Әзірбайжан студенттік визасы қанша уақытта дайын болады?",
        "Елшілік арқылы өтініш шамамен 4–6 аптаға созылады. Электронды виза тезірек — әдетте 3 жұмыс күнінде.",
      ],
      [
        "{country} студенттері Әзірбайжанда оқып жүріп жұмыс істей ала ма?",
        "Иә — жұмыс рұқсатымен. Халықаралық студенттер оқу кезеңінде аптасына 20 сағатқа дейін жұмыс істей алады.",
      ],
      [
        "{country} студенттеріне виза алу үшін әзірбайжан тілін білу қажет пе?",
        "Жоқ. Көптеген Әзірбайжан университеттері ағылшын, орыс және түрік тілдерінде оқытады, сондықтан виза процесі әзірбайжан тілін білуді талап етпейді.",
      ],
    ],
  },
  ky: {
    title:
      "{country} студенттери үчүн Азербайжан студенттик визасы 2026: толук колдонмо",
    excerpt:
      "{country} студенттери үчүн кадам сайын колдонмо: Азербайжан студенттик визасын (D түрү) кантип алуу керек — документтер, акылар, иштетүү мөөнөтү жана келгенден кийинки тизме.",
    metaTitle: "{country} үчүн Азербайжан студенттик визасы 2026 — колдонмо",
    metaDescription:
      "{country} студенттери Азербайжан студенттик визасын кантип алат: талаптар, документтер, 25–50 доллар акы, 4–6 жума иштетүү жана келгенден кийинки кадамдар.",
    category: "Виза колдонмосу",
    content: [
      `{country} аймагынан Азербайжанда окууну пландап жатасызбы? Бул колдонмо студенттик визанын (D түрү) толук процессин камтыйт — университеттин кабыл алуу катынан келгенден кийинки каттоого чейин.`,
      `## Кыскача маалымат

| Маалымат | Детал |
|----------|-------|
| Виза түрү | Студенттик виза (D түрү) |
| Иштетүү мөөнөтү | 4–6 жума (электрондук виза: ~3 иш күнү) |
| Акы | 25–50 доллар |
| Мөөнөтү | 1 жылга чейин, узартылат |
| Кирүү | Берилгенден кийин 90 күн ичинде |
| Каттоо | Келгенден кийин 30 күн ичинде Мамлекеттик миграция кызматында |`,
      `## Виза процесси кадам сайын

{country} студенти үчүн биринчи кадам — аккредитацияланган Азербайжан университетинен расмий кабыл алуу каты. Визага ушул катты алгандан кийин гана кайрылынат, анткени ал арыздын негизги документи.`,
      `### 1. Керектүү документтер

1. **Паспорт** — пландалган туруу мөөнөтүнөн кеминде 6 айга артык жарактуу
2. **Университеттин кабыл алуу каты** — аккредитацияланган Азербайжан университетинен
3. **Банк үзүндүсү** — окуу жана жашоо чыгымдарын тастыктаган
4. **Медициналык маалымкат** жана негизги камсыздандыруу
5. **Сүрөт (3,5 × 4,5 см)** жана толтурулган арыз формасы`,
      `### 2. Визага кайрылуу

- **Электрондук виза** — evisa.gov.az: болжол менен 3 иш күнүндө даяр, 20–50 доллар, кыска сапарларга ылайыктуу
- **Элчилик / консулдук** — эң жакын Азербайжан элчилиги: 4–6 жума, 25–50 доллар; толук студенттик (D түрү) виза үчүн ушул жол колдонулат

Документтерди семестр башталганга чейин 2–3 ай мурун тапшырыңыз, иштетүү жана сапарды пландаштырууга жетиштүү убакыт болсун.`,
      `### 3. Азербайжанга сапар

- Виза берилгенден кийин 90 күн ичинде өлкөгө кириңиз
- Келгенден кийин 30 күн ичинде Мамлекеттик миграция кызматында катталыңыз
- Окууңуз бир семестрден узакка созулса, 60 күн ичинде убактылуу жашоого уруксат сураңыз`,
      `## Чыгымдардын бөлүштүрүлүшү

| Бап | Баасы |
|-----|-------|
| Виза акысы | 25–50 доллар |
| Медициналык камсыздандыруу | 100–200 доллар |
| Документтерди которуу жана мыйзамдаштыруу | 20–50 доллар |
| **Болжолдуу жалпысы** | **150–330 доллар** |`,
      `## {country} студенттери үчүн кеңештер

1. Виза процессин окуу башталганга чейин 2–3 ай мурун баштаңыз
2. Банк эсебинде айына кеминде 500 доллар кармаңыз
3. Ар бир документтин көчүрмөсүн — санариптик жана кагаз — сактаңыз
4. Азербайжандагы бүткүл туруу мөөнөтүн камтыган камсыздандыруу сатып алыңыз`,
      `## Азербайжанга келгенден кийин

1. Мамлекеттик миграция кызматында катталыңыз (30 күн ичинде)
2. Убактылуу жашоого уруксат алыңыз (60 күн ичинде)
3. Банк эсебин ачып, жергиликтүү SIM карта сатып алыңыз
4. Университетте катталып, студенттик картаңызды алыңыз
5. Турак дарегиңизди миграция кызматында тастыктаңыз`,
    ],
    faqs: [
      [
        "{country} үчүн Азербайжан студенттик визасы канча убакытта даяр болот?",
        "Элчилик аркылуу кайрылуу болжол менен 4–6 жумага созулат. Электрондук виза тезирээк — адатта 3 иш күнүндө.",
      ],
      [
        "{country} студенттери Азербайжанда окуп жүрүп иштей алабы?",
        "Ооба — иш уруксаты менен. Эл аралык студенттер окуу мезгилинде жумасына 20 саатка чейин иштей алышат.",
      ],
      [
        "{country} студенттерине виза алуу үчүн азербайжан тилин билүү керекпи?",
        "Жок. Көптөгөн Азербайжан университеттери англис, орус жана түрк тилдеринде окутат, ошондуктан виза процесси азербайжан тилин билүүнү талап кылбайт.",
      ],
    ],
  },
  ur: {
    title: "{country} کے طلبہ کے لیے آذربائیجان اسٹوڈنٹ ویزا 2026: مکمل گائیڈ",
    excerpt:
      "{country} کے طلبہ کے لیے مرحلہ وار گائیڈ: آذربائیجان کا اسٹوڈنٹ ویزا (ٹائپ D) کیسے حاصل کریں — دستاویزات، فیس، پروسیسنگ کا وقت اور آمد کے بعد کی فہرست۔",
    metaTitle: "{country} کے لیے آذربائیجان اسٹوڈنٹ ویزا 2026 — گائیڈ",
    metaDescription:
      "{country} کے طلبہ آذربائیجان کا اسٹوڈنٹ ویزا کیسے حاصل کرتے ہیں: شرائط، دستاویزات، 25–50 ڈالر فیس، 4–6 ہفتے کی پروسیسنگ اور آمد کے بعد کے اقدامات۔",
    category: "ویزا گائیڈ",
    content: [
      `کیا آپ {country} سے آذربائیجان میں تعلیم حاصل کرنے کا ارادہ رکھتے ہیں؟ یہ گائیڈ اسٹوڈنٹ ویزا (ٹائپ D) کے مکمل عمل کا احاطہ کرتا ہے — یونیورسٹی کے داخلے کے خط سے لے کر آمد کے بعد رجسٹریشن تک۔`,
      `## فوری معلومات

| تفصیل | معلومات |
|-------|---------|
| ویزا کی قسم | اسٹوڈنٹ ویزا (ٹائپ D) |
| پروسیسنگ کا وقت | 4–6 ہفتے (ای-ویزا: تقریباً 3 کاروباری دن) |
| فیس | 25–50 ڈالر |
| مدت | 1 سال تک، قابل تجدید |
| داخلہ | اجرا کے 90 دن کے اندر |
| رجسٹریشن | آمد کے 30 دن کے اندر اسٹیٹ مائیگریشن سروس میں |`,
      `## ویزا کا عمل مرحلہ وار

{country} کے ہر طالب علم کے لیے پہلا قدم ایک تسلیم شدہ آذربائیجانی یونیورسٹی سے سرکاری داخلے کا خط ہے۔ ویزا کے لیے صرف اس خط کے ملنے کے بعد درخواست دی جاتی ہے، کیونکہ یہ درخواست کی بنیادی دستاویز ہے۔`,
      `### 1. مطلوبہ دستاویزات

1. **پاسپورٹ** — منصوبہ بند قیام سے کم از کم 6 ماہ زیادہ درست
2. **یونیورسٹی کا داخلے کا خط** — تسلیم شدہ آذربائیجانی یونیورسٹی سے
3. **بینک اسٹیٹمنٹ** — تعلیم اور رہائش کے اخراجات کا ثبوت
4. **میڈیکل سرٹیفکیٹ** اور بنیادی ہیلتھ انشورنس
5. **تصویر (3.5 × 4.5 سینٹی میٹر)** اور مکمل کردہ درخواست فارم`,
      `### 2. ویزا کی درخواست

- **ای-ویزا** — evisa.gov.az: تقریباً 3 کاروباری دنوں میں تیار، 20–50 ڈالر، مختصر قیام کے لیے موزوں
- **سفارت خانہ / قونصل خانہ** — قریب ترین آذربائیجانی سفارت خانہ: 4–6 ہفتے، 25–50 ڈالر؛ مکمل اسٹوڈنٹ (ٹائپ D) ویزا کے لیے یہی راستہ استعمال ہوتا ہے

دستاویزات سمسٹر شروع ہونے سے 2–3 ماہ پہلے جمع کرائیں تاکہ پروسیسنگ اور سفر کی منصوبہ بندی کے لیے کافی وقت ہو۔`,
      `### 3. آذربائیجان کا سفر

- ویزا کے اجرا کے 90 دن کے اندر ملک میں داخل ہوں
- آمد کے 30 دن کے اندر اسٹیٹ مائیگریشن سروس میں رجسٹریشن کروائیں
- اگر آپ کا کورس ایک سمسٹر سے زیادہ طویل ہو تو 60 دن کے اندر عارضی رہائشی اجازت نامے کے لیے درخواست دیں`,
      `## اخراجات کی تفصیل

| شے | لاگت |
|-----|------|
| ویزا فیس | 25–50 ڈالر |
| ہیلتھ انشورنس | 100–200 ڈالر |
| دستاویزات کا ترجمہ اور توثیق | 20–50 ڈالر |
| **تقریباً کل** | **150–330 ڈالر** |`,
      `## {country} کے طلبہ کے لیے مشورے

1. کورس شروع ہونے سے 2–3 ماہ پہلے ویزا کا عمل شروع کریں
2. بینک اکاؤنٹ میں ماہانہ کم از کم 500 ڈالر رکھیں
3. ہر دستاویز کی کاپی — ڈیجیٹل اور پرنٹ شدہ — محفوظ رکھیں
4. آذربائیجان میں اپنے پورے قیام کی مدت کا احاطہ کرنے والا ہیلتھ انشورنس خریدیں`,
      `## آذربائیجان پہنچنے کے بعد

1. اسٹیٹ مائیگریشن سروس میں رجسٹریشن کروائیں (30 دن کے اندر)
2. عارضی رہائشی اجازت نامہ حاصل کریں (60 دن کے اندر)
3. بینک اکاؤنٹ کھولیں اور مقامی سم کارڈ لیں
4. یونیورسٹی میں رجسٹر ہوں اور اسٹوڈنٹ کارڈ حاصل کریں
5. اپنا رہائشی پتہ مائیگریشن سروس میں تصدیق کروائیں`,
    ],
    faqs: [
      [
        "{country} کے لیے آذربائیجان کا اسٹوڈنٹ ویزا کتنے دنوں میں ملتا ہے؟",
        "سفارت خانے کے ذریعے درخواست تقریباً 4–6 ہفتے لیتی ہے۔ ای-ویزا تیز ہے — عام طور پر تقریباً 3 کاروباری دن۔",
      ],
      [
        "کیا {country} کے طلبہ آذربائیجان میں تعلیم کے دوران کام کر سکتے ہیں؟",
        "جی ہاں — ورک پرمٹ کے ساتھ۔ بین الاقوامی طلبہ تعلیمی مدت میں ہفتے میں 20 گھنٹے تک کام کر سکتے ہیں۔",
      ],
      [
        "کیا {country} کے طلبہ کو ویزا کے لیے آذربائیجانی زبان آنی چاہیے؟",
        "نہیں۔ بہت سی آذربائیجانی یونیورسٹیاں انگریزی، روسی اور ترکی میں پڑھاتی ہیں، اس لیے ویزا کے عمل کے لیے آذربائیجانی زبان کی ضرورت نہیں۔",
      ],
    ],
  },
  uz: {
    title:
      "{country} talabalari uchun Ozarbayjon talaba vizasi 2026: to'liq qo'llanma",
    excerpt:
      "{country} talabalari uchun bosqichma-bosqich qo'llanma: Ozarbayjon talaba vizasini (D turi) qanday olish mumkin — hujjatlar, to'lovlar, ko'rib chiqish muddati va kelgandan keyingi ro'yxat.",
    metaTitle: "{country} uchun Ozarbayjon talaba vizasi 2026 — qo'llanma",
    metaDescription:
      "{country} talabalari Ozarbayjon talaba vizasini qanday oladi: talablar, hujjatlar, 25–50 dollar to'lov, 4–6 hafta ko'rib chiqish va kelgandan keyingi qadamlar.",
    category: "Viza qo'llanmasi",
    content: [
      `{country} dan Ozarbayjonda o'qishni rejalashtiryapsizmi? Ushbu qo'llanma talaba vizasi (D turi) jarayonini to'liq qamrab oladi — universitetning qabul xatidan kelgandan keyingi ro'yxatga olishgacha.`,
      `## Qisqacha ma'lumot

| Ma'lumot | Tafsilot |
|----------|----------|
| Viza turi | Talaba vizasi (D turi) |
| Ko'rib chiqish muddati | 4–6 hafta (e-viza: ~3 ish kuni) |
| To'lov | 25–50 dollar |
| Muddati | 1 yilgacha, uzaytirilishi mumkin |
| Kirish | Berilganidan keyin 90 kun ichida |
| Ro'yxatga olish | Kelgandan keyin 30 kun ichida Davlat migratsiya xizmatida |`,
      `## Viza jarayoni bosqichma-bosqich

{country} talabasi uchun birinchi qadam — akkreditatsiyadan o'tgan Ozarbayjon universitetidan rasmiy qabul xati. Vizaga faqat shu xat olinganidan keyin murojaat qilinadi, chunki u arizaning asosiy hujjatidir.`,
      `### 1. Kerakli hujjatlar

1. **Pasport** — rejalashtirilgan qolish muddatidan kamida 6 oy ortiq amal qiladi
2. **Universitetning qabul xati** — akkreditatsiyadan o'tgan Ozarbayjon universitetidan
3. **Bank ko'chirmasi** — o'qish va yashash xarajatlarini tasdiqlovchi
4. **Tibbiy ma'lumotnoma** va asosiy sug'urta
5. **Rasm (3.5 × 4.5 sm)** va to'ldirilgan ariza formasi`,
      `### 2. Vizaga ariza berish

- **E-viza** — evisa.gov.az: taxminan 3 ish kunida tayyor, 20–50 dollar, qisqa muddatli safarlar uchun mos
- **Elchixona / konsullik** — eng yaqin Ozarbayjon elchixonasi: 4–6 hafta, 25–50 dollar; to'liq talaba (D turi) vizasi uchun aynan shu yo'l ishlatiladi

Hujjatlarni semestr boshlanishidan 2–3 oy oldin topshiring, ko'rib chiqish va sayohatni rejalashtirish uchun yetarli vaqt bo'lsin.`,
      `### 3. Ozarbayjonga sayohat

- Viza berilgan kundan boshlab 90 kun ichida mamlakatga kiring
- Kelgandan keyin 30 kun ichida Davlat migratsiya xizmatida ro'yxatdan o'ting
- O'qishingiz bir semestrdan uzoq davom etsa, 60 kun ichida vaqtinchalik yashash uchun ruxsat so'rang`,
      `## Xarajatlar taqsimoti

| Modda | Narxi |
|-------|-------|
| Viza to'lovi | 25–50 dollar |
| Tibbiy sug'urta | 100–200 dollar |
| Hujjatlarni tarjima va tasdiqlash | 20–50 dollar |
| **Taxminiy jami** | **150–330 dollar** |`,
      `## {country} talabalari uchun maslahatlar

1. Viza jarayonini o'qish boshlanishidan 2–3 oy oldin boshlang
2. Bank hisobingizda oyiga kamida 500 dollar saqlang
3. Har bir hujjatning nusxasini — raqamli va qog'oz — saqlang
4. Ozarbayjondagi butun qolish muddatini qoplaydigan sug'urta oling`,
      `## Ozarbayjonga kelgandan keyin

1. Davlat migratsiya xizmatida ro'yxatdan o'ting (30 kun ichida)
2. Vaqtinchalik yashash uchun ruxsatnoma oling (60 kun ichida)
3. Bank hisobini oching va mahalliy SIM karta oling
4. Universitetda ro'yxatdan o'ting va talaba kartangizni oling
5. Yashash manzilingizni migratsiya xizmatida tasdiqlang`,
    ],
    faqs: [
      [
        "{country} uchun Ozarbayjon talaba vizasi qancha vaqtda tayyor bo'ladi?",
        "Elchixona orqali ariza taxminan 4–6 hafta davom etadi. E-viza tezroq — odatda 3 ish kunida.",
      ],
      [
        "{country} talabalari Ozarbayjonda o'qish vaqtida ishlay oladimi?",
        "Ha — ishlash ruxsatnomasi bilan. Xalqaro talabalar o'quv davrida haftasiga 20 soatgacha ishlashi mumkin.",
      ],
      [
        "{country} talabalariga viza olish uchun ozarbayjon tilini bilish kerakmi?",
        "Yo'q. Ko'pgina Ozarbayjon universitetlari ingliz, rus va turk tillarida dars beradi, shuning uchun viza jarayoni ozarbayjon tilini bilishni talab qilmaydi.",
      ],
    ],
  },
  sw: {
    title:
      "Visa ya Kujifunza Azerbaijan kwa Wanafunzi kutoka {country} 2026: Mwongozo Kamili",
    excerpt:
      "Mwongozo wa hatua kwa hatua kwa wanafunzi kutoka {country}: jinsi ya kupata visa ya kujifunza ya Azerbaijan (Aina D) — nyaraka, ada, muda wa usindikaji na orodha ya baada ya kuwasili.",
    metaTitle: "Visa ya Kujifunza Azerbaijan kutoka {country} 2026 — Mwongozo",
    metaDescription:
      "Jinsi wanafunzi kutoka {country} wanavyopata visa ya kujifunza ya Azerbaijan: mahitaji, nyaraka, ada ya $25–50, usindikaji wa wiki 4–6 na hatua za baada ya kuwasili.",
    category: "Mwongozo wa Visa",
    content: [
      `Je, unapanga kusoma Azerbaijan ukitokea {country}? Mwongozo huu unashughulikia mchakato mzima wa visa ya kujifunza (Aina D) — kuanzia barua ya kukubaliwa chuoni hadi kujisajili baada ya kuwasili.`,
      `## Taarifa za Haraka

| Maelezo | Taarifa |
|---------|---------|
| Aina ya visa | Visa ya kujifunza (Aina D) |
| Muda wa usindikaji | Wiki 4–6 (e-visa: takriban siku 3 za kazi) |
| Ada | $25–50 |
| Muda | Hadi mwaka 1, inaweza kufanywa upya |
| Kuingia | Ndani ya siku 90 tangu kutolewa |
| Usajili | Katika Huduma ya Uhamiaji ya Serikali ndani ya siku 30 |`,
      `## Mchakato wa Visa Hatua kwa Hatua

Hatua ya kwanza kwa kila mwanafunzi kutoka {country} ni barua rasmi ya kukubaliwa kutoka chuo kikuu cha Azerbaijan kilichoidhinishwa. Unaomba visa baada tu ya kupokea barua hii, kwa sababu ndiyo hati kuu ya maombi.`,
      `### 1. Nyaraka Zinazohitajika

1. **Pasipoti** — halali angalau miezi 6 zaidi ya muda uliopangwa wa kukaa
2. **Barua ya kukubaliwa chuoni** kutoka chuo kikuu cha Azerbaijan kilichoidhinishwa
3. **Taarifa ya benki** inayoonyesha fedha za masomo na maisha
4. **Cheti cha matibabu** na bima ya afya ya msingi
5. **Picha (3.5 × 4.5 cm)** na fomu ya maombi iliyojazwa`,
      `### 2. Kuomba Visa

- **E-visa** — evisa.gov.az: inatayarishwa ndani ya takriban siku 3 za kazi, $20–50, inafaa kwa kukaa kwa muda mfupi
- **Ubalozi / ubalozi wa nchi** — ubalozi wa karibu wa Azerbaijan: wiki 4–6, $25–50; njia hii hutumika kwa visa kamili ya kujifunza (Aina D)

Wasilisha nyaraka zako miezi 2–3 kabla ya muhula kuanza ili kuwa na muda wa kutosha wa usindikaji na kupanga safari.`,
      `### 3. Kusafiri kwenda Azerbaijan

- Ingia nchini ndani ya siku 90 tangu visa itolewe
- Jisajili katika Huduma ya Uhamiaji ya Serikali ndani ya siku 30 baada ya kuwasili
- Omba kibali cha muda cha kukaa ndani ya siku 60 ikiwa kozi yako inachukua zaidi ya muhula mmoja`,
      `## Mgawanyo wa Gharama

| Kipengee | Gharama |
|----------|---------|
| Ada ya visa | $25–50 |
| Bima ya afya | $100–200 |
| Tafsiri na uhalalishaji wa nyaraka | $20–50 |
| **Jumla takribani** | **$150–330** |`,
      `## Vidokezo kwa Wanafunzi kutoka {country}

1. Anza mchakato wa visa miezi 2–3 kabla ya kozi kuanza
2. Weka angalau $500 kwa mwezi katika akaunti yako ya benki kama uthibitisho wa fedha
3. Hifadhi nakala za kila hati — za kidijitali na za kuchapishwa
4. Nunua bima inayofunika muda wote wa kukaa kwako Azerbaijan`,
      `## Baada ya Kuwasili Azerbaijan

1. Jisajili katika Huduma ya Uhamiaji ya Serikali (ndani ya siku 30)
2. Pata kibali cha muda cha kukaa (ndani ya siku 60)
3. Fungua akaunti ya benki na ununue SIM kadi ya ndani
4. Jisajili chuoni na upate kadi yako ya mwanafunzi
5. Thibitisha anwani yako ya makazi kwa huduma ya uhamiaji`,
    ],
    faqs: [
      [
        "Inachukua muda gani kupata visa ya kujifunza ya Azerbaijan kutoka {country}?",
        "Maombi kupitia ubalozi huchukua takriban wiki 4–6. E-visa ni haraka — kwa kawaida takriban siku 3 za kazi.",
      ],
      [
        "Je, wanafunzi kutoka {country} wanaweza kufanya kazi wakati wanasoma Azerbaijan?",
        "Ndiyo — kwa kibali cha kazi. Wanafunzi wa kimataifa wanaweza kufanya kazi hadi saa 20 kwa wiki wakati wa masomo.",
      ],
      [
        "Je, wanafunzi kutoka {country} wanahitaji kujua Kiazerbaijani kupata visa?",
        "Hapana. Vyuo vingi vya Azerbaijan hufundisha kwa Kiingereza, Kirusi na Kituruki, kwa hivyo mchakato wa visa hauhitaji ujuzi wa Kiazerbaijani.",
      ],
    ],
  },
  so: {
    title:
      "Fiisaha waxbarasho ee Asarbeejan ee Ardayda ka yimid {country} 2026: Hagaha Dhamaystiran",
    excerpt:
      "Hagaha talaabo-talaabo ee ardayda ka yimid {country}: sida loo helo fiisaha waxbarasho ee Asarbeejan (Nooca D) — dukumintiyada, khidmadaha, waqtiga habaynta iyo liiska imaatinka ka dib.",
    metaTitle: "Fiisaha waxbarasho ee Asarbeejan ee {country} 2026 — Hage",
    metaDescription:
      "Sida ardayda ka yimid {country} ay u helaan fiisaha waxbarasho ee Asarbeejan: shuruudaha, dukumintiyada, khidmad $25–50, habaynta 4–6 toddobaad iyo tallaabooyinka imaatinka ka dib.",
    category: "Hagaha Fiisaha",
    content: [
      `Ma qorshaynaysaa inaad wax ku barato Asarbeejan adoo ka yimid {country}? Hagaani wuxuu daboolayaa habka dhamaystiran ee fiisaha waxbarasho (Nooca D) — laga bilaabo warqadda gelitaanka jaamacadda ilaa diiwaangelinta ka dib imaatinka.`,
      `## Xogta Degdegga ah

| Faahfaahin | Xog |
|------------|-----|
| Nooca fiisaha | Fiiso waxbarasho (Nooca D) |
| Waqtiga habaynta | 4–6 toddobaad (e-fiiso: qiyaastii 3 maalmood oo shaqo) |
| Khidmad | $25–50 |
| Muddada | Ilaa 1 sano, waa la cusboonaysiin karaa |
| Gelista | 90 maalmood gudahood laga bilaabo bixinta |
| Diiwaangelinta | Hay'adda Socdaalka ee Dawladda 30 maalmood gudahood |`,
      `## Habka Fiisaha Tallaabo-tallaabo

Tallaabada koowaad ee arday kasta oo ka yimid {country} waa warqad rasmi ah oo gelitaan ah oo ka timid jaamacad Asarbeejan ah oo la aqoonsan yahay. Fiisaha waxaad codsanaysaa kaliya ka dib markaad hesho warqaddan, sababtoo ah waa dukumentiga ugu muhiimsan ee codsiga.`,
      `### 1. Dukumintiyada Loo Baahan Yahay

1. **Baasaboor** — ansax ah ugu yaraan 6 bilood ka badan muddada qorshaysan ee joogista
2. **Warqadda gelitaanka jaamacadda** — jaamacad Asarbeejan ah oo la aqoonsan yahay
3. **Xisaabta bangiga** oo muujinaysa lacagta waxbarashada iyo nolosha
4. **Shahaadada caafimaadka** iyo caymiska caafimaad ee aasaasiga ah
5. **Sawir (3.5 × 4.5 cm)** iyo foomka codsiga oo la buuxiyey`,
      `### 2. Codsashada Fiisaha

- **E-fiiso** — evisa.gov.az: waxaa la diyaariyaa qiyaastii 3 maalmood oo shaqo gudahood, $20–50, wuxuu ku habboon yahay joogista gaaban
- **Safaaradda / qunsuliyadda** — safaaradda Asarbeejan ee ugu dhow: 4–6 toddobaad, $25–50; wadankan waxaa loo adeegsadaa fiisaha waxbarasho ee buuxa (Nooca D)

U gudbi dukumintiyadaada 2–3 bilood ka hor bilowga simistarka si aad u hesho waqti ku filan habaynta iyo qorsheynta safarka.`,
      `### 3. Safarka Asarbeejan

- Dalka galka ku samee 90 maalmood gudahood laga bilaabo marka fiisaha la bixiyo
- Diiwaangeli Hay'adda Socdaalka ee Dawladda 30 maalmood gudahood ka dib imaatinka
- Codsii rukhsad joogitaan kumeelgaar ah 60 maalmood gudahood haddii koorsadaadu ka dheeraato hal simistar`,
      `## Qaybinta Kharashka

| Shayga | Qiimaha |
|--------|--------|
| Khidmadda fiisaha | $25–50 |
| Caymiska caafimaadka | $100–200 |
| Turjumaadda iyo ansixinta dukumintiyada | $20–50 |
| **Wadarta guud qiyaastii** | **$150–330** |`,
      `## Talooyinka Ardayda ka yimid {country}

1. Bilow habka fiisaha 2–3 bilood ka hor bilowga koorsada
2. Ku hay ugu yaraan $500 bishii xisaabtaada bangiga oo caddayn lacag ah
3. Keydi nuqul ka mid ah dukuminti kasta — dijitaal iyo daabacan
4. Iibso caymis daboolaya muddada oo dhan ee joogistaada Asarbeejan`,
      `## Ka Dib Imaatinka Asarbeejan

1. Diiwaangeli Hay'adda Socdaalka ee Dawladda (30 maalmood gudahood)
2. Hel rukhsadda joogitaanka kumeelgaarka ah (60 maalmood gudahood)
3. Fur xisaab bangiyed oo iibso SIM kaarka maxalliga ah
4. Diiwaangeli jaamacadda oo hel kaadhkaaga ardayga
5. Xaqiiji cinwaankaaga deegaanka hay'adda socdaalka`,
    ],
    faqs: [
      [
        "Intee ayay ku qaadataa fiisaha waxbarasho ee Asarbeejan laga bilaabo {country}?",
        "Codsiga safaaradda dhexdeeda wuxuu qaataa qiyaastii 4–6 toddobaad. E-fiisaha waa ka dhaqsi badan yahay — sida caadiga ah qiyaastii 3 maalmood oo shaqo.",
      ],
      [
        "Ma shaqayn karaan ardayda ka yimid {country} inta ay wax ku baranayaan Asarbeejan?",
        "Haa — rukhsad shaqo. Ardayda caalamiga ah waxay shaqayn karaan ilaa 20 saacadood toddobaadkii inta lagu jiro xilliga waxbarashada.",
      ],
      [
        "Ma u baahan yihiin ardayda ka yimid {country} inay ku hadlaan Af-Asarbeejan si ay fiiso u helaan?",
        "Maya. Jaamacadaha badan ee Asarbeejan waxay ku waxbaraan Ingiriisiga, Ruushka iyo Turkiiga, sidaa darteed fiisaha uma baahna aqoon Af-Asarbeejan.",
      ],
    ],
  },
  id: {
    title:
      "Visa Pelajar Azerbaijan untuk Mahasiswa dari {country} 2026: Panduan Lengkap",
    excerpt:
      "Panduan langkah demi langkah untuk mahasiswa dari {country}: cara mendapatkan visa pelajar Azerbaijan (Tipe D) — dokumen, biaya, waktu proses, dan daftar periksa setelah tiba.",
    metaTitle: "Visa Pelajar Azerbaijan dari {country} 2026 — Panduan Lengkap",
    metaDescription:
      "Cara mahasiswa dari {country} mendapatkan visa pelajar Azerbaijan: persyaratan, dokumen, biaya $25–50, proses 4–6 minggu, dan langkah setelah tiba.",
    category: "Panduan Visa",
    content: [
      `Berencana kuliah di Azerbaijan dari {country}? Panduan ini mencakup seluruh proses visa pelajar (Tipe D) — dari surat penerimaan universitas hingga pendaftaran setelah tiba.`,
      `## Informasi Singkat

| Detail | Info |
|--------|------|
| Jenis visa | Visa pelajar (Tipe D) |
| Waktu proses | 4–6 minggu (e-visa: sekitar 3 hari kerja) |
| Biaya | $25–50 |
| Masa berlaku | Hingga 1 tahun, dapat diperpanjang |
| Waktu masuk | Dalam 90 hari setelah diterbitkan |
| Pendaftaran | Di Dinas Migrasi Negara dalam 30 hari |`,
      `## Proses Visa Langkah demi Langkah

Langkah pertama bagi setiap mahasiswa dari {country} adalah surat penerimaan resmi dari universitas Azerbaijan yang terakreditasi. Anda mengajukan visa hanya setelah menerima surat ini, karena itu adalah dokumen inti permohonan.`,
      `### 1. Dokumen yang Dibutuhkan

1. **Paspor** — berlaku minimal 6 bulan melebihi rencana tinggal
2. **Surat penerimaan universitas** dari universitas Azerbaijan terakreditasi
3. **Rekening koran bank** yang membuktikan dana untuk kuliah dan biaya hidup
4. **Surat keterangan sehat** dan asuransi kesehatan dasar
5. **Foto (3,5 × 4,5 cm)** dan formulir permohonan yang diisi lengkap`,
      `### 2. Mengajukan Visa

- **E-visa** — evisa.gov.az: selesai sekitar 3 hari kerja, $20–50, cocok untuk kunjungan singkat
- **Kedutaan / konsulat** — kedutaan Azerbaijan terdekat: 4–6 minggu, $25–50; jalur ini dipakai untuk visa pelajar penuh (Tipe D)

Serahkan dokumen 2–3 bulan sebelum semester dimulai agar ada cukup waktu untuk pemrosesan dan perencanaan perjalanan.`,
      `### 3. Perjalanan ke Azerbaijan

- Masuk ke negara dalam 90 hari sejak visa diterbitkan
- Daftar di Dinas Migrasi Negara dalam 30 hari setelah tiba
- Ajukan izin tinggal sementara dalam 60 hari jika kuliah berlangsung lebih dari satu semester`,
      `## Rincian Biaya

| Pos | Biaya |
|-----|-------|
| Biaya visa | $25–50 |
| Asuransi kesehatan | $100–200 |
| Penerjemahan dan legalisasi dokumen | $20–50 |
| **Total perkiraan** | **$150–330** |`,
      `## Tips untuk Mahasiswa dari {country}

1. Mulai proses visa 2–3 bulan sebelum kuliah dimulai
2. Sediakan minimal $500 per bulan di rekening bank sebagai bukti dana
3. Simpan salinan setiap dokumen — digital dan cetak
4. Beli asuransi yang mencakup seluruh masa tinggal Anda di Azerbaijan`,
      `## Setelah Tiba di Azerbaijan

1. Daftar di Dinas Migrasi Negara (dalam 30 hari)
2. Dapatkan izin tinggal sementara (dalam 60 hari)
3. Buka rekening bank dan beli kartu SIM lokal
4. Daftar di universitas dan terima kartu mahasiswa
5. Konfirmasi alamat tempat tinggal ke dinas migrasi`,
    ],
    faqs: [
      [
        "Berapa lama proses visa pelajar Azerbaijan dari {country}?",
        "Permohonan melalui kedutaan memakan waktu sekitar 4–6 minggu. E-visa lebih cepat — biasanya sekitar 3 hari kerja.",
      ],
      [
        "Bolehkah mahasiswa dari {country} bekerja selama kuliah di Azerbaijan?",
        "Boleh — dengan izin kerja. Mahasiswa internasional dapat bekerja hingga 20 jam per minggu selama masa kuliah.",
      ],
      [
        "Apakah mahasiswa dari {country} perlu bisa bahasa Azerbaijan untuk mendapatkan visa?",
        "Tidak. Banyak universitas Azerbaijan mengajar dalam bahasa Inggris, Rusia, dan Turki, jadi proses visa tidak mensyaratkan kemampuan bahasa Azerbaijan.",
      ],
    ],
  },
};

/** Resolve a template for a locale (falls back to English). */
export function getVisaArticleTemplate(locale: string): VisaArticleTemplate {
  return VISA_ARTICLE_TEMPLATES[locale] ?? VISA_ARTICLE_TEMPLATES.en;
}

# seo.md — AzStudy SEO / GEO / AEO Strategiyası və İnkişaf Planı

> **Rol perspektivi:** Senior SEO + Senior GEO (Generative Engine Optimization) + Senior AEO (Answer Engine Optimization)
> **Tarix:** 2026-08-25 · **Məqsəd:** Google və AI cavab motorları (ChatGPT, Perplexity, Gemini, Claude, Copilot) AzStudy-i "study in Azerbaijan" mövzusunda **həmişə ilk sıralara çıxarsın**.
> **Prinsip:** Məqalələr **çox** və **güclü** olsun — həcmlə yox, topic-authority (mövzu hakimiyyəti) ilə. Bu sənəd icraçılıq üçün yazılıb: hər bölmədə konkret fayl yolları və tapşırıqlar var.

---

## 0. Skorlar və icra xülasəsi

| Sahə | Hal-hazırki | Hədəf (3 ay) | Əsas boşluq |
|---|---|---|---|
| Texniki SEO infra | 8/10 | 9/10 | Blog kateqoriya səhifələri, RSS, image sitemap dərinliyi |
| Məzmun həcmi | 3/10 | 8/10 | 16 məqalə (cəmi 9-i long-form EN) — rəqiblər 200-500+ |
| Məzmun dili keyfiyyəti | 4/10 | 8/10 | tr/az məqalələri ~90 simvol stub; ru qismən |
| GEO/AEO hazırlığı | 6/10 | 9/10 | llms.txt var; sitat-qazanan məzmun strukturu zəif |
| Topical authority | 2/10 | 8/10 | Mövzu klasterləri yoxdur; 46 universitetin ~5-i məqalədə işlənib |

**Ən kritik fakt:** Saytın texniki SEO-su güclüdür (15 JSON-LD növü, hreflang, sitemap, llms.txt, ISR). Zəif halqa **məzmun həcmi və dərinliyidir**. Google üçün "bu mövzuda avtoritet" siqnalı = bir mövzu klasterində 20-30 qarşılıqlı bağlı, dərin səhifə. AI-lar üçün = strukturlaşdırılmış, sitatlaşdırıla bilən dəqiq cavablar.

---

## 1. Mövcud güclü tərəflər (qoruyun, genişləndirin)

- **15 JSON-LD builder** (`src/lib/seo/json-ld.ts`): EducationalOrganization, WebSite+SearchAction, CollegeOrUniversity, FAQPage, Article, BreadcrumbList, Course, HowTo, Review, ItemList, HowTo, AboutPage, ContactPage, CollectionPage, Service
- **llms.txt + llms-full.txt** (`src/lib/seo/llms.ts`, `/llms.txt`, `/llms-full.txt`): 9 FAQ, apply addımları, 143 ölkə linki, dinamik rəqəmlər
- **robots.ts**: GPTBot, ClaudeBot, PerplexityBot və s. AI-botlara açıq icazə
- **18 dil** tam UI tərcüməsi + hreflang + sitemap alternates (`src/lib/seo/alternates.ts`)
- **Programmatic SEO bazası**: 46 universitet × 11 bölmə, program×şəhər kombinasiyaları, 143 ölkə səhifəsi + hub (`study-in-azerbaijan-from/page.tsx`)
- **pricing.md** (`/pricing.md`): AI-lar üçün maşın-oxunur qiymət datası
- **Related posts** mexanizmi blog-da var (`blog/[slug]/page.tsx:70-73` — eyni kateqoriya filtri)
- **ISR + static gənerasiya**: min 4000+ URL sitemap-da

---

## 2. BOŞLUQLAR — Senior SEO analizi

### 2.1 🔴 Məzmun həcmi: 16 məqalə kifayət etmir
- **Faktlar:** `src/lib/seed/blog.ts` — 16 post; EN-də cəmi 9 post 1500+ simvol; **tr/az ortalaması 93/92 simvol (stub!)**; ru 160 simvol orta. 14 dil üçün məqalə məzmunu yoxdur (yalnız title/excerpt).
- **Rəqabət reallığı:** "study in Azerbaijan" mövzusunda rəqib saytlar (studyinazerbaijan.com, etc.) 200-500 məqalə ilə çıxış edir. 16 məqalə ilə topical authority mümkün deyil.
- **Nəticə:** Google üçün sayt "az məzmunlu kataloq" kimi görünür; AI-lar üçün sitat qazanacaq dərin fakt yoxdur.

### 2.2 🔴 Blog kateqoriya səhifələri YOXDUR
- `src/app/[locale]/(marketing)/blog/` — yalnız `page.tsx` (index) + `[slug]`. 13 kateqoriya var (Admissions, Universities, Scholarships, Visa Guide, Medicine, Engineering, ...) amma `/blog/scholarships` kimi kateqoriya səhifəsi yoxdur.
- **Zərər:** Kateqoriya səhifələri ən güclü commercial-intent keyword-ləri tutur ("scholarships in azerbaijan", "azerbaijan student visa") və internal-linking onurğasıdır.

### 2.3 🟠 Məqalə keyfiyyət strukturu zəif (E-E-A-T)
- Mövcud EN məqalələrdə: cədvəllər, FAQ blokları, mənbələr, müəllif bio, son yenilənmə tarixi **yoxdur** (bəzilərində var, əksəriyyətində yox).
- `author: "AzStudy Team"` — müəllif səhifəsi (`/blog/authors/...`) və real profil yoxdur. E-E-A-T üçün zəif siqnal.
- `publishedAt` var, `updatedAt` **yoxdur** — Google "freshness" siqnalı itir.

### 2.4 🟠 RSS feed yoxdur
- AI aqreqatorları və content-discovery üçün `/rss.xml` lazımdır. Next.js-də route handler ilə sadədir.

### 2.5 🟠 Universitet səhifələri məzmun baxımından yarımçıq
- 46 universitetin detail səhifəsi texniki cəhətdən 11 bölməlidir, amma məzmun seed-dən gəlir və əksəriyyəti 2-3 cümləlik description-dan ibarətdir.
- Hər universitet üçün "ən azı 400-600 sözlük unikal analiz" (ranking, təhsil haqqı cədvəli, yataqxana, qəbul tələbləri, məzun perspektivləri) olmalıdır — bu, məhz AI cavablarının sitatlayacağı hissədir.

### 2.6 🟡 Image SEO
- `alt` mətnləri var (yaxşı), amma fayl adları `hero.webp` genericdir → descriptive olmalı (`baku-state-university-campus-library.webp`).
- Blog şəkilləri 6 fayl paylaşır (16 post) → unikal cover şəkli post başına.

### 2.7 🟡 Qabaqcıl strukturlar
- BreadcrumbList var ✅. `Speakable` schema **yoxdur** (AI voice/answer üçün). `Dataset`/`Table` zənginləşdirməsi qiymət cədvəlləri üçün yoxdur.

---

## 3. BOŞLUQLAR — Senior GEO/AEO analizi (AI görünüşü)

### 3.1 🔴 "Sitat-qazanan" məzmun formatı yoxdur
AI-lar (Perplexity, ChatGPT search) mətni **sitatlaşdırıla bilən bloklara** görə seçir:
- **Bir cümləlik birbaşa cavab** ("How much does it cost to study in Azerbaijan? → State universities cost $600–2,000/year...") — ilk 40-60 simvolda
- **Dəqiq rəqəmlər və illər** ("2026 fees", "46 accredited universities")
- **Cədvəllər** (AI-lar cədvəlləri sevir — müqayisə/qiymət)
- **Nömrələnmiş addımlar** (HowTo)
- **Mənbə/keyfiyyət işarələri** ("according to Ministry of Education", "verified by our on-ground team")

Mövcud Geo namespace (`src/messages/*.json` → "Geo" bloku) universitet/ölkə səhifələrində bunu qismən edir ✅, amma **blog məqalələrində bu struktur yoxdur**.

### 3.2 🟠 FAQ səthinin dartılması zəifdir
- llms.txt-da 9 FAQ var; saytda FAQPage schema yalnız universitet detail + home-da. Hər **blog məqaləsinin** sonunda 3-5 FAQ + FAQPage JSON-LD olmalıdır (AI-lar FAQ schema-nı birbaşa çəkir).

### 3.3 🟠 "Freshness" siqnalı
- AI-lar və Google freshness üçün `updatedAt` + "Last updated: {date}" sətri lazımdır. `BlogPost` tipinə `updatedAt` əlavə olunmalıdır (`src/types/index.ts`).

### 3.4 🟡 Entity konsolidasiyası
- `sameAs` artıq var (sosial linklər). Əlavə: Wikipedia/Wikidata entity linkləri (Azərbaycan təhsil sistemi, şəhərlər) JSON-LD `about`/`mentions` sahələrində — AI knowledge graph-ına girmək üçün.

---

## 4. 🎯 MƏQALƏ STRATEGİYASI — "çox və güclü" (ən vacib bölmə)

### 4.1 Topical Cluster Modeli (mövzu hakimiyyəti xəritəsi)

Hər klaster = 1 **pillar səhifə** (3000+ söz bələdçi) + 15-30 **cluster məqalə** + qarşılıqlı internal link. 8 klaster × ~25 məqalə = **200 məqalə hədəfi** (6 ay).

| # | Klaster (pillar) | Pillar URL | Cluster nümunələri (hər biri ayrıca məqalə) | Öncelik |
|---|---|---|---|---|
| 1 | **Qəbul bələdçisi** | `/blog/how-to-apply-to-azerbaijani-universities` (genişləndir) | sənəd siyahısı 2026, DIM balı ilə qəbul, attestat nostrifikasiyası, online qəbul addım-addım, qəbul tarixləri/deadline-lar, motivasiya məktubu nümunəsi, application fee bələdçisi, age limit, transfer tələbələr | 🔴 |
| 2 | **Qiymət/Büdcə** | `/blog/cost-of-living-in-azerbaijan` (genişləndir) | təhsil haqqı 2026 (dövlət), təhsil haqqı (özəl), Yaşayış: Bakı vs Gəncə, yemək xərcləri, nəqliyyat, mobil/internet, aylıq $300 büdcə planı, təhsil haqqı ödəniş üsulları, gizli xərclər | 🔴 |
| 3 | **Təqaüdlər** | `/blog/scholarships-in-azerbaijan` (genişləndir) | dövlət təqaüdləri, universitet təqaüdləri (46 universitet üçün ayrı məqalələr!), merit-based endirimlər, idman təqaüdləri, Azərbaycanda pulsuz təhsil, təqaüd müsahibəsi, 100% təqaüd necə qazanılır | 🔴 |
| 4 | **Viza & Hüquq** | `/blog/student-visa-azerbaijan-complete-guide` | viza ölkə-ölkə (Pakistan üçün, Nigeriya üçün, Özbəkistan üçün... — 143 ölkə səhifəsinə bağla), yaşayış icazəsi, e-visa vs tələbə vizası, visa extension, DMQ qeydiyyatı, tibbi sığorta | 🔴 |
| 5 | **Universitet dərin analizləri** | `/universities` (listing) | **46 universitetin HƏR BİRİ üçün ayrıca "X Universitetində Təhsil 2026: Qəbul, Qiymətlər, Həyat" məqaləsi** — 46 məqalə dərhal! + "best universities for X" seriyası (medicine, engineering, business, IT, law, architecture...) | 🔴 |
| 6 | **İxtisaslar** | `/programs` | medicine/dentistry/pharmacy/nursing, computer science/AI/data, business/MBA/finance, engineering (neft, memarlıq, elektrik), hüquq, beynəlxalq münasibətlər, dizayn, turizm — hər biri "curriculum + karyera + salary Azərbaycanda" formatda | 🟠 |
| 7 | **Həyat & Mədəniyyət** | mövcud travel/culture postlar | yataqxana vs kirayə, tələbə işi (part-time qaydaları), bank hesabı, sim-kart, AZS beynəlxalq tələbə kartı, Azərbaycan dilində sağ qalma dərsi, din/məscidlər, təhlükəsizlik, qadın tələbələr üçün bələdçi | 🟠 |
| 8 | **Müqayisələr (Comparison)** | — | Azərbaycan vs Türkiyə/Rusiya/Polşa/Gürcüstan/Qazaxıstan/Ukrayna (hər biri ayrıca), dövlət vs öəl universitet, Bakı vs Gəncə, English vs Azərbaycan dilli proqram | 🟠 |

**Mühüm:** 4-cü klasterdəki "viza ölkə-ölkə" məqalələri + 5-ci klasterdəki 46 universitet məqaləsi = **təxminən 100 məqalə hazır blueprint ilə** — hər biri mövcud data-dan (universitet seed, ölkə səhifələri) yaradıla bilər. Bu, ən sürətli həcm artımı yoludur və hər biri öz long-tail keyword-ini tutur ("ADA University tuition fees 2026", "Azerbaijan student visa from Pakistan").

### 4.2 Keyfiyyət standartı (hər yeni məqalə üçün məcburi şablon)

Hər məqalə bu strukturda olmalıdır (AI-implementation üçün dəqiq təlimat):

1. **Title:** ≤60 simvol, il əlavə olunmuş ("...in Azerbaijan 2026")
2. **Birbaşa cavab bloku (Answer Box / GEO):** ilk abzasda 40-60 simvolluq birbaşa, sitatlaşdırıla bilən cavab — `<p>` və ya `Summary` box
3. **TOC** (Mündəricat) — anchor linklərlə
4. **Gövdə:** 1200-2500 söz, H2/H3 iyerarxiyası, **ən azı 1 cədvəl**, addım-addım bölmələr `<ol>` ilə
5. **Dəqiq datalar:** rəqəmlər, illər, mənbə adı ("Source: university official 2026 fee list") — AI sitatları üçün
6. **FAQ bloku:** 3-5 sual + qısa cavab (həm gövdədə, həm `faqPageJsonLd` ilə)
7. **Internal linklər:** 3-5 əlaqəli universitet/ölkə/program səhifəsinə + 2-3 əlaqəli məqaləyə
8. **Meta:** metaTitle, metaDescription (max 155 simvol, CTS-trigger: "Compare...", "Free guide...") — BlogPost növünə əlavə edilməli
9. **Şəkil:** unikal cover, descriptive fayl adı, alt mətn keyword-li
10. **Saatlarla ölçülə bilən fayda:** məqalənin "research" qutusu (keyfiyyət siqnalı): "Verified: fees checked with university admissions, {date}"

### 4.3 Dil strategiyası (ən böyük bug: tr/az stub-lar)

- **Prioritet sırası:** EN (tam) → RU (tam) → TR (tam) → AZ (tam) → sonrakı dillər (en azı title+excerpt+answer-block+FAQ tərcüməsi)
- Mövcud 16 məqalənin **tr/az məzmunları sıfırdan yazılmalıdır** (indi ~90 simvol stub). Bu, `INCOMPLETE_LOCALES` boş olduğu üçün "tam" kimi indexlənir = thin-content riski!
- **Qısamüddətli həll (kod işi):** blog `[slug]/page.tsx`-də əgər cari locale-də content <200 simvoldursa → `noindex,follow` + canonical EN-ə (universitetlərdəki `isThinUniversityLocale` pattern-i kimi). Bu Google cəzasından qoruyur.

### 4.4 Programmatic SEO genişlənməsi (kod + data ilə avtomatik səhifələr)

Mövcud: program×şəhər, ölkə səhifələri. Əlavə edilə bilən kombinasiyalar:

1. **Universitet × Kateqoriya** (`/universities/{slug}/{category}` olmasa da, blog-da "best universities for {category} in {city}") — məlumat: `seedUniversityPrograms`
2. **Ölkə × Mövzu landing-ləri:** `/study-in-azerbaijan-from/{country}` səhifələrinə "viza üçün {country}", "təqaüd für {country}" alt-bölmələri (content enrichment, yeni route lazım deyil)
3. **Qiymət kalkulyatoru landing pages:** `/tuition-calculator` + "cost of studying {program} in {city}" statik variantları (SEO-texniki ayrıca sənəd)

---

## 5. TEXNİKİ SEO ROADMAP (kod işləri — icra sırası ilə)

### F1 (1-ci həftə) — infrastruktur
- [ ] **BlogPost tipinə `updatedAt` + `metaTitle`/`metaDescription` əlavə et** — `src/types/index.ts`, `src/lib/seed/blog.ts`, DB `blog_posts` cədvəli (0011-də var, `seed-content.ts` sinxronlaşdır)
- [ ] **Blog kateqoriya səhifələri yarat:** `src/app/[locale]/(marketing)/blog/category/[category]/page.tsx` + `generateStaticParams` (13 kateqoriya × 18 dil), `CollectionPage` JSON-LD, sitemap-a əlavə (`src/app/sitemap.ts`), kateqoriya filtri blog index-də (query param `/blog?category=scholarships`)
- [ ] **RSS feed:** `src/app/rss.xml/route.ts` (EN + hər dil üçün `/en/rss.xml` alternatları; `lastmod`, `content:encoded`)
- [ ] **Thin-content qoruması:** blog səhifəsində lokalcə content <200 simvol → noindex+canonical EN (4.3-dəki pattern)
- [ ] **Article JSON-LD genişləndir:** `articleJsonLd`-ya `dateModified`, `author` (Person + url), `publisher`, `image` — `src/lib/seo/json-ld.ts`

### F2 (2-3-cü həftə) — məzmun dərinliyi
- [ ] 16 mövcud məqaləni 4.2 şablonuna uyğun yenidən yaz (EN) + FAQ JSON-LD
- [ ] tr/az/ru tam məzmunlar
- [ ] Hər məqaləyə unikal cover şəkli (AI-generasiya və ya stock, descriptive ad)
- [ ] Universitet detail səhifələri üçün "rich analysis" hissəsi: `universities/[slug]/page.tsx`-də mövcud 11 bölməyə "Why choose {uni}" 400+ sözlük analiz bloku əlavə (seed-dən `analysis: LocalizedString` sahəsi)

### F3 (1-ci ay) — həcm
- [ ] Klaster 5: **46 universitet məqaləsi** (blueprint 4.1/5) — seed datasından yaradıla bilər, sonra editor redaktəsi
- [ ] Klaster 4: **top-15 ölkə viza məqaləsi** (əsas bazarlar: Pakistan, Nigeriya, Özbəkistan, Qazaxıstan, Misir, İndiya, Banqladeş, İran, İraq, Əfqanıstan, Türkiyə, Rusiya, Suriya, Yəmən, Əlcəzair)
- [ ] Klaster 2-3: qiymət/təqaüd seriyası (15 məqalə)

### F4 (2-3-cü ay) — avtoritet
- [ ] Müəllif sistemi: `authors` seed + `/blog/authors/[slug]` səhifələri (Person JSON-LD, `sameAs` — LinkedIn və s.) — E-E-A-T
- [ ] **Data hub:** `/data/` bölməsi — "Azerbaijan University Fees 2026: Full Dataset" (cədvəl + Dataset schema + downloadable CSV) — **backlink maqnitidir**, AI-lar data-səhifələrə istinad edir
- [ ] Speakable schema (json-ld.ts): əsas answer-block-larda
- [ ] Image adlarının descriptive-ləşdirilməsi + post-cover unikallaşdırma
- [ ] `mentions`/`about` entity linkləri (Wikidata) — EducationalOrganization + Article-də

### F5 (əvvəlki mövcud infraştrukturların təkmilləşdirilməsi)
- [ ] Blog index pagination (16+ məqalə olanda kritik): `/blog/page/2` + `rel-next/prev` alternates
- [ ] Tag sistemi (ixtisas + şəhər tag-ləri: `#medicine`, `#baku`) — tag səhifələri long-tail tutur
- [ ] Search Console + Bing Webmaster + `IndexNow` (key: Bing/ChatGPT crawling sürətləndirici) — `next.config` header və ya API ping script
- [ ] GA4 + Clarity onsuz da var (`analytics.tsx`) → əlavə: SSG çıxış faizi, "AI traffic" segmenti (referrer: perplexity.ai, chat.openai.com, gemini.google.com)

---

## 6. GEO/AEO ROADMAP (AI cavab motorlarında görünüş)

### 6.1 Struktur (kod işi)
- [ ] **AnswerBlock komponenti:** `src/components/sections/answer-block.tsx` — hər məqalənin/klaster səhifəsinin başında "Quick answer" qutusu (Speakable + `about` schema ilə işarələnmiş). AI-lar bu bloku birbaşa sitat edir.
- [ ] **faqPageJsonLd-ı bütün yeni məqalələrə** (4.2-şablon məcburidir)
- [ ] **llms-full.txt genişləndir:** hazırda 9 FAQ + 7 universitet — hədəf: 30+ FAQ (bütün klasterlərdən), bütün kateqoriya linkləri, son 30 məqalə linki (llms.ts dinamik olaraq `seedBlog`-dan generasiya etməlidir — hazırda hardcoded TOP_UNIVERSITIES var)
- [ ] **/api/chat mövcuddur** — ona əsaslanan "Ask AzStudy AI" widget-ı məqalə səhifələrində (dwell time + AI-brand siqnalı)

### 6.2 Məzmun (AI sitat qazanma taktikaları)
- Hər klaster pillar səhifəsində **"Key facts" cədvəli** (rəqəm + il + mənbə) — Perplexity cədvəlləri birbaşa göstərir
- Sual-formatlı H2-lər ("How much does it cost to...?", "Can I study in Azerbaijan without IELTS?") — featured snippet + AI query uyğunluğu
- **Rəqəmsal dəqiqlik:** "$600-2,000" formatında (yox: "affordable") — AI-lar dəqiq rəqəmli mənbələri seçir
- Mövcud Geo namespace blokları (universitet/ölkə səhifələrində) **məqalələrə də keçirilməli** — bu pattern onsuz da hazırdır, genişləndirin

### 6.3 Monitorinq
- [ ] Aylıq: Perplexity/ChatGPT-da 15 benchmark sualı test ("best universities in Azerbaijan", "Azerbaijan student visa cost"...) — sitat faizi izlənilir
- [ ] Bing Webmaster (ChatGPT axtarışı Bing-dən qidalanır!) — Bing-də sıralama = ChatGPT-də görünüş
- [ ] `log` analiz: AI-botların (GPTBot, ClaudeBot, PerplexityBot) crawl tezliyi — robots-a açıq olduqlarını bilitik; analytics-də ai-referrer sessions

---

## 7. KPI və ölçmə (3 aylıq hədəflər)

| KPI | İndi | 1 ay | 3 ay |
|---|---|---|---|
| İndekslənən blog məqaləsi | 16 | 60 | 200 |
| EN long-form (>1200 söz) | 9 | 40 | 150 |
| tr/az tam məqalə | 0 | 30 | 100 |
| Kateqoriya səhifələri | 0 | 13 | 13+30 tag |
| FAQPage schema olan səhifə | ~50 | 150 | 400 |
| Organic clicks/mo (GSC) | 0 (yeni) | 500 | 5000 |
| AI benchmark sitat faizi | 0% | 20% | 50% |
| Referer: perplexity/chatgpt sessions | 0 | izləmə başlayır | 200+/mo |

---

## 8. Prioritetləndirilmiş icra xülasəsi

**Vaciblik sırası:**
1. 🔴 **Məzmun həcmi** (F3 + 4.1 klasterlər) — rəqabət üstünlüyü ən çox burda qazanılır/qoyulur
2. 🔴 **tr/az stub təhlükəsi** (4.3 noindex qoruması + tam məzmunlar) — aktiv cəza riski
3. 🔴 **Blog kateqoriya səhifələri** (F1) — texniki, sürətli qələbə
4. 🟠 AnswerBlock + FAQ schema (6.1) — AI görünüşü
5. 🟠 updatedAt + Article JSON-LD genişlənmə (F1)
6. 🟠 RSS + IndexNow + pagination (F5)
7. 🟡 Data hub + müəllif sistemi (F4) — long-term avtoritet

**İlk 10 konkret tapşırıq (AI-icra üçün hazır):**
1. `src/types/index.ts` → BlogPost-a `updatedAt`, `metaTitle`, `metaDescription`, `faqs: {q,a}[]` sahələri
2. `src/lib/seed/blog.ts` → 16 məqaləyə FAQ + updatedAt doldur
3. `src/app/[locale]/(marketing)/blog/category/[category]/page.tsx` yarat + sitemap-a sal
4. `src/lib/seo/json-ld.ts` → `articleJsonLd`-ya dateModified/author/publisher; yeni `blogFaqJsonLd`
5. Blog thin-content noindex qoruması (`[slug]/page.tsx`)
6. `src/app/rss.xml/route.ts` + `<link rel="alternate">` layout-da
7. Klaster 5 üçün generator: `seedUniversities`-dən 46 məqalə blueprint-i (script: `scripts/generate-university-articles.mjs`)
8. `llms.ts` → FAQ-ları `seedBlog`-dan və klasterlərdən dinamik yığ; TOP_UNIVERSITIES-i seed-dən
9. `src/components/sections/answer-block.tsx` + məqalə şablonuna inteqrasiya
10. 46 universitet seed-inə `analysis: LocalizedString` sahəsi + detail səhifədə render

> Bu sənəd `s.md` ilə tamamlşdırıcıdır: s.md texniki borclardan, seo.md **böyümə strategiyasından** danışır. İkisi birlikdə icra olunmalıdır.

# a.md — Tapılmış Problemlər və Düzəliş Təlimatı

> Rollar: Senior SEO, Backend, Frontend, Security, Fullstack, UI, GEO, AEO
> Hər problem = Yer (file:line) + Necə düzəltmək. Test: hər blokdan sonra
> `npm run typecheck && npm run lint && npm test`
> Prioritetləşdirilmiş icra sırası → `et.md`

---

## 1. İSTİFADƏÇİYƏ GÖRÜNƏN TÜRKİYƏ QALIQLARI — KRİTİK

### 1.1. Footer ölü linklər (produksiya 404)
- **Yer:** `src/components/layout/footer.tsx:184` (`/study-in-turkey-from/${c.slug}`), `:194` (`/study-in-turkey-from`), şərh `:14`
- **Düzəliş:** hər üç yerdə `study-in-turkey-from` → `study-in-azerbaijan-from`. Real route: `src/app/[locale]/(marketing)/study-in-azerbaijan-from/[country]/page.tsx`

### 1.2. OG şəkilləri "Study in Turkey" deyir (9 dil)
- **Yer:** `src/app/[locale]/opengraph-image.tsx:24-58` — ru "Учеба в Турции", de "Studium in der Türkei", fr "Étudier en Turquie", ar/fa/zh/tk/kk/ky; monoqram "S" `:102`
- **Düzəliş:** 9 dilin `title`/`sub`-unu Azərbaycan üçün tərcümə et (en/tr/az nümunə kimi); `:102`-də `S` → `A`

### 1.3. az.json Geo blokunda Türkiyə faktları
- **Yer:** `src/messages/az.json:362` (languageBody — "türk hazırlıq ilə türk proqramlarına"), `:605` (cons1 — "türk dili faydalıdır"), `:615` (step4Text — "türk tələbə vizası"), `:620` (languageValue — "İngilis və türk dilləri")
- **Düzəliş:** bütün sətirləri Azərbaycan kontekstinə yaz (məs. step4Text → "Qəbul məktubu ilə Azərbaycan konsulluğunda tələbə vizası üçün müraciət edin"). Eyni açarları ru/tr fayllarında da yoxla. Bu sətirlər GEO bloklarına — AI cavab motorlarına gedir

### 1.4. pricing.md-də "Türkiye Bursları"
- **Yer:** `src/app/pricing.md/route.ts:95`
- **Düzəliş:** sətri Azərbaycan dövlət təqaüd proqramı məlumatı ilə əvəz et (real mənbədən fakt yoxla)

### 1.5. Valyuta sxemi — AZN yoxdur
- **Yer:** `supabase/migrations/0019_data_constraints.sql:39` (`check (currency in ('USD','TRY'))`); `src/types/index.ts:87,104`; `src/lib/data/pg-data-repository.ts:116,461`; `src/components/sections/university-detail/programs.tsx:21`; `dormitories.tsx:9`
- **Düzəliş:**
  1. Yeni miqrasiya `0028_azn_currency.sql`: `alter table university_programs drop constraint up_currency_check; add constraint up_currency_check check (currency in ('USD','AZN'));` (eyni pattern-də digər currency constraint-ləri varsa 0019 faylından tapıb əlavə et)
  2. Bütün TS `'USD' | 'TRY'` → `'USD' | 'AZN'`; `formatCurrency` çağırışlarında AZN simvolunun düzgün render olunduğunu yoxla

### 1.6. `turkey` açar remap hack-i
- **Yer:** açar bütün dillərdə (`en.json:138,228`, `az.json:122,228`...), dəyəri "Azerbaijan"; istehlak: `universities-explorer.tsx:121` (`azerbaijan: t("turkey")`), `universities/page.tsx:61`
- **Düzəliş:** 18 faylda açarı `turkey` → `azerbaijan` yenidən adlandır; istehlak yerlərində `t("turkey")` → `t("azerbaijan")`. Sonra `npm run check:i18n` ilə paritet yoxla

---

## 2. ŞƏKİLLƏR — ƏN BÖYÜK QALIQ BLOK

### 2.1. 93 Türkiyə qovluğu, 0 Azərbaycan
- **Yer:** `public/images/universities/` — acibadem, akdeniz, ankara-*, bilkent, bahcesehir... (93 qovluq)
- **Düzəliş (sıra mühümdür — əvvəlcə AZ şəkilləri hazırla, sonra sil):**
  1. 16 AZ universiteti üçün hər biri 1 hero (~1600px WebP) + qalereya (2-3 şəkil) + logo hazırla → `public/images/universities/<slug>/`
  2. Sonra 93 TR qovluğunu sil (bu həm ~250KB SVG logo, həm 416KB webp bounce-u da götürür → performance qazancı)

### 2.2. Türkiyə şəkil xəritəsi canlı importdur
- **Yer:** `src/lib/seed/university-images.ts:13` (`universityHeroImages` ~90 TRuniversitet), `:149+` (logolar); istehlak: `pg-data-repository.ts:3,57,144`, `search-client.tsx:7,205`
- **Düzəliş:** TR girişlərini sil, 16 AZ universiteti üçün yeni xəritə yaz (`baku-state-university: "/images/universities/baku-state-university/hero.webp"` kimi). Xəritədə olmayan slug-lar üçün fallback-i generik şəkilə yönəlt

### 2.3. Axtarış fallback-i qırıq fayla gedir
- **Yer:** `src/components/sections/search-client.tsx:206` — `/images/hero-graduation.webp` (yalnız `.jpg` mövcuddur)
- **Düzəliş:** → `/images/hero-graduation.jpg` (və ya webp versiya yarat — 2.5-ci addımla birlikdə)

### 2.4. 16 universitet ~8 generik şəkil paylaşır
- **Yer:** `src/lib/seed/images.ts:12-56` — `baku-universities.jpg` 4 açara, `why-azerbaijan.jpg` 3 açara; naxcivan/lankaran/mingachevir eyni ganja şəklini alır
- **Düzəliş:** universitet şəkil qovluqları (2.1) hazırlanandan sonra `universities.ts`-də hero/gallery-ləri real şəkillərə keçir; `cityImage`-də hər şəhərə öz şəkli təyin et

### 2.5. `universityHero()` qırıq yol qaytarır
- **Yer:** `src/lib/seed/images.ts:59-62` — `/images/universities/${slug}/hero.webp` qaytarır (AZ üçün mövcud deyil), heç vaxt null qaytarmır, heç yerdə çağrılmır
- **Düzəliş:** ya ölü export-u sil, ya da şəkillər yaranan kimi `fs` yoxlaması olmadan safe-fallback əlavə et (`hero.webp` yoxdursa generik)

### 2.6. Böyük şəkillər
- **Yer:** `public/images/hero-graduation.jpg` (~340KB, LCP mənbəsi — 960px WebP ~60-80KB olmalı); blog JPG-ləri ~1MB
- **Düzəliş:** `scripts/optimize-heroes.mjs` (sharp mövcuddur) ilə batch optimallaşdır; hero-nu `.webp`-ə çevirib `hero-section.tsx:163`-də yenilə

---

## 3. llms.txt FAKTLARI və SİYAHISI

### 3.1. "50+ universities" — realda 16
- **Yer:** `src/lib/seo/llms.ts:20` (KEY_FACTS), `:111` (keyPages), `:156,183` (xülasə)
- **Düzəliş:** "50+ accredited universities represented" → real say (16) və ya "16 partner universities" kimi dəqiq ifadə. AI botlara yanlış fakt = sitat riski

### 3.2. Hub linki ölüdür
- **Yer:** `llms.ts:165` — `${base}/en/study-in-azerbaijan-from`; `src/app/sitemap.ts:41` — eyni path
- **Düzəliş:** hub `page.tsx` YOXDUR → ya səhifəni düzəlt (ölkə gridi + meta), YA linki sitemap-dan və llms.ts-dən çıxar (bax 6.1)

---

## 4. KONFİQ / SKRİPT / SƏNƏD QALIQLARI

| # | Yer | Problem | Düzəliş |
|---|---|---|---|
| 4.1 | `package.json:21,48` | `scrape:studyleo` skripti; `esbuild` dependencies-də (istifadə olunmur) | hər ikisini sil (esbuild override-da qalsın) |
| 4.2 | `scripts/scrape-studyleo.mjs`, `scripts/generate-seed-from-catalog.mjs` | ölü skriptlər (data silinib) | sil |
| 4.3 | `src/lib/crm/supabase-repository.ts` | ölü stub (throw; heç kim import etmir) | sil; `src/lib/crm/db.ts` shimini də |
| 4.4 | `.env.example:17`, `.github/workflows/ci.yml:35,71` | `SUPABASE_ENABLED` vestigial | sil |
| 4.5 | `docs/ops/deploy.md:3,21,22` | "StudyHub ops"; direct (non-pooler) tövsiyəsi; `SUPABASE_ENABLED=true` təlimatı | → "AzStudy ops"; session pooler; sətri sil |
| 4.6 | `whatsapp-float.tsx:17,19`, `chat-widget.tsx:91,95` | `studyhub:chat-open-change` namespace | → `azstudy:chat-open-change` |
| 4.7 | `src/config/site.ts:6,25-28` | `ogImage:'/og.png'` mövcud deyil; telefon/WhatsApp placeholder | og.png yarat və ya sətri sil; real dəyərlər qoy; sosial handle-ları təsdiq et |
| 4.8 | `src/lib/seo/json-ld.ts:39,363` | `availableLanguage` "Turkish" saxlanılıb | qəsdən audit: AZ platformasında tədris dilləri siyahısı nə olmalıdır? (English/Azerbaijani/Russian/Turkish qanunidir, amma qərar ver) |
| 4.9 | `tailwind.config.ts:101,168`, `university-logo-marquee.tsx:13`, `why-choose-us.tsx:10` və s. | "StudyLeo/StudyHub-style" şərhləri | kosmetik təmizlə |
| 4.10 | `0015` miqrasiya adı, `0018` header-i "0016" deyir, `0016` nömrə boşluğu, `src/types/index.ts:76` köhnə şərh, `tests/e2e/programs.spec.ts:3` "StudyLeo catalog" | kosmetik | şərhləri yenilə (tətbiq olunmuş miqrasiya fayl adını dəyişmə) |

---

## 5. SUPABASE / DB

| # | Severity | Problem | Yer | Düzəliş |
|---|---|---|---|---|
| 5.1 | **YÜKSƏK** | RLS-siz cədvəllər — anon açarı ilə PostgREST-dən yazıla bilər: 11 content cədvəli (0011), `leads_dl` (PII!), `admin_allowlist` (anon INSERT!), `schema_migrations` | `0011_content_tables.sql`, `0020`, `0025` | yeni `0029_rls_content.sql` (SKIP_LOCAL-ə əlavə et): content cədvəllərinə `enable row level security` + anon read-only `for select using (true)`; `leads_dl`, `admin_allowlist`, `schema_migrations`-a RLS + heç bir policy (deny-all) |
| 5.2 | **YÜKSƏK** | Tələbə upload Supabase env yoxdursa sərt throw (apply-path zərif placeholder qaytarır — asimmetriya) | `src/lib/supabase/server.ts:13-16`, `src/lib/storage.ts:12-22`, `src/app/actions/student.ts` | student upload-da `getSupabaseServer()` throw-unu tut → aydın xəta mesajı və ya dev-placeholder |
| 5.3 | **YÜKSƏK** | Production prerender Seed-dən oxuyur → DB-yə birbaşa yazılan data statik səhifələrə düşmür | `src/lib/data/index.ts:22-24` | kontent dəyişəndə seed-i də yenilə + redeploy (IS(R)); uzunmüddətli: build-də DB oxumaq üçün pool tuning |
| 5.4 | ORTA | 0007 miqrasiyası seed-li DB-də FK xətası verir | `0007_link_profiles_to_auth_users.sql` | TƏTBİQ ETMƏ — `auth_uid` (0010) əsl linkdir |
| 5.5 | ORTA | Direct connection IPv6-only — CI/Vercel-dən migrate düşə bilər | `deploy.yml` | həmişə **session pooler** URL (5432); transaction pooler (6543) ilə migrate ETMƏ (advisory lock) |
| 5.6 | ORTA | `signOut` action-ları env yoxdursa 500 | `student-auth.ts:38-41`, `admin-auth.ts:45-48` | try/catch-ə al |
| 5.7 | AŞAĞI | `getCached*` funksiyaları cache etmir | `listing-data.ts` | ya `unstable_cache` əlavə et, ya adından "Cached"-i sil |
| 5.8 | — | SKIP_LOCAL miqrasiyaları (0005,0006,0009,0013,0018,0021,0027) runner heç vaxt tətbiq etmir | `scripts/migrate.ts` | Supabase SQL Editor-də əllə, növbə ilə (et.md Faza 3) |

---

## 6. SEO / GEO / AEO

| # | Severity | Problem | Yer | Düzəliş |
|---|---|---|---|---|
| 6.1 | **KRİTİK** | Sitemap mövcud olmayan hub-u sayır → 12 hreflang-lı 404 | `sitemap.ts:41` | hub `page.tsx` düzəlt VƏYA sitemap-dan + `llms.ts:165`-dən çıxar |
| 6.2 | **YÜKSƏK** | Ölkə səhifələri hər slug qəbul edir → limitsiz soft-404 tələsi | `study-in-azerbaijan-from/[country]/page.tsx:19-49` | slug-ı `data.countries.list()` ilə validasiya et + `notFound()` + `generateStaticParams` (143 ölkə) |
| 6.3 | **YÜKSƏK** | 143 ölkə səhifəsi doorway: eyni 6 universitet ×12 dil = 1716 nazik URL | `[country]/page.tsx` | ölkəyə görə universitet kurasiyası, per-ölkə viza faktları, FAQPage JSON-LD VƏYA ~15 real bazarə qısald |
| 6.4 | ORTA | "What is {category} in ?" — boş şəhərlə malformed H2 + FAQPage sualı | `programs/[category]/page.tsx:101-109` (`city: ""`) | şəhərsiz variant açar yarat (`Geo.whatIsCategoryTitle`) və kateqoriya səhifəsində onu istifadə et |
| 6.5 | ORTA | JSON-LD: Review `itemReviewed.name`=slug; `datePublished`="2024" (ISO deyil); Course provider=AzStudy | `json-ld.ts:311-324,174-178` | display name ötür; `YYYY-MM-DD` formatla; provider=universitet |
| 6.6 | ORTA | Blog 14 dilə EN dublikatı; az/ru EN-dən qısa | `src/lib/i18n/lx.ts:13`, `seed/blog.ts` | az/ru mətnlərini EN dərinliyinə çatdır; tərcümə olmayan post-lokal üçün noindex qərarı |
| 6.7 | ORTA | GA4/Clarity consent-siz — GDPR riski | `src/components/seo/analytics.tsx` | consent banner + Google Consent Mode v2 + Clarity qapısı (ID set ETMƏZDƏN ƏVVƏL) |
| 6.8 | ORTA | `INCOMPLETE_LOCALES` şərhi/reallığı köhnəlib (fayllar 734+ sətir, bg/sw de/fr qədər doludur) | `site.ts:55-73` | tərcümə faizini ölç → ya bg/id/so/ur/uz/sw-ni sitemap-a qaytar, ya de/fr-i endir |
| 6.9 | AŞAĞI | `favicon.ico` fallback yoxdur; pagination hreflang query daşıyır | `src/app/` | favicon.ico əlavə et; hreflang alternates-dən query strip et |

---

## 7. TƏHLÜKƏSİZLİK

| # | Severity | Problem | Yer | Düzəliş |
|---|---|---|---|---|
| 7.1 | **YÜKSƏK** | Rate-limit IP açarı `TRUST_PROXY`-siz "unknown"-a çökür → bir qlobal bucket (self-DoS); proxy təmizləmirsə XFF spoof bypass | `src/lib/rate-limit.ts:72-86` | Vercel-də `TRUST_PROXY=1` avtomatik təyin (VERCEL env); "unknown" üçün cookie-əsaslı fallback açar; production-da Upstash yoxdursa build xəbərdarlığı |
| 7.2 | ORTA | Tələbə upload magic-byte sniff etmir (client MIME/genişlənmə etibarlı) | `src/app/actions/student.ts:22-42` | `sniffMime()` istifadə et (upload-apply-document.ts:73-97 pattern-i), genişlənməni sniff-dən törət |
| 7.3 | ORTA | Autentikasiyalı action-lar limit-siz: mesaj flood, limitsiz 10MB upload, limitsiz parol cəhdi | `student.ts`, `staff-management.ts` | `rateLimit` session userId açarı ilə: mesaj 30/dəq, upload 20/dəq, parol 5/saat |
| 7.4 | ORTA | CSP `unsafe-inline` (nonce yoxdur) | `next.config.mjs:95-118` | nonce əsaslı CSP-yə keçid (GA/Clarity loader-ləri ilə) — technical debt kimi təxirə salına bilər |
| 7.5 | ORTA | Auth callback daxili xətaları URL-də əks etdirir + OAuth code prefiksi loglanır | `auth/callback/route.ts:74-99` | generic `?error=auth`; detal yalnız server logunda; code-prefix logunu sil |
| 7.6 | AŞAĞI | `secure` cookie flag `VERCEL=1`-ə bağlanıb (NODE_ENV-ə yox) | `admin-auth.ts:38` | → `NODE_ENV === "production"` |
| 7.7 | AŞAĞI | GoogleSignInButton console.log-ları | `GoogleSignInButton.tsx:67-88` | sil |
| 7.8 | AŞAĞI | next floor `^15.1.0` (lockfile 15.5.23, CVE patchlı) | `package.json:51` | → `^15.5.0` |

Qorunmalı (regressiya etmə): HMAC+timingSafeEqual cookie-lər; production-da SESSION_SECRET fail-closed; dev-auth üçqat qapı; apply upload pipeline; parametrləşdirilmiş SQL; RLS+role-guard+app_user; allowlist choke-point; open-redirect qoruması; tam header dəsti.

---

## 8. PERFORMANCE / UI

| # | Problem | Yer | Düzəliş |
|---|---|---|---|
| 8.1 | Karusel `priority={i < 2*cards.length}` → 24 eager şəkil (LCP) | `featured-universities-carousel.tsx:166` | → `priority={i < perPage}` və ya tam sil (section fold-altıdır) |
| 8.2 | `StudentProfileDrawer` statik header chunk-da | `header-interactive.tsx:26` | `dynamic()` et (GoogleSignInButton pattern-i) |
| 8.3 | HeroSection tam client (search üçün) | `hero-section.tsx` | server shell + client `<HeroSearchForm>` island |
| 8.4 | Mobil menyu Escape/focus-trap-siz | `header-interactive.tsx:201-309` | chat-widget.tsx:43-86 pattern-ini tətbiq et |
| 8.5 | Karusel oxları mobildə gizli; dot label-ləri rəqəm | `featured-universities-carousel.tsx:180` | "Go to slide N" label; mobil üçün keyboard-scroll alternativ |
| 8.6 | FloatingApplyButton "Apply Now" → login-ə gedir | `FloatingApplyButton.tsx:19` | → `/[locale]/apply` |
| 8.7 | Marquee pause idarəetməsi yoxdur | `university-logo-marquee.tsx` | hover/focus pause (reduced-motion artıq var) |
| 8.8 | SVG logo bounce-u | `public/images/universities/**` | 2.1 ilə avtomatik həll (qovluqlar silinir); qalanlar üçün SVGO |

---

## 9. ADMIN / DASHBOARD / CRM — FUNKSİONAL DEŞİKLİRLƏR

| # | Problem | Yer | Düzəliş |
|---|---|---|---|
| 9.1 | `createApplicationAction` backend-i hazırdır, UI çağırmır | `src/app/actions/crm.ts:39`, `pg-repository.ts:271` | admin lead-detail səhifəsinə "Application yarat" düyməsi + zod validasiya + audit |
| 9.2 | Admin mesaj cavablama UI yoxdur | `listMessages`/`sendMessage` repo-da var | lead-detail-da thread + cavab qutusu; hər iki tərəfdə `revalidatePath` |
| 9.3 | Tələbə mesajı yalnız reload-dan sonra görünür | `MessageComposer.tsx:17-19`, `student.ts:18` | göndərəndən sonra `router.refresh()` / `revalidatePath` |
| 9.4 | Yalnız ilk lead-in thread-i görünür | `messages/page.tsx:22` (`leads[0]`) | lead seçici (tablar/select) |
| 9.5 | Render zamanı DB write | `messages/page.tsx:33` (`markThreadReadAction` + catch) | client komponentə / layout-ə keçir |
| 9.6 | Status etiketləri hər yerdə EN | `types/crm.ts:200-211` (`LEAD_STATUS_LABELS`) | next-intl/admin-i18n açarlarına keçir |
| 9.7 | Tələbə "u-bsu" kimi slug görür | dashboard applications/page.tsx:32 | slug→display name resolvasiyası |
| 9.8 | KPI 200+ lead-də yanlış; chip sayımları filtrdə yanlış | `admin/page.tsx:50`, `applications/page.tsx:73-76` | `countLeads()` sorğusu; chip-lər `countByStatus()`-dan |
| 9.9 | Bildirişlər: read-state yoxdur, raw enum göstərilir | dashboard overview | read-state saxla; etiketləri humanize et |
| 9.10 | Public lead-dən sonra tələbəyə heç bir təsdiq getmir | `leads.ts:59-92` | `lead.create` audit (system actor) → dashboard bildirişi; minimal email |
| 9.11 | Profil redaktəsi yoxdur (drawer read-only) | `StudentProfileDrawer.tsx:120-157` | update action + form (ad/telefon/ölkə) |
| 9.12 | Admin səhifələrinin bir hissəsi hardcoded EN | leads/audit/detail/login | admin-i18n lüğətinə keçir |
| 9.13 | CSV export, lead axtarışı, pagination UI yoxdur (repo dəstəkləyir: `LeadFilter.search/consultantId`) | admin leads | axtarış input-u + konsultant filtri + CSV düyməsi |

---

## 10. YOXLAMA / TEST

- [ ] `npm run check:i18n` — açar pariteti (1.6-dan sonra mütləq)
- [ ] Test fixture-lərini AZ data-sına keçir (`tests/e2e/programs.spec.ts` "StudyLeo catalog" describe adı daxil)
- [ ] E2E əlavə: status dəyişmə, application yaratma, mesaj göndər/cavab, allowlist idarəetməsi
- [ ] Launch günü siyahısı → `et.md` son bölməsi

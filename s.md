# s.md — AzStudy SÜRƏT (Performance) AUDİTİ və Optimallaşdırma Planı (v3)

> **Rollar:** Senior Backend · Senior Frontend · Senior UI · Senior Hacker (Security) · Senior SEO · Senior AEO · Senior AI
> **Tarix:** 2026-08-25 · **Metod:** Production build + real TTFB ölçmələri (`next start`, localhost) + kod analizi
> **Ölçmə mühiti:** Windows + OneDrive disk (deployda təkrar yoxlanmalı — OneDrive latency artefaktları mümkün)
> **Bu sənəd köhnə audit sənədini ƏVƏZ edir.** Texniki borc + SEO strategiyası üçün: `seo.md` qüvvədədir.

---

## 0. REAL ÖLÇMƏLƏR (evidence base)

### 0.1 Production build (`next build`, 2026-08-25)
- Compile: 25s (cache-li) / 86s (təmiz) · **1777 statik səhifə** generasiya olundu
- Shared First Load JS: **103 kB** ✅ (yaxşı — 46.4+54.2+2.1 kB chunks)
- Middleware bundle: **107 kB** (hər request-da işləyir)
- Ən ağır route-lar (First Load JS):

| Route | Size | First Load | Revalidate | Status |
|---|---|---|---|---|
| `/[locale]/apply` | 37 kB | **195 kB** | — | 🔴 ən ağır marketing səhifəsi |
| `/[locale]` (home) | 9.74 kB | **181 kB** | 30m | 🟠 |
| `/[locale]/universities` | 11.6 kB | **179 kB** | 1h | 🟠 |
| `/[locale]/programs` | 7.61 kB | 171 kB | — | 🟡 |
| `/[locale]/search` | 11.4 kB | 142 kB | — | 🟡 |
| `/[locale]/blog` | 1.91 kB | 125 kB | 6h | ✅ |
| `/admin/login` | 5.11 kB | 195 kB | — | admin, kritik deyil |

### 0.2 Real TTFB (localhost, production mode)
| URL | TTFB (cold) | TTFB (warm) | **HTML ölçüsü** | Qiymət |
|---|---|---|---|---|
| `/en` | 527ms | **28ms** ✅ | **717 KB** 🔴 | cache-li sürət əla, amma HTML şişkindir |
| `/en/universities` | 175ms | — | **524 KB** 🔴 | şişkin |
| `/en/blog` | 75ms | — | **528 KB** 🔴 | şişkin (62 post) |
| `/en/universities/baku-state-university` | 56ms | — | 301 KB 🟠 | orta |
| `/en/blog/study-at-*` | 42ms | — | 160 KB 🟡 | qəbul edilən |
| `/en/apply` | **4.48s** 🔴 | 3.6s → 0.36s | 294 KB | qeyri-stabil — araşdırılmalı (OneDrive artefaktı şübhəsi) |

### 0.3 Bu sessiyada tapılan və DÜZƏLDİLƏN bug-lar
- ✅ `university-articles.ts`-da 4 lint xətası (build qırılırdı) — düzəldildi
- ✅ `Blog.faqTitle` **18 dilin hamısında çatışmırdı** (blog FAQ bloku raw açar render edirdi) — 18 dilə əlavə olundu, `check:i18n` təmiz

---

## 1. SKORLAR (performans lensi ilə)

| Rol | Skor | Əsas səbəb |
|---|---|---|
| Backend | 7/10 | ISR+RSC intizamı yaxşı; amma saxta cache qatı + middleware şəbəkə xərci |
| Frontend | 6/10 | Shared JS əla (103kB); amma **RSC payload şişliyi** (717KB HTML!) |
| UI | 7/10 | CWV üçün HTML parse cost; şəkillər böyükdür (PNG logolar 180KB) |
| Security | 6.5/10 | Header-lər doludur; CSP `unsafe-inline`, rate-limit deqradasiyada |
| SEO | 8/10 | ISR sürət+freshness balansı düzgün; performans = ranking siqnalı olaraq yaxşı trayektoriyada |
| AEO | 8.5/10 | llms.txt 1h cache, pricing.md static — AI crawl sürəti yaxşı |
| AI | 7/10 | /api/chat edge + validasiya; streaming yoxdur |

**Nəticə:** JS-bundle durumu əladır. **Real problem server→client data nəqlidir**: səhifələr tam data obyektlərini (18-dil nameI18n, description, bütün listing) client komponentlərə ötürür → RSC flight data HTML-i 300-700KB-ə şişirdir. Mobil üçün parse/hydrate cost = yavaş LCP/INP.

---

## 2. 🔴 P0 — ƏN BÖYÜK QAZANCLAR (bir neçə saatlıq iş, 5-10x HTML azalması)

### 2.1 [Frontend] Server→client "view-model proyeksiyası" (pattern-düzəliş, ən kritik)
- **Problemlər:** home 717KB, universities 524KB, blog 528KB HTML. Səbəb: `'use client'` komponentlərə tam obyektlər ötürülür:
  - `universities/page.tsx` → `<UniversitiesExplorer items={...}>` — 46 universitet × (nameI18n 18 dil + description 18 dil + tagline 18 dil + gallery + bütün metadata)
  - home featured karusel/blog karuseli oxşar
  - blog index `data.blog.list()` tam `content` (4KB+) qaytarır (universite-məqalələri ilə 62 post)
- **Düzəliş (hər client komponent üçün):** server-də minimal DTO-ya map et: `{ id, slug, name (yalnız cari locale!), heroImage, tuitionMin, cityLabel, rating, founded }` — 18-dil obyektlərini KƏSİRƏK ötürmək. `lx()` server tərəfdə çağırılıb string ötürülməlidir.
- **Yerlər:** `src/app/[locale]/(marketing)/universities/page.tsx:53-70`, `(marketing)/page.tsx` (featured/blog carousel props), `src/components/sections/featured-universities-carousel.tsx`, `blog-carousel.tsx`, `universities-explorer.tsx` tipləri
- **Hədəf:** home HTML ≤150KB, universities ≤120KB, blog ≤100KB
- **Yoxlama:** `next build && next start` → `curl -w %{size_download}` hər səhifə üçün

### 2.2 [Frontend] `data.blog.list()`-i listing üçün yüngülləşdir
- **Yer:** `src/lib/data/repositories.ts` (DataLayer interfeysi) + `blog/page.tsx:47`
- **Düzəliş:** `data.blog.listSummaries()` əlavə et (yalnız id/slug/title/excerpt/category/cover/publishedAt/readingMinutes — content YOX). Index/karusel bunu işlətsin; `[slug]` detail tam `getBySlug()` saxlasın. University-articles generasiyası (46 post × 4KB content) index-də daşınmamalıdır.
- **Təsir:** blog index 528KB → ~90KB

### 2.3 [Backend] Saxta cache qatını real cache-ə çevir
- **Problemlər:** `src/lib/universities/listing-data.ts` — adı `getCached*`, amma **heç bir cache yoxdur** (birbaşa pass-through `data.universities.listWithMetadata`). Yanıltıcı ad + itirilən performans.
- **Düzəliş:** `unstable_cache`-lə sar (Next 15-də `use cache` eksperimentalı da var):
  ```ts
  import { unstable_cache } from 'next/cache';
  export const getCachedUniversityListing = unstable_cache(
    (filters: UniversityFilters) => data.universities.listWithMetadata(filters),
    ['uni-listing'], { revalidate: 900, tags: ['universities'] });
  export const getCachedCities = unstable_cache(
    () => data.cities.list(), ['cities'], { revalidate: 86400, tags: ['cities'] });
  ```
- Admin edit-dən sonra `revalidateTag('universities')` (6.2 arxitektura məsələsinin ilk addımı)

### 2.4 [Frontend/UI] PNG logoları WebP-yə çevir (~15-20 fayl × 150-190KB)
- **Yer:** `public/images/universities/logos/*.png` (lankaran 189KB, theology 184KB, cooperative 180KB, tourism 180KB, gtu-tech 178KB...)
- **Düzəliş:** `scripts/optimize-images.mjs`-i PNG dəstəkləsin (sharp webp alpha saxlayır; 512px max, q85) → `university-images.ts` logo xəritəsini yenilə. Cəmi ~2.5MB → ~500KB qənaət.
- **Diqqət:** favicon məqsədli PNG-ləri (`public/*.png`, `icons/`) ötür.

### 2.5 [Backend] `/en/apply` qeyri-stabil TTFB (4.5s/3.6s/0.36s)
- **Fakt:** build-də ● (SSG) amma request-da 3.6-4.5s. Hipotezlər: (a) OneDrive disk ilk-oxuma latency (ən güclü şübhə — lokal mühit artefaktı), (b) ISR miss + ağır data fetch, (c) Suspense streaming + loading skeleton gec başlayır.
- **Düzəliş (sıra ilə):** deployda (Vercel) təkrar ölç → durursa: apply səhifəsində `data.*` çağırışlarını `Suspense` arxasına köçür + `loading.tsx` streaming; universitet/proqram siyahılarını 2.1-dəki kimi yüngül DTO ilə ötür (37kB page size da bunu göstərir).

---

## 3. 🟠 P1 — Orqanik sürət qazancları (1-2 həftə)

### 3.1 [Backend] Middleware şəbəkə xərcini azalt
- **Yer:** `src/middleware.ts:110-115` — auth cookie-li HƏR request-də Supabase `getUser()` (şəbəkə RTT). Middleware bundle 107kB.
- **Düzəlişlər:**
  1. Refresh-i yalnız qorunan prefikslərdə işə sal: `/dashboard`, `/admin` (public ISR səhifələrində token refresh gecikə bilər — client `supabase.auth` onsuz da öz refresh edir)
  2. Cookie-dən JWT `exp` parse et (atob, edge-safe) — vaxtı keçməyibsə `getUser()` çağırma
- **Təsir:** login-li istifadəçilərdə hər naviqasiyada ~100-300ms (regiona görə)

### 3.2 [Frontend] Apply səhifəsi JS diet (195kB → hədəf <130kB)
- **Yer:** `src/components/sections/apply-form/*` (RHF+Zod + 5 bölmə client-də)
- **Düzəliş:** multi-step formu `next/dynamic` ilə addım-addım yüklə (1-ci addım visible, qalanları lazy); Zod sxemini validasiya anına qədər dinamik import et
- **Qeyd:** apply konversiya səhifəsidir — LCP birbaşa gəlir deməkdir

### 3.3 [UI/Frontend] Home 12 bölmənin şərtili renderi + lazy hydration
- **Yer:** `(marketing)/page.tsx` — 2 karusel + marquee + calculator + 9 başqa bölmə hamısı eyni anda
- **Düzəliş:** görünüşə girdikdə yüklə (FadeIn onsuz da IntersectionObserver işlədir — komponentin özünü də dynamic import et); `CostCalculator`-ı `ssr:false`+lazy (client-only widget); LogoMarquee-i CSS-only saxla ( onsuz da CSS animasiyalıdır — client JS yoxdursa yaxşı)

### 3.4 [SEO/Frontend] Şəkil delivery tuning
- `next.config.mjs:63-68` AVIF+WebP ✅, `minimumCacheTTL: 86400` ✅
- Əlavə: `deviceSizes`-ə real breakpoint-lər (karusel kartları üçün `(max-width:768px) 100vw, 33vw` sizes artıq var — yoxla hamı üçün), hero `priority+blur` ✅
- Qalan böyük hero-lar (western-university 248KB, baku-state hero-az 182KB) — 1600px-dən 1280px-ə endir (script parametri)

### 3.5 [Backend] OG image build 60s+ timeout
- **Fakt:** build log: `Failed to build /(root)/opengraph-image... took more than 60 seconds. Retrying` — satori render yavaş (Windows+OneDrive). Vercel-də fərqli olar, amma build müddətini uzadır.
- **Düzəliş:** (a) lokal build-lərdə `og` generate ötür (`NEXT_DISABLE_OG=1` env + şərt), və ya (b) statik fallback PNG qoy + runtime-da yalnız locale fərqli başlıqlar üçün dinamik saxla

### 3.6 [AI] `/api/chat` streaming + cold-start
- **Yer:** `src/app/api/chat/route.ts` (edge) — hal-hazırda tam cavab gözləyir
- **Düzəliş:** OpenAI cavabını `ReadableStream` ilə流 et (TTFT <1s); sistem promptunu qısalt; `runtime='edge'` saxla. Ayrıca: model adını env-dən (`OPENAI_MODEL`), temperature 0.3

---

## 4. 🟡 P2 — Təkmilləşdirmə (aylar üzrə)

### 4.1 [Frontend] Dupe karusel/filtr komponentlərinin birləşdirilməsi (seo.md 5.4 ilə üst-üstə düşür)
- 2 bespoke karusel + 2 paralel filtr dəsti → 1 ümumi `Carousel` + 1 `FilterPanel` — JS azalır və patch cost aşağı düşür

### 4.2 [Backend] Revalidate siyasətinin kodlaşdırılması
- Cari: home 30m, universities 1h, blog 6h, sitemap 1d, rss 1h — məntiqlidir ✅
- Əlavə: `revalidateTag` konvensiyası (admin CRUD → content tag-ləri) — build-seed vs runtime-DB divergensiyasının (əvvəlki s.md 6.2) həlli

### 4.3 [Security/Hacker] Performans-təhlükəsizlik kəsişimi
- Rate-limit hələ in-memory (`TRUST_PROXY`/Upstash env təyin edilməyib) → multi-instance də zombiesiz + `/api/chat` büdcəsi qorunmur. **Deploy əvvəli məcburu** (əvvəlki auditdən da açıqdır)
- CSP `script-src 'unsafe-inline'` — GA inline config-ə görə. Növbəti addım: GA-nı nonce/hash ilə (custom loader) → `unsafe-inline` çıxarılşın
- `/api/search` (public, 30/min) — 25 nəticə limiti ✅; DB connection pool max 2 ✅; amma `ilike` query-lər üçün trigram index-lər onsuz var (0012) ✅

### 4.4 [SEO] Crawl budget + Core Web Vitals monitorinqi
- 1777 statik + 4000+ sitemap URL — problem deyil; amma `tests/e2e/core-web-vitals.spec.ts` var → CI-ə Lighthouse CI əlavə et (`@lhci/cli`, budgets: LCP<2.5s, CLS<0.1, TBT<200ms)
- Search Console CWV raportu + CrUX monitorinqi deploydan sonra

### 4.5 [UI] INP/hydation
- 29/160 client komponent — intizamlı ✅. 2.1 həllindən sonra hydration datası da kiçiləcək
- `chat-widget` + `whatsapp-float` + `header-interactive` hər səhifədə — lazy mount onsuz var (`chat-widget-mount`), verify et: yalnız `requestIdleCallback`-dan sonra yüklənsin

---

## 5. ✅ ARTIQ YAXŞI OLANLAR (toxunma — qoru)

- Shared JS 103kB, client namespace trimming (`layout.tsx:16-28` — 11 namespace)
- Geist single-font self-hosted; GA `afterInteractive` + Clarity `lazyOnload`
- ISR matrisi (30m/1h/6h/1d) məntiqli; `minimumCacheTTL 86400` image optimizer
- Hero WebP 120KB (340KB JPG idi), 93 JPG konvertasiya edilib
- Security header dəsti + HSTS preload; `poweredByHeader: false`
- Static generation concurrency = PGPOOL_MAX sync (build DB açlıq düyünü qarşısı alınıb)
- llms.txt (1h), pricing.md, rss.xml (1h) cache-lə; robots AI-botlara açıq
- Supabase miqrasiyalar 0034-dək tətbiq olunub, advisor təmizlənib

---

## 6. İCRA SIRASI VƏ VERIFY

| # | Tapşırıq | Rol | Zaman | Ölçülə bilən nəticə |
|---|---|---|---|---|
| 1 | View-model proyeksiyası (universities + home karusellər) | FE | 3-4h | home HTML ≤150KB |
| 2 | `blog.listSummaries()` | BE | 1h | blog HTML ≤100KB |
| 3 | Real `unstable_cache` listing-data.ts | BE | 1h | warm TTFB sabit <50ms |
| 4 | PNG logo → WebP script extension | FE | 1h | ~2MB disk/bant qənaəti |
| 5 | Apply TTFB re-test (deploy mühitində) | BE | 30dəq | <500ms |
| 6 | Middleware refresh scope | BE | 2h | login-li nav RTT azalır |
| 7 | Apply form lazy steps | FE | 2h | First Load <130kB |
| 8 | OG build skip env | FE | 30dəq | build vaxtı |
| 9 | /api/chat streaming | AI | 2h | TTFT <1s |
| 10 | Lighthouse CI budgets | SEO | 2h | CI qapısı |

**Hər addımdan sonra:** `npm run typecheck && npm run lint && npm test && npm run build` + HTML ölçüsü diff.
**Deployda təkrar ölç:** Vercel region (istifadəçi bazası Yaxın Şərq/Mərkəzi Asiya → `fra1`/`dub1` nəzərdən keçir; Supabase `ap-northeast-1`-dir — **region uyğunsuzluğu** gecikmə əlavə edir, db region dəyişimi uzunmüddətli qərardır).

---

## 7. AÇIQ QƏRARLAR (kod xarici — sahib qərarı)

- [ ] Vercel region seçimi (istifadəçi coğrafiyası vs Supabase Tokyo)
- [ ] Upstash + TRUST_PROXY + SESSION_SECRET env təyini (deploy əvvəli)
- [ ] RLS helper warning-ləri bilərək saxlanılır (əvvəlki auditdə sənədləndi)
- [ ] Content strateji qərarları → `seo.md`-də (məqalə həcmi/klasterlər)

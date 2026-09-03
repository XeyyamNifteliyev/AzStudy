# xeyyam.md — AzStudy Hərtərəfli Senior Audit (v1)

> **Rollar:** Senior Backend · Senior Frontend · Senior AI · Senior UI · Senior Hacker (Security) · Senior SEO · Senior AEO/GEO · Senior Fullstack
> **Tarix:** 2026-03-09 · **Metod:** Kod analizi + `npm run typecheck` (✅ exit 0) + əvvəlki audit sənədlərinin (a.md, s.md, et.md, seo.md) re-verifikasiyası
> **Status işarələri:** ✅ düzəlib (təsdiqləndi) · 🔴 açıq — KRİTİK · 🟠 açıq — yüksək · 🟡 açıq — orta · ⚪ açıq — aşağı/qərar tələb edir

---

## 1. İCRA XÜLASƏSİ (Executive Summary)

Layihə sağlam vəziyyətdədir: typecheck təmiz, shared JS 103 kB (əla), security header dəsti tam, ISR strategiyası məntiqlidir. Köhnə auditi orqanik qalıqların əksəriyyəti (footer linkləri, Türkiyə şəkilləri, karusel LCP) artıq düzəlib.

**Top 5 prioritet (sürət + risk baxımından):**

1. 🔴 **RSC payload şişliyi** — home HTML 717 KB, universities 524 KB, blog 528 KB → view-model proyeksiyası (§6.1) — ən böyük LCP qazancı
2. 🔴 **robots.ts domain uyğunsuzluğu** — hardcoded `https://azstudy.edu.az` (yeni tapıntı, §2.1)
3. 🟠 **Apply səhifəsi 195 kB First Load** — formun lazy step-lərə bölünməsi
4. 🟠 **Rate-limit Upstash env-i deploy əvvəli məcburidir** — multi-instance-də limit `max × instance_count` olur
5. 🟠 **/api/chat streaming yoxdur** — TTFT azaldıcı ən sadə AI qazancı

---

## 2. YENİ TAPINTILAR (bu auditdə ilk dəfə)

### 2.1 🔴 robots.ts hardcoded domain — sitemap-a zərər verə bilər

- **Yer:** `src/app/robots.ts:4` → `const baseUrl = "https://azstudy.edu.az"`
- **Problem:** Saytın qalan hissəsi (`src/config/site.ts:5`) `NEXT_PUBLIC_SITE_URL ?? 'https://azstudy.az'` istifadə edir. Domain hansıdır — `azstudy.edu.az` yoxsa `azstudy.az`? Əgər kanonikal domain `azstudy.az`-dırsa, robots.txt-dəki sitemap URL-i yanlış host-a işarə edir → Search Console sitemap-i qəbul etmir.
- **Düzəliş:** `robots.ts`-də `siteConfig.url` import et:
  ```ts
  import { siteConfig } from "@/config/site";
  // ...
  const baseUrl = siteConfig.url;
  ```
- **Yoxlama:** `NEXT_PUBLIC_SITE_URL`-i hansı domain ilə set etdiyinizi təsdiqləyin; hər iki fayl eyni host-a işarə etməlidir.

### 2.2 ⚪ et.md-dəki ölü kod təmizliyi hələ açıqdır

- `package.json`-dan `scrape:studyleo` skripti, `scripts/scrape-studyleo.mjs`, `scripts/generate-seed-from-catalog.mjs`, `src/lib/crm/supabase-repository.ts`, `src/lib/crm/db.ts` — audit qeydlərinə görə ölü kod, hələ silinməyib. Bundle-a düşmür, amma texniki borcdur.

---

## 3. ✅ DÜZƏLMİŞ (re-verifikasiya təsdiqlədi) — toxunma

| Köhnə problem                                            | Təsdiq                                                                   |
| -------------------------------------------------------- | ------------------------------------------------------------------------ |
| Footer `/study-in-turkey-from/*` 404 linkləri (a.md 1.1) | `footer.tsx:193,203` indi `study-in-azerbaijan-from` edir ✅             |
| 93 Türkiyə şəkil qovluğu (a.md 2.1)                      | `public/images/universities/`-də 47 qovluq, hamısı `azerbaijan-*` ✅     |
| Karusel 24 eager şəkil / LCP (a.md 8.1)                  | `featured-universities-carousel.tsx:170` → `priority={i < perPage}` ✅   |
| llms.txt "50+ universities" yalan faktı (et.md 1D)       | `llms.ts:18` → `UNIVERSITY_COUNT = seedUniversities.length` (dinamik) ✅ |
| `listing-data.ts` saxta cache (a.md 5.7)                 | İndi real `unstable_cache` + revalidate + tags ✅                        |
| Typecheck                                                | `npm run typecheck` → exit 0 ✅                                          |

---

## 4. 🔴 SECURITY (Senior Hacker)

| #   | Problem                                                                                                                                                                                                                         | Yer                                                | Düzəliş                                                             | Prioritet |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------- | --------- |
| 4.1 | Rate-limit production-da Redis-siz işləyirsə per-instance olur; `TRUST_PROXY`+`UPSTASH_*` env təyin edilməlidir (kod dəstəyi var — `rate-limit.ts` Upstash path-i hazır)                                                        | `src/lib/rate-limit.ts`, Vercel env                | Deploy əvvəli env: `TRUST_PROXY=1`, `UPSTASH_REDIS_REST_URL/TOKEN`  | 🟠        |
| 4.2 | CSP `script-src 'unsafe-inline'` — GA inline config-ə görə                                                                                                                                                                      | `next.config.mjs:95`                               | GA-nı nonce/hash ilə yüklə → `unsafe-inline`-i sil                  | 🟡        |
| 4.3 | `/admin` middleware qapısı dev-auth cookie-ni yalnız regex-lə yoxlayır (tam HMAC layout-da) — defense-in-depth OK, amma `DEV_AUTH_ENABLED` production-da ƏSLA olmamalı                                                          | `src/middleware.ts:91-99`, `et.md` qırmızı xətt #5 | Launch checklist-də qorunsun                                        | 🟡        |
| 4.4 | Consent banner yoxdur, amma GA/Clarity konfiqurasiyası var (GDPR — de/fr dilləri mövcuddur)                                                                                                                                     | layout, `et.md` A9                                 | Google Consent Mode v2 + banner ƏVVƏL, sonra GA/Clarity aktivləşsin | 🟠        |
| 4.5 | ✅ Güclü tərəflər: parametrləşdirilmiş SQL, RLS + role-guard, allowlist choke-point, open-redirect qoruması, tam security header dəsti, HSTS preload, chat API-də Zod + rate-limit + origin-check + system-role inject qoruması | —                                                  | Qoru                                                                | —         |

---

## 5. 🟠 BACKEND (Senior Backend)

| #   | Problem                                                                                                                               | Yer                                    | Düzəliş                                                       | Prioritet |
| --- | ------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | ------------------------------------------------------------- | --------- |
| 5.1 | Render-zamanı DB write — mesaj səhifəsi açılan kimi `markThreadReadAction` işləyir (RSC-də side-effect)                               | `dashboard/(app)/messages/page.tsx:33` | Write-ı client interaksiyasına / layout effect-ə keçir        | 🟠        |
| 5.2 | KPI sayımları 200+ lead-də yanlış — client-də slice-dan hesablanır                                                                    | `admin/(dashboard)/page.tsx:50`        | `countLeads()` / `countByStatus()` sorğuları ilə əvəz et      | 🟠        |
| 5.3 | Build-time seed ↔ runtime DB divergensiya riski                                                                                       | prerender səhifələr                    | `revalidateTag` konvensiyası: admin CRUD → content tag-ləri   | 🟡        |
| 5.4 | Region uyğunsuzluğu: Vercel (Yaxın Şərq/Mərkəzi Asiya istifadəçiləri) vs Supabase `ap-northeast-1` — hər DB round-trip-ə ~200ms əlavə | infra                                  | Vercel `fra1`/`dub1` + mümkünsə Supabase region-u yaxınlaşdır | ⚪ qərar  |
| 5.5 | Apply səhifəsi TTFB qeyri-stabil ölçülüb (4.48s cold, localhost + OneDrive)                                                           | deploy mühitində re-test               | Vercel-də <500ms təsdiqlənsin                                 | 🟡        |

---

## 6. 🔴 SÜRƏT / PERFORMANCE (Senior Frontend + Fullstack) — ən ətraflı bölmə

> Real ölçmələr (s.md, production build, localhost): home HTML **717 KB**, universities **524 KB**, blog **528 KB**. Shared JS 103 kB ✅ — problem JS deyil, **server→client data nəqlidir**.

### 6.1 🔴 P0 — View-model proyeksiyası (5-10x HTML azalması, ~3-4h)

- **Problem:** `'use client'` komponentlərə tam data obyektləri ötürülür — hər universitet obyekti 18 dilin `nameI18n`-i, tam description, bütün listing field-ları ilə RSC flight payload-a serializə olunur.
- **Yerlər:** `universities/page.tsx` → `<UniversitiesExplorer items={...}>`; home karusellər; blog index (62 post × tam mətn).
- **Düzəliş:** Server-də client-ə yalnız render üçün lazımi olan düz view-model göndər:

```ts
// server — yalnız 1 dil + yalnız render sahələri
const items = universities.map((u) => ({
  slug: u.slug,
  name: getLocalized(u.nameI18n, locale),
  city: getLocalized(u.cityName, locale),
  minTuition: u.minTuition,
  heroUrl: u.heroUrl,
  rating: u.rating,
}));
```

Hədəf: home HTML ≤ 150 KB, universities ≤ 150 KB.

### 6.2 🔴 P0 — Blog `listSummaries()` (~1h)

- Blog index səhifəsinə 62 post-un TAM mətni gedir. `DataLayer`-ə `listSummaries()` (yalnız title + excerpt + slug + date + cover) əlavə et. Hədəf: blog HTML ≤ 100 KB.

### 6.3 🟠 Apply səhifəsi JS diet (195 kB → hədəf <130 kB)

- Multi-step form-un görünməyən addımlarını `next/dynamic` ilə lazy yüklə; Zod sxemini validasiya anına qədər dinamik import et. Apply = konversiya səhifəsidir → LCP birbaşa gəlir deməkdir.

### 6.4 🟠 HeroSection server shell + client island

- `hero-section.tsx` tam client komponentdir — yalnız axtarış formu client tələb edir. Server shell + `<HeroSearchForm>` island-ə böl.

### 6.5 🟠 StudentProfileDrawer header chunk-dan çıxarılmalı

- `header-interactive.tsx` → `StudentProfileDrawer`-ı `dynamic()` import et (mövcud `GoogleSignInButton` pattern-i kimi).

### 6.6 🟡 PNG logo → WebP

- `public/images/universities/**` daxilində ~180 KB PNG logo-lar var → `scripts/optimize-heroes.mjs`-i WebP-ə genişləndir (~2 MB bant qənaəti).

### 6.7 🟡 UI/a11y detalları

- Mobil menyu: Escape + focus-trap yoxdur (`chat-widget.tsx` pattern-i tətbiq olunsun)
- Karusel dot label-ləri "Go to slide N" olsun; mobil üçün keyboard/scroll alternativi
- Marquee: hover/focus-də pause
- `FloatingApplyButton` hədəfi login deyil `/[locale]/apply` olmalıdır

### 6.8 🟡 Digər

- Lighthouse CI (`@lhci/cli`) — budgets: LCP<2.5s, CLS<0.1, TBT<200ms → CI qapısı
- `chat-widget` + `whatsapp-float` mount-u `requestIdleCallback`-dan sonra təsdiqlənsin
- Sitemap/ISR matrisi (30m/1h/6h/1d) ✅ məntiqlidir — qoru

---

## 7. 🟠 AI (Senior AI)

| #   | Problem                                                                                                                    | Yer                                 | Düzəliş                                                                                                  | Prioritet |
| --- | -------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------- | --------- |
| 7.1 | `/api/chat` non-streaming — tam cavab yığılandan sonra göndərilir → TTFT uzun                                              | `src/app/api/chat/route.ts:102-125` | OpenAI `stream: true` + SSE/ReadableStream cavab; hədəf TTFT <1s                                         | 🟠        |
| 7.2 | Chat botunun system prompt-u saytdakı real data ilə sinxron deyil (context grounding yoxdur)                               | `chat/route.ts:28-33`               | Prompt-a `llms.txt`-dən compact context əlavə et və ya RAG-lite: axtarış nəticələrini prompt-a inject et | 🟡        |
| 7.3 | ✅ Güclü tərəflər: Zod validasiya (system-role inject qadağası), edge runtime, rate-limit, origin-check, graceful fallback | —                                   | Qoru                                                                                                     | —         |

---

## 8. 🟠 SEO + AEO/GEO (Senior SEO + AEO)

| #   | Problem                                                                                                                                                                                                                                                    | Yer                                  | Düzəliş                                                                                       | Prioritet |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ | --------------------------------------------------------------------------------------------- | --------- |
| 8.1 | robots.ts sitemap domain riski — bax §2.1                                                                                                                                                                                                                  | `robots.ts:4`                        | `siteConfig.url`                                                                              | 🔴        |
| 8.2 | 14 dil üçün məzmun dərinliyi siyasəti yoxdur — nazik lokal səhifələr site-wide keyfiyyət siqnalını aşağı salır                                                                                                                                             | `INCOMPLETE_LOCALES`, `et.md` A10    | Qərar: ya tam tərcümə, ya per-lokal noindex/canonical default-a                               | 🟠        |
| 8.3 | Blog az/ru mətnləri EN dərinliyindən geridədir                                                                                                                                                                                                             | blog content                         | Dərinliyi EN səviyyəsinə çatdır və ya noindex et                                              | 🟠        |
| 8.4 | 143 ölkə səhifəsi template-yə bənzər — fərqləndirilməyibsə doorway riski                                                                                                                                                                                   | `study-in-azerbaijan-from/[country]` | Ölkəyə görə fərqləndir (viza faktları, FAQPage JSON-LD, kurasiya) və ya real bazarlara qısald | ⚪ qərar  |
| 8.5 | ✅ Güclü tərəflər: hreflang alternates + sitemap xhtml:link, JSON-LD dəsti tam, llms.txt + pricing.md + rss.xml dinamik, AI botlara robots açıq (GPTBot/PerplexityBot/ClaudeBot), CCBot/Bytespider bloklu, yalnız tam tərcümə olunmuş dillər sitemap-dadır | —                                    | Qoru                                                                                          | —         |

---

## 9. 🟡 CRM / ADMIN / DASHBOARD funksionallığı (detallar a.md §9-da)

- Application yaratma backend-i hazır, UI çağırmır (`crm.ts:39`)
- Admin mesaj cavablama UI yoxdur; tələbə mesajı reload-dan sonra görünür (`router.refresh()`)
- `messages/page.tsx:22` — yalnız `leads[0]` thread-i görünür; lead seçici lazımdır
- Status etiketləri hardcoded EN (`types/crm.ts:200-211`) → admin-i18n
- Profil redaktəsi yoxdur (drawer read-only)
- CSV export / lead axtarışı / pagination UI yoxdur (repo dəstəkləyir)

---

## 10. SÜRƏTLİ İCRA SIRASI (təklif)

| #   | Tapşırıq                                                | Rol   | Təxmini vaxt | Ölçülə bilən nəticə      |
| --- | ------------------------------------------------------- | ----- | ------------ | ------------------------ |
| 1   | `robots.ts` → `siteConfig.url` (§2.1)                   | SEO   | 10 dəq       | robots/sitemap eyni host |
| 2   | View-model proyeksiyası: home + universities (§6.1)     | FE    | 3-4h         | home HTML ≤150 KB        |
| 3   | Blog `listSummaries()` (§6.2)                           | BE    | 1h           | blog HTML ≤100 KB        |
| 4   | Apply lazy steps (§6.3)                                 | FE    | 2h           | First Load <130 kB       |
| 5   | Ölü kod təmizliyi (§2.2)                                | FS    | 30 dəq       | repo təmizliyi           |
| 6   | `/api/chat` streaming (§7.1)                            | AI    | 2h           | TTFT <1s                 |
| 7   | HeroSection island (§6.4) + Drawer dynamic (§6.5)       | FE    | 2h           | statik chunk kiçilir     |
| 8   | Consent Mode v2 banner (§4.4)                           | FS    | 2h           | GDPR uyğunluq            |
| 9   | Upstash/TRUST_PROXY env (§4.1) + deploy re-ölçmə (§5.5) | OPS   | 1h           | 429 testi, TTFB <500ms   |
| 10  | PNG→WebP (§6.6) + UI detalları (§6.7)                   | FE/UI | 2h           | ~2MB bant qənaəti        |

**Hər addımdan sonra:** `npm run typecheck && npm run lint && npm test` + HTML ölçüsü diff.

## 11. AÇIQ QƏRARLAR (sahib qərarı)

- [ ] Kanonikal domain: `azstudy.az` yoxsa `azstudy.edu.az`? (§2.1-i həll edir)
- [ ] 14 nazik dil üçün siyasət: tərcümə vs noindex (§8.2)
- [ ] 143 ölkə səhifəsi: fərqləndirmə vs qısaltma (§8.4)

## 12. XARİCİ AUDİT İDDİALARININ VERİFİKASİYASI (ikinci AI hesabatı)

> Hər iddia kodda tək-tək yoxlanıldı. Nəticə: **12 DOĞRU**, **5 SƏHV/köhnə**, 3-ü artıq bu sənəddə mövcuddur.

### 12.1 ✅ DOĞRU — kod təsdiqlədi (yeni icma maddələri)

| #   | İddia                                                                                                                                                                                                                     | Kod sübutu                                                                             | Düzəliş                                                                                                              | Effort |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ------ |
| A   | Rate-limit: TRUST_PROXY=1 deyilsə hər IP `"unknown"` qaytarılır → bütün anonim istifadəçilər EYNİ bucket-i paylaşır → bir istifadəçi limiti dolduranda hamı üçün search/chat bloklanır (özünə-DoS)                        | `rate-limit.ts:75-85` — `return "unknown"`                                             | `assertEnv()`-də production-da `TRUST_PROXY` yoxlanılsın (error və ya xəbərdarlıq)                                   | 15 dəq |
| B   | `DEV_AUTH_ENABLED` production-da build-time bloklanmır — yalnız sənədləşdirmə xəbərdarlığı var                                                                                                                            | `next.config.mjs assertEnv()`-də yoxdur; istifadə yalnız `student-session-server.ts:4` | `assertEnv()`-ə əlavə et: `if (process.env.NODE_ENV === "production" && process.env.DEV_AUTH_ENABLED === "1") throw` | 10 dəq |
| C   | `isAllowedOrigin()`: Origin header olmayan sorğu keçir (dizayn gereği OK — browser Origin saxtalaşdıra bilməz), AMMA localhost origin-ləri (`:3000`, `:3100`) NODE_ENV yoxlaması olmadan production-da da allowlist-dədir | `origin.ts:16-17`                                                                      | localhost-ları yalnız `NODE_ENV !== "production"`-da əlavə et                                                        | 5 dəq  |
| D   | `/api/chat` OpenAI fetch-inə timeout/AbortController yoxdur → asılı OpenAI cavabı funksiyanı 25-30s tutur                                                                                                                 | `chat/route.ts:102` — `signal` yoxdur                                                  | `AbortSignal.timeout(10_000)` əlavə et, fallback mesaj qaytar                                                        | 20 dəq |
| E   | Chat-də qlobal (bütün istifadəçilər üzrə) gündəlik xərc tavanı yoxdur — yalnız per-IP/dəq limit                                                                                                                           | `chat/route.ts:26`                                                                     | Upstash-da sadə gündəlik counter + kəsmə həddi                                                                       | 30 dəq |
| F   | `/api/search` `q` parametrinə uzunluq limiti yoxdur (route-da da, repo-da da yalnız `.trim()`) — injection riski YOXDUR (parametrized)                                                                                    | `search/route.ts:22`, `pg-data-repository.ts:903`                                      | route-da `q = q.slice(0, 100)`                                                                                       | 5 dəq  |
| G   | Pool runtime max=2 — serverless instans daxilində 3+ paralel sorğu növbəyə düşür                                                                                                                                          | `db.ts:14` (`PGPOOL_MAX` override mümkündür)                                           | Production-da `PGPOOL_MAX=4-5` ölçülə bilən şəkildə test et                                                          | ölçmə  |
| H   | 23 universitet logo PNG optimallaşdırılmayıb (100-190KB) — kumulyativ ~1-2MB                                                                                                                                              | `public/images/universities/**` — 23 `.png`                                            | WebP/SVG-ə çevir (`sharp` onsuz da dependency-dir)                                                                   | 1-2h   |
| I   | Marquee "eager + low fetch priority" hack-i — qeyri-standart IO davranışı, brauzerlər arası fərqli                                                                                                                        | `university-logo-marquee.tsx:63-68`                                                    | `loading="lazy"` + real Lighthouse ölçməsi ilə sına                                                                  | 1h     |
| J   | Apply form: `aria-invalid` ✅ var, amma `aria-describedby` ilə xəta mesajına bağlantı YOXDUR                                                                                                                              | `apply-form/*.tsx` — 7 sahədə yalnız aria-invalid                                      | hər sahəyə `aria-describedby={errorId}` + ilk xətalı sahəyə fokus                                                    | 1-2h   |
| K   | `NEXT_PUBLIC_SITE_URL` formatı yoxlanılmır (yalnız presence) — səhv format bütün canonical/hreflang/JSON-LD-ni səhv yönəldər                                                                                              | `next.config.mjs:32-52`                                                                | assertEnv-də regex: `^https:\/\/[a-z0-9.-]+[^/]$`                                                                    | 10 dəq |
| L   | llms.txt yalnız EN — çoxdilli AEO yoxdur (tr/az/ru sorğuları üçün)                                                                                                                                                        | `llms.ts` — EN string-lər                                                              | `/[locale]/llms.txt` versiyaları — AŞAĞI prioritet                                                                   | 3h     |

### 12.2 ❌ SƏHV / KÖHNƏ — əlavə EDİLMƏDİ (kod əksini sübut etdi)

| #   | İddia                                               | Reallıq                                                                                                                                                                                                                               |
| --- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | "/api/health sadəcə statik 200 qaytarır"            | **Səhv** — `health/route.ts:20-25` real `select 1` + 2.5s timeout ilə DB-ni yoxlayır, DB öləndə 503 qaytarır. 10san keş təklifi isteğe bağlı mikro-optimizasiyadır                                                                    |
| 2   | "CWV test dekorativdir, threshold assertion yoxdur" | **Səhv** — `core-web-vitals.spec.ts:62-63` real `toBeLessThan(2500)` (LCP) + `toBeLessThan(0.1)` (CLS) assertion-ları var. Yeganə əskiklik: INP assertion-ı yoxdur                                                                    |
| 3   | "Karusel dot label-ləri aria-label-sızdır"          | **Səhv/köhnə** — `featured-universities-carousel.tsx:185` artıq `aria-label="Go to slide ${i+1}"` var                                                                                                                                 |
| 4   | "Logger PII sızdırır"                               | **Əsasən səhv** — `logger.ts` PII-siz dizayn olunub (docstring + serializeError məhdudlaşdırıcı); `leads.ts:83` yalnız `{ ip }` loglayır. Hər hansı gələcək log əlavəsində PII qadağası lint qaydası faydalı ola bilər (nice-to-have) |
| 5   | "npm audit işlədilməli"                             | **Hazırda təmiz** — `npm audit --omit=dev` → `found 0 vulnerabilities`. Dependabot PR-larının merge olunması yaxşı praktikadır, amma aktıv problem yoxdur                                                                             |

**Qeyd — font (#13):** Geist `geist/font/sans` paketi ilə yüklənir (next/font əsaslı, default `display: swap`) — yoxlanıldı, əlavə sazlamaya ehtiyac yoxdur.

### 12.3 Artıq bu sənəddə mövcud olanlar

- robots.ts domain (bu hesabatın #1) → §2.1
- CSP `unsafe-inline` → §4.2
- 143 ölkə səhifəsi thin-content riski → §8.4
- Admin CRM E2E/funksional boşluqları → §9

### 12.4 Yenilənmiş icra sırasına əlavələr (§10-a daxil edilməli)

| #   | Tapşırıq                                                                              | Effort | Ölçülə bilən nəticə                   |
| --- | ------------------------------------------------------------------------------------- | ------ | ------------------------------------- |
| 11  | TRUST_PROXY + DEV_AUTH_ENABLED + SITE_URL format yoxlamaları `assertEnv()`-də (A+B+K) | 30 dəq | səhv env ilə production build QIRILIR |
| 12  | `/api/search` q.slice(0,100) (F)                                                      | 5 dəq  | —                                     |
| 13  | OpenAI `AbortSignal.timeout(10s)` (D)                                                 | 20 dəq | max chat gecikməsi 10s                |
| 14  | localhost origin NODE_ENV qapısı (C)                                                  | 5 dəq  | attack surface kiçilir                |
| 15  | Logo PNG→WebP (H)                                                                     | 1-2h   | ~1-2MB bant qənaəti                   |
| 16  | Chat gündəlik qlobal büdcə sayğacı (E)                                                | 30 dəq | OpenAI xərci tavana bağlanır          |
| 17  | Apply form aria-describedby (J)                                                       | 1-2h   | WCAG AA + konversiya                  |

## 13. İCRA STATUSU — SESSİYA 1 (2026-03-09)

> Aşağıdakı maddələr kodda düzəldildi. Yoxlama: `npm run typecheck` ✅ · `npm run lint` ✅ · `npm test` → **157/157 yaşıl** ✅

| Maddə                                         | Fayl                                           | Status                                                                                                      |
| --------------------------------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| §2.1 robots.ts hardcoded domain               | `src/app/robots.ts`                            | ✅ DÜZƏLDİ — `siteConfig.url` (env) istifadə edir; domain gələndə sadəcə `NEXT_PUBLIC_SITE_URL` set olunur  |
| §12.4-A TRUST_PROXY self-DoS                  | `next.config.mjs` + `src/lib/rate-limit.ts`    | ✅ DÜZƏLDİ — production build-də xəbərdarlıq; Vercel-də (`VERCEL=1`) proxy avtomatik güvənlidir             |
| §12.4-B DEV_AUTH_ENABLED production bloku     | `next.config.mjs assertEnv()`                  | ✅ DÜZƏLDİ — production build QIRILIR                                                                       |
| §12.4-K NEXT_PUBLIC_SITE_URL format yoxlaması | `next.config.mjs assertEnv()`                  | ✅ DÜZƏLDİ — Vercel-də bare https origin məcburi; domain yoxluğu üçün lokal `http://localhost:*` icazəlidir |
| §12.4-F /api/search q limiti                  | `src/app/api/search/route.ts`                  | ✅ DÜZƏLDİ — `q.slice(0, 100)`                                                                              |
| §12.4-D OpenAI timeout                        | `src/app/api/chat/route.ts`                    | ✅ DÜZƏLDİ — `AbortSignal.timeout(10_000)`                                                                  |
| §12.4-E qlobal gündəlik xərc tavanı           | `src/app/api/chat/route.ts`                    | ✅ DÜZƏLDİ — `OPENAI_DAILY_BUDGET` env (default 1500/gün, bütün istifadəçilər)                              |
| §12.4-C localhost origin attack surface       | `src/lib/security/origin.ts`                   | ✅ DÜZƏLDİ — localhost yalnız dev-də; Vercel `*.vercel.app` preview-ları preview-də icazəlidir              |
| §12.4-J aria-describedby                      | `apply-form/primitives.tsx` + `index.tsx`      | ✅ DÜZƏLDİ — `Field` primitive mərkəzi naqilləmə edir; ilk xətalı sahəyə avtomatik fokus                    |
| §6.7 mobil menyu focus-trap                   | `src/components/layout/header-interactive.tsx` | ✅ DÜZƏLDİ — Tab dövrü drawer daxilində saxlanılır                                                          |
| §6.7 FloatingApplyButton                      | `FloatingApplyButton.tsx`                      | ✅ ARTIQ DÜZGÜNDÜR — `/[locale]/apply`-yə gedir                                                             |
| §6.5 StudentProfileDrawer dynamic             | `header-interactive.tsx:26`                    | ✅ ARTIQ DÜZGÜNDÜR — `dynamic()` ilə yüklənir                                                               |

**Hələ açıqdır (növbəti sessiyalar):** §6.1 view-model proyeksiyası (ən böyük sürət qazancı), §6.2 blog `listSummaries()`, §6.3 apply lazy steps, §4.2 CSP nonce, §7.1 chat streaming, §12.4-H logo PNG→WebP, §8.2-8.4 SEO strategiya qərarları.

## 14. İCRA STATUSU — SESSİYA 2 (2026-03-09)

> §6.1 View-model proyeksiyası — **universities listing TAMAMLANDI** (home karuselləri və blog ayrıca mərhələdir).
> Yoxlama: typecheck ✅ · lint ✅ · test 157/157 ✅ · production build ✅

**Nə edildi:**

- ✅ **Yeni:** `src/lib/universities/view-model.ts` — `UniversityCardVM` + `toUniversityCardVM()` / `toCityOptions()`: server tərəfdə 18-dil `nameI18n`, `tagline`, `description`, `gallery` sahələri client-ə ÖTÜRÜLMÜR; yalnız kart/filtr/sort-un istehlak etdiyi sahələr gedir
- ✅ `UniversityCardView` indi VM-dən render edir (kart komponenti tam prezentasiyadır)
- ✅ `UniversityCard` (server wrapper) VM-ə proyeksiya edir
- ✅ `listing-query.ts`: VM variantları `filterUniversityVMs()` / `sortUniversityVMs()` (köhnə funksiyalar + testlər toxunulmaz qalıb)
- ✅ `universities/page.tsx` + `universities-explorer.tsx` + `university-filters.tsx` VM-lərə keçirildi; şəhər filtr üçün də slim `CityOptionVM`
- ✅ JSON-LD (CollectionPage + ItemList) VM-lərdən qurulur — SEO dəyişməz

**Ölçülə bilən nəticə (production build, localhost):**

| Səhifə                  | ƏVVƏL  | İNDİ       | Qazanc      |
| ----------------------- | ------ | ---------- | ----------- |
| `/en/universities` HTML | 524 KB | **380 KB** | **-27%**    |
| Shared First Load JS    | 103 kB | 103 kB     | dəyişməz ✅ |

**Qalan §6.1 işi:** home karuselləri (featured universities/programs) və blog index üçün eyni proyeksiya pattern-i; §6.2 blog `listSummaries()`. Home ölçüsü bu sessiyada toxunulmadı (814 KB ölçüldü — karusel mərhələsi ayrıca icra olunacaq).

- [ ] Vercel region seçimi (fra1/dub1) + Supabase region köçürməsi (§5.4)

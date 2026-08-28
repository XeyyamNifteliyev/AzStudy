# et.md — AzStudy Launcha Qədər Edəcəklərim (v2 — a.md v2 ilə sinxron)

> Hər fazanı bitirəndə `npm run typecheck && npm run lint && npm test` işə sal.
> Bu v2 plandır — v1-dəki bir çox iş artıq TAMAMLANIB (a.md §7-ə bax). Burada yalnız qalan iş var.
> Faza 1-2 bitmədən Supabase bağlama (Faza 3).

---

## FAZA 0 — Təcili təmizlik (qalan hissə, ~15 dəq)

- [x] ~~Kökdən sil: yok-main.js, hero-graduation.jpg, bachelor-programs.json, studyleo-state-programs.json, loglar~~ — ARTIQ SİLİNİB
- [x] ~~.gitignore env/qovluq örtüyü~~ — ARTIQ VAR (.env* + !.env.example, /commandcode/ və s.)
- [x] ~~public/robots.txt, llms.txt, pricing.md sil~~ — ARTIQ SİLİNİB
- [ ] `package.json`-dan sil: `esbuild` dependencies-dən (override-da qalsın), `scrape:studyleo` skripti (F7)
- [ ] Sil: `scripts/scrape-studyleo.mjs`, `scripts/generate-seed-from-catalog.mjs` (data artıq yoxdur, skriptlər ölü)
- [ ] Sil: `src/lib/crm/supabase-repository.ts` (ölü stub), `src/lib/crm/db.ts` shim
- [ ] `.env.example` + `ci.yml`-dən `SUPABASE_ENABLED`-i tam sil (artıq heç bir kod oxumur)

## FAZA 1 — Köhnə sayt qalıqlarının bitirilməsi

### 1A. İstifadəçiyə görünən (KRİTİK)
- [ ] **Q1:** `footer.tsx:184,194` — `/study-in-turkey-from/*` → `/study-in-azerbaijan-from/*` (produksiya 404!)
- [ ] **Q2:** `opengraph-image.tsx` — 9 dilin başlığını Azərbaycan üçün yenidən yaz (ru, de, fr, ar, fa, zh, tk, kk, ky); monoqram "S" → "A" (L102)
- [ ] **Q3:** `az.json:362,605,615,620` — Geo blokundan Türkiyə faktlarını təmizlə ("türk viza" → Azərbaycan viza konteksti, "İngilis və türk dilləri" → real dil siyahısı). TR/RU fayllarında da eyni açarları yoxla
- [ ] **Q4:** `pricing.md/route.ts:95` — "Türkiye Bursları" sətrini Azərbaycan dövlət təqaüdü ilə əvəz et
- [ ] **Q6:** `turkey` açarını bütün dillərdə `azerbaijan`-a yenidən adlandır + `universities-explorer.tsx:121` (və `universities/page.tsx:61`) `t("turkey")` çağırışlarını düzəlt
- [ ] `npm run check:i18n` işə sal — açar paritetini yoxla, çatışmayan açarları doldur

### 1B. Valyuta (AZN)
- [ ] Yeni miqrasiya `0028_azn_currency.sql`: `up_currency_check` constraint-ini `('USD','AZN')`-ə dəyiş (0019:39)
- [ ] `src/types/index.ts:87,104` və `pg-data-repository.ts:116,461`-də `"USD" | "TRY"` → `"USD" | "AZN"`; `university-detail/programs.tsx`, `dormitories.tsx`-də eyni tiplər
- [ ] `json-ld.ts:39,363` — `availableLanguage` siyahısını qəsdən auditi et (AZ platformasında nələr göstərilir: English/Azerbaijani/Russian/Turkish qalsınmı?)

### 1C. Şəkillər (ən böyük qalıq bloku)
- [ ] **Q7:** `public/images/universities/` — 93 Türkiyə qovluğunu sil (içindəki 250KB SVG logo, 416KB webp də gedir → F3/F5 avtomatik həll)
- [ ] **Q8:** `university-images.ts` — ~90 Türkiyə xəritəsini sil; 16 AZ universiteti üçün yeni hero/logo xəritəsi yaz (pg-data-repository.ts:3 və search-client.tsx:7 canlı import edir!)
- [ ] 16 Azərbaycan universiteti üçün real şəkillər tap/yarat (`public/images/universities/<slug>/hero.webp` + logo) — hazırda 16 universitet ~8 generik blog şəkli paylaşır (Q10); naxcivan/lankaran/mingachevir eyni şəkli alır
- [ ] **Q9/F2:** `search-client.tsx:206` — fallback-i `/images/hero-graduation.jpg`-yə düzəlt (və ya .webp versiya yarat)
- [ ] `images.ts:59-62` — `universityHero()` ölü exportdur: ya sil, ya da şəkil qovluqları yaranan kimi null-fallback əlavə et
- [ ] Qalan böyük şəkilləri optimallaşdır: `public/images/hero-graduation.jpg` (~340KB → 960px WebP, F4), blog JPG-ləri — `scripts/optimize-heroes.mjs` mövcuddur

### 1D. llms.txt faktları
- [ ] `llms.ts` — "50+ accredited universities" → real say (16) ilə əvəz et (L20, L111, L156, L183)
- [ ] **A3:** `/study-in-azerbaijan-from` hub səhifəsini YA düzəlt, YA sitemap-dan (sitemap.ts:41) və llms.ts:165-dən çıxar — 12 hreflang-lı 404

### 1E. Konfiq/sənəd
- [ ] `docs/ops/deploy.md` — "StudyHub ops" → AzStudy (L3); `SUPABASE_ENABLED=true` sətrini sil (L22); "direct (non-pooler)" tövsiyəsini session pooler ilə əvəz et (L21, S6)
- [ ] `whatsapp-float.tsx` + `chat-widget.tsx` — event namespace `studyhub:*` → `azstudy:*`
- [ ] `site.ts` — real telefon/WhatsApp qoy; `ogImage`-ı sil və ya public/og.png yarat; sosial handle-ların real olduğunu təsdiq et
- [ ] `favicon.ico` fallback əlavə et (A11)
- [ ] Kosmetik: backup.yml:46 şərhi, tailwind/marquee/why-choose-us "StudyLeo/StudyHub-style" şərhləri, 0015 miqrasiya şərhi, 0018 header-i (0016→0018), types/index.ts:76 şərhi, tests fixture-ləri ("StudyLeo catalog" describe adı)

## FAZA 2 — Security + SEO düzəlişləri

### Security
- [ ] **T2:** rate-limit — Vercel-də `TRUST_PROXY=1` avtomatik təyin et (VERCEL env ilə); IP "unknown" düşəndə cookie-əsaslı fallback; production-da Upstash xəbərdarlığı
- [ ] **T3:** `student.ts` upload — `sniffMime()` istifadə et (upload-apply-document kimi), genişlənməni sniff-dən törət
- [ ] **T4:** Autentikasiyalı action-lara rate-limit: mesaj 30/dəq, upload 20/dəq, parol 5/saat (session userId ilə)
- [ ] **S2:** tələbə upload yoluna apply-path kimi zərif dev-placeholder və ya aydın xəta qoy (`getSupabaseServer()` throw-unu tut)
- [ ] **T6:** CSP nonce keçidi (technical debt kimi təxirə salına bilər)
- [ ] **T7:** auth callback — generic `?error=auth`, detal yalnız server logunda
- [ ] **T1'/T8:** `secure` flag-i `NODE_ENV==="production"`-a bağla; middleware cookie-presence yoxlaması üçün şərh/edge-HMAC; GoogleSignInButton console.log sil; next floor `^15.5.0`

### SEO/GEO
- [ ] **A4:** ölkə slug validasiyası + `notFound()` + `generateStaticParams` (143 ölkə)
- [ ] **A7:** "What is {category} in ?" — şəhərsiz variant açarı yarat (`city: ""` ötürülmür)
- [ ] **A7b:** JSON-LD: Review name=display name + ISO tarix; Course provider=universitet
- [ ] **A9:** Consent banner + Google Consent Mode v2 + Clarity qapısı (GA4/Clarity aktivləşməzdən ƏVVƏL)
- [ ] **A10:** `INCOMPLETE_LOCALES`-i yenidən ölç (şərh 734 sətirlik reallıqdan danışır) — ya bg/id/so/ur/uz/sw-ni bərpa et, ya de/fr-i endir
- [ ] **F1:** karusel `priority={i < perPage}` (24 eager şəkli kəs — ən böyük LCP qazancı)
- [ ] **F5:** StudentProfileDrawer-ı `dynamic()` et
- [ ] **A8:** blog az/ru mətnlərini EN dərinliyinə çatdır; 14 lokal üçün siyasət qərarı (tərcümə və ya per-lokal noindex)
- [ ] **A5 (uzunmüddətli):** 143 ölkə səhifəsini fərqləndir (ölkəyə görə universitet kurasiyası, viza faktları, FAQPage JSON-LD) — və ya real ~15 bazarə qısald
- [ ] A11: pagination hreflang query təmizləməsi

## FAZA 3 — Supabase bağlantısı (Faza 1-2 bitəndən sonra)

### Kod hazırlığı
- [x] ~~S1: SUPABASE_ENABLED çöküşü~~ — ARTIQ PROBLEM DEYİL (crm/index.ts birbaşa Pg; stub Faza 0-da silinir)
- [ ] **S3:** Yeni miqrasiya `0029_rls_content.sql` (SKIP_LOCAL-ə əlavə et): 11 content cədvəlinə RLS + anon üçün read-only `for select using (true)`; `leads_dl` və `admin_allowlist`-ə RLS + heç bir policy (deny-all); `schema_migrations`-a da RLS
- [ ] **S7:** `signOut` action-larını try/catch-ə al

### Supabase layihəsi (addım-addım)
1. Supabase layihəsi yarat (region: Vercel deploy-a yaxın)
2. Auth → URL Configuration: Site URL + Redirect URL-lər (`http://localhost:3000/auth/callback`, `https://azstudy.az/auth/callback`)
3. Auth → Providers: **Google** (OAuth client) + **Email** aç
4. Connection string: **SESSION POOLER** götür (`...pooler.supabase.com:5432`) — direct IPv6-only-dır, CI/Vercel işləməz!
5. `DATABASE_URL="<pooler>" npm run db:migrate`
6. Supabase SQL Editor-də əllə, NÖVBƏ İLƏ: 0005 → 0006 → 0009 → 0013 → 0018 → 0021 → 0027 → 0029 (0007-i TƏTBİQ ETMƏ! — S5)
7. Kontent yüklə: `DATABASE_URL="<pooler>" npx tsx scripts/seed-content.ts` (db:seed YOX — o seed.sql demo CRM də yükləyir)
8. SQL Editor: `alter role app_user password '<güclü-random>';` → `APP_DATABASE_URL` düzəlt
9. Vercel env-lər: DATABASE_URL (pooler), APP_DATABASE_URL, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, SESSION_SECRET (`openssl rand -hex 32`), INITIAL_ADMIN_EMAIL, TRUST_PROXY=1, NEXT_PUBLIC_SITE_URL=https://azstudy.az, UPSTASH_*, OPENAI_API_KEY/GA/Clarity (istəyə bağlı)
10. Google ilə INITIAL_ADMIN_EMAIL-də gir → /admin bootstrap yoxla → /admin/users-da real staff email-lərini allowlist-ə yaz
11. GitHub secrets: PROD_DATABASE_URL (pooler), VERCEL_*; ENABLE_NIGHTLY_BACKUP=true
12. deploy.md-nin yeniləndiyini yoxla (Faza 1E-də düzəldilib)

## FAZA 4 — Funksional yarımçıqlıq (launch üçün minimum)

- [x] ~~Lead → Application backend (`createApplication` + zod)~~ — HAZIRDIR
- [ ] **createApplicationAction-ı admin UI-ya bağla:** lead detail səhifəsində "Application yarat" düyməsi (backend var, UI yoxdur)
- [ ] **Admin mesajlaşma UI:** lead detail-da thread + cavab qutusu; hər iki tərəfdə `revalidatePath` (mesaj reload tələb etməsin)
- [ ] **Mesaj threading:** dashboard messages səhifəsində lead seçici (`messages/page.tsx:22` `leads[0]` hardcode); render-zamanı write-ı (`markThreadReadAction` L33) client/layout-ə keçir
- [ ] **Status etiketlərinin lokallaşdırılması:** `LEAD_STATUS_LABELS` (types/crm.ts:200-211) → next-intl/admin-i18n
- [ ] **Tələbə tərəfi:** universitet slug→ad resolvasiyası; profil redaktəsi (ad/telefon/ölkə)
- [ ] **KPI düzəlişi:** `countLeads()` sorğusu; chip sayımları `countByStatus()`-dan (200+ lead-də yanlışdır)
- [ ] **Bildirişlər:** read-state saxlanması; public lead-ə `lead.create` audit (system actor) → tələbə təsdiqi görür
- [ ] **Apply sonrası təsdiq:** minimal — email və ya dashboard bildirişi
- [ ] Admin səhifələrinin qalanını admin-i18n-yə keçir (leads, audit, detail, login)

## FAZA 5 — Son toxunuşlar

- [ ] **F6:** HeroSection-u server shell + client search island-ə böl
- [ ] Mobil menyu Escape + focus-trap (chat-widget pattern-i)
- [ ] Karusel dot label-ləri ("Go to slide N") + mobil idarəetmə
- [ ] FloatingApplyButton hədəfini düzəlt (/apply-yə getsin — hazırda login-ə gedir)
- [ ] Marquee üçün pause idarəetməsi

---

## ETMƏMƏLİKƏR (qırmızı xətlər) ⛔

1. **0007 miqrasiyasını TƏTBİQ ETMƏ** — seed-li DB-də FK xətası verir; `auth_uid` (0010) əsl linkdir (S5)
2. **Production-da `db:seed` / `db:reset` İŞLƏTMƏ** — seed.sql demo admin profile-lər yeridir və 0007-ni bloklayır
3. **Direct connection string-i (`db.<ref>.supabase.co`) CI/Vercel-də istifadə etmə** — IPv6-only. Həmişə session pooler (5432). Transaction pooler (6543) ilə də `db:migrate` işlətmə (advisory lock uyğunsuzluğu)
4. **`SUPABASE_SERVICE_ROLE_KEY`-i heç vaxt NEXT_PUBLIC prefiksi ilə qoyma / client-ə yollama**
5. **Production-da `DEV_AUTH_ENABLED=1` QOYMА**; SESSION_SECRET güclü random olsun (production-da kod artıq throw edir — amma dəyəri yenə də güçlü təyin et)
6. **GA4/Clarity ID-ni consent banner olmadan aktivləşdirmə** (GDPR — de/fr dilləri var)
7. **Faza 1 bitmədən saytı indexləməyə buraxma** — Search Console-a əlavə etmə, sitemap göndərmə
8. **`public/images/universities`-dəki Türkiyə qovluqlarını AZ şəkilləri olmadan silmə** — əvvəlcə 16 AZ universitetin şəkillərini hazırla, sonra dəyişdir (yoxsa hamısı generik/qırıq fallback-ə düşər)
9. **Seed data ilə DB data-sını qarışdırma** — production prerender Seed-dən oxuyur (S4); kontent dəyişəndə həm seed-i, həm DB-ni yenilə, sonra redeploy
10. **`INITIAL_ADMIN_EMAIL`-i allowlist kurasiya olunandan sonra env-də saxlama**
11. **StudyLeo scraper-ı geri qaytarma** — data qəsdən silinib
12. **Public qovluğa robots.txt/llms.txt/pricing.md qaytarma** — dinamik routelar tək mənbədir

## LAUNCH GÜNÜ YOXLAMA SİYAHISI ✅

- [ ] `DEV_AUTH_ENABLED` yoxdur; SESSION_SECRET güclüdür
- [ ] `TRUST_PROXY=1` + Upstash set; iki IP ayrıca limit alır (429 test)
- [ ] Anon REST ilə `profiles`/`leads`/`leads_dl`/`admin_allowlist` SELECT → DENIED (S3 verify)
- [ ] Hər iki bucket `public=false`
- [ ] Client bundle-da service-role açarı YOXDUR (grep)
- [ ] `curl -I` — CSP/HSTS/nosniff görünür
- [ ] /admin, /dashboard redirect edir; login səhifələri işləyir
- [ ] robots.txt dinamik versiyadır; sitemap-da 404 YOXDUR (hub linki daxil)
- [ ] llms.txt faktları realdır (universitet sayı); bütün linklər 200
- [ ] Footer-də `/study-in-turkey-from` linki QALMAYIB
- [ ] OG şəkli (9 dil) Azərbaycan deyir; monoqram "A"
- [ ] Apply formu tam dövr: göndər → admin-də görün → application yarat → status → tələbə dashboard-da görünür
- [ ] Mesaj göndər/cavab reload-suz işləyir
- [ ] Testlər yaşıl: `npm run typecheck && npm run lint && npm test && npm run test:e2e`
- [ ] /api/health yaşıl; backup cron yaşıl; `leads_dl` boşdur

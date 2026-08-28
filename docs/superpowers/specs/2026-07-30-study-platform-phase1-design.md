# Türkiyədə Təhsil Platforması — Phase 1 MVP (Dizayn Sənədi)

> **Mənbə spesifikasiya:** `Study.md` (tam 16–20 həftəlik enterprise platforma).
> **Dizayn sistemi:** `design/kinetic_horizon/DESIGN.md` (Kinetic Horizon — Precision Minimalism).
> Bu sənəd yalnız **Phase 1 MVP**-ni əhatə edir. Backend/CRM/admin/AI növbəti fazalardadır.

---

## 1. Məqsəd və Əhatə

Platformanın dizayn sistemini, SEO əsasını və əsas istifadəçi axınlarını sübut edən **keyfiyyətli, işlək marketing/qabaq təbəqə** qurmaq. Canlı backend yoxdur — data seed əsaslıdır, lakin təmiz data-access qatı sonradan Supabase qoşmağa imkan verir.

### Daxildir
- Ana səhifə, About, Contact
- Universitet siyahısı + **detal səhifəsi** (spec §10-un 11 bölməsi)
- Proqrammatik SEO səhifələri (Program × City, seed-dən), ölkə landing-ləri, compare
- Blog (2–3 seed), Apply lead formu (Zod-validasiyalı Server Action, mock)
- 4 dil: `en/tr/az/ru` (LTR, RTL-hazır arxitektura)
- Tam SEO: metadata, JSON-LD, bölünmüş sitemap-lar, robots, hreflang, OG
- Unit (Vitest) + E2E (Playwright) testləri

### Xaricdədir (növbəti fazalar)
- Supabase/Prisma, RLS, real auth, OTP, OAuth
- Meilisearch/Typesense axtarış
- CRM pipeline, tələbə dashboard-u, admin paneli, AI alətləri
- Qalan 13 dil, 100k+ miqyaslı proqrammatik səhifələr

---

## 2. Texniki Stack

| Qat | Texnologiya | Səbəb |
|---|---|---|
| Framework | Next.js 15 (App Router) + TypeScript | spec §1, ISR/SSG dəstəyi |
| Stil | Tailwind CSS + shadcn/ui | DESIGN.md dizayn sistemi |
| Font | Geist (başlıq/UI) + Inter (mətn) | DESIGN.md |
| i18n | next-intl | spec §3 tövsiyəsi |
| Render | Marketing=SSG, universitet/proqram=ISR | spec §2 |
| Validasiya | Zod | form təhlükəsizliyi |
| Test | Vitest + Playwright | unit + E2E |
| Perf | next/image (AVIF/WebP), font-display:swap, minimal JS | LCP<1.5s hədəfi |

---

## 3. Arxitektura — Data Qatı (Adapter Pattern)

UI yalnız **repository interfeyslərinə** müraciət edir:

```ts
interface UniversityRepository {
  list(filters?: UniversityFilters): Promise<University[]>
  getBySlug(locale: Locale, slug: string): Promise<University | null>
  getRelated(locale: Locale, slug: string, n: number): Promise<University[]>
}
```

- **İndi:** `SeedRepository` — TypeScript modullarından oxuyur.
- **Faza 2:** `SupabaseRepository` əlavə edilir, `lib/data/index.ts`-də tək flip nöqtəsi.

Fayda: xarici asılılıq yoxdur, test edilə bilən, Supabase keçidi sızdırmaz.

---

## 4. Beynəlxalq Dəstək (i18n)

- URL strukturu: `/[locale]/...`, locale-lər: `en | tr | az | ru`
- `x-default` → `en`; mövcud olmayan locale → `/en`
- Brauzer dilinə görə **təklif banneri** (məcburi yönləndirmə yox — SEO üçün zərərli)
- **UI sətirləri:** `messages/{en,tr,az,ru}.json`
- **Məzmun tərcüməsi:** seed-də locale sahələri (məs: `name: { en, tr, az, ru }`)
- RTL-hazır: `dir` atributu + CSS logical properties (`ms-`/`me-`, `text-start`)

---

## 5. Səhifə İnventarı (hamısı `/[locale]/` altında)

| Route | Strategiya | Əsas məzmun |
|---|---|---|
| `/` | SSG | Hero, statistika, CountryTabs, UniversityGrid, CostCalculator, SuccessStories, FAQ, CTA |
| `/about`, `/contact` | SSG | Statik məzmun |
| `/universities` | SSG | Siyahı + filtr (degree, city, dil, qiymət) |
| `/universities/[slug]` | ISR 3600s | 11 bölmə (spec §10) |
| `/programs/[category]/[city]` | ISR 3600s | Proqrammatik kombinasiya |
| `/study-in-turkey-from-[country]` | SSG | Ölkə-spesifik landing |
| `/compare` | SSG | Universitet müqayisəsi |
| `/blog`, `/blog/[slug]` | ISR | 2–3 seed məqalə |
| `/apply` | SSG + Server Action | Lead forması |

Plus: `robots.ts`, `sitemap.ts` + `sitemap-universities.xml`, `sitemap-programs.xml`, `sitemap-blog.xml`, `manifest.ts`, `not-found.tsx`, `error.tsx`, `loading.tsx`.

---

## 6. SEO Strategiyası (Phase 1)

- `generateMetadata` hər səhifədə: title, description, canonical, OpenGraph, Twitter
- **JSON-LD builder-ləri** (spec §8): Organization, WebSite+SearchAction, CollegeOrUniversity+AggregateRating, Course+Offer, Article+BreadcrumbList, FAQPage, Review
- **Avtomatik hreflang** — bütün 4 dil üçün `generateAlternates`
- Bölünmüş sitemap-lar; image sitemap hazırlığı
- `robots.txt` — admin/dashboard bloklanır (gelecek), statik səhifələr icazəli
- Canonical — kombinasiya dublikatlarına qarşı

---

## 7. Universitet Detal Səhifəsi (11 bölmə — spec §10)

1. Hero (şəkil, ad, şəhər, reytinq, Apply CTA)
2. Sürətli faktlar cədvəli
3. Proqramlar siyahısı (degree filtri)
4. Təqaüd imkanları
5. Tədris haqqı cədvəli (valyuta seçimi)
6. Yataqxana məlumatı
7. Kampus qalereyası
8. Tələbə rəyləri (verified badge)
9. FAQ
10. Oxşar universitetlər (daxili link)
11. Sticky "Apply Now" (mobil-friendly)

---

## 8. Təhlükəsizlik (Phase 1)

- CSP / təhlükəsizlik header-ləri (`next.config`)
- Input sanitization + Zod validasiya
- Server Action rate-limit hazırlığı (in-memory Faza 1, Redis Faza 2)
- Şifrələmə/sənəd saxlama Faza 2-yə (Supabase)

---

## 9. Performans Hədəfləri

| Metrik | Hədəf |
|---|---|
| LCP | < 1.5s |
| INP | < 200ms |
| CLS | < 0.1 |
| Lighthouse | 90–100 |

---

## 10. Qovluq Strukturu

```
study/
  src/
    app/
      [locale]/...
      robots.ts, sitemap*.ts, manifest.ts
      layout.tsx, not-found.tsx, error.tsx, loading.tsx
    components/{layout,sections,ui,seo}/
    lib/{data(repos),seed,seo,i18n,validations,utils}/
    config/site.ts
    messages/{en,tr,az,ru}.json
    types/
    middleware.ts
  tests/{unit,e2e}/
  design/, Study.md
```

---

## 11. İcra Topluları

0. Scaffold + config + design token-lər
1. Fontlar + UI primitivləri + elevation/shape
2. next-intl + 4 locale + RTL-hazır
3. Layout (Header/Footer/WhatsAppFloat)
4. Data qatı (tiplər spec §7, seed, repository)
5. SEO foundation
6. Ana səhifə bölmələri
7. Universitet detal + listing + filtr
8. Programs×City + ölkə landing-ləri + compare
9. Blog + Apply
10. not-found/error/loading + a11y + perf
11. Testlər + Lighthouse
12. lint/typecheck/build + README

---

## 12. Qeydlər və Risklər

- "Google-da #1" zəmanəti yoxdur (spec §17); biz yalnız ən yaxşı texniki əsası qururuq.
- Miqyas (100k+ səhifə) bu fazaya daxil deyil.
- Git repo kökü `C:\Users\Asus`-dır; commit zamanı yalnız `study/` faylları stage olunmalıdır.

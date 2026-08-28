# StudyLeo Proqram Kataloqu İnteqrasiyası — Dizayn

**Tarix:** 2026-08-09
**Status:** Təsdiqlənmiş dizayn

## 1. Məqsəd

StudyLeo-nun (https://www.studyleo.com/en/programs) 6,241 proqramını, qiymətlərini, universitetlərini və loqolarını bu layihəyə gətirib, StudyLeo kimi 10/səhifə pagination ilə təqdim etmək. Hər proqram kartında: universitet adı + loqosu (adın solunda), proqram adı, dərəcə, müddət, dil, endirimli + orijinal qiymət, Apply düyməsi.

## 2. Data axını

```
StudyLeo (625 səhifə) → scripts/scrape-studyleo.mjs → normalizə → JSON cache
                                                                    ↓
                                        public/images/universities/{slug}/logo.svg
                                                                    ↓
                            seed faylları yenilənir (src/lib/seed)
                                                                    ↓
                            npm run db:seed → Postgres
                                                                    ↓
                            Next.js səhifələri (pagination, filters, cards)
```

## 3. Məlumat mənbəyi

StudyLeo səhifələrində hər proqram üçün **embedded JSON-LD** (`EducationalOccupationalProgram`) mövcuddur:

```json
{
  "name": "Dental Prosthetics Technology",
  "provider": [{ "name": "Istanbul Medipol University", "logo": "https://studyleo-production-bucket.s3.eu-north-1.amazonaws.com/university/2/logo_image/...webp" }],
  "offers": { "priceCurrency": "USD", "lowPrice": 3600, "highPrice": 4000 },
  "educationalCredentialAwarded": "Associate",
  "timeToComplete": "P2Y"
}
```

- **lowPrice** → endirimli qiymət (`tuition_fee`)
- **highPrice** → orijinal qiymət (`original_fee`); `lowPrice == highPrice` olduqda `original_fee = NULL`
- Dil proqram kartından (Languages bölməsi), şəhər fakültə/universitet kontekstindən alınır.

## 4. Skript: `scripts/scrape-studyleo.mjs`

Manual işlədilir: `npm run scrape:studyleo`.

**İşləmə qaydası:**
1. `https://www.studyleo.com/en/programs?page=1`-dən başlayaraq 625 səhifəni gəzir (10/səhifə).
2. Hər səhifədən JSON-LD bloklarını parse edir.
3. Normalizə edir:
   - **Universitetlər:** ad, slug (mövcud pattern-ə görə slugify), loqo URL, featured image URL, şəhər, quruluş ili, tələbə sayı (universities səhifəsindən). `is_state` StudyLeo məlumatından gəlmir — bütün yeni StudyLeo universitetləri `is_state = false` (özəl) qəbul edilir, çünki StudyLeo kataloqu əksərən vakıf (özəl) universitetlərdir; dövlət universitetləri mövcud seed-da artıq `true` ilə qeyd olunub və toxunulmur.
   - **Proqramlar:** ad, slug, dərəcə (`associate`/`bachelor`/`master`/`phd`), müddət (P2Y→2), kateqoriya xəritələmə.
   - **university_programs:** `tuition_fee` (lowPrice), `original_fee` (highPrice və ya NULL), dil, valyuta USD.
4. Çıxış: `scripts/data/studyleo-catalog.json` (yenidən işlədilə bilən cache).
5. Loqoları S3 CDN-dən `public/images/universities/{slug}/logo.svg`-a endirir; mövcud universitetlər üçün yalnız loqo yenilənir.
6. Yeni universitetlər üçün featured image də endirilib `hero.webp` kimi saxlanılır.

**Şəkil domaini:** `studyleo-production-bucket.s3.eu-north-1.amazonaws.com` — `next.config.mjs` remotePatterns-ə əlavə olunur (yalnız skript üçün deyil, əgər bir yerdə remote qalırsa).

## 5. Verilənlər bazası dəyişiklikləri

### Migration `0015_studyleo_catalog.sql`

```sql
alter table public.university_programs
  add column if not exists original_fee numeric(12,2);

create index if not exists up_category_slug_idx
  on public.university_programs (program_id);
```

- `original_fee NULL` = endirim yoxdur (yalnız `tuition_fee` göstərilir).
- `original_fee > tuition_fee` olduqda UI endirimli qiyməti vurğulayıb orijinalın üstündən xətt çəkir.

### Tiplər (`src/types/index.ts`)

```ts
export interface UniversityProgram {
  // ...mövcud
  tuitionFee: number;        // endirimli qiymət
  originalFee?: number;      // orijinal (endirimsiz) qiymət
  scholarshipAvailable: boolean;
}
```

### Seed faylları

- `src/lib/seed/programs.ts` — StudyLeo-dan gələn yeni proqramlar əlavə olunur (mövcud olanlar qorunur).
- `src/lib/seed/universities.ts` — yeni universitetlər əlavə olunur.
- `src/lib/seed/university-programs.ts` — `originalFee` sahəsi ilə birlikdə yenilənir.
- `src/lib/seed/university-images.ts` — yeni loqo/hero yolları əlavə olunur.

## 6. Kateqoriya xəritələmə

StudyLeo fakültələri → bizim 15 kateqoriya, proqram adına görə keyword xəritəsi:

| StudyLeo proqram adı keyword-ləri | Kateqoriya |
|---|---|
| medicine, medical, doctor, tıp | `medicine` |
| dentistry, dental, diş | `dentistry` |
| engineering, mühendislik, computer eng | `engineering` |
| computer, software, data, cybersecurity, ai | `computer-science` |
| business, management, marketing, finance, economics, trade | `business` |
| law, hukuk | `law` |
| architecture, mimarlık | `architecture` |
| design, art, fashion, music, cinema, graphic | `arts` |
| nursing, physiotherapy, pharmacy, health, nutrition, psychology | `health-sciences` |
| tourism, hotel, gastronomy | `tourism` |
| agriculture, food | `agriculture` |
| mathematics, physics, chemistry, biology, natural | `natural-sciences` |
| history, literature, philosophy, language | `humanities` |
| journalism, communication, media, radio, pr | `communication` |
| sociology, political, international relations, social | `social-sciences` |
| *heç biri uyğun gəlmirsə* | `social-sciences` (loglanır) |

Xəritə `scripts/scrape-studyleo.mjs` içində `CATEGORY_KEYWORDS` kimi saxlanılır. Uyğun gəlməyən hər proqram üçün xəbərdarlıq loglanır ki, sonra əl ilə düzəldilsin.

### 6a. Yeni şəhərlər

StudyLeo-da mövcud seed-ya daxil olmayan şəhərlər ola bilər (Mersin, Trabzon, Konya artıq var...). Skript:
- Universitetin şəhərini `src/lib/seed/cities.ts`-dəki mövcud şəhər slug-ları ilə müqayisə edir.
- Tapılmayan şəhər üçün `cities.ts`-ə yeni qeyd əlavə edir (bütün 17 lokal `LocalizedString` üçün eyni ad, `monthlyLivingCostUSD` üçün ölkə ortalaması ~$500).
- Əl ilə düzəliş üçün yeni şəhərlərin siyahısını skript çıxışında loglayır.

## 7. UI / Səhifələmə

### `/programs?page=N` (1..625)

- `generateStaticParams` bütün səhifə nömrələrini pre-render edir (`COUNT(*)` / 10 = 625 səhifə).
- Hər səhifədə 10 proqram.
- Cədvəl sütunları: **Loqo+Universitet** (loqo adın solunda, StudyLeo kimi), **Proqram**, **Dərəcə+Müddət**, **Şəhər**, **Dil**, **Qiymət** (endirimli vurğulanır + orijinal üstü xətt), **Apply**.
- Pagination: Previous/Next + səhifə nömrələri, `?page=N`.
- SEO: `rel=prev/next`, səhifə nömrəsi ilə `og:title`, canonical `?page=N`.
- Filters (mövcud `ProgramFilters`) qalır: kateqoriya + şəhər + axtarış, `page` parametri ilə birlikdə işləyir.

### `/programs/[category]`, `/programs/[category]/[city]`

- Dəyişiklik yoxdur — eyni data təbəqəsi ilə işləyir, səhifələmə əlavə olunmur (kateqoriya başına məhdud sayda proqram).
- Qiymət göstərimi: `originalFee` varsa endirimli + üstü xətt çəkilmiş orijinal.

## 8. Repository dəyişiklikləri (`pg-data-repository.ts`)

- `rowUniversityProgram` → `original_fee` sütununu oxuyub `originalFee`-yə çevirir.
- `list()` / `getByCategory` / `getByCategoryAndCity` / `getAllPrograms` SQL-lərinə `original_fee` əlavə olunur.
- Pagination üçün yeni repository metodları:
  - `programs.countAll()` → `COUNT(*)`
  - `programs.listPage(page, perPage, filters)` → LIMIT/OFFSET ilə səhifələnmiş siyahı
- `ProgramFilters`-in mövcud kombinasiya mantığı dəyişmir.

## 9. Şəkil yolları

- Loqolar: `public/images/universities/{slug}/logo.svg` (mövcud pattern-ə əlavə).
- Yeni universitet hero: `public/images/universities/{slug}/hero.webp` (StudyLeo featured image-dən).
- `university-images.ts` map-i hər ikisini ehtiva edir.

## 10. Testlər

- **Skript normalizasiyası** (`tests/unit/scrape-normalize.test.ts`):
  - Qiymət parse: `$3,600`/`$4,000` → `{low: 3600, high: 4000}`; `$3,600`/`$3,600` → `original_fee = null`.
  - Kateqoriya xəritələmə: `"Dental Prosthetics Technology"` → `dentistry`, `"Computer Engineering"` → `computer-science`, naməlum → default + log.
  - Slug normalizasiyası.
- **Repository** (`tests/unit/student-repository.test.ts` və ya yeni `programs-repository.test.ts`):
  - `originalFee` düzgün oxunur (NULL → `undefined`).
  - `listPage` səhifələmə: səhifə 2, perPage 10 → offset 10, doğru qeydlər.

## 11. Build zamanı davranışı

- `generateStaticParams` səhifə nömrələrini DB-dən hesablayır; DB əlçatan deyilsə mövcud try/catch pattern-i `[]` qaytarır (on-demand render).
- 625 səhifəlik pre-render build müddətini artırır — gözlənilən davranışdır, ISR (`revalidate`) aktiv qalır.

## 12. Scope xaricində

- Hər proqram üçün ayrıca `/programs/[slug]` səhifəsi yoxdur (sessiya qərarı).
- Avtomatik cron/cd yeniləmə yoxdur — yalnız manual `npm run scrape:studyleo`.
- StudyLeo-nun fakültə anlayışı ayrıca model kimi əlavə olunmur.

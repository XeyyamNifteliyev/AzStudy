# Türkiyədə Təhsil Platforması — Phase 4: GEO/AEO + Schema Tamamlanması + Performans (Dizayn Sənədi)

> **Mənbə:** `Study.md` §5 (GEO), §6 (AEO), §8 (schema-lar), §12 (performans); `faza4.md` (Faza 4 roadmap).
> **Vəziyyət:** Faza 1-3 bitib. Audit: 7 schema builder var, amma HowTo/Review/ImageObject yoxdur; 7 səhifədə JSON-LD yoxdur; GEO blokları yoxdur; AEO absent.
> **Hazırkı vəziyyət:** 4A və 4B-nin bir hissəsi işlənib (uncommitted): 6 yeni schema builder `json-ld.ts`-də, `<GeoBlock>` komponenti yaradılıb, `Geo` i18n namespace-i 4 dilə əlavə edilib — amma heç bir səhifədə inteqrasiya olunmayıb. Bu sənəd 4B-nin tamamlanmasını, 4C və 4D-ni əhatə edir.

---

## 0. Qərarlar

| Qərar | Seçim | Səbəb |
|---|---|---|
| GEO blok dil əhatəsi | Yalnız 4 dil (en/tr/az/ru) — guard ilə | `Geo` namespace yalnız 4 dildə var; 14 dildə xəta qarşısı alınır |
| Guard mexanizmi | Komponentin özündə (`<GeoBlock locale>` + `isGeoLocale`) | Tək yer, DRY; hər yeni səhifə avtomatik qorunur |
| Visa prosesi | Universal 5 addım (bütün ölkələr üçün eyni) | Türkiyə tələbə vizası ölkədən asılı deyil |
| Tərif blokları | Görünən "What is...?" + FAQPage schema-ya sual | Sadə; AEO təmin edilir; DefinedTerm yoxdur (YAGNI) |
| Font swap | Artıq var — dəyişiklik yoxdur | `Inter({ display: 'swap' })` + GeistSans |
| Şəkil priority/sizes | Audit + kiçik düzəlişlər | Əksər yerlərdə artıq var; hero `sizes` dəqiqləşdiriləcək |
| Komit | 3 ayrı komit (4A+4B, 4C, 4D) | Hər alt-faza öz commit; geri qaytarma asan |

---

## 1. Məqsəd və Əhatə

### Daxildir
- **4B:** `<GeoBlock>` guard + 3 səhifəyə inteqrasiya (universitet detalı, proqram kombinasiyası, ölkə landing)
- **4C:** Apply "How to apply" + HowTo schema; ölkə "Visa process" + HowTo schema; "What is...?" tərif blokları + FAQPage
- **4D:** Hero `sizes`; galeriya `priority`; CLS audit; `preconnect`; build/lint/typecheck
- `faza4.md` status cədvəlinin yenilənməsi

### Xaricdədir
- `Geo` namespace-in 14 dillə genişlənməsi (gələcək)
- Ölkə-spesifik visa məzmunu (gələcək)
- `ImageObject`/`VideoObject` schema (gələcək)
- Lighthouse/CWV CI quraşdırılması (ayrı iş)

---

## 2. Arxitektura: guard mexanizmi

### Yeni fayl: `src/lib/seo/geo.ts`

```ts
import type { AppLocale } from '@/i18n/routing';

/** Locales that have a `Geo` message namespace in their messages JSON. */
export const GEO_LOCALES = ['en', 'tr', 'az', 'ru'] as const;

/** True when the locale has GEO/AEO content translations available. */
export function isGeoLocale(locale: string): boolean {
  return (GEO_LOCALES as readonly string[]).includes(locale);
}
```

### `<GeoBlock>` dəyişikliyi (`src/components/seo/geo-block.tsx`)

`locale: AppLocale` prop əlavə edilir. Komponentin ilk sətri guard olur:

```tsx
export function GeoBlock({ locale, shortAnswer, summary, pros, cons, className }) {
  if (!isGeoLocale(locale)) return null;  // yeni guard
  if (!shortAnswer && !summary?.length && !hasProsCons) return null;  // movcud
  // ... qalan hisse deyismez
}
```

**Nəticə:** 14 dildə komponent `null` qaytarır — xətasız, layout-shift yoxdur.

---

## 3. 4B — GEO bloklarının 3 səhifəyə inteqrasiyası

Hər 3 səhifədə `<GeoBlock>` hero-dan sonra yerləşdirilir. `pros`/`cons` üçün `Geo.pros1`–`pros4`, `Geo.cons1`–`cons2` açarları istifadə olunur.

### 3.1 Universitet detalı — `universities/[slug]/page.tsx`
**Yerləşmə:** hero-dan sonra, "Quick Facts"-dən əvvəl.

- **`shortAnswer`:** `Geo.universityShortAnswer` ({name, type, city, year, languages, tuition, accreditation, students}) — `{type}` = `detail.type === 'state' ? t('typeState') : t('typePrivate')`
- **`summary`:** Founded, Students, City, Type, Languages, Tuition from, Accreditation (mövcud `facts`-dan)
- **`pros`/`cons`:** `Geo.pros1`–`pros4`, `Geo.cons1`–`cons2`

### 3.2 Proqram kombinasiyası — `programs/[category]/[city]/page.tsx`
**Yerləşmə:** statcard-lardan sonra, programs table-dan əvvəl.

- **`shortAnswer`:** `Geo.programShortAnswer` ({category, city})
- **`summary`:** Category, City, Programs count, Universities count, Min tuition, Languages
- **`pros`/`cons`:** eyni

### 3.3 Ölkə landing — `study-in-turkey-from-[country]/page.tsx`
**Yerləşmə:** hero-dan sonra, info cards-dan əvvəl.

- **`shortAnswer`:** `Geo.countryShortAnswer` ({country})
- **`summary`:** hər label/value Geo açarlarından (4 dil):
  - Country → `{name}` (data)
  - Visa type → `Geo.visaTypeValue` ("Student visa")
  - Tuition from → `Geo.tuitionFromValue` ("$1,500/year")
  - Language → `Geo.languageValue` ("English & Turkish")
  - Application support → `Geo.supportValue` ("Free")
- **`pros`/`cons`:** eyni

---

## 4. 4C — AEO strukturları

### 4.1 Apply səhifəsi — "How to apply" (`apply/page.tsx`)
- Görünən `<ol>` 5 addım — Geo açarları artıq var (`step1Name`–`step5Name`, `step1Text`–`step5Text`, `howToApplyTitle`)
- Trust badges-dən sonra, ApplyForm-dan əvvəl
- JSON-LD: `howToJsonLd(steps)` — builder artıq var, `serviceJsonLd`-ya paralel massivə əlavə
- Guard: `isGeoLocale(appLocale)`

### 4.2 Ölkə landing — "Visa process" (`study-in-turkey-from-[country]/page.tsx`)
**Yeni i18n açarları** Geo namespace-ə 4 dildə:

| Açar | en |
|---|---|
| `visaHowToTitle` | "Visa & residence process" |
| `visaStep1Name` | "Get your acceptance letter" |
| `visaStep1Text` | "Your university issues an official acceptance letter required for the visa." |
| `visaStep2Name` | "Apply for a student visa" |
| `visaStep2Text` | "Submit your visa application at the nearest Turkish consulate." |
| `visaStep3Name` | "Travel to Turkey" |
| `visaStep3Text` | "Enter Turkey with your student visa and arrange initial accommodation." |
| `visaStep4Name` | "Apply for a residence permit" |
| `visaStep4Text` | "Within 30 days of arrival, apply for a student residence permit." |
| `visaStep5Name` | "Register and start studying" |
| `visaStep5Text` | "Complete university registration and begin your studies." |

- Görünən `<ol>` 5 addım — info cards-dan sonra, "Popular universities"-dən əvvəl
- JSON-LD: `howToJsonLd(visaSteps)` — `breadcrumbJsonLd`-ya paralel

**Ölkə GeoBlock summary açarları** (həmçinin 4 dilə əlavə olunacaq): `visaTypeValue`, `tuitionFromValue`, `languageValue`, `supportValue`

### 4.3 "What is...?" tərif blokları
**Yeni i18n açarları** Geo namespace-ə 4 dildə: `whatIsUniversityTitle` ("What is {name}?"), `whatIsProgramTitle` ("What is {category} in {city}?")

- **Universitet detalı:** GeoBlock-dan sonra — "What is {name}?" başlıq + `universityShortAnswer` mətn
- **Proqram kombinasiyası:** GeoBlock-dan sonra — "What is {category} in {city}?" + `programShortAnswer` mətn
- **FAQPage schema-ya əlavə:** hər səhifənin FAQ JSON-LD massivinə bu sual+cavab əlavə olunur
- Guard: `isGeoLocale(appLocale)`

---

## 5. 4D — Performans tənzimlənməsi

### Audit nəticəsi
- ✅ `font-display: swap` artıq var (`Inter` + GeistSans)
- ✅ Şəkil `priority`/`sizes` əksər yerlərdə var
- ⚠️ Universitet hero: `sizes="100vw"` → LCP təsir → `(max-width: 768px) 100vw, 1200px`
- ⚠️ Galeriya şəkilləri `priority` yoxdur → ilk şəkilə `priority={i === 0}`

### Tapılacaklar
1. Hero `sizes` dəqiqləşdir (`universities/[slug]`, `blog/[slug]`)
2. Galeriya ilk şəklinə `priority`
3. `preconnect` fonts üçün audit
4. CLS audit: hero container aspect-ratio
5. `tsc --noEmit` + `next lint` + `next build`
6. `faza4.md` status cədvəli ✓

---

## 6. Komit strategiyası

| # | Komit | Tərkibi |
|---|---|---|
| 1 | `feat(seo): Phase 4A+4B — schema completion + GEO blocks` | `json-ld.ts` builder-lar + `geo.ts` + `geo-block.tsx` guard + 3 səhifə + i18n |
| 2 | `feat(seo): Phase 4C — AEO structures (HowTo + definition blocks)` | apply howto + visa howto + definition bloklar + FAQPage + i18n |
| 3 | `perf(seo): Phase 4D — performance tuning + build verification` | hero sizes + gallery priority + CLS + build/lint/typecheck |

---

## 7. Verification meyarları

- **Tip təhlükəsizliyi:** `tsc --noEmit` yaşıl
- **Lint:** `next lint` yaşıl
- **Build:** `next build` uğurlu
- **Runtime:** 4 dildə GEO blok görünür; 14 dildə xətasız, blok yoxdur
- **JSON-LD:** Schema.org uyğun (HowTo, FAQPage, Review)

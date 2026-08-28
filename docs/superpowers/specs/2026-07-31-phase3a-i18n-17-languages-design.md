# Türkiyədə Təhsil Platforması — Phase 3A: İ18n Genişlənməsi (4 → 17 Dil) (Dizayn Sənədi)

> **Mənbə:** `Study.md` §3 (i18n — 17 dil, hreflang), `faza3.md` (Faza 3 roadmap).
> **Vəziyyət:** Faza 1-2 bitib. Hazırda 4 dil (`en/tr/az/ru`) aktiv.
> Bu sənəd **3A alt-sistemini** əhatə edir: qalan 13 dilin əlavəsi. Struktural dəyişiklik yoxdur — yalnız mövcud pattern-i genişlədir.

---

## 0. Qərarlar

| Qərar | Seçim | Səbəb |
|---|---|---|
| Tərcümə mənbəyi | AI-generated tərcümələr + README-də "human review before launch" qeydi | Faza 3-ün 13 dili üçün professional tərcümə büdcəsi/prosesi hazır deyil; MVP üçün işlək, prod-a qədər redaktə |
| Struktur | `en.json` 1:1 kopyalanır (eyni namespace açarları) | Tutarlılıq; next-intl açar yoxdursa xəta verir |
| RTL | Hazırkı `isRtl` + `dir={direction}` qalır (`ar/fa/ur` əhatəli) | Dəyişiklik tələb olunmur |
| `translations` DB layer-i | **Daxil deyil** | YAGNI; admin tərcümə paneli ayrı iş; JSON-dan oxuma qalır |
| `hreflang` | `buildAlternates` `routing.locales`-dən götürür — avtomatik | Heç bir səhifədə əl ilə düzenləmə yoxdur |
| localeLabels | native ad + bayraq emoji | Mövcud pattern (`routing.ts:12`) |

---

## 1. Məqsəd və Əhatə

### Daxildir
- `src/config/site.ts` `locale.locales` massivinin 17-yə genişlənməsi
- `src/i18n/routing.ts` `localeLabels`-ın 17-yə tamamlanması
- 13 yeni `src/messages/<locale>.json` faylı (struktur `en.json` 1:1)
- README-də tərcümə keyfiyyəti xəbərdarlığı
- `lint && typecheck && build` yaşıl

### Xaricdədir
- `translations` DB cədvəli və admin tərcümə paneli (növbəti iş)
- Profesional insan tərcüməsi (prod-a qədər redaktə prosesi)
- Locale-spesifik məzmun (universitet təsviri hələ sadəcə 4 dildədir: `university.description[locale]` — yeni dil açarları missing olduqda fallback `en`-ə düşməli; `types/index.ts`-də mövcud∂ TypeScript optional-lıq yoxlanılır)

---

## 2.locale sırası (Study.md §3)

| Kod | Ölkə | Dil | Əlavə? |
|---|---|---|---|
| en | ABŞ | İngilis | ✅ mövcud |
| tr | Türkiyə | Türk | ✅ |
| az | Azərbaycan | Azərbaycan | ✅ |
| ru | Rusiya | Rus | ✅ |
| de | Almaniya | Alman | ➕ yeni |
| fr | Fransa | Fransız | ➕ |
| fa | İran | Fars | ➕ (RTL) |
| ar | Ərəb (IQ/SA) | Ərəb | ➕ (RTL) |
| tk | Türkmənistan | Türkmən | ➕ |
| kk | Qazaxıstan | Qazax | ➕ |
| ky | Qırğızıstan | Qırğız | ➕ |
| zh | Çin | Çin | ➕ |
| bg | Bolqarıstan | Bolqar | ➕ |
| ur | Pakistan | Urdu | ➕ (RTL) |
| uz | Özbəkistan | Özbək | ➕ |
| sw | Tanzaniya | Suahili | ➕ |
| so | Somali | Somali | ➕ |
| id | İndoneziya | İndoneziya | ➕ |

**Nəticə:** 17 unikal dil; `ar` IQ+SA arasında ortaq (hreflang `ar-IQ`/`ar-SA` ilə ayrıca region hədəflənir).

---

## 3. Dəyişikliklər

### 3.1 `src/config/site.ts`
```ts
locales: ['en','tr','az','ru','de','fr','fa','ar','tk','kk','ky','zh','bg','ur','uz','sw','so','id'] as const,
```

### 3.2 `src/i18n/routing.ts`
`localeLabels` 17-yə tamamlanır. Nümunə:
```ts
export const localeLabels: Record<AppLocale, { native: string; flag: string }> = {
  en: { native: 'English', flag: '🇬🇧' },
  tr: { native: 'Türkçe', flag: '🇹🇷' },
  az: { native: 'Azərbaycanca', flag: '🇦🇿' },
  ru: { native: 'Русский', flag: '🇷🇺' },
  de: { native: 'Deutsch', flag: '🇩🇪' },
  fr: { native: 'Français', flag: '🇫🇷' },
  fa: { native: 'فارسی', flag: '🇮🇷' },
  ar: { native: 'العربية', flag: '🇸🇦' },
  tk: { native: 'Türkmen', flag: '🇹🇲' },
  kk: { native: 'Қазақша', flag: '🇰🇿' },
  ky: { native: 'Кыргызча', flag: '🇰🇬' },
  zh: { native: '中文', flag: '🇨🇳' },
  bg: { native: 'Български', flag: '🇧🇬' },
  ur: { native: 'اردو', flag: '🇵🇰' },
  uz: { native: 'O‘zbekcha', flag: '🇺🇿' },
  sw: { native: 'Kiswahili', flag: '🇹🇿' },
  so: { native: 'Soomaali', flag: '🇸🇴' },
  id: { native: 'Bahasa Indonesia', flag: '🇮🇩' },
};
```
`isRtl`/`isLocale` dəyişmir — artıq `ar/fa/ur` əhatə edir və `routing.locales`-dən götürür.

### 3.3 `src/messages/<locale>.json` × 13
Hər yeni fayl `en.json` strukturunu 1:1 saxlayır, yalnız dəyərlər tərcümə olunur. next-intl missing-key xətalarının qarşısını almaq üçün bütün açarlar mövcud olmalıdır.

> **Tərcümə keyfiyyəti:** AI-generated; naturallığı və doğruluğu üçün prod-a qədər native spiker tərəfindən redaktə tələb olunur (README §).

### 3.4 Locale fallback (məzmun sahələri)
`university.description[locale]` kimi kontent-spesifik mətnlər hazırda yalnız 4 dildədir. TypeScript tipi `Partial<Record<Locale, string>>` deyil — yoxlanılır və lazımsa optional edilir; runtime-da açar yoxdursa `en`-ə fallback (UI-də `description[locale] ?? description.en`). Bu, bu fazanın əsas dəyişikliyi deyil, doğrulama və istəsə düzəliş.

### 3.5 README
Qısa xəbərdarlıq: "17 dillik UI tamamlanıb; universitet/proqram məzmun tərcümələri növbəti fazada DB-yə köçürüləndə tamamlanacaq. UI tərcümələri AI-generated; prod-a qədər native review."

---

## 4. Risklər

- **Tərcümə keyfiyyəti:** AI-generated; peşəkar redaktə tələb olunur (Study.md §17). README-də xəbərdarlıq.
- **RTL düzüllük:** `ar/fa/ur` üçün Tailwind/margin RTL mirror düzgün işləmirsə, kiçik UI bug-lar ola bilər; build sonrası `ar` səhifəsi vizual yoxlanılmalı.
- **Build vaxtı:** 17 locale × universitet səhifələri = statik generasiya artımı; Lighthouse/ISR hədəfləri qorunmalı.
- **Bundle ölçüsü:** hər locale ayrı chunk; növbəti fazada `loadLocale` lazy-loading nəzərdən keçirilə bilər (bu fazaya daxil deyil).

---

## 5. Test Strategiyası

- `node -e "require('./src/messages/<locale>.json')"` hər 17 fayl üçün (JSON valid).
- `npm run typecheck` — `AppLocale` tipi 17-yə genişlənib.
- `npm run build` — `generateStaticParams` 17 locale üçün işləyir, RTL `ar/fa/ur` səhifələri `dir="rtl"` alır.
- `npm run lint`.
- Mövcud unit/E2E testləri (`en` əsaslı) yaşıl qalır.
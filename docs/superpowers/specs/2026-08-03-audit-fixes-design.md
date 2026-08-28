# Audit Düzəlişləri — Təhlükəsizlik və SEO (Design Spec)

> **Tarix:** 2026-08-03
> **Mənbə:** AI audit doğruluq yoxlaması (`cl.md`)
> **Status:** Təsdiqlənmiş dizayn

---

## Məqsəd

AI auditin 7 təsdiqlənmiş tapıntısını (1 yanlış tapıntı istisna olmaqla) düzəltmək: kritik təhlükəsizlik backdoor-u, SEO "thin content" riski, API abuse/qarşısı və admin indekslənmə qoruması.

## Daxildir

1. Dev-auth backdoor-u `NODE_ENV` şərtinə söykənməkdən çıxarmaq (🔴 kritik)
2. Sitemap + hreflang-ı 6 boş dildən təmizləmək (🔴 kritik SEO)
3. `/api/chat` — `messages` Zod validasiyası + in-memory rate limit (🟠)
4. `submitLead` — in-memory rate limit (🟠)
5. Admin + dashboard layout-larına `noindex` meta (🟡)

## Daxil deyil (scope xarici)

- `/en/universities` lokal 404 — kod düzgündür, DB problemi
- GEO genişləndirmə (blog/ana səhifə) — enhancement, ayrıca raund
- `generateStaticParams` try/catch — artıq var
- Upstash Redis-ə keçid — sonra ayrıca raund

---

## 1. Dev-auth backdoor (🔴 kritik)

**Fayl:** `src/lib/crm/student-session.ts:11-13`

**Dəyişiklik:** `NODE_ENV !== 'production'` şərtini sil, yalnız `DEV_AUTH_ENABLED === '1` saxla:

```ts
export function isDevAuthEnabled(): boolean {
  return process.env.DEV_AUTH_ENABLED === '1';
}
```

Şərh (sətir 10) və `.env.example:25-28` yenilənir: "Açıq şəkildə 1 təyin etməlisən" mesajı.

**Təsir:** Backdoor yalnız açıq env flag ilə işləyir. Staging/preview-də `NODE_ENV` yanlış təyin olunsa belə təhlükəsizdir. E2E testlər (`playwright.config.ts:26`) onsuz da `DEV_AUTH_ENABLED: '1` təyin edir — qırılmır.

## 2. Boş dilləri sitemap/hreflang-dan çıxarmaq (🔴 kritik SEO)

**Fayllar:** `src/config/site.ts`, `src/app/sitemap.ts:58`, `src/lib/seo/alternates.ts:16`

**Dəyişiklik:** `site.ts`-ə yeni konstant:

```ts
// 6 dil (bg/id/so/ur/uz/sw) demək olar ki, boşdur (41-42 sətir, ~10%).
// Sitemap və hreflang yalnız bu dilləri yayımlayır ki, Google "thin content"
// siqnalı verməsin. 6 boş dil tam tərcümə olunanda bura əlavə et.
export const fullyTranslatedLocales = locales.filter(
  (l) => !['bg', 'id', 'so', 'ur', 'uz', 'sw'].includes(l),
);
```

`sitemap.ts` və `alternates.ts` `routing.locales` əvəzinə `fullyTranslatedLocales` istifadə edir.

**Təsir:** 6 boş dilin URL-ləri sitemap + hreflang-dan çıxır. Səhifələr özü işləyir, sadəcə təbliğ olunmur. Tam tərcümə olunanda konstanta geri əlavə etmək kifayətdir.

## 3. /api/chat validasiya + rate limit (🟠)

**Yeni fayl:** `src/lib/rate-limit.ts` — in-memory sliding window.

```ts
// Edge-uyğun in-memory rate limiter. Hər IP üçün timestamp massivi saxlayır,
// pəncərə xaricindəkiləri təmizləyir. Serverless çox-instansiyada hər instansya
// ayrı sayır — kritik qoruma üçün Upstash Redis-ə keçid planlanır (növbəti raund).
export function rateLimit(opts: { windowMs: number; max: number }) { ... }
```

**Fayl:** `src/app/api/chat/route.ts` — `messages` üçün Zod sxemi əlavə:

```ts
const ChatSchema = z.object({
  locale: z.string().optional(),
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),   // 'system' bloklanır
      content: z.string().max(2000),
    }),
  ).max(20),
});
```

Rate limit: 10 sorğu/dəq IP-əsaslı. Validasiya uğursuz → 400.

**Təsir:** Prompt injection (client `{role:'system'}`) bağlanır, OpenAI xərc abuse azalır.

## 4. submitLead rate limit (🟠)

**Fayl:** `src/app/actions/leads.ts`

`src/lib/rate-limit.ts`-dən istifadə, 5 sorğu/dəq IP-əsaslı. Zod + honeypot qalır. Limit aşanda `{ ok: false, errors: { _form: ['rate'] } }` qaytarır (UX-də "çox cəhd" mesajı).

## 5. Admin/dashboard noindex meta (🟡)

**Fayllar:** `src/app/admin/layout.tsx`, `src/app/[locale]/dashboard/(app)/layout.tsx`

Hər ikisinə:
```ts
export const metadata = { robots: { index: false, follow: false } };
```

**Təsir:** robots.txt-yə əlavə olaraq meta tag də garanti edir.

---

## Risklər

- **In-memory rate limit serverless-də zəifdir** — hər Vercel funksiya instansyası ayrı sayır. Qəbuledilən ilk müdafiədir; kritik qoruma üçün Upstash növbəti raundda.
- **`fullyTranslatedLocales` 12 dilə düşür** — 6 dil istifadəçi tərəfindən birbaşa girilə bilər, amma indekslənmir. Bu qəsdəndir.

## Yoxlama

- `npm run typecheck` — yaşıl
- `npm run lint` — yaşıl
- `npm run build` — `isDevAuthEnabled` prod-də false, sitemap 12 dil
- E2E: admin login dev picker `DEV_AUTH_ENABLED=1` ilə işləyir

﻿

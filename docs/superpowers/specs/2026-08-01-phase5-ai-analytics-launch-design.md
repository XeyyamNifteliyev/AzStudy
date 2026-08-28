# Türkiyədə Təhsil Platforması — Phase 5: AI Modullar + Analitika + Launch (Dizayn Sənədi)

> **Mənbə:** `Study.md` §14 (analitika), §16 Faza 5.
> **Vəziyyət:** Faza 1-4 bitib. Bu sənəd AI chatbot, analitika inteqrasiyası və launch hazırlığını əhatə edir.

---

## 0. Qərarlar

| Qərar | Seçim | Səbəb |
|---|---|---|
| Chatbot arxitektura | Edge API route + client widget | Next.js Edge runtime; server-side API açarı təhlükəsiz |
| AI provayder | OpenAI (env-based, istəyə görə Anthropic) | Ən geniş yayılmış; env dəyişdirilə bilər |
| Chatbot dil əhatəsi | 4 dil (en/tr/az/ru) — Geo guard | Faza 4 pattern-i ilə tutarlı |
| Analitika | GA4 + Clarity — env-based | Hər ikisi pulsuz; env yoxdursa render olunmur |
| Pixel | Daxil deyil (YAGNI) | Marketinq kampaniyası planlaşdırılana qədər |
| Məqalə generatoru | Daxil deyil (gələcək) | Admin panel artıq var; AI content generation ayrı böyük iş |

---

## 1. Məqsəd və Əhatə

### Daxildir
- **5A:** AI chatbot floating widget + `/api/chat` Edge route (env-based)
- **5B:** GA4 + Microsoft Clarity analitika (env-based komponent)
- **5C:** Launch hazırlığı — README, robots.txt, .env.example, build verification

### Xaricdədir
- AI məqalə/blog generatoru (gələcək iş)
- Meta/TikTok Pixel (marketinq kampaniyası başlayanda)
- A/B test aləti (gələcək)
- AI ilə universitet tövsiyə sistemi (gələcək)

---

## 2. 5A — AI Chatbot widget

### Arxitektura
- **`/api/chat` route** (Edge runtime): OpenAI API çağırır; system prompt universitet/FAQ context verir; dilə uyğun cavab qaytarır
- **`<ChatWidget>` client komponenti:** floating button + açılan panel; mesaj tarixi localStorage; 4 dil Geo guard
- **Layout:** `(marketing)/layout.tsx`-də WhatsAppFloat yanında

### Edge API route (`src/app/api/chat/route.ts`)
```ts
export const runtime = 'edge';
// POST { messages, locale } -> { reply }
// system prompt: "You are a helpful assistant for studying in Turkey..."
// context: FAQ data + university names
// env: OPENAI_API_KEY (server-side only)
```

### ChatWidget komponenti
- Fixed button (sol tərəfdə, WhatsApp-dan ayrı) — `MessageCircle` ikonu
- Açılan panel: mesajlar + input
- Loading state
- 4 dil (en/tr/az/ru) — `isGeoLocale` guard; 14 dildə widget yoxdur
- i18n açarları yeni `Chatbot` namespace-ə (4 dil)

---

## 3. 5B — Analitika inteqrasiyası

### `<Analytics>` komponenti (`src/components/seo/analytics.tsx`)
- GA4: `NEXT_PUBLIC_GA_ID` varsa `<Script>` ilə gtag yüklənir
- Clarity: `NEXT_PUBLIC_CLARITY_ID` varsa snippet
- Layout-a əlavə: `[locale]/layout.tsx` `<body>` sonunda

### Konversiya izləmə
- `submitLead` server action uğurlu olarsa `gtag('event', 'lead_submitted')` çağırılır
- Client-side event (ApplyForm success state)

---

## 4. 5C — Launch hazırlığı

- README roadmap yenilə (Faza 4 ✅, Faza 5 ✅)
- `robots.txt` — admin/dashboard bloklanır
- `.env.example` — bütün env dəyişənləri nümunə
- Final `next build` + `tsc --noEmit` verification

---

## 5. Komit strategiyası

| # | Komit | Tərkibi |
|---|---|---|
| 1 | `feat(ai): Phase 5A — AI chatbot widget + edge API` | chat route + ChatWidget + i18n (4 dil) |
| 2 | `feat(analytics): Phase 5B — GA4 + Clarity integration` | Analytics component + layout + lead event |
| 3 | `chore: Phase 5C — launch prep (README, robots, env)` | README + robots.txt + .env.example + build |

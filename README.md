# AzStudy — Study in Azerbaijan Platform (Phase 1 MVP)

A high-performance, SEO-first marketing front-end for a study-in-Azerbaijan platform.
Built with Next.js 15, TypeScript, Tailwind CSS and a multi-language architecture.

> **Brand name:** AzStudy. Set in [`src/config/site.ts`](./src/config/site.ts) (`siteConfig.name`).

## What's included

- **Statically-generated pages** across 18 languages (`en, tr, az, ru, de, fr, fa, ar, tk, kk, ky, zh, bg, ur, uz, sw, so, id`) covering 46 accredited Azerbaijani universities
- Home, About, Contact, Apply, Compare
- Universities listing (URL-driven filters) + **11-section detail pages**
- Programmatic SEO: **Program × City** combination pages
- Country-specific landing pages (143 countries) + hub
- Blog (index + article)
- Full SEO: per-page metadata, **JSON-LD** (Organization, WebSite, CollegeOrUniversity, FAQPage, Article, BreadcrumbList, Course), `hreflang` alternates, split-ready sitemap, robots, manifest, llms.txt (AEO)
- Apply lead form (React Hook Form + Zod + server action with honeypot)
- Student dashboard + Admin CRM (Google OAuth via Supabase)
- i18n with `next-intl`, RTL-ready architecture
- Unit tests (Vitest) + E2E config (Playwright)

## Azerbaijani Universities

### Baku
- **Baku State University** — The oldest and most prestigious university in Azerbaijan (founded 1919)
- **Azerbaijan Diplomatic Academy (ADA)** — Leading international university
- **Azerbaijan University of Architecture and Construction (ADNSU)** — Technical university since 1920
- **Azerbaijan Aviation University (AAU)** — Specialized in aviation and aerospace

### Sumqayit
- **Sumqayit State University (SSU)** — Modern education in Azerbaijan's industrial capital

### Gence
- **Ganja State University (GSU)** — One of the oldest universities in western Azerbaijan (founded 1939)
- **Ganja State Technological University (GSTU)** — Engineering and technology focus

### Naxcivan
- **Nakhchivan Medical University (NMU)** — Specialized medical education

## Tech stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 (App Router) + TypeScript |
| Styling | Tailwind CSS + shadcn-style UI primitives |
| Fonts | Geist (self-hosted; display + body) |
| i18n | next-intl |
| Validation | Zod |
| Forms | React Hook Form |
| Tests | Vitest (unit) + Playwright (E2E) |

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000  (redirects to /en)
```

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm test` | Unit tests (Vitest) |
| `npm run test:e2e` | E2E tests (Playwright) |

## Project structure

```
src/
  app/
    [locale]/            # all localized routes
      universities/      # listing + [slug] detail
      programs/          # index + [category]/[city] programmatic pages
      blog/  apply/  about/  contact/  compare/
    actions/             # server actions (leads)
    sitemap.ts  robots.ts  manifest.ts  icon.svg
  components/
    layout/  sections/  ui/  seo/  motion/
  lib/
    data/               # adapter-pattern repositories (DataLayer interface)
    seed/               # in-memory seed data (swappable for Supabase later)
    seo/  i18n/  validations/  utils.ts
  messages/             # en / tr / az / ru
  types/  config/
```

## Data layer (adapter pattern)

All UI talks to the `DataLayer` interface in [`src/lib/data/repositories.ts`](./src/lib/data/repositories.ts).
It is backed by a **Postgres repository** (`src/lib/data/pg-data-repository.ts`) when
`DATABASE_URL` is set; otherwise it falls back to the in-memory `SeedRepository`.

## Internationalization

- Locales: `en / tr / az / ru` (URL prefix `/[locale]/...`)
- UI strings in `src/messages/*.json` (18 locales)
- **Content** fields in seed are `Partial<Record<Locale, string>>` and fall back to `en`
- RTL-ready: `dir` attribute + CSS logical properties; `ar`, `fa`, `ur` render RTL.

## Notes

- Imagery uses Unsplash placeholders — replace with real assets.
- Admin panel and CRM are available at `/admin`.
- Blog content focuses on Azerbaijani universities and education in Azerbaijan.

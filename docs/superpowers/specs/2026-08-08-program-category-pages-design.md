# Program Category Pages — Design Spec

Date: 2026-08-08

## Goal
Fix the 404 on `/programs/[category]` (e.g. `/en/programs/architecture`) and build a
professional program-category landing page that lists the universities offering each
program, plus annual costs (tuition + estimated living costs).

## Root cause
Only `/programs` and `/programs/[category]/[city]` routes exist; the
`/programs/[category]` page was never written, even though the data layer
(`data.programs.getByCategory()`) and the `ProgramCategory` i18n namespace
(all 18 locales) are already in place. The sitemap already emits these URLs.

## Data model addition: monthly living cost
`City` type gains an optional field: `monthlyLivingCostUSD?: number` (monthly living
cost, USD).

- `src/types/index.ts` — add field to `City` interface.
- `src/lib/seed/cities.ts` — per-city values (all 13 cities):
  - Istanbul ~700, Ankara ~450, Izmir ~500, Bursa ~350, Antalya ~400,
    Konya ~300, Trabzon ~320, Mersin ~280, Gaziantep ~250, Kayseri ~280,
    Nevsehir ~250, Kocaeli ~330, Alanya ~400.
- `supabase/migrations/0014_city_living_cost.sql` — new migration:
  `alter table public.cities add column if not exists monthly_living_cost_usd numeric(12,2);`
- `scripts/seed-content.ts` — include `monthly_living_cost_usd` in the cities insert.
- `src/lib/data/pg-data-repository.ts` — `rowCity()` maps
  `monthlyLivingCostUSD: r.monthly_living_cost_usd ? Number(...) : undefined`.
- `src/lib/data/seed-repository.ts` — no change needed (seed objects already carry the
  new field via the updated `City` type).

## New page: `src/app/[locale]/(marketing)/programs/[category]/page.tsx`

Follows the `[city]` page structure, but at the category level. Calls
`data.programs.getByCategory(category)`, renders `notFound()` when the category is
missing or has no programs.

### Sections
1. **Hero + stat cards** — breadcrumb (Home / Programs), title
   (`ProgramCategory.title` → "Architecture in Turkey"), subtitle, 3 stat cards:
   program count, university count, min annual tuition.
2. **City cards** (`citiesTitle`) — each city where the program is offered: name,
   university count, "from $X". Links to `/programs/[category]/[city]`.
3. **Programs table** (`programsTitle`) — program, university, city, degree, language,
   annual tuition.
4. **University cards** (`universitiesTitle`) — each university as a card with its
   programs listed underneath (name, degree, language, tuition, scholarship
   availability). Each program row shows **annual total cost** = tuition + 12 ×
   monthly living cost.
5. **JSON-LD** — breadcrumb + CourseList (same pattern as the `[city]` page).

### Cost calculation
Per program row: `total = tuitionFee + (monthlyLivingCostUSD × 12)`. City info comes
from each program's `city` field. If living cost is missing, show tuition only.

### Metadata
`ProgramCategory` namespace (already in all 18 locale files). Sitemap already covers
these URLs — no change needed.

## Error handling
- Category not found → `notFound()`.
- `generateStaticParams` returns `[]` on DB error (same pattern as `[city]` page).
- ISR: `revalidate = 3600`.

## Files to modify / create
- Modify: `src/types/index.ts`, `src/lib/seed/cities.ts`, `scripts/seed-content.ts`,
  `src/lib/data/pg-data-repository.ts`
- Create: `supabase/migrations/0014_city_living_cost.sql`
- Create: `src/app/[locale]/(marketing)/programs/[category]/page.tsx`

## Out of scope
- No changes to the existing `[city]` page.
- No changes to the `/programs` index page or filters.
- No changes to `UniversityCard` component itself.

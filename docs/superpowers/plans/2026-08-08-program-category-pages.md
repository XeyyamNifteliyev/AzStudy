# Program Category Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the 404 on `/programs/[category]` (e.g. `/en/programs/architecture`) by building a professional program-category landing page that lists universities offering each program plus annual costs (tuition + living).

**Architecture:** Add `monthlyLivingCostUSD` to the `City` model (seed + PG migration + seed-content insert + rowCity mapping). Create `/programs/[category]/page.tsx` that calls the existing `data.programs.getByCategory()`, groups programs by university, and shows city cards, a programs table, and university cards with per-program annual total cost (tuition + 12 × living).

**Tech Stack:** Next.js App Router (RSC), next-intl, TypeScript, Postgres (via `pg`), Tailwind CSS, Vitest.

**Spec:** `docs/superpowers/specs/2026-08-08-program-category-pages-design.md`

---

### Task 1: Add `monthlyLivingCostUSD` to the `City` type and seed

**Files:**
- Modify: `src/types/index.ts:37-42`
- Modify: `src/lib/seed/cities.ts`
- Test: `tests/unit/repository.test.ts:104-108`

- [ ] **Step 1: Update the `City` interface**

In `src/types/index.ts`, add the optional field to `City`:

```ts
export interface City {
  id: string;
  slug: string;
  name: LocalizedString;
  countryId: string;
  monthlyLivingCostUSD?: number;
}
```

- [ ] **Step 2: Add living costs to all 13 seed cities**

In `src/lib/seed/cities.ts`, add `monthlyLivingCostUSD` to each of the 13 city objects (after `countryId`):

```ts
// Istanbul
monthlyLivingCostUSD: 700,
// Ankara
monthlyLivingCostUSD: 450,
// Izmir
monthlyLivingCostUSD: 500,
// Bursa
monthlyLivingCostUSD: 350,
// Antalya
monthlyLivingCostUSD: 400,
// Konya
monthlyLivingCostUSD: 300,
// Trabzon
monthlyLivingCostUSD: 320,
// Mersin
monthlyLivingCostUSD: 280,
// Gaziantep
monthlyLivingCostUSD: 250,
// Kayseri
monthlyLivingCostUSD: 280,
// Nevsehir
monthlyLivingCostUSD: 250,
// Kocaeli
monthlyLivingCostUSD: 330,
// Alanya
monthlyLivingCostUSD: 400,
```

- [ ] **Step 3: Write the failing test**

In `tests/unit/repository.test.ts`, extend the `Supporting repositories` describe block:

```ts
it('exposes monthly living cost per city', async () => {
  const cities = await data.cities.list();
  expect(cities.length).toBeGreaterThan(0);
  expect(cities.every((c) => typeof c.monthlyLivingCostUSD === 'number')).toBe(true);
  const istanbul = cities.find((c) => c.slug === 'istanbul');
  expect(istanbul?.monthlyLivingCostUSD).toBe(700);
});
```

- [ ] **Step 4: Run the test to verify it fails**

Run: `npx vitest run tests/unit/repository.test.ts`
Expected: FAIL — `monthlyLivingCostUSD` is `undefined` (seed-repository returns raw seed objects; seed objects currently lack the field).

- [ ] **Step 5: Commit**

```bash
git add src/types/index.ts src/lib/seed/cities.ts tests/unit/repository.test.ts
git commit -m "feat: add monthly living cost to City model"
```

---

### Task 2: PG migration + seed-content insert + rowCity mapping

**Files:**
- Create: `supabase/migrations/0014_city_living_cost.sql`
- Modify: `scripts/seed-content.ts:71-78`
- Modify: `src/lib/data/pg-data-repository.ts:61-68`

- [ ] **Step 1: Create the migration**

Create `supabase/migrations/0014_city_living_cost.sql`:

```sql
-- 0014_city_living_cost.sql — monthly living cost (USD) per city for cost estimates.

alter table public.cities
  add column if not exists monthly_living_cost_usd numeric(12,2);
```

- [ ] **Step 2: Update the cities insert in seed-content.ts**

In `scripts/seed-content.ts`, change the cities insert to include the new column (line ~72-78):

```ts
  // cities
  for (const c of seedCities) {
    await client.query(
      `insert into public.cities (id, slug, country_code, name_i18n, monthly_living_cost_usd) values ($1, $2, $3, $4::jsonb, $5)
       on conflict (id) do nothing`,
      [c.id, c.slug, c.countryId, JSON.stringify(c.name), c.monthlyLivingCostUSD ?? null],
    );
  }
```

- [ ] **Step 3: Map the column in rowCity()**

In `src/lib/data/pg-data-repository.ts`, update `rowCity` (line 61-68):

```ts
function rowCity(r: Record<string, unknown>): City {
  return {
    id: r.id as string,
    slug: r.slug as string,
    countryId: r.country_code as string,
    name: i18n(r.name_i18n),
    monthlyLivingCostUSD: r.monthly_living_cost_usd
      ? Number(r.monthly_living_cost_usd)
      : undefined,
  };
}
```

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations/0014_city_living_cost.sql scripts/seed-content.ts src/lib/data/pg-data-repository.ts
git commit -m "feat: add monthly living cost column, seed and pg mapping"
```

---

### Task 3: Add a living-cost helper with tests

**Files:**
- Create: `src/lib/programs/costs.ts`
- Test: `tests/unit/costs.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/unit/costs.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { annualTotalCost } from '@/lib/programs/costs';

describe('annualTotalCost', () => {
  it('adds tuition to 12x monthly living cost', () => {
    expect(annualTotalCost(7000, 500)).toBe(13000);
  });

  it('returns tuition only when living cost is missing', () => {
    expect(annualTotalCost(7000, undefined)).toBe(7000);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run tests/unit/costs.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the helper**

Create `src/lib/programs/costs.ts`:

```ts
export function annualTotalCost(
  tuitionUSD: number,
  monthlyLivingCostUSD?: number,
): number {
  return monthlyLivingCostUSD
    ? tuitionUSD + monthlyLivingCostUSD * 12
    : tuitionUSD;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run tests/unit/costs.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/programs/costs.ts tests/unit/costs.test.ts
git commit -m "feat: add annual total cost helper"
```

---

### Task 4: Add annual cost (tuition + living) to the existing page

**Files:**
- Modify: `src/app/[locale]/(marketing)/programs/[category]/page.tsx`
- Modify: `src/components/sections/university-card.tsx`

NOTE: The page already exists (untracked) and is professional — hero/stats, GeoBlock, city
sections, programs table, UniversityCard grid, FAQ + CTA. Do NOT rewrite it. The only missing
feature per the spec is the **annual total cost** (tuition + 12 × monthly living cost).

Approach (user-approved): add an optional `footer?: React.ReactNode` prop to
`UniversityCard` and render it below the card content (inside the `<Card>` element, after the
existing `.space-y-2.5` div). All existing `UniversityCard` usages are unchanged (the prop is
optional). On the category page, pass a footer showing the annual total cost for that
university: min tuition (from `programs` filtered by university) + 12 × the city's
`monthlyLivingCostUSD` (via `annualTotalCost` from `src/lib/programs/costs`).

The footer label needs i18n. Add one key to the `ProgramCategory` namespace in ALL 18 locale
files: `"annualCost": "Annual cost (tuition + living)"` (translate per locale).

Reuse the exact structure of `src/app/[locale]/(marketing)/programs/[category]/[city]/page.tsx` (read it first). Imports needed: `Metadata`, `notFound`, `setRequestLocale`, `getTranslations`, lucide icons (`GraduationCap`, `Building2`, `Wallet`, `MapPin`, `ArrowRight`, `BadgeCheck`), `data`, `AppLocale`, `Link`, `siteConfig`, `buildPageMetadata`, `breadcrumbJsonLd`, `courseListJsonLd`, `JsonLd`, `Table` components, `Badge`, `formatCurrency`, `annualTotalCost`.

- [ ] **Step 1: Write `generateStaticParams`**

```ts
export async function generateStaticParams() {
  try {
    const categories = await data.programs.getCategories();
    return categories.map((c) => ({ category: c.slug }));
  } catch (error) {
    console.error(
      '[programs/[category] generateStaticParams] DB xətası, [] qaytarılır:',
      error,
    );
    return [];
  }
}

export const revalidate = 3600;
```

- [ ] **Step 2: Write `generateMetadata`**

```ts
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}): Promise<Metadata> {
  const { locale, category } = await params;
  const result = await data.programs.getByCategory(category);
  if (!result.category) return {};
  const t = await getTranslations({ locale, namespace: 'ProgramCategory' });
  return buildPageMetadata({
    locale,
    path: `/programs/${category}`,
    title: t('metaTitle', { category: result.category.name[locale as AppLocale] }),
    description: t('metaDescription', {
      category: result.category.name[locale as AppLocale],
      count: result.universityCount,
    }),
  });
}
```

- [ ] **Step 3: Write the page component (hero + stats + city cards + programs table + university cards + JSON-LD)**

```tsx
export default async function ProgramCategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  setRequestLocale(locale);
  const appLocale = locale as AppLocale;
  const t = await getTranslations({ locale, namespace: 'ProgramCategory' });

  const result = await data.programs.getByCategory(category);
  if (!result.category || result.programs.length === 0) notFound();

  const { category: cat, programs } = result;
  const cities = [...new Map(programs.map((p) => [p.city.slug, p.city])).values()];
  const cityStats = new Map<string, { count: number; minTuition: number }>();
  for (const p of programs) {
    const s = cityStats.get(p.city.slug) ?? { count: 0, minTuition: Infinity };
    s.count += 1;
    s.minTuition = Math.min(s.minTuition, p.tuitionFee);
    cityStats.set(p.city.slug, s);
  }
  const universities = Array.from(
    new Map(programs.map((p) => [p.university.id, p.university])).values(),
  );

  const path = `/programs/${category}`;
  const title = t('title', { category: cat.name[appLocale] });

  return (
    <div>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: t('home'), url: `${siteConfig.url}/${locale}` },
            { name: t('programs'), url: `${siteConfig.url}/${locale}/programs` },
            { name: title, url: `${siteConfig.url}/${locale}${path}` },
          ]),
          courseListJsonLd(
            programs.map((p) => ({
              name: `${p.name[appLocale]} — ${p.university.name}`,
              url: `${siteConfig.url}/${locale}/universities/${p.university.slug}`,
              fee: p.tuitionFee,
            })),
          ),
        ]}
      />

      {/* Hero */}
      <section className="border-b border-border bg-surface-low">
        <div className="container-page py-section-md">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:underline">{t('home')}</Link>
            <span>/</span>
            <Link href="/programs" className="hover:underline">{t('programs')}</Link>
          </div>
          <h1 className="mt-3 font-display text-headline-xl text-foreground">{title}</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            {t('subtitle', { category: cat.name[appLocale] })}
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard icon={GraduationCap} label={t('programsLabel')} value={String(programs.length)} />
            <StatCard icon={Building2} label={t('universitiesLabel')} value={String(universities.length)} />
            <StatCard icon={Wallet} label={t('fromLabel')} value={formatCurrency(result.minTuitionUSD, 'USD', locale)} />
          </div>
        </div>
      </section>

      <div className="container-page py-section-md">
        {/* City cards */}
        <section className="mb-section-md">
          <h2 className="mb-4 font-display text-headline-md text-foreground">
            {t('citiesTitle', { category: cat.name[appLocale] })}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cities.map((city) => {
              const stat = cityStats.get(city.slug)!;
              return (
                <Link
                  key={city.slug}
                  href={`/programs/${category}/${city.slug}`}
                  className="group flex items-center justify-between rounded-lg border border-border bg-card p-5 transition-shadow hover:shadow-flat-hover"
                >
                  <div>
                    <p className="flex items-center gap-1 font-display font-semibold text-foreground">
                      <MapPin className="h-4 w-4 text-primary" />
                      {city.name[appLocale]}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {t('universitiesInCity', { count: stat.count })} · {t('from')}{' '}
                      {formatCurrency(stat.minTuition, 'USD', locale)}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </Link>
              );
            })}
          </div>
        </section>

        {/* Programs table */}
        <section className="mb-section-md">
          <h2 className="mb-4 font-display text-headline-md text-foreground">{t('programsTitle')}</h2>
          <div className="overflow-hidden rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('programName')}</TableHead>
                  <TableHead>{t('university')}</TableHead>
                  <TableHead>{t('city')}</TableHead>
                  <TableHead>{t('degree')}</TableHead>
                  <TableHead>{t('language')}</TableHead>
                  <TableHead className="text-right">{t('tuition')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {programs.map((p) => (
                  <TableRow key={`${p.id}-${p.university.id}`}>
                    <TableCell className="font-medium">{p.name[appLocale]}</TableCell>
                    <TableCell className="text-muted-foreground">{p.university.name}</TableCell>
                    <TableCell className="text-muted-foreground">{p.city.name[appLocale]}</TableCell>
                    <TableCell><Badge variant="secondary">{t(`degrees.${p.degreeLevel}`)}</Badge></TableCell>
                    <TableCell className="uppercase">{p.language}</TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">
                      {formatCurrency(p.tuitionFee, 'USD', locale)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        {/* Universities */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-headline-md text-foreground">{t('universitiesTitle')}</h2>
            <Link
              href="/universities"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              {t('viewAll')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {universities.map((u) => {
              const uniPrograms = programs.filter((p) => p.university.id === u.id);
              const city = uniPrograms[0]?.city;
              return (
                <div key={u.id} className="rounded-lg border border-border bg-card p-5">
                  <Link
                    href={`/universities/${u.slug}`}
                    className="flex items-start justify-between gap-2 font-display text-base font-semibold text-foreground hover:underline"
                  >
                    <span>{u.name}</span>
                    <Badge variant={u.isState ? 'tertiary' : 'cta'}>
                      {u.isState ? 'State' : 'Private'}
                    </Badge>
                  </Link>
                  {city && (
                    <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" aria-hidden />
                      {city.name[appLocale]}
                    </p>
                  )}
                  <div className="mt-4 space-y-3">
                    {uniPrograms.map((p) => (
                      <div key={`${p.id}-${p.language}`} className="rounded-md bg-surface-low p-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium text-foreground">{p.name[appLocale]}</span>
                          <Badge variant="secondary">{t(`degrees.${p.degreeLevel}`)}</Badge>
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                          <span className="uppercase">{p.language}</span>
                          {p.scholarshipAvailable && (
                            <span className="inline-flex items-center gap-1 text-primary">
                              <BadgeCheck className="h-3.5 w-3.5" />
                              Scholarship
                            </span>
                          )}
                        </div>
                        <div className="mt-2 flex items-center justify-between border-t border-border pt-2 text-xs">
                          <span className="text-muted-foreground">{t('tuition')}</span>
                          <span className="font-semibold tabular-nums text-foreground">
                            {formatCurrency(p.tuitionFee, 'USD', locale)}
                          </span>
                        </div>
                        {city.monthlyLivingCostUSD && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Tuition + living / year</span>
                            <span className="font-semibold tabular-nums text-primary">
                              {formatCurrency(annualTotalCost(p.tuitionFee, city.monthlyLivingCostUSD), 'USD', locale)}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <Icon className="h-5 w-5 text-primary" />
      <p className="mt-2 font-display text-2xl font-bold text-foreground tabular-nums">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
```

- [ ] **Step 4: Verify the page renders (seed layer)**

Run: `npx vitest run tests/unit/repository.test.ts` (ensures seed repo still passes).

Then run a build to confirm the route compiles. If a DB is unavailable, the build may still fail on DB-backed pages; at minimum run:
`npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Manual verification**

Start the dev server and visit `http://localhost:3000/en/programs/architecture`:
```bash
npm run dev
```
Expected: the page renders with hero stats, city cards (Istanbul, Ankara, Izmir, Konya), a programs table (4 architecture rows), and university cards (BAU, ITU, METU, YTU) with annual total cost shown.

- [ ] **Step 6: Commit**

```bash
git add "src/app/[locale]/(marketing)/programs/[category]/page.tsx"
git commit -m "feat: add program category landing pages"
```

---

### Task 5: Final verification & self-review

**Files:** (no new files)

- [ ] **Step 1: Run the full unit test suite**

Run: `npx vitest run`
Expected: all tests pass.

- [ ] **Step 2: Run the linter**

Run: `npm run lint` (or the repo's lint script)
Expected: no errors.

- [ ] **Step 3: Verify `/en/programs/architecture` responds 200**

Start dev server and curl:
```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/en/programs/architecture
```
Expected: `200`

- [ ] **Step 4: Confirm spec coverage**

Every spec item maps to a task:
- `City.monthlyLivingCostUSD` → Task 1
- Migration + seed-content + rowCity → Task 2
- Cost helper → Task 3
- Page (hero/stats, city cards, table, university cards with total cost, JSON-LD, metadata, notFound, ISR) → Task 4
- Error handling & ISR → Task 4 Step 1 & 3

- [ ] **Step 5: Commit any remaining changes**

```bash
git add -A
git commit -m "chore: final verification pass"
```

---

## Notes for the implementer

- The `[city]` page at `src/app/[locale]/(marketing)/programs/[category]/[city]/page.tsx` is the reference for the hero, table, and JSON-LD patterns. Read it before writing Task 4.
- `ProgramCategory` i18n namespace already exists in all 18 locale files — do NOT add new keys.
- `getByCategory()` returns `ProgramCategoryDetail` with `category`, `programs` (each with `university`, `city`, `tuitionFee`, `language`, `scholarshipAvailable`), `citySlugs`, `universityCount`, `minTuitionUSD`, `uniqueLanguages`.
- The page must render in the seed layer (no DB) and the PG layer. Keep the data access identical to the `[city]` page.

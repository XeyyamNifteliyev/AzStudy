# Header Search — Design Spec

**Date:** 2026-08-17
**Status:** Approved (user)
**Roles:** Senior Backend / Senior Frontend / Senior UI
**Reference behavior:** https://www.studyleo.com/en/search (dropdown-as-you-type, Enter navigates)

## Goal

Add a site search to the header, next to the locale switcher: an icon button that expands into an input; as the user types, results (universities / programs / cities) appear in a dropdown below; selecting a result (click or Enter) navigates to that entity's page.

## Decisions (user-approved)

1. **Form:** icon → expanding input (not an always-visible input, not fullscreen overlay).
2. **Placement:** header action cluster, LEFT of the locale switcher — `[Search] [Globe] [Apply] [Hamburger]` — on all breakpoints; mobile uses the same header icon (nothing inside the hamburger menu).
3. **Enter behavior:** dropdown-only. Enter navigates to the active (↑↓-selected, default first) result. No separate `/search` page (YAGNI).
4. **Backend:** reuse the existing `/api/search` endpoint unchanged (Postgres full-text + trigram, rate-limited 30/min/IP, `limit` param).

## Architecture

Three units, one responsibility each:

### 1. `src/lib/hooks/use-search-suggest.ts` (new, pure client hook)

Extracted from the hero section's existing autocomplete logic — behavior identical, now shared:

- State: `query`, `hits: SearchHit[]`, `activeIndex`, `open`.
- Debounced fetch (150 ms) to `/api/search?q=…&limit=8` with `AbortController`.
- Per-query `Map` cache (bounded at 100 entries), so backspacing/retyping never re-hits the API.
- Keyboard handlers (`onKeyDown`): ↑/↓ move `activeIndex` (wrapping), Enter returns the active hit (first hit when none explicitly active), Escape closes.
- Min query length 2; empty query clears hits.
- No UI, no routing — returns state + handlers so any consumer decides rendering/navigation.

`SearchHit` type moves here (exported): `{ type: 'university'|'program'|'city'; id; slug; label; hint?; nameI18n? }`.

### 2. `src/components/layout/header-search.tsx` (new, client component)

- Collapsed state: icon-only `Button` (`Search` lucide icon, `aria-label` = t('Nav.search'), `aria-expanded`).
- Expanded state: input (autofocus) inline in the header action cluster; collapses on Escape, outside click, or blur-after-close. Mobile: the input row expands under/over the header within header width — same component, responsive classes only.
- Dropdown: absolutely positioned listbox under the input; each row shows `label` + `hint` + a type badge (University/Program/City). `role="listbox"`, rows `role="option"` with `id`-s for `aria-activedescendant`; container `role="combobox"`, `aria-expanded`, `aria-controls` (mirrors the hero's a11y pattern).
- Empty state (≥2 chars, fetch done, 0 hits): single muted row "No results".
- Selection: click on a row OR Enter → navigate via the SAME route mapping the hero uses today (university → `/universities/[slug]`, program → `/programs/[category]` (per-hit hint), city → city page); after navigation the search collapses and clears.
- Uses `useSearchSuggest`; renders nothing server-side beyond the collapsed icon (SSR-safe).

### 3. Hero refactor (`src/components/sections/hero-section.tsx`)

Replace its inline debounce/cache/fetch state with `useSearchSuggest` (keeps its own markup/layout). Pure refactor — no behavior change; its `aria-activedescendant` markup is already correct.

## Data Flow

`HeaderSearch input → useSearchSuggest (debounce/cache/abort) → GET /api/search → SearchHit[] → dropdown → click/Enter → router.push(hit route) → component collapses + clears.`

The API stays exactly as-is (server route, repositories, indexes, rate limit). No backend changes.

## Placement

`src/components/layout/header.tsx` (Server Component): render `<HeaderSearch />` immediately before `<LocaleSwitcher />` in the action cluster. No layout shifts: the collapsed icon matches the locale switcher's button size; the expanded input overlays (absolute) rather than pushing nav items.

## i18n

New keys under `Nav` in all 18 message files (parity enforced by `npm run check:i18n`):

- `Nav.search` — icon aria-label ("Search")
- `Nav.searchPlaceholder` — input placeholder
- `Nav.noResults` — empty-state row

Type badges (University/Program/City) reuse existing translation keys where present (`Listing.labels.*` already has these); otherwise static English fallback is NOT acceptable — add `Nav.searchTypeUniversity` etc. only if the existing keys don't fit.

## Error Handling

- Fetch failure / abort / 429 → dropdown shows "No results" row (same as empty); never throws, never blocks the header.
- Empty/short query (<2 chars) → no dropdown at all.
- Outside click / Escape → collapse + clear.

## Testing

- **Unit (new):** `tests/unit/use-search-suggest.test.ts` — fake timers for debounce, mocked fetch: (a) <2 chars → no call; (2) dedupes within debounce window; (3) cache hit → no second fetch; (4) aborts in-flight on new input; (5) Enter returns active hit, default first; (6) ↑↓ wrap-around.
- **Existing suites:** all 137 tests must stay green (hero refactor is behavior-neutral).
- **Verification:** typecheck + lint + unit tests; manual smoke in `npm run dev` (desktop + 390px viewport).

## Out of Scope (explicitly)

- Separate `/[locale]/search` results page.
- Program-detail routes (don't exist yet — program hits go to their category page as today).
- Search analytics/logging.
- Header markup changes beyond inserting the new component.

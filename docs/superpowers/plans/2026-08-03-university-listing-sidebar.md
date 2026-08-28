# University Listing Sidebar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the university listing around a StudyLeo-style desktop filter rail, responsive mobile drawer, URL-driven filters, and sorted results.

**Architecture:** Keep the existing server-rendered listing page and repository contract. Expand the client filter component to own URL navigation and responsive presentation, while the page parses validated query values, applies supported tuition filtering, and sorts the returned universities. Use existing Radix UI primitives and Tailwind utilities; do not add dependencies.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, next-intl, Radix Dialog/Select.

---

### Task 1: Add validated listing query helpers

**Files:**
- Create: `src/lib/universities/listing-query.ts`
- Test: `tests/unit/university-listing-query.test.ts`

- [ ] **Step 1: Write the failing tests**

Test `parseListingQuery` for valid city/degree/language/type, numeric tuition,
supported sort values, and invalid values falling back to defaults. Test
`sortUniversities` for name ascending, ranking ascending, tuition ascending,
and stable relevance order.

- [ ] **Step 2: Run the focused test and confirm it fails**

Run: `npx vitest run tests/unit/university-listing-query.test.ts`

Expected: FAIL because the helper module does not exist.

- [ ] **Step 3: Implement the helpers**

Define a `UniversitySort` union of `relevance | name | tuition | ranking`.
Parse only the existing filter values plus `maxTuition` and `sort`; reject
negative/non-finite tuition and unknown sort values. Keep the sort function
pure and use `university.ranking` for ranking and name localeCompare for name.

- [ ] **Step 4: Run the focused test and confirm it passes**

Run: `npx vitest run tests/unit/university-listing-query.test.ts`

Expected: all query and sorting tests pass.

### Task 2: Replace the horizontal filters with a responsive sidebar

**Files:**
- Modify: `src/components/sections/university-filters.tsx`
- Modify: `src/components/ui/dialog.tsx` only if the existing primitive lacks a needed accessible label

- [ ] **Step 1: Add the failing browser assertions**

Extend the university E2E coverage to assert that desktop renders a visible
filter rail, changing a filter updates the URL, and mobile shows a Filters
button that opens and closes the drawer.

- [ ] **Step 2: Run the browser assertions and confirm the current layout fails them**

Run: `npx playwright test tests/e2e/universities.spec.ts`

Expected: the current horizontal filter layout does not expose the sidebar or
mobile drawer assertions.

- [ ] **Step 3: Implement the sidebar and drawer**

Keep `UniversityFilters` as a client component. Use a semantic `<aside>` for
desktop, a `Dialog` for mobile, and shared filter controls to avoid duplicate
logic. Preserve all query parameters when updating one value, remove empty
values, use `router.push` with `scroll: false`, and provide a clear-all action.
Add grouped sections for search, city, degree, language, type, and maximum
tuition. Give each control an accessible label and retain visible focus rings.

- [ ] **Step 4: Run the browser assertions and confirm they pass**

Run: `npx playwright test tests/e2e/universities.spec.ts`

Expected: desktop sidebar, URL filter update, and mobile drawer assertions
pass.

### Task 3: Integrate query parsing, sorting, and result layout

**Files:**
- Modify: `src/app/[locale]/(marketing)/universities/page.tsx`
- Modify: `src/components/sections/university-card.tsx`
- Modify: `src/messages/en.json`
- Modify: `src/messages/az.json`
- Modify: `src/messages/tr.json`

- [ ] **Step 1: Add labels and query wiring tests**

Cover the new sort labels, tuition label, mobile filter label, and active
filter count in the relevant page/component assertions.

- [ ] **Step 2: Implement page integration**

Replace ad-hoc query casting with `parseListingQuery`, pass
`maxTuitionUSD` to `data.universities.list`, sort the returned list with
`sortUniversities`, and render a two-column layout with a 260px sticky rail
and a flexible result grid. Keep JSON-LD based on the final displayed list.

- [ ] **Step 3: Polish cards for the denser listing grid**

Keep existing detail links and metadata, but tighten card spacing, preserve
image aspect ratio, and make hover/focus states visible without changing the
card's data behavior.

- [ ] **Step 4: Run typecheck and focused tests**

Run: `npm run typecheck`

Run: `npx vitest run tests/unit/university-listing-query.test.ts`

Expected: typecheck and focused tests pass.

### Task 4: Update loading and localization coverage

**Files:**
- Modify: `src/app/[locale]/(marketing)/loading.tsx`
- Modify: all locale files under `src/messages/` that contain `UniversitiesPage`

- [ ] **Step 1: Add the sidebar-shaped loading skeleton**

Render a desktop rail placeholder plus result-card placeholders and keep the
mobile layout compact.

- [ ] **Step 2: Add translated labels**

Add sort, tuition, clear-all, mobile-filter, and active-filter labels to every
locale so missing-message warnings are not introduced.

- [ ] **Step 3: Run the complete verification suite**

Run: `npm run typecheck`

Run: `npm test`

Run: `npx playwright test tests/e2e/universities.spec.ts`

Expected: typecheck, unit tests, and university browser tests pass.

### Task 5: Review and commit the focused change

**Files:**
- Review only the files listed in Tasks 1-4.

- [ ] **Step 1: Inspect the diff and whitespace**

Run: `git diff --check` and `git diff --stat`.

- [ ] **Step 2: Verify unrelated worktree changes are not staged**

Run: `git status --short` and stage only the university listing files.

- [ ] **Step 3: Commit the feature**

Run: `git commit -m "feat(universities): add responsive filter sidebar"`.

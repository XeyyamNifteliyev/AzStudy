# SEO Content Expansion — Design Spec

Date: 2026-08-07

## Goal
Add 10 new universities and 8 new blog posts to the StudyHub Turkey seed content,
with locally hosted images (WebP) instead of remote Unsplash hotlinks for the new entries.

## Universities (10)
1. **Marmara University** — c-istanbul, state
2. **Istanbul Cerrahpaşa University** — c-istanbul, state
3. **Ege University** — c-izmir, state
4. **Akdeniz University** — c-antalya, state
5. **Bursa Uludağ University** — c-bursa, state
6. **Erciyes University** — c-kayseri, state
7. **Kocaeli University** — c-kocaeli, state
8. **Karadeniz Technical University** — c-trabzon, state
9. **Mersin University** — c-mersin, state
10. **Gaziantep University** — c-gaziantep, state

Each: name, slug, cityId, foundedYear, studentCount, ranking, accreditation,
isState, logoText, tagline + description in en/tr/az/ru (description 40-50+ words,
SEO-friendly, no keyword stuffing), languages ['en','tr'], featured: false.

### Images per university
- `public/images/universities/{slug}/hero.webp`
- `public/images/universities/{slug}/gallery-1.webp`, `gallery-2.webp`, `gallery-3.webp`
- Source: Unsplash (free to use), downloaded and converted to WebP (max 1600px wide,
  quality 80-85%)
- Local path in seed: `'/images/universities/{slug}/hero.webp'`
- Do NOT use `seedImages.xxx` for new entries.
- CREDITS.md entry for every image (photographer + URL).

## Blog posts (8)
Topics:
1. Study Medicine in Turkey: Tuition Costs (2026) — category: Guides/Medicine
2. YÖS Exam Preparation Guide — Guides
3. Student Life in Izmir — Student Life
4. Types of Scholarships at Turkish Universities — Scholarships
5. Turkish Student Visa & Residence Permit Guide — Guides/Visa
6. English-Taught Engineering Programs in Turkey — Engineering
7. Part-Time Work Opportunities for Students in Turkey — Student Life
8. Cost of Living by Region in Turkey — Student Life

Each: title, excerpt, content (en/tr/az/ru), content min 300 words, structured
with h2/h3-style sections (plain paragraphs separated by \n\n — blog render splits
on \n; keep headings as plain text lines), coverImage local WebP, category,
author 'StudyHub Team', publishedAt (before today), readingMinutes.

Internal linking: mention related universities/programs with site paths
(e.g. `/universities/ege-university`) inside content text.

### Images per post
- `public/images/blog/{slug}/cover.webp`

## Technical checks
- next.config.mjs: no new remotePatterns (local paths need none); leave existing
  Unsplash/Pexels patterns untouched.
- Slug uniqueness verified against existing seed.
- sitemap.ts auto-covers new slugs via data.universities.list() / data.blog.list()
  (no change needed).
- json-ld.ts works with string image paths (no change needed).

## Files to modify
- `src/lib/seed/universities.ts` (append 10 entries)
- `src/lib/seed/blog.ts` (append 8 entries)
- `public/images/CREDITS.md` (new)
- New image files under `public/images/universities/*` and `public/images/blog/*`

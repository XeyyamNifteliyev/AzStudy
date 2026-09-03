import { describe, it, expect } from "vitest";
import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { seedUniversities } from "@/lib/seed/universities";
import { seedUniversityPrograms } from "@/lib/seed/university-programs";
import { seedPrograms } from "@/lib/seed/programs";
import { seedCities } from "@/lib/seed/cities";
import { seedScholarships } from "@/lib/seed/scholarships";
import { seedDormitories } from "@/lib/seed/dormitories";
import { seedReviews } from "@/lib/seed/reviews";
import { seedFaqs } from "@/lib/seed/faqs";
import { createSeedDataLayer } from "@/lib/data/seed-repository";
import { routing } from "@/i18n/routing";

/**
 * Content-integrity regression guards.
 *
 * These assert invariants that were broken repeatedly during earlier content
 * rounds and are invisible to the eye on a live page:
 *   - referential integrity between seed tables (orphan rows used to 500 the
 *     /programs/* pages in seed mode via non-null assertions)
 *   - every served blog URL fully localized (thin locales used to fall back
 *     to noindex EN canonical)
 *   - university image assets actually exist on disk
 *   - duplicate slugs/rows never come back
 * All checks run against the raw seed modules, so they hold in both the seed
 * and the Postgres runtime modes (the DB is seeded from the same files).
 */

const LOCALES = routing.locales;
const CONTENT_MIN_CHARS = 200;

describe("Seed referential integrity", () => {
  const uniIds = new Set(seedUniversities.map((u) => u.id));
  const progIds = new Set(seedPrograms.map((p) => p.id));
  const cityIds = new Set(seedCities.map((c) => c.id));

  it("has unique university slugs and no legacy/deleted slugs", () => {
    const slugs = seedUniversities.map((u) => u.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const legacy of [
      "azerbaijan-aviation-university",
      "baku-engineering-university-xirdalan",
    ]) {
      expect(slugs).not.toContain(legacy);
    }
  });

  it("resolves every university cityId to a seeded city", () => {
    for (const u of seedUniversities) {
      expect(
        cityIds.has(u.cityId),
        `${u.slug} -> unknown city ${u.cityId}`,
      ).toBe(true);
    }
    // And every Ganja/Nakhchivan/Khankendi university points at the real row.
    const genceUnis = seedUniversities.filter(
      (u) => u.slug.startsWith("gance") || u.slug.includes("agricultural"),
    );
    expect(genceUnis.every((u) => u.cityId === "c-gence")).toBe(true);
    const naxcivanUnis = seedUniversities.filter(
      (u) => u.slug.includes("naxcivan") || u.slug.includes("naxchivan"),
    );
    expect(naxcivanUnis.every((u) => u.cityId === "c-naxcivan")).toBe(true);
  });

  it("has no orphan or duplicate university×program rows", () => {
    for (const up of seedUniversityPrograms) {
      expect(
        uniIds.has(up.universityId),
        `row ${up.id} -> unknown university ${up.universityId}`,
      ).toBe(true);
      expect(
        progIds.has(up.programId),
        `row ${up.id} -> unknown program ${up.programId}`,
      ).toBe(true);
    }
    const keyCount = new Map<string, number>();
    for (const up of seedUniversityPrograms) {
      const key = `${up.universityId}|${up.programId}|${up.language}`;
      keyCount.set(key, (keyCount.get(key) ?? 0) + 1);
    }
    for (const [key, count] of keyCount) {
      expect(count, `duplicate university×program rows for ${key}`).toBe(1);
    }
  });

  it("has no orphan scholarship/dormitory/review/faq university refs", () => {
    for (const s of seedScholarships) {
      expect(uniIds.has(s.universityId)).toBe(true);
    }
    for (const d of seedDormitories) {
      expect(uniIds.has(d.universityId)).toBe(true);
    }
    for (const r of seedReviews) {
      expect(uniIds.has(r.universityId)).toBe(true);
    }
    for (const f of seedFaqs) {
      if (f.entityType === "university") {
        expect(uniIds.has(f.entityId)).toBe(true);
      }
    }
  });
});

describe("Every blog URL is fully localized", () => {
  it("keeps unique slugs across the whole blog surface", async () => {
    const blog = createSeedDataLayer();
    const posts = await blog.blog.list();
    const slugs = posts.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("has content >= 200 chars in all locales for every post", async () => {
    const blog = createSeedDataLayer();
    const posts = await blog.blog.list();
    expect(posts.length).toBeGreaterThan(0);
    for (const post of posts) {
      for (const locale of LOCALES) {
        const content = (post.content as Record<string, string>)[locale] ?? "";
        expect(
          content.length,
          `${post.slug} [${locale}] is ${content.length} chars — thin content falls back to noindex`,
        ).toBeGreaterThanOrEqual(CONTENT_MIN_CHARS);
      }
    }
  });
});

describe("University image assets exist on disk", () => {
  it("has a real local hero image for every university", () => {
    const missing: string[] = [];
    for (const u of seedUniversities) {
      for (const [label, src] of [
        ["hero", u.heroImage],
        ["logo", u.logoImage],
      ] as const) {
        if (!src || !src.startsWith("/images/")) continue; // remote/placeholder
        // /images/... is served from <root>/public/images/...
        const file = path.resolve(process.cwd(), "public", src.slice(1));
        if (!existsSync(file) || statSync(file).size === 0) {
          missing.push(`${u.slug} ${label}: ${src}`);
        }
      }
    }
    expect(missing).toEqual([]);
  });
});

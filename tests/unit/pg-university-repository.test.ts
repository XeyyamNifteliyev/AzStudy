import { describe, expect, it, vi } from "vitest";
import type { Pool } from "pg";
import { createPgDataLayer } from "@/lib/data/pg-data-repository";

describe("Postgres university listing metadata", () => {
  it("limits tuition and review aggregates to requested university IDs", async () => {
    const query = vi.fn().mockResolvedValue({ rows: [] });
    const repository = createPgDataLayer(
      () => ({ query }) as unknown as Pool,
    ).universities;

    await repository.getListingMetadata(["u-1", "u-2"]);

    const [sql, params] = query.mock.calls[0] as [string, string[][]];
    expect(sql).toMatch(
      /from public\.university_programs\s+where university_id = any\(\$1::text\[\]\)/i,
    );
    expect(sql).toMatch(
      /from public\.reviews\s+where university_id = any\(\$1::text\[\]\)/i,
    );
    expect(params).toEqual([["u-1", "u-2"]]);
  });

  it("does not query Postgres for an empty ID batch", async () => {
    const query = vi.fn();
    const repository = createPgDataLayer(
      () => ({ query }) as unknown as Pool,
    ).universities;

    expect(await repository.getListingMetadata([])).toEqual(new Map());
    expect(query).not.toHaveBeenCalled();
  });

  it("omits requested IDs with no metadata rows", async () => {
    const query = vi.fn().mockResolvedValue({ rows: [{ id: "u-1" }] });
    const repository = createPgDataLayer(
      () => ({ query }) as unknown as Pool,
    ).universities;

    const metadata = await repository.getListingMetadata(["u-1", "u-missing"]);

    expect(metadata.has("u-1")).toBe(true);
    expect(metadata.has("u-missing")).toBe(false);
  });
});

describe("Postgres listWithMetadata", () => {
  function listingRow(overrides: Record<string, unknown> = {}) {
    return {
      id: "u-1",
      slug: "uni-1",
      city_id: "c-1",
      name: "University 1",
      founded_year: 1990,
      student_count: 10000,
      ranking: 10,
      accreditation: "YÖK",
      is_state: true,
      logo_text: "U1",
      hero_image: null,
      gallery: null,
      tagline_i18n: null,
      description_i18n: null,
      languages: ["tr"],
      featured: false,
      // metadata columns from the lateral joins
      c_id: "c-1",
      c_slug: "istanbul",
      c_country_code: "tr",
      c_name_i18n: { en: "Istanbul" },
      min_tuition: "3500",
      original_fee: "3850",
      avg_rating: "4.25",
      review_count: 2,
      degree_levels: ["bachelor", "master"],
      ...overrides,
    };
  }

  it("fetches universities and card metadata in a single round trip", async () => {
    const query = vi.fn().mockResolvedValue({ rows: [listingRow()] });
    const repository = createPgDataLayer(
      () => ({ query }) as unknown as Pool,
    ).universities;

    const items = await repository.listWithMetadata({});

    expect(query).toHaveBeenCalledTimes(1);
    const [sql] = query.mock.calls[0] as [string, unknown[]];
    // All three metadata sources are lateral joins on the single listing query.
    expect(sql).toMatch(/left join lateral/i);
    expect(sql).toMatch(/left join public\.cities c on c\.id = u\.city_id/i);
    expect(sql).toMatch(/from public\.university_programs up/i);
    expect(sql).toMatch(/from public\.reviews r/i);

    expect(items).toHaveLength(1);
    expect(items[0].university).toMatchObject({ id: "u-1", slug: "uni-1" });
    expect(items[0].metadata).toEqual({
      city: {
        id: "c-1",
        slug: "istanbul",
        countryId: "tr",
        name: { en: "Istanbul" },
      },
      minTuitionUSD: 3500,
      originalFeeUSD: 3850,
      rating: 4.3, // round(4.25 * 10) / 10
      count: 2,
      degreeLevels: ["bachelor", "master"],
    });
  });

  it("omits originalFee when it does not exceed the min tuition, defaults rating to 0", async () => {
    const query = vi.fn().mockResolvedValue({
      rows: [
        listingRow({
          original_fee: "3500",
          avg_rating: null,
          review_count: 0,
          min_tuition: "3500",
        }),
      ],
    });
    const repository = createPgDataLayer(
      () => ({ query }) as unknown as Pool,
    ).universities;

    const [item] = await repository.listWithMetadata({});

    expect(item.metadata.originalFeeUSD).toBeUndefined();
    expect(item.metadata.minTuitionUSD).toBe(3500);
    expect(item.metadata.rating).toBe(0);
    expect(item.metadata.count).toBe(0);
  });

  it("handles universities without a city or tuition (left joins)", async () => {
    const query = vi.fn().mockResolvedValue({
      rows: [
        listingRow({
          c_id: null,
          c_slug: null,
          c_country_code: null,
          c_name_i18n: null,
          min_tuition: null,
          original_fee: null,
        }),
      ],
    });
    const repository = createPgDataLayer(
      () => ({ query }) as unknown as Pool,
    ).universities;

    const [item] = await repository.listWithMetadata({});

    expect(item.metadata.city).toBeNull();
    expect(item.metadata.minTuitionUSD).toBeUndefined();
    expect(item.metadata.degreeLevels).toEqual(["bachelor", "master"]);
  });

  it("applies filters through the shared WHERE builder", async () => {
    const query = vi.fn().mockResolvedValue({ rows: [] });
    const repository = createPgDataLayer(
      () => ({ query }) as unknown as Pool,
    ).universities;

    await repository.listWithMetadata({ citySlug: "istanbul", isState: true });

    const [sql, params] = query.mock.calls[0] as [string, unknown[]];
    expect(sql).toMatch(
      /u\.city_id = \(select id from public\.cities where slug = \$\d+\)/i,
    );
    expect(sql).toMatch(/u\.is_state = \$\d+/i);
    // Params start with excluded slugs (where builder), then filter values.
    expect(params.slice(-2)).toEqual(["istanbul", true]);
  });

  it("filters max tuition via the lateral min-tuition column", async () => {
    const query = vi.fn().mockResolvedValue({ rows: [] });
    const repository = createPgDataLayer(
      () => ({ query }) as unknown as Pool,
    ).universities;

    await repository.listWithMetadata({ maxTuitionUSD: 5000 });

    const [sql, params] = query.mock.calls[0] as [string, unknown[]];
    expect(sql).toMatch(
      /t\.min_tuition is not null and t\.min_tuition <= \$\d+/i,
    );
    expect(params.slice(-1)).toEqual([5000]);
  });
});

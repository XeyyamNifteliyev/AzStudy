import { describe, expect, test } from "vitest";
import type { University } from "@/types";
import type { UniversityListingItem } from "@/lib/data/repositories";
import {
  parseListingQuery,
  parseListingParams,
  filterUniversityItems,
  sortUniversities,
} from "@/lib/universities/listing-query";

const university = (id: string, name: string, ranking: number): University => ({
  id,
  name,
  slug: id,
  cityId: "istanbul",
  foundedYear: 2000,
  studentCount: 1000,
  ranking,
  accreditation: "accredited",
  isState: true,
  logoText: name,
  heroImage: "",
  gallery: [],
  tagline: {},
  description: {},
  languages: ["en"],
});

describe("parseListingQuery", () => {
  test("parses supported listing filters, tuition, and sort", () => {
    expect(
      parseListingQuery({
        city: "istanbul",
        degree: "master",
        language: "en",
        type: "private",
        search: "engineering",
        maxTuition: "12500",
        sort: "tuition",
      }),
    ).toEqual({
      filters: {
        citySlug: "istanbul",
        degreeLevel: "master",
        language: "en",
        isState: false,
        search: "engineering",
        maxTuitionUSD: 12500,
      },
      sort: "tuition",
    });
  });

  test("falls back for invalid filters, tuition, and sort values", () => {
    expect(
      parseListingQuery({
        degree: "doctorate",
        language: "de",
        type: "public",
        maxTuition: "-1",
        sort: "popular",
      }),
    ).toEqual({ filters: {}, sort: "relevance" });

    expect(parseListingQuery({ maxTuition: "Infinity" })).toEqual({
      filters: {},
      sort: "relevance",
    });

    expect(parseListingQuery({ maxTuition: "0" })).toEqual({
      filters: {},
      sort: "relevance",
    });
  });
});

describe("parseListingParams", () => {
  test("parses listing filters from URLSearchParams", () => {
    const sp = new URLSearchParams(
      "city=istanbul&degree=master&language=en&type=state&search=tech&maxTuition=8000&sort=name",
    );
    expect(parseListingParams(sp)).toEqual({
      filters: {
        citySlug: "istanbul",
        degreeLevel: "master",
        language: "en",
        isState: true,
        search: "tech",
        maxTuitionUSD: 8000,
      },
      sort: "name",
    });
  });

  test("returns empty filters and relevance sort for an empty query", () => {
    expect(parseListingParams(new URLSearchParams(""))).toEqual({
      filters: {},
      sort: "relevance",
    });
  });

  test("ignores keys not part of the listing query", () => {
    expect(
      parseListingParams(new URLSearchParams("utm_source=google&sort=ranking")),
    ).toEqual({ filters: {}, sort: "ranking" });
  });
});

describe("filterUniversityItems", () => {
  const item = (
    id: string,
    name: string,
    overrides: Partial<{
      cityId: string;
      isState: boolean;
      languages: string[];
      degreeLevels: UniversityListingItem["metadata"]["degreeLevels"];
      minTuitionUSD: number | undefined;
    }> = {},
  ): UniversityListingItem => ({
    university: {
      ...university(id, name, 10),
      cityId: overrides.cityId ?? "istanbul",
      isState: overrides.isState ?? true,
      languages: overrides.languages ?? ["en"],
    },
    metadata: {
      city: null,
      minTuitionUSD: overrides.minTuitionUSD,
      rating: 0,
      count: 0,
      degreeLevels: overrides.degreeLevels ?? ["bachelor"],
    },
  });

  const items = [
    item("u1", "Istanbul Technical University", { cityId: "c-istanbul" }),
    item("u2", "Ankara University", {
      cityId: "c-ankara",
      isState: true,
      languages: ["tr"],
      degreeLevels: ["master"],
      minTuitionUSD: 4000,
    }),
    item("u3", "Private Tech University", {
      cityId: "c-istanbul",
      isState: false,
      languages: ["en"],
      degreeLevels: ["bachelor", "master"],
      minTuitionUSD: 12000,
    }),
  ];
  const cityBySlug = { istanbul: "c-istanbul", ankara: "c-ankara" };

  test("filters by city slug", () => {
    expect(
      filterUniversityItems(items, { citySlug: "istanbul" }, cityBySlug).map(
        (i) => i.university.id,
      ),
    ).toEqual(["u1", "u3"]);
  });

  test("filters by state/private type", () => {
    expect(
      filterUniversityItems(items, { isState: false }, cityBySlug).map(
        (i) => i.university.id,
      ),
    ).toEqual(["u3"]);
  });

  test("filters by degree level from metadata", () => {
    expect(
      filterUniversityItems(items, { degreeLevel: "master" }, cityBySlug).map(
        (i) => i.university.id,
      ),
    ).toEqual(["u2", "u3"]);
  });

  test("filters by language from the university languages array", () => {
    expect(
      filterUniversityItems(items, { language: "tr" }, cityBySlug).map(
        (i) => i.university.id,
      ),
    ).toEqual(["u2"]);
  });

  test("filters by search on name and slug", () => {
    expect(
      filterUniversityItems(items, { search: "technical" }, cityBySlug).map(
        (i) => i.university.id,
      ),
    ).toEqual(["u1"]);
  });

  test("filters by max tuition against the metadata min tuition", () => {
    expect(
      filterUniversityItems(items, { maxTuitionUSD: 5000 }, cityBySlug).map(
        (i) => i.university.id,
      ),
    ).toEqual(["u2"]);
  });

  test("combines filters and never mutates the input", () => {
    const before = items.map((i) => i.university.id);
    const result = filterUniversityItems(
      items,
      { citySlug: "istanbul", isState: false },
      cityBySlug,
    );
    expect(result.map((i) => i.university.id)).toEqual(["u3"]);
    expect(items.map((i) => i.university.id)).toEqual(before);
  });
});

describe("sortUniversities", () => {
  const universities = [
    university("u2", "Beta University", 20),
    university("u3", "Alpha University", 30),
    university("u1", "Alpha University", 10),
  ];

  test("sorts by name ascending", () => {
    expect(sortUniversities(universities, "name").map((u) => u.id)).toEqual([
      "u3",
      "u1",
      "u2",
    ]);
  });

  test("sorts by ranking ascending", () => {
    expect(sortUniversities(universities, "ranking").map((u) => u.id)).toEqual([
      "u1",
      "u2",
      "u3",
    ]);
  });

  test("sorts by tuition ascending using the supplied map", () => {
    expect(
      sortUniversities(universities, "tuition", {
        u1: 9000,
        u2: 3000,
        u3: 5000,
      }).map((u) => u.id),
    ).toEqual(["u2", "u3", "u1"]);
  });

  test("sorts universities with unknown tuition after known tuition", () => {
    expect(
      sortUniversities(universities, "tuition", {
        u1: 9000,
        u2: 3000,
        u3: 0,
      }).map((u) => u.id),
    ).toEqual(["u2", "u1", "u3"]);
  });

  test("preserves relevance order and does not mutate the input", () => {
    const result = sortUniversities(universities, "relevance");

    expect(result.map((u) => u.id)).toEqual(["u2", "u3", "u1"]);
    expect(result).not.toBe(universities);
    expect(universities.map((u) => u.id)).toEqual(["u2", "u3", "u1"]);
  });
});

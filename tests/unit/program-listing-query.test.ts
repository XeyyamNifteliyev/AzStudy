import { describe, expect, test } from "vitest";
import type { ProgramCategory, ProgramCombination, City } from "@/types";
import {
  filterProgramCombinations,
  parseProgramListingQuery,
  sortProgramCombinations,
  updateProgramQuery,
} from "@/lib/programs/listing-query";

const categories: ProgramCategory[] = [
  { slug: "medicine", name: { en: "Medicine", tr: "Tıp" } },
  { slug: "engineering", name: { en: "Engineering", tr: "Mühendislik" } },
];

const cities: City[] = [
  {
    id: "istanbul",
    slug: "istanbul",
    countryId: "tr",
    name: { en: "Istanbul", tr: "İstanbul" },
  },
  {
    id: "ankara",
    slug: "ankara",
    countryId: "tr",
    name: { en: "Ankara", tr: "Ankara" },
  },
];

const combinations: ProgramCombination[] = [
  {
    categorySlug: "engineering",
    citySlug: "istanbul",
    programIds: [],
    universityCount: 4,
    minTuitionUSD: 7000,
  },
  {
    categorySlug: "medicine",
    citySlug: "ankara",
    programIds: [],
    universityCount: 2,
    minTuitionUSD: 12000,
  },
];

describe("parseProgramListingQuery", () => {
  test("accepts supported filters and sort values", () => {
    expect(
      parseProgramListingQuery({
        search: "istanbul",
        category: "medicine",
        city: "ankara",
        sort: "tuition",
      }),
    ).toEqual({
      search: "istanbul",
      category: "medicine",
      city: "ankara",
      sort: "tuition",
    });
  });

  test("ignores invalid values and defaults to relevance", () => {
    expect(
      parseProgramListingQuery({ category: "not-a-category", sort: "ranking" }),
    ).toEqual({ sort: "relevance" });
  });
});

describe("filterProgramCombinations", () => {
  test("matches localized category and city names from search", () => {
    expect(
      filterProgramCombinations(
        combinations,
        categories,
        cities,
        { search: "mühendislik" },
        "tr",
      ),
    ).toEqual([combinations[0]]);
    expect(
      filterProgramCombinations(
        combinations,
        categories,
        cities,
        { search: "ankara" },
        "en",
      ),
    ).toEqual([combinations[1]]);
  });
});

describe("sortProgramCombinations", () => {
  test("sorts by localized city/category name or tuition without mutating input", () => {
    expect(
      sortProgramCombinations(
        combinations,
        categories,
        cities,
        "name",
        "en",
      ).map((item) => item.citySlug),
    ).toEqual(["ankara", "istanbul"]);
    expect(
      sortProgramCombinations(
        combinations,
        categories,
        cities,
        "tuition",
        "en",
      ).map((item) => item.minTuitionUSD),
    ).toEqual([7000, 12000]);
    expect(combinations.map((item) => item.citySlug)).toEqual([
      "istanbul",
      "ankara",
    ]);
  });
});

test("updates program filters while preserving unrelated query parameters", () => {
  const current = new URLSearchParams(
    "page=2&search=old&category=medicine&sort=tuition",
  );
  expect(updateProgramQuery(current, "city", "ankara").toString()).toBe(
    "page=2&search=old&category=medicine&sort=tuition&city=ankara",
  );
  expect(updateProgramQuery(current, null, null).toString()).toBe("page=2");
});

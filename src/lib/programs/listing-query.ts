import type { AppLocale } from "@/i18n/routing";
import type { City, ProgramCategory, ProgramCombination } from "@/types";

export type ProgramSort = "relevance" | "name" | "tuition";

export interface ProgramListingQuery {
  search?: string;
  category?: string;
  city?: string;
  sort: ProgramSort;
}

const CATEGORY_SLUGS = new Set([
  "medicine",
  "engineering",
  "computer-science",
  "business",
  "law",
  "architecture",
  "dentistry",
  "arts",
]);

type QueryInput = Record<string, string | string[] | undefined>;

function valueOf(input: QueryInput, key: string) {
  const value = input[key];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

export function parseProgramListingQuery(
  input: QueryInput,
): ProgramListingQuery {
  const sort = valueOf(input, "sort");
  const search = valueOf(input, "search");
  const category = valueOf(input, "category");
  const city = valueOf(input, "city");
  return {
    ...(search ? { search } : {}),
    ...(category && CATEGORY_SLUGS.has(category) ? { category } : {}),
    ...(city ? { city } : {}),
    sort: sort === "name" || sort === "tuition" ? sort : "relevance",
  };
}

export function filterProgramCombinations(
  combinations: readonly ProgramCombination[],
  categories: readonly ProgramCategory[],
  cities: readonly City[],
  query: Pick<ProgramListingQuery, "search" | "category" | "city">,
  locale: AppLocale,
) {
  const categoryBySlug = new Map(
    categories.map((category) => [category.slug, category]),
  );
  const cityBySlug = new Map(cities.map((city) => [city.slug, city]));
  const search = query.search?.toLocaleLowerCase(locale);

  return combinations.filter((combination) => {
    if (query.category && combination.categorySlug !== query.category)
      return false;
    if (query.city && combination.citySlug !== query.city) return false;
    if (!search) return true;

    const category = categoryBySlug.get(combination.categorySlug);
    const city = cityBySlug.get(combination.citySlug);
    const labels = [
      category?.name[locale] ?? combination.categorySlug,
      city?.name[locale] ?? combination.citySlug,
    ];
    return labels.some((label) =>
      label.toLocaleLowerCase(locale).includes(search),
    );
  });
}

export function sortProgramCombinations(
  combinations: readonly ProgramCombination[],
  categories: readonly ProgramCategory[],
  cities: readonly City[],
  sort: ProgramSort,
  locale: AppLocale,
) {
  if (sort === "relevance") return [...combinations];

  const categoryBySlug = new Map(
    categories.map((category) => [category.slug, category]),
  );
  const cityBySlug = new Map(cities.map((city) => [city.slug, city]));
  return combinations
    .map((combination, index) => ({ combination, index }))
    .sort((a, b) => {
      const comparison =
        sort === "tuition"
          ? a.combination.minTuitionUSD - b.combination.minTuitionUSD
          : `${cityBySlug.get(a.combination.citySlug)?.name[locale] ?? a.combination.citySlug} ${categoryBySlug.get(a.combination.categorySlug)?.name[locale] ?? a.combination.categorySlug}`.localeCompare(
              `${cityBySlug.get(b.combination.citySlug)?.name[locale] ?? b.combination.citySlug} ${categoryBySlug.get(b.combination.categorySlug)?.name[locale] ?? b.combination.categorySlug}`,
              locale,
            );
      return comparison || a.index - b.index;
    })
    .map(({ combination }) => combination);
}

const PROGRAM_LISTING_KEYS = ["search", "category", "city", "sort"];

export function updateProgramQuery(
  current: URLSearchParams,
  key: string | null,
  value: string | null,
) {
  const params = new URLSearchParams(current.toString());
  if (key === null) {
    PROGRAM_LISTING_KEYS.forEach((listingKey) => params.delete(listingKey));
    return params;
  }
  if (value && value !== "all") params.set(key, value);
  else params.delete(key);
  return params;
}

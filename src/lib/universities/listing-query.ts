import type { DegreeLevel, University, UniversityFilters } from "@/types";
import type { UniversityListingItem } from "@/lib/data/repositories";

export type UniversitySort = "relevance" | "name" | "tuition" | "ranking";

type ListingQueryValue = string | string[] | undefined;
export type ListingQueryInput = Record<string, ListingQueryValue>;

export interface ParsedListingQuery {
  filters: UniversityFilters;
  sort: UniversitySort;
}

type TuitionByUniversity =
  Readonly<Record<string, number>> | ReadonlyMap<string, number>;

const degreeLevels: readonly DegreeLevel[] = [
  "bachelor",
  "master",
  "phd",
  "associate",
];

function valueOf(input: ListingQueryInput, key: string): string | undefined {
  const value = input[key];
  return typeof value === "string" ? value : undefined;
}

function tuitionValue(value: string | undefined): number | undefined {
  if (value === undefined || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

/** URLSearchParams variant of `parseListingQuery` — used by the client-side
 * explorer where the URL (not a server request) is the source of truth. */
export function parseListingParams(
  searchParams: URLSearchParams,
): ParsedListingQuery {
  const input: ListingQueryInput = {};
  for (const key of [
    "city",
    "degree",
    "language",
    "type",
    "search",
    "maxTuition",
    "sort",
  ]) {
    const value = searchParams.get(key);
    if (value !== null) input[key] = value;
  }
  return parseListingQuery(input);
}

/**
 * Client-side mirror of the server `list(filters)` WHERE clause. Runs against
 * the full listing payload (Phase 2) so filter changes never hit the server.
 * `cityIdBySlug` maps city slugs to ids (the server filters by resolved id).
 */
export function filterUniversityItems(
  items: readonly UniversityListingItem[],
  filters: UniversityFilters,
  cityIdBySlug: Readonly<Record<string, string>>,
  locale?: string,
): UniversityListingItem[] {
  return items.filter(({ university, metadata }) => {
    if (filters.citySlug) {
      const cityId = cityIdBySlug[filters.citySlug];
      if (cityId === undefined || university.cityId !== cityId) return false;
    }
    if (
      typeof filters.isState === "boolean" &&
      university.isState !== filters.isState
    ) {
      return false;
    }
    if (
      filters.degreeLevel &&
      !(metadata.degreeLevels ?? []).includes(filters.degreeLevel)
    ) {
      return false;
    }
    if (filters.language && !university.languages.includes(filters.language)) {
      return false;
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const i18nMap = university.nameI18n as Record<string, string> | undefined;
      const localName = locale ? (i18nMap?.[locale] ?? "").toLowerCase() : "";
      if (
        !university.name.toLowerCase().includes(q) &&
        !localName.includes(q) &&
        !university.slug.includes(q)
      ) {
        return false;
      }
    }
    if (filters.maxTuitionUSD !== undefined) {
      const min = metadata.minTuitionUSD;
      if (min === undefined || min > filters.maxTuitionUSD) return false;
    }
    return true;
  });
}

export function parseListingQuery(
  input: ListingQueryInput,
): ParsedListingQuery {
  const city = valueOf(input, "city");
  const degree = valueOf(input, "degree");
  const language = valueOf(input, "language");
  const type = valueOf(input, "type");
  const search = valueOf(input, "search");
  const maxTuitionUSD = tuitionValue(valueOf(input, "maxTuition"));
  const sortValue = valueOf(input, "sort");
  const sort: UniversitySort =
    sortValue === "name" || sortValue === "tuition" || sortValue === "ranking"
      ? sortValue
      : "relevance";

  const filters: UniversityFilters = {};
  if (city) filters.citySlug = city;
  if (degreeLevels.includes(degree as DegreeLevel)) {
    filters.degreeLevel = degree as DegreeLevel;
  }
  if (language === "en" || language === "tr") filters.language = language;
  if (type === "state") filters.isState = true;
  if (type === "private") filters.isState = false;
  if (search) filters.search = search;
  if (maxTuitionUSD !== undefined) filters.maxTuitionUSD = maxTuitionUSD;

  return { filters, sort };
}

function tuitionFor(
  universityId: string,
  tuitionByUniversity: TuitionByUniversity | undefined,
): number | undefined {
  if (!tuitionByUniversity) return undefined;
  const value =
    tuitionByUniversity instanceof Map
      ? tuitionByUniversity.get(universityId)
      : (tuitionByUniversity as Readonly<Record<string, number>>)[universityId];
  return value !== undefined && Number.isFinite(value) && value > 0
    ? value
    : undefined;
}

export function sortUniversities(
  universities: readonly University[],
  sort: UniversitySort,
  tuitionByUniversity?: TuitionByUniversity,
  locale?: string,
): University[] {
  return universities
    .map((university, index) => ({ university, index }))
    .sort((a, b) => {
      let comparison = 0;
      if (sort === "name") {
        const aName = locale
          ? ((a.university.nameI18n as Record<string, string> | undefined)?.[
              locale
            ] ?? a.university.name)
          : a.university.name;
        const bName = locale
          ? ((b.university.nameI18n as Record<string, string> | undefined)?.[
              locale
            ] ?? b.university.name)
          : b.university.name;
        comparison = aName.localeCompare(bName);
      }
      if (sort === "ranking")
        comparison = a.university.ranking - b.university.ranking;
      if (sort === "tuition") {
        const aTuition = tuitionFor(a.university.id, tuitionByUniversity);
        const bTuition = tuitionFor(b.university.id, tuitionByUniversity);
        if (aTuition === undefined && bTuition !== undefined) return 1;
        if (aTuition !== undefined && bTuition === undefined) return -1;
        comparison = (aTuition ?? 0) - (bTuition ?? 0);
      }
      return comparison || a.index - b.index;
    })
    .map(({ university }) => university);
}

/* ── View-model variants (PERF §6.1) ──────────────────────────────────
 * The client explorer now receives projected UniversityCardVM objects
 * instead of full University rows. Same semantics as the functions
 * above, but operating on the slim per-locale shape (no nameI18n map
 * lookups at filter/sort time — the locale resolution already happened
 * on the server). */

export function filterUniversityVMs(
  items: readonly import("@/lib/universities/view-model").UniversityCardVM[],
  filters: UniversityFilters,
  cityIdBySlug?: Readonly<Record<string, string>>,
): import("@/lib/universities/view-model").UniversityCardVM[] {
  const cityId = filters.citySlug
    ? cityIdBySlug?.[filters.citySlug]
    : undefined;
  return items.filter((vm) => {
    if (filters.citySlug) {
      // Same semantics as filterUniversityItems: the URL carries a city slug,
      // resolved to the server-side city id via cityIdBySlug.
      if (cityId === undefined || vm.cityId !== cityId) return false;
    }
    if (
      typeof filters.isState === "boolean" &&
      vm.isState !== filters.isState
    ) {
      return false;
    }
    if (filters.degreeLevel && !vm.degreeLevels.includes(filters.degreeLevel)) {
      return false;
    }
    if (filters.language && !vm.languages.includes(filters.language)) {
      return false;
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (
        !vm.name.toLowerCase().includes(q) &&
        !vm.localName.toLowerCase().includes(q) &&
        !vm.slug.includes(q)
      ) {
        return false;
      }
    }
    if (filters.maxTuitionUSD !== undefined) {
      const min = vm.minTuitionUSD;
      if (min === undefined || min > filters.maxTuitionUSD) return false;
    }
    return true;
  });
}

export function sortUniversityVMs(
  items: readonly import("@/lib/universities/view-model").UniversityCardVM[],
  sort: UniversitySort,
): import("@/lib/universities/view-model").UniversityCardVM[] {
  return items
    .map((vm, index) => ({ vm, index }))
    .sort((a, b) => {
      let comparison = 0;
      if (sort === "name")
        comparison = a.vm.localName.localeCompare(b.vm.localName);
      if (sort === "ranking") comparison = a.vm.ranking - b.vm.ranking;
      if (sort === "tuition") {
        const aTuition = a.vm.minTuitionUSD;
        const bTuition = b.vm.minTuitionUSD;
        if (aTuition === undefined && bTuition !== undefined) return 1;
        if (aTuition !== undefined && bTuition === undefined) return -1;
        comparison = (aTuition ?? 0) - (bTuition ?? 0);
      }
      return comparison || a.index - b.index;
    })
    .map(({ vm }) => vm);
}

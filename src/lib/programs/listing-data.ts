import { data } from "@/lib/data";
import { getCachedCities } from "@/lib/universities/listing-data";
import type { ProgramListingFilters } from "@/lib/data/repositories";

export { getCachedCities };

// PERF: the /programs page is dynamic (reads searchParams), so ISR never
// caches its HTML. These wrappers cache the DATA instead — after the first
// request per (page × filters) combination the page renders without touching
// Postgres. Same pattern as the universities listing (Phase 1).
export function getCachedProgramCategories() {
  return data.programs.getCategories();
}

export function getCachedProgramListingPage(
  page: number,
  perPage: number,
  filters: ProgramListingFilters = {},
) {
  return data.programs.listPage(page, perPage, filters);
}

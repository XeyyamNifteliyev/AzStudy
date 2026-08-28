import { data } from "@/lib/data";
import type { UniversityFilters } from "@/types";

export async function getCachedUniversityListing(
  filters: UniversityFilters,
) {
  return data.universities.listWithMetadata(filters);
}

export async function getCachedCities() {
  return data.cities.list();
}

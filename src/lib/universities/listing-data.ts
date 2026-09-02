import { unstable_cache } from "next/cache";
import { data } from "@/lib/data";
import type { UniversityFilters } from "@/types";

export const getCachedUniversityListing = unstable_cache(
  (filters: UniversityFilters) => data.universities.listWithMetadata(filters),
  ["uni-listing"],
  { revalidate: 900, tags: ["universities"] },
);

export const getCachedCities = unstable_cache(
  () => data.cities.list(),
  ["cities"],
  { revalidate: 86400, tags: ["cities"] },
);

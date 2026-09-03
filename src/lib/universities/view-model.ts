import type { AppLocale } from "@/i18n/routing";
import type { City, DegreeLevel, University } from "@/types";
import type {
  UniversityListingItem,
  UniversityListingMetadata,
} from "@/lib/data/repositories";
import { lx } from "@/lib/i18n/lx";

/**
 * PERF(P0) view-model projection (§6.1 of xeyyam.md): the client explorer used
 * to receive full `University` objects — every locale variant of nameI18n,
 * tagline, description, gallery… — which ballooned the RSC flight payload to
 * ~524KB for the listing page. The VM carries ONLY the fields the card,
 * filters and sorts actually consume, with localized strings resolved to a
 * single locale string on the server.
 */
export interface UniversityCardVM {
  id: string;
  slug: string;
  /** Canonical (EN) name — display fallback + search haystack. */
  name: string;
  /** Name in the request locale — display + name sort + search. */
  localName: string;
  heroImage: string;
  logoImage?: string;
  logoText: string;
  isState: boolean;
  ranking: number;
  foundedYear: number;
  languages: string[];
  cityId: string;
  /** City name in the request locale — null when unknown. */
  cityName: string | null;
  degreeLevels: DegreeLevel[];
  minTuitionUSD?: number;
  originalFeeUSD?: number;
  rating: number;
  count: number;
}

function buildVM(
  university: University,
  metadata: UniversityListingMetadata | null,
  overrides: { minTuitionUSD?: number; originalFeeUSD?: number },
  locale: AppLocale,
): UniversityCardVM {
  return {
    id: university.id,
    slug: university.slug,
    name: university.name,
    localName: lx(university.nameI18n, locale) || university.name,
    heroImage: university.heroImage,
    logoImage: university.logoImage,
    logoText: university.logoText,
    isState: university.isState,
    ranking: university.ranking,
    foundedYear: university.foundedYear,
    languages: university.languages,
    cityId: university.cityId,
    cityName: metadata?.city ? (metadata.city.name[locale] ?? null) : null,
    degreeLevels: metadata?.degreeLevels ?? [],
    minTuitionUSD: overrides.minTuitionUSD ?? metadata?.minTuitionUSD,
    originalFeeUSD: overrides.originalFeeUSD ?? metadata?.originalFeeUSD,
    rating: metadata?.rating ?? 0,
    count: metadata?.count ?? 0,
  };
}

/** Project one listing row into its per-locale view-model. */
export function toUniversityCardVM(
  item: UniversityListingItem,
  locale: AppLocale,
): UniversityCardVM {
  return buildVM(item.university, item.metadata, {}, locale);
}

/** Project a raw university + resolved metadata (server card wrapper path). */
export function toUniversityCardVMFromParts(
  university: University,
  metadata: UniversityListingMetadata | null,
  overrides: { minTuitionUSD?: number; originalFeeUSD?: number } = {},
  locale: AppLocale,
): UniversityCardVM {
  return buildVM(university, metadata, overrides, locale);
}

/** Slim city option for the filter UI — drops the 18-locale name map. */
export interface CityOptionVM {
  id: string;
  slug: string;
  name: string;
}

export function toCityOptions(
  cities: City[],
  locale: AppLocale,
): CityOptionVM[] {
  return cities.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name[locale] ?? c.slug,
  }));
}

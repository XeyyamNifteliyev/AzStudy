import type {
  BlogPost,
  City,
  Country,
  DegreeLevel,
  Faq,
  InstructionLanguage,
  Program,
  ProgramCategory,
  ProgramCombination,
  Review,
  Scholarship,
  University,
  UniversityDetail,
  UniversityFilters,
} from "@/types";

export interface UniversityListingMetadata {
  city: City | null;
  minTuitionUSD?: number;
  originalFeeUSD?: number;
  rating: number;
  count: number;
  /** Degree levels offered — drives the client-side degree filter (Phase 2). */
  degreeLevels: DegreeLevel[];
}

/**
 * One row of the universities listing: the university plus the metadata its
 * card renders (city, min tuition, rating). Shape is intentionally plain and
 * JSON-serializable so the whole listing can cross an `unstable_cache`
 * boundary (Maps cannot).
 */
export interface UniversityListingItem {
  university: University;
  metadata: UniversityListingMetadata;
}

export interface UniversityRepository {
  list(filters?: UniversityFilters): Promise<University[]>;
  /**
   * Listing query + card metadata in a single round trip. Equivalent to
   * `list(filters)` + `getListingMetadata(ids)` without the waterfall.
   */
  listWithMetadata(
    filters?: UniversityFilters,
  ): Promise<UniversityListingItem[]>;
  getFeatured(limit?: number): Promise<University[]>;
  getBySlug(slug: string): Promise<University | null>;
  getDetail(slug: string): Promise<UniversityDetail | null>;
  getRelated(slug: string, limit?: number): Promise<University[]>;
  getMinTuitionUSD(universityId: string): Promise<number>;
  getRating(universityId: string): Promise<{ rating: number; count: number }>;
  getListingMetadata(
    universityIds: readonly string[],
  ): Promise<ReadonlyMap<string, UniversityListingMetadata>>;
}

export interface CityRepository {
  list(): Promise<City[]>;
  getBySlug(slug: string): Promise<City | null>;
  getByUniversityId(universityId: string): Promise<City | null>;
}

export interface CountryRepository {
  list(): Promise<Country[]>;
  getBySlug(slug: string): Promise<Country | null>;
}

export interface ProgramCategoryDetail {
  category: ProgramCategory | null;
  programs: Array<
    Program & {
      university: University;
      city: City;
      tuitionFee: number;
      originalFee?: number;
      language: InstructionLanguage;
      scholarshipAvailable: boolean;
    }
  >;
  citySlugs: string[];
  universityCount: number;
  minTuitionUSD: number;
  uniqueLanguages: string[];
}

export interface ProgramListingPage {
  programs: ProgramCategoryDetail["programs"];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface ProgramListingFilters {
  category?: string;
  city?: string;
  search?: string;
}

export interface ProgramRepository {
  list(): Promise<Program[]>;
  getCategories(): Promise<ProgramCategory[]>;
  getCombinations(): Promise<ProgramCombination[]>;
  /** Every university×program row (with city + tuition) — for the /programs listing. */
  getAllPrograms(): Promise<ProgramCategoryDetail["programs"]>;
  getByCategory(category: string): Promise<ProgramCategoryDetail>;
  getByCategoryAndCity(
    category: string,
    citySlug: string,
  ): Promise<{
    category: ProgramCategory | null;
    city: City | null;
    programs: Array<
      Program & {
        university: University;
        tuitionFee: number;
        originalFee?: number;
        language: InstructionLanguage;
      }
    >;
    universityCount: number;
    minTuitionUSD: number;
  }>;
  /** Count of university×program rows (optionally filtered) for pagination. */
  countAll(filters?: ProgramListingFilters): Promise<number>;
  /** Page of university×program rows ordered by tuition asc, with total. */
  listPage(
    page: number,
    perPage: number,
    filters?: ProgramListingFilters,
  ): Promise<ProgramListingPage>;
}

export interface ReviewRepository {
  byUniversity(universityId: string): Promise<Review[]>;
}

export interface FaqRepository {
  general(): Promise<Faq[]>;
  byUniversity(universityId: string): Promise<Faq[]>;
}

export interface ScholarshipRepository {
  byUniversity(universityId: string): Promise<Scholarship[]>;
}

export interface BlogRepository {
  list(): Promise<BlogPost[]>;
  getBySlug(slug: string): Promise<BlogPost | null>;
}

export interface SearchRepository {
  /** Full-text + fuzzy search across universities, programs, cities. Returns ranked results. */
  search(query: string, limit?: number): Promise<SearchResult[]>;
}

export interface SearchResult {
  type: "university" | "program" | "city";
  id: string;
  slug: string;
  /** Primary label (university name / program slug / city slug) — i18n resolved by the UI. */
  label: string;
  /** Optional secondary text (e.g. university accreditation, city country). */
  hint?: string;
  /** Locale-aware name when available (cities/programs have i18n; universities are plain text). */
  nameI18n?: Record<string, string>;
  /** Locale-aware short tagline (universities) — shown as text with the result. */
  taglineI18n?: Record<string, string>;
  /** Locale-aware full description (universities) — shown as text with the result. */
  descriptionI18n?: Record<string, string>;
}

export interface DataLayer {
  universities: UniversityRepository;
  cities: CityRepository;
  countries: CountryRepository;
  programs: ProgramRepository;
  reviews: ReviewRepository;
  faqs: FaqRepository;
  scholarships: ScholarshipRepository;
  blog: BlogRepository;
  search: SearchRepository;
}

export type { DegreeLevel };

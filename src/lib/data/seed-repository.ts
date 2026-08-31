import type {
  BlogPost,
  City,
  Country,
  DegreeLevel,
  Dormitory,
  Faq,
  Program,
  ProgramCategory,
  ProgramCombination,
  Review,
  Scholarship,
  University,
  UniversityDetail,
  UniversityFilters,
  UniversityProgram,
} from "@/types";
import {
  seedBlog,
  seedCities,
  seedCountries,
  seedDormitories,
  seedFaqs,
  seedPrograms,
  seedReviews,
  seedScholarships,
  seedUniversities,
  seedUniversityPrograms,
  seedCategories,
} from "@/lib/seed";
import type {
  BlogRepository,
  CityRepository,
  CountryRepository,
  DataLayer,
  FaqRepository,
  ProgramListingFilters,
  ProgramRepository,
  ReviewRepository,
  ScholarshipRepository,
  UniversityRepository,
  UniversityListingItem,
  UniversityListingMetadata,
} from "./repositories";

const delay = <T>(value: T): Promise<T> => Promise.resolve(value);

class SeedUniversityRepository implements UniversityRepository {
  // Universitetlər bu slug-lar ilə silinib — hər yerdən filterlənir.
  private static readonly DELETED_SLUGS = new Set([
    'azerbaijan-aviation-university',
    'baku-engineering-university-xirdalan',
  ]);

  async list(filters: UniversityFilters = {}): Promise<University[]> {
    const cityBySlug = new Map(seedCities.map((c) => [c.slug, c.id]));

    return delay(
      seedUniversities.filter((u) => {
        if (SeedUniversityRepository.DELETED_SLUGS.has(u.slug)) return false;
        if (filters.citySlug && u.cityId !== cityBySlug.get(filters.citySlug))
          return false;
        if (
          typeof filters.isState === "boolean" &&
          u.isState !== filters.isState
        )
          return false;
        if (filters.search) {
          const q = filters.search.toLowerCase();
          const inI18n = Object.values(u.nameI18n ?? {}).some((n) =>
            n.toLowerCase().includes(q),
          );
          if (!u.name.toLowerCase().includes(q) && !u.slug.includes(q) && !inI18n)
            return false;
        }
        if (filters.degreeLevel) {
          const has = seedUniversityPrograms.some((up) => {
            if (up.universityId !== u.id) return false;
            const p = seedPrograms.find((pr) => pr.id === up.programId);
            return p?.degreeLevel === filters.degreeLevel;
          });
          if (!has) return false;
        }
        if (filters.language) {
          const has =
            u.languages.includes(filters.language) ||
            seedUniversityPrograms.some(
              (up) =>
                up.universityId === u.id && up.language === filters.language,
            );
          if (!has) return false;
        }
        if (filters.maxTuitionUSD !== undefined && filters.maxTuitionUSD > 0) {
          const min = seedUniversityPrograms
            .filter(
              (up) =>
                up.universityId === u.id &&
                up.currency === "USD" &&
                up.tuitionFee > 0,
            )
            .map((up) => up.tuitionFee);
          if (min.length === 0 || Math.min(...min) > filters.maxTuitionUSD)
            return false;
        }
        return true;
      }),
    );
  }

  async listWithMetadata(
    filters: UniversityFilters = {},
  ): Promise<UniversityListingItem[]> {
    const universities = await this.list(filters);
    const metadata = await this.getListingMetadata(
      universities.map((u) => u.id),
    );
    return universities.map((university) => {
      const meta = metadata.get(university.id);
      // getListingMetadata covers every seed university, so a miss would be a
      // seed-data bug — fall back to an empty card rather than crash.
      return {
        university,
        metadata: meta ?? {
          city: null,
          minTuitionUSD: undefined,
          originalFeeUSD: undefined,
          rating: 0,
          count: 0,
          degreeLevels: [],
        },
      };
    });
  }

  async getFeatured(limit = 4): Promise<University[]> {
    return delay(seedUniversities.filter((u) => u.featured).slice(0, limit));
  }

  async getBySlug(slug: string): Promise<University | null> {
    return delay(seedUniversities.find((u) => u.slug === slug) ?? null);
  }

  async getDetail(slug: string): Promise<UniversityDetail | null> {
    const university = await this.getBySlug(slug);
    if (!university) return null;

    const city =
      seedCities.find((c) => c.id === university.cityId) ?? undefined;
    const programs = this._programsFor(university.id);
    const scholarships = seedScholarships.filter(
      (s) => s.universityId === university.id,
    );
    const dormitories = seedDormitories.filter(
      (d) => d.universityId === university.id,
    );

    return delay({
      ...university,
      city,
      programs,
      scholarships,
      dormitories,
    });
  }

  async getRelated(slug: string, limit = 3): Promise<University[]> {
    const current = await this.getBySlug(slug);
    if (!current) return delay([]);
    const sameCity = seedUniversities.filter(
      (u) => u.cityId === current.cityId && u.id !== current.id,
    );
    const others = seedUniversities.filter(
      (u) => u.id !== current.id && u.cityId !== current.cityId,
    );
    return delay([...sameCity, ...others].slice(0, limit));
  }

  getMinTuitionUSD(universityId: string): Promise<number> {
    const fees = seedUniversityPrograms
      .filter((up) => up.universityId === universityId && up.currency === "USD")
      .map((up) => up.tuitionFee);
    return Promise.resolve(fees.length ? Math.min(...fees) : 0);
  }

  async getRating(
    universityId: string,
  ): Promise<{ rating: number; count: number }> {
    const rs = seedReviews.filter((r) => r.universityId === universityId);
    if (!rs.length) return { rating: 0, count: 0 };
    const sum = rs.reduce((acc, r) => acc + r.rating, 0);
    return {
      rating: Math.round((sum / rs.length) * 10) / 10,
      count: rs.length,
    };
  }

  async getListingMetadata(
    universityIds: readonly string[],
  ): Promise<ReadonlyMap<string, UniversityListingMetadata>> {
    const requested = new Set(universityIds);
    const metadata = new Map<string, UniversityListingMetadata>();

    for (const university of seedUniversities) {
      if (!requested.has(university.id)) continue;
      const city = seedCities.find((c) => c.id === university.cityId) ?? null;
      const fees = seedUniversityPrograms
        .filter(
          (up) =>
            up.universityId === university.id &&
            up.currency === "USD" &&
            up.tuitionFee > 0,
        )
        .sort((a, b) => a.tuitionFee - b.tuitionFee);
      const reviews = seedReviews.filter(
        (r) => r.universityId === university.id,
      );
      const rating = reviews.length
        ? Math.round(
            (reviews.reduce((sum, review) => sum + review.rating, 0) /
              reviews.length) *
              10,
          ) / 10
        : 0;
      const cheapest = fees[0];

      const degreeLevels = [
        ...new Set(
          seedUniversityPrograms
            .filter((up) => up.universityId === university.id)
            .map(
              (up) =>
                seedPrograms.find((p) => p.id === up.programId)?.degreeLevel,
            )
            .filter((level): level is DegreeLevel => Boolean(level)),
        ),
      ];

      metadata.set(university.id, {
        city,
        minTuitionUSD: cheapest?.tuitionFee,
        originalFeeUSD:
          cheapest?.originalFee && cheapest.originalFee > cheapest.tuitionFee
            ? cheapest.originalFee
            : undefined,
        rating,
        count: reviews.length,
        degreeLevels,
      });
    }

    return metadata;
  }

  private _programsFor(universityId: string) {
    return seedUniversityPrograms
      .filter((up) => up.universityId === universityId)
      .map((up) => ({
        ...up,
        program: seedPrograms.find((p) => p.id === up.programId)!,
      }))
      .filter((up) => Boolean(up.program))
      .sort((a, b) => a.tuitionFee - b.tuitionFee);
  }
}

class SeedCityRepository implements CityRepository {
  async list(): Promise<City[]> {
    return delay(seedCities);
  }
  async getBySlug(slug: string): Promise<City | null> {
    return delay(seedCities.find((c) => c.slug === slug) ?? null);
  }
  async getByUniversityId(universityId: string): Promise<City | null> {
    const u = seedUniversities.find((un) => un.id === universityId);
    if (!u) return null;
    return seedCities.find((c) => c.id === u.cityId) ?? null;
  }
}

class SeedCountryRepository implements CountryRepository {
  async list(): Promise<Country[]> {
    return delay(seedCountries);
  }
  async getBySlug(slug: string): Promise<Country | null> {
    return delay(seedCountries.find((c) => c.slug === slug) ?? null);
  }
}

class SeedProgramRepository implements ProgramRepository {
  async list(): Promise<Program[]> {
    return delay(seedPrograms);
  }
  async getCategories(): Promise<ProgramCategory[]> {
    return Promise.resolve(seedCategories);
  }

  async getCombinations(): Promise<ProgramCombination[]> {
    const map = new Map<string, ProgramCombination>();
    const universities = new Set<string>();
    for (const up of seedUniversityPrograms) {
      const program = seedPrograms.find((p) => p.id === up.programId);
      const uni = seedUniversities.find((u) => u.id === up.universityId);
      if (!program || !uni) continue;
      // M8: pg computes min_tuition over USD rows only — mirror that here so
      // the seed layer's minTuitionUSD matches the pg layer.
      if (up.currency !== "USD") continue;
      const city = seedCities.find((c) => c.id === uni.cityId);
      if (!city) continue;
      const key = `${program.categorySlug}|${city.slug}`;
      const existing = map.get(key);
      if (existing) {
        if (!existing.programIds.includes(program.id))
          existing.programIds.push(program.id);
        universities.add(uni.id);
        existing.universityCount = Math.max(
          existing.universityCount,
          this._uniCountFor(program.categorySlug, city.slug),
        );
        existing.minTuitionUSD = Math.min(
          existing.minTuitionUSD,
          up.tuitionFee,
        );
      } else {
        map.set(key, {
          categorySlug: program.categorySlug,
          citySlug: city.slug,
          programIds: [program.id],
          universityCount: this._uniCountFor(program.categorySlug, city.slug),
          minTuitionUSD: up.tuitionFee,
        });
      }
    }
    return Array.from(map.values());
  }
  private _uniCountFor(category: string, citySlug: string): number {
    const city = seedCities.find((c) => c.slug === citySlug);
    if (!city) return 0;
    const uniIds = new Set<string>();
    for (const up of seedUniversityPrograms) {
      const p = seedPrograms.find((pr) => pr.id === up.programId);
      const u = seedUniversities.find((un) => un.id === up.universityId);
      if (p?.categorySlug === category && u?.cityId === city.id)
        uniIds.add(u.id);
    }
    return uniIds.size;
  }
  async getAllPrograms(): Promise<
    import("@/lib/data/repositories").ProgramCategoryDetail["programs"]
  > {
    const items = seedUniversityPrograms
      .map((up) => {
        const program = seedPrograms.find((p) => p.id === up.programId);
        const university = seedUniversities.find(
          (u) => u.id === up.universityId,
        );
        const city = university
          ? seedCities.find((c) => c.id === university.cityId)
          : undefined;
        if (!program || !university || !city) return null;
        return {
          ...program,
          university,
          city,
          tuitionFee: up.tuitionFee,
          originalFee: up.originalFee,
          language: up.language,
          scholarshipAvailable: up.scholarshipAvailable,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => a.tuitionFee - b.tuitionFee);
    return items;
  }
  async getByCategory(
    category: string,
  ): Promise<import("@/lib/data/repositories").ProgramCategoryDetail> {
    const cat = seedCategories.find((c) => c.slug === category) ?? null;
    const items = seedUniversityPrograms
      .filter((up) => {
        const p = seedPrograms.find((pr) => pr.id === up.programId);
        return p?.categorySlug === category;
      })
      .map((up) => {
        const program = seedPrograms.find((p) => p.id === up.programId)!;
        const university = seedUniversities.find(
          (u) => u.id === up.universityId,
        )!;
        const city = seedCities.find((c) => c.id === university.cityId)!;
        return {
          ...program,
          university,
          city,
          tuitionFee: up.tuitionFee,
          originalFee: up.originalFee,
          language: up.language,
          scholarshipAvailable: up.scholarshipAvailable,
        };
      })
      .sort((a, b) => a.tuitionFee - b.tuitionFee);

    const citySlugs = [...new Set(items.map((i) => i.city.slug))];
    const universities = new Set(items.map((i) => i.university.id));

    return {
      category: cat,
      programs: items,
      citySlugs,
      universityCount: universities.size,
      minTuitionUSD: items.length ? items[0].tuitionFee : 0,
      uniqueLanguages: [...new Set(items.map((i) => i.language))],
    };
  }

  async getByCategoryAndCity(
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
        language: import("@/types").InstructionLanguage;
      }
    >;
    universityCount: number;
    minTuitionUSD: number;
  }> {
    const cat = seedCategories.find((c) => c.slug === category) ?? null;
    const city = seedCities.find((c) => c.slug === citySlug) ?? null;
    if (!city) {
      return {
        category: cat,
        city: null,
        programs: [],
        universityCount: 0,
        minTuitionUSD: 0,
      };
    }
    const items = seedUniversityPrograms
      .filter((up) => {
        const p = seedPrograms.find((pr) => pr.id === up.programId);
        const u = seedUniversities.find((un) => un.id === up.universityId);
        return p?.categorySlug === category && u?.cityId === city.id;
      })
      .map((up) => {
        const program = seedPrograms.find((p) => p.id === up.programId)!;
        const university = seedUniversities.find(
          (u) => u.id === up.universityId,
        )!;
        return {
          ...program,
          university,
          tuitionFee: up.tuitionFee,
          originalFee: up.originalFee,
          language: up.language,
        };
      })
      .sort((a, b) => a.tuitionFee - b.tuitionFee);

    return {
      category: cat,
      city,
      programs: items,
      universityCount: new Set(items.map((i) => i.university.id)).size,
      minTuitionUSD: items.length ? items[0].tuitionFee : 0,
    };
  }

  async countAll(filters?: ProgramListingFilters): Promise<number> {
    const items = this._filtered(filters);
    return Promise.resolve(items.length);
  }
  async listPage(
    page: number,
    perPage: number,
    filters?: ProgramListingFilters,
  ) {
    const items = this._filtered(filters);
    const total = items.length;
    const start = (page - 1) * perPage;
    const ordered = [...items].sort(
      (a, b) => a.tuitionFee - b.tuitionFee || a.id.localeCompare(b.id),
    );
    const slice = ordered
      .slice(start, start + perPage)
      .map((up) => {
        const program = seedPrograms.find((p) => p.id === up.programId);
        const university = seedUniversities.find(
          (u) => u.id === up.universityId,
        );
        const city = university
          ? seedCities.find((c) => c.id === university.cityId)
          : undefined;
        if (!program || !university || !city) return null;
        return {
          ...program,
          university,
          city,
          tuitionFee: up.tuitionFee,
          originalFee: up.originalFee,
          language: up.language,
          scholarshipAvailable: up.scholarshipAvailable,
        };
      })
      .filter((i): i is NonNullable<typeof i> => i !== null);
    return {
      programs: slice,
      total,
      page,
      perPage,
      totalPages: Math.max(1, Math.ceil(total / perPage)),
    };
  }

  /**
   * Applies the ProgramListingFilters (category / city / search) to the seed
   * university×program rows. Mirrors the WHERE clause of the pg repository.
   */
  private _filtered(filters?: ProgramListingFilters) {
    if (!filters || (!filters.category && !filters.city && !filters.search)) {
      return seedUniversityPrograms;
    }
    const cityBySlug = new Map(seedCities.map((c) => [c.slug, c.id]));
    const cityId = filters.city ? cityBySlug.get(filters.city) : undefined;
    const search = filters.search?.toLowerCase();
    return seedUniversityPrograms.filter((up) => {
      if (filters.category) {
        const program = seedPrograms.find((p) => p.id === up.programId);
        if (program?.categorySlug !== filters.category) return false;
      }
      if (cityId !== undefined) {
        const university = seedUniversities.find(
          (u) => u.id === up.universityId,
        );
        if (university?.cityId !== cityId) return false;
      }
      if (search) {
        const program = seedPrograms.find((p) => p.id === up.programId);
        const university = seedUniversities.find(
          (u) => u.id === up.universityId,
        );
        const name = program?.name.en ?? program?.slug ?? "";
        if (
          !name.toLowerCase().includes(search) &&
          !(university?.name.toLowerCase().includes(search) ?? false)
        ) {
          return false;
        }
      }
      return true;
    });
  }
}

class SeedReviewRepository implements ReviewRepository {
  async list(): Promise<Review[]> {
    return delay(seedReviews);
  }
  async byUniversity(universityId: string): Promise<Review[]> {
    return delay(seedReviews.filter((r) => r.universityId === universityId));
  }
}

class SeedFaqRepository implements FaqRepository {
  async general(): Promise<Faq[]> {
    return delay(seedFaqs.filter((f) => f.entityType === "general"));
  }
  async byUniversity(universityId: string): Promise<Faq[]> {
    return delay(
      seedFaqs.filter(
        (f) => f.entityType === "university" && f.entityId === universityId,
      ),
    );
  }
}

class SeedScholarshipRepository implements ScholarshipRepository {
  async byUniversity(universityId: string): Promise<Scholarship[]> {
    return delay(
      seedScholarships.filter((s) => s.universityId === universityId),
    );
  }
}

class SeedBlogRepository implements BlogRepository {
  async list(): Promise<BlogPost[]> {
    // AEO: merge hand-written posts with dynamically generated university articles
    // (Klaster 5: 46 articles from seed data for topical authority)
    const { generateUniversityArticles } = await import("@/lib/seo/university-articles");
    const uniArticles = generateUniversityArticles();
    return delay(
      [...seedBlog, ...uniArticles].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)),
    );
  }
  async getBySlug(slug: string): Promise<BlogPost | null> {
    // Check hand-written posts first, then dynamic university articles
    const match = seedBlog.find((b) => b.slug === slug);
    if (match) return delay(match);
    const { generateUniversityArticles, isUniversityArticle } = await import("@/lib/seo/university-articles");
    if (isUniversityArticle(slug)) {
      return delay(generateUniversityArticles().find((a) => a.slug === slug) ?? null);
    }
    return delay(null);
  }
}

export function createSeedDataLayer(): DataLayer {
  return {
    universities: new SeedUniversityRepository(),
    cities: new SeedCityRepository(),
    countries: new SeedCountryRepository(),
    programs: new SeedProgramRepository(),
    reviews: new SeedReviewRepository(),
    faqs: new SeedFaqRepository(),
    scholarships: new SeedScholarshipRepository(),
    blog: new SeedBlogRepository(),
    search: {
      async search(query: string, limit = 10) {
        const q = query.toLowerCase().trim();
        if (!q) return [];
        const out: import("@/lib/data/repositories").SearchResult[] = [];
        for (const u of seedUniversities) {
          const inI18n = Object.values(u.nameI18n ?? {}).some((n) =>
            n.toLowerCase().includes(q),
          );
          if (u.name.toLowerCase().includes(q) || u.slug.includes(q) || inI18n) {
            out.push({
              type: "university",
              id: u.id,
              slug: u.slug,
              label: u.name,
              hint: u.accreditation,
              taglineI18n: u.tagline,
              descriptionI18n: u.description,
              nameI18n: u.nameI18n,
            });
          }
          if (out.length >= limit) return out;
        }
        for (const p of seedPrograms) {
          if (
            p.slug.includes(q) ||
            Object.values(p.name).some((n) => n.toLowerCase().includes(q))
          ) {
            out.push({
              type: "program",
              id: p.id,
              slug: p.slug,
              label: p.slug,
              nameI18n: p.name,
              hint: p.degreeLevel,
            });
          }
          if (out.length >= limit) return out;
        }
        for (const c of seedCities) {
          if (
            c.slug.includes(q) ||
            Object.values(c.name).some((n) => n.toLowerCase().includes(q))
          ) {
            out.push({
              type: "city",
              id: c.id,
              slug: c.slug,
              label: c.slug,
              nameI18n: c.name,
            });
          }
          if (out.length >= limit) return out;
        }
        return out;
      },
    },
  };
}

// Type-only re-exports to keep imports tidy.
export type { Dormitory, UniversityProgram };

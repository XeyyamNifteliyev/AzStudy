import { Pool } from "pg";
import { cache } from "react";
import { universityLogoImages } from "@/lib/seed/university-images";
import type {
  BlogPost,
  City,
  Country,
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
  DegreeLevel,
  InstructionLanguage,
} from "@/types";
import type {
  BlogRepository,
  BlogPostSummary,
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
  SearchResult,
} from "./repositories";

type I18n = Record<string, string>;

function i18n(raw: unknown): I18n {
  if (!raw || typeof raw !== "object") return {};
  return raw as I18n;
}

function rowUniversity(r: Record<string, unknown>): University {
  const slug = r.slug as string;
  return {
    id: r.id as string,
    slug,
    cityId: r.city_id as string,
    name: r.name as string,
    nameI18n: r.name_i18n ? i18n(r.name_i18n) : undefined,
    foundedYear: Number(r.founded_year),
    studentCount: Number(r.student_count),
    ranking: Number(r.ranking),
    accreditation: r.accreditation as string,
    isState: Boolean(r.is_state),
    logoText: r.logo_text as string,
    logoImage: universityLogoImages[slug],
    heroImage: r.hero_image as string,
    gallery: (r.gallery as string[]) ?? [],
    tagline: i18n(r.tagline_i18n),
    description: i18n(r.description_i18n),
    languages: (r.languages as string[]) ?? [],
    featured: Boolean(r.featured),
    updatedAt: r.updated_at ? (r.updated_at as Date).toISOString() : undefined,
  };
}

function rowCity(r: Record<string, unknown>): City {
  return {
    id: r.id as string,
    slug: r.slug as string,
    countryId: r.country_code as string,
    name: i18n(r.name_i18n),
    monthlyLivingCostUSD: r.monthly_living_cost_usd
      ? Number(r.monthly_living_cost_usd)
      : undefined,
  };
}

function rowCountry(r: Record<string, unknown>): Country {
  return {
    code: r.code as string,
    slug: r.slug as string,
    name: i18n(r.name_i18n),
    flag: r.flag as string,
  };
}

function rowCategory(r: Record<string, unknown>): ProgramCategory {
  return {
    slug: r.slug as ProgramCategory["slug"],
    name: i18n(r.name_i18n),
    icon: (r.icon as string) || undefined,
  };
}

function rowProgram(r: Record<string, unknown>): Program {
  return {
    id: r.id as string,
    slug: r.slug as string,
    name: i18n(r.name_i18n),
    degreeLevel: r.degree_level as DegreeLevel,
    categorySlug: r.category_slug as Program["categorySlug"],
    durationYears: Number(r.duration_years),
  };
}

function rowUniversityProgram(r: Record<string, unknown>): UniversityProgram {
  return {
    id: r.id as string,
    universityId: r.university_id as string,
    programId: r.program_id as string,
    language: r.language as InstructionLanguage,
    tuitionFee: Number(r.tuition_fee),
    originalFee: r.original_fee == null ? undefined : Number(r.original_fee),
    currency: r.currency as "USD" | "AZN",
    scholarshipAvailable: Boolean(r.scholarship_available),
  };
}

/**
 * Maps a joined university_programs × programs × universities × cities row
 * (up_* / p_* / u_* / c_* aliases) into a program listing item.
 */
function mapProgramItem(r: Record<string, unknown>) {
  return {
    id: r.p_id as string,
    slug: r.p_slug as string,
    name: i18n(r.p_name),
    degreeLevel: r.p_degree as DegreeLevel,
    categorySlug: r.p_category as Program["categorySlug"],
    durationYears: Number(r.p_duration),
    university: {
      id: r.u_id as string,
      slug: r.u_slug as string,
      cityId: r.u_city_id as string,
      name: r.u_name as string,
      nameI18n: r.u_name_i18n ? i18n(r.u_name_i18n) : undefined,
      foundedYear: Number(r.u_founded),
      studentCount: Number(r.u_students),
      ranking: Number(r.u_ranking),
      accreditation: r.u_accr as string,
      isState: Boolean(r.u_state),
      logoText: r.u_logo as string,
      logoImage: universityLogoImages[r.u_slug as string],
      heroImage: r.u_hero as string,
      gallery: (r.u_gallery as string[]) ?? [],
      // L5: listing items don't render tagline/description — omit the heavy
      // JSONB blobs from the SELECT (columns stay, rows map to empty).
      tagline: {},
      description: {},
      languages: (r.u_languages as string[]) ?? [],
      featured: Boolean(r.u_featured),
    },
    city: {
      id: r.c_id as string,
      slug: r.c_slug as string,
      name: i18n(r.c_name),
      countryId: r.c_country as string,
      monthlyLivingCostUSD: r.c_monthly_living
        ? Number(r.c_monthly_living)
        : undefined,
    },
    tuitionFee: Number(r.up_tuition_fee),
    originalFee:
      r.up_original_fee == null ? undefined : Number(r.up_original_fee),
    language: r.up_language as InstructionLanguage,
    scholarshipAvailable: Boolean(r.up_scholarship),
  };
}

/**
 * Builds the shared WHERE clause + parameter list for the university listing
 * queries (`list` / `listWithMetadata`) so the two listings can never drift
 * apart semantically. `maxTuitionUSD` is intentionally NOT handled here — the
 * callers apply it via their own tuition expression.
 */
/** Universitetlər bu slug-lar ilə silinib — database-dən filterlənir. */
const DELETED_UNIVERSITY_SLUGS = [
  "azerbaijan-aviation-university",
  "baku-engineering-university-xirdalan",
];

function buildUniversityWhere(filters: UniversityFilters) {
  const where: string[] = [];
  const params: unknown[] = [];
  // Silinmiş universitetləri həmişə filterlə
  where.push(
    `u.slug not in (${DELETED_UNIVERSITY_SLUGS.map((_, i) => `$${i + 1}`).join(",")})`,
  );
  params.push(...DELETED_UNIVERSITY_SLUGS);
  let pi = params.length + 1;
  if (filters.citySlug) {
    where.push(
      `u.city_id = (select id from public.cities where slug = $${pi})`,
    );
    params.push(filters.citySlug);
    pi++;
  }
  if (typeof filters.isState === "boolean") {
    where.push(`u.is_state = $${pi}`);
    params.push(filters.isState);
    pi++;
  }
  if (filters.search) {
    where.push(
      `(lower(u.name) like $${pi} or u.slug like $${pi} or u.name_i18n::text ilike $${pi})`,
    );
    params.push(`%${filters.search.toLowerCase()}%`);
    pi++;
  }
  if (filters.degreeLevel) {
    where.push(
      `exists (select 1 from public.university_programs up join public.programs p on p.id = up.program_id
       where up.university_id = u.id and p.degree_level = $${pi})`,
    );
    params.push(filters.degreeLevel);
    pi++;
  }
  if (filters.language) {
    where.push(
      `($${pi} = any(u.languages) or exists (select 1 from public.university_programs up where up.university_id = u.id and up.language = $${pi}))`,
    );
    params.push(filters.language);
    pi++;
  }
  return { where, params };
}

/**
 * Builds the shared WHERE clause + parameter list for program listing
 * queries (countAll / listPage). Filters:
 *  - category: exact program category slug (p.category_slug)
 *  - city: university city resolved by city slug (u.city_id)
 *  - search: case-insensitive match on program i18n name, university name
 *    or city i18n name
 */
function buildProgramListingWhere(filters?: ProgramListingFilters) {
  const where: string[] = [];
  const params: unknown[] = [];
  let pi = 1;
  if (filters?.category) {
    where.push(`p.category_slug = $${pi}`);
    params.push(filters.category);
    pi++;
  }
  if (filters?.city) {
    where.push(
      `u.city_id = (select id from public.cities where slug = $${pi})`,
    );
    params.push(filters.city);
    pi++;
  }
  if (filters?.search) {
    const q = filters.search;
    where.push(
      `(p.name_i18n::text ilike '%'||$${pi}||'%' or lower(u.name) like '%'||lower($${pi})||'%' or c.name_i18n::text ilike '%'||$${pi}||'%')`,
    );
    params.push(q);
    pi++;
  }
  return { where, params };
}

function rowScholarship(r: Record<string, unknown>): Scholarship {
  return {
    id: r.id as string,
    universityId: r.university_id as string,
    name: i18n(r.name_i18n),
    percentage: Number(r.percentage),
    requirements: i18n(r.requirements_i18n),
  };
}

function rowReview(r: Record<string, unknown>): Review {
  return {
    id: r.id as string,
    universityId: r.university_id as string,
    authorName: r.author_name as string,
    authorCountry: r.author_country as string,
    authorInitials: r.author_initials as string,
    rating: Number(r.rating),
    text: i18n(r.text_i18n),
    verified: Boolean(r.verified),
    programStudied: i18n(r.program_studied_i18n),
    year: Number(r.year),
  };
}

function rowFaq(r: Record<string, unknown>): Faq {
  return {
    id: r.id as string,
    entityType: r.entity_type as Faq["entityType"],
    entityId: r.entity_id as string,
    question: i18n(r.question_i18n),
    answer: i18n(r.answer_i18n),
  };
}

function rowBlogPost(r: Record<string, unknown>): BlogPost {
  return {
    id: r.id as string,
    slug: r.slug as string,
    title: i18n(r.title_i18n),
    excerpt: i18n(r.excerpt_i18n),
    content: i18n(r.content_i18n),
    author: r.author as string,
    publishedAt: r.published_at as string,
    coverImage: r.cover_image as string,
    category: i18n(r.category_i18n),
    readingMinutes: Number(r.reading_minutes),
    updatedAt: r.updated_at ? (r.updated_at as Date).toISOString() : undefined,
  };
}

/** Summary projection — everything except the body columns. */
function rowBlogPostSummary(r: Record<string, unknown>): BlogPostSummary {
  return {
    id: r.id as string,
    slug: r.slug as string,
    title: i18n(r.title_i18n),
    excerpt: i18n(r.excerpt_i18n),
    category: i18n(r.category_i18n),
    author: r.author as string,
    publishedAt: r.published_at as string,
    coverImage: r.cover_image as string,
    readingMinutes: Number(r.reading_minutes),
    updatedAt: r.updated_at ? (r.updated_at as Date).toISOString() : undefined,
  };
}

export function createPgDataLayer(getPool: () => Pool): DataLayer {
  const universities: UniversityRepository = {
    async list(filters: UniversityFilters = {}): Promise<University[]> {
      const { where, params } = buildUniversityWhere(filters);
      // Min USD tədris haqqı — korrelyasiyalı subquery (filtr SQL-də tətbiq olunur, N+1 yoxdur).
      const minTuitionExpr = `(select min(tuition_fee) filter (where currency='USD' and tuition_fee > 0) from public.university_programs up where up.university_id = u.id)`;
      const wantMaxTuition =
        filters.maxTuitionUSD !== undefined && filters.maxTuitionUSD > 0;

      let sql = `select u.*`;
      if (wantMaxTuition) sql += `, ${minTuitionExpr} as _min_tuition`;
      sql += ` from public.universities u`;
      if (where.length) sql += ` where ` + where.join(" and ");
      if (wantMaxTuition) {
        sql += `${where.length ? " and " : " where "}${minTuitionExpr} is not null and ${minTuitionExpr} <= $${params.length + 1}`;
        params.push(filters.maxTuitionUSD as number);
      }
      sql += ` order by u.name`;
      const res = await getPool().query(sql, params);
      return res.rows.map(rowUniversity);
    },

    async listWithMetadata(
      filters: UniversityFilters = {},
    ): Promise<UniversityListingItem[]> {
      const { where, params } = buildUniversityWhere(filters);
      const wantMaxTuition =
        filters.maxTuitionUSD !== undefined && filters.maxTuitionUSD > 0;

      let sql = `select u.*,
            c.id c_id, c.slug c_slug, c.country_code c_country_code, c.name_i18n c_name_i18n,
            t.min_tuition, t.original_fee,
            coalesce(rs.avg_rating, 0) avg_rating, coalesce(rs.review_count, 0) review_count,
            coalesce(dp.degree_levels, '{}') degree_levels
          from public.universities u
          left join public.cities c on c.id = u.city_id
          left join lateral (
            select up.tuition_fee min_tuition, up.original_fee
            from public.university_programs up
            where up.university_id = u.id and up.currency = 'USD' and up.tuition_fee > 0
            order by up.tuition_fee asc, up.id asc
            limit 1
          ) t on true
          left join lateral (
            select avg(r.rating) avg_rating, count(*)::int review_count
            from public.reviews r
            where r.university_id = u.id
          ) rs on true
          left join lateral (
            select coalesce(array_agg(distinct p.degree_level) filter (where p.degree_level is not null), '{}') degree_levels
            from public.university_programs up
            join public.programs p on p.id = up.program_id
            where up.university_id = u.id
          ) dp on true`;
      if (where.length) sql += ` where ` + where.join(" and ");
      if (wantMaxTuition) {
        // The lateral tuition row is the min USD fee, so the max-tuition filter
        // is a simple predicate on it — no repeated correlated subquery.
        sql += `${where.length ? " and " : " where "}t.min_tuition is not null and t.min_tuition <= $${params.length + 1}`;
        params.push(filters.maxTuitionUSD as number);
      }
      sql += ` order by u.name`;

      const res = await getPool().query(sql, params);
      return res.rows.map((r) => ({
        university: rowUniversity(r),
        metadata: {
          city: r.c_id
            ? {
                id: r.c_id as string,
                slug: r.c_slug as string,
                countryId: r.c_country_code as string,
                name: i18n(r.c_name_i18n),
              }
            : null,
          minTuitionUSD:
            r.min_tuition == null ? undefined : Number(r.min_tuition),
          originalFeeUSD:
            r.original_fee != null &&
            r.min_tuition != null &&
            Number(r.original_fee) > Number(r.min_tuition)
              ? Number(r.original_fee)
              : undefined,
          rating: Math.round(Number(r.avg_rating ?? 0) * 10) / 10,
          count: Number(r.review_count ?? 0),
          degreeLevels: (r.degree_levels as DegreeLevel[]) ?? [],
        },
      }));
    },

    async getFeatured(limit = 4): Promise<University[]> {
      const res = await getPool().query(
        `select * from public.universities where featured = true order by ranking asc limit $1`,
        [limit],
      );
      return res.rows.map(rowUniversity);
    },

    getBySlug: cache(async (slug: string): Promise<University | null> => {
      const res = await getPool().query(
        `select * from public.universities where slug = $1`,
        [slug],
      );
      return res.rows[0] ? rowUniversity(res.rows[0]) : null;
    }),

    // B6: React.cache deduplicates getDetail calls within a single request —
    // generateMetadata and the page component both call it for the same slug.
    getDetail: cache(async (slug: string): Promise<UniversityDetail | null> => {
      const uniRes = await getPool().query(
        `select * from public.universities where slug = $1`,
        [slug],
      );
      const uni = uniRes.rows[0] ? rowUniversity(uniRes.rows[0]) : null;
      if (!uni) return null;
      // B6: run the four dependent queries in parallel instead of serially.
      const [cityRes, upRes, scholarshipsRes, dormRes] = await Promise.all([
        getPool().query(`select * from public.cities where id = $1`, [
          uni.cityId,
        ]),
        getPool().query(
          `select up.*, p.slug p_slug, p.name_i18n p_name, p.degree_level p_degree, p.category_slug p_category, p.duration_years p_duration
           from public.university_programs up
           join public.programs p on p.id = up.program_id
           where up.university_id = $1
           order by up.tuition_fee asc`,
          [uni.id],
        ),
        getPool().query(
          `select * from public.scholarships where university_id = $1`,
          [uni.id],
        ),
        getPool().query(
          `select * from public.dormitories where university_id = $1`,
          [uni.id],
        ),
      ]);
      const city = cityRes.rows[0] ? rowCity(cityRes.rows[0]) : undefined;
      const programs = upRes.rows.map((r) => ({
        ...rowUniversityProgram(r),
        program: {
          id: r.program_id as string,
          slug: r.p_slug as string,
          name: i18n(r.p_name),
          degreeLevel: r.p_degree as DegreeLevel,
          categorySlug: r.p_category as Program["categorySlug"],
          durationYears: Number(r.p_duration),
        },
      }));
      return {
        ...uni,
        city,
        programs,
        scholarships: scholarshipsRes.rows.map(rowScholarship),
        dormitories: dormRes.rows.map((r) => ({
          id: r.id as string,
          universityId: r.university_id as string,
          capacity: Number(r.capacity),
          pricePerMonth: Number(r.price_per_month),
          currency: r.currency as "USD" | "AZN",
          photos: (r.photos as string[]) ?? [],
        })),
      };
    }),

    async getRelated(slug: string, limit = 3): Promise<University[]> {
      const current = await this.getBySlug(slug);
      if (!current) return [];
      // BE-6: run the same-city and other-city lookups in parallel instead of
      // sequentially (2 round-trips → 1 round-trip window).
      const [sameCity, others] = await Promise.all([
        getPool().query(
          `select * from public.universities where city_id = $1 and id <> $2 order by ranking limit $3`,
          [current.cityId, current.id, limit],
        ),
        getPool().query(
          `select * from public.universities where city_id <> $1 and id <> $2 order by ranking limit $3`,
          [current.cityId, current.id, limit],
        ),
      ]);
      return [
        ...sameCity.rows.map(rowUniversity),
        ...others.rows.map(rowUniversity),
      ].slice(0, limit);
    },

    async getMinTuitionUSD(universityId: string): Promise<number> {
      const res = await getPool().query(
        `select coalesce(min(tuition_fee) filter (where currency = 'USD' and tuition_fee > 0), 0) m from public.university_programs where university_id = $1`,
        [universityId],
      );
      return Number(res.rows[0]?.m ?? 0);
    },

    async getRating(
      universityId: string,
    ): Promise<{ rating: number; count: number }> {
      const res = await getPool().query(
        `select coalesce(avg(rating), 0) avg, count(*)::int c from public.reviews where university_id = $1`,
        [universityId],
      );
      const avg = Number(res.rows[0]?.avg ?? 0);
      return {
        rating: Math.round(avg * 10) / 10,
        count: Number(res.rows[0]?.c ?? 0),
      };
    },

    async getListingMetadata(
      universityIds: readonly string[],
    ): Promise<ReadonlyMap<string, UniversityListingMetadata>> {
      if (!universityIds.length) return new Map();
      const res = await getPool().query(
        `with tuition as (
               select distinct on (university_id)
                      university_id,
                      tuition_fee min_tuition,
                      original_fee
               from public.university_programs
               where university_id = any($1::text[])
                 and currency = 'USD'
                 and tuition_fee > 0
               order by university_id, tuition_fee asc, id asc
             ), review_stats as (
               select university_id, avg(rating) avg_rating, count(*)::int review_count
               from public.reviews
               where university_id = any($1::text[])
               group by university_id
             ), degree_levels as (
               select up.university_id,
                      coalesce(array_agg(distinct p.degree_level) filter (where p.degree_level is not null), '{}') degree_levels
               from public.university_programs up
               join public.programs p on p.id = up.program_id
               where up.university_id = any($1::text[])
               group by up.university_id
             )
         select u.id,
                c.id city_id, c.slug city_slug, c.country_code city_country_code, c.name_i18n city_name_i18n,
                tuition.min_tuition,
                tuition.original_fee,
                coalesce(review_stats.avg_rating, 0) avg_rating,
                coalesce(review_stats.review_count, 0) review_count,
                coalesce(degree_levels.degree_levels, '{}') degree_levels
         from public.universities u
         left join public.cities c on c.id = u.city_id
         left join tuition on tuition.university_id = u.id
         left join review_stats on review_stats.university_id = u.id
         left join degree_levels on degree_levels.university_id = u.id
         where u.id = any($1::text[])
         `,
        [universityIds],
      );
      const metadata = new Map<string, UniversityListingMetadata>();
      for (const row of res.rows) {
        metadata.set(row.id as string, {
          city: row.city_id
            ? {
                id: row.city_id as string,
                slug: row.city_slug as string,
                countryId: row.city_country_code as string,
                name: i18n(row.city_name_i18n),
              }
            : null,
          minTuitionUSD:
            row.min_tuition == null ? undefined : Number(row.min_tuition),
          originalFeeUSD:
            row.original_fee != null &&
            row.min_tuition != null &&
            Number(row.original_fee) > Number(row.min_tuition)
              ? Number(row.original_fee)
              : undefined,
          rating: Math.round(Number(row.avg_rating ?? 0) * 10) / 10,
          count: Number(row.review_count ?? 0),
          degreeLevels: (row.degree_levels as DegreeLevel[]) ?? [],
        });
      }
      return metadata;
    },
  };

  const cities: CityRepository = {
    async list(): Promise<City[]> {
      const res = await getPool().query(
        `select * from public.cities order by slug`,
      );
      return res.rows.map(rowCity);
    },
    async getBySlug(slug: string): Promise<City | null> {
      const res = await getPool().query(
        `select * from public.cities where slug = $1`,
        [slug],
      );
      return res.rows[0] ? rowCity(res.rows[0]) : null;
    },
    async getByUniversityId(universityId: string): Promise<City | null> {
      const res = await getPool().query(
        `select c.* from public.cities c join public.universities u on u.city_id = c.id where u.id = $1`,
        [universityId],
      );
      return res.rows[0] ? rowCity(res.rows[0]) : null;
    },
  };

  const countries: CountryRepository = {
    async list(): Promise<Country[]> {
      const res = await getPool().query(
        `select * from public.countries order by slug`,
      );
      return res.rows.map(rowCountry);
    },
    async getBySlug(slug: string): Promise<Country | null> {
      const res = await getPool().query(
        `select * from public.countries where slug = $1`,
        [slug],
      );
      return res.rows[0] ? rowCountry(res.rows[0]) : null;
    },
  };

  const programs: ProgramRepository = {
    async list(): Promise<Program[]> {
      const res = await getPool().query(
        `select * from public.programs order by slug`,
      );
      return res.rows.map(rowProgram);
    },
    async getCategories(): Promise<ProgramCategory[]> {
      const res = await getPool().query(
        `select * from public.program_categories order by slug`,
      );
      return res.rows.map(rowCategory);
    },
    async getCombinations(): Promise<ProgramCombination[]> {
      const res = await getPool().query(
        `select p.category_slug, c.slug city_slug,
                coalesce(array_agg(distinct p.id) filter (where p.id is not null), '{}') program_ids,
                count(distinct up.university_id)::int university_count,
                coalesce(min(up.tuition_fee) filter (where up.currency = 'USD'), 0) min_tuition
         from public.programs p
         join public.university_programs up on up.program_id = p.id
         join public.universities u on u.id = up.university_id
         join public.cities c on c.id = u.city_id
         group by p.category_slug, c.slug`,
      );
      return res.rows.map((r) => ({
        categorySlug: r.category_slug as ProgramCombination["categorySlug"],
        citySlug: r.city_slug as string,
        programIds: (r.program_ids as string[]) ?? [],
        universityCount: Number(r.university_count),
        minTuitionUSD: Number(r.min_tuition),
      }));
    },
    async getAllPrograms(): Promise<
      import("@/lib/data/repositories").ProgramCategoryDetail["programs"]
    > {
      const itemsRes = await getPool().query(
        `select up.id up_id, up.university_id up_university_id, up.program_id up_program_id,
                up.language up_language, up.tuition_fee up_tuition_fee, up.original_fee up_original_fee, up.currency up_currency, up.scholarship_available up_scholarship,
                p.id p_id, p.slug p_slug, p.name_i18n p_name, p.degree_level p_degree, p.category_slug p_category, p.duration_years p_duration,
                u.id u_id, u.slug u_slug, u.city_id u_city_id, u.name u_name, u.name_i18n u_name_i18n, u.founded_year u_founded, u.student_count u_students,
                u.ranking u_ranking, u.accreditation u_accr, u.is_state u_state, u.logo_text u_logo, u.hero_image u_hero,
                u.gallery u_gallery, u.languages u_languages, u.featured u_featured,
                c.id c_id, c.slug c_slug, c.name_i18n c_name, c.country_code c_country,
                c.monthly_living_cost_usd c_monthly_living
         from public.university_programs up
         join public.programs p on p.id = up.program_id
         join public.universities u on u.id = up.university_id
         join public.cities c on c.id = u.city_id
         order by up.tuition_fee asc`,
      );
      return itemsRes.rows.map(mapProgramItem);
    },
    async getByCategory(
      category: string,
    ): Promise<import("@/lib/data/repositories").ProgramCategoryDetail> {
      const catRes = await getPool().query(
        `select * from public.program_categories where slug = $1`,
        [category],
      );
      const cat = catRes.rows[0] ? rowCategory(catRes.rows[0]) : null;
      const itemsRes = await getPool().query(
        `select up.id up_id, up.university_id up_university_id, up.program_id up_program_id,
                up.language up_language, up.tuition_fee up_tuition_fee, up.original_fee up_original_fee, up.currency up_currency, up.scholarship_available up_scholarship,
                p.id p_id, p.slug p_slug, p.name_i18n p_name, p.degree_level p_degree, p.category_slug p_category, p.duration_years p_duration,
                u.id u_id, u.slug u_slug, u.city_id u_city_id, u.name u_name, u.name_i18n u_name_i18n, u.founded_year u_founded, u.student_count u_students,
                u.ranking u_ranking, u.accreditation u_accr, u.is_state u_state, u.logo_text u_logo, u.hero_image u_hero,
                u.gallery u_gallery, u.languages u_languages, u.featured u_featured,
                c.id c_id, c.slug c_slug, c.name_i18n c_name, c.country_code c_country,
                c.monthly_living_cost_usd c_monthly_living
         from public.university_programs up
         join public.programs p on p.id = up.program_id
         join public.universities u on u.id = up.university_id
         join public.cities c on c.id = u.city_id
         where p.category_slug = $1
         order by up.tuition_fee asc`,
        [category],
      );
      const items = itemsRes.rows.map(mapProgramItem);
      const citySlugs = [...new Set(items.map((i) => i.city.slug))];
      const universities = new Set(items.map((i) => i.university.id));
      const usdItems = items.filter((i) => i.tuitionFee > 0);
      return {
        category: cat,
        programs: items,
        citySlugs,
        universityCount: universities.size,
        minTuitionUSD: usdItems.length
          ? Math.min(...usdItems.map((i) => i.tuitionFee))
          : 0,
        uniqueLanguages: [...new Set(items.map((i) => i.language))],
      };
    },
    async getByCategoryAndCity(category: string, citySlug: string) {
      const catRes = await getPool().query(
        `select * from public.program_categories where slug = $1`,
        [category],
      );
      const cityRes = await getPool().query(
        `select * from public.cities where slug = $1`,
        [citySlug],
      );
      const cat = catRes.rows[0] ? rowCategory(catRes.rows[0]) : null;
      const city = cityRes.rows[0] ? rowCity(cityRes.rows[0]) : null;
      if (!city) {
        return {
          category: cat,
          city: null,
          programs: [],
          universityCount: 0,
          minTuitionUSD: 0,
        };
      }
      const itemsRes = await getPool().query(
        `select up.id up_id, up.university_id up_university_id, up.program_id up_program_id,
                up.language up_language, up.tuition_fee up_tuition_fee, up.original_fee up_original_fee, up.currency up_currency, up.scholarship_available up_scholarship,
                p.id p_id, p.slug p_slug, p.name_i18n p_name, p.degree_level p_degree, p.category_slug p_category, p.duration_years p_duration,
                u.id u_id, u.slug u_slug, u.city_id u_city_id, u.name u_name, u.name_i18n u_name_i18n, u.founded_year u_founded, u.student_count u_students,
                u.ranking u_ranking, u.accreditation u_accr, u.is_state u_state, u.logo_text u_logo, u.hero_image u_hero,
                u.gallery u_gallery, u.languages u_languages, u.featured u_featured,
                c.id c_id, c.slug c_slug, c.name_i18n c_name, c.country_code c_country,
                c.monthly_living_cost_usd c_monthly_living
         from public.university_programs up
         join public.programs p on p.id = up.program_id
         join public.universities u on u.id = up.university_id
         join public.cities c on c.id = u.city_id
         where p.category_slug = $1 and u.city_id = $2
         order by up.tuition_fee asc`,
        [category, city.id],
      );
      const items = itemsRes.rows.map(mapProgramItem);
      return {
        category: cat,
        city,
        programs: items,
        universityCount: new Set(items.map((i) => i.university.id)).size,
        minTuitionUSD: items.length ? items[0].tuitionFee : 0,
      };
    },

    async countAll(filters?: ProgramListingFilters): Promise<number> {
      const { where, params } = buildProgramListingWhere(filters);
      const sql =
        `select count(*)::int c from public.university_programs up
         join public.programs p on p.id = up.program_id
         join public.universities u on u.id = up.university_id
         join public.cities c on c.id = u.city_id` +
        (where.length ? ` where ${where.join(" and ")}` : "");
      const res = await getPool().query(sql, params);
      return Number(res.rows[0]?.c ?? 0);
    },
    async listPage(
      page: number,
      perPage: number,
      filters?: ProgramListingFilters,
    ) {
      const offset = (page - 1) * perPage;
      const { where, params } = buildProgramListingWhere(filters);
      const whereSql = where.length ? ` where ${where.join(" and ")}` : "";
      // B1: Single query with count(*) over() window function — eliminates
      // the separate count query (was 2 round-trips, now 1).
      const res = await getPool().query(
        `select up.id up_id, up.university_id up_university_id, up.program_id up_program_id,
                up.language up_language, up.tuition_fee up_tuition_fee, up.original_fee up_original_fee,
                up.currency up_currency, up.scholarship_available up_scholarship,
                p.id p_id, p.slug p_slug, p.name_i18n p_name, p.degree_level p_degree, p.category_slug p_category, p.duration_years p_duration,
                u.id u_id, u.slug u_slug, u.city_id u_city_id, u.name u_name, u.name_i18n u_name_i18n, u.founded_year u_founded, u.student_count u_students,
                u.ranking u_ranking, u.accreditation u_accr, u.is_state u_state, u.logo_text u_logo, u.hero_image u_hero,
                u.gallery u_gallery, u.languages u_languages, u.featured u_featured,
                c.id c_id, c.slug c_slug, c.name_i18n c_name, c.country_code c_country,
                c.monthly_living_cost_usd c_monthly_living,
                count(*) over() as total_count
         from public.university_programs up
         join public.programs p on p.id = up.program_id
         join public.universities u on u.id = up.university_id
         join public.cities c on c.id = u.city_id${whereSql}
         order by up.tuition_fee asc, up.id asc
         limit $${params.length + 1} offset $${params.length + 2}`,
        [...params, perPage, offset],
      );
      const total = Number(res.rows[0]?.total_count ?? 0);
      return {
        programs: res.rows.map(mapProgramItem),
        total,
        page,
        perPage,
        totalPages: Math.max(1, Math.ceil(total / perPage)),
      };
    },
  };

  const reviews: ReviewRepository = {
    async list(): Promise<Review[]> {
      const res = await getPool().query(
        `select * from public.reviews order by year desc, id`,
      );
      return res.rows.map(rowReview);
    },
    async byUniversity(universityId: string): Promise<Review[]> {
      const res = await getPool().query(
        `select * from public.reviews where university_id = $1 order by year desc`,
        [universityId],
      );
      return res.rows.map(rowReview);
    },
  };

  const faqs: FaqRepository = {
    async general(): Promise<Faq[]> {
      const res = await getPool().query(
        `select * from public.faqs where entity_type = 'general'`,
      );
      return res.rows.map(rowFaq);
    },
    async byUniversity(universityId: string): Promise<Faq[]> {
      const res = await getPool().query(
        `select * from public.faqs where entity_type = 'university' and entity_id = $1`,
        [universityId],
      );
      return res.rows.map(rowFaq);
    },
  };

  const scholarships: ScholarshipRepository = {
    async byUniversity(universityId: string): Promise<Scholarship[]> {
      const res = await getPool().query(
        `select * from public.scholarships where university_id = $1`,
        [universityId],
      );
      return res.rows.map(rowScholarship);
    },
  };

  const blog: BlogRepository = {
    async list(): Promise<BlogPost[]> {
      const res = await getPool().query(
        `select * from public.blog_posts order by published_at desc`,
      );
      const dbPosts = res.rows.map(rowBlogPost);
      // AEO: merge DB posts with the dynamically generated, fully-localized
      // article families (46 per-university + 15 per-country visa guides).
      const [{ generateUniversityArticles }, { generateVisaArticles }] =
        await Promise.all([
          import("@/lib/seo/university-articles"),
          import("@/lib/seo/visa-articles"),
        ]);
      const uniArticles = generateUniversityArticles();
      const visaArticles = generateVisaArticles();
      return [...dbPosts, ...uniArticles, ...visaArticles].sort((a, b) =>
        b.publishedAt.localeCompare(a.publishedAt),
      );
    },
    async listSummaries(): Promise<BlogPostSummary[]> {
      // PERF §6.2: the body (content_i18n) stays in the DB — the index only
      // renders card fields.
      const res = await getPool().query(
        `select id, slug, title_i18n, excerpt_i18n, category_i18n, author,
                published_at, cover_image, reading_minutes, updated_at
         from public.blog_posts
         order by published_at desc`,
      );
      const dbPosts = res.rows.map(rowBlogPostSummary);
      const [{ generateUniversityArticles }, { generateVisaArticles }] =
        await Promise.all([
          import("@/lib/seo/university-articles"),
          import("@/lib/seo/visa-articles"),
        ]);
      const toSummary = (a: BlogPost): BlogPostSummary => {
        const { content: _content, ...summary } = a;
        return summary;
      };
      const uniArticles = generateUniversityArticles().map(toSummary);
      const visaArticles = generateVisaArticles().map(toSummary);
      return [...dbPosts, ...uniArticles, ...visaArticles].sort((a, b) =>
        b.publishedAt.localeCompare(a.publishedAt),
      );
    },
    async getBySlug(slug: string): Promise<BlogPost | null> {
      const res = await getPool().query(
        `select * from public.blog_posts where slug = $1`,
        [slug],
      );
      if (res.rows[0]) return rowBlogPost(res.rows[0]);
      // Check dynamic article families (university + per-country visa)
      const { generateUniversityArticles, isUniversityArticle } =
        await import("@/lib/seo/university-articles");
      if (isUniversityArticle(slug)) {
        return (
          generateUniversityArticles().find((a) => a.slug === slug) ?? null
        );
      }
      const { generateVisaArticles, isVisaArticle } =
        await import("@/lib/seo/visa-articles");
      if (isVisaArticle(slug)) {
        return generateVisaArticles().find((a) => a.slug === slug) ?? null;
      }
      return null;
    },
  };

  const search = {
    async search(query: string, limit = 10): Promise<SearchResult[]> {
      const q = query.trim();
      if (!q) return [];
      // ts_rank on universities + trigram ILIKE on programs/cities slugs, UNION ALL.
      // Score via rank; universities get the strongest weight via tsvector setweight.
      const res = await getPool().query(
        `(
           select 1 sort, 'university' type, u.id, u.slug, u.name label, u.accreditation hint, u.name_i18n,
                  u.tagline_i18n, u.description_i18n,
                  ts_rank(u.search_tsv, plainto_tsquery('simple', $1)) rank
           from public.universities u
           where u.search_tsv @@ plainto_tsquery('simple', $1)
              or u.name ilike '%' || $1 || '%'
              or u.name_i18n::text ilike '%' || $1 || '%'
           order by rank desc, u.name
           limit $2
         )
         union all
         (
           select 2 sort, 'program' type, p.id, p.slug, p.slug label, p.degree_level hint, p.name_i18n,
                  null::jsonb, null::jsonb,
                  0::float8 rank
           from public.programs p
           where p.slug ilike '%' || $1 || '%' or p.name_i18n::text ilike '%' || $1 || '%'
           limit $2
         )
         union all
         (
           select 3 sort, 'city' type, c.id, c.slug, c.slug label, null hint, c.name_i18n,
                  null::jsonb, null::jsonb,
                  0::float8 rank
           from public.cities c
           where c.slug ilike '%' || $1 || '%' or c.name_i18n::text ilike '%' || $1 || '%'
           limit $2
         )
         order by sort, rank desc
         limit $2`,
        [q, limit],
      );
      return res.rows.map((r) => ({
        type: r.type as SearchResult["type"],
        id: r.id as string,
        slug: r.slug as string,
        label: r.label as string,
        hint: r.hint ?? undefined,
        nameI18n: r.name_i18n ? i18n(r.name_i18n) : undefined,
        taglineI18n: r.tagline_i18n ? i18n(r.tagline_i18n) : undefined,
        descriptionI18n: r.description_i18n
          ? i18n(r.description_i18n)
          : undefined,
      }));
    },
  };

  return {
    universities,
    cities,
    countries,
    programs,
    reviews,
    faqs,
    scholarships,
    blog,
    search,
  };
}

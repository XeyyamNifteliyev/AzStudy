// scripts/seed-content.ts — Phase 3B: load `src/lib/seed/*` into the content tables
// created by `0011_content_tables.sql`. Idempotent (truncate + insert).
import { Pool } from "pg";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  seedCountries,
  seedCities,
  seedPrograms,
  seedCategories,
  seedUniversities,
  seedUniversityPrograms,
  seedScholarships,
  seedDormitories,
  seedReviews,
  seedFaqs,
  seedBlog,
} from "../src/lib/seed";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// Load .env.local / .env (mirrors migrate.ts).
for (const file of [".env.local", ".env"]) {
  const envPath = join(root, file);
  if (!existsSync(envPath)) continue;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    const [, key, value] = match;
    if (process.env[key] === undefined) {
      process.env[key] = value.replace(/^["']|["']$/g, "");
    }
  }
}

// Re-export so tsx picks the .ts imports from src/lib/seed (ESM-compatible via tsconfig paths
// are NOT resolved here — import via relative path).
void [
  seedCountries,
  seedCities,
  seedPrograms,
  seedCategories,
  seedUniversities,
  seedUniversityPrograms,
  seedScholarships,
  seedDormitories,
  seedReviews,
  seedFaqs,
  seedBlog,
];

async function truncateAll(client: import("pg").PoolClient) {
  const tables = [
    "public.blog_posts",
    "public.faqs",
    "public.reviews",
    "public.dormitories",
    "public.scholarships",
    "public.university_programs",
    "public.universities",
    "public.programs",
    "public.program_categories",
    "public.cities",
    "public.countries",
  ];
  for (const t of tables) {
    await client.query(`truncate table ${t} restart identity cascade`);
  }
}

/**
 * Batch multi-row INSERT (chunks of 500 rows) so seeding a REMOTE database
 * (Supabase) doesn't do one network round-trip per row — which previously hung
 * for 10+ minutes on the ~6k university_programs rows. Preserves per-column
 * casts (e.g. ::jsonb) and ON CONFLICT … DO NOTHING idempotency.
 */
async function batchInsert(
  client: import("pg").PoolClient,
  table: string,
  columns: string[],
  casts: string[], // '' or e.g. 'jsonb', aligned to columns
  conflict: string, // '(id)' | '(code)' | '(slug)'
  rows: unknown[][],
  chunkSize = 500,
): Promise<void> {
  if (rows.length === 0) return;
  const colList = columns.join(", ");
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    const ncols = columns.length;
    const placeholders: string[] = [];
    const values: unknown[] = [];
    for (let r = 0; r < chunk.length; r++) {
      const base = r * ncols;
      const ph: string[] = [];
      for (let c = 0; c < ncols; c++) {
        const dollar = `$${base + c + 1}`;
        ph.push(casts[c] ? `${dollar}::${casts[c]}` : dollar);
      }
      placeholders.push(`(${ph.join(", ")})`);
      values.push(...chunk[r]);
    }
    const sql = `insert into ${table} (${colList}) values ${placeholders.join(", ")} on conflict ${conflict} do nothing`;
    await client.query(sql, values);
  }
}

async function insertAll(client: import("pg").PoolClient) {
  // countries
  await batchInsert(
    client,
    "public.countries",
    ["code", "slug", "name_i18n", "flag"],
    ["", "", "jsonb", ""],
    "(code)",
    seedCountries.map((c) => [c.code, c.slug, JSON.stringify(c.name), c.flag]),
  );

  // cities
  await batchInsert(
    client,
    "public.cities",
    ["id", "slug", "country_code", "name_i18n", "monthly_living_cost_usd"],
    ["", "", "", "jsonb", ""],
    "(id)",
    seedCities.map((c) => [
      c.id,
      c.slug,
      c.countryId,
      JSON.stringify(c.name),
      c.monthlyLivingCostUSD ?? null,
    ]),
  );

  // program_categories
  await batchInsert(
    client,
    "public.program_categories",
    ["slug", "name_i18n", "icon"],
    ["", "jsonb", ""],
    "(slug)",
    seedCategories.map((cat) => [
      cat.slug,
      JSON.stringify(cat.name),
      cat.icon ?? null,
    ]),
  );

  // programs
  await batchInsert(
    client,
    "public.programs",
    [
      "id",
      "slug",
      "name_i18n",
      "degree_level",
      "category_slug",
      "duration_years",
    ],
    ["", "", "jsonb", "", "", ""],
    "(id)",
    seedPrograms.map((p) => [
      p.id,
      p.slug,
      JSON.stringify(p.name),
      p.degreeLevel,
      p.categorySlug,
      p.durationYears,
    ]),
  );

  // universities
  await batchInsert(
    client,
    "public.universities",
    [
      "id",
      "slug",
      "city_id",
      "name",
      "name_i18n",
      "founded_year",
      "student_count",
      "ranking",
      "accreditation",
      "is_state",
      "logo_text",
      "hero_image",
      "gallery",
      "tagline_i18n",
      "description_i18n",
      "languages",
      "featured",
    ],
    ["", "", "", "", "jsonb", "", "", "", "", "", "", "", "text[]", "jsonb", "jsonb", "text[]", ""],
    "(id)",
    seedUniversities.map((u) => [
      u.id,
      u.slug,
      u.cityId,
      u.name,
      JSON.stringify(u.nameI18n ?? {}),
      u.foundedYear,
      u.studentCount,
      u.ranking,
      u.accreditation,
      u.isState,
      u.logoText,
      u.heroImage,
      `{${(u.gallery ?? []).join(",")}}`,
      JSON.stringify(u.tagline),
      JSON.stringify(u.description),
      `{${(u.languages ?? []).join(",")}}`,
      u.featured ?? false,
    ]),
  );

  // university_programs (the big one — 6k+ rows, now batched)
  await batchInsert(
    client,
    "public.university_programs",
    [
      "id",
      "university_id",
      "program_id",
      "language",
      "tuition_fee",
      "original_fee",
      "currency",
      "scholarship_available",
    ],
    ["", "", "", "", "", "", "", ""],
    "(id)",
    seedUniversityPrograms.map((up) => [
      up.id,
      up.universityId,
      up.programId,
      up.language,
      up.tuitionFee,
      up.originalFee ?? null,
      up.currency,
      up.scholarshipAvailable,
    ]),
  );

  // scholarships
  await batchInsert(
    client,
    "public.scholarships",
    ["id", "university_id", "name_i18n", "percentage", "requirements_i18n"],
    ["", "", "jsonb", "", "jsonb"],
    "(id)",
    seedScholarships.map((s) => [
      s.id,
      s.universityId,
      JSON.stringify(s.name),
      s.percentage,
      JSON.stringify(s.requirements),
    ]),
  );

  // dormitories
  await batchInsert(
    client,
    "public.dormitories",
    [
      "id",
      "university_id",
      "capacity",
      "price_per_month",
      "currency",
      "photos",
    ],
    ["", "", "", "", "", ""],
    "(id)",
    seedDormitories.map((d) => [
      d.id,
      d.universityId,
      d.capacity,
      d.pricePerMonth,
      d.currency,
      d.photos,
    ]),
  );

  // reviews
  await batchInsert(
    client,
    "public.reviews",
    [
      "id",
      "university_id",
      "author_name",
      "author_country",
      "author_initials",
      "rating",
      "text_i18n",
      "verified",
      "program_studied_i18n",
      "year",
    ],
    ["", "", "", "", "", "", "jsonb", "", "jsonb", ""],
    "(id)",
    seedReviews.map((r) => [
      r.id,
      r.universityId,
      r.authorName,
      r.authorCountry,
      r.authorInitials,
      r.rating,
      JSON.stringify(r.text),
      r.verified,
      JSON.stringify(r.programStudied),
      r.year,
    ]),
  );

  // faqs
  await batchInsert(
    client,
    "public.faqs",
    ["id", "entity_type", "entity_id", "question_i18n", "answer_i18n"],
    ["", "", "", "jsonb", "jsonb"],
    "(id)",
    seedFaqs.map((f) => [
      f.id,
      f.entityType,
      f.entityId,
      JSON.stringify(f.question),
      JSON.stringify(f.answer),
    ]),
  );

  // blog_posts
  await batchInsert(
    client,
    "public.blog_posts",
    [
      "id",
      "slug",
      "title_i18n",
      "excerpt_i18n",
      "content_i18n",
      "author",
      "published_at",
      "cover_image",
      "category_i18n",
      "reading_minutes",
    ],
    ["", "", "jsonb", "jsonb", "jsonb", "", "", "", "jsonb", ""],
    "(id)",
    seedBlog.map((b) => [
      b.id,
      b.slug,
      JSON.stringify(b.title),
      JSON.stringify(b.excerpt),
      JSON.stringify(b.content),
      b.author,
      b.publishedAt,
      b.coverImage,
      JSON.stringify(b.category),
      b.readingMinutes,
    ]),
  );
}

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  const pool = new Pool({ connectionString: url });
  const client = await pool.connect();
  try {
    console.log("→ seeding content tables");
    // C5: truncate + insert must be atomic — a partial failure must not leave
    // the content tables empty. Wrap both in a single transaction.
    await client.query("begin");
    try {
      await truncateAll(client);
      await insertAll(client);
      await client.query("commit");
    } catch (err) {
      await client.query("rollback");
      throw err;
    }
    console.log("✓ content seeded");
  } finally {
    client.release();
    await pool.end();
  }
}

// Run if invoked directly. Also export for compose with migrate.ts.
const invokedDirect = (() => {
  try {
    return (
      import.meta.url === `file://${process.argv[1]}` ||
      process.argv[1]?.endsWith("seed-content.ts")
    );
  } catch {
    return false;
  }
})();

if (invokedDirect) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

export { main as seedContent };
// silence unused (readdirSync kept for future expansion of env file glob)
void readdirSync;

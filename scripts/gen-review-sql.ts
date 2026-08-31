// scripts/gen-review-sql.ts — dump seedReviews as upsert SQL (for MCP apply)
import { writeFileSync } from "node:fs";
import { seedReviews } from "../src/lib/seed/reviews";

const esc = (s: string) => s.replace(/'/g, "''");
const jsonb = (o: Record<string, string>) => `'${esc(JSON.stringify(o))}'::jsonb`;

const rows = seedReviews
  .map(
    (r) =>
      `  ('${esc(r.id)}', '${esc(r.universityId)}', '${esc(r.authorName)}', '${esc(r.authorCountry)}', '${esc(r.authorInitials)}', ${r.rating}, ${jsonb(r.text)}, ${r.verified}, ${jsonb(r.programStudied)}, ${r.year})`,
  )
  .join(",\n");

const sql = `insert into public.reviews (id, university_id, author_name, author_country, author_initials, rating, text_i18n, verified, program_studied_i18n, year) values
${rows}
on conflict (id) do update set
  author_name = excluded.author_name,
  author_country = excluded.author_country,
  author_initials = excluded.author_initials,
  rating = excluded.rating,
  text_i18n = excluded.text_i18n,
  verified = excluded.verified,
  program_studied_i18n = excluded.program_studied_i18n,
  year = excluded.year;`;

writeFileSync("C:/Users/Asus/AppData/Local/Temp/opencode/reviews-upsert.sql", sql, "utf8");
console.log("SQL written,", seedReviews.length, "reviews,", sql.length, "chars");

#!/usr/bin/env node
/**
 * Sync university programs from seed data to PostgreSQL.
 * Inserts programs that exist in seed but not in DB.
 */
import { readFileSync } from "fs";
import pg from "pg";

const envLocal = readFileSync(".env.local", "utf8");
const dbUrl = envLocal.match(/DATABASE_URL=(.+)/)?.[1]?.trim();
if (!dbUrl) { console.error("No DATABASE_URL"); process.exit(1); }

const pool = new pg.Pool({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });

// Parse seed programs
const seedFile = readFileSync("src/lib/seed/university-programs.ts", "utf8");
const entries = [];
const regex = /\{\s*id:\s*"([^"]+)",\s*universityId:\s*"([^"]+)",\s*programId:\s*"([^"]+)",\s*language:\s*"([^"]+)",\s*tuitionFee:\s*(\d+),\s*currency:\s*"([^"]+)",\s*scholarshipAvailable:\s*(true|false),?\s*\}/g;
let m;
while ((m = regex.exec(seedFile)) !== null) {
  entries.push({
    id: m[1], universityId: m[2], programId: m[3],
    language: m[4], tuitionFee: parseInt(m[5]),
    currency: m[6], scholarshipAvailable: m[7] === "true",
  });
}
console.log(`Found ${entries.length} programs in seed file`);

// Get existing IDs from DB
const existing = await pool.query("SELECT id FROM university_programs");
const existingIds = new Set(existing.rows.map(r => r.id));
console.log(`Existing in DB: ${existingIds.size}`);

// Insert missing
const missing = entries.filter(e => !existingIds.has(e.id));
console.log(`Missing from DB: ${missing.length}`);

let inserted = 0;
for (const e of missing) {
  try {
    await pool.query(
      `INSERT INTO university_programs (id, university_id, program_id, language, tuition_fee, currency, scholarship_available)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [e.id, e.universityId, e.programId, e.language, e.tuitionFee, e.currency, e.scholarshipAvailable]
    );
    inserted++;
  } catch (err) {
    // Skip if program or university doesn't exist in DB
    if (err.code === "23503") {
      // FK violation - skip silently
    } else {
      console.error(`Error inserting ${e.id}:`, err.message);
    }
  }
}

console.log(`Inserted ${inserted} programs into DB`);

// Verify
const result = await pool.query("SELECT university_id, count(*) c FROM university_programs GROUP BY university_id ORDER BY c DESC");
console.log(`\nDB now has ${result.rows.length} universities with programs:`);
result.rows.forEach(r => console.log(`  ${r.university_id}: ${r.c} programs`));

await pool.end();

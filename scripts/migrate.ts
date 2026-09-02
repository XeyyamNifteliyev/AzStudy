// scripts/migrate.ts
import { Pool } from "pg";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { seedContent } from "./seed-content";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// Load .env.local / .env into process.env (tsx does not auto-load them like Next.js does).
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

const migrationsDir = join(root, "supabase", "migrations");
const seedPath = join(root, "supabase", "seed.sql");

// Skip locally: require Supabase auth schema. 0007 is manual-only (Phase 2B), never auto-run.
const SKIP_LOCAL = [
  "0005_rls.sql",
  "0006_auth_trigger.sql",
  "0007_link_profiles_to_auth_users.sql",
  "0009_storage_bucket.sql",
  "0013_role_guard.sql",
  "0018_rls_least_privilege.sql",
  "0021_apply_documents_bucket.sql",
  "0027_apply_documents_bucket_policies.sql",
  "0028_content_rls.sql",
  "0029_messages_rls.sql",
  "0030_security_advisor_fixes.sql",
  "0031_performance_rls_hardening.sql",
  "0035_azn_currency.sql",
];

// A destructive reset is only safe against a local/dev database. Refuse if
// DATABASE_URL points anywhere else to prevent catastrophic data loss.
// M9: parse the host from the URL and only allow loopback hosts — a substring
// match on "DEV" could let a production host like "db-dev.example.com" through.
function isLocalDatabase(url: string): boolean {
  try {
    const host = new URL(url).hostname;
    return ["localhost", "127.0.0.1", "::1", "0.0.0.0"].includes(host);
  } catch {
    return false;
  }
}

// Per-run advisory lock so two concurrent `db:migrate` invocations can't race.
const MIGRATION_LOCK_ID = 0x5354554459; // 'STUDY'

async function main() {
  const args = new Set(process.argv.slice(2));
  const reset = args.has("--reset");
  const seed = args.has("--seed") || reset;

  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");

  if (reset && !isLocalDatabase(url)) {
    throw new Error(
      "Refusing to reset: DATABASE_URL does not look local (no localhost/127.0.0.1/.local/DEV). " +
        "Reset would DROP the public schema and destroy all data.",
    );
  }

  const pool = new Pool({ connectionString: url });
  const client = await pool.connect();
  try {
    await client.query("select pg_advisory_lock($1)", [MIGRATION_LOCK_ID]);

    if (reset) {
      console.log("→ resetting schema");
      await client.query(`
        drop schema if exists public cascade;
        create schema public;
      `);
    }

    // Migration ledger: record applied files so each migration runs exactly once,
    // and a future non-idempotent migration can't silently re-execute.
    // QA-4: store a SHA-256 checksum of each applied file so an edited migration
    // (drift) is detected instead of silently ignored.
    await client.query(`
      create table if not exists public.schema_migrations (
        filename text primary key,
        checksum text not null default '',
        applied_at timestamptz not null default now()
      );
    `);
    // Upgrade path for ledgers created before QA-4 (checksum column missing).
    await client.query(`
      alter table public.schema_migrations
        add column if not exists checksum text not null default '';
    `);

    const files = readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".sql"))
      .sort();

    for (const file of files) {
      if (SKIP_LOCAL.includes(file)) {
        console.log(`↩ skip (supabase-only) ${file}`);
        continue;
      }
      const sql = readFileSync(join(migrationsDir, file), "utf8");
      const checksum = createHash("sha256").update(sql).digest("hex");
      const { rows } = await client.query(
        "select checksum from public.schema_migrations where filename = $1",
        [file],
      );
      if (rows.length) {
        if (rows[0].checksum && rows[0].checksum !== checksum) {
          console.error(
            `⚠ checksum mismatch for ${file} — the file was edited after it was applied. ` +
              "Applied checksums must never change; create a new migration instead.",
          );
          process.exitCode = 1;
        } else {
          console.log(`✓ already applied ${file}`);
        }
        continue;
      }
      console.log(`→ applying ${file}`);
      await client.query("begin");
      try {
        await client.query(sql);
        await client.query(
          "insert into public.schema_migrations (filename, checksum) values ($1, $2)",
          [file, checksum],
        );
        await client.query("commit");
      } catch (err) {
        await client.query("rollback");
        throw err;
      }
    }

    if (seed) {
      console.log("→ seeding CRM (seed.sql)");
      const sql = readFileSync(seedPath, "utf8");
      await client.query(sql);
    }

    console.log("✓ done (migrations + CRM seed)");
  } finally {
    await client
      .query("select pg_advisory_unlock($1)", [MIGRATION_LOCK_ID])
      .catch(() => {});
    client.release();
    await pool.end();
  }
}

// Content tables (Phase 3B) load from seed TS after migrations/CRM-seed.
async function seedContentPhase() {
  const args = new Set(process.argv.slice(2));
  const reset = args.has("--reset");
  const seed = args.has("--seed") || reset;
  if (!seed) return;
  await seedContent();
}

main()
  .then(() => seedContentPhase())
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

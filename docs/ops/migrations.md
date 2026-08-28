# Migrations Runbook

> Owners: StudyHub ops · Last reviewed: 2026-08-12
> Runner: `scripts/migrate.ts` (hand-rolled, ledger + advisory lock + SHA-256 checksum).

## Policy: forward-only

Migrations are **forward-only** — there is no `down`/rollback. This is deliberate
and standard for production databases: a backward `down` that loses data is more
dangerous than a forward fix. To undo a schema change, **write a new forward
migration** (e.g. `0023_revert_<thing>.sql`).

## How the runner works

- Files in `supabase/migrations/` are applied in **filename order** (zero-padded `NNNN_`).
- A `public.schema_migrations(filename, checksum, applied_at)` ledger records what's
  applied. Already-applied files are skipped.
- Each file runs inside its own `BEGIN/COMMIT` transaction; on error it rolls back
  and the runner exits non-zero.
- A `pg_advisory_lock` prevents two concurrent `db:migrate` runs from racing.
- **QA-4 checksum:** the SHA-256 of each file is stored at apply time. If a file is
  edited after it was applied, the runner prints `⚠ checksum mismatch: <file>` and
  exits 1 — so silent migration drift is impossible.

## Two flavors of migration

| Flavor                           | Examples                                                                                                                              | Runs locally?       | Runs on Supabase?                      |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------- | -------------------------------------- |
| General (data + schema)          | `0002_tables`, `0020_leads_dl`, `0022_*`                                                                                              | ✅ via `db:migrate` | ✅ via `db:migrate` against prod       |
| Supabase-only (auth/RLS/storage) | `0005_rls`, `0007_link_profiles`, `0009_storage_bucket`, `0013_role_guard`, `0018_rls_least_privilege`, `0021_apply_documents_bucket` | ❌ `SKIP_LOCAL`     | ✅ **manually in Supabase SQL Editor** |

The `SKIP_LOCAL` list lives in `scripts/migrate.ts`. When you add a Supabase-only
migration, **add its filename to `SKIP_LOCAL`** and apply it in the dashboard.

## Local dev

```bash
npm run db:up        # docker-compose Postgres on :5433
npm run db:reset     # DROP SCHEMA + re-run all migrations + seed (LOCAL DB ONLY)
npm run db:migrate   # apply pending migrations (no seed)
npm run db:seed      # idempotent content seed (on conflict do nothing)
```

`db:reset` is refused on non-local databases (`isLocalDatabase()` guard) — it never
runs against prod/Supabase URLs.

## Production

```bash
DATABASE_URL="<prod-direct-conn>" npm run db:migrate
```

(See `docs/ops/deploy.md` for the full sequence.)

## Adding a migration

1. Pick the next `NNNN_` number (zero-padded; check `supabase/migrations/`).
2. Name it `NNNN_<short_snake_case_desc>.sql`.
3. Write **idempotent** SQL where possible (`create table if not exists`,
   `create index if not exists`, `drop ... if exists`, `on conflict do nothing`).
4. If it uses `auth.uid()` / `storage.*` / Supabase-only objects → add the filename
   to `SKIP_LOCAL` and apply it via the Supabase SQL Editor in prod.
5. Commit the `.sql` file. CI runs `db:migrate --seed` against a throwaway Postgres,
   so a non-idempotent or broken migration fails the build.

## When the checksum mismatch fires

It means someone edited an already-applied migration file. **Do not** silence it.
Either:

- Revert the file to its committed (applied) content, OR
- If the edit is intentional, write the change as a **new** forward migration and
  restore the original file, then update the ledger checksum only via a deliberate,
  documented manual step.

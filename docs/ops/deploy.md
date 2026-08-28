# Deploy & Rollback Runbook

> Owners: StudyHub ops · Last reviewed: 2026-08-12
> Stack: Next.js 15 (App Router) on Vercel · Postgres on Supabase.

## Environments

| Env        | Branch                          | Supabase project               | URL                    |
| ---------- | ------------------------------- | ------------------------------ | ---------------------- |
| Production | `main` (Vercel Git auto-deploy) | prod Supabase                  | `NEXT_PUBLIC_SITE_URL` |
| Preview    | PR branches (Vercel preview)    | staging Supabase (recommended) | `*.vercel.app`         |

> Until a staging Supabase project exists, PR previews run against the **prod**
> Supabase with `SUPABASE_ENABLED=false` (direct `pg`). Treat previews as
> read-mostly; never run destructive actions from a preview.

## Required production env vars (Vercel → Settings → Environment Variables)

```
NEXT_PUBLIC_SITE_URL       # real domain — canonical/hreflang/sitemap depend on it
DATABASE_URL               # Supabase direct (non-pooler) connection
SUPABASE_ENABLED=true      # once SupabaseCrmRepository is wired
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY  # server-only
SESSION_SECRET             # long random hex (cookie HMAC)
NEXT_PUBLIC_GA_ID / NEXT_PUBLIC_CLARITY_ID   # analytics (optional)
UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN  # rate limiting (recommended)
TRUST_PROXY=1              # Vercel is a trusted proxy
```

## Standard deploy sequence

> The CI pipeline (`.github/workflows/ci.yml`) runs lint → typecheck → migrate+seed
> → unit → build → e2e. **Production deploys are automated** (`.github/workflows/deploy.yml`,
> QA-2): merge to `main` triggers **migrate-first → Vercel → smoke test**, and the
> job fails if the migration or smoke step fails. Supabase-only migrations that
> `migrate.ts` skips locally (`0005/0006/0007/0009/0013/0018/0021` + any future
> `SKIP_LOCAL` entry) are still applied manually in the Supabase SQL Editor, in
> filename order, **before** merging a PR that ships code depending on them.

1. **Apply Supabase-only migrations** (if any) in the Supabase **SQL Editor**, in
   filename order.
2. **Merge** the PR to `main` — CI must be green; the CD job then runs
   `db:migrate` against prod (ledger + advisory lock + SHA-256 checksum, QA-4),
   deploys to Vercel, and smoke-tests `/api/health`, the homepage, `/universities`
   and `/apply`.
3. **Verify** the CD run in Actions → "CD — Deploy" → all steps green.

## Rollback

- **Code:** Vercel keeps instant rollbacks — Dashboard → Deployments → "Instant Rollback"
  to the previous production deployment. This reverts _code_ but **not** the DB schema.
- **Schema:** migrations are **forward-only** (no `down`). To revert a schema change,
  write a _new_ forward migration that undoes it (see `docs/ops/migrations.md`).
- **Data:** restore from the nightly dump (`docs/ops/backup.md`) or Supabase PITR.

## Incident checklist

1. Check `/api/health` (503 → DB/Supabase issue).
2. Vercel deployment logs + runtime logs (structured JSON from `src/lib/logger.ts`).
3. Supabase dashboard → database health / connection count / recent queries.
4. If leads are silently failing: query `leads_dl` (`replayed_at is null`) — these
   are captured-but-not-recorded leads (SEC-1 dead-letter). Replay manually.
5. Roll back code (step above) if a deploy caused it; page on the backup if data is lost.

## "Migrate-first" hard gate (live — QA-2)

The CD deploy job (`.github/workflows/deploy.yml`) runs `db:migrate` against prod
**before** Vercel goes live and **fails the deploy** on any migration error.
Vercel Git auto-deploy is disabled for `main`; the CD job is the single deploy path.

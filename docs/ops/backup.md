# Backup & Disaster Recovery

> Owners: StudyHub ops · Last reviewed: 2026-08-12
> Scope: transactional CRM data (leads, applications, messages, documents, audit logs).

## RTO / RPO targets

| Tier   | RPO (data loss) | RTO (downtime) |
| ------ | --------------- | -------------- |
| Target | ≤ 24h           | ≤ 4h           |

## Backup layers (defense in depth)

1. **Supabase-managed (primary).**
   - **Pro plan and above:** Point-in-Time Recovery (PITR) — RPO down to seconds.
     Enable in Dashboard → Database → Backups. This is the real safety net.
   - **Free plan:** daily logical snapshot only (RPO ≤ 24h). Not sufficient for a
     CRM that stores paying-intent leads — upgrade to Pro for PITR.
2. **Nightly off-platform logical backup (this repo).**
   `.github/workflows/backup.yml` runs `pg_dump` at 02:00 UTC against
   `secrets.BACKUP_DATABASE_URL` and uploads a custom-format dump as a 30-day
   GitHub Actions artifact. It only runs when repo variable
   `ENABLE_NIGHTLY_BACKUP == 'true'`. This survives a Supabase-side incident.
3. **Seed source (reference content).** `scripts/data/studyleo-catalog.json` is
   committed and re-seeds universities/programs/cities — reference content is
   always reconstructable. Transactional data is NOT — that's what layers 1–2 protect.

## Provisioning checklist

- [ ] Supabase project on **Pro** (PITR enabled) — or accept Free's daily-only RPO.
- [ ] GitHub repo **secret** `BACKUP_DATABASE_URL` — a Postgres connection string
      with SELECT grants (does not need superuser). Use the **direct** (non-pooler)
      connection; `pg_dump` and PgBouncer transaction pooling don't mix.
- [ ] GitHub repo **variable** `ENABLE_NIGHTLY_BACKUP = true`.
- [ ] Confirm the workflow runs green (Actions → "Nightly DB backup" → Run workflow).

## Restore procedure (from a nightly dump artifact)

1. Download the `.dump` artifact from the successful "Nightly DB backup" run.
2. Restore onto a target Postgres (local Docker, a new Supabase project, staging):
   ```bash
   # Local Docker (matches docker-compose.yml)
   docker cp studyhub-YYYYMMDD-HHMMSS.dump study_crm_db:/tmp/dump.dump
   docker exec study_crm_db pg_restore -U study -d study_crm -c --if-exists /tmp/dump.dump
   ```
   (`-c --if-exists` drops existing objects first; safe on an empty/fresh DB.)
3. Verify row counts: `select count(*) from leads; select count(*) from profiles;`
4. Point `DATABASE_URL` at the restored DB and smoke-test `/api/health` + admin CRM.

## Restore test (quarterly)

- Restore the latest nightly dump into a throwaway staging DB and run the unit +
  e2e suites against it. Record the result + any restore errors in this file.
- Last restore test: _(date, operator, result)_

## Notes

- **Belt-and-suspenders only.** A GitHub Actions artifact (30-day retention) is
  not long-term archival. For >30-day retention, enable the optional S3 push step
  in `backup.yml` and configure lifecycle rules.
- `scripts/migrate.ts --reset` runs `DROP SCHEMA public CASCADE` and is **refused
  on non-local databases** — but never run it against `BACKUP_DATABASE_URL`.

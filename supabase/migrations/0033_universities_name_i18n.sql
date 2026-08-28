-- 0033_universities_name_i18n.sql
-- Backfill `name_i18n` on public.universities: the code (pg-data-repository)
-- reads `u.name_i18n` for localized university names, but the 0011 content
-- tables never created the column. This migration adds it and seeds an
-- `{en: <name>}` baseline so existing rows are queryable; the full 18-locale
-- payload is loaded by scripts/seed-content.ts on the next seed run.

alter table public.universities
  add column if not exists name_i18n jsonb not null default '{}'::jsonb;

-- Backfill existing rows with their English `name` so lookups never break
-- before the i18n seed runs.
update public.universities
  set name_i18n = jsonb_build_object('en', name)
  where name_i18n = '{}'::jsonb;

-- 0035_azn_currency.sql
-- Currency model: Azerbaijani platform — programmes are priced in USD or AZN
-- (TRY was a StudyTurkey-era leftover). Must be applied on Supabase via the
-- SQL editor (see SKIP_LOCAL in scripts/migrate.ts) — never auto-run locally.
alter table public.university_programs
  drop constraint if exists up_currency_check;
alter table public.university_programs
  add constraint up_currency_check check (currency in ('USD', 'AZN'));

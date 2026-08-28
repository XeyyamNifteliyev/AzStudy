-- 0026_app_user_role.sql — least-privilege runtime role for the application.
--
-- Problem this solves: the Next.js app connects to Postgres with the
-- migration/owner account (DATABASE_URL). That account bypasses RLS (owner
-- rows are never filtered) and has full DDL rights, so a leaked or
-- SQL-injected connection string can drop tables, create roles, or read any
-- schema in the cluster. The app's real authorization lives in the
-- repository layer (every method filters by user/tenant), so the DB role only
-- needs row-level DML — never DDL.
--
-- This migration creates `app_user` with ONLY:
--   - usage on schema public
--   - SELECT/INSERT/UPDATE/DELETE on public tables + sequences
--   - the same DML privileges on tables created by future migrations
--   - RLS policies that replicate the owner account's current behavior
--     (rows visible to the app layer), so switching roles does not change
--     what the app can read or write.
--
-- Activation is opt-in and additive (safe to apply to a running deployment):
--   1. Apply this migration.
--   2. Set a password ONCE (keep it out of git / migrations):
--        alter role app_user password 'a-strong-random-password';
--      (On Supabase, use the SQL editor or dashboard; the role can also be
--       managed under Database → Roles.)
--   3. Point the app at the new role via APP_DATABASE_URL
--      (see .env.example). DATABASE_URL stays the owner/migration URL.
--
-- NOTE (Supabase managed Postgres): custom roles are supported, but they
-- cannot be superusers and cannot create other roles — which is exactly the
-- property we want. The migration must run as a role that can CREATE ROLE
-- (postgres / the migration owner).

do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'app_user') then
    create role app_user login nosuperuser nocreatedb nocreaterole noreplication;
  end if;
end
$$;

-- Row-level DML only. No CREATE/ALTER/DROP, no role or schema management.
grant usage on schema public to app_user;

grant select, insert, update, delete on all tables in schema public to app_user;
grant usage, select on all sequences in schema public to app_user;

-- Future migrations create tables/sequences owned by the migration role;
-- default privileges make sure app_user keeps working without revisiting
-- every new migration.
alter default privileges in schema public
  grant select, insert, update, delete on tables to app_user;
alter default privileges in schema public
  grant usage, select on sequences to app_user;

-- RLS: replicate the owner-account behavior (all rows visible to the app
-- layer) on every RLS-enabled public table. Authorization stays in the app
-- repository layer, which filters every query by user/tenant. The win is the
-- credential itself: app_user can no longer run DDL or escalate.
do $$
declare t record;
begin
  for t in
    select c.oid::regclass::text as tbl
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relkind = 'r'
      and c.relrowsecurity
  loop
    execute format(
      'drop policy if exists "app_user_runtime_all" on %s', t.tbl);
    execute format(
      'create policy "app_user_runtime_all" on %s to app_user using (true) with check (true)',
      t.tbl);
  end loop;
end
$$;

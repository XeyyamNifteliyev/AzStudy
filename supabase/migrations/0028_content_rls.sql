-- 0028_content_rls.sql — Supabase only (policies reference anon/authenticated roles).
--
-- The content tables (0011) and admin_allowlist (0025) / leads_dl (0020) were
-- created without RLS. On hosted Supabase the default privileges grant
-- anon/authenticated full table access via PostgREST, so an anon API request
-- could otherwise INSERT/UPDATE/DELETE public catalog rows.
--
-- Model:
--   - Content catalog tables are public read-only: SELECT policy for
--     anon/authenticated, no write policies (writes go through the app's
--     owner/service-role connection only).
--   - admin_allowlist, leads_dl, schema_migrations: RLS enabled with NO
--     policies — completely locked from the API surface.
--   - app_user (0026) keeps full runtime access via explicit policies so the
--     least-privilege role is unaffected.

alter table public.countries          enable row level security;
alter table public.cities             enable row level security;
alter table public.program_categories enable row level security;
alter table public.programs           enable row level security;
alter table public.universities       enable row level security;
alter table public.university_programs enable row level security;
alter table public.scholarships       enable row level security;
alter table public.dormitories        enable row level security;
alter table public.reviews            enable row level security;
alter table public.faqs               enable row level security;
alter table public.blog_posts         enable row level security;
alter table public.admin_allowlist    enable row level security;
alter table public.leads_dl           enable row level security;

-- Public catalog read (matches the public website rendering this data).
drop policy if exists "content_public_read" on public.countries;
create policy "content_public_read" on public.countries
  for select to anon, authenticated using (true);

drop policy if exists "content_public_read" on public.cities;
create policy "content_public_read" on public.cities
  for select to anon, authenticated using (true);

drop policy if exists "content_public_read" on public.program_categories;
create policy "content_public_read" on public.program_categories
  for select to anon, authenticated using (true);

drop policy if exists "content_public_read" on public.programs;
create policy "content_public_read" on public.programs
  for select to anon, authenticated using (true);

drop policy if exists "content_public_read" on public.universities;
create policy "content_public_read" on public.universities
  for select to anon, authenticated using (true);

drop policy if exists "content_public_read" on public.university_programs;
create policy "content_public_read" on public.university_programs
  for select to anon, authenticated using (true);

drop policy if exists "content_public_read" on public.scholarships;
create policy "content_public_read" on public.scholarships
  for select to anon, authenticated using (true);

drop policy if exists "content_public_read" on public.dormitories;
create policy "content_public_read" on public.dormitories
  for select to anon, authenticated using (true);

drop policy if exists "content_public_read" on public.reviews;
create policy "content_public_read" on public.reviews
  for select to anon, authenticated using (true);

drop policy if exists "content_public_read" on public.faqs;
create policy "content_public_read" on public.faqs
  for select to anon, authenticated using (true);

drop policy if exists "content_public_read" on public.blog_posts;
create policy "content_public_read" on public.blog_posts
  for select to anon, authenticated using (true);

-- App migration ledger (created by scripts/migrate.ts on first run). Lock it
-- from the API surface the same way.
create table if not exists public.schema_migrations (
  filename  text primary key,
  checksum  text not null default '',
  applied_at timestamptz not null default now()
);
alter table public.schema_migrations enable row level security;

-- Keep the least-privilege app_user role (0026) working on the tables that
-- only now got RLS — the 0026 loop ran before these tables were RLS-enabled.
do $$
declare t record;
begin
  if exists (select 1 from pg_roles where rolname = 'app_user') then
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
  end if;
end
$$;

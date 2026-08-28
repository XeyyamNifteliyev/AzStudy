-- 0005_rls.sql — enable ONLY on Supabase (auth.uid() exists). Local dev skips this file.
create or replace function public.is_staff()
returns boolean language sql security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','consultant','editor'));
$$;

create or replace function public.is_admin()
returns boolean language sql security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

alter table public.profiles              enable row level security;
alter table public.leads                 enable row level security;
alter table public.applications          enable row level security;
alter table public.application_documents enable row level security;
alter table public.audit_logs            enable row level security;

drop policy if exists "profiles_read"  on public.profiles;
create policy "profiles_read"  on public.profiles for select using (id = auth.uid() or public.is_staff());

drop policy if exists "profiles_update" on public.profiles;
create policy "profiles_update" on public.profiles for update using (id = auth.uid() or public.is_admin());

drop policy if exists "leads_read" on public.leads;
create policy "leads_read" on public.leads for select
  using (user_id = auth.uid() or assigned_consultant_id = auth.uid() or public.is_staff());

drop policy if exists "leads_write" on public.leads;
create policy "leads_write" on public.leads for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "apps_read" on public.applications;
create policy "apps_read" on public.applications for select
  using (assigned_consultant_id = auth.uid() or public.is_staff()
         or lead_id in (select id from public.leads where user_id = auth.uid()));

drop policy if exists "apps_write" on public.applications;
create policy "apps_write" on public.applications for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "docs_read" on public.application_documents;
create policy "docs_read" on public.application_documents for select
  using (public.is_staff() or application_id in (
    select a.id from public.applications a
    join public.leads l on l.id = a.lead_id where l.user_id = auth.uid()));

drop policy if exists "docs_write" on public.application_documents;
create policy "docs_write" on public.application_documents for all
  using (public.is_staff()) with check (public.is_staff());

drop policy if exists "audit_read" on public.audit_logs;
create policy "audit_read" on public.audit_logs for select using (public.is_admin());

-- messages RLS moved to 0029_messages_rls.sql: this file runs before the
-- messages table exists (created in 0008), so enabling RLS on it here fails
-- on a fresh Supabase project.

-- 0031_performance_rls_hardening.sql — Supabase only. Round 2 of the advisor
-- remediations (security + performance):
--
-- SECURITY
--   Revoking EXECUTE from `anon` alone was ineffective: functions keep their
--   default PUBLIC grant and anon inherits it. Fix properly:
--     - revoke EXECUTE from PUBLIC on all SECURITY DEFINER helpers
--     - re-grant only where legitimately needed:
--         is_staff / is_admin / prevent_self_role_change → authenticated
--         (evaluated inside RLS policies and the profiles trigger as the
--         signed-in user)
--         handle_new_user → supabase_auth_admin (auth signup trigger)
--
-- PERFORMANCE
--   1. auth_rls_initplan: wrap auth.uid() as `(select auth.uid())` so the JWT
--      claim is read once per statement (init plan) instead of per row.
--   2. multiple_permissive_policies: the per-operation policies had no TO
--      clause (= PUBLIC), so they overlapped with app_user_runtime_all for the
--      app_user role. Recreate them `to authenticated` — same behavior for
--      signed-in users (anon was already implicitly denied by auth.uid()),
--      no policy overlap for app_user.
--   3. is_staff()/is_admin() marked STABLE — pure SELECTs, lets the planner
--      cache them inside a statement.
--   4. unindexed_foreign_keys: covering indexes for application_documents
--      .uploaded_by, applications.assigned_consultant_id, cities.country_code.
--   5. duplicate_index: admin_allowlist_email_idx duplicates the pkey.

-- ── SECURITY: close the PUBLIC execute surface ─────────────────────────────
revoke execute on function public.handle_new_user() from public;
revoke execute on function public.rls_auto_enable() from public;
revoke execute on function public.is_staff() from public;
revoke execute on function public.is_admin() from public;
revoke execute on function public.prevent_self_role_change() from public;

grant execute on function public.is_staff() to authenticated;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.prevent_self_role_change() to authenticated;
grant execute on function public.handle_new_user() to supabase_auth_admin;

-- ── PERFORMANCE: planner-friendly helpers ──────────────────────────────────
alter function public.is_staff() stable;
alter function public.is_admin() stable;

-- ── profiles ────────────────────────────────────────────────────────────────
drop policy if exists "profiles_read" on public.profiles;
create policy "profiles_read" on public.profiles
  for select to authenticated
  using (id = (select auth.uid()) or (select public.is_staff()));

drop policy if exists "profiles_update" on public.profiles;
create policy "profiles_update" on public.profiles
  for update to authenticated
  using (id = (select auth.uid()) or (select public.is_admin()))
  with check (id = (select auth.uid()) or (select public.is_admin()));

-- ── leads ───────────────────────────────────────────────────────────────────
drop policy if exists "leads_read" on public.leads;
create policy "leads_read" on public.leads
  for select to authenticated
  using (
    user_id = (select auth.uid())
    or assigned_consultant_id = (select auth.uid())
    or (select public.is_staff())
  );

drop policy if exists "leads_insert" on public.leads;
create policy "leads_insert" on public.leads
  for insert to authenticated
  with check ((select public.is_admin()) or user_id = (select auth.uid()));

drop policy if exists "leads_update" on public.leads;
create policy "leads_update" on public.leads
  for update to authenticated
  using (
    user_id = (select auth.uid())
    or assigned_consultant_id = (select auth.uid())
    or (select public.is_admin())
  )
  with check (
    user_id = (select auth.uid())
    or assigned_consultant_id = (select auth.uid())
    or (select public.is_admin())
  );

drop policy if exists "leads_delete" on public.leads;
create policy "leads_delete" on public.leads
  for delete to authenticated
  using ((select public.is_admin()));

-- ── applications ────────────────────────────────────────────────────────────
drop policy if exists "apps_read" on public.applications;
create policy "apps_read" on public.applications
  for select to authenticated
  using (
    assigned_consultant_id = (select auth.uid())
    or (select public.is_staff())
    or lead_id in (select id from public.leads where user_id = (select auth.uid()))
  );

drop policy if exists "apps_insert" on public.applications;
create policy "apps_insert" on public.applications
  for insert to authenticated
  with check ((select public.is_admin()));

drop policy if exists "apps_update" on public.applications;
create policy "apps_update" on public.applications
  for update to authenticated
  using (assigned_consultant_id = (select auth.uid()) or (select public.is_admin()))
  with check (assigned_consultant_id = (select auth.uid()) or (select public.is_admin()));

drop policy if exists "apps_delete" on public.applications;
create policy "apps_delete" on public.applications
  for delete to authenticated
  using ((select public.is_admin()));

-- ── application_documents ───────────────────────────────────────────────────
drop policy if exists "docs_read" on public.application_documents;
create policy "docs_read" on public.application_documents
  for select to authenticated
  using (
    (select public.is_staff())
    or application_id in (
      select a.id from public.applications a
      join public.leads l on l.id = a.lead_id
      where l.user_id = (select auth.uid()))
  );

drop policy if exists "docs_insert" on public.application_documents;
create policy "docs_insert" on public.application_documents
  for insert to authenticated
  with check ((select public.is_admin()));

drop policy if exists "docs_update" on public.application_documents;
create policy "docs_update" on public.application_documents
  for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists "docs_delete" on public.application_documents;
create policy "docs_delete" on public.application_documents
  for delete to authenticated
  using ((select public.is_admin()));

-- ── messages ────────────────────────────────────────────────────────────────
drop policy if exists "messages_read" on public.messages;
create policy "messages_read" on public.messages
  for select to authenticated
  using (
    exists (select 1 from public.leads l where l.id = messages.lead_id
            and (l.user_id = (select auth.uid()) or l.assigned_consultant_id = (select auth.uid())))
  );

drop policy if exists "messages_insert" on public.messages;
create policy "messages_insert" on public.messages
  for insert to authenticated
  with check (
    sender_id = (select auth.uid())
    and exists (select 1 from public.leads l where l.id = messages.lead_id
            and (l.user_id = (select auth.uid()) or l.assigned_consultant_id = (select auth.uid())))
  );

-- ── audit_logs ──────────────────────────────────────────────────────────────
drop policy if exists "audit_read" on public.audit_logs;
create policy "audit_read" on public.audit_logs
  for select to authenticated
  using ((select public.is_admin()));

-- ── unindexed foreign keys ──────────────────────────────────────────────────
create index if not exists idx_docs_uploaded_by  on public.application_documents(uploaded_by);
create index if not exists idx_apps_consultant   on public.applications(assigned_consultant_id);
create index if not exists idx_cities_country    on public.cities(country_code);

-- ── duplicate index ─────────────────────────────────────────────────────────
drop index if exists public.admin_allowlist_email_idx;

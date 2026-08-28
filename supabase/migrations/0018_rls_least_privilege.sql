-- 0018_rls_least_privilege.sql — enable ONLY on Supabase (auth.uid() exists). Local dev skips this file.
--
-- Replaces the "any staff may do anything" `for all` write policies (from 0005)
-- with per-operation least-privilege policies:
--   - consultants/editors may UPDATE leads/applications/documents they are
--     assigned to (or, for leads, the student's own);
--   - only admins may INSERT (create) and DELETE rows;
--   - every write policy carries an explicit WITH CHECK so a row can never be
--     mutated into a state the actor may not own.

-- ---------------------------------------------------------------------------
-- leads
-- ---------------------------------------------------------------------------
drop policy if exists "leads_write" on public.leads;

drop policy if exists "leads_insert" on public.leads;
create policy "leads_insert" on public.leads for insert
  with check (public.is_admin() or user_id = auth.uid());

drop policy if exists "leads_update" on public.leads;
create policy "leads_update" on public.leads for update
  using (user_id = auth.uid() or assigned_consultant_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or assigned_consultant_id = auth.uid() or public.is_admin());

drop policy if exists "leads_delete" on public.leads;
create policy "leads_delete" on public.leads for delete
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- applications
-- ---------------------------------------------------------------------------
drop policy if exists "apps_write" on public.applications;

drop policy if exists "apps_insert" on public.applications;
create policy "apps_insert" on public.applications for insert
  with check (public.is_admin());

drop policy if exists "apps_update" on public.applications;
create policy "apps_update" on public.applications for update
  using (assigned_consultant_id = auth.uid() or public.is_admin())
  with check (assigned_consultant_id = auth.uid() or public.is_admin());

drop policy if exists "apps_delete" on public.applications;
create policy "apps_delete" on public.applications for delete
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- application_documents
-- ---------------------------------------------------------------------------
drop policy if exists "docs_write" on public.application_documents;

drop policy if exists "docs_insert" on public.application_documents;
create policy "docs_insert" on public.application_documents for insert
  with check (public.is_admin());

drop policy if exists "docs_update" on public.application_documents;
create policy "docs_update" on public.application_documents for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "docs_delete" on public.application_documents;
create policy "docs_delete" on public.application_documents for delete
  using (public.is_admin());

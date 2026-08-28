-- 0027_apply_documents_bucket_policies.sql — Supabase only.
--
-- Defense-in-depth for the `apply-documents` bucket (passports, diplomas,
-- photos uploaded from the public Apply form). Today every write goes through
-- the service-role key (RLS-exempt) and reads are staff-only via
-- "apply_docs_read_staff" (0021). These extra policies are a second barrier:
--
--   - Explicitly deny anonymous SELECT/INSERT — the default is deny, but an
--     explicit `using (false)` policy keeps that guarantee even if someone
--     later flips the bucket to `public` or adds a broad policy.
--   - Allow authenticated staff to INSERT/UPDATE/DELETE — mirrors the read
--     policy so a future code path that switches from service-role to the
--     authenticated role (e.g. server-issued signed-upload tokens) cannot
--     accidentally widen access: only staff may write, and never anonymous.
--
-- Paths in this bucket are NOT user-prefixed (uploads happen before an
-- account exists), so an `auth.uid()` path check is impossible by design;
-- staff-only + explicit anonymous denial is the correct model.

-- Anonymous users: no read, no write — ever.
drop policy if exists "apply_docs_no_anon_read" on storage.objects;
create policy "apply_docs_no_anon_read" on storage.objects
  for select to anon
  using (false);

drop policy if exists "apply_docs_no_anon_insert" on storage.objects;
create policy "apply_docs_no_anon_insert" on storage.objects
  for insert to anon
  with check (false);

-- Staff may write objects into the bucket (mirrors apply_docs_read_staff).
drop policy if exists "apply_docs_write_staff" on storage.objects;
create policy "apply_docs_write_staff" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'apply-documents' and public.is_staff());

drop policy if exists "apply_docs_update_staff" on storage.objects;
create policy "apply_docs_update_staff" on storage.objects
  for update to authenticated
  using (bucket_id = 'apply-documents' and public.is_staff())
  with check (bucket_id = 'apply-documents' and public.is_staff());

drop policy if exists "apply_docs_delete_staff" on storage.objects;
create policy "apply_docs_delete_staff" on storage.objects
  for delete to authenticated
  using (bucket_id = 'apply-documents' and public.is_staff());

-- 0021_apply_documents_bucket.sql — Supabase only.
-- SEC-3: the public Apply form uploads documents (passport/diploma/photo)
-- BEFORE a lead/student profile exists, so it cannot use the auth-scoped
-- `application-documents` bucket (0009, which keys on auth.uid()). This
-- creates the separate private `apply-documents` bucket the upload action
-- targets. Uploads run server-side with the service-role key (bypasses RLS),
-- so no write policy is needed; reads stay staff-only via signed URLs issued
-- by the service role.
insert into storage.buckets (id, name, public)
values ('apply-documents', 'apply-documents', false)
on conflict (id) do nothing;

-- Staff may read apply-documents (to review uploaded passport/diploma/etc.).
-- Writes are performed by the service role (RLS-exempt), so no insert policy.
drop policy if exists "apply_docs_read_staff" on storage.objects;
create policy "apply_docs_read_staff" on storage.objects
  for select to authenticated
  using (bucket_id = 'apply-documents' and public.is_staff());

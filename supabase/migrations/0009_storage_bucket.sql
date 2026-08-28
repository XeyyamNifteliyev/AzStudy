-- 0009_storage_bucket.sql — Supabase only. Creates the private bucket for student documents.
insert into storage.buckets (id, name, public)
values ('application-documents', 'application-documents', false)
on conflict (id) do nothing;

-- Student may write objects only under their own prefix: "<userId>/..."
drop policy if exists "docs_storage_write" on storage.objects;
create policy "docs_storage_write" on storage.objects for insert to authenticated with check (
  bucket_id = 'application-documents'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Student reads own prefix; staff reads all.
drop policy if exists "docs_storage_read" on storage.objects;
create policy "docs_storage_read" on storage.objects for select to authenticated using (
  bucket_id = 'application-documents'
  and ((storage.foldername(name))[1] = auth.uid()::text or public.is_staff())
);

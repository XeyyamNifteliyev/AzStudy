-- 0010_profiles_auth_uid.sql  (lokal + Supabase)
alter table public.profiles add column if not exists auth_uid uuid;
create unique index if not exists profiles_auth_uid_uniq
  on public.profiles (auth_uid) where auth_uid is not null;

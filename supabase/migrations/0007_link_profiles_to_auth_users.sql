-- 0007_link_profiles_to_auth_users.sql
-- ⚠️ DO NOT run this yet. This is for Phase 2B (real Supabase Auth), not Phase 2A (dev-auth).
--
-- Run this manually in the Supabase SQL editor ONLY after:
--   1. Real Supabase Auth (OTP / Google / Apple sign-in) is wired into the app, and
--   2. Every row in public.profiles corresponds to a real row in auth.users
--      (i.e. the demo/seed profiles from supabase/seed.sql have been replaced or
--      backfilled with real signed-up users).
--
-- Running it earlier will fail with a foreign_key_violation, because the demo profiles
-- (fixed UUIDs from seed.sql) have no matching auth.users row.

alter table public.profiles drop constraint if exists profiles_id_fkey;
alter table public.profiles
  add constraint profiles_id_fkey
  foreign key (id) references auth.users(id) on delete cascade;

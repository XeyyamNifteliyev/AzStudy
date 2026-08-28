-- 0025_admin_allowlist.sql — SEC: explicit admin sign-in allowlist.
-- Only emails present in this table may ever resolve a staff/admin session via
-- Supabase OAuth. An admin manages the list from /admin/users; the configured
-- INITIAL_ADMIN_EMAIL is inserted here on first bootstrap so there is always a
-- bootstrap path. The role itself still lives on profiles.role.

create table if not exists public.admin_allowlist (
  email      text primary key,
  created_at timestamptz not null default now()
);

-- Fast, index-backed email membership check during session resolution.
-- (email is the PK, so this is redundant but documents intent + keeps the
-- table scan-free if it is ever queried by a non-unique column later.)
create unique index if not exists admin_allowlist_email_idx
  on public.admin_allowlist(email);

-- 0002_tables.sql
create table if not exists public.profiles (
  id           uuid primary key default gen_random_uuid(),
  email        text not null unique,
  full_name    text not null default '',
  role         user_role not null default 'student',
  phone        text,
  whatsapp     text,
  country_code text,
  avatar_url   text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- NOTE: profiles.id is intentionally NOT foreign-keyed to auth.users yet, even on real
-- Supabase projects. This phase (2A) uses a dev-auth placeholder with hand-seeded demo
-- profiles that have no matching auth.users row — a hard FK would make seed.sql fail with
-- a foreign_key_violation. Once real Supabase Auth is wired up (phase 2B) and every profile
-- corresponds to a real signed-up user, run `0007_link_profiles_to_auth_users.sql` to add
-- the FK retroactively.

create table if not exists public.leads (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references public.profiles(id) on delete cascade,
  university_id         text not null,
  program_id            text,
  status                lead_status not null default 'new',
  source                text not null default 'website',
  assigned_consultant_id uuid references public.profiles(id) on delete set null,
  notes                 text not null default '',
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create table if not exists public.applications (
  id                     uuid primary key default gen_random_uuid(),
  lead_id                uuid not null references public.leads(id) on delete cascade,
  university_id          text not null,
  program_id             text,
  status                 application_status not null default 'draft',
  assigned_consultant_id uuid references public.profiles(id) on delete set null,
  notes                  text not null default '',
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

create table if not exists public.application_documents (
  id             uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  file_name      text not null,
  file_url       text not null,
  mime_type      text,
  size_bytes     bigint,
  verified       boolean not null default false,
  uploaded_by    uuid references public.profiles(id) on delete set null,
  created_at     timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references public.profiles(id) on delete set null,
  action     text not null,
  entity     text not null,
  entity_id  uuid,
  metadata   jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

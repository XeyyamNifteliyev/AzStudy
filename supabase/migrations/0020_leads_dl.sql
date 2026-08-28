-- 0020_leads_dl.sql — dead-letter table for leads that failed to capture.
-- SEC-1: a transient CRM error must NEVER silently drop a paying-intent lead.
-- Failed submissions are persisted here so they can be replayed / alerted on.
-- Runs locally + on Supabase (plain table, no RLS/auth dependency).
create table if not exists public.leads_dl (
  id          uuid primary key default gen_random_uuid(),
  payload     jsonb not null,
  error       text,
  created_at  timestamptz not null default now(),
  replayed_at timestamptz
);

create index if not exists leads_dl_created_idx on public.leads_dl(created_at);
-- Unreplayed rows first — cheap cron/alert scan.
create index if not exists leads_dl_unreplayed_idx on public.leads_dl(created_at)
  where replayed_at is null;

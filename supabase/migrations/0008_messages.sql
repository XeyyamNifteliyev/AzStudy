-- 0008_messages.sql  (runs locally + on Supabase — table + index only; RLS is in 0005_rls.sql)
create table if not exists public.messages (
  id         uuid primary key default gen_random_uuid(),
  lead_id    uuid not null references public.leads(id) on delete cascade,
  sender_id  uuid not null references public.profiles(id) on delete cascade,
  body       text not null check (length(trim(body)) > 0),
  created_at timestamptz not null default now(),
  read_at    timestamptz
);

create index if not exists messages_lead_created_idx on public.messages(lead_id, created_at);

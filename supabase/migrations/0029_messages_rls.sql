-- 0029_messages_rls.sql — Supabase only. RLS for public.messages (Phase 2C).
-- Moved out of 0005_rls.sql: 0005 runs before the table is created (0008),
-- so applying migrations in filename order on a fresh Supabase project
-- failed at `alter table public.messages enable row level security`.

alter table public.messages enable row level security;

drop policy if exists "messages_read" on public.messages;
create policy "messages_read" on public.messages for select using (
  exists (select 1 from public.leads l where l.id = messages.lead_id
          and (l.user_id = auth.uid() or l.assigned_consultant_id = auth.uid()))
);

drop policy if exists "messages_insert" on public.messages;
create policy "messages_insert" on public.messages for insert with check (
  sender_id = auth.uid()
  and exists (select 1 from public.leads l where l.id = messages.lead_id
          and (l.user_id = auth.uid() or l.assigned_consultant_id = auth.uid()))
);

-- Keep the least-privilege app_user role (0026) working on messages too.
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'app_user') then
    drop policy if exists "app_user_runtime_all" on public.messages;
    create policy "app_user_runtime_all" on public.messages
      to app_user using (true) with check (true);
  end if;
end
$$;

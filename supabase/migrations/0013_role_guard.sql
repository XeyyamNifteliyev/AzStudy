-- 0013_role_guard.sql — Supabase only (uses auth.uid() / is_admin()).
-- Closes the column-level privilege-escalation hole in profiles_update (0005):
-- the UPDATE policy had no WITH CHECK, so a user could set role='admin' on
-- their own row via the public REST API (anon key + own JWT).
--
-- This trigger blocks role changes by non-admin *authenticated* sessions while
-- still allowing the trusted app path: the app connects with the service-role
-- key / superuser, where auth.uid() is NULL, so those updates pass through.
create or replace function public.prevent_self_role_change()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  acting_uid uuid;
begin
  acting_uid := auth.uid();
  -- No auth context = privileged/service-role connection (trusted app path). Allow.
  if acting_uid is null then
    return new;
  end if;
  -- A real user session is changing a role. Only an admin may do this.
  if new.role <> old.role and not public.is_admin() then
    raise exception 'role change requires admin';
  end if;
  return new;
end; $$;

drop trigger if exists profiles_role_guard on public.profiles;
create trigger profiles_role_guard before update on public.profiles
  for each row execute function public.prevent_self_role_change();

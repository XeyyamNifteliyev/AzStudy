-- 0030_security_advisor_fixes.sql — Supabase only. Remediations for the
-- Supabase security advisor lints after the initial schema deploy:
--
--   1. Function search path mutable  → pin search_path on the four trigger
--      functions that lacked it (set_updated_at, universities_tsv_update,
--      universities_updated_at, blog_posts_updated_at).
--   2. Extension in public schema    → relocate pg_trgm into `extensions`.
--      pg_trgm is relocatable, so existing GIN indexes keep working (they
--      reference the opclass by OID); Supabase's default search_path already
--      contains `extensions`, so unqualified gin_trgm_ops still resolves.
--   3. anon/authenticated can EXECUTE SECURITY DEFINER helpers via
--      /rest/v1/rpc → revoke where the role never legitimately calls them:
--        - handle_new_user: only the auth trigger (supabase_auth_admin) calls
--          it; anon/authenticated never should → revoke from both.
--        - rls_auto_enable: Supabase-managed event trigger, system-invoked →
--          revoke from both (event-trigger invocation ignores EXECUTE grants).
--        - is_staff / is_admin / prevent_self_role_change: referenced by RLS
--          policies and triggers evaluated AS the authenticated user → keep
--          EXECUTE for `authenticated`, revoke from `anon` only.

-- 1) Pin search_path on trigger functions.
alter function public.set_updated_at() set search_path = public;
alter function public.universities_tsv_update() set search_path = public;
alter function public.universities_updated_at() set search_path = public;
alter function public.blog_posts_updated_at() set search_path = public;

-- 2) Relocate pg_trgm out of public (advisor: extension_in_public).
do $$
begin
  alter extension pg_trgm set schema extensions;
exception
  when others then
    raise log '0030: could not relocate pg_trgm (%)', sqlerrm;
end
$$;

-- 3) Close the RPC surface on SECURITY DEFINER helpers.
revoke execute on function public.handle_new_user() from anon, authenticated;
revoke execute on function public.rls_auto_enable() from anon, authenticated;

revoke execute on function public.is_staff() from anon;
revoke execute on function public.is_admin() from anon;
revoke execute on function public.prevent_self_role_change() from anon;

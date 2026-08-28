-- 0034_function_search_paths.sql
-- Security advisor fix: pin `search_path` on trigger/helper functions so a
-- role-mutable search path can't be abused to shadow objects
-- (https://supabase.com/docs/guides/database/database-linter?lint=0011).
-- Note: is_admin/is_staff/prevent_self_role_change EXECUTE-by-authenticated
-- warnings are intentionally left as-is — RLS policies invoke these helpers.

alter function public.universities_updated_at() set search_path = '';
alter function public.blog_posts_updated_at() set search_path = '';
alter function public.set_updated_at() set search_path = '';
alter function public.universities_tsv_update() set search_path = '';

-- 0032_language_constraint_fix.sql — Supabase + local (plain DDL, no auth deps).
-- 0019's up_language_check only allowed ('tr','en','ar','ru'), but the app's
-- InstructionLanguage type (src/types/index.ts) and the actual seed catalog
-- include 'az' (Azerbaijani-taught programs). Align the constraint with the
-- application's supported languages so seeding/inserts don't fail.
alter table public.university_programs
  drop constraint if exists up_language_check;
alter table public.university_programs
  add constraint up_language_check
  check (language in ('tr', 'en', 'ar', 'ru', 'az'));

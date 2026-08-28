-- 0019_data_constraints.sql
-- Data integrity CHECK constraints (audit findings M6/M14).
-- Safe on both local and Supabase Postgres.

-- Reviews: rating must be 1..5 (UI renders 5 stars).
alter table public.reviews
  drop constraint if exists reviews_rating_check;
alter table public.reviews
  add constraint reviews_rating_check check (rating between 1 and 5);

-- Tuition must not be negative (min-tuition logic filters tuition_fee > 0).
alter table public.university_programs
  drop constraint if exists up_tuition_fee_check;
alter table public.university_programs
  add constraint up_tuition_fee_check check (tuition_fee >= 0);

-- Original fee, when present, must exceed the discounted fee.
alter table public.university_programs
  drop constraint if exists up_original_fee_check;
alter table public.university_programs
  add constraint up_original_fee_check check (original_fee is null or original_fee > tuition_fee);

-- Language must be one of the supported instruction languages
-- (matches the InstructionLanguage union: tr/en/ar/ru/az).
alter table public.university_programs
  drop constraint if exists up_language_check;
alter table public.university_programs
  add constraint up_language_check check (language in ('tr', 'en', 'ar', 'ru', 'az'));

-- Degree level must be one of the supported levels (typed union in TS).
alter table public.programs
  drop constraint if exists programs_degree_level_check;
alter table public.programs
  add constraint programs_degree_level_check check (degree_level in ('associate', 'bachelor', 'master', 'phd'));

-- Currency must be one of the supported currencies.
alter table public.university_programs
  drop constraint if exists up_currency_check;
alter table public.university_programs
  add constraint up_currency_check check (currency in ('USD', 'TRY'));


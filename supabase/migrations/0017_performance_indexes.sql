-- 0017_performance_indexes.sql
-- Indexes for the hot filter/order columns used by the program listing and
-- university filters (audit finding B2). These are safe on both local and
-- Supabase Postgres.

-- Program listing filters on category_slug (buildProgramListingWhere).
create index if not exists programs_category_slug_idx
  on public.programs (category_slug);

-- Pagination orders by tuition_fee (listPage / getAllPrograms / getByCategory).
create index if not exists up_tuition_fee_idx
  on public.university_programs (tuition_fee);

-- Compound for the most common listing path: filter by program, order by fee.
create index if not exists up_program_tuition_idx
  on public.university_programs (program_id, tuition_fee);

-- University language filter uses `any(u.languages)` on a text[] column — a
-- GIN index makes that a bitmap index scan instead of a seq scan.
create index if not exists universities_languages_gin_idx
  on public.universities using gin (languages);

-- getRelated orders by ranking.
create index if not exists universities_ranking_idx
  on public.universities (ranking);

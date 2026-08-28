-- 0015_studyleo_catalog.sql
-- StudyLeo catalog: add discounted/original fee pair to university_programs.
-- `tuition_fee` remains the discounted (scholarship) price; `original_fee`
-- holds the list price when a discount exists, NULL otherwise.
alter table public.university_programs
  add column if not exists original_fee numeric(12,2);

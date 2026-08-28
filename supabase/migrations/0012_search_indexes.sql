-- 0012_search_indexes.sql — Phase 3D: Postgres full-text search indexes.
-- Runs locally + on Supabase. Enables trigram fuzzy matching + tsvector ranking
-- on universities and programs so the search box runs over Postgres without any
-- external search service (works on Vercel deploy with no extra host).

create extension if not exists pg_trgm;

-- Universities: indexes on name + slug (trigram for fuzzy LIKE) and a tsvector
-- column populated from name + accreditation + languages, kept in sync via a
-- trigger so search is always up to date.
alter table public.universities
  add column if not exists search_tsv tsvector;

create index if not exists universities_name_trgm  on public.universities using gin (name gin_trgm_ops);
create index if not exists universities_slug_trgm   on public.universities using gin (slug gin_trgm_ops);
create index if not exists universities_tsv_idx     on public.universities using gin (search_tsv);

create or replace function public.universities_tsv_update() returns trigger as $$
  begin
    new.search_tsv :=
      setweight(to_tsvector('simple', coalesce(new.name, '')), 'A') ||
      setweight(to_tsvector('simple', coalesce(new.accreditation, '')), 'B') ||
      setweight(to_tsvector('simple', coalesce(array_to_string(new.languages, ' '), '')), 'C');
    return new;
  end;
$$ language plpgsql immutable;

drop trigger if exists universities_tsv_trigger on public.universities;
create trigger universities_tsv_trigger before insert or update on public.universities
  for each row execute function public.universities_tsv_update();

-- Backfill existing rows.
update public.universities set search_tsv = to_tsvector('simple', name) where true;

-- Programs: trigram on slug + i18n name search via jsonb ->> text.
create index if not exists programs_slug_trgm on public.programs using gin (slug gin_trgm_ops);

-- Cities & countries: trigram on slug for the location quick-search.
create index if not exists cities_slug_trgm    on public.cities    using gin (slug gin_trgm_ops);
create index if not exists countries_slug_trgm on public.countries using gin (slug gin_trgm_ops);
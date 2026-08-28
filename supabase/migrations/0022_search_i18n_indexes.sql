-- 0022_search_i18n_indexes.sql — expression GIN indexes for i18n search
-- BE-5: the search repository matches `p.name_i18n::text ilike '%q%'` and
-- `c.name_i18n::text ilike '%q%'`. A plain trigram index on a jsonb::text cast
-- can't serve that — but indexing the cast expression can (GIN trigram over
-- the text rendering of the localized names).

-- Programs: index the jsonb::text rendering of name_i18n.
create index if not exists programs_name_i18n_trgm
  on public.programs using gin ((name_i18n::text) gin_trgm_ops);

-- Cities: index the jsonb::text rendering of name_i18n.
create index if not exists cities_name_i18n_trgm
  on public.cities using gin ((name_i18n::text) gin_trgm_ops);

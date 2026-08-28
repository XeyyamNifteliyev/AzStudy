-- 0011_content_tables.sql — Phase 3B: content tables moved from in-memory seed to DB.
-- LocalizedString → jsonb column (`*_i18n`); IDs are text (stable seed IDs from src/lib/seed).

create table if not exists public.countries (
  code       text primary key,
  slug       text not null unique,
  name_i18n  jsonb not null default '{}'::jsonb,
  flag       text not null default ''
);

create table if not exists public.cities (
  id           text primary key,
  slug         text not null unique,
  country_code text not null references public.countries(code) on delete cascade,
  name_i18n    jsonb not null default '{}'::jsonb
);

create table if not exists public.program_categories (
  slug       text primary key,
  name_i18n  jsonb not null default '{}'::jsonb,
  icon       text
);

create table if not exists public.programs (
  id             text primary key,
  slug           text not null unique,
  name_i18n      jsonb not null default '{}'::jsonb,
  degree_level   text not null,
  category_slug  text not null references public.program_categories(slug) on delete cascade,
  duration_years int not null
);

create table if not exists public.universities (
  id               text primary key,
  slug             text not null unique,
  city_id          text not null references public.cities(id) on delete cascade,
  name             text not null,
  founded_year     int not null,
  student_count    int not null,
  ranking          int not null,
  accreditation    text not null default '',
  is_state         boolean not null default true,
  logo_text        text not null default '',
  hero_image       text not null default '',
  gallery          text[] not null default '{}',
  tagline_i18n     jsonb not null default '{}'::jsonb,
  description_i18n jsonb not null default '{}'::jsonb,
  languages        text[] not null default '{}',
  featured         boolean not null default false
);

create table if not exists public.university_programs (
  id                    text primary key,
  university_id         text not null references public.universities(id) on delete cascade,
  program_id            text not null references public.programs(id) on delete cascade,
  language              text not null,
  tuition_fee           numeric(12,2) not null,
  currency              text not null default 'USD',
  scholarship_available boolean not null default false
);

create table if not exists public.scholarships (
  id                text primary key,
  university_id     text not null references public.universities(id) on delete cascade,
  name_i18n         jsonb not null default '{}'::jsonb,
  percentage        int not null default 0,
  requirements_i18n jsonb not null default '{}'::jsonb
);

create table if not exists public.dormitories (
  id              text primary key,
  university_id   text not null references public.universities(id) on delete cascade,
  capacity        int not null default 0,
  price_per_month numeric(12,2) not null default 0,
  currency        text not null default 'USD',
  photos          text[] not null default '{}'
);

create table if not exists public.reviews (
  id                   text primary key,
  university_id        text not null references public.universities(id) on delete cascade,
  author_name          text not null,
  author_country       text not null default '',
  author_initials      text not null default '',
  rating               int not null,
  text_i18n            jsonb not null default '{}'::jsonb,
  verified             boolean not null default false,
  program_studied_i18n jsonb not null default '{}'::jsonb,
  year                 int not null
);

create table if not exists public.faqs (
  id            text primary key,
  entity_type   text not null,
  entity_id     text not null default '',
  question_i18n jsonb not null default '{}'::jsonb,
  answer_i18n   jsonb not null default '{}'::jsonb
);

create table if not exists public.blog_posts (
  id              text primary key,
  slug            text not null unique,
  title_i18n      jsonb not null default '{}'::jsonb,
  excerpt_i18n    jsonb not null default '{}'::jsonb,
  content_i18n    jsonb not null default '{}'::jsonb,
  author          text not null,
  published_at    text not null,
  cover_image     text not null default '',
  category_i18n   jsonb not null default '{}'::jsonb,
  reading_minutes int not null default 3
);

create index if not exists universities_city_idx     on public.universities(city_id);
create index if not exists universities_featured_idx on public.universities(featured);
create index if not exists up_university_idx         on public.university_programs(university_id);
create index if not exists up_program_idx           on public.university_programs(program_id);
create index if not exists reviews_university_idx    on public.reviews(university_id);
create index if not exists scholarships_university_idx on public.scholarships(university_id);
create index if not exists dormitories_university_idx on public.dormitories(university_id);
create index if not exists faqs_entity_idx          on public.faqs(entity_type, entity_id);
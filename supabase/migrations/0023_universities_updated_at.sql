-- 0023_universities_updated_at.sql — real `updated_at` for sitemap lastmod (SE-6)
-- Universities lacked any modification timestamp, so the sitemap had no
-- lastmod for university URLs. Add the column, auto-maintain it with a
-- trigger, and backfill existing rows.

alter table public.universities
  add column if not exists updated_at timestamptz not null default now();

create or replace function public.universities_updated_at() returns trigger as $$
  begin
    new.updated_at := now();
    return new;
  end;
$$ language plpgsql;

drop trigger if exists universities_updated_at_trigger on public.universities;
create trigger universities_updated_at_trigger before update on public.universities
  for each row execute function public.universities_updated_at();

-- Backfill: the `not null default now()` on the column above already fills
-- existing rows at ALTER time — no extra UPDATE needed.

-- SE-9: blog posts also lacked a modification timestamp; Article dateModified
-- was hardcoded to datePublished. Same treatment as universities.
alter table public.blog_posts
  add column if not exists updated_at timestamptz not null default now();

create or replace function public.blog_posts_updated_at() returns trigger as $$
  begin
    new.updated_at := now();
    return new;
  end;
$$ language plpgsql;

drop trigger if exists blog_posts_updated_at_trigger on public.blog_posts;
create trigger blog_posts_updated_at_trigger before update on public.blog_posts
  for each row execute function public.blog_posts_updated_at();

-- Backfill with the publish date where it parses as a timestamp; otherwise
-- the default now() stands (rows are only ever inserted once).
update public.blog_posts
  set updated_at = published_at::timestamptz
  where published_at ~ '^\d{4}-\d{2}-\d{2}T?\d{0,2}:?\d{0,2}' and published_at::timestamptz is not null;

# Phase 3B — Seed → DB Content Migration (Dizayn Sənədi)

> **Mənbə:** `faza3.md`, `Study.md` §7 (DB strukturu), `src/types/index.ts` (mövcud tiplər), `src/lib/data/repositories.ts` (`DataLayer` interfeysi), `src/lib/data/seed-repository.ts` (mövcud in-memory qatı).
> Bu sənəd **3B alt-sistemini** əhatə edir: məzmunu (universitet/proqram/şəhər/ölkə/bloq/review/faq/təqaüd/yataqxana) in-memory seed fayllarından Postgres cədvəllərinə köçürür, `DataLayer`-ın `pg` implementasiyasını təqdim edir və `src/lib/data/index.ts` flip nöqtəsini dəyişir.

---

## 0. Qərarlar

| Qərar | Seçim | Səbəb |
|---|---|---|
| Content cədvəllərin lokallasıdırılması | **jsonb sütun** (`name_i18n jsonb`) — ayrıca translations cədvəli yox | Read-heavy ISR; admin tərcümə paneli ayrı fazadır (YAGNI); query sadə |
| IDs | **text PK** (seed stable IDs qorunur: `u-bahcesehir`, `c-istanbul`, ...) | Seed reference bütövlüyü; FK-lar text-ə bağlanır |
| Seeder | **Yeni `scripts/seed-content.ts`** — `migrate.ts --seed`-dən sonra çağrılır | `db:reset` bir əmrlə həm CRM seed, həm content seed |
| Flip | ** PgLayer default** (DATABASE_URL varsa); seed-layer fallback-i qoru (məcburi deyil) | Lokalda DB həmişə işləyir (db:up); prod-da Supabase-a keçid ayrı iş |
| Mövcud seed repo | **Qalır** — seeder-ın mənbəyi + flip fallback; runtime-da istifadə olunmur | rollback təhlükəsizliyi (YAGNI deyil — bu seeding mənbəyidir) |
| `DataLayer` interfeysi | Dəyişmir — pg impl 1:1 uyğun gəlir | UI təsirsiz |

---

## 1. Məqsəd və Əhatə

### Daxildir
- **Yeni migration `0011_content_tables.sql`** — 11 content cədvəli + indekslər
- **Seeder `scripts/seed-content.ts`** — seed TS obyektlərini content cədvəllərinə insert edir; idempotent (truncate + insert)
- **`src/lib/data/pg-data-repository.ts`** — `DataLayer` interfeysinin pg implementasiyası (~10 alt-repo)
- **`src/lib/data/index.ts` flip** — DATABASE_URL varsa pg-layer, yoxsa seed-layer
- **Vitest** pg-data-repository testləri (seeded DB qarşı)

### Xaricdədir
- `translations` DB cədvəli + admin tərcümə paneli (növbəti fazalar)
- Mövcud CRM cədvəllərinə (`profiles`, `leads`, ...) UUID PK-ya keçid (onlar CRM layer-dır, qalır)
- Supabase-a data köçürülməsi — pg-layer lokal üçündür; Supabase-impl ayrı faza

---

## 2. Data Model — Content Cədvəlləri (`0011_content_tables.sql`)

```sql
create table if not exists public.countries (
  code       text primary key,
  slug       text not null unique,
  name_i18n  jsonb not null default '{}'::jsonb,
  flag       text not null default ''
);

create table if not exists public.cities (
  id          text primary key,
  slug        text not null unique,
  country_code text not null references public.countries(code) on delete cascade,
  name_i18n   jsonb not null default '{}'::jsonb
);

create table if not exists public.program_categories (
  slug       text primary key,
  name_i18n  jsonb not null default '{}'::jsonb,
  icon       text
);

create table if not exists public.programs (
  id              text primary key,
  slug            text not null unique,
  name_i18n       jsonb not null default '{}'::jsonb,
  degree_level    text not null,
  category_slug   text not null references public.program_categories(slug) on delete cascade,
  duration_years  int not null
);

create table if not exists public.universities (
  id                text primary key,
  slug              text not null unique,
  city_id           text not null references public.cities(id) on delete cascade,
  name              text not null,
  founded_year      int not null,
  student_count     int not null,
  ranking           int not null,
  accreditation     text not null default '',
  is_state          boolean not null default true,
  logo_text         text not null default '',
  hero_image        text not null default '',
  gallery           text[] not null default '{}',
  tagline_i18n      jsonb not null default '{}'::jsonb,
  description_i18n  jsonb not null default '{}'::jsonb,
  languages         text[] not null default '{}',
  featured          boolean not null default false
);

create table if not exists public.university_programs (
  id                   text primary key,
  university_id        text not null references public.universities(id) on delete cascade,
  program_id           text not null references public.programs(id) on delete cascade,
  language             text not null,
  tuition_fee          numeric(12,2) not null,
  currency             text not null default 'USD',
  scholarship_available boolean not null default false
);

create table if not exists public.scholarships (
  id                 text primary key,
  university_id      text not null references public.universities(id) on delete cascade,
  name_i18n          jsonb not null default '{}'::jsonb,
  percentage         int not null default 0,
  requirements_i18n  jsonb not null default '{}'::jsonb
);

create table if not exists public.dormitories (
  id                text primary key,
  university_id     text not null references public.universities(id) on delete cascade,
  capacity          int not null default 0,
  price_per_month   numeric(12,2) not null default 0,
  currency          text not null default 'USD',
  photos            text[] not null default '{}'
);

create table if not exists public.reviews (
  id                  text primary key,
  university_id       text not null references public.universities(id) on delete cascade,
  author_name         text not null,
  author_country      text not null,
  author_initials     text not null default '',
  rating              int not null,
  text_i18n           jsonb not null default '{}'::jsonb,
  verified            boolean not null default false,
  program_studied_i18n jsonb not null default '{}'::jsonb,
  year                int not null
);

create table if not exists public.faqs (
  id           text primary key,
  entity_type  text not null,
  entity_id    text not null,
  question_i18n jsonb not null default '{}'::jsonb,
  answer_i18n  jsonb not null default '{}'::jsonb
);

create table if not exists public.blog_posts (
  id                text primary key,
  slug              text not null unique,
  title_i18n        jsonb not null default '{}'::jsonb,
  excerpt_i18n      jsonb not null default '{}'::jsonb,
  content_i18n      jsonb not null default '{}'::jsonb,
  author            text not null,
  published_at      text not null,
  cover_image       text not null default '',
  category_i18n     jsonb not null default '{}'::jsonb,
  reading_minutes   int not null default 3
);

-- indekslər
create index if not exists universities_city_idx on public.universities(city_id);
create index if not exists university_programs_university_idx on public.university_programs(university_id);
create index if not exists university_programs_program_idx on public.university_programs(program_id);
create index if not exists reviews_university_idx on public.reviews(university_id);
create index if not exists faqs_entity_idx on public.faqs(entity_type, entity_id);
```

> `LocalizedString` tipi artıq `Partial<Record<AppLocale, string>>` olduğu üçün jsonb_də təbii olaraq subset saxlayır; `lx()` fallback etmir UI-da zaten oxuyur.

---

## 3. Seeder (`scripts/seed-content.ts`)

- `tsx` ilə işləyir (migrate.ts-ə oxşar env yüklə).
- Content cədvəllərini truncate (cascade ilə), sonra seed-dən ardıcıl insert.
- CRM cədvəllərinə toxunmur (CRM seed `supaṛbase/seed.sql`-də qalır).
- `migrate.ts`-ə entegrasiya: `--seed`/`--reset` bayrağı bitdikdən sonra çağrılır.
- Mövcud `db:reset` artıq hər şeyi bir əmrlə edir.

---

## 4. PgDataLayer (`src/lib/data/pg-data-repository.ts`)

- `createPgDataLayer(getPool)` → `DataLayer`.
- Hər alt-repo (`UniversityRepository`, `CityRepository`, ...) sinif əvəzinə obyekt kimi implement olunur.
- jsonb sütunları oxunan tərəfdə helper `parseI18n(raw)` → `LocalizedString`.
- `getMinTuitionUSD`, `getRating` artıq async (mövcud interfeysdə sync) — interfeys dəyişmir sadəcə async Pomise qaytarır... **DİQQƏT:** interfeynsdə sync olan metodlar async olunur? Yox: interfeysdə zaten `Promise<...>` var yalnız `getMinTuitionUSD`/`getRating` sync. Onları async edirik və interfeysdə dəyişiklik tələb olunur. Lazımdır: interfeysdə `getMinTuitionUSD(universityId: string): number;` → `Promise<number>`. Bu UI call-site-lərə təsir edir.

> Həll: pg-data-repository-də lazımi yerləri async edirik; köhnə sync consumer-lərə getminTuition-getrating async callback-i ilə uyğunlaşdırırıq; bu faza-icrasında qarşılayacağıq. **Qerar:** interfeysdə bu iki metod async edilir; call-site-lər `await` alır.

---

## 5. Flip (`src/lib/data/index.ts`)

```ts
function createDataLayer(): DataLayer {
  if (process.env.DATABASE_URL) return createPgDataLayer(() => sharedPool);
  return createSeedDataLayer(); // fallback (testen istifadə oluna bilər)
}
```
Single `sharedPool` lazy yarat.

---

## 6. Test Strategiyası

- Vitest `pg-data-repository.test.ts`: list universities, getBySlug, getDetail (tagline/programs populated), getByCategoryAndCity combinations, blog list/getBySlug.
- Mövcud `seed-repository.test.ts` kalır (fallback yoxlanışı üçün).
- `db:reset` sonra `npm run build` yaşıl.

---

## 7. Risklər

- **getMinTuitionUSD/getRating async keçidi** — call-site-ləri (university detail/page, compare) `await` almalı; nisbi asılılıqlar diqqət.
- **jsonb sütun default** — nullable deyil; seed 1:1 köçür.
- **truncate cascade sırası** — uşaq cədvəlləri əvvəl truncatelenməlidir; sadə truncate tək-tək.
- **build vaxtı** — ISR səhifələri DB-dən oxuyur, build zamanı 18 locale × ~50+ səhifə query; lokal Postgres USD-yə dayanır.
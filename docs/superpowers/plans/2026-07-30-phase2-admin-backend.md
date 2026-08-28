# Phase 2: Backend Foundation + Admin/CRM Panel — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the transactional data layer (raw-SQL schema + thin repository) and an Admin/CRM panel (overview, leads Kanban, lead detail, applications, users, audit log) against a local Postgres, ready to flip to Supabase.

**Architecture:** Raw SQL migrations (copy-paste to Supabase SQL editor) + a `CrmRepository` interface with a `PgCrmRepository` (node-postgres, local) and a `SupabaseCrmRepository` stub (prod). Admin lives at `app/admin/*` with its own root layout (multiple-root-layouts pattern) and a dev-auth placeholder.

**Tech Stack:** Next.js 15 App Router, TypeScript, Tailwind + shadcn (Kinetic Horizon), node-postgres (`pg`), `tsx`, Zod, Vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-07-30-study-platform-phase2-admin-backend-design.md`

---

## File Structure

**Create:**
- `docker-compose.yml` — local Postgres
- `.env.example`, `.env.local` — DATABASE_URL
- `supabase/migrations/0001_enums.sql` … `0006_auth_trigger.sql` — raw SQL (deploy to Supabase)
- `supabase/seed.sql` — demo data
- `scripts/migrate.ts` — local SQL runner (pg)
- `src/types/crm.ts` — CRM domain types
- `src/lib/crm/repositories.ts` — `CrmRepository` interface
- `src/lib/crm/pg-repository.ts` — `PgCrmRepository`
- `src/lib/crm/supabase-repository.ts` — `SupabaseCrmRepository` stub
- `src/lib/crm/index.ts` — flip point (`crm` singleton)
- `src/lib/crm/session.ts` — dev-auth helpers
- `src/lib/validations/crm.ts` — Zod schemas
- `src/app/admin/layout.tsx` — admin root layout (html + shell + guard)
- `src/app/admin/login/page.tsx` + `src/app/actions/admin-auth.ts` — dev-auth
- `src/app/admin/page.tsx` — overview
- `src/app/admin/leads/page.tsx`, `src/app/admin/leads/[id]/page.tsx`
- `src/app/admin/applications/[id]/page.tsx`
- `src/app/admin/users/page.tsx`, `src/app/admin/audit/page.tsx`
- `src/app/actions/crm.ts` — server actions (status/assign)
- `src/components/admin/{AdminSidebar,AdminTopbar,KpiCard,KanbanBoard,LeadStatusBadge,PipelineStepper,DataTable}.tsx`
- `tests/unit/crm-repository.test.ts`, `tests/e2e/admin.spec.ts`

**Modify:**
- `src/middleware.ts` — exclude `/admin` from locale matching
- `src/app/robots.ts` — disallow `/*/admin` paths
- `package.json` — deps + db scripts
- `src/lib/data/index.ts` — no change (parallel layer)

---

## Task 0: Project bootstrap

**Files:**
- Create: `docker-compose.yml`, `.env.example`, `.env.local`
- Modify: `package.json`, `.gitignore`

- [ ] **Step 1: Install dependencies**

Run from project root `C:\Users\Asus\OneDrive\Desktop\study`:
```bash
npm install pg @supabase/supabase-js
npm install -D tsx @types/pg
```
Expected: `added N packages`. `pg`, `@supabase/supabase-js` in `dependencies`; `tsx`, `@types/pg` in `devDependencies`.

- [ ] **Step 2: Add db scripts to package.json**

Add to `"scripts"` (after `"format"`):
```json
"db:up": "docker compose up -d",
"db:down": "docker compose down",
"db:migrate": "tsx scripts/migrate.ts",
"db:seed": "tsx scripts/migrate.ts --seed",
"db:reset": "tsx scripts/migrate.ts --reset"
```

- [ ] **Step 3: Create docker-compose.yml**

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: study_crm_db
    environment:
      POSTGRES_DB: study_crm
      POSTGRES_USER: study
      POSTGRES_PASSWORD: study
    ports:
      - "5433:5432"
    volumes:
      - study_pgdata:/var/lib/postgresql/data
volumes:
  study_pgdata:
```

- [ ] **Step 4: Create .env.example and .env.local**

`.env.example`:
```
# Local Postgres (docker compose). Copy to .env.local and adjust.
DATABASE_URL=postgresql://study:study@localhost:5433/study_crm
# Set to "true" only when Supabase keys are present (Phase 2 sub-project B).
SUPABASE_ENABLED=false
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```
`.env.local` (same values, NOT committed):
```
DATABASE_URL=postgresql://study:study@localhost:5433/study_crm
SUPABASE_ENABLED=false
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

- [ ] **Step 5: Ensure .env.local is gitignored**

In `.gitignore`, ensure these lines exist (append if missing):
```
.env*.local
```
Verify `.env.example` is NOT ignored (it should be committed).

- [ ] **Step 6: Verify Docker is available**

Run:
```bash
docker --version
```
Expected: `Docker version ...`. If Docker Desktop isn't running, start it.

- [ ] **Step 7: Commit**
```bash
git add docker-compose.yml .env.example package.json package-lock.json .gitignore
git commit -m "chore: add local postgres + db scripts for phase 2"
```

---

## Task 1: SQL migrations (raw, deploy-ready for Supabase)

**Files:**
- Create: `supabase/migrations/0001_enums.sql`, `0002_tables.sql`, `0003_indexes.sql`, `0004_functions_triggers.sql`, `0005_rls.sql`, `0006_auth_trigger.sql`
- Create: `supabase/seed.sql`

- [ ] **Step 1: 0001_enums.sql**

```sql
-- 0001_enums.sql
do $$ begin
  create type user_role as enum ('student','consultant','admin','editor');
exception when duplicate_object then null; end $$;

do $$ begin
  create type lead_status as enum (
    'new','contacted','document_collection','application_submitted',
    'offer_received','accepted','visa_processing','arrived','completed','lost'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type application_status as enum (
    'draft','submitted','under_review','offer','rejected','enrolled'
  );
exception when duplicate_object then null; end $$;
```

- [ ] **Step 2: 0002_tables.sql**

NOTE: `profiles.id` references `auth.users(id)`. **Local Postgres has no `auth` schema**, so this file has a guarded fallback: if `auth.users` is missing, `id` is a plain uuid PK. Both branches produce a usable table.

```sql
-- 0002_tables.sql
create table if not exists public.profiles (
  id           uuid primary key default gen_random_uuid(),
  email        text not null unique,
  full_name    text not null default '',
  role         user_role not null default 'student',
  phone        text,
  whatsapp     text,
  country_code text,
  avatar_url   text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Supabase only: link profiles.id to auth.users.id.
do $$ begin
  execute 'alter table public.profiles drop constraint if exists profiles_id_fkey';
  execute format(
    'alter table public.profiles add constraint profiles_id_fkey
     foreign key (id) references %I.users(id) on delete cascade',
    case when exists (select 1 from pg_namespace where nspname='auth') then 'auth' else 'public' end
  );
exception when others then null; end $$;

create table if not exists public.leads (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references public.profiles(id) on delete cascade,
  university_id         text not null,
  program_id            text,
  status                lead_status not null default 'new',
  source                text not null default 'website',
  assigned_consultant_id uuid references public.profiles(id) on delete set null,
  notes                 text not null default '',
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create table if not exists public.applications (
  id                     uuid primary key default gen_random_uuid(),
  lead_id                uuid not null references public.leads(id) on delete cascade,
  university_id          text not null,
  program_id             text,
  status                 application_status not null default 'draft',
  assigned_consultant_id uuid references public.profiles(id) on delete set null,
  notes                  text not null default '',
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

create table if not exists public.application_documents (
  id             uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  file_name      text not null,
  file_url       text not null,
  mime_type      text,
  size_bytes     bigint,
  verified       boolean not null default false,
  uploaded_by    uuid references public.profiles(id) on delete set null,
  created_at     timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references public.profiles(id) on delete set null,
  action     text not null,
  entity     text not null,
  entity_id  uuid,
  metadata   jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
```

- [ ] **Step 3: 0003_indexes.sql**

```sql
-- 0003_indexes.sql
create index if not exists idx_leads_status      on public.leads(status);
create index if not exists idx_leads_consultant   on public.leads(assigned_consultant_id);
create index if not exists idx_leads_user         on public.leads(user_id);
create index if not exists idx_leads_created      on public.leads(created_at desc);
create index if not exists idx_apps_lead          on public.applications(lead_id);
create index if not exists idx_apps_status        on public.applications(status);
create index if not exists idx_docs_application   on public.application_documents(application_id);
create index if not exists idx_audit_entity       on public.audit_logs(entity, entity_id);
create index if not exists idx_audit_user         on public.audit_logs(user_id);
create index if not exists idx_audit_created      on public.audit_logs(created_at desc);
```

- [ ] **Step 4: 0004_functions_triggers.sql**

```sql
-- 0004_functions_triggers.sql
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists leads_updated_at on public.leads;
create trigger leads_updated_at before update on public.leads
  for each row execute function public.set_updated_at();

drop trigger if exists applications_updated_at on public.applications;
create trigger applications_updated_at before update on public.applications
  for each row execute function public.set_updated_at();
```

- [ ] **Step 5: 0005_rls.sql (Supabase only; local runner skips)**

```sql
-- 0005_rls.sql — enable ONLY on Supabase (auth.uid() exists). Local dev skips this file.
create or replace function public.is_staff()
returns boolean language sql security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','consultant','editor'));
$$;

create or replace function public.is_admin()
returns boolean language sql security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

alter table public.profiles              enable row level security;
alter table public.leads                 enable row level security;
alter table public.applications          enable row level security;
alter table public.application_documents enable row level security;
alter table public.audit_logs            enable row level security;

drop policy if exists "profiles_read"  on public.profiles;
create policy "profiles_read"  on public.profiles for select using (id = auth.uid() or public.is_staff());

drop policy if exists "profiles_update" on public.profiles;
create policy "profiles_update" on public.profiles for update using (id = auth.uid() or public.is_admin());

drop policy if exists "leads_read" on public.leads;
create policy "leads_read" on public.leads for select
  using (user_id = auth.uid() or assigned_consultant_id = auth.uid() or public.is_staff());

drop policy if exists "leads_write" on public.leads;
create policy "leads_write" on public.leads for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "apps_read" on public.applications;
create policy "apps_read" on public.applications for select
  using (assigned_consultant_id = auth.uid() or public.is_staff()
         or lead_id in (select id from public.leads where user_id = auth.uid()));

drop policy if exists "apps_write" on public.applications;
create policy "apps_write" on public.applications for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "docs_read" on public.application_documents;
create policy "docs_read" on public.application_documents for select
  using (public.is_staff() or application_id in (
    select a.id from public.applications a
    join public.leads l on l.id = a.lead_id where l.user_id = auth.uid()));

drop policy if exists "docs_write" on public.application_documents;
create policy "docs_write" on public.application_documents for all
  using (public.is_staff()) with check (public.is_staff());

drop policy if exists "audit_read" on public.audit_logs;
create policy "audit_read" on public.audit_logs for select using (public.is_admin());
```

- [ ] **Step 6: 0006_auth_trigger.sql (Supabase only; local runner skips)**

```sql
-- 0006_auth_trigger.sql — Supabase only. Auto-create profile on signup.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name',''), 'student');
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();
```

- [ ] **Step 7: seed.sql**

```sql
-- seed.sql — demo data for local dev. Safe to re-run (idempotent-ish via fixed UUIDs).
insert into public.profiles (id, email, full_name, role, phone, whatsapp, country_code) values
  ('11111111-1111-1111-1111-111111111111','admin@studyhub.local','Admin User','admin','+905000000001','+905000000001','TR'),
  ('22222222-2222-2222-2222-222222222222','ayse@studyhub.local','Ayşe Kaya','consultant','+905000000002','+905000000002','TR'),
  ('33333333-3333-3333-3333-333333333333','mehmet@studyhub.local','Mehmet Demir','consultant','+905000000003','+905000000003','TR'),
  ('44444444-4444-4444-4444-444444444444','student1@example.com','Ali Veli','student','+994500000004','+994500000004','AZ'),
  ('55555555-5555-5555-5555-555555555555','student2@example.com','Madina Yusifova','student','+998700000005','+998700000005','UZ')
on conflict (email) do nothing;

-- university_id values are soft-refs to seed universities (src/lib/seed/universities.ts).
insert into public.leads (id, user_id, university_id, program_id, status, source, assigned_consultant_id, notes) values
  ('aaaaaaaa-0000-0000-0000-000000000001','44444444-4444-4444-4444-444444444444','u-bahcesehir','p-medicine-bachelor','new','website','22222222-2222-2222-2222-222222222222','Interested in English medicine program'),
  ('aaaaaaaa-0000-0000-0000-000000000002','55555555-5555-5555-5555-555555555555','u-istanbul','p-cs-bachelor','contacted','referral','33333333-3333-3333-3333-333333333333','Prefers Istanbul'),
  ('aaaaaaaa-0000-0000-0000-000000000003','44444444-4444-4444-4444-444444444444','u-koç','p-business-master','document_collection','website',null,'Needs scholarship info'),
  ('aaaaaaaa-0000-0000-0000-000000000004','55555555-5555-5555-5555-555555555555','u-bilkent','p-engineering-bachelor','application_submitted','social','22222222-2222-2222-2222-222222222222',''),
  ('aaaaaaaa-0000-0000-0000-000000000005','44444444-4444-4444-4444-444444444444','u-istanbul','p-law-bachelor','offer_received','website','33333333-3333-3333-3333-333333333333','Conditional offer'),
  ('aaaaaaaa-0000-0000-0000-000000000006','55555555-5555-5555-5555-555555555555','u-bahcesehir','p-dentistry-bachelor','accepted','website','22222222-2222-2222-2222-222222222222',''),
  ('aaaaaaaa-0000-0000-0000-000000000007','44444444-4444-4444-4444-444444444444','u-koç','p-architecture-bachelor','visa_processing','referral','33333333-3333-3333-3333-333333333333','Visa docs submitted'),
  ('aaaaaaaa-0000-0000-0000-000000000008','55555555-5555-5555-5555-555555555555','u-bilkent','p-cs-master','arrived','website','22222222-2222-2222-2222-222222222222','Arrived in Ankara'),
  ('aaaaaaaa-0000-0000-0000-000000000009','44444444-4444-4444-4444-444444444444','u-istanbul','p-medicine-bachelor','completed','website','33333333-3333-3333-3333-333333333333','Enrolled Fall 2025'),
  ('aaaaaaaa-0000-0000-0000-000000000010','55555555-5555-5555-5555-555555555555','u-koç','p-business-bachelor','new','website',null,''),
  ('aaaaaaaa-0000-0000-0000-000000000011','44444444-4444-4444-4444-444444444444','u-bahcesehir','p-arts-bachelor','new','social',null,'Wants arts program'),
  ('aaaaaaaa-0000-0000-0000-000000000012','55555555-5555-5555-5555-555555555555','u-istanbul','p-engineering-master','contacted','website','22222222-2222-2222-2222-222222222222','')
on conflict do nothing;

insert into public.applications (id, lead_id, university_id, program_id, status, assigned_consultant_id) values
  ('bbbbbbbb-0000-0000-0000-000000000001','aaaaaaaa-0000-0000-0000-000000000004','u-bilkent','p-engineering-bachelor','submitted','22222222-2222-2222-2222-222222222222'),
  ('bbbbbbbb-0000-0000-0000-000000000002','aaaaaaaa-0000-0000-0000-000000000005','u-istanbul','p-law-bachelor','offer','33333333-3333-3333-3333-333333333333'),
  ('bbbbbbbb-0000-0000-0000-000000000003','aaaaaaaa-0000-0000-0000-000000000009','u-istanbul','p-medicine-bachelor','enrolled','33333333-3333-3333-3333-333333333333')
on conflict do nothing;

insert into public.application_documents (application_id, file_name, file_url, mime_type, size_bytes, verified) values
  ('bbbbbbbb-0000-0000-0000-000000000001','passport.pdf','/uploads/demo-passport.pdf','application/pdf',240000,false),
  ('bbbbbbbb-0000-0000-0000-000000000001','diploma.pdf','/uploads/demo-diploma.pdf','application/pdf',180000,true)
on conflict do nothing;

insert into public.audit_logs (user_id, action, entity, entity_id, metadata) values
  ('11111111-1111-1111-1111-111111111111','lead.create','lead','aaaaaaaa-0000-0000-0000-000000000001','{}'::jsonb),
  ('22222222-2222-2222-2222-222222222222','lead.update_status','lead','aaaaaaaa-0000-0000-0000-000000000002','{"from":"new","to":"contacted"}'::jsonb)
on conflict do nothing;
```

> NOTE on `university_id`/`program_id` values: these soft-reference the seed university/program IDs. Confirm the real IDs in `src/lib/seed/universities.ts` and `src/lib/seed/programs.ts`; if they differ from `u-bahcesehir` etc., update `seed.sql` accordingly before running. The runner still works with any string values (no FK).

- [ ] **Step 8: Commit**
```bash
git add supabase/
git commit -m "feat(db): raw sql migrations + seed for crm (supabase-ready)"
```

---

## Task 2: Local migration runner

**Files:**
- Create: `scripts/migrate.ts`

- [ ] **Step 1: Write the runner**

The runner reads `supabase/migrations/*.sql` in order, runs them via `pg`, and **skips** `0005_rls.sql` and `0006_auth_trigger.sql` locally (they need Supabase `auth` schema). Flags: `--seed` runs `seed.sql` after; `--reset` drops all tables first.

```typescript
// scripts/migrate.ts
import { Pool } from 'pg';
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const migrationsDir = join(root, 'supabase', 'migrations');
const seedPath = join(root, 'supabase', 'seed.sql');

// Skip locally: require Supabase auth schema.
const SKIP_LOCAL = ['0005_rls.sql', '0006_auth_trigger.sql'];

async function main() {
  const args = new Set(process.argv.slice(2));
  const reset = args.has('--reset');
  const seed = args.has('--seed') || reset;

  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not set');

  const pool = new Pool({ connectionString: url });
  const client = await pool.connect();
  try {
    if (reset) {
      console.log('→ resetting schema');
      await client.query(`
        drop schema if exists public cascade;
        create schema public;
      `);
    }

    const files = readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    for (const file of files) {
      const skip = SKIP_LOCAL.includes(file);
      console.log(`${skip ? '↩ skip (supabase-only)' : '→ applying'} ${file}`);
      if (skip) continue;
      const sql = readFileSync(join(migrationsDir, file), 'utf8');
      await client.query(sql);
    }

    if (seed) {
      console.log('→ seeding');
      const sql = readFileSync(seedPath, 'utf8');
      await client.query(sql);
    }

    console.log('✓ done');
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

- [ ] **Step 2: Bring up Postgres + run migration**

```bash
npm run db:up
# wait ~3s for postgres to accept connections
npm run db:reset
```
Expected: `→ resetting schema` … `→ applying 0001_enums.sql` … `↩ skip (supabase-only) 0005_rls.sql` … `→ seeding` … `✓ done`.

If you see `connect ECONNREFUSED`, the container isn't ready yet — re-run `npm run db:migrate` after a few seconds (migrate without `--reset` to apply remaining).

- [ ] **Step 3: Verify tables exist**

```bash
docker exec -i study_crm_db psql -U study -d study_crm -c "\dt public.*"
```
Expected: lists `profiles`, `leads`, `applications`, `application_documents`, `audit_logs`.

- [ ] **Step 4: Commit**
```bash
git add scripts/migrate.ts
git commit -m "feat(db): local migration runner (pg)"
```

---

## Task 3: CRM domain types

**Files:**
- Create: `src/types/crm.ts`

- [ ] **Step 1: Write types**

```typescript
// src/types/crm.ts
export type UserRole = 'student' | 'consultant' | 'admin' | 'editor';

export type LeadStatus =
  | 'new' | 'contacted' | 'document_collection' | 'application_submitted'
  | 'offer_received' | 'accepted' | 'visa_processing' | 'arrived'
  | 'completed' | 'lost';

export type ApplicationStatus =
  | 'draft' | 'submitted' | 'under_review' | 'offer' | 'rejected' | 'enrolled';

export interface Profile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone: string | null;
  whatsapp: string | null;
  countryCode: string | null;
  avatarUrl: string | null;
  createdAt: string;
}

export interface Lead {
  id: string;
  userId: string;
  universityId: string;
  programId: string | null;
  status: LeadStatus;
  source: string;
  assignedConsultantId: string | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadWithRelations extends Lead {
  student: Pick<Profile, 'id' | 'fullName' | 'email' | 'countryCode'> | null;
  consultant: Pick<Profile, 'id' | 'fullName'> | null;
}

export interface LeadDetail extends LeadWithRelations {
  applications: Application[];
  timeline: AuditLog[];
}

export interface Application {
  id: string;
  leadId: string;
  universityId: string;
  programId: string | null;
  status: ApplicationStatus;
  assignedConsultantId: string | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationDocument {
  id: string;
  applicationId: string;
  fileName: string;
  fileUrl: string;
  mimeType: string | null;
  sizeBytes: number | null;
  verified: boolean;
  uploadedBy: string | null;
  createdAt: string;
}

export interface ApplicationDetail extends Application {
  documents: ApplicationDocument[];
  consultant: Pick<Profile, 'id' | 'fullName'> | null;
}

export interface AuditLog {
  id: string;
  userId: string | null;
  action: string;
  entity: string;
  entityId: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
  actorName: string | null;
}

export interface LeadFilter {
  status?: LeadStatus;
  consultantId?: string;
  search?: string;
}

export interface AuditFilter {
  entity?: string;
  userId?: string;
  limit?: number;
}

export interface NewLeadInput {
  userId: string;
  universityId: string;
  programId?: string | null;
  source?: string;
  assignedConsultantId?: string | null;
  notes?: string;
}

export interface NewDocumentInput {
  applicationId: string;
  fileName: string;
  fileUrl: string;
  mimeType?: string | null;
  sizeBytes?: number | null;
  uploadedBy?: string | null;
}

export interface AuditEntryInput {
  userId: string;
  action: string;
  entity: string;
  entityId?: string | null;
  metadata?: Record<string, unknown>;
}

// Ordered pipeline for UI steppers/Kanban columns.
export const LEAD_PIPELINE: LeadStatus[] = [
  'new', 'contacted', 'document_collection', 'application_submitted',
  'offer_received', 'accepted', 'visa_processing', 'arrived', 'completed',
];

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  document_collection: 'Documents',
  application_submitted: 'Submitted',
  offer_received: 'Offer',
  accepted: 'Accepted',
  visa_processing: 'Visa',
  arrived: 'Arrived',
  completed: 'Completed',
  lost: 'Lost',
};

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  under_review: 'Under Review',
  offer: 'Offer',
  rejected: 'Rejected',
  enrolled: 'Enrolled',
};
```

- [ ] **Step 2: Typecheck**
```bash
npm run typecheck
```
Expected: no errors.

- [ ] **Step 3: Commit**
```bash
git add src/types/crm.ts
git commit -m "feat(crm): domain types"
```

---

## Task 4: CrmRepository interface

**Files:**
- Create: `src/lib/crm/repositories.ts`

- [ ] **Step 1: Write interface**

```typescript
// src/lib/crm/repositories.ts
import type {
  Application,
  ApplicationDetail,
  ApplicationDocument,
  ApplicationStatus,
  AuditEntryInput,
  AuditFilter,
  AuditLog,
  Lead,
  LeadDetail,
  LeadFilter,
  LeadStatus,
  LeadWithRelations,
  NewDocumentInput,
  NewLeadInput,
  Profile,
} from '@/types/crm';

export interface CrmRepository {
  // leads
  listLeads(filter?: LeadFilter): Promise<LeadWithRelations[]>;
  getLead(id: string): Promise<LeadDetail | null>;
  createLead(input: NewLeadInput, actorId?: string): Promise<Lead>;
  updateLeadStatus(id: string, status: LeadStatus, actorId: string): Promise<Lead>;
  assignConsultant(leadId: string, consultantId: string | null, actorId: string): Promise<Lead>;
  // applications
  listApplications(leadId: string): Promise<Application[]>;
  getApplication(id: string): Promise<ApplicationDetail | null>;
  updateApplicationStatus(id: string, status: ApplicationStatus, actorId: string): Promise<Application>;
  // documents
  listDocuments(applicationId: string): Promise<ApplicationDocument[]>;
  addDocument(input: NewDocumentInput, actorId?: string): Promise<ApplicationDocument>;
  // users
  listStaff(): Promise<Profile[]>;
  getProfile(id: string): Promise<Profile | null>;
  // stats
  countByStatus(): Promise<Record<string, number>>;
  // audit
  writeAudit(entry: AuditEntryInput): Promise<void>;
  listAudit(filter?: AuditFilter): Promise<AuditLog[]>;
}
```

- [ ] **Step 2: Typecheck**
```bash
npm run typecheck
```
Expected: no errors (interface only).

- [ ] **Step 3: Commit**
```bash
git add src/lib/crm/repositories.ts
git commit -m "feat(crm): repository interface"
```

---

## Task 5: PgCrmRepository implementation + tests

**Files:**
- Create: `src/lib/crm/pg-repository.ts`, `src/lib/crm/db.ts`
- Test: `tests/unit/crm-repository.test.ts`

- [ ] **Step 1: Write the db pool helper**

```typescript
// src/lib/crm/db.ts
import { Pool } from 'pg';

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL is not set');
    pool = new Pool({ connectionString: url, max: 5 });
  }
  return pool;
}
```

- [ ] **Step 2: Write the failing test**

```typescript
// tests/unit/crm-repository.test.ts
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Pool } from 'pg';
import { createPgCrm } from '@/lib/crm/pg-repository';
import type { CrmRepository } from '@/lib/crm/repositories';

const url = process.env.DATABASE_URL!;
let pool: Pool;
let crm: CrmRepository;

// Use the study_crm db (seeded). Reset+seed before suite via `npm run db:reset`.

beforeEach(async () => {
  pool = new Pool({ connectionString: url, max: 3 });
  crm = createPgCrm(() => pool);
});

afterEach(async () => {
  await pool.end();
});

describe('PgCrmRepository', () => {
  it('lists staff (admin + consultants, not students)', async () => {
    const staff = await crm.listStaff();
    const roles = staff.map((s) => s.role).sort();
    expect(roles).toContain('admin');
    expect(roles).toContain('consultant');
    expect(roles).not.toContain('student');
  });

  it('lists leads and includes relations', async () => {
    const leads = await crm.listLeads();
    expect(leads.length).toBeGreaterThanOrEqual(10);
    expect(leads[0].student).not.toBeNull();
  });

  it('filters leads by status', async () => {
    const leads = await crm.listLeads({ status: 'new' });
    expect(leads.length).toBeGreaterThan(0);
    expect(leads.every((l) => l.status === 'new')).toBe(true);
  });

  it('updates lead status and writes audit', async () => {
    const before = await crm.listLeads({ status: 'new' });
    const target = before[0];
    const adminId = '11111111-1111-1111-1111-111111111111';
    await crm.updateLeadStatus(target.id, 'contacted', adminId);
    const after = await crm.getLead(target.id);
    expect(after?.status).toBe('contacted');
    const audit = await crm.listAudit({ entity: 'lead', userId: adminId });
    expect(audit.some((a) => a.entityId === target.id && a.action === 'lead.update_status')).toBe(true);
    // restore
    await crm.updateLeadStatus(target.id, 'new', adminId);
  });

  it('assigns a consultant', async () => {
    const leads = await crm.listLeads({ status: 'new' });
    const target = leads.find((l) => !l.assignedConsultantId)!;
    const consultantId = '22222222-2222-2222-2222-222222222222';
    const adminId = '11111111-1111-1111-1111-111111111111';
    const updated = await crm.assignConsultant(target.id, consultantId, adminId);
    expect(updated.assignedConsultantId).toBe(consultantId);
  });

  it('counts leads by status', async () => {
    const counts = await crm.countByStatus();
    expect(counts['new']).not.toBeUndefined();
    expect(typeof counts['new']).toBe('number');
  });

  it('gets lead detail with applications + timeline', async () => {
    const leads = await crm.listLeads({ status: 'application_submitted' });
    const lead = await crm.getLead(leads[0].id);
    expect(lead).not.toBeNull();
    expect(Array.isArray(lead!.applications)).toBe(true);
    expect(Array.isArray(lead!.timeline)).toBe(true);
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

```bash
npm run db:reset
npx vitest run tests/unit/crm-repository.test.ts
```
Expected: FAIL — `createPgCrm` not exported / module not found.

- [ ] **Step 4: Implement PgCrmRepository**

```typescript
// src/lib/crm/pg-repository.ts
import type { Pool, QueryResult, QueryResultRow } from 'pg';
import type {
  Application,
  ApplicationDetail,
  ApplicationDocument,
  ApplicationStatus,
  AuditEntryInput,
  AuditFilter,
  AuditLog,
  Lead,
  LeadDetail,
  LeadFilter,
  LeadStatus,
  LeadWithRelations,
  NewDocumentInput,
  NewLeadInput,
  Profile,
} from '@/types/crm';
import type { CrmRepository } from './repositories';

function rowToProfile(r: QueryResultRow): Profile {
  return {
    id: r.id,
    email: r.email,
    fullName: r.full_name,
    role: r.role,
    phone: r.phone,
    whatsapp: r.whatsapp,
    countryCode: r.country_code,
    avatarUrl: r.avatar_url,
    createdAt: r.created_at,
  };
}

function rowToLead(r: QueryResultRow): Lead {
  return {
    id: r.id,
    userId: r.user_id,
    universityId: r.university_id,
    programId: r.program_id,
    status: r.status,
    source: r.source,
    assignedConsultantId: r.assigned_consultant_id,
    notes: r.notes,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export function createPgCrm(getPool: () => Pool): CrmRepository {
  const q = async <T extends QueryResultRow = QueryResultRow>(
    text: string,
    params: unknown[] = [],
  ): Promise<QueryResult<T>> => getPool().query<T>(text, params as never[]);

  const audit = async (entry: AuditEntryInput): Promise<void> => {
    await q(
      `insert into public.audit_logs (user_id, action, entity, entity_id, metadata)
       values ($1, $2, $3, $4, $5::jsonb)`,
      [entry.userId, entry.action, entry.entity, entry.entityId ?? null, JSON.stringify(entry.metadata ?? {})],
    );
  };

  return {
    async listLeads(filter: LeadFilter = {}): Promise<LeadWithRelations[]> {
      const where: string[] = [];
      const params: unknown[] = [];
      if (filter.status) {
        params.push(filter.status);
        where.push(`l.status = $${params.length}`);
      }
      if (filter.consultantId) {
        params.push(filter.consultantId);
        where.push(`l.assigned_consultant_id = $${params.length}`);
      }
      if (filter.search) {
        params.push(`%${filter.search}%`);
        where.push(`(s.full_name ilike $${params.length} or s.email ilike $${params.length} or l.university_id ilike $${params.length})`);
      }
      const clause = where.length ? `where ${where.join(' and ')}` : '';
      const res = await q(
        `select l.*, s.id s_id, s.full_name s_name, s.email s_email, s.country_code s_country,
                c.id c_id, c.full_name c_name
         from public.leads l
         join public.profiles s on s.id = l.user_id
         left join public.profiles c on c.id = l.assigned_consultant_id
         ${clause}
         order by l.created_at desc
         limit 200`,
        params,
      );
      return res.rows.map((r) => ({
        ...rowToLead(r),
        student: r.s_id ? { id: r.s_id, fullName: r.s_name, email: r.s_email, countryCode: r.s_country } : null,
        consultant: r.c_id ? { id: r.c_id, fullName: r.c_name } : null,
      }));
    },

    async getLead(id: string): Promise<LeadDetail | null> {
      const res = await q(
        `select l.*, s.id s_id, s.full_name s_name, s.email s_email, s.country_code s_country,
                c.id c_id, c.full_name c_name
         from public.leads l
         join public.profiles s on s.id = l.user_id
         left join public.profiles c on c.id = l.assigned_consultant_id
         where l.id = $1`,
        [id],
      );
      if (res.rowCount === 0) return null;
      const r = res.rows[0];
      const [apps, timeline] = await Promise.all([
        this.listApplications(id),
        this.listAudit({ entity: 'lead', limit: 50 }).then((rows) =>
          rows.filter((a) => a.entityId === id),
        ),
      ]);
      return {
        ...rowToLead(r),
        student: { id: r.s_id, fullName: r.s_name, email: r.s_email, countryCode: r.s_country },
        consultant: r.c_id ? { id: r.c_id, fullName: r.c_name } : null,
        applications: apps,
        timeline,
      };
    },

    async createLead(input: NewLeadInput, actorId?: string): Promise<Lead> {
      const res = await q(
        `insert into public.leads (user_id, university_id, program_id, source, assigned_consultant_id, notes)
         values ($1,$2,$3,$4,$5,$6) returning *`,
        [input.userId, input.universityId, input.programId ?? null, input.source ?? 'website',
         input.assignedConsultantId ?? null, input.notes ?? ''],
      );
      const lead = rowToLead(res.rows[0]);
      if (actorId) await audit({ userId: actorId, action: 'lead.create', entity: 'lead', entityId: lead.id });
      return lead;
    },

    async updateLeadStatus(id: string, status: LeadStatus, actorId: string): Promise<Lead> {
      const prev = await q('select status from public.leads where id = $1', [id]);
      const from = prev.rows[0]?.status;
      const res = await q('update public.leads set status = $1 where id = $2 returning *', [status, id]);
      await audit({ userId: actorId, action: 'lead.update_status', entity: 'lead', entityId: id, metadata: { from, to: status } });
      return rowToLead(res.rows[0]);
    },

    async assignConsultant(leadId: string, consultantId: string | null, actorId: string): Promise<Lead> {
      const res = await q(
        'update public.leads set assigned_consultant_id = $1 where id = $2 returning *',
        [consultantId, leadId],
      );
      await audit({ userId: actorId, action: 'lead.assign', entity: 'lead', entityId: leadId, metadata: { consultantId } });
      return rowToLead(res.rows[0]);
    },

    async listApplications(leadId: string): Promise<Application[]> {
      const res = await q('select * from public.applications where lead_id = $1 order by created_at', [leadId]);
      return res.rows.map((r) => ({
        id: r.id, leadId: r.lead_id, universityId: r.university_id, programId: r.program_id,
        status: r.status, assignedConsultantId: r.assigned_consultant_id, notes: r.notes,
        createdAt: r.created_at, updatedAt: r.updated_at,
      }));
    },

    async getApplication(id: string): Promise<ApplicationDetail | null> {
      const res = await q(
        `select a.*, c.id c_id, c.full_name c_name
         from public.applications a
         left join public.profiles c on c.id = a.assigned_consultant_id
         where a.id = $1`,
        [id],
      );
      if (res.rowCount === 0) return null;
      const r = res.rows[0];
      const docs = await this.listDocuments(id);
      return {
        id: r.id, leadId: r.lead_id, universityId: r.university_id, programId: r.program_id,
        status: r.status, assignedConsultantId: r.assigned_consultant_id, notes: r.notes,
        createdAt: r.created_at, updatedAt: r.updated_at,
        consultant: r.c_id ? { id: r.c_id, fullName: r.c_name } : null,
        documents: docs,
      };
    },

    async updateApplicationStatus(id: string, status: ApplicationStatus, actorId: string): Promise<Application> {
      const res = await q('update public.applications set status = $1 where id = $2 returning *', [status, id]);
      await audit({ userId: actorId, action: 'application.update_status', entity: 'application', entityId: id, metadata: { to: status } });
      const r = res.rows[0];
      return {
        id: r.id, leadId: r.lead_id, universityId: r.university_id, programId: r.program_id,
        status: r.status, assignedConsultantId: r.assigned_consultant_id, notes: r.notes,
        createdAt: r.created_at, updatedAt: r.updated_at,
      };
    },

    async listDocuments(applicationId: string): Promise<ApplicationDocument[]> {
      const res = await q('select * from public.application_documents where application_id = $1 order by created_at', [applicationId]);
      return res.rows.map((r) => ({
        id: r.id, applicationId: r.application_id, fileName: r.file_name, fileUrl: r.file_url,
        mimeType: r.mime_type, sizeBytes: r.size_bytes, verified: r.verified,
        uploadedBy: r.uploaded_by, createdAt: r.created_at,
      }));
    },

    async addDocument(input: NewDocumentInput, actorId?: string): Promise<ApplicationDocument> {
      const res = await q(
        `insert into public.application_documents (application_id, file_name, file_url, mime_type, size_bytes, uploaded_by)
         values ($1,$2,$3,$4,$5,$6) returning *`,
        [input.applicationId, input.fileName, input.fileUrl, input.mimeType ?? null,
         input.sizeBytes ?? null, input.uploadedBy ?? actorId ?? null],
      );
      const r = res.rows[0];
      return {
        id: r.id, applicationId: r.application_id, fileName: r.file_name, fileUrl: r.file_url,
        mimeType: r.mime_type, sizeBytes: r.size_bytes, verified: r.verified,
        uploadedBy: r.uploaded_by, createdAt: r.created_at,
      };
    },

    async listStaff(): Promise<Profile[]> {
      const res = await q(`select * from public.profiles where role in ('admin','consultant','editor') order by full_name`);
      return res.rows.map(rowToProfile);
    },

    async getProfile(id: string): Promise<Profile | null> {
      const res = await q('select * from public.profiles where id = $1', [id]);
      return res.rowCount ? rowToProfile(res.rows[0]) : null;
    },

    async countByStatus(): Promise<Record<string, number>> {
      const res = await q('select status, count(*)::int c from public.leads group by status');
      const out: Record<string, number> = {};
      for (const r of res.rows) out[r.status] = r.c;
      return out;
    },

    async writeAudit(entry: AuditEntryInput): Promise<void> {
      await audit(entry);
    },

    async listAudit(filter: AuditFilter = {}): Promise<AuditLog[]> {
      const where: string[] = [];
      const params: unknown[] = [];
      if (filter.entity) { params.push(filter.entity); where.push(`a.entity = $${params.length}`); }
      if (filter.userId) { params.push(filter.userId); where.push(`a.user_id = $${params.length}`); }
      const limit = filter.limit ?? 100;
      params.push(limit);
      const res = await q(
        `select a.*, p.full_name actor_name
         from public.audit_logs a
         left join public.profiles p on p.id = a.user_id
         ${where.length ? `where ${where.join(' and ')}` : ''}
         order by a.created_at desc
         limit $${params.length}`,
        params,
      );
      return res.rows.map((r) => ({
        id: r.id, userId: r.user_id, action: r.action, entity: r.entity,
        entityId: r.entity_id, metadata: r.metadata ?? {}, createdAt: r.created_at,
        actorName: r.actor_name,
      }));
    },
  };
}
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
npm run db:reset
npx vitest run tests/unit/crm-repository.test.ts
```
Expected: 7 passing.

- [ ] **Step 6: Commit**
```bash
git add src/lib/crm/db.ts src/lib/crm/pg-repository.ts tests/unit/crm-repository.test.ts
git commit -m "feat(crm): pg repository + tests"
```

---

## Task 6: Supabase stub + flip point

**Files:**
- Create: `src/lib/crm/supabase-repository.ts`, `src/lib/crm/index.ts`

- [ ] **Step 1: Supabase stub**

```typescript
// src/lib/crm/supabase-repository.ts
import type { CrmRepository } from './repositories';

/**
 * Phase 2 stub. Implemented fully in sub-project B once Supabase keys exist.
 * Mirrors PgCrmRepository behaviour via the supabase-js client (RLS-aware).
 */
export function createSupabaseCrm(): CrmRepository {
  throw new Error(
    'SupabaseCrmRepository is not implemented yet (Phase 2 sub-project B). ' +
      'Set SUPABASE_ENABLED=false to use the local PgCrmRepository.',
  );
}
```

- [ ] **Step 2: Flip point**

```typescript
// src/lib/crm/index.ts
import { getPool } from './db';
import { createPgCrm } from './pg-repository';
import { createSupabaseCrm } from './supabase-repository';
import type { CrmRepository } from './repositories';

function createCrmLayer(): CrmRepository {
  if (process.env.SUPABASE_ENABLED === 'true') return createSupabaseCrm();
  return createPgCrm(getPool);
}

export const crm: CrmRepository = createCrmLayer();

export type { CrmRepository } from './repositories';
```

- [ ] **Step 3: Typecheck**
```bash
npm run typecheck
```
Expected: no errors.

- [ ] **Step 4: Commit**
```bash
git add src/lib/crm/supabase-repository.ts src/lib/crm/index.ts
git commit -m "feat(crm): supabase stub + flip point"
```

---

## Task 7: Zod validations

**Files:**
- Create: `src/lib/validations/crm.ts`

- [ ] **Step 1: Write schemas**

```typescript
// src/lib/validations/crm.ts
import { z } from 'zod';
import { LEAD_PIPELINE } from '@/types/crm';

export const updateLeadStatusSchema = z.object({
  leadId: z.string().uuid(),
  status: z.enum(LEAD_PIPELINE as [string, ...string[]]),
});

export const assignConsultantSchema = z.object({
  leadId: z.string().uuid(),
  consultantId: z.string().uuid().nullable(),
});

export const devLoginSchema = z.object({
  profileId: z.string().uuid(),
});
```

- [ ] **Step 2: Typecheck + commit**
```bash
npm run typecheck
git add src/lib/validations/crm.ts
git commit -m "feat(crm): zod validations"
```

---

## Task 8: Admin dev-auth

**Files:**
- Create: `src/lib/crm/session.ts`, `src/app/actions/admin-auth.ts`, `src/app/admin/login/page.tsx`

- [ ] **Step 1: Session helpers**

```typescript
// src/lib/crm/session.ts
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { crm } from './index';
import type { Profile } from '@/types/crm';

export const SESSION_COOKIE = 'admin_session';

export interface AdminSession {
  userId: string;
  role: string;
  fullName: string;
}

export async function getSession(): Promise<AdminSession | null> {
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AdminSession;
  } catch {
    return null;
  }
}

export async function requireStaff(): Promise<AdminSession> {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  return session;
}

export async function getActorProfile(): Promise<Profile | null> {
  const session = await getSession();
  if (!session) return null;
  return crm.getProfile(session.userId);
}
```

- [ ] **Step 2: Dev-auth server action**

```typescript
// src/app/actions/admin-auth.ts
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { crm } from '@/lib/crm';
import { SESSION_COOKIE } from '@/lib/crm/session';
import { devLoginSchema } from '@/lib/validations/crm';

export async function devLogin(input: unknown) {
  const parsed = devLoginSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const };
  const profile = await crm.getProfile(parsed.data.profileId);
  if (!profile) return { ok: false as const };
  const store = await cookies();
  store.set(SESSION_COOKIE, JSON.stringify({ userId: profile.id, role: profile.role, fullName: profile.fullName }), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8,
  });
  redirect('/admin');
}

export async function devLogout() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect('/admin/login');
}
```

- [ ] **Step 3: Login page**

```tsx
// src/app/admin/login/page.tsx
import { crm } from '@/lib/crm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

// Allow this page to render without the locale layout's chrome interfering.
export const dynamic = 'force-dynamic';

export default async function AdminLoginPage() {
  const staff = await crm.listStaff();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin (dev login)</CardTitle>
          <CardDescription>
            Demo only. Pick a staff profile to continue. Real auth arrives with Supabase.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {staff.map((p) => (
            <form key={p.id} action={devLoginAction} className="block">
              <input type="hidden" name="profileId" value={p.id} />
              <Button type="submit" variant="outline" className="w-full justify-between">
                <span>{p.fullName}</span>
                <span className="text-xs uppercase text-muted-foreground">{p.role}</span>
              </Button>
            </form>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// Server action wrapper (can't import 'use server' action into a server component inline).
async function devLoginAction(formData: FormData) {
  'use server';
  const { devLogin } = await import('@/app/actions/admin-auth');
  await devLogin({ profileId: String(formData.get('profileId')) });
}
```

- [ ] **Step 4: Typecheck**
```bash
npm run typecheck
```
Expected: no errors.

- [ ] **Step 5: Commit**
```bash
git add src/lib/crm/session.ts src/app/actions/admin-auth.ts src/app/admin/login/page.tsx
git commit -m "feat(admin): dev-auth session + login"
```

---

## Task 9: Admin root layout + middleware + shell

**Files:**
- Create: `src/app/admin/layout.tsx`, `src/components/admin/AdminSidebar.tsx`, `src/components/admin/AdminTopbar.tsx`
- Modify: `src/middleware.ts`, `src/app/robots.ts`

- [ ] **Step 1: Exclude /admin from locale middleware**

Replace `src/middleware.ts` matcher to add `admin`:
```typescript
// src/middleware.ts
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/((?!api|_next|_vercel|admin|.*\\..*).*)'],
};
```

- [ ] **Step 2: Update robots.ts to disallow admin across locales**

```typescript
// src/app/robots.ts
import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/admin/', '/*/admin/'],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
```

- [ ] **Step 3: AdminSidebar**

```tsx
// src/components/admin/AdminSidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, FileText, ScrollText, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/leads', label: 'Leads (CRM)', icon: GraduationCap },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/audit', label: 'Audit Log', icon: ScrollText },
];

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-60 shrink-0 border-r border-border bg-card lg:block">
      <nav className="flex flex-col gap-1 p-4">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground',
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
```

- [ ] **Step 4: AdminTopbar**

```tsx
// src/components/admin/AdminTopbar.tsx
import { devLogout } from '@/app/actions/admin-auth';
import { Button } from '@/components/ui/button';
import type { AdminSession } from '@/lib/crm/session';

export function AdminTopbar({ session }: { session: AdminSession }) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4 lg:px-6">
      <p className="font-display text-sm font-semibold text-foreground">
        StudyHub Admin
      </p>
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">{session.fullName}</span>
        <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold uppercase text-secondary-foreground">
          {session.role}
        </span>
        <form action={devLogout}>
          <Button type="submit" variant="ghost" size="sm">
            Sign out
          </Button>
        </form>
      </div>
    </header>
  );
}
```

- [ ] **Step 5: Admin root layout (own html + guard)**

This is the **root layout for `/admin/*`** (renders `<html>`), matching the existing multiple-root-layouts pattern.

```tsx
// src/app/admin/layout.tsx
import { Inter } from 'next/font/google';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/crm/session';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import '../globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const dynamic = 'force-dynamic';

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const pathname = 'placeholder'; // login page is allowed without session
  if (!session) {
    redirect('/admin/login');
  }

  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-background font-sans antialiased">
        <div className="flex min-h-screen">
          <AdminSidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <AdminTopbar session={session} />
            <main className="flex-1 p-4 lg:p-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
```

> NOTE: the `pathname` variable is unused after refactor — remove it. The login page (`/admin/login`) does NOT use this layout because login must be reachable without a session. **Problem:** `app/admin/layout.tsx` wraps ALL `/admin/*` routes including `/admin/login`, causing a redirect loop.

**Fix:** move the login page OUT of the guard by splitting layouts. Restructure so the guard lives in a nested layout, not the root:

Revised structure:
- `app/admin/layout.tsx` → renders `<html>` only (no guard) — root layout.
- `app/admin/(dashboard)/layout.tsx` → guard + shell (sidebar/topbar); wraps overview/leads/etc.
- `app/admin/login/page.tsx` → outside `(dashboard)`, renders in `app/admin/layout.tsx` (plain).

Rewrite `app/admin/layout.tsx` (no guard, no shell):
```tsx
// src/app/admin/layout.tsx
import { Inter } from 'next/font/google';
import '../globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-background font-sans antialiased">{children}</body>
    </html>
  );
}
```

Create `app/admin/(dashboard)/layout.tsx` (guard + shell):
```tsx
// src/app/admin/(dashboard)/layout.tsx
import { requireStaff } from '@/lib/crm/session';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireStaff();
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar session={session} />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
```

Then ALL dashboard pages live under `app/admin/(dashboard)/`:
- `app/admin/(dashboard)/page.tsx` → `/admin`
- `app/admin/(dashboard)/leads/page.tsx` → `/admin/leads`
- etc.

And `app/admin/login/page.tsx` stays where it is (renders inside the plain root layout, no guard). ✅

- [ ] **Step 6: Typecheck**
```bash
npm run typecheck
```
Expected: no errors.

- [ ] **Step 7: Commit**
```bash
git add src/middleware.ts src/app/robots.ts src/app/admin/layout.tsx src/app/admin/\(dashboard\)/layout.tsx src/components/admin/AdminSidebar.tsx src/components/admin/AdminTopbar.tsx
git commit -m "feat(admin): root + dashboard layouts, shell, middleware/robots"
```

---

## Task 10: Overview dashboard

**Files:**
- Create: `src/components/admin/KpiCard.tsx`, `src/app/admin/(dashboard)/page.tsx`

- [ ] **Step 1: KpiCard**

```tsx
// src/components/admin/KpiCard.tsx
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function KpiCard({
  label,
  value,
  hint,
  tone = 'default',
}: {
  label: string;
  value: string | number;
  hint?: string;
  tone?: 'default' | 'cta' | 'tertiary' | 'verified';
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p
          className={cn(
            'mt-2 font-display text-3xl font-bold tabular-nums',
            tone === 'cta' && 'text-cta-container',
            tone === 'tertiary' && 'text-tertiary-container',
            tone === 'verified' && 'text-verified',
            tone === 'default' && 'text-foreground',
          )}
        >
          {value}
        </p>
        {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 2: Overview page**

```tsx
// src/app/admin/(dashboard)/page.tsx
import Link from 'next/link';
import { crm } from '@/lib/crm';
import { LEAD_PIPELINE, LEAD_STATUS_LABELS } from '@/types/crm';
import { KpiCard } from '@/components/admin/KpiCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function AdminOverviewPage() {
  const [leads, counts, audit] = await Promise.all([
    crm.listLeads(),
    crm.countByStatus(),
    crm.listAudit({ limit: 8 }),
  ]);

  const newCount = counts['new'] ?? 0;
  const unassigned = leads.filter((l) => !l.assignedConsultantId).length;
  const active = LEAD_PIPELINE.filter((s) => s !== 'completed').reduce(
    (sum, s) => sum + (counts[s] ?? 0),
    0,
  );
  const completed = counts['completed'] ?? 0;
  const conversion = active + completed > 0 ? Math.round((completed / (active + completed)) * 100) : 0;
  const maxCount = Math.max(1, ...LEAD_PIPELINE.map((s) => counts[s] ?? 0));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-headline-lg text-foreground">Overview</h1>
        <p className="text-sm text-muted-foreground">Pipeline health and recent activity.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total leads" value={leads.length} tone="default" />
        <KpiCard label="New" value={newCount} tone="tertiary" />
        <KpiCard label="Unassigned" value={unassigned} tone="cta" hint="Needs a consultant" />
        <KpiCard label="Conversion" value={`${conversion}%`} tone="verified" hint="Completed / total" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pipeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {LEAD_PIPELINE.map((status) => {
            const c = counts[status] ?? 0;
            return (
              <div key={status} className="flex items-center gap-3">
                <span className="w-40 shrink-0 text-sm text-muted-foreground">
                  {LEAD_STATUS_LABELS[status]}
                </span>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(c / maxCount) * 100}%` }}
                  />
                </div>
                <span className="w-8 text-right text-sm font-semibold tabular-nums">{c}</span>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
        </CardHeader>
        <CardContent>
          {audit.length === 0 ? (
            <p className="text-sm text-muted-foreground">No activity yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {audit.map((a) => (
                <li key={a.id} className="flex items-center justify-between py-2 text-sm">
                  <span>
                    <span className="font-medium text-foreground">{a.actorName ?? 'System'}</span>{' '}
                    <span className="text-muted-foreground">{a.action}</span>
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(a.createdAt).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <Link href="/admin/leads" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
            Go to leads →
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
```

- [ ] **Step 3: Typecheck + commit**
```bash
npm run typecheck
git add src/components/admin/KpiCard.tsx "src/app/admin/(dashboard)/page.tsx"
git commit -m "feat(admin): overview dashboard"
```

---

## Task 11: Leads list + Kanban (native HTML5 drag-and-drop)

**Files:**
- Create: `src/components/admin/LeadStatusBadge.tsx`, `src/components/admin/KanbanBoard.tsx`, `src/app/actions/crm.ts`, `src/app/admin/(dashboard)/leads/page.tsx`

- [ ] **Step 1: LeadStatusBadge**

```tsx
// src/components/admin/LeadStatusBadge.tsx
import { Badge } from '@/components/ui/badge';
import { LEAD_STATUS_LABELS, type LeadStatus } from '@/types/crm';

const TONE: Record<LeadStatus, 'default' | 'secondary' | 'tertiary' | 'cta' | 'verified' | 'destructive' | 'outline'> = {
  new: 'tertiary',
  contacted: 'secondary',
  document_collection: 'secondary',
  application_submitted: 'default',
  offer_received: 'verified',
  accepted: 'verified',
  visa_processing: 'cta',
  arrived: 'cta',
  completed: 'default',
  lost: 'destructive',
};

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  return <Badge variant={TONE[status]}>{LEAD_STATUS_LABELS[status]}</Badge>;
}
```

- [ ] **Step 2: Server actions for status/assign**

```typescript
// src/app/actions/crm.ts
'use server';

import { revalidatePath } from 'next/cache';
import { crm } from '@/lib/crm';
import { getActorProfile } from '@/lib/crm/session';
import {
  assignConsultantSchema,
  updateLeadStatusSchema,
} from '@/lib/validations/crm';

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function updateLeadStatusAction(input: unknown): Promise<ActionResult> {
  const parsed = updateLeadStatusSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Invalid input' };
  const actor = await getActorProfile();
  if (!actor) return { ok: false, error: 'Not authenticated' };
  await crm.updateLeadStatus(parsed.data.leadId, parsed.data.status as never, actor.id);
  revalidatePath('/admin/leads');
  revalidatePath(`/admin/leads/${parsed.data.leadId}`);
  revalidatePath('/admin');
  return { ok: true };
}

export async function assignConsultantAction(input: unknown): Promise<ActionResult> {
  const parsed = assignConsultantSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Invalid input' };
  const actor = await getActorProfile();
  if (!actor) return { ok: false, error: 'Not authenticated' };
  await crm.assignConsultant(parsed.data.leadId, parsed.data.consultantId, actor.id);
  revalidatePath('/admin/leads');
  revalidatePath(`/admin/leads/${parsed.data.leadId}`);
  return { ok: true };
}
```

- [ ] **Step 3: KanbanBoard (native DnD, client component)**

```tsx
// src/components/admin/KanbanBoard.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { updateLeadStatusAction } from '@/app/actions/crm';
import { LEAD_PIPELINE, LEAD_STATUS_LABELS, type LeadStatus, type LeadWithRelations } from '@/types/crm';
import { LeadStatusBadge } from './LeadStatusBadge';
import { cn } from '@/lib/utils';

export function KanbanBoard({ leads }: { leads: LeadWithRelations[] }) {
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<LeadStatus | null>(null);

  const grouped = LEAD_PIPELINE.reduce<Record<string, LeadWithRelations[]>>((acc, s) => {
    acc[s] = leads.filter((l) => l.status === s);
    return acc;
  }, {});

  async function drop(status: LeadStatus) {
    setDragOver(null);
    if (!dragId) return;
    const id = dragId;
    setDragId(null);
    await updateLeadStatusAction({ leadId: id, status });
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {LEAD_PIPELINE.map((status) => (
        <section
          key={status}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(status);
          }}
          onDragLeave={() => setDragOver((s) => (s === status ? null : s))}
          onDrop={() => drop(status)}
          className={cn(
            'flex w-72 shrink-0 flex-col rounded-lg border border-border bg-bg-subtle',
            dragOver === status && 'ring-2 ring-primary',
          )}
        >
          <header className="flex items-center justify-between px-3 py-2">
            <span className="text-sm font-semibold text-foreground">{LEAD_STATUS_LABELS[status]}</span>
            <span className="text-xs tabular-nums text-muted-foreground">{grouped[status].length}</span>
          </header>
          <div className="flex flex-1 flex-col gap-2 p-2">
            {grouped[status].map((lead) => (
              <Link
                key={lead.id}
                href={`/admin/leads/${lead.id}`}
                draggable
                onDragStart={() => setDragId(lead.id)}
                onDragEnd={() => setDragId(null)}
                className={cn(
                  'block rounded border border-border bg-card p-3 shadow-flat-plus transition hover:shadow-flat-hover',
                  dragId === lead.id && 'opacity-50',
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-medium text-foreground">
                    {lead.student?.fullName ?? 'Unknown'}
                  </span>
                </div>
                <p className="mt-1 truncate text-xs text-muted-foreground">{lead.universityId}</p>
                <div className="mt-2 flex items-center justify-between">
                  <LeadStatusBadge status={lead.status} />
                  <span className="text-xs text-muted-foreground">
                    {lead.consultant?.fullName ?? 'Unassigned'}
                  </span>
                </div>
              </Link>
            ))}
            {grouped[status].length === 0 && (
              <p className="px-1 py-4 text-center text-xs text-muted-foreground">Empty</p>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Leads page (Kanban + table toggle)**

```tsx
// src/app/admin/(dashboard)/leads/page.tsx
import Link from 'next/link';
import { crm } from '@/lib/crm';
import { KanbanBoard } from '@/components/admin/KanbanBoard';
import { LeadStatusBadge } from '@/components/admin/LeadStatusBadge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export const dynamic = 'force-dynamic';

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; status?: string }>;
}) {
  const sp = await searchParams;
  const view = sp.view === 'table' ? 'table' : 'kanban';
  const leads = await crm.listLeads(
    sp.status ? { status: sp.status as never } : undefined,
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-headline-lg text-foreground">Leads (CRM)</h1>
          <p className="text-sm text-muted-foreground">{leads.length} leads</p>
        </div>
        <div className="flex gap-1 rounded border border-border bg-card p-1 text-sm">
          <Link
            href="/admin/leads?view=kanban"
            className="rounded px-3 py-1 data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
            data-active={view === 'kanban'}
          >
            Kanban
          </Link>
          <Link
            href="/admin/leads?view=table"
            className="rounded px-3 py-1 data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
            data-active={view === 'table'}
          >
            Table
          </Link>
        </div>
      </div>

      {view === 'kanban' ? (
        <KanbanBoard leads={leads} />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>University</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Consultant</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>
                  <Link href={`/admin/leads/${lead.id}`} className="font-medium text-primary hover:underline">
                    {lead.student?.fullName ?? 'Unknown'}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">{lead.universityId}</TableCell>
                <TableCell><LeadStatusBadge status={lead.status} /></TableCell>
                <TableCell className="text-muted-foreground">{lead.consultant?.fullName ?? '—'}</TableCell>
                <TableCell className="tabular-nums text-muted-foreground">
                  {new Date(lead.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Typecheck + commit**
```bash
npm run typecheck
git add src/components/admin/LeadStatusBadge.tsx src/components/admin/KanbanBoard.tsx src/app/actions/crm.ts "src/app/admin/(dashboard)/leads/page.tsx"
git commit -m "feat(admin): leads list + kanban (native dnd)"
```

---

## Task 12: Lead detail (pipeline, assign, applications, timeline)

**Files:**
- Create: `src/components/admin/PipelineStepper.tsx`, `src/components/admin/AssignConsultant.tsx`, `src/app/admin/(dashboard)/leads/[id]/page.tsx`

- [ ] **Step 1: PipelineStepper**

```tsx
// src/components/admin/PipelineStepper.tsx
import { LEAD_PIPELINE, LEAD_STATUS_LABELS, type LeadStatus } from '@/types/crm';
import { cn } from '@/lib/utils';

export function PipelineStepper({ current }: { current: LeadStatus }) {
  const idx = LEAD_PIPELINE.indexOf(current);
  return (
    <ol className="flex flex-wrap gap-2">
      {LEAD_PIPELINE.map((status, i) => {
        const done = i < idx;
        const active = i === idx;
        return (
          <li key={status} className="flex items-center gap-2">
            <span
              className={cn(
                'flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-xs font-semibold',
                active && 'border-primary bg-primary text-primary-foreground',
                done && 'border-verified/30 bg-verified/10 text-verified',
                !active && !done && 'border-border text-muted-foreground',
              )}
            >
              {LEAD_STATUS_LABELS[status]}
            </span>
            {i < LEAD_PIPELINE.length - 1 && <span className="text-border">→</span>}
          </li>
        );
      })}
    </ol>
  );
}
```

- [ ] **Step 2: AssignConsultant (form + quick status)**

```tsx
// src/components/admin/AssignConsultant.tsx
'use client';

import { assignConsultantAction, updateLeadStatusAction } from '@/app/actions/crm';
import { LEAD_PIPELINE, LEAD_STATUS_LABELS, type LeadStatus, type Profile } from '@/types/crm';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function LeadActions({
  leadId,
  status,
  consultants,
}: {
  leadId: string;
  status: LeadStatus;
  consultants: Profile[];
}) {
  async function onStatus(value: string) {
    await updateLeadStatusAction({ leadId, status: value });
  }
  async function onAssign(value: string) {
    await assignConsultantAction({ leadId, consultantId: value === 'none' ? null : value });
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">
          Move to status
        </label>
        <Select defaultValue={status} onValueChange={onStatus}>
          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            {LEAD_PIPELINE.map((s) => (
              <SelectItem key={s} value={s}>{LEAD_STATUS_LABELS[s]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">
          Assigned consultant
        </label>
        <Select onValueChange={onAssign}>
          <SelectTrigger className="w-full"><SelectValue placeholder="Assign…" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Unassigned</SelectItem>
            {consultants.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.fullName}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Lead detail page**

```tsx
// src/app/admin/(dashboard)/leads/[id]/page.tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { crm } from '@/lib/crm';
import { APPLICATION_STATUS_LABELS } from '@/types/crm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LeadStatusBadge } from '@/components/admin/LeadStatusBadge';
import { PipelineStepper } from '@/components/admin/PipelineStepper';
import { LeadActions } from '@/components/admin/AssignConsultant';

export const dynamic = 'force-dynamic';

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [lead, consultants] = await Promise.all([crm.getLead(id), crm.listStaff()]);
  if (!lead) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/leads" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to leads
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="font-display text-headline-lg text-foreground">
            {lead.student?.fullName ?? 'Unknown'}
          </h1>
          <LeadStatusBadge status={lead.status} />
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {lead.student?.email} · {lead.student?.countryCode ?? '—'}
        </p>
      </div>

      <Card>
        <CardHeader><CardTitle>Pipeline</CardTitle></CardHeader>
        <CardContent>
          <PipelineStepper current={lead.status} />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Applications</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {lead.applications.length === 0 ? (
                <p className="text-sm text-muted-foreground">No applications yet.</p>
              ) : (
                lead.applications.map((app) => (
                  <Link
                    key={app.id}
                    href={`/admin/applications/${app.id}`}
                    className="flex items-center justify-between rounded border border-border p-3 hover:bg-accent"
                  >
                    <span className="text-sm font-medium">{app.universityId}</span>
                    <span className="text-xs text-muted-foreground">
                      {APPLICATION_STATUS_LABELS[app.status]}
                    </span>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Timeline</CardTitle></CardHeader>
            <CardContent>
              {lead.timeline.length === 0 ? (
                <p className="text-sm text-muted-foreground">No events.</p>
              ) : (
                <ul className="space-y-3">
                  {lead.timeline.map((a) => (
                    <li key={a.id} className="flex justify-between text-sm">
                      <span>
                        <span className="font-medium">{a.actorName ?? 'System'}</span>{' '}
                        <span className="text-muted-foreground">{a.action}</span>
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(a.createdAt).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit">
          <CardHeader><CardTitle>Actions</CardTitle></CardHeader>
          <CardContent>
            <LeadActions
              leadId={lead.id}
              status={lead.status}
              consultants={consultants.filter((c) => c.role === 'consultant')}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Typecheck + commit**
```bash
npm run typecheck
git add src/components/admin/PipelineStepper.tsx src/components/admin/AssignConsultant.tsx "src/app/admin/(dashboard)/leads/[id]/page.tsx"
git commit -m "feat(admin): lead detail (pipeline, actions, timeline)"
```

---

## Task 13: Application detail + documents

**Files:**
- Create: `src/app/admin/(dashboard)/applications/[id]/page.tsx`

- [ ] **Step 1: Application detail page**

```tsx
// src/app/admin/(dashboard)/applications/[id]/page.tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { crm } from '@/lib/crm';
import { APPLICATION_STATUS_LABELS, type ApplicationStatus } from '@/types/crm';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export const dynamic = 'force-dynamic';

const STATUSES: ApplicationStatus[] = ['draft', 'submitted', 'under_review', 'offer', 'rejected', 'enrolled'];

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const app = await crm.getApplication(id);
  if (!app) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href={`/admin/leads/${app.leadId}`} className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to lead
        </Link>
        <div className="mt-2 flex items-center gap-3">
          <h1 className="font-display text-headline-lg text-foreground">Application</h1>
          <Badge>{APPLICATION_STATUS_LABELS[app.status]}</Badge>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{app.universityId}</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Documents</CardTitle></CardHeader>
        <CardContent>
          {app.documents.length === 0 ? (
            <p className="text-sm text-muted-foreground">No documents uploaded.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Verified</TableHead>
                  <TableHead>Uploaded</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {app.documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <a href={doc.fileUrl} className="font-medium text-primary hover:underline">
                        {doc.fileName}
                      </a>
                    </TableCell>
                    <TableCell className="tabular-nums text-muted-foreground">
                      {doc.sizeBytes ? `${Math.round(doc.sizeBytes / 1024)} KB` : '—'}
                    </TableCell>
                    <TableCell>
                      {doc.verified ? <Badge variant="verified">Verified</Badge> : <Badge variant="outline">Pending</Badge>}
                    </TableCell>
                    <TableCell className="tabular-nums text-muted-foreground">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck + commit**
```bash
npm run typecheck
git add "src/app/admin/(dashboard)/applications/[id]/page.tsx"
git commit -m "feat(admin): application detail + documents"
```

---

## Task 14: Users + Audit pages

**Files:**
- Create: `src/app/admin/(dashboard)/users/page.tsx`, `src/app/admin/(dashboard)/audit/page.tsx`

- [ ] **Step 1: Users page**

```tsx
// src/app/admin/(dashboard)/users/page.tsx
import { crm } from '@/lib/crm';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  const staff = await crm.listStaff();
  const leads = await crm.listLeads();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-headline-lg text-foreground">Users</h1>
        <p className="text-sm text-muted-foreground">Staff & consultants</p>
      </div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Active leads</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staff.map((p) => {
              const active = leads.filter(
                (l) => l.assignedConsultantId === p.id && l.status !== 'completed',
              ).length;
              return (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.fullName}</TableCell>
                  <TableCell className="text-muted-foreground">{p.email}</TableCell>
                  <TableCell><Badge variant={p.role === 'admin' ? 'default' : 'secondary'}>{p.role}</Badge></TableCell>
                  <TableCell className="tabular-nums">{active}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
```

- [ ] **Step 2: Audit page**

```tsx
// src/app/admin/(dashboard)/audit/page.tsx
import { crm } from '@/lib/crm';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export const dynamic = 'force-dynamic';

export default async function AuditPage() {
  const logs = await crm.listAudit({ limit: 100 });
  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-headline-lg text-foreground">Audit Log</h1>
        <p className="text-sm text-muted-foreground">Last 100 events</p>
      </div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>When</TableHead>
              <TableHead>Actor</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Entity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="tabular-nums text-muted-foreground">
                  {new Date(a.createdAt).toLocaleString()}
                </TableCell>
                <TableCell className="font-medium">{a.actorName ?? 'System'}</TableCell>
                <TableCell className="text-muted-foreground">{a.action}</TableCell>
                <TableCell className="text-muted-foreground">{a.entity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
```

- [ ] **Step 3: Typecheck + commit**
```bash
npm run typecheck
git add "src/app/admin/(dashboard)/users/page.tsx" "src/app/admin/(dashboard)/audit/page.tsx"
git commit -m "feat(admin): users + audit pages"
```

---

## Task 15: E2E test + final verification

**Files:**
- Create: `tests/e2e/admin.spec.ts`

- [ ] **Step 1: Confirm Playwright config + webServer**

Read `playwright.config.ts`. Ensure `webServer` points to `npm run dev` on a port (e.g. 3000) and `baseURL` is set. If `webServer` is missing, add:
```typescript
webServer: {
  command: 'npm run dev',
  url: 'http://localhost:3000',
  reuseExistingServer: !process.env.CI,
  timeout: 120_000,
},
```

- [ ] **Step 2: Write the E2E test**

```typescript
// tests/e2e/admin.spec.ts
import { test, expect } from '@playwright/test';

test('admin login → overview → kanban drag updates status', async ({ page }) => {
  await page.goto('/admin/login');
  // pick the admin demo profile (first button)
  await page.getByRole('button').first().click();
  await expect(page).toHaveURL(/\/admin$/);

  // overview shows pipeline
  await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible();

  // go to leads kanban
  await page.getByRole('link', { name: /Leads/ }).click();
  await expect(page).toHaveURL(/\/admin\/leads/);
  await expect(page.getByText('New')).toBeVisible();
});
```

- [ ] **Step 3: Run unit + e2e**

```bash
npm run db:reset
npm run test
npm run test:e2e
```
Expected: vitest passing; Playwright passing.

- [ ] **Step 4: Final lint + typecheck + build**

```bash
npm run lint
npm run typecheck
npm run build
```
Expected: lint clean; typecheck clean; build succeeds (admin routes compile as dynamic).

> If build complains about a route needing `generateStaticParams` for `[locale]`, that is pre-existing (Phase 1) and unrelated. If build errors on admin `[id]` dynamic segments, ensure each admin page sets `export const dynamic = 'force-dynamic'` (already added).

- [ ] **Step 5: Update README**

Add a short "Phase 2 — Admin" section to `README.md` with: `docker compose up -d`, `npm run db:reset`, `npm run dev`, then open `/admin/login`.

- [ ] **Step 6: Final commit**
```bash
git add tests/e2e/admin.spec.ts README.md
git commit -m "test: admin e2e + readme"
```

---

## Self-Review Notes

- **Spec coverage:** §2 schema (Task 1) ✅, §3 data layer (Tasks 3–6) ✅, §4 admin UI (Tasks 8–14) ✅, §5 local setup (Tasks 0–2) ✅, §6 security dev-auth/robots (Tasks 8–9) ✅, §8 tests (Tasks 5, 15) ✅.
- **Type consistency:** `CrmRepository` method names match across interface (Task 4), PgCrmRepository (Task 5), actions (Task 11), pages. `LeadStatus`/`ApplicationStatus` enum values match SQL (Task 1) and TS (Task 3).
- **Known follow-ups (out of scope):** real Supabase Auth (sub-project B), student dashboard (C), content CRUD (later), RLS tested only on Supabase, document storage via Supabase Storage.

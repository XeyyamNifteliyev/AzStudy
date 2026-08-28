# Türkiyədə Təhsil Platforması — Phase 2: Backend Foundation + Admin/CRM Panel (Dizayn Sənədi)

> **Mənbə spesifikasiya:** `Study.md` (tam 16–20 həftəlik enterprise platforma), `docs/superpowers/specs/2026-07-30-study-platform-phase1-design.md`.
> **Dizayn sistemi:** `design/kinetic_horizon/DESIGN.md` (Kinetic Horizon — Precision Minimalism).
> Bu sənəd Faza 2-nin **ilk alt-sistemini** əhatə edir: (A) backend təməli — DB sxemi, xam SQL migration-ları, transactional data qatı — və (D) Admin/CRM paneli.

---

## 0. Qərarlar (brainstorming nəticəsi)

| Qərar | Seçim | Səbəb |
|---|---|---|
| Backend infrastrukturu | Supabase hələ yoxdur → **lokal Postgres (Docker)** ilə inkişaf, Supabase-a hazır | İstifadəçi daha sonra açar verib flip edəcək |
| ORM | **Yoxdur** — xam SQL migration-lar + nazik data qatı | Prisma Supabase RLS/auth.users ilə gərginlik yaradır; istifadəçi SQL-i əl ilə Supabase-a kopyalayacaq |
| Data qatı istifadəçi tərəfi | lokal `pg` (node-postgres) → prod `@supabase/supabase-js` | Hər ikisi eyni `CrmRepository` interfeysi; tək flip nöqtəsi |
| Data scope | **Yalnız transactional cədvəllər** | Məzmun datası (universitet/proqram) seed-də qalır; content-in DB-yə köçürülməsi növbəti fazaya (D-nin genişlənməsi) |
| Admin route | `app/admin/*` — `[locale]` altında deyil | Daxili alət, tək dil (EN), SEO-yə/hreflang-a ehtiyac yoxdur |
| Auth | **Dev-auth placeholder** (sadə session) | Real Supabase Auth növbəti alt-sistemdir (B) |

---

## 1. Məqsəd və Əhatə

### Daxildir
- **Database sxemi** (xam SQL, Supabase-a deploy-hazır): `profiles`, `leads`, `applications`, `application_documents`, `audit_logs` + enum-lar + RLS + trigger-lar
- **Migration aləti** (sadə `.sql` faylları + lokal runner scripti; istifadəçi bunları Supabase SQL editor-da ardıcıllıqla işə salacaq)
- **Transactional data qatı** — mövcud oxuma `DataLayer`-i ilə paralel; `CrmRepository` interfeysi, `PgCrmRepository` (lokal) və `SupabaseCrmRepository` (prod, stub)
- **Admin/CRM paneli** (Kinetic Horizon dizaynı ilə): shell + overview + CRM lead-ləri (siyahı/Kanban/detal) + applications + istifadəçilər + audit log
- **Lokal inkişaf setup**: `docker-compose.yml` (postgres:16), seed SQL (demo konsultant + ~15 lead), tip təhlükəsizliyi üçün əl ilə yazılmış TS tipləri
- **Testlər**: Vitest (data qatı/repo) + Playwright (admin əsas axınları)

### Xaricdədir (növbəti alt-sistemlər)
- Real Supabase Auth (OTP, Google/Apple OAuth) — alt-sistem B
- Tələbə dashboard-u (istifadəçi tərəfi) — alt-sistem C
- Universities/Programs CRUD, Translations, SEO panel, Media library, Analytics, AI alətləri — content DB-yə köçdükdən sonra

---

## 2. Database Sxemi (xam SQL)

### 2.1 Enum-lar
```sql
create type user_role        as enum ('student','consultant','admin','editor');
create type lead_status      as enum ('new','contacted','document_collection','application_submitted','offer_received','accepted','visa_processing','arrived','completed','lost');
create type application_status as enum ('draft','submitted','under_review','offer','rejected','enrolled');
```

### 2.2 Cədvəllər
- **`profiles`** `(id uuid PK → auth.users.id, email, full_name, role user_role, phone, whatsapp, country_code, avatar_url, created_at, updated_at)`
  - Supabase-də `auth.users`-a FK; **lokal versiyada** FK yoxdur (sadəcə uuid), çünki `auth` sxeması lokalda mövcud deyil.
- **`leads`** `(id, user_id → profiles, university_id text, program_id text, status lead_status, source, assigned_consultant_id → profiles, notes, created_at, updated_at)`
  - `university_id` / `program_id` **soft-ref**-dir (seed məlumatına istinad, FK yox) — content DB-yə köçənə qədər.
- **`applications`** `(id, lead_id → leads, university_id text, program_id text, status application_status, assigned_consultant_id → profiles, notes, created_at, updated_at)`
  - Bir lead → çox application (tələbə birdən çox universitetə müraciət edə bilər).
- **`application_documents`** `(id, application_id → applications, file_name, file_url, mime_type, size_bytes, verified bool, uploaded_by → profiles, created_at)`
- **`audit_logs`** `(id, user_id → profiles, action text, entity text, entity_id uuid, metadata jsonb, created_at)`

### 2.3 Index-lər
`leads(status)`, `leads(assigned_consultant_id)`, `leads(user_id)`, `applications(lead_id)`, `application_documents(application_id)`, `audit_logs(entity, entity_id)`, `audit_logs(user_id)`.

### 2.4 Trigger-lar
- `set_updated_at()` — `profiles`, `leads`, `applications` üçün `updated_at` avtomatik yeniləmə.
- `handle_new_user()` — **Supabase-only**: signup zamanı `auth.users`-a yeni istifadəçi düşəndə `profiles` cədvəlinə avtomatik sətir əlavə edir. Lokalda aktiv deyil.

### 2.5 Row Level Security (RLS) — xam SQL
- Köməkçi funksiyalar: `is_staff()` (admin/consultant/editor), `is_admin()`.
- **profiles**: istifadəçi öz profilini oxuyur/yeniləyir; staff hamısını oxuyur; admin hamısını yeniləyir.
- **leads**: tələbə yalnız öz lead-lərini görür; təyin olunmuş konsultant görür; staff hamısını oxuyur; yazma yalnız staff-a.
- **applications**: oxşar; həmçinin lead üzərindən sahib yoxlanışı.
- **application_documents**: staff yazır; tələbə yalnız öz application-larının sənədlərini oxuyur.
- **audit_logs**: yalnız admin oxuyur.
- **Vacib qeyd:** lokal dev-də RLS aktivləşdirilmir (auth.uid() yoxdur); `pg` birbaşa qoşulur. Supabase-a köçürəndə RLS faylı işə salınır.

### 2.6 Migration fayl quruluşu
```
supabase/migrations/
  0001_enums.sql
  0002_tables.sql          (lokal variant: profiles FK-sız)
  0003_indexes.sql
  0004_functions_triggers.sql
  0005_rls.sql             (yalnız Supabase üçün; lokalda skip)
  0006_auth_trigger.sql    (yalnız Supabase; lokalda skip)
supabase/seed.sql          (demo data: 1 admin, 2 consultant, 15 lead)
```
Lokal runner: `scripts/migrate.ts` — `pg` ilə faylları ardıcıllıqla işə salır, `0005`/`0006`-nı skip edir.

---

## 3. Transactional Data Qatı

Mövcud oxuma `DataLayer`-i (`src/lib/data/`) dəyişmir. Onun yanına **CRM/transactional** qatı əlavə olunur — eyni adapter pattern.

### 3.1 İnterfeys (`src/lib/crm/repositories.ts`)
```ts
export interface CrmRepository {
  // leads
  listLeads(filter?: LeadFilter): Promise<LeadWithRelations[]>
  getLead(id: string): Promise<LeadDetail | null>
  createLead(input: NewLeadInput): Promise<Lead>
  updateLeadStatus(id: string, status: LeadStatus, actorId: string): Promise<Lead>
  assignConsultant(leadId: string, consultantId: string, actorId: string): Promise<Lead>
  // applications
  listApplications(leadId: string): Promise<Application[]>
  getApplication(id: string): Promise<ApplicationDetail | null>
  updateApplicationStatus(id: string, status: ApplicationStatus, actorId: string): Promise<Application>
  // documents
  listDocuments(applicationId: string): Promise<ApplicationDocument[]>
  addDocument(input: NewDocumentInput): Promise<ApplicationDocument>
  // users
  listStaff(): Promise<Profile[]>           // consultants/admins
  // audit
  writeAudit(entry: AuditEntryInput): Promise<void>
  listAudit(filter?: AuditFilter): Promise<AuditLog[]>
}
```
Hər yazma əməliyyatı **audit log** yazır (audit interseptor/repository daxilində).

### 3.2 Implementasiyalar
- **`PgCrmRepository`** (`src/lib/crm/pg-repository.ts`) — `pg` (node-postgres) Pool ilə lokal Postgres qarşı. Tip-təhlükəsiz xam SQL sorğuları.
- **`SupabaseCrmRepository`** (`src/lib/crm/supabase-repository.ts`) — **stub** (bu fazada interfeys tətbiq edir, lakin `NEXT_PUBLIC_SUPABASE_*` yoxdursa atır). Növbəti fazada tamamlanır.

### 3.3 Flip nöqtəsi (`src/lib/crm/index.ts`)
```ts
function createCrmLayer(): CrmRepository {
  if (process.env.SUPABASE_ENABLED === 'true') return createSupabaseCrm();
  return createPgCrm(process.env.DATABASE_URL!);
}
export const crm: CrmRepository = createCrmLayer();
```

### 3.4 Tiplər (`src/types/crm.ts`)
Əl ilə yazılmış TS tipləri (`Lead`, `Application`, `Profile`, `AuditLog`, input/filter tipləri). Supabase qoşulanda `supabase gen types` avtomatik tiplər əvəz edə bilər, amma interfeys sabit qalır.

---

## 4. Admin Panel UI (Kinetic Horizon)

### 4.1 Route quruluşu
`app/admin/*` — **`[locale]` altında deyil**. Middleware (`src/middleware.ts`) yenilənir: `/admin` prefiksi locale-matching-dən çıxarılır. Admin EN-bir dildir.

```
app/admin/
  layout.tsx                 → admin shell: sidebar + topbar + dev-auth guard
  page.tsx                   → Overview (KPI kartları, son aktivlik)
  leads/
    page.tsx                 → Leads siyahı + Kanban toggle
    [id]/page.tsx            → Lead detalı (timeline, status pipeline, assign, applications)
  applications/
    [id]/page.tsx            → Application detalı + sənədlər + status
  users/
    page.tsx                 → Staff/consultant idarəetməsi (siyahı + rol)
  audit/
    page.tsx                 → Audit log (filtr, səhifələmə)
  login/
    page.tsx                 → Dev-auth giriş (placeholder; B fazasında əvəz olunur)
```

### 4.2 Dev-Auth (placeholder)
- Sadə server-side session: `/admin/login` forması → demo istifadəçi seçimi (admin/consultant seed-dən) → httpOnly cookie `admin_session`.
- `app/admin/layout.tsx` cookie yoxlayır; yoxdursa `/admin/login`-ə yönləndirir.
- **Heç bir real təhlükəsizlik təklif etmir** — yalnız inkişaf/demonstrasiya üçün. B fazasında Supabase Auth + middleware JWT yoxlaması ilə əvəz olunacaq.
- robots.txt və middleware `/admin`-i bloklayır (SEO və public girişə qarşı).

### 4.3 Modullar (MVP)

**Overview (`/admin`)**
- KPI kartları: ümumi lead-lər, bu həftə yeni, pipeline mərhələsi üzrə say, konversiya nisbəti, təyin olunmamış lead-lər.
- Son aktivlik axını (audit log-dan son 10).
- Pipeline vizualizasiyası (status üzrə bar/funnel).

**CRM Leads (`/admin/leads`) — CORE**
- Görünüş toggle: **Siyahı cədvəli** ↔ **Kanban board** (status sütunları üzrə drag-ready kartlar).
- Filtr: status, konsultant, mənbə, universitet, tarix.
- Axtarış (ad/email/universitet).
- Lead kartı: ad, status badge, konsultant avatarı, universitet, son yenilənmə.
- Bulk əməliyyatlar: konsultant təyin et, status dəyiş.

**Lead Detalı (`/admin/leads/[id]`)**
- Sol: profil məlumatı (ad, əlaqə, ölkə, mənbə), status pipeline stepper.
- Mərkəz: timeline (audit log hadisələri), qeydlər.
- Sağ: applications siyahısı, təyin olunmuş konsultant dəyişdirici.
- Status dəyiş → audit log yazılır.

**Applications (`/admin/applications/[id]`)**
- Application məlumatı, status, sənəd siyahısı (yüklə/verify et), qeydlər.

**Users (`/admin/users`)**
- Staff siyahısı (admin/consultant/editor), rol badge, hər konsultantın aktiv lead sayı.
- Rol dəyiş (read-only yaxud minimal — rol CRUD B fazasında auth ilə gəlir).

**Audit Log (`/admin/audit`)**
- Cədvəl: vaxt, istifadəçi, əməliyyat, obyekt, metadata. Filtr + səhifələmə.

### 4.4 UI komponentləri
- Mövcud `components/ui/*` (shadcn primitives: button, card, table, badge, dialog, select, tabs, avatar, dropdown, separator) yenidən istifadə.
- Yeni: `components/admin/` → `AdminSidebar`, `AdminTopbar`, `KpiCard`, `KanbanBoard`, `KanbanCard`, `LeadStatusBadge`, `PipelineStepper`, `DataTable` (səhifələmə/sıralama/filtr wrapper).
- Kinetic Horizon token-ləri: deep blue primary (nav/aksiyalar), orange secondary (CTA), cyan (data vizualizasiyası/tags), `tabular-nums` rəqəm sütunları üçün, tonal elevation (gölge yox).

---

## 5. Lokal İnkişaf Setup

### 5.1 Docker (`docker-compose.yml`)
```yaml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: study_crm
      POSTGRES_USER: study
      POSTGRES_PASSWORD: study
    ports: ["5433:5432"]     # 5433 — lokal conflict-un qarşısını almaq üçün
    volumes:
      - study_pgdata:/var/lib/postgresql/data
volumes:
  study_pgdata:
```

### 5.2 Ətraf mühit (`.env.local`)
```
DATABASE_URL=postgresql://study:study@localhost:5433/study_crm
SUPABASE_ENABLED=false
```
> **Vacib:** `.env.local` heç vaxt commit olunmur (`.gitignore`-da). Nümunə `.env.example` commit olunur.

### 5.3 Skriptlər (`package.json`)
- `db:up` — `docker compose up -d`
- `db:migrate` — `tsx scripts/migrate.ts` (lokal SQL runner)
- `db:seed` — seed SQL-i işə salır
- `db:reset` — drop + migrate + seed

### 5.4 Əlavə asılılıqlar
- `pg` (node-postgres), `@types/pg`
- `tsx` (dev — SQL runner və gələcək seed scriptləri üçün)
- `@supabase/supabase-js` (prod stub üçün)

---

## 6. Təhlükəsizlik (bu fazada)

- **Dev-auth yalnız placeholder** — production-a getməz. README-də aydın xəbərdarlıq.
- RLS siyasətləri yazılır (SQL), lakin yalnız Supabase-da aktivləşir; lokalda `pg` superuser kimi qoşulur.
- Input validasiyası: Zod schema-ları hər admin forması üçün (`lib/validations/crm.ts`).
- Server Actions: revalidate + rate-limit hazırlığı (in-memory bu fazada).
- `robots.txt` + middleware `/admin`-i indexlamır və public girişdən qoruyur (dev-auth).
- **Sənəd şifrələmə** (pasport/diplom) bu fazaya daxil deyil — fayllar `file_url` kimi saxlanır, real storage Supabase Storage ilə gəlir (C fazası).

---

## 7. Performans

- Admin səhifələri SSR (server-side) — hər render `crm` qatından oxuyur (data canlı dəyişir, keşlənmir).
- Siyahı/Kanban: server-side səhifələmə + limit (defolt 50). Limit olmadan tam yüklənmir.
- Kanban drag-and-drop: yüngül (HTML5 drag API və ya `@dnd-kit/core`), minimal JS.
- `tabular-nums` rəqəm düzülüşü üçün (Kinetic Horizon).

---

## 8. Test Strategiyası

- **Vitest (unit):** `CrmRepository` əməliyyatları lokal Postgres (test DB) qarşı; audit log yazma yoxlanışı; Zod validation-lar.
- **Playwright (E2E):** admin login → overview → leads Kanban → lead detal → status dəyiş → audit-də görünür.
- CI gələcəkdə: lint + typecheck + test + build.

---

## 9. Qovluq Strukturu (əlavələr)

```
study/
  docker-compose.yml
  scripts/migrate.ts
  supabase/
    migrations/0001..0006_*.sql
    seed.sql
  src/
    app/admin/{layout,page,login,leads,applications,users,audit}/
    components/admin/{AdminSidebar,AdminTopbar,KpiCard,KanbanBoard,...}.tsx
    lib/crm/{repositories,pg-repository,supabase-repository,index}.ts
    lib/validations/crm.ts
    types/crm.ts
  .env.example
```

---

## 10. İcra Topluları (yüksək səviyyə)

0. Setup: `docker-compose`, `.env.example`, `pg`/`tsx`/`@supabase/supabase-js` asılılıqları, npm skriptləri
1. SQL migration-ları (`0001`–`0006`) + lokal runner `scripts/migrate.ts` + seed
2. Tiplər (`types/crm.ts`) + `CrmRepository` interfeysi
3. `PgCrmRepository` tam implementasiya + audit interseptor
4. `SupabaseCrmRepository` stub + flip nöqtəsi
5. Zod validation-ları (`lib/validations/crm.ts`)
6. Admin shell: `layout.tsx`, sidebar, topbar, dev-auth (login + cookie guard), middleware `/admin` xarici
7. Overview dashboard + KPI kartları
8. CRM Leads: siyahı + Kanban + filtr/axtarış
9. Lead detalı + status pipeline + konsultant təyini + applications
10. Applications detal + sənədlər + Users + Audit log
11. Vitest + Playwright testləri
12. lint + typecheck + build + README yeniləmə

---

## 11. Risklər və Qeydlər

- **Dev-auth production-a uyğun deyil** — bu fazada yalnız demo. Real auth məcburi şəkildə B fazasına (Supabase Auth).
- **Soft-ref `university_id`**: content DB-yə köçənə qədər istinad bütövlüyü yoxdur; silinmiş seed universitetinə "phantom" lead yaranmaması üçün admin UI oxunan universitet yoxdursa xəbərdarlıq göstərir.
- **RLS lokalda test olunmur** — yalnız Supabase-da. Bu, Supabase qoşulanda ayrıca test tsikli tələb edir.
- **Git repo kökü `C:\Users\Asus`-dır** — commit zamanı yalnız `study/` daxilindəki fayllar stage olunmalıdır.
- `pg` ilə qoşulma lokalda superuser olduğu üçün RLS bypass olunur — bu dev üçün qəbuledilər, prod üçün Supabase client istifadə olunacaq.

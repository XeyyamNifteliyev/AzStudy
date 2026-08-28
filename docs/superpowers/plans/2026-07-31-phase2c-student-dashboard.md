# Phase 2C — Student Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the localized student dashboard (applications status, documents, messaging, notifications) against the existing CRM layer, using a dev-auth student session and Supabase Storage for document upload.

**Architecture:** Extend the single `CrmRepository` adapter with student-scoped methods (pg impl); add a `messages` table + Storage bucket; introduce a `student_session` dev-auth cookie mirroring the admin pattern; split marketing chrome into a `(marketing)` route group so `app/[locale]/dashboard/*` gets a focused shell. All dashboard pages are SSR (`force-dynamic`).

**Tech Stack:** Next.js 15 App Router, TypeScript, next-intl, Tailwind/shadcn (Kinetic Horizon), node-postgres, @supabase/supabase-js (Storage), Zod, Vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-07-31-study-platform-phase2c-student-dashboard-design.md`

**Conventions:**
- Repo methods that mutate write an `audit_logs` row (existing pattern).
- `CrmRepository` interface lives in `src/lib/crm/repositories.ts`; pg impl in `src/lib/crm/pg-repository.ts`; flip point in `src/lib/crm/index.ts`.
- DB-dependent Vitest tests run against the seeded local Postgres (`npm run db:reset` first).
- `npm run typecheck` = `tsc --noEmit`. Commit after each task.

**Type reference (defined in Task 4 — use these exact names later):**
- `Message`, `MessageWithSender`, `StudentNotification`, `NewMessageInput`, `NewDocumentUploadInput`
- `StudentNotification.type` ∈ `'status_change' | 'assigned' | 'message'`

**Method reference (defined in Task 5 interface, implemented Tasks 6–8):**
- `listStudents()`, `listMyLeads(userId)`, `listMyApplications(userId)`, `listMyDocuments(userId)`
- `listMessages(leadId)`, `sendMessage(input)`, `markThreadRead(leadId, readerId)`, `unreadMessageCount(userId)`
- `listNotifications(userId, limit?)`, `addStudentDocument(input)`

---

## Task 1: `messages` table migration

**Files:**
- Create: `supabase/migrations/0008_messages.sql`

- [ ] **Step 1: Create the migration**

```sql
-- 0008_messages.sql  (runs locally + on Supabase — table + index only; RLS is in 0005_rls.sql)
create table if not exists public.messages (
  id         uuid primary key default gen_random_uuid(),
  lead_id    uuid not null references public.leads(id) on delete cascade,
  sender_id  uuid not null references public.profiles(id) on delete cascade,
  body       text not null check (length(trim(body)) > 0),
  created_at timestamptz not null default now(),
  read_at    timestamptz
);

create index if not exists messages_lead_created_idx on public.messages(lead_id, created_at);
```

- [ ] **Step 2: Apply locally**

Run: `npm run db:reset`
Expected: `→ applying 0008_messages.sql` then `✓ done` (resets + reseeds).

- [ ] **Step 3: Verify table exists**

Run: `docker exec study_crm_db psql -U study -d study_crm -c "\d public.messages"`
Expected: column list including `lead_id`, `sender_id`, `body`, `read_at`.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/0008_messages.sql
git commit -m "feat(db): 0008 messages table for student<->consultant chat"
```

---

## Task 2: Messages RLS policies (Supabase-only)

**Files:**
- Modify: `supabase/migrations/0005_rls.sql` (append before the final newline)

- [ ] **Step 1: Append messages policies to `0005_rls.sql`**

Add at the end of the file:

```sql

-- messages (Phase 2C)
alter table public.messages enable row level security;

drop policy if exists "messages_read" on public.messages;
create policy "messages_read" on public.messages for select using (
  exists (select 1 from public.leads l where l.id = messages.lead_id
          and (l.user_id = auth.uid() or l.assigned_consultant_id = auth.uid()))
);

drop policy if exists "messages_insert" on public.messages;
create policy "messages_insert" on public.messages for insert with check (
  sender_id = auth.uid()
  and exists (select 1 from public.leads l where l.id = messages.lead_id
          and (l.user_id = auth.uid() or l.assigned_consultant_id = auth.uid()))
);
```

- [ ] **Step 2: Verify `migrate.ts` still skips 0005 locally**

Run: `npm run db:reset`
Expected: `↩ skip (supabase-only) 0005_rls.sql` in output (local pg has no `auth.uid()`).

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/0005_rls.sql
git commit -m "feat(db): messages RLS policies (supabase-only)"
```

---

## Task 3: Storage bucket migration + local skip

**Files:**
- Create: `supabase/migrations/0009_storage_bucket.sql`
- Modify: `scripts/migrate.ts:13` (`SKIP_LOCAL` array)

- [ ] **Step 1: Create the bucket migration**

```sql
-- 0009_storage_bucket.sql — Supabase only. Creates the private bucket for student documents.
insert into storage.buckets (id, name, public)
values ('application-documents', 'application-documents', false)
on conflict (id) do nothing;

-- Student may write objects only under their own prefix: "<userId>/..."
drop policy if exists "docs_storage_write" on storage.objects;
create policy "docs_storage_write" on storage.objects for insert to authenticated with check (
  bucket_id = 'application-documents'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Student reads own prefix; staff reads all.
drop policy if exists "docs_storage_read" on storage.objects;
create policy "docs_storage_read" on storage.objects for select to authenticated using (
  bucket_id = 'application-documents'
  and ((storage.foldername(name))[1] = auth.uid()::text or public.is_staff())
);
```

- [ ] **Step 2: Add `0009` to the local skip list**

In `scripts/migrate.ts`, change:

```ts
const SKIP_LOCAL = ['0005_rls.sql', '0006_auth_trigger.sql', '0007_link_profiles_to_auth_users.sql'];
```

to:

```ts
const SKIP_LOCAL = [
  '0005_rls.sql',
  '0006_auth_trigger.sql',
  '0007_link_profiles_to_auth_users.sql',
  '0009_storage_bucket.sql',
];
```

- [ ] **Step 3: Verify it is skipped locally**

Run: `npm run db:migrate`
Expected: `↩ skip (supabase-only) 0009_storage_bucket.sql`.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/0009_storage_bucket.sql scripts/migrate.ts
git commit -m "feat(db): 0009 storage bucket application-documents (supabase-only)"
```

---

## Task 4: Types for messages, notifications, inputs

**Files:**
- Modify: `src/types/crm.ts` (append before the `LEAD_PIPELINE` const)

- [ ] **Step 1: Add the types**

Append to `src/types/crm.ts` (insert after the `AuditEntryInput` interface, before `// Ordered pipeline…`):

```ts
export interface Message {
  id: string;
  leadId: string;
  senderId: string;
  body: string;
  createdAt: string;
  readAt: string | null;
}

export interface MessageWithSender extends Message {
  senderName: string;
  senderRole: UserRole;
}

export type StudentNotificationType = 'status_change' | 'assigned' | 'message';

export interface StudentNotification {
  id: string;
  type: StudentNotificationType;
  leadId: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
  read: boolean;
}

export interface NewMessageInput {
  leadId: string;
  senderId: string;
  body: string;
}

export interface NewDocumentUploadInput {
  applicationId: string;
  fileName: string;
  filePath: string;
  mimeType: string;
  sizeBytes: number;
  uploadedBy: string;
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: PASS (types only, no consumers yet).

- [ ] **Step 3: Commit**

```bash
git add src/types/crm.ts
git commit -m "feat(types): message, notification, student input types"
```

---

## Task 5: `CrmRepository` interface additions

**Files:**
- Modify: `src/lib/crm/repositories.ts` (extend the interface)

- [ ] **Step 1: Add imports + methods**

In `src/lib/crm/repositories.ts`, add `Message`, `MessageWithSender`, `NewMessageInput`, `NewDocumentUploadInput`, `StudentNotification` to the existing type import from `@/types/crm`, then add these lines to the `CrmRepository` interface (after `listAudit`):

```ts
  // student-scoped (Phase 2C)
  listStudents(): Promise<Profile[]>;
  listMyLeads(userId: string): Promise<LeadWithRelations[]>;
  listMyApplications(userId: string): Promise<Application[]>;
  listMyDocuments(userId: string): Promise<ApplicationDocument[]>;
  listMessages(leadId: string): Promise<MessageWithSender[]>;
  sendMessage(input: NewMessageInput): Promise<Message>;
  markThreadRead(leadId: string, readerId: string): Promise<void>;
  unreadMessageCount(userId: string): Promise<number>;
  listNotifications(userId: string, limit?: number): Promise<StudentNotification[]>;
  addStudentDocument(input: NewDocumentUploadInput): Promise<ApplicationDocument>;
```

- [ ] **Step 2: Typecheck (expect PgCrmRepository to fail — that's the point)**

Run: `npm run typecheck`
Expected: FAIL — `createPgCrm` return is missing the new methods. This is resolved in Tasks 6–8.

- [ ] **Step 3: Commit**

```bash
git add src/lib/crm/repositories.ts
git commit -m "feat(crm): student-scoped methods on CrmRepository interface"
```

---

## Task 6: Pg impl — students, my leads/applications/documents

**Files:**
- Modify: `src/lib/crm/pg-repository.ts` (add imports + 4 methods to the returned object)
- Test: `tests/unit/student-repository.test.ts` (create)

- [ ] **Step 1: Write the failing tests**

Create `tests/unit/student-repository.test.ts`:

```ts
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Pool } from 'pg';
import { createPgCrm } from '@/lib/crm/pg-repository';
import type { CrmRepository } from '@/lib/crm/repositories';

const STUDENT = '44444444-4444-4444-4444-444444444444'; // Ali Veli (seed)
let pool: Pool;
let crm: CrmRepository;

beforeEach(async () => {
  pool = new Pool({ connectionString: process.env.DATABASE_URL!, max: 3 });
  crm = createPgCrm(() => pool);
});

afterEach(async () => {
  await pool.end();
});

describe('student-scoped reads', () => {
  it('lists students only', async () => {
    const students = await crm.listStudents();
    expect(students.length).toBeGreaterThan(0);
    expect(students.every((s) => s.role === 'student')).toBe(true);
  });

  it('lists the student own leads', async () => {
    const leads = await crm.listMyLeads(STUDENT);
    expect(leads.length).toBeGreaterThan(0);
    expect(leads.every((l) => l.userId === STUDENT)).toBe(true);
  });

  it('lists the student own applications (via leads)', async () => {
    const apps = await crm.listMyApplications(STUDENT);
    expect(Array.isArray(apps)).toBe(true);
  });

  it('lists the student own documents (via leads)', async () => {
    const docs = await crm.listMyDocuments(STUDENT);
    expect(Array.isArray(docs)).toBe(true);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- student-repository`
Expected: FAIL — `crm.listStudents is not a function`.

- [ ] **Step 3: Add the type imports to `pg-repository.ts`**

Extend the `import type { … } from '@/types/crm';` block in `src/lib/crm/pg-repository.ts` to also import: `Message`, `MessageWithSender`, `NewMessageUploadInput` is not a thing — import `NewDocumentUploadInput`, `NewMessageInput`, `StudentNotification`. (Add: `LeadWithRelations` already imported; ensure `Message`, `MessageWithSender`, `NewMessageInput`, `NewDocumentUploadInput`, `StudentNotification` are present.)

- [ ] **Step 4: Implement the four read methods**

Add inside the object returned by `createPgCrm` (e.g., right after `getProfile`):

```ts
    async listStudents(): Promise<Profile[]> {
      const res = await q(`select * from public.profiles where role = 'student' order by full_name`);
      return res.rows.map(rowToProfile);
    },

    async listMyLeads(userId: string): Promise<LeadWithRelations[]> {
      const res = await q(
        `select l.*, s.id s_id, s.full_name s_name, s.email s_email, s.country_code s_country,
                c.id c_id, c.full_name c_name
         from public.leads l
         join public.profiles s on s.id = l.user_id
         left join public.profiles c on c.id = l.assigned_consultant_id
         where l.user_id = $1
         order by l.created_at desc`,
        [userId],
      );
      return res.rows.map((r) => ({
        ...rowToLead(r),
        student: { id: r.s_id, fullName: r.s_name, email: r.s_email, countryCode: r.s_country },
        consultant: r.c_id ? { id: r.c_id, fullName: r.c_name } : null,
      }));
    },

    async listMyApplications(userId: string): Promise<Application[]> {
      const res = await q(
        `select a.* from public.applications a
         join public.leads l on l.id = a.lead_id
         where l.user_id = $1
         order by a.created_at desc`,
        [userId],
      );
      return res.rows.map((r) => ({
        id: r.id, leadId: r.lead_id, universityId: r.university_id, programId: r.program_id,
        status: r.status, assignedConsultantId: r.assigned_consultant_id, notes: r.notes,
        createdAt: r.created_at, updatedAt: r.updated_at,
      }));
    },

    async listMyDocuments(userId: string): Promise<ApplicationDocument[]> {
      const res = await q(
        `select d.* from public.application_documents d
         join public.applications a on a.id = d.application_id
         join public.leads l on l.id = a.lead_id
         where l.user_id = $1
         order by d.created_at desc`,
        [userId],
      );
      return res.rows.map((r) => ({
        id: r.id, applicationId: r.application_id, fileName: r.file_name, fileUrl: r.file_url,
        mimeType: r.mime_type, sizeBytes: r.size_bytes, verified: r.verified,
        uploadedBy: r.uploaded_by, createdAt: r.created_at,
      }));
    },
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test -- student-repository`
Expected: PASS (4 tests). Requires `DATABASE_URL` set + seeded DB.

- [ ] **Step 6: Commit**

```bash
git add src/lib/crm/pg-repository.ts tests/unit/student-repository.test.ts
git commit -m "feat(crm): student-scoped reads (students, leads, applications, documents)"
```

---

## Task 7: Pg impl — messages

**Files:**
- Modify: `src/lib/crm/pg-repository.ts`
- Test: `tests/unit/student-repository.test.ts` (extend)

- [ ] **Step 1: Add failing tests**

Append to the `describe` in `tests/unit/student-repository.test.ts`:

```ts
describe('student messaging', () => {
  const CONSULTANT = '22222222-2222-2222-2222-222222222222'; // Ayşe (seed)

  it('sends and lists messages in a lead thread', async () => {
    const [lead] = await crm.listMyLeads(STUDENT);
    const sent = await crm.sendMessage({ leadId: lead.id, senderId: STUDENT, body: 'Hello consultant' });
    expect(sent.body).toBe('Hello consultant');
    const thread = await crm.listMessages(lead.id);
    expect(thread.some((m) => m.id === sent.id)).toBe(true);
    expect(thread[0].senderName).toBeTruthy();
  });

  it('counts unread messages sent to the student, then marks them read', async () => {
    const [lead] = await crm.listMyLeads(STUDENT);
    await crm.sendMessage({ leadId: lead.id, senderId: CONSULTANT, body: 'Reply' });
    const before = await crm.unreadMessageCount(STUDENT);
    expect(before).toBeGreaterThanOrEqual(1);
    await crm.markThreadRead(lead.id, STUDENT);
    const after = await crm.unreadMessageCount(STUDENT);
    expect(after).toBeLessThan(before);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- student-repository`
Expected: FAIL — `crm.sendMessage is not a function`.

- [ ] **Step 3: Implement message methods**

Add inside the `createPgCrm` returned object (after `listMyDocuments`):

```ts
    async listMessages(leadId: string): Promise<MessageWithSender[]> {
      const res = await q(
        `select m.*, p.full_name sender_name, p.role sender_role
         from public.messages m
         join public.profiles p on p.id = m.sender_id
         where m.lead_id = $1
         order by m.created_at asc`,
        [leadId],
      );
      return res.rows.map((r) => ({
        id: r.id, leadId: r.lead_id, senderId: r.sender_id, body: r.body,
        createdAt: r.created_at, readAt: r.read_at,
        senderName: r.sender_name, senderRole: r.sender_role,
      }));
    },

    async sendMessage(input: NewMessageInput): Promise<Message> {
      const res = await q(
        `insert into public.messages (lead_id, sender_id, body) values ($1, $2, $3) returning *`,
        [input.leadId, input.senderId, input.body],
      );
      const r = res.rows[0];
      return {
        id: r.id, leadId: r.lead_id, senderId: r.sender_id, body: r.body,
        createdAt: r.created_at, readAt: r.read_at,
      };
    },

    async markThreadRead(leadId: string, readerId: string): Promise<void> {
      await q(
        `update public.messages set read_at = now()
         where lead_id = $1 and sender_id <> $2 and read_at is null`,
        [leadId, readerId],
      );
    },

    async unreadMessageCount(userId: string): Promise<number> {
      const res = await q(
        `select count(*)::int c from public.messages m
         join public.leads l on l.id = m.lead_id
         where l.user_id = $1 and m.sender_id <> $1 and m.read_at is null`,
        [userId],
      );
      return res.rows[0]?.c ?? 0;
    },
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- student-repository`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/crm/pg-repository.ts tests/unit/student-repository.test.ts
git commit -m "feat(crm): messages — list/send/markRead/unreadCount"
```

---

## Task 8: Pg impl — notifications + student document

**Files:**
- Modify: `src/lib/crm/pg-repository.ts`
- Test: `tests/unit/student-repository.test.ts` (extend)

- [ ] **Step 1: Add failing tests**

Append to the test file:

```ts
describe('notifications + student document', () => {
  it('lists notifications composed from audit + unread messages', async () => {
    const notes = await crm.listNotifications(STUDENT, 20);
    expect(Array.isArray(notes)).toBe(true);
    for (const n of notes) {
      expect(['status_change', 'assigned', 'message']).toContain(n.type);
    }
  });

  it('adds a student document row', async () => {
    const [app] = await crm.listMyApplications(STUDENT);
    if (!app) return; // seed student has applications via leads
    const before = await crm.listMyDocuments(STUDENT);
    await crm.addStudentDocument({
      applicationId: app.id,
      fileName: 'test.pdf',
      filePath: `${STUDENT}/test-uuid.pdf`,
      mimeType: 'application/pdf',
      sizeBytes: 1234,
      uploadedBy: STUDENT,
    });
    const after = await crm.listMyDocuments(STUDENT);
    expect(after.length).toBeGreaterThan(before.length);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- student-repository`
Expected: FAIL — `crm.listNotifications is not a function`.

- [ ] **Step 3: Implement `listNotifications` + `addStudentDocument`**

Add inside the `createPgCrm` returned object (after `unreadMessageCount`):

```ts
    async listNotifications(userId: string, limit = 20): Promise<StudentNotification[]> {
      const [auditRes, msgRes] = await Promise.all([
        q(
          `select a.id, a.action, a.metadata, a.created_at, l.id lead_id
           from public.audit_logs a
           join public.leads l on l.id = a.entity_id
           where l.user_id = $1 and a.entity = 'lead'
             and a.action in ('lead.create', 'lead.update_status', 'lead.assign')
           order by a.created_at desc limit $2`,
          [userId, limit],
        ),
        q(
          `select m.id, m.body, m.created_at, m.lead_id, p.full_name sender_name
           from public.messages m
           join public.leads l on l.id = m.lead_id
           join public.profiles p on p.id = m.sender_id
           where l.user_id = $1 and m.sender_id <> $1 and m.read_at is null
           order by m.created_at desc limit $2`,
          [userId, limit],
        ),
      ]);
      const notes: StudentNotification[] = [
        ...auditRes.rows.map((r): StudentNotification => ({
          id: `audit-${r.id}`,
          type: r.action === 'lead.assign' ? 'assigned' : 'status_change',
          leadId: r.lead_id,
          metadata: r.metadata ?? {},
          createdAt: r.created_at,
          read: false,
        })),
        ...msgRes.rows.map((r): StudentNotification => ({
          id: `msg-${r.id}`,
          type: 'message',
          leadId: r.lead_id,
          metadata: { senderName: r.sender_name, body: r.body },
          createdAt: r.created_at,
          read: false,
        })),
      ];
      return notes.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, limit);
    },

    async addStudentDocument(input: NewDocumentUploadInput): Promise<ApplicationDocument> {
      const res = await q(
        `insert into public.application_documents
           (application_id, file_name, file_url, mime_type, size_bytes, uploaded_by)
         values ($1, $2, $3, $4, $5, $6) returning *`,
        [input.applicationId, input.fileName, input.filePath, input.mimeType, input.sizeBytes, input.uploadedBy],
      );
      const r = res.rows[0];
      await audit({
        userId: input.uploadedBy,
        action: 'document.create',
        entity: 'application',
        entityId: input.applicationId,
      });
      return {
        id: r.id, applicationId: r.application_id, fileName: r.file_name, fileUrl: r.file_url,
        mimeType: r.mime_type, sizeBytes: r.size_bytes, verified: r.verified,
        uploadedBy: r.uploaded_by, createdAt: r.created_at,
      };
    },
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- student-repository`
Expected: PASS (all).

- [ ] **Step 5: Typecheck the whole project**

Run: `npm run typecheck`
Expected: PASS (interface now fully satisfied).

- [ ] **Step 6: Commit**

```bash
git add src/lib/crm/pg-repository.ts tests/unit/student-repository.test.ts
git commit -m "feat(crm): listNotifications (composed) + addStudentDocument"
```

---

## Task 9: Dev-auth student session

**Files:**
- Create: `src/lib/crm/student-session.ts`

- [ ] **Step 1: Create the session helper**

```ts
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { AppLocale } from '@/i18n/routing';

export const STUDENT_SESSION_COOKIE = 'student_session';

export interface StudentSession {
  userId: string;
  fullName: string;
}

export async function getStudentSession(): Promise<StudentSession | null> {
  const store = await cookies();
  const raw = store.get(STUDENT_SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StudentSession;
  } catch {
    return null;
  }
}

export async function requireStudent(locale: AppLocale): Promise<StudentSession> {
  const session = await getStudentSession();
  if (!session) redirect(`/${locale}/dashboard/login`);
  return session;
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/lib/crm/student-session.ts
git commit -m "feat(auth): dev-auth student session helper"
```

---

## Task 10: Student validations + auth/message server actions

**Files:**
- Create: `src/lib/validations/student.ts`
- Create: `src/app/actions/student-auth.ts`
- Create: `src/app/actions/student.ts`

- [ ] **Step 1: Create validations**

`src/lib/validations/student.ts`:

```ts
import { z } from 'zod';

export const sendMessageSchema = z.object({
  leadId: z.string().uuid(),
  body: z.string().min(1).max(2000),
});

export const devStudentLoginSchema = z.object({
  profileId: z.string().uuid(),
  locale: z.string().min(2),
});
```

- [ ] **Step 2: Create student auth actions**

`src/app/actions/student-auth.ts`:

```ts
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { crm } from '@/lib/crm';
import { STUDENT_SESSION_COOKIE } from '@/lib/crm/student-session';
import { devStudentLoginSchema } from '@/lib/validations/student';

export async function devStudentLogin(input: unknown) {
  const parsed = devStudentLoginSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const };
  const profile = await crm.getProfile(parsed.data.profileId);
  if (!profile || profile.role !== 'student') return { ok: false as const };
  const store = await cookies();
  store.set(
    STUDENT_SESSION_COOKIE,
    JSON.stringify({ userId: profile.id, fullName: profile.fullName }),
    { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 8 },
  );
  redirect(`/${parsed.data.locale}/dashboard`);
}

export async function devStudentLogout(locale: string) {
  const store = await cookies();
  store.delete(STUDENT_SESSION_COOKIE);
  redirect(`/${locale}/dashboard/login`);
}
```

- [ ] **Step 3: Create message send action**

`src/app/actions/student.ts`:

```ts
'use server';

import { crm } from '@/lib/crm';
import { getStudentSession } from '@/lib/crm/student-session';
import { sendMessageSchema } from '@/lib/validations/student';

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function sendStudentMessage(input: unknown): Promise<ActionResult> {
  const parsed = sendMessageSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Invalid input' };
  const session = await getStudentSession();
  if (!session) return { ok: false, error: 'Not authenticated' };
  // Ownership: the lead must belong to this student.
  const lead = await crm.getLead(parsed.data.leadId);
  if (!lead || lead.userId !== session.userId) return { ok: false, error: 'Not allowed' };
  await crm.sendMessage({ leadId: parsed.data.leadId, senderId: session.userId, body: parsed.data.body });
  return { ok: true };
}
```

- [ ] **Step 4: Typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/validations/student.ts src/app/actions/student-auth.ts src/app/actions/student.ts
git commit -m "feat(student): validations + dev-auth + message server actions"
```

---

## Task 11: Supabase server client + storage helper

**Files:**
- Create: `src/lib/supabase/server.ts`
- Create: `src/lib/storage.ts`

- [ ] **Step 1: Create the service-role server client**

`src/lib/supabase/server.ts`:

```ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

/**
 * Server-only Supabase client using the SERVICE ROLE key. Bypasses RLS — never
 * import this into a client component and never expose the key to the browser.
 */
export function getSupabaseServer(): SupabaseClient {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error(
      'Supabase server client not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.',
    );
  }
  client = createClient(url, serviceRoleKey, { auth: { persistSession: false } });
  return client;
}
```

- [ ] **Step 2: Create the storage helper**

`src/lib/storage.ts`:

```ts
import { getSupabaseServer } from './supabase/server';

export const DOCUMENT_BUCKET = 'application-documents';
const SIGNED_URL_TTL_SECONDS = 60;

export async function uploadDocumentObject(
  path: string,
  data: Buffer,
  contentType: string,
): Promise<void> {
  const supabase = getSupabaseServer();
  const { error } = await supabase.storage
    .from(DOCUMENT_BUCKET)
    .upload(path, data, { contentType, upsert: false });
  if (error) throw new Error(`Storage upload failed: ${error.message}`);
}

export async function getSignedDocumentUrl(path: string): Promise<string> {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase.storage
    .from(DOCUMENT_BUCKET)
    .createSignedUrl(path, SIGNED_URL_TTL_SECONDS);
  if (error) throw new Error(`Signed URL failed: ${error.message}`);
  return data.signedUrl;
}
```

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/lib/supabase/server.ts src/lib/storage.ts
git commit -m "feat(storage): service-role supabase client + document upload/sign helpers"
```

---

## Task 12: Document upload server action

**Files:**
- Modify: `src/app/actions/student.ts` (add `uploadStudentDocument`)

- [ ] **Step 1: Add the upload action**

Append to `src/app/actions/student.ts`:

```ts
import { revalidateTag } from 'next/cache';
import { uploadDocumentObject } from '@/lib/storage';
import { crm } from '@/lib/crm';

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED_MIME = ['application/pdf', 'image/png', 'image/jpeg'];

export async function uploadStudentDocument(formData: FormData): Promise<ActionResult> {
  const session = await getStudentSession();
  if (!session) return { ok: false, error: 'Not authenticated' };

  const applicationId = String(formData.get('applicationId') ?? '');
  const file = formData.get('file');
  if (!(file instanceof File)) return { ok: false, error: 'No file provided' };
  if (!applicationId) return { ok: false, error: 'Missing application' };
  if (file.size === 0 || file.size > MAX_BYTES) return { ok: false, error: 'Invalid file size' };
  if (!ALLOWED_MIME.includes(file.type)) return { ok: false, error: 'Unsupported file type' };

  // Ownership: application must belong to this student (via its lead).
  const apps = await crm.listMyApplications(session.userId);
  if (!apps.some((a) => a.id === applicationId)) return { ok: false, error: 'Not allowed' };

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = (file.name.split('.').pop() || 'bin').toLowerCase();
  const path = `${session.userId}/${crypto.randomUUID()}.${ext}`;
  await uploadDocumentObject(path, buffer, file.type);
  await crm.addStudentDocument({
    applicationId,
    fileName: file.name,
    filePath: path,
    mimeType: file.type,
    sizeBytes: file.size,
    uploadedBy: session.userId,
  });
  revalidateTag('student-documents');
  return { ok: true };
}
```

> Note: the duplicate `import { crm } from '@/lib/crm';` line already exists at the top of the file from Task 10 — do not add it twice; merge imports if needed. `revalidateTag('student-documents')` is consumed by the documents page (Task 18).

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/app/actions/student.ts
git commit -m "feat(student): document upload server action (Supabase Storage)"
```

---

## Task 13: `(marketing)` route group refactor

**Goal:** Move marketing chrome (Header/Footer/WhatsAppFloat) out of `[locale]/layout.tsx` into `(marketing)/layout.tsx`, so `dashboard/` gets a clean shell.

**Files:**
- Create: `src/app/[locale]/(marketing)/layout.tsx`
- Modify: `src/app/[locale]/layout.tsx` (remove chrome + `<main>`)
- Move (git mv): all marketing pages into `(marketing)/`

- [ ] **Step 1: Trim `[locale]/layout.tsx` to a minimal root**

In `src/app/[locale]/layout.tsx`, remove the `Header`/`Footer`/`WhatsAppFloat` imports and their usage. Replace the `<body>` return block so it no longer renders chrome or `<main>`:

```tsx
      <body>
        <JsonLd data={[organizationJsonLd(), websiteJsonLd(appLocale)]} />
        <NextIntlClientProvider messages={messages}>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-flat-hover"
          >
            {tCommon('skipToContent')}
          </a>
          {children}
        </NextIntlClientProvider>
      </body>
```

(Keep everything else in the file: imports for fonts/JsonLd/next-intl/siteConfig, `generateStaticParams`, `generateMetadata`, the `LocaleLayout` signature through `setRequestLocale(locale)`, `messages`, `tCommon`, `direction`, `appLocale`, and the `<html>` opening tag.)

- [ ] **Step 2: Create `(marketing)/layout.tsx`**

`src/app/[locale]/(marketing)/layout.tsx`:

```tsx
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { WhatsAppFloat } from '@/components/layout/whatsapp-float';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
```

- [ ] **Step 3: Move marketing pages into the group**

Run (from repo root `C:\Users\Asus\OneDrive\Desktop\study`):

```bash
git mv "src/app/[locale]/page.tsx" "src/app/[locale]/(marketing)/page.tsx"
git mv "src/app/[locale]/about" "src/app/[locale]/(marketing)/about"
git mv "src/app/[locale]/apply" "src/app/[locale]/(marketing)/apply"
git mv "src/app/[locale]/blog" "src/app/[locale]/(marketing)/blog"
git mv "src/app/[locale]/compare" "src/app/[locale]/(marketing)/compare"
git mv "src/app/[locale]/contact" "src/app/[locale]/(marketing)/contact"
git mv "src/app/[locale]/programs" "src/app/[locale]/(marketing)/programs"
git mv "src/app/[locale]/universities" "src/app/[locale]/(marketing)/universities"
git mv "src/app/[locale]/study-in-turkey-from-[country]" "src/app/[locale]/(marketing)/study-in-turkey-from-[country]"
git mv "src/app/[locale]/error.tsx" "src/app/[locale]/(marketing)/error.tsx"
git mv "src/app/[locale]/loading.tsx" "src/app/[locale]/(marketing)/loading.tsx"
git mv "src/app/[locale]/not-found.tsx" "src/app/[locale]/(marketing)/not-found.tsx"
```

> Do NOT move `dashboard/` (created in later tasks) — it stays directly under `[locale]/`. Leave `[locale]/layout.tsx` and (later) `[locale]/dashboard/` as siblings of `(marketing)/`.

- [ ] **Step 4: Build to confirm routing still works**

Run: `npm run build`
Expected: PASS; marketing routes (`/en`, `/en/universities`, …) still present as `● (SSG)`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor(routing): move marketing pages into (marketing) route group"
```

---

## Task 14: Dashboard shell (layout + sidebar + topbar)

**Files:**
- Create: `src/components/student/StudentSidebar.tsx`
- Create: `src/components/student/StudentTopbar.tsx`
- Create: `src/app/[locale]/dashboard/layout.tsx`

- [ ] **Step 1: Create the sidebar**

`src/components/student/StudentSidebar.tsx`:

```tsx
import Link from 'next/link';
import { LayoutDashboard, FileText, MessageSquare, Bell, GraduationCap } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { cn } from '@/lib/utils';

export async function StudentSidebar({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'Student.nav' });
  const items = [
    { href: `/${locale}/dashboard`, icon: LayoutDashboard, label: t('overview') },
    { href: `/${locale}/dashboard/applications`, icon: GraduationCap, label: t('applications') },
    { href: `/${locale}/dashboard/documents`, icon: FileText, label: t('documents') },
    { href: `/${locale}/dashboard/messages`, icon: MessageSquare, label: t('messages') },
    { href: `/${locale}/dashboard/notifications`, icon: Bell, label: t('notifications') },
  ];
  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-card lg:block">
      <nav className="space-y-1 p-4">
        {items.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-bg-subtle hover:text-foreground',
            )}
          >
            <it.icon className="h-4 w-4" />
            {it.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
```

- [ ] **Step 2: Create the topbar**

`src/components/student/StudentTopbar.tsx`:

```tsx
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { devStudentLogout } from '@/app/actions/student-auth';
import type { StudentSession } from '@/lib/crm/student-session';

export async function StudentTopbar({
  session,
  locale,
}: {
  session: StudentSession;
  locale: string;
}) {
  const t = await getTranslations({ locale, namespace: 'Student.nav' });
  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 lg:px-6">
      <div className="text-sm font-semibold text-foreground">{session.fullName}</div>
      <form action={devStudentLogout.bind(null, locale)}>
        <button type="submit" className="text-sm text-muted-foreground hover:text-foreground">
          {t('logout')}
        </button>
      </form>
    </header>
  );
}
```

- [ ] **Step 3: Create the dashboard layout**

`src/app/[locale]/dashboard/layout.tsx`:

```tsx
import { requireStudent } from '@/lib/crm/student-session';
import { StudentSidebar } from '@/components/student/StudentSidebar';
import { StudentTopbar } from '@/components/student/StudentTopbar';
import type { AppLocale } from '@/i18n/routing';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await requireStudent(locale as AppLocale);
  return (
    <div className="flex min-h-screen">
      <StudentSidebar locale={locale} />
      <div className="flex min-w-0 flex-1 flex-col">
        <StudentTopbar session={session} locale={locale} />
        <main id="main" className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/student/ src/app/[locale]/dashboard/layout.tsx
git commit -m "feat(student): dashboard shell — sidebar, topbar, guarded layout"
```

---

## Task 15: Student dashboard login page

**Files:**
- Create: `src/app/[locale]/dashboard/login/page.tsx`

- [ ] **Step 1: Create the login page**

`src/app/[locale]/dashboard/login/page.tsx`:

```tsx
import { getTranslations } from 'next-intl/server';
import { crm } from '@/lib/crm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function StudentLoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Student.login' });
  const students = await crm.listStudents();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
          <CardDescription>{t('subtitle')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {students.map((s) => (
            <form key={s.id} action={loginAction} className="block">
              <input type="hidden" name="profileId" value={s.id} />
              <input type="hidden" name="locale" value={locale} />
              <Button type="submit" variant="outline" className="w-full justify-between">
                <span>{s.fullName}</span>
                <span className="text-xs text-muted-foreground">{s.email}</span>
              </Button>
            </form>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

async function loginAction(formData: FormData) {
  'use server';
  const { devStudentLogin } = await import('@/app/actions/student-auth');
  await devStudentLogin({
    profileId: String(formData.get('profileId')),
    locale: String(formData.get('locale')),
  });
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add "src/app/[locale]/dashboard/login/page.tsx"
git commit -m "feat(student): dev-auth login page"
```

---

## Task 16: Overview page

**Files:**
- Create: `src/app/[locale]/dashboard/page.tsx`

- [ ] **Step 1: Create the overview**

`src/app/[locale]/dashboard/page.tsx`:

```tsx
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { crm } from '@/lib/crm';
import { requireStudent } from '@/lib/crm/student-session';
import { LEAD_STATUS_LABELS } from '@/types/crm';
import type { AppLocale } from '@/i18n/routing';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function StudentOverviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await requireStudent(locale as AppLocale);
  const t = await getTranslations({ locale, namespace: 'Student.overview' });

  const [leads, unread, notifications] = await Promise.all([
    crm.listMyLeads(session.userId),
    crm.unreadMessageCount(session.userId),
    crm.listNotifications(session.userId, 5),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-headline-lg text-foreground">{t('title')}</h1>
        <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">{t('applications')}</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-semibold tabular-nums">{leads.length}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">{t('unreadMessages')}</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-semibold tabular-nums">{unread}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">{t('status')}</CardTitle></CardHeader>
          <CardContent><p className="text-sm">{leads[0] ? LEAD_STATUS_LABELS[leads[0].status] : t('noApplications')}</p></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>{t('recentNotifications')}</CardTitle></CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('noApplications')}</p>
          ) : (
            <ul className="divide-y divide-border">
              {notifications.map((n) => (
                <li key={n.id} className="py-2 text-sm">
                  <span className="font-medium text-foreground">{n.type}</span>{' '}
                  <span className="text-muted-foreground">{new Date(n.createdAt).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
          <Link href={`/${locale}/dashboard/notifications`} className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
            {t('recentNotifications')} →
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
```

> The raw `{n.type}` is a placeholder render; Task 21 i18n + a small mapping helper can humanize it later. Keeping it minimal here is acceptable for MVP.

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add "src/app/[locale]/dashboard/page.tsx"
git commit -m "feat(student): dashboard overview page"
```

---

## Task 17: Applications list + detail

**Files:**
- Create: `src/app/[locale]/dashboard/applications/page.tsx`
- Create: `src/app/[locale]/dashboard/applications/[id]/page.tsx`

- [ ] **Step 1: Create the applications list**

`src/app/[locale]/dashboard/applications/page.tsx`:

```tsx
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { crm } from '@/lib/crm';
import { requireStudent } from '@/lib/crm/student-session';
import { LEAD_STATUS_LABELS } from '@/types/crm';
import type { AppLocale } from '@/i18n/routing';
import { LeadStatusBadge } from '@/components/admin/LeadStatusBadge';
import { Card, CardContent } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function ApplicationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await requireStudent(locale as AppLocale);
  const t = await getTranslations({ locale, namespace: 'Student.applications' });
  const leads = await crm.listMyLeads(session.userId);

  return (
    <div className="space-y-4">
      <h1 className="font-display text-headline-lg text-foreground">{t('title')}</h1>
      {leads.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t('empty')}</p>
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => (
            <Card key={lead.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div>
                  <p className="font-medium text-foreground">{lead.universityId}</p>
                  <p className="text-xs text-muted-foreground">{lead.consultant?.fullName ?? '—'}</p>
                </div>
                <div className="flex items-center gap-3">
                  <LeadStatusBadge status={lead.status} />
                  <Link href={`/${locale}/dashboard/applications/${lead.id}`} className="text-sm font-medium text-primary hover:underline">
                    {t('viewDetail')}
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create the application detail**

`src/app/[locale]/dashboard/applications/[id]/page.tsx`:

```tsx
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { crm } from '@/lib/crm';
import { requireStudent } from '@/lib/crm/student-session';
import { LEAD_STATUS_LABELS } from '@/types/crm';
import type { AppLocale } from '@/i18n/routing';
import { PipelineStepper } from '@/components/admin/PipelineStepper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const session = await requireStudent(locale as AppLocale);
  const t = await getTranslations({ locale, namespace: 'Student.detail' });
  const lead = await crm.getLead(id);
  if (!lead || lead.userId !== session.userId) notFound();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-headline-lg text-foreground">{lead.universityId}</h1>
      <PipelineStepper current={lead.status} />
      <Card>
        <CardHeader><CardTitle>{t('consultant')}</CardTitle></CardHeader>
        <CardContent><p className="text-sm">{lead.consultant?.fullName ?? '—'}</p></CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>{t('timeline')}</CardTitle></CardHeader>
        <CardContent>
          <ul className="divide-y divide-border">
            {lead.timeline.map((e) => (
              <li key={e.id} className="py-2 text-sm">
                <span className="font-medium text-foreground">{e.action}</span>{' '}
                <span className="text-muted-foreground">{new Date(e.createdAt).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
```

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck`
Expected: PASS. (If `PipelineStepper` props differ, open it and match its actual props.)

- [ ] **Step 4: Commit**

```bash
git add "src/app/[locale]/dashboard/applications"
git commit -m "feat(student): applications list + detail pages"
```

---

## Task 18: Documents page + upload form

**Files:**
- Create: `src/components/student/DocumentUploadForm.tsx`
- Create: `src/app/[locale]/dashboard/documents/page.tsx`

- [ ] **Step 1: Create the upload form (client)**

`src/components/student/DocumentUploadForm.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { uploadStudentDocument } from '@/app/actions/student';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Application } from '@/types/crm';

export function DocumentUploadForm({ applications }: { applications: Application[] }) {
  const t = useTranslations('Student.documents');
  const [appId, setAppId] = useState(applications[0]?.id ?? '');
  const [status, setStatus] = useState<'idle' | 'uploading' | 'error'>('idle');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const file = (form.elements.namedItem('file') as HTMLInputElement).files?.[0];
    if (!file || !appId) return;
    setStatus('uploading');
    const fd = new FormData();
    fd.set('applicationId', appId);
    fd.set('file', file);
    const res = await uploadStudentDocument(fd);
    setStatus(res.ok ? 'idle' : 'error');
    if (res.ok) form.reset();
  }

  if (applications.length === 0) return null;

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <Select value={appId} onValueChange={setAppId}>
        <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
        <SelectContent>
          {applications.map((a) => (
            <SelectItem key={a.id} value={a.id}>{a.universityId}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <input name="file" type="file" accept="application/pdf,image/png,image/jpeg" required className="block text-sm" />
      {status === 'error' && <p className="text-sm text-destructive">{t('uploadError')}</p>}
      <Button type="submit" disabled={status === 'uploading'}>{t('uploadCta')}</Button>
    </form>
  );
}
```

- [ ] **Step 2: Create the documents page**

`src/app/[locale]/dashboard/documents/page.tsx`:

```tsx
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { crm } from '@/lib/crm';
import { requireStudent } from '@/lib/crm/student-session';
import { getSignedDocumentUrl } from '@/lib/storage';
import type { AppLocale } from '@/i18n/routing';
import { DocumentUploadForm } from '@/components/student/DocumentUploadForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const dynamic = 'force-dynamic';

export default async function DocumentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  unstable_setRequestLocale(locale);
  const session = await requireStudent(locale as AppLocale);
  const t = await getTranslations({ locale, namespace: 'Student.documents' });

  const [docs, apps] = await Promise.all([
    crm.listMyDocuments(session.userId),
    crm.listMyApplications(session.userId),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-headline-lg text-foreground">{t('title')}</h1>

      <Card>
        <CardHeader><CardTitle>{t('upload')}</CardTitle></CardHeader>
        <CardContent><DocumentUploadForm applications={apps} /></CardContent>
      </Card>

      <div className="space-y-3">
        {docs.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('empty')}</p>
        ) : (
          docs.map(async (d) => {
            const url = await getSignedDocumentUrl(d.fileUrl).catch(() => null);
            return (
              <Card key={d.id}>
                <CardContent className="flex items-center justify-between py-4">
                  <div>
                    <p className="font-medium text-foreground">{d.fileName}</p>
                    <p className="text-xs text-muted-foreground">{new Date(d.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={d.verified ? 'default' : 'secondary'}>
                      {d.verified ? t('verified') : t('pending')}
                    </Badge>
                    {url && <a href={url} download className="text-sm font-medium text-primary hover:underline">{t('download')}</a>}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
```

> Note: generating signed URLs by mapping an async fn inside JSX works but each is awaited during SSR render. For many documents this should later become a dedicated component; acceptable for MVP.

- [ ] **Step 3: Typecheck + build**

Run: `npm run typecheck && npm run build`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/components/student/DocumentUploadForm.tsx "src/app/[locale]/dashboard/documents"
git commit -m "feat(student): documents page + Supabase Storage upload"
```

---

## Task 19: Messages page + send form

**Files:**
- Create: `src/components/student/MessageComposer.tsx`
- Create: `src/app/[locale]/dashboard/messages/page.tsx`

- [ ] **Step 1: Create the composer (client)**

`src/components/student/MessageComposer.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { sendStudentMessage } from '@/app/actions/student';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export function MessageComposer({ leadId }: { leadId: string }) {
  const t = useTranslations('Student.messages');
  const [sending, setSending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const body = (e.currentTarget.elements.namedItem('body') as HTMLTextAreaElement).value;
    setSending(true);
    const res = await sendStudentMessage({ leadId, body });
    setSending(false);
    if (res.ok) e.currentTarget.reset();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <Textarea name="body" placeholder={t('placeholder')} maxLength={2000} required />
      <Button type="submit" disabled={sending}>{t('send')}</Button>
    </form>
  );
}
```

- [ ] **Step 2: Create the messages page**

`src/app/[locale]/dashboard/messages/page.tsx`:

```tsx
import { getTranslations } from 'next-intl/server';
import { crm } from '@/lib/crm';
import { requireStudent } from '@/lib/crm/student-session';
import { markThreadReadAction } from '@/app/actions/student';
import type { AppLocale } from '@/i18n/routing';
import { MessageComposer } from '@/components/student/MessageComposer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function MessagesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await requireStudent(locale as AppLocale);
  const t = await getTranslations({ locale, namespace: 'Student.messages' });

  const leads = await crm.listMyLeads(session.userId);
  const lead = leads[0];
  if (!lead) {
    return (
      <div className="space-y-4">
        <h1 className="font-display text-headline-lg text-foreground">{t('title')}</h1>
        <p className="text-sm text-muted-foreground">{t('empty')}</p>
      </div>
    );
  }

  const messages = await crm.listMessages(lead.id);
  // Mark consultant messages read on view (best-effort, ownership-checked server action).
  await markThreadReadAction(lead.id).catch(() => {});

  return (
    <div className="space-y-6">
      <h1 className="font-display text-headline-lg text-foreground">{t('title')}</h1>
      <Card>
        <CardHeader><CardTitle>{lead.consultant?.fullName ?? t('consultant')}</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {messages.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('empty')}</p>
          ) : (
            <ul className="space-y-2">
              {messages.map((m) => {
                const mine = m.senderId === session.userId;
                return (
                  <li key={m.id} className={cn('max-w-[80%] rounded-lg border border-border p-3 text-sm', mine ? 'ml-auto bg-primary/5' : 'bg-card')}>
                    <p className="mb-1 text-xs text-muted-foreground">{mine ? t('you') : m.senderName}</p>
                    <p className="text-foreground">{m.body}</p>
                  </li>
                );
              })}
            </ul>
          )}
          <MessageComposer leadId={lead.id} />
        </CardContent>
      </Card>
    </div>
  );
}
```

- [ ] **Step 3: Add the `markThreadReadAction` action**

Append to `src/app/actions/student.ts`:

```ts
export async function markThreadReadAction(leadId: string): Promise<ActionResult> {
  const session = await getStudentSession();
  if (!session) return { ok: false, error: 'Not authenticated' };
  const lead = await crm.getLead(leadId);
  if (!lead || lead.userId !== session.userId) return { ok: false, error: 'Not allowed' };
  await crm.markThreadRead(leadId, session.userId);
  return { ok: true };
}
```

> The messages page (Step 2) imports `markThreadReadAction` from `@/app/actions/student` — this is the server action with ownership validation; it wraps the repo's `crm.markThreadRead`.

- [ ] **Step 4: Typecheck + build**

Run: `npm run typecheck && npm run build`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/student/MessageComposer.tsx "src/app/[locale]/dashboard/messages" src/app/actions/student.ts
git commit -m "feat(student): messages thread + composer"
```

---

## Task 20: Notifications page

**Files:**
- Create: `src/app/[locale]/dashboard/notifications/page.tsx`

- [ ] **Step 1: Create the notifications page**

`src/app/[locale]/dashboard/notifications/page.tsx`:

```tsx
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { crm } from '@/lib/crm';
import { requireStudent } from '@/lib/crm/student-session';
import type { AppLocale } from '@/i18n/routing';
import { Card, CardContent } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function NotificationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await requireStudent(locale as AppLocale);
  const t = await getTranslations({ locale, namespace: 'Student.notifications' });
  const notifications = await crm.listNotifications(session.userId, 30);

  return (
    <div className="space-y-4">
      <h1 className="font-display text-headline-lg text-foreground">{t('title')}</h1>
      {notifications.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t('empty')}</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => {
            const label =
              n.type === 'message'
                ? t('message', { name: String((n.metadata as { senderName?: string }).senderName ?? '') })
                : n.type === 'assigned'
                  ? t('assigned')
                  : t('statusChange');
            return (
              <Card key={n.id}>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-foreground">{label}</p>
                    <span className="text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleString()}</span>
                  </div>
                  {n.leadId && (
                    <Link href={`/${locale}/dashboard/applications/${n.leadId}`} className="text-xs text-primary hover:underline">
                      {t('viewDetail')}
                    </Link>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Typecheck + build**

Run: `npm run typecheck && npm run build`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add "src/app/[locale]/dashboard/notifications"
git commit -m "feat(student): notifications page"
```

---

## Task 21: i18n — `Student` namespace (4 languages)

**Files:**
- Modify: `src/messages/en.json`, `src/messages/tr.json`, `src/messages/az.json`, `src/messages/ru.json`

- [ ] **Step 1: Add the `Student` namespace to `en.json`**

Append a top-level `"Student"` key (merge into the existing JSON object):

```json
"Student": {
  "nav": {
    "overview": "Overview",
    "applications": "Applications",
    "documents": "Documents",
    "messages": "Messages",
    "notifications": "Notifications",
    "logout": "Log out"
  },
  "overview": {
    "title": "My dashboard",
    "subtitle": "Track your applications, documents and messages.",
    "applications": "Applications",
    "unreadMessages": "Unread messages",
    "status": "Current status",
    "noApplications": "No applications yet",
    "recentNotifications": "Recent notifications"
  },
  "applications": {
    "title": "My applications",
    "empty": "You have no applications yet.",
    "viewDetail": "View details"
  },
  "detail": {
    "consultant": "Consultant",
    "timeline": "Activity"
  },
  "documents": {
    "title": "My documents",
    "upload": "Upload a document",
    "uploadCta": "Upload",
    "uploadError": "Upload failed. Check the file type/size.",
    "empty": "No documents yet.",
    "verified": "Verified",
    "pending": "Pending",
    "download": "Download"
  },
  "messages": {
    "title": "Messages",
    "empty": "No messages yet.",
    "placeholder": "Write a message…",
    "send": "Send",
    "consultant": "Consultant",
    "you": "You"
  },
  "notifications": {
    "title": "Notifications",
    "empty": "No notifications.",
    "statusChange": "Your application status changed.",
    "assigned": "A consultant was assigned to you.",
    "message": "New message from {name}",
    "viewDetail": "View details"
  },
  "login": {
    "title": "Student login (demo)",
    "subtitle": "Pick a demo student profile to continue.",
    "choose": "Continue"
  }
}
```

- [ ] **Step 2: Add the same keys (translated) to `tr.json`**

```json
"Student": {
  "nav": { "overview": "Genel bakış", "applications": "Başvurular", "documents": "Belgeler", "messages": "Mesajlar", "notifications": "Bildirimler", "logout": "Çıkış yap" },
  "overview": { "title": "Panelim", "subtitle": "Başvurularınızı, belgelerinizi ve mesajlarınızı takip edin.", "applications": "Başvurular", "unreadMessages": "Okunmamış mesajlar", "status": "Mevcut durum", "noApplications": "Henüz başvuru yok", "recentNotifications": "Son bildirimler" },
  "applications": { "title": "Başvurularım", "empty": "Henüz başvurunuz yok.", "viewDetail": "Detayları gör" },
  "detail": { "consultant": "Danışman", "timeline": "Etkinlik" },
  "documents": { "title": "Belgelerim", "upload": "Belge yükle", "uploadCta": "Yükle", "uploadError": "Yükleme başarısız. Dosya türünü/boyutunu kontrol edin.", "empty": "Henüz belge yok.", "verified": "Doğrulandı", "pending": "Bekliyor", "download": "İndir" },
  "messages": { "title": "Mesajlar", "empty": "Henüz mesaj yok.", "placeholder": "Mesaj yazın…", "send": "Gönder", "consultant": "Danışman", "you": "Siz" },
  "notifications": { "title": "Bildirimler", "empty": "Bildirim yok.", "statusChange": "Başvuru durumunuz değişti.", "assigned": "Size bir danışman atandı.", "message": "{name} adlı kişiden yeni mesaj", "viewDetail": "Detayları gör" },
  "login": { "title": "Öğrenci girişi (demo)", "subtitle": "Devam etmek için bir demo öğrenci profili seçin.", "choose": "Devam et" }
}
```

- [ ] **Step 3: Add the same keys (translated) to `az.json`**

```json
"Student": {
  "nav": { "overview": "Ümumi baxış", "applications": "Müraciətlər", "documents": "Sənədlər", "messages": "Mesajlar", "notifications": "Bildirişlər", "logout": "Çıxış" },
  "overview": { "title": "Panelim", "subtitle": "Müraciətlərinizi, sənədlərinizi və mesajlarınızı izləyin.", "applications": "Müraciətlər", "unreadMessages": "Oxunmamış mesajlar", "status": "Cari status", "noApplications": "Hələ müraciət yoxdur", "recentNotifications": "Son bildirişlər" },
  "applications": { "title": "Müraciətlərim", "empty": "Hələ müraciətiniz yoxdur.", "viewDetail": "Detalları gör" },
  "detail": { "consultant": "Konsultant", "timeline": "Fəaliyyət" },
  "documents": { "title": "Sənədlərim", "upload": "Sənəd yüklə", "uploadCta": "Yüklə", "uploadError": "Yükləmə alınmadı. Fayl tipini/ölçüsünü yoxlayın.", "empty": "Hələ sənəd yoxdur.", "verified": "Təsdiqlənib", "pending": "Gözləyir", "download": "Yüklə" },
  "messages": { "title": "Mesajlar", "empty": "Hələ mesaj yoxdur.", "placeholder": "Mesaj yazın…", "send": "Göndər", "consultant": "Konsultant", "you": "Siz" },
  "notifications": { "title": "Bildirişlər", "empty": "Bildiriş yoxdur.", "statusChange": "Müraciət statusunuz dəyişdi.", "assigned": "Sizə konsultant təyin olundu.", "message": "{name} adlı şəxsdən yeni mesaj", "viewDetail": "Detalları gör" },
  "login": { "title": "Tələbə girişi (demo)", "subtitle": "Davam etmək üçün demo tələbə profili seçin.", "choose": "Davam et" }
}
```

- [ ] **Step 4: Add the same keys (translated) to `ru.json`**

```json
"Student": {
  "nav": { "overview": "Обзор", "applications": "Заявки", "documents": "Документы", "messages": "Сообщения", "notifications": "Уведомления", "logout": "Выйти" },
  "overview": { "title": "Моя панель", "subtitle": "Отслеживайте заявки, документы и сообщения.", "applications": "Заявки", "unreadMessages": "Непрочитанные", "status": "Текущий статус", "noApplications": "Заявок пока нет", "recentNotifications": "Недавние уведомления" },
  "applications": { "title": "Мои заявки", "empty": "У вас пока нет заявок.", "viewDetail": "Подробнее" },
  "detail": { "consultant": "Консультант", "timeline": "События" },
  "documents": { "title": "Мои документы", "upload": "Загрузить документ", "uploadCta": "Загрузить", "uploadError": "Ошибка загрузки. Проверьте тип/размер.", "empty": "Документов пока нет.", "verified": "Проверен", "pending": "Ожидает", "download": "Скачать" },
  "messages": { "title": "Сообщения", "empty": "Сообщений пока нет.", "placeholder": "Напишите сообщение…", "send": "Отправить", "consultant": "Консультант", "you": "Вы" },
  "notifications": { "title": "Уведомления", "empty": "Нет уведомлений.", "statusChange": "Статус заявки изменился.", "assigned": "Вам назначен консультант.", "message": "Новое сообщение от {name}", "viewDetail": "Подробнее" },
  "login": { "title": "Вход для студента (демо)", "subtitle": "Выберите демо-профиль студента.", "choose": "Продолжить" }
}
```

- [ ] **Step 5: Validate JSON + build**

Run: `node -e "require('./src/messages/en.json'); require('./src/messages/tr.json'); require('./src/messages/az.json'); require('./src/messages/ru.json'); console.log('json ok')"`
Then: `npm run build`
Expected: `json ok`, build PASS.

- [ ] **Step 6: Commit**

```bash
git add src/messages
git commit -m "feat(i18n): Student dashboard namespace (en/tr/az/ru)"
```

---

## Task 22: Block dashboard from indexing + middleware

**Files:**
- Modify: `src/app/robots.ts`
- Modify: `src/middleware.ts` (already excludes `/admin`; no change needed for dashboard routing since it's under `[locale]` and should remain locale-prefixed — verify only)

- [ ] **Step 1: Disallow localized dashboard in robots**

In `src/app/robots.ts`, change the `disallow` array to:

```ts
        disallow: ['/api/', '/dashboard/', '/admin/', '/*/dashboard/'],
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: PASS; `robots.txt` route still listed.

- [ ] **Step 3: Commit**

```bash
git add src/app/robots.ts
git commit -m "feat(seo): disallow localized dashboard from robots"
```

---

## Task 23: Playwright student E2E

**Files:**
- Create: `tests/e2e/student-dashboard.spec.ts`

- [ ] **Step 1: Create the spec**

`tests/e2e/student-dashboard.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

test('student login → overview → messages', async ({ page }) => {
  await page.goto('/en/dashboard/login');
  // pick the first demo student
  await page.getByRole('button').first().click();
  await expect(page).toHaveURL(/\/en\/dashboard$/);
  await expect(page.getByRole('heading', { name: 'My dashboard' })).toBeVisible();

  await page.getByRole('link', { name: 'Messages' }).click();
  await expect(page).toHaveURL(/\/en\/dashboard\/messages/);
});
```

- [ ] **Step 2: Run E2E (requires dev server + seeded DB)**

Run (in separate terminals): `npm run dev` then `npm run test:e2e -- student-dashboard`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add tests/e2e/student-dashboard.spec.ts
git commit -m "test(e2e): student dashboard login + overview + messages"
```

---

## Task 24: Final verification + README

**Files:**
- Modify: `README.md` (add a "Student dashboard (Phase 2C)" note + dev-auth warning)

- [ ] **Step 1: Full quality gate**

Run: `npm run lint && npm run typecheck && npm run test && npm run build`
Expected: all green. (Unit DB tests require `DATABASE_URL` + seeded DB; if unavailable, run `npm run db:reset` first.)

- [ ] **Step 2: Update README**

Append a short section to `README.md` documenting:
- `/en/dashboard` route, dev-auth student login (demo only — not production).
- Required env for documents: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and the `application-documents` private bucket (run `0009_storage_bucket.sql` in Supabase SQL editor).
- `npm run db:reset` to seed demo students.

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: Phase 2C student dashboard README notes"
```

---

## Notes for the implementer

- **`crypto.randomUUID()`** is available in Node 19+ / Next 15 server runtime — fine in server actions.
- **`revalidateTag('student-documents')`** is declared but the documents page is `force-dynamic`; the tag call is harmless and forward-compatible. If you prefer, remove it.
- **Signed URLs in JSX** (Task 18) await per-document during SSR; acceptable for MVP, refactor to a `<SignedDocLink>` client component if document lists grow.
- **Ownership checks** (`lead.userId === session.userId`) are duplicated across actions — a future `assertOwnsLead(leadId, userId)` helper would DRY this; out of scope here.
- **`PipelineStepper` / `LeadStatusBadge`** are reused from the admin components (admin-neutral names) to avoid duplication — verify their prop shapes when wiring Task 17.

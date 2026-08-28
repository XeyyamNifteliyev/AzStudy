# Türkiyədə Təhsil Platforması — Phase 2C: Tələbə Dashboard-u (Dizayn Sənədi)

> **Mənbə:** `Study.md` (§9 istifadəçi axını, §15 qovluq strukturu), `docs/superpowers/specs/2026-07-30-study-platform-phase2-admin-backend-design.md` (Faza 2A backend/admin).
> **Dizayn sistemi:** `design/kinetic_horizon/DESIGN.md`.
> Bu sənəd Faza 2-nin **C alt-sistemini** əhatə edir: tələbə tərəfli dashboard (status, sənədlər, mesajlaşma, bildirişlər). Real Supabase Auth (B alt-sistemi) hələ gəlmədiyi üçün **dev-auth student session** istifadə olunur.

---

## 0. Qərarlar (brainstorming nəticəsi)

| Qərar | Seçim | Səbəb |
|---|---|---|
| Tələbə identifikasiyası | **Dev-auth student session** (admin pattern-inin analoqu) | Real auth (2B) gələnə qədər tam işlək; UI/DB dəyişmir, yalnız session mənbəyi dəyişir |
| Scope | **4 modul:** status + sənəd + mesaj + bildiriş | Study.md §9 tam örtüklənməsi |
| Storage | **Real Supabase Storage** (private bucket, server-side upload service role ilə, signed URL oxunuşda) | Prod-grade; dev-auth ilə uyğun (server upload edir) |
| Route | **`[locale]/dashboard/*`** — lokalizasiyalı (4 dil), hreflang | İctimai/qarşı tərəf; Study.md §15 |
| Layout ayrılması | **`(marketing)` route group** — marketing Header/Footer oraya köçürülür | Dashboard fokusa shell alır; `[locale]/layout` minimal olur |
| Data qatı | **`CrmRepository` genişləndirilir** (yeni `StudentRepository` YOXDUR) | Tək adapter/flip nöqtəsi qorunur; spec fəlsəfəsi |
| Bildirişlər | **`audit_logs` + oxunmamış mesaj**-dan kompozisiya (yeni cədvəl YOXDUR) | YAGNI; admin artıq hər hadisəni loglayır |

---

## 1. Məqsəd və Əhatə

### Daxildir
- **Yeni `messages` cədvəli** + migration + RLS
- **Supabase Storage** private bucket `application-documents` + policy-lər
- **`CrmRepository` student-scoped metodları** (pg implementasiya + interfeys + tiplər)
- **Dev-auth student** (cookie, `requireStudent()`, login səhifəsi)
- **`(marketing)` route group refactor** — marketing chrome-u dashboard-dan ayırır
- **Dashboard UI** (Kinetic Horizon): overview, applications, sənədlər, mesajlaşma, bildirişlər — 4 dil
- **Sənəd yükləmə** server action (Storage-a yazma)
- **Testlər:** Vitest (repo) + Playwright (student axını)

### Xaricdədir (növbəti alt-sistemlər)
- Real Supabase Auth (OTP/Google/Apple) — alt-sistem **B** (dev-auth-ı əvəz edəcək)
- Real-time mesajlaşma (WebSocket / Supabase Realtime) — bu fazada yalnız load/polling
- Push/email bildirişlər — yalnız in-app feed
- Mesajlavaya fayl qoşma (attachments)

---

## 2. Data Model

### 2.1 Yeni cədvəl: `messages`
```sql
-- 0008_messages.sql
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
Söhbət **lead üzərindədir**: lead-in `user_id` (tələbə) və `assigned_consultant_id` (konsultant) iştirakçılardır. `sender_id` hər ikisi ola bilər.

### 2.2 RLS (yalnız Supabase) — `0005_rls.sql`-ə əlavə olunur
`auth.uid()` lokal pg-də olmadığı üçün RLS siyasətləri **yalnız Supabase** faylına (mövcud `0005_rls.sql`) əlavə edilir; `migrate.ts` onu lokalda skip edir (0005/0006 kimi).
```sql
alter table public.messages enable row level security;
-- iştirakçı oxuyur: lead-in tələbəsi və ya təyin olunmuş konsultantı
create policy "messages_read" on public.messages for select using (
  exists (select 1 from public.leads l where l.id = messages.lead_id
          and (l.user_id = auth.uid() or l.assigned_consultant_id = auth.uid()))
);
-- iştirakçı yazır (sender özü olmalıdır)
create policy "messages_insert" on public.messages for insert with check (
  sender_id = auth.uid() and exists (select 1 from public.leads l where l.id = messages.lead_id
          and (l.user_id = auth.uid() or l.assigned_consultant_id = auth.uid()))
);
```
> `read_at` (mesajın oxunub işarəsi) **server action** vasitəsilə təyin olunur (`markThreadRead` service role ilə — storage upload pattern-i kimi), buna görə update policy lazım deyil. Tətbiqin öz oxuma/yazma əməliyyatları `CrmRepository` (server, pg/service role) üzərindən keçir; RLS birbaşa klient/vəya digər vektorlara qarşı qoruyur.

### 2.3 Storage bucket — `0009_storage_bucket.sql` (yalnız Supabase; lokalda skip)
```sql
insert into storage.buckets (id, name, public) values ('application-documents','application-documents', false)
on conflict (id) do nothing;
-- Tələbə yalnız öz prefix-i altında oxuyur/yazır: `<userId>/...`
create policy "docs_storage_write" on storage.objects for insert to authenticated with check (
  bucket_id = 'application-documents' and (storage.foldername(name))[1] = auth.uid()::text
);
create policy "docs_storage_read" on storage.objects for select to authenticated using (
  bucket_id = 'application-documents' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_staff())
);
```
> Dev-auth-da real Supabase sessiya yoxdur → upload **server action** vasitəsilə (service role RLS-i bypass edir). Policy-lər prod-a (real auth) hazırlıqdır.

### 2.4 `file_url` semantikası
- `application_documents.file_url` artıq **storage object path** saxlayır (məs: `44444444-.../passport-abc.pdf`).
- Oxunuşda **signed URL** generasiya olunur (`getSignedUrl(path)`, service role, qısa TTL ~60s).
- Köhnə seed dəyərləri (`/uploads/demo-*.pdf`) demo olaraq qalır; UI fayl yoxdursa zərif (graceful) davranır.

### 2.5 Bildirişlər (yeni cədvəl YOXDUR)
`listNotifications(userId)` kompozisiya edir:
1. Tələbənin lead-lərində son N `audit_logs` hadisəsi (status dəyişiklikləri, document verify) → tələbə-dostu mətnə map.
2. Oxunmamış mesaj sayı (`messages` where `read_at is null` and sender != student).

---

## 3. Data Qatı (`CrmRepository` genişləndirilir)

### 3.1 Yeni tiplər (`src/types/crm.ts`)
```ts
export interface Message {
  id: string; leadId: string; senderId: string; body: string;
  createdAt: string; readAt: string | null;
}
export interface MessageWithSender extends Message {
  senderName: string; senderRole: UserRole;
}
export interface StudentNotification {
  id: string; type: 'status_change' | 'document_verified' | 'message';
  title: string; body: string; leadId: string | null;
  createdAt: string; read: boolean;
}
export interface NewMessageInput { leadId: string; senderId: string; body: string; }
export interface NewDocumentUploadInput {
  applicationId: string; fileName: string; filePath: string;
  mimeType: string; sizeBytes: number; uploadedBy: string;
}
```

### 3.2 İnterfeysə əlavə (`src/lib/crm/repositories.ts`)
```ts
// student-scoped oxuma
listStudents(): Promise<Profile[]>;              // login səhifəsi üçün (role='student')
listMyLeads(userId: string): Promise<LeadWithRelations[]>;
listMyApplications(userId: string): Promise<Application[]>;
listMyDocuments(userId: string): Promise<ApplicationDocument[]>;
listMessages(leadId: string): Promise<MessageWithSender[]>;
sendMessage(input: NewMessageInput): Promise<Message>;
markThreadRead(leadId: string, readerId: string): Promise<void>;
listNotifications(userId: string, limit?: number): Promise<StudentNotification[]>;
unreadMessageCount(userId: string): Promise<number>;
// sənəd yükləmə (path artıq Storage-da)
addStudentDocument(input: NewDocumentUploadInput): Promise<ApplicationDocument>;
```
Hər status dəyişikliyi/verify artıq audit yazır (mövcud davranış) → bildiriş mənbəyi.

---

## 4. Dev-Auth Student

- Cookie: **`student_session`** (`admin_session`-dan ayrı) → `{ userId, fullName }`.
- `src/lib/crm/student-session.ts`: `getStudentSession()`, `requireStudent()` (yoxdursa `[locale]/dashboard/login`-ə redirect).
- Login səhifəsi `[locale]/dashboard/login`: demo tələbə profillərini siyahılayır (`crm.listStudents()`), seçim → server action cookie qoyur → `[locale]/dashboard` redirect.
- robots.txt / middleware: `/[locale]/dashboard` public indexlənmədən bloklanır (auth tələb olunan zona).

> **Heç bir real təhlükəsizlik təklif etmir** — yalnız inkişaf/demonstrasiya. 2B gələndə `requireStudent()` Supabase Auth sessiasını oxuyacaq; qalan kod dəyişməz.

---

## 5. `(marketing)` Route Group Refactor

Məqsəd: marketing Header/Footer/WhatsAppFloat dashboard-a keçməsin.

- **`src/app/[locale]/layout.tsx`** → minimal: `<html>/<body>`, next-intl provider, font, globals.css. Header/Footer-siz.
- **Yeni `src/app/[locale]/(marketing)/layout.tsx`** → mövcud marketing chrome-u (Header, Footer, WhatsAppFloat) bura köçürülür. URL dəyişmir (route group).
- Mövcud marketing səhifələri (`page.tsx`, `about/`, `universities/`, `programs/`, `blog/`, `compare/`, `contact/`, `apply/`, `study-in-turkey-from-[country]/`) `(marketing)/` altına fiziki köçürülür — import path-lər `@/` əsaslı olduğu üçün qırılmır.
- `dashboard/` birbaşa `[locale]/` altında qalır → minimal layout + öz dashboard shell-i alır.

Təsir: ~10–15 faylın yerini dəyişmək (git move), məzmun dəyişmir. Build/SEO qırılmır (route group URL-i dəyişmir).

---

## 6. Dashboard UI (Kinetic Horizon)

### 6.1 Route quruluşu
```
app/[locale]/dashboard/
  layout.tsx                 → dashboard shell: student sidebar + topbar + requireStudent guard
  page.tsx                   → Overview (status xülasəsi, son bildirişlər, unread mesaj)
  login/page.tsx             → Dev-auth student login
  applications/
    page.tsx                 → Mənim applications-larım (status pipeline stepper ilə)
    [id]/page.tsx            → Application detalı (status, sənədlər, qeydlər)
  documents/
    page.tsx                 → Bütün sənədlərim (verify badge, yüklə/sign URL)
  messages/
    page.tsx                 → Konsultantla söhbət (lead thread)
  notifications/
    page.tsx                 → Bildiriş feed-i (status dəyişiklikləri + mesajlar)
```

### 6.2 Shell
- `components/student/{StudentSidebar,StudentTopbar}.tsx` — admin sidebar-ın dizayn əsaslı, amma tələbə variantı.
- Bütün səhifələr SSR (`force-dynamic`), canlı data, keşlənmir.

### 6.3 Modullar
- **Overview:** cari lead status badge, pipeline stepper, son 5 bildiriş, oxunmamış mesaj sayı, "Apply" CTA (lead yoxdursa).
- **Applications:** tələbənin lead-ləri və application-ları; status dəyişikliyi read-only (admin edir, tələbə görür).
- **Documents:** tələbənin sənədləri; "Yüklə" düyməsi → server action → Storage. Verify badge.
- **Messages:** lead thread (tələbə ↔ təyin olunmuş konsultant); send box; oxunub/oxunmamış.
- **Notifications:** audit + mesaj hadisələri birləşmiş feed; oxundu işarəsi.

### 6.4 i18n
Yeni `Student` namespace bütün 4 dil (`en/tr/az/ru`) mesaj fayllarına əlavə olunur.

---

## 7. Sənəd Yükləmə Axını

1. Client `<form encType="multipart/form-data">` → server action `uploadDocument(formData)`.
2. Action: `requireStudent()` → faylı oxu → Supabase Storage-a yaz (`supabase.storage.from('application-documents').upload(path, file)`, service role) → `crm.addStudentDocument({filePath: path, ...})`.
3. Oxunuş: `getSignedUrl(path)` → signed URL (60s) → `<a download>`.
- Yardımçı: `src/lib/supabase/server.ts` (service role client) və `src/lib/storage.ts` (`uploadObject`, `getSignedUrl`).
- Validasiya: Zod (fayl tipi `application/pdf,image/*`, maks ~10MB), MIME check server-də.

---

## 8. Təhlükəsizlik (bu fazada)

- Dev-auth yalnız placeholder (production-a yox). README-də xəbərdarlıq.
- Storage private bucket; service role yalnız server-də; client heç vaxt service role görmür.
- Sənəd yükləmə server action tərəfindən; MIME/size validasiyası.
- RLS policy-ləri yazılır (Supabase-a köçəndə aktiv); lokalda `pg` superuser.
- `[locale]/dashboard` middleware/robots ilə indexlənmir.

---

## 9. Test Strategiyası

- **Vitest:** student-scoped repo metodları (listMyLeads/Applications/Documents, sendMessage, listNotifications, unreadMessageCount) lokal Postgres qarşı.
- **Playwright:** `[locale]/dashboard/login` → overview → applications → status dəyişikliyi bildiriş-də görünür → mesaj göndər.
- `npm run lint && typecheck && build` yaşıl olmalıdır.

---

## 10. Qovluq Strukturu (əlavələr)

```
supabase/migrations/
  0008_messages.sql
  0009_storage_bucket.sql        (Supabase-only; lokalda skip)
src/
  app/[locale]/(marketing)/...   (köçürülən marketing səhifələr)
  app/[locale]/dashboard/{layout,page,login,applications,documents,messages,notifications}/
  components/student/{StudentSidebar,StudentTopbar,...}.tsx
  lib/crm/student-session.ts
  lib/supabase/server.ts
  lib/storage.ts
  types/crm.ts                   (Message, StudentNotification, input tipləri)
  messages/{en,tr,az,ru}.json    (Student namespace)
tests/
  unit/student-repository.test.ts
  e2e/student-dashboard.spec.ts
```

---

## 11. İcra Topluları (yüksək səviyyə)

0. Schema: `0008_messages.sql`, `0009_storage_bucket.sql`; tiplər (`types/crm.ts`)
1. `CrmRepository` student-scoped metodları (interfeys + pg impl + `listStudents`)
2. Dev-auth student: cookie, `requireStudent()`, login səhifəsi, server action
3. `(marketing)` route group refactor (marketing chrome-u köçür)
4. Dashboard shell + Overview + Applications (+ detal)
5. Sənəd modulu: `lib/supabase/server.ts`, `lib/storage.ts`, upload server action, signed URL
6. Mesajlaşma modulu
7. Bildiriş modulu (kompozisiya)
8. i18n — `Student` namespace 4 dil
9. Vitest + Playwright testləri
10. lint + typecheck + build + README yeniləmə

---

## 12. Risklər və Qeydlər

- **Dev-auth prod-a uyğun deyil** — 2B real auth gələnə qədər demo. `requireStudent()` tək flip nöqtəsidir.
- **Storage service role** server-də saxlanmalı (`SUPABASE_SERVICE_ROLE_KEY`, gitignored `.env.local`); client heç vaxt.
- **Signed URL TTL** qısa (60s) → yenilənməli; UI-də link tıkəndə generasiya olunur (pre-generate yox).
- **Route group refactor** ~15 faylın yerini dəyişir; `@/` import-ları qırılmır, amma diqqətli `git mv` tələb edir; build sonra doğrulanmalı.
- **Mesajlaşma real-time deyil** — yalnız load/polling; prod-a Realtime əlavə olunar.
- **Bildiriş kompozisiyası** audit metadata-sına bağlıdır; gələcəkdə ayrıca `notifications` cədvəli lazım olsa, interfeys dəyişmir.

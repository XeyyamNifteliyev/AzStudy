# Türkiyədə Təhsil Platforması — Phase 2B: Real Supabase Auth (Hybrid) (Dizayn Sənədi)

> **Mənbə:** `Study.md` §9 (istifadəçi axını), `docs/superpowers/specs/2026-07-30-study-platform-phase2-admin-backend-design.md` (2A), `…-phase2c-student-dashboard-design.md` (2C).
> Bu sənəd **2B alt-sistemini** əhatə edir: real Supabase Auth ilə dev-auth-ın (tələbə tərəfi) əvəz edilməsi.

---

## 0. Qərarlar (brainstorming nəticəsi)

| Qərar | Seçim | Səbəb |
|---|---|---|
| Data qatı | **Hybrid** — auth Supabase, data local Docker `pg` | İstifadəçi seçimi; DB şifrəsi lazım deyil, indi işləyir |
| Auth metodu | **Email OTP (magic link)** əsas; OAuth-ready callback | Supabase default sender ilə dərhal işləyir, xarici quraşdırma yoxdur |
| Scope | **Tələbə auth** (ictimai axın) | Admin daxili alətdir → dev-auth qalır (2B-follow-up) |
| Profayl əlaqəsi | Yeni `profiles.auth_uid` sütunu (nullable, unique) | `profiles.id` dəyişmir (seed data qırılmır); login-də email ilə merge |
| Dev-auth | `NODE_ENV !== 'production'` şərti ilə fallback kimi qalır | Demo seed tələbələrlə lokal test rahatlığı |

> Google/Apple OAuth və datanın Supabase-a köçürülməsi + RLS bu fazaya **daxil deyil** (növbəti fazalar).

---

## 1. Məqsəd və Əhatə

### Daxildir
- `@supabase/ssr` paketi + cookie əsaslı sessiya (browser + server client-lər)
- Middleware: Supabase sessiya refresh + next-intl (birləşdirilmiş)
- `/auth/callback` route (magic link / OAuth code exchange)
- Tələbə login/register: email OTP formu + dev fallback (demo picker)
- `requireStudent()` rewrite → Supabase sessiyasından profayl resolve
- `profiles.auth_uid` migration + repo metodları (`getProfileByAuthUid`, `upsertStudentByAuthUid`)
- Logout (Supabase signOut)
- i18n açarları + testlər

### Xaricdədir
- Admin real auth (dev-auth qalır)
- Google/Apple OAuth (callback OAuth-ready; provider konfiqurasiyası sonra)
- Datanın Supabase-a köçürülməsi, `SupabaseCrmRepository`, RLS enforcement
- Password login (yalnız OTP)

---

## 2. Data Model

### 2.1 `profiles.auth_uid`
```sql
-- 0010_profiles_auth_uid.sql  (lokal + Supabase)
alter table public.profiles add column if not exists auth_uid uuid;
create unique index if not exists profiles_auth_uid_uniq on public.profiles(auth_uid) where auth_uid is not null;
```
`profiles.id` (mövcud random UUID PK) dəyişmir. Real login-də Supabase user UUID `auth_uid`-ə yazılır; eyni email-li mövcud profayl tapılır, `auth_uid` set olunur → anonim "Apply" lead-ləri login sonrası dashboard-da görünür.

### 2.2 Repo metodları (`CrmRepository`)
```ts
getProfileByAuthUid(authUid: string): Promise<Profile | null>;
upsertStudentByAuthUid(input: { authUid: string; email: string; fullName: string }): Promise<Profile>;
```
`upsertStudentByAuthUid`: əvvəl `auth_uid` ilə tap; yoxdursa email ilə tap (onun `auth_uid`-ni set et); yoxdursa yeni profayl yarat (`auth_uid` ilə).

---

## 3. Supabase Client-lər

- `src/lib/supabase/client.ts` — `createBrowserClient(url, anonKey)` (client komponentlər üçün).
- `src/lib/supabase/server-session.ts` — `getSession()`: `createServerClient` (anon key, cookie read/write) ilə `(await supabase.auth.getUser()).data.user`. Bu, istifadəçi sessiyası oxumaq üçündür (service role deyil).
- `src/lib/supabase/server.ts` (mövcud, service role) — Storage üçün dəyişməz.

---

## 4. Middleware (`src/middleware.ts`)

next-intl middleware-i ilə Supabase sessiya refresh-i birləşdir:
- `createServerClient` yaradılıb `supabase.auth.getSession()` çağırılır (cookie refresh üçün);
- response-a yenilənmiş cookie set olunur;
- sonra `next-intl` middleware-i `request`/`response` üzərində işlədilir.
- Matcher: `/admin` (dev-auth), `/_next`, statik fayllar ixrac olunur; `[locale]/dashboard` və `/auth/callback` daxildir.

---

## 5. Auth Callback

`src/app/auth/callback/route.ts`:
- `code` query paramını oxu → `supabase.auth.exchangeCodeForSession(code)` → cookie set.
- `next` query (və ya default `/{defaultLocale}/dashboard`) redirect.
- Xəta olarsa login səhifəsinə redirect.

---

## 6. Tələbə Login/Register

`src/app/[locale]/dashboard/login/page.tsx` (server) + `src/components/student/EmailOtpForm.tsx` (client):
- Email daxil et → `signInWithOtp({ email, options: { emailRedirectTo: /auth/callback } })`.
- "Kod daxil et" alternativi: `verifyOtp({ email, token, type: 'email' })`.
- Uğur mesajı ("magic link göndərildi").
- **Dev fallback** (`process.env.NODE_ENV !== 'production'`): mövcud demo-student picker-i (dev-auth) "Dev login" bölməsi altında göstərilir.

> Register ayrıca səhifə deyil — OTP həm yeni, həm mövcud istifadəçi üçün işləyir; ilk login = qeydiyyat.

---

## 7. `requireStudent()` Rewrite (`src/lib/crm/student-session.ts`)

```ts
export interface StudentSession { userId: string; profile: Profile }

export async function requireStudent(locale: AppLocale): Promise<StudentSession> {
  const user = await getSessionUser();               // supabase server-session
  if (!user) redirect(`/${locale}/dashboard/login`);
  const profile = await crm.upsertStudentByAuthUid({ authUid: user.id, email: user.email!, fullName: user.user_metadata?.full_name ?? '' });
  return { userId: profile.id, profile };
}
```
Dashboard səhifələri `session.userId` (profile.id) ilə CRM sorğularını saxlayır — **UI dəyişmir**.

> `getStudentSession()` (non-throwing) eyni məntiqlə `null` qaytarır.

---

## 8. Logout

`devStudentLogout` → `signOutStudent`: server action `supabase.auth.signOut()` (server client) + redirect login.

---

## 9. Konfiqurasiya Qeydləri (istifadəçi tərəfindən)

- Supabase dashboard → Authentication → URL Configuration → **Redirect URLs**-ə əlavə et: `http://localhost:3000/auth/callback` (dev) və prod URL.
- Email provider default aktivdir; prod-da custom SMTP sonra.

---

## 10. Test Strategiyası

- **Vitest:** `upsertStudentByAuthUid` (yeni + email-merge), `getProfileByAuthUid`.
- **E2E:** dev fallback login axını (email OTP real email tələb etdiyi üçün avtomatik E2E çətin — dev picker ilə doğrulanır).
- `lint && typecheck && test && build` yaşıl.

---

## 11. Risklər

- **Magic link delivery:** Supabase default sender rate-limited; prod-da custom SMTP lazım ola bilər.
- **Redirect allowlist:** `localhost:3000/auth/callback` Supabase-də icazəli olmalıdır.
- **Dev fallback prod-a sizməsin:** `NODE_ENV` şərti mütləq; build-time yoxlanır.
- **email merge:** Supabase email-ləri unique olduğu üçün iki user eyni email ola bilməz → merge təhlükəsiz.
- **Middleware performansı:** hər request-də sessiya refresh; Supabase SDK efficient-dir, amma ölçülməli.

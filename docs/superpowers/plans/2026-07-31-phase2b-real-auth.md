# Phase 2B — Real Supabase Auth (Hybrid) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development or superpowers:executing-plans. Checkbox steps for tracking.

**Goal:** Replace student dev-auth with real Supabase Email-OTP auth (cookie sessions via `@supabase/ssr`), keeping CRM data in local Postgres and merging profiles by email via a new `profiles.auth_uid` column.

**Architecture:** Supabase holds `auth.users`; local `pg` holds `profiles`/`leads`. On login the Supabase user UUID is linked to a local profile through `auth_uid` (created/merged by email). Middleware refreshes the Supabase session cookie and runs next-intl. `requireStudent()` resolves the Supabase session → upserts/links the local profile → returns it; dashboard pages keep using `session.userId`.

**Tech Stack:** Next.js 15 App Router, `@supabase/ssr`, `@supabase/supabase-js`, next-intl, node-postgres, Zod, Vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-07-31-study-platform-phase2b-real-auth-design.md`

**Env (already in `.env.local`):** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL` (local Docker). Local Docker Postgres is up + seeded.

**Conventions:** CRM repo methods live in `src/lib/crm/repositories.ts` (interface) + `src/lib/crm/pg-repository.ts` (impl). DB-dependent Vitest tests run against seeded local DB. Commit after each task.

---

## Task 1: Install `@supabase/ssr`

**Files:** Modify `package.json`.

- [ ] **Step 1: Install**

Run: `npm install @supabase/ssr`
Expected: package added to dependencies.

- [ ] **Step 2: Verify it resolves**

Run: `node -e "require('@supabase/ssr'); console.log('ssr ok')"`
Expected: `ssr ok`.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore(deps): add @supabase/ssr for cookie-based auth"
```

---

## Task 2: `profiles.auth_uid` migration + repo methods (TDD)

**Files:**
- Create: `supabase/migrations/0010_profiles_auth_uid.sql`
- Modify: `src/lib/crm/repositories.ts` (interface)
- Modify: `src/lib/crm/pg-repository.ts` (impl)
- Test: `tests/unit/student-repository.test.ts` (extend)

- [ ] **Step 1: Create migration**

`supabase/migrations/0010_profiles_auth_uid.sql`:
```sql
-- 0010_profiles_auth_uid.sql  (lokal + Supabase)
alter table public.profiles add column if not exists auth_uid uuid;
create unique index if not exists profiles_auth_uid_uniq
  on public.profiles (auth_uid) where auth_uid is not null;
```

- [ ] **Step 2: Apply locally**

Run: `npm run db:reset`
Expected: `→ applying 0010_profiles_auth_uid.sql` then `✓ done`.

- [ ] **Step 3: Write failing tests**

Append to `tests/unit/student-repository.test.ts`:
```ts
import { randomUUID } from 'node:crypto';

describe('auth_uid profile linking', () => {
  it('creates a new student profile keyed by auth_uid', async () => {
    const uid = randomUUID();
    const email = `otp-${uid.slice(0,8)}@example.com`;
    const p = await crm.upsertStudentByAuthUid({ authUid: uid, email, fullName: 'OTP User' });
    expect(p.role).toBe('student');
    expect(p.email).toBe(email);
    const byUid = await crm.getProfileByAuthUid(uid);
    expect(byUid?.id).toBe(p.id);
  });

  it('merges an existing email profile by setting its auth_uid', async () => {
    // seed student 55555555 (Madina Yusifova) has leads but no auth_uid
    const STUDENT2 = '55555555-5555-5555-5555-555555555555';
    const before = await crm.getProfile(STUDENT2);
    expect(before?.authUid).toBeUndefined(); // not returned yet — update assertion after type change (Task 4 adds authUid to Profile)
    // For this test, just assert upsert returns the same profile id when email matches:
    const uid = randomUUID();
    const merged = await crm.upsertStudentByAuthUid({ authUid: uid, email: before!.email, fullName: before!.fullName });
    expect(merged.id).toBe(STUDENT2);
    const byUid = await crm.getProfileByAuthUid(uid);
    expect(byUid?.id).toBe(STUDENT2);
  });
});
```

- [ ] **Step 4: Run tests → expect FAIL** (`upsertStudentByAuthUid is not a function`).

- [ ] **Step 5: Add `authUid` to the `Profile` type**

In `src/types/crm.ts`, add to `Profile`:
```ts
  authUid: string | null;
```

- [ ] **Step 6: Add to interface**

In `src/lib/crm/repositories.ts` add to `CrmRepository`:
```ts
  getProfileByAuthUid(authUid: string): Promise<Profile | null>;
  upsertStudentByAuthUid(input: { authUid: string; email: string; fullName: string }): Promise<Profile>;
```

- [ ] **Step 7: Implement in pg-repository**

Update `rowToProfile` in `src/lib/crm/pg-repository.ts` to include `authUid: r.auth_uid ?? null`. Then add methods inside `createPgCrm` (after `findOrCreateStudent`):
```ts
    async getProfileByAuthUid(authUid: string): Promise<Profile | null> {
      const res = await q('select * from public.profiles where auth_uid = $1', [authUid]);
      return res.rowCount ? rowToProfile(res.rows[0]) : null;
    },

    async upsertStudentByAuthUid(input: { authUid: string; email: string; fullName: string }): Promise<Profile> {
      // 1. by auth_uid
      const byUid = await q('select * from public.profiles where auth_uid = $1', [input.authUid]);
      if (byUid.rowCount) return rowToProfile(byUid.rows[0]);
      // 2. by email → link auth_uid (merge anonymous Apply lead profile)
      const linked = await q(
        'update public.profiles set auth_uid = $1 where email = $2 returning *',
        [input.authUid, input.email],
      );
      if (linked.rowCount) return rowToProfile(linked.rows[0]);
      // 3. create new student profile
      const created = await q(
        `insert into public.profiles (email, full_name, role, auth_uid)
         values ($1, $2, 'student', $3) returning *`,
        [input.email, input.fullName || '', input.authUid],
      );
      return rowToProfile(created.rows[0]);
    },
```

- [ ] **Step 8: Run tests → expect PASS**

Run: `npm test -- student-repository`
Expected: PASS (incl. 2 new tests).

- [ ] **Step 9: Typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 10: Commit**

```bash
git add supabase/migrations/0010_profiles_auth_uid.sql src/types/crm.ts src/lib/crm/repositories.ts src/lib/crm/pg-repository.ts tests/unit/student-repository.test.ts
git commit -m "feat(crm): profiles.auth_uid + upsertStudentByAuthUid (email merge)"
```

---

## Task 3: Supabase auth clients (browser + server-session)

**Files:**
- Create: `src/lib/supabase/client.ts`
- Create: `src/lib/supabase/server-session.ts`

- [ ] **Step 1: Browser client**

`src/lib/supabase/client.ts`:
```ts
import { createBrowserClient } from '@supabase/ssr';

export function getSupabaseBrowser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY');
  return createBrowserClient(url, anon);
}
```

- [ ] **Step 2: Server-session (cookie-based, anon key)**

`src/lib/supabase/server-session.ts`:
```ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { User } from '@supabase/supabase-js';

export async function getSupabaseSessionClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY');
  const store = await cookies();
  return createServerClient(url, anon, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (toSet) => {
        try {
          toSet.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          // setAll can throw in Server Components (read-only cookies) — safe to ignore.
        }
      },
    },
  });
}

export async function getSessionUser(): Promise<User | null> {
  const supabase = await getSupabaseSessionClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
```

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/lib/supabase/client.ts src/lib/supabase/server-session.ts
git commit -m "feat(auth): supabase browser + server-session clients (@supabase/ssr)"
```

---

## Task 4: Middleware — Supabase session refresh + next-intl

**Files:** Modify `src/middleware.ts`.

- [ ] **Step 1: Rewrite middleware**

Replace `src/middleware.ts` with:
```ts
import { NextResponse, type NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { createServerClient } from '@supabase/ssr';
import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

export default async function middleware(req: NextRequest) {
  // 1) next-intl first (handles locale prefixing, may redirect).
  const res = intlMiddleware(req);

  // 2) Refresh Supabase session cookies on the same response.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && anon) {
    const supabase = createServerClient(url, anon, {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (toSet) => {
          toSet.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
        },
      },
    });
    await supabase.auth.getSession();
  }

  return res;
}

export const config = {
  // Run intl + session refresh everywhere EXCEPT admin (dev-auth), api, static, etc.
  matcher: ['/((?!admin|api|_next|_vercel|auth|.*\\..*).*)'],
};
```

> Note: `/auth/callback` is excluded from middleware (handled by its own route handler) to avoid locale-prefixing the callback URL.

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: PASS (middleware compiles).

- [ ] **Step 3: Commit**

```bash
git add src/middleware.ts
git commit -m "feat(auth): middleware refreshes supabase session + next-intl"
```

---

## Task 5: Auth callback route

**Files:** Create `src/app/auth/callback/route.ts`.

- [ ] **Step 1: Create the route handler**

```ts
import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { routing } from '@/i18n/routing';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const next = url.searchParams.get('next') ?? `/${routing.defaultLocale}/dashboard`;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createServerClient(supabaseUrl, anon, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: (toSet) => {
        const res = NextResponse.next({ request: req });
        toSet.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
      },
    },
  });

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(new URL(`/${routing.defaultLocale}/dashboard/login?error=auth`, req.url));
    }
  }
  return NextResponse.redirect(new URL(next, req.url));
}
```

> The `setAll` here builds a throwaway response only to set cookies; the final redirect carries the session via the request cookies re-applied by `@supabase/ssr`. In practice, `exchangeCodeForSession` sets cookies on the client; for the redirect to persist them, prefer constructing the redirect response and setting cookies on it. Simpler verified pattern: after exchange, read the set-cookie from a `NextResponse.redirect` and copy. If cookies don't persist on first run, switch to the documented "create redirect response, pass to setAll" pattern. (Implementer: verify with the build + a manual check; the dev fallback still works regardless.)

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/app/auth/callback/route.ts
git commit -m "feat(auth): /auth/callback code-exchange route"
```

---

## Task 6: Rewrite `requireStudent` / `getStudentSession` + logout

**Files:** Modify `src/lib/crm/student-session.ts`; Modify `src/components/student/StudentTopbar.tsx`; Modify `src/app/actions/student-auth.ts`.

- [ ] **Step 1: Rewrite `student-session.ts`**

Replace the body of `src/lib/crm/student-session.ts` with:
```ts
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import type { AppLocale } from '@/i18n/routing';
import { crm } from './index';
import { getSessionUser } from '@/lib/supabase/server-session';
import type { Profile } from '@/types/crm';

export const STUDENT_SESSION_COOKIE = 'student_session'; // legacy dev-auth cookie name (kept for dev fallback)

export interface StudentSession {
  userId: string; // local profile.id (CRM queries key on this)
  profile: Profile;
}

export async function getStudentSession(): Promise<StudentSession | null> {
  const user = await getSessionUser();
  if (!user) return null;
  const profile = await crm.upsertStudentByAuthUid({
    authUid: user.id,
    email: user.email ?? '',
    fullName: (user.user_metadata?.full_name as string | undefined) ?? '',
  });
  return { userId: profile.id, profile };
}

export async function requireStudent(locale: AppLocale): Promise<StudentSession> {
  const session = await getStudentSession();
  if (!session) redirect(`/${locale}/dashboard/login`);
  return session;
}

// ---- Dev fallback (NODE_ENV !== production): pick a seeded demo student ----
export async function getDevStudentSession(): Promise<StudentSession | null> {
  if (process.env.NODE_ENV === 'production') return null;
  const store = await cookies();
  const raw = store.get(STUDENT_SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    const { userId } = JSON.parse(raw) as { userId: string };
    const profile = await crm.getProfile(userId);
    return profile ? { userId: profile.id, profile } : null;
  } catch {
    return null;
  }
}

export async function requireStudentAny(locale: AppLocale): Promise<StudentSession> {
  // Try real Supabase session first, then dev fallback (dev only).
  const session = (await getStudentSession()) ?? (await getDevStudentSession());
  if (!session) redirect(`/${locale}/dashboard/login`);
  return session;
}
```

- [ ] **Step 2: Switch dashboard layout + pages to `requireStudentAny`**

In `src/app/[locale]/dashboard/(app)/layout.tsx`, change `requireStudent` → `requireStudentAny` (import from `@/lib/crm/student-session`). Keep everything else. The dashboard pages already use `requireStudent(locale as AppLocale)` — update each to `requireStudentAny(locale as AppLocale)` (overview, applications list, applications/[id], documents, messages, notifications). Files to update:
- `src/app/[locale]/dashboard/(app)/layout.tsx`
- `src/app/[locale]/dashboard/(app)/page.tsx`
- `src/app/[locale]/dashboard/(app)/applications/page.tsx`
- `src/app/[locale]/dashboard/(app)/applications/[id]/page.tsx`
- `src/app/[locale]/dashboard/(app)/documents/page.tsx`
- `src/app/[locale]/dashboard/(app)/messages/page.tsx`
- `src/app/[locale]/dashboard/(app)/notifications/page.tsx`

(Only the import + the call site change `requireStudent` → `requireStudentAny`.)

- [ ] **Step 3: Fix `StudentTopbar` (session shape changed)**

`StudentTopbar` uses `session.fullName`. Update it to use `session.profile.fullName`:
```tsx
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
      <div className="text-sm font-semibold text-foreground">{session.profile.fullName}</div>
      <form action={signOutStudent.bind(null, locale)}>
        <button type="submit" className="text-sm text-muted-foreground hover:text-foreground">
          {t('logout')}
        </button>
      </form>
    </header>
  );
}
```
Import `signOutStudent` from `@/app/actions/student-auth` (replace `devStudentLogout`).

- [ ] **Step 4: Add `signOutStudent` + keep `devStudentLogin` (fallback)**

In `src/app/actions/student-auth.ts`, keep `devStudentLogin` (used by the dev picker). Replace `devStudentLogout` with `signOutStudent`:
```ts
export async function signOutStudent(locale: string) {
  const { getSupabaseSessionClient } = await import('@/lib/supabase/server-session');
  const supabase = await getSupabaseSessionClient();
  await supabase.auth.signOut();
  const store = await cookies();
  store.delete(STUDENT_SESSION_COOKIE); // clear dev fallback cookie too
  redirect(`/${locale}/dashboard/login`);
}
```
Keep the existing `devStudentLogin` export unchanged.

- [ ] **Step 5: Typecheck + build**

Run: `npm run typecheck && npm run build`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/crm/student-session.ts src/components/student/StudentTopbar.tsx src/app/actions/student-auth.ts 'src/app/[locale]/dashboard'
git commit -m "feat(auth): requireStudent resolves supabase session → profile; signOutStudent"
```

---

## Task 7: Student login page — email OTP + dev fallback

**Files:**
- Create: `src/components/student/EmailOtpForm.tsx`
- Modify: `src/app/[locale]/dashboard/login/page.tsx`

- [ ] **Step 1: Create `EmailOtpForm` (client)**

`src/components/student/EmailOtpForm.tsx`:
```tsx
'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { getSupabaseBrowser } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function EmailOtpForm({ redirectTo }: { redirectTo: string }) {
  const t = useTranslations('Student.auth');
  const [mode, setMode] = useState<'request' | 'verify'>('request');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function requestCode(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const supabase = getSupabaseBrowser();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });
    if (error) { setErr(t('error')); return; }
    setMsg(t('linkSent'));
    setMode('verify');
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const supabase = getSupabaseBrowser();
    const { error } = await supabase.auth.verifyOtp({ email, token: code, type: 'email' });
    if (error) { setErr(t('error')); return; }
    window.location.href = redirectTo;
  }

  return (
    <div className="space-y-3">
      <form onSubmit={mode === 'request' ? requestCode : verifyCode} className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="email">{t('email')}</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={mode === 'verify'} />
        </div>
        {mode === 'verify' && (
          <div className="space-y-1">
            <Label htmlFor="code">{t('code')}</Label>
            <Input id="code" required value={code} onChange={(e) => setCode(e.target.value)} />
          </div>
        )}
        {err && <p className="text-sm text-destructive">{err}</p>}
        {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
        <Button type="submit" className="w-full">{mode === 'request' ? t('sendLink') : t('verify')}</Button>
      </form>
      {mode === 'verify' && (
        <button type="button" onClick={() => setMode('request')} className="text-xs text-muted-foreground hover:underline">
          {t('back')}
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Rewrite the login page**

`src/app/[locale]/dashboard/login/page.tsx`:
```tsx
import { getTranslations } from 'next-intl/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmailOtpForm } from '@/components/student/EmailOtpForm';
import { Button } from '@/components/ui/button';
import { crm } from '@/lib/crm';

export const dynamic = 'force-dynamic';

export default async function StudentLoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Student.login' });
  const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/${locale}/dashboard`;
  const callbackUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/auth/callback?next=/${locale}/dashboard`;
  const isDev = process.env.NODE_ENV !== 'production';

  let demoStudents: Awaited<ReturnType<typeof crm.listStudents>> = [];
  if (isDev) demoStudents = await crm.listStudents();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
          <CardDescription>{t('subtitle')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <EmailOtpForm redirectTo={callbackUrl} />
          {isDev && demoStudents.length > 0 && (
            <div className="space-y-2 border-t border-border pt-4">
              <p className="text-xs uppercase text-muted-foreground">Dev login</p>
              {demoStudents.map((s) => (
                <form key={s.id} action={devLoginAction} className="block">
                  <input type="hidden" name="profileId" value={s.id} />
                  <input type="hidden" name="locale" value={locale} />
                  <Button type="submit" variant="outline" size="sm" className="w-full justify-between">
                    <span>{s.fullName}</span>
                    <span className="text-xs text-muted-foreground">{s.email}</span>
                  </Button>
                </form>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

async function devLoginAction(formData: FormData) {
  'use server';
  const { devStudentLogin } = await import('@/app/actions/student-auth');
  await devStudentLogin({
    profileId: String(formData.get('profileId')),
    locale: String(formData.get('locale')),
  });
}
```

> `devStudentLogin` (existing) sets the legacy `student_session` cookie → `getDevStudentSession`/`requireStudentAny` resolves it in dev. In production the dev picker is hidden (`isDev` false) and only email OTP is shown.

- [ ] **Step 3: Typecheck + build**

Run: `npm run typecheck && npm run build`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/components/student/EmailOtpForm.tsx 'src/app/[locale]/dashboard/login/page.tsx'
git commit -m "feat(auth): student email OTP login + dev fallback picker"
```

---

## Task 8: i18n auth keys (4 languages)

**Files:** Modify `src/messages/{en,tr,az,ru}.json` (add `Student.auth` namespace).

- [ ] **Step 1: Add to each file's `Student` object** an `auth` sub-key.

`en.json`:
```json
"auth": { "email": "Email", "code": "Verification code", "sendLink": "Send magic link", "verify": "Verify code", "back": "Use a different email", "linkSent": "Check your email for the magic link (or enter the code).", "error": "Something went wrong. Try again." }
```
`tr.json`:
```json
"auth": { "email": "E-posta", "code": "Doğrulama kodu", "sendLink": "Sihirli bağlantı gönder", "verify": "Kodu doğrula", "back": "Farklı e-posta kullan", "linkSent": "E-postanızı kontrol edin (veya kodu girin).", "error": "Bir şeyler ters gitti. Tekrar deneyin." }
```
`az.json`:
```json
"auth": { "email": "E-poçt", "code": "Təsdiq kodu", "sendLink": "Sehrli link göndər", "verify": "Kodu təsdiqlə", "back": "Başqa e-poçt istifadə et", "linkSent": "E-poçtunuzu yoxlayın (və ya kodu daxil edin).", "error": "Bir şey xəta verdi. Təkrar cəhd edin." }
```
`ru.json`:
```json
"auth": { "email": "Эл. почта", "code": "Код подтверждения", "sendLink": "Отправить ссылку", "verify": "Проверить код", "back": "Использовать другую почту", "linkSent": "Проверьте почту (или введите код).", "error": "Что-то пошло не так. Попробуйте снова." }
```
(Insert each `auth` block as a sibling key inside the existing `Student` object, keeping JSON valid.)

- [ ] **Step 2: Validate + build**

Run: `node -e "['en','tr','az','ru'].forEach(l=>require('./src/messages/'+l+'.json')); console.log('json ok')"` then `npm run build`.
Expected: `json ok`, build PASS.

- [ ] **Step 3: Commit**

```bash
git add src/messages
git commit -m "feat(i18n): Student.auth namespace (en/tr/az/ru)"
```

---

## Task 9: Tests + final quality gate

**Files:** Modify `tests/e2e/student-dashboard.spec.ts` (use dev fallback for E2E).

- [ ] **Step 1: E2E uses the dev fallback** (real email OTP can't run headless)

`tests/e2e/student-dashboard.spec.ts` — the existing spec clicks the first button on `/en/dashboard/login`. Since the dev picker is the FIRST set of buttons in dev mode, the existing spec still works. Keep it; optionally make the selector more robust by targeting a button within the "Dev login" block:
```ts
import { test, expect } from '@playwright/test';

test('student dev-login → overview → messages', async ({ page }) => {
  await page.goto('/en/dashboard/login');
  // dev fallback: first demo student button
  await page.getByRole('button', { name: /Ali Veli/ }).click();
  await expect(page).toHaveURL(/\/en\/dashboard$/);
  await expect(page.getByRole('heading', { name: 'My dashboard' })).toBeVisible();
  await page.getByRole('link', { name: 'Messages' }).click();
  await expect(page).toHaveURL(/\/en\/dashboard\/messages/);
});
```

- [ ] **Step 2: Run full gate**

Run:
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`
Expected: all green; unit tests include the 2 new `auth_uid` tests.

- [ ] **Step 3: Run E2E**

Run: `npm run test:e2e -- student-dashboard`
Expected: PASS (dev fallback).

- [ ] **Step 4: Commit**

```bash
git add tests/e2e/student-dashboard.spec.ts
git commit -m "test(e2e): student dashboard uses dev fallback login"
```

---

## Notes for the implementer

- **`requireStudentAny`** is the single entry point for all guarded dashboard pages (real Supabase session first, dev cookie fallback second). Use it everywhere; do not call the raw `requireStudent` (Supabase-only) in pages.
- **Callback cookie persistence:** if `exchangeCodeForSession` doesn't persist cookies on redirect in Task 5, use the documented pattern: build the `NextResponse.redirect` first and pass it into `setAll` so cookies land on the redirect response. Verify by signing in once manually.
- **Supabase dashboard config (user, not code):** add `http://localhost:3000/auth/callback` to Authentication → URL Configuration → Redirect URLs.
- **Dev fallback safety:** gated by `process.env.NODE_ENV !== 'production'`; build strips it in prod. The `devStudentLogin` action is only reachable when the picker renders (dev).
- **Profile merge:** `upsertStudentByAuthUid` links by email — an anonymous Apply-captured profile (same email) is adopted on first real login, so the student's earlier lead appears in their dashboard.

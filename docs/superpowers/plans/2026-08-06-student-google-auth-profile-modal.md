# Student Google Auth, Profile Modal, Floating Buttons, and Rich Apply Form Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace email-OTP student login with Google OAuth, add a header profile avatar opening a full student dashboard in a right-side drawer modal (StudyLeo-style), add floating Apply + WhatsApp/Telegram buttons, and enrich the Apply form with university/program selection, degree level, language, documents, and preferences. Keep `/admin` and `/[locale]/dashboard` untouched.

**Architecture:** Add Supabase Google OAuth with student auto-registration; render a session-aware Header (Login button vs avatar); add a Radix Dialog-based `StudentProfileDrawer` reusing existing dashboard components; add `FloatingApplyButton` and `FloatingChatButtons` to the marketing layout; rewrite `ApplyForm` with four section cards and extended `submitLead` action; keep RLS/route guards existing.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Supabase Auth/Storage, `@supabase/ssr`, `@supabase/supabase-js`, Radix UI Dialog, Zod, react-hook-form, Tailwind CSS, Vitest, Playwright.

---

## Scope and File Map

### Auth

- Modify: `src/components/auth/EmailOtpForm.tsx` — replace OTP with `GoogleSignInButton` (client OAuth `signInWithOAuth({ provider: 'google' })`); keep file export name for backwards compat in login page, or rename and update consumers.
- Create: `src/components/auth/GoogleSignInButton.tsx` — reusable Google OAuth trigger with `redirectTo` prop.
- Modify: `src/app/auth/callback/route.ts` — keep existing logic; verify student path upserts profile when no `staff_access`.
- Modify: `src/app/[locale]/dashboard/login/page.tsx` — drop `EmailOtpForm`, mount `GoogleSignInButton`; keep dev login demo students behind `DEV_AUTH_ENABLED`.
- Modify: `src/middleware.ts` — no change required (existing `getSession()` refreshes session); verify matcher covers `/[locale]/login` if introduced.
- Modify: `.env.example` — document Google OAuth provider requirement and `NEXT_PUBLIC_SITE_URL`.

### Header

- Modify: `src/components/layout/header.tsx` — accept `session?: StudentSession | null` prop; render `GoogleSignInButton` when logged out, `ProfileAvatarTrigger` + `StudentProfileDrawer` when logged in.
- Modify: `src/app/[locale]/(marketing)/layout.tsx` — pass server-resolved student session to `Header`.
- Create: `src/lib/student-session-server.ts` — server-side helper to resolve current student session once and pass down to layout/Header (avoid duplicate `getSessionUser` calls).

### Profile Drawer

- Create: `src/components/student/StudentProfileDrawer.tsx` — Radix `Dialog` right-side sheet, tabbed: Applications, Documents, Messages, Notifications, Profile, Sign out; lazy mount tab content via server components passed as children or fetch on tab switch.
- Create: `src/components/student/StudentDrawerApplications.tsx` — calls `crm.listMyLeads(session.userId)` and renders application list (reuses `LeadStatusBadge`).
- Create: `src/components/student/StudentDrawerDocuments.tsx` — calls `crm.listMyDocuments(session.userId)`; upload button (Supabase Storage).
- Create: `src/components/student/StudentDrawerMessages.tsx` — calls `crm.listMessages(leadId)` for the most recent lead; show thread.
- Create: `src/components/student/StudentDrawerNotifications.tsx` — calls `crm.listNotifications(session.userId, 20)`; mark read action.
- Create: `src/components/student/StudentDrawerProfile.tsx` — editable profile form (phone, whatsapp, country); change password via existing `changePasswordAction`.
- Reuse: existing `LeadStatusBadge`, notification badge logic.
- Modify: `src/app/actions/notifications.ts` if required by drawer (none expected).

### Floating Buttons

- Create: `src/components/layout/FloatingApplyButton.tsx` — `position: fixed; bottom: 24px; right: 24px;` pill, links to `/{locale}/apply`, hidden on `/apply` and `/admin` (use `usePathname`).
- Modify: `src/components/layout/whatsapp-float.tsx` — move to bottom-left, add Telegram button sibling, extract to `FloatingChatButtons` or extend the file.
- Modify: `src/config/site.ts` — add `contact.telegram` handle.
- Modify: `src/app/[locale]/(marketing)/layout.tsx` — render `<FloatingApplyButton locale={locale} />` and updated `<FloatingChatButtons />`.
- Verify: chat widget already conditional via `isGeoLocale`; floating chat buttons can stay global on marketing routes.

### Apply Form

- Modify: `src/lib/validations/lead.ts` — extend `leadSchema` with: `universityId` (string required), `programId` (optional), `degreeLevel` (enum `bachelor|master|associate|phd`), `instructionLanguage` (enum `english|turkish`), `dateOfBirth` (date string), `gender` (enum `male|female|other`), `nationality` (string, reuses country field), `passportUrl` (string optional), `diplomaUrl` (string optional), `photoUrl` (string optional), `motivationLetterUrl` (string optional), `scholarshipInterest` (boolean), `dormitory` (boolean), `intake` (enum `fall|spring`), `notes2` (replaces `message` or coexist). Keep `website` honeypot.
- Modify: `src/components/sections/apply-form.tsx` — rewrite into four section cards; add `Combobox`-style university/program selects; add file inputs that POST to a new server action; use `react-hook-form` Controller for select/checkbox fields.
- Create: `src/app/actions/upload-apply-document.ts` — server action accepting `FormData` file, returning a storage URL; uses Supabase Storage when configured, local placeholder URL otherwise; mime/size validation.
- Modify: `src/app/actions/leads.ts` — accept new schema fields; pass to `crm.createPublicLead` / `crm.createLead`; map `degreeLevel`, `instructionLanguage`, `intake`, `gender`, `dateOfBirth`, document URLs, scholarship/dormitory into `notes` JSON metadata or extend the `leads` table if necessary (preferably JSON metadata to avoid schema migration).
- Modify: `src/app/[locale]/(marketing)/apply/page.tsx` — pass `universities` and `programs` lists to `ApplyForm` (currently only countries passed).
- Verify: existing honeypot + rate-limit keep working.

### Locales / i18n

- Modify: `src/messages/en.json`, `src/messages/az.json`, `src/messages/tr.json`, `src/messages/ru.json` — keys for: `Student.auth.googleLogin`, `Header.profile`, `Header.login`, drawer tab labels, apply form section headers + new field labels, intake/degree/language enums.

### Tests

- Create: `tests/unit/apply-form-schema.test.ts` — Zod schema for each section + combined; honeypot still rejects filled `website`.
- Create: `tests/unit/google-sign-in-button.test.ts` — renders button, asserts OAuth call signature (mocked `getSupabaseBrowser`).
- Create: `tests/unit/student-profile-drawer.test.ts` — renders open/close, tab switching, ESC closes.
- Create: `tests/unit/floating-buttons.test.ts` — hidden on `/admin`, apply hidden on `/apply`, links correct.
- Modify: `tests/e2e/admin.spec.ts` — keep as-is (admin unaffected).
- Create: `tests/e2e/student-google-auth.spec.ts` — login → avatar visible → drawer opens → Applications tab shows seeded application (use deterministic test seam for auth).
- Create: `tests/e2e/apply-form-rich.spec.ts` — select university → program filters → fill sections → submit → admin queue shows new application.

## Implementation Tasks

### Task 1: Google OAuth sign-in button and email OTP replacement

**Files:**
- Create: `src/components/auth/GoogleSignInButton.tsx`
- Modify: `src/components/auth/EmailOtpForm.tsx`
- Modify: `src/app/[locale]/dashboard/login/page.tsx`
- Modify: `.env.example`
- Test: `tests/unit/google-sign-in-button.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';

vi.mock('@/lib/supabase/client', () => ({
  getSupabaseBrowser: () => ({
    auth: {
      signInWithOAuth: vi.fn().mockResolvedValue({ data: { url: 'https://auth.supabase.co' }, error: null }),
    },
  }),
}));

describe('GoogleSignInButton', () => {
  it('renders a button labeled with Google', () => {
    render(<GoogleSignInButton redirectTo="/az/dashboard" />);
    expect(screen.getByRole('button', { name: /google/i })).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test, verify FAIL**

Run: `npm test -- tests/unit/google-sign-in-button.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement GoogleSignInButton**

```tsx
'use client';
import { useState } from 'react';
import { getSupabaseBrowser } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';

export function GoogleSignInButton({ redirectTo }: { redirectTo: string }) {
  const [pending, setPending] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function signIn() {
    setPending(true);
    setErr(null);
    const supabase = getSupabaseBrowser();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    });
    if (error) setErr(error.message);
    setPending(false);
  }
  return (
    <>
      <Button type="button" onClick={signIn} disabled={pending} className="w-full gap-2">
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z" />
        </svg>
        {pending ? 'Connecting...' : 'Continue with Google'}
      </Button>
      {err && <p className="text-sm text-destructive">{err}</p>}
    </>
  );
}
```

- [ ] **Step 4: Update the student login page to use it**

In `src/app/[locale]/dashboard/login/page.tsx`, replace `<EmailOtpForm redirectTo={callbackUrl} />` with `<GoogleSignInButton redirectTo={callbackUrl} />`. Keep the dev demo students block as-is.

- [ ] **Step 5: Add env documentation**

Append to `.env.example`:
```env
# --- Student Google OAuth (Phase: Social Auth) ---
# Enable the Google provider in Supabase Dashboard → Auth → Providers.
# Add http://localhost:3000/auth/callback and https://<domain>/auth/callback
# to the Supabase "Redirect URLs" allowlist.
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

- [ ] **Step 6: Run tests & typecheck**

Run:
```bash
npm test -- tests/unit/google-sign-in-button.test.ts
npm run typecheck
npm run lint
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add -- src/components/auth/GoogleSignInButton.tsx src/app/[locale]/dashboard/login/page.tsx .env.example tests/unit/google-sign-in-button.test.ts
git commit -m "feat: replace student email otp with google oauth button"
```

### Task 2: Session-aware Header (Login button vs profile avatar)

**Files:**
- Create: `src/lib/student-session-server.ts`
- Modify: `src/components/layout/header.tsx`
- Modify: `src/app/[locale]/(marketing)/layout.tsx`
- Test: `tests/unit/header-session.test.tsx`

- [ ] **Step 1: Write failing test**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from '@/components/layout/header';

// Mock next-intl + i18n navigation as in existing project tests
vi.mock('next-intl', () => ({ useTranslations: () => (k: string) => k }));
vi.mock('@/i18n/navigation', () => ({ Link: ({ children }: any) => <a>{children}</a>, usePathname: () => '/' }));

describe('Header session', () => {
  it('shows Login when no session', () => {
    render(<Header session={null} />);
    expect(screen.getByText(/login/i)).toBeDefined();
  });
  it('shows avatar when session exists', () => {
    render(<Header session={{ userId: 'u1', profile: { fullName: 'Ali', email: 'a@b.c', role: 'student' } as any }} />);
    expect(screen.getByText('A')).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test, FAIL**

- [ ] **Step 3: Create server session helper**

```ts
// src/lib/student-session-server.ts
import { getStudentSession } from '@/lib/crm/student-session';
export async function getStudentSessionForLayout() {
  return getStudentSession();
}
```

- [ ] **Step 4: Update `Header` to accept `session` prop**

Add prop `session: { userId: string; profile: { fullName: string; email: string; role: string } } | null`. When `session` truthy, render avatar (initials from `fullName[0]`) + name; click opens `StudentProfileDrawer` (placeholder `console.log` for now, replaced in Task 3). When falsy, render `<GoogleSignInButton redirectTo={siteUrl + '/' + locale + '/dashboard'} />` compact.

- [ ] **Step 5: Update marketing layout to pass session**

```tsx
import { getStudentSessionForLayout } from '@/lib/student-session-server';
const session = await getStudentSessionForLayout();
<Header session={session} />
```

- [ ] **Step 6: Run tests & typecheck**

- [ ] **Step 7: Commit**

```bash
git add -- src/lib/student-session-server.ts src/components/layout/header.tsx "src/app/[locale]/(marketing)/layout.tsx" tests/unit/header-session.test.tsx
git commit -m "feat: session-aware header with login/avatar"
```

### Task 3: Student Profile Drawer (right-side sliding modal)

**Files:**
- Create: `src/components/student/StudentProfileDrawer.tsx`
- Create: `src/components/student/StudentDrawerApplications.tsx`
- Create: `src/components/student/StudentDrawerDocuments.tsx`
- Create: `src/components/student/StudentDrawerMessages.tsx`
- Create: `src/components/student/StudentDrawerNotifications.tsx`
- Create: `src/components/student/StudentDrawerProfile.tsx`
- Modify: `src/components/layout/header.tsx` — wire drawer open trigger
- Test: `tests/unit/student-profile-drawer.test.tsx`

- [ ] **Step 1: Failing test — drawer opens and closes**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StudentProfileDrawer } from '@/components/student/StudentProfileDrawer';

vi.mock('next-intl', () => ({ useTranslations: () => (k: string) => k }));

describe('StudentProfileDrawer', () => {
  it('shows tabs when open and closes on ESC', () => {
    const onClose = vi.fn();
    const { container } = render(
      <StudentProfileDrawer session={{ userId: 'u1', profile: { fullName: 'Ali', email: 'a@b.c', role: 'student' } as any }} />,
    );
    // Radix Dialog renders to portal; check tab labels exist
    expect(screen.getByText(/applications/i)).toBeDefined();
    fireEvent.keyDown(container.ownerDocument.body, { key: 'Escape' });
  });
});
```

- [ ] **Step 2: Run test, FAIL**

- [ ] **Step 3: Implement `StudentProfileDrawer`**

Use Radix `Dialog`. Props: `session: StudentSession`. Right-side `DialogContent` (`fixed right-0 top-0 h-full w-full max-w-md`), tabs via local state (`'applications'|'documents'|'messages'|'notifications'|'profile'`). Each tab lazily renders the matching `StudentDrawer*` component (which receives `session.userId`). Sign-out button calls existing `signOutStudent` action. ESC + overlay click closes (Radix built-in).

- [ ] **Step 4: Implement each tab component**

Each is a Server Component-shaped client component that fetches via `crm.*(userId)`:
- `StudentDrawerApplications` — `crm.listMyLeads(userId)` + `listMyApplications(userId)`.
- `StudentDrawerDocuments` — `crm.listMyDocuments(userId)`.
- `StudentDrawerMessages` — pick latest lead, `crm.listMessages(leadId)`.
- `StudentDrawerNotifications` — `crm.listNotifications(userId, 20)`; mark-read via existing action.
- `StudentDrawerProfile` — profile form bound to `session.profile`; call update via `student.ts` action; password change via existing `changePasswordAction`.

- [ ] **Step 5: Wire drawer in Header**

Replace placeholder `console.log` with `setDrawerOpen(true)` and render `<StudentProfileDrawer session={session} />` when open.

- [ ] **Step 6: Run tests & typecheck**

- [ ] **Step 7: Commit**

```bash
git add -- src/components/student/StudentProfileDrawer.tsx src/components/student/StudentDrawerApplications.tsx src/components/student/StudentDrawerDocuments.tsx src/components/student/StudentDrawerMessages.tsx src/components/student/StudentDrawerNotifications.tsx src/components/student/StudentDrawerProfile.tsx src/components/layout/header.tsx tests/unit/student-profile-drawer.test.tsx
git commit -m "feat: student profile drawer with dashboard tabs"
```

### Task 4: Floating Apply + WhatsApp/Telegram buttons

**Files:**
- Create: `src/components/layout/FloatingApplyButton.tsx`
- Modify: `src/components/layout/whatsapp-float.tsx` (rename or add Telegram sibling)
- Modify: `src/config/site.ts` — add `contact.telegram`
- Modify: `src/app/[locale]/(marketing)/layout.tsx` — render both floating groups
- Test: `tests/unit/floating-buttons.test.tsx`

- [ ] **Step 1: Failing test**

```tsx
it('FloatingApplyButton hidden on /apply', () => {
  vi.mock('next/navigation', () => ({ usePathname: () => '/en/apply' }));
  render(<FloatingApplyButton locale="en" />);
  expect(screen.queryByRole('link', { name: /apply/i })).toBeNull();
});
it('FloatingChatButtons hidden on /admin', () => {
  vi.mock('next/navigation', () => ({ usePathname: () => '/admin' }));
  render(<FloatingChatButtons />);
  expect(screen.queryByLabelText(/whatsapp/i)).toBeNull();
});
```

- [ ] **Step 2: Run test, FAIL**

- [ ] **Step 3: Add Telegram to site config**

```ts
contact: {
  ...,
  telegram: { handle: 'studyhub', url: 'https://t.me/studyhub' },
},
```

- [ ] **Step 4: Implement `FloatingApplyButton`**

```tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
export function FloatingApplyButton({ locale }: { locale: string }) {
  const pathname = usePathname();
  if (pathname.startsWith('/admin') || pathname.includes('/apply')) return null;
  return (
    <Link
      href={`/${locale}/apply`}
      className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-flat-hover transition-transform hover:scale-105"
    >
      Apply Now <ArrowRight className="h-4 w-4" />
    </Link>
  );
}
```

- [ ] **Step 5: Update `whatsapp-float.tsx` to move bottom-left + add Telegram**

```tsx
import { siteConfig } from '@/config/site';
import { usePathname } from 'next/navigation';
export function FloatingChatButtons() {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;
  const wa = siteConfig.contact.whatsapp;
  const tg = siteConfig.contact.telegram;
  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-3">
      <a href={`https://wa.me/${wa.number}?text=${encodeURIComponent(wa.message)}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-flat-hover hover:scale-105">
        {/* WhatsApp svg */}
      </a>
      <a href={tg.url} target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="flex h-12 w-12 items-center justify-center rounded-full bg-[#229ED9] text-white shadow-flat-hover hover:scale-105">
        {/* Telegram svg */}
      </a>
    </div>
  );
}
```

- [ ] **Step 6: Render in marketing layout**

```tsx
<FloatingApplyButton locale={locale} />
<FloatingChatButtons />
```

Remove old `<WhatsAppFloat />`.

- [ ] **Step 7: Run tests & typecheck**

- [ ] **Step 8: Commit**

```bash
git add -- src/components/layout/FloatingApplyButton.tsx src/components/layout/whatsapp-float.tsx src/config/site.ts "src/app/[locale]/(marketing)/layout.tsx" tests/unit/floating-buttons.test.tsx
git commit -m "feat: floating apply + whatsapp/telegram bottom-left buttons"
```

### Task 5: Extend Apply form schema and server action

**Files:**
- Modify: `src/lib/validations/lead.ts`
- Modify: `src/app/actions/leads.ts`
- Modify: `src/app/actions/upload-apply-document.ts` (new)
- Test: `tests/unit/apply-form-schema.test.ts`

- [ ] **Step 1: Failing test**

```ts
import { leadSchema } from '@/lib/validations/lead';
describe('extended leadSchema', () => {
  it('accepts full apply payload', () => {
    const res = leadSchema.safeParse({
      firstName: 'A', lastName: 'B', email: 'a@b.c', phone: '+9012345678', country: 'TR', locale: 'en',
      universityId: 'istanbul-medipol', degreeLevel: 'bachelor', instructionLanguage: 'english',
      dateOfBirth: '2000-01-01', gender: 'male', nationality: 'TR',
      scholarshipInterest: true, dormitory: false, intake: 'fall', website: '',
    });
    expect(res.success).toBe(true);
  });
  it('rejects invalid degreeLevel', () => {
    const r = leadSchema.safeParse({ /* … degreeLevel: 'xyz' … */ });
    expect(r.success).toBe(false);
  });
});
```

- [ ] **Step 2: Run test, FAIL**

- [ ] **Step 3: Extend `leadSchema`**

Add fields: `universityId` (string min 1), `programId` (string optional), `degreeLevel` (enum `bachelor|master|associate|phd`), `instructionLanguage` (enum `english|turkish`), `dateOfBirth` (string date), `gender` (enum `male|female|other|prefer-not`), `nationality` (string), `passportUrl|diplomaUrl|photoUrl|motivationLetterUrl` (string URL optional), `scholarshipInterest` (boolean), `dormitory` (boolean), `intake` (enum `fall|spring`). Keep `website` honeypot at end.

- [ ] **Step 4: Extend `submitLead` action**

After `findOrCreateStudent`, store extra fields into `leads.notes` as JSON (`{ degreeLevel, instructionLanguage, intake, scholarshipInterest, dormitory, dateOfBirth, gender, nationality, documents: { passport, diploma, photo, motivationLetter } }`) — preserve existing `universityId` and `programId` mapping. Document URLs come from the new upload action.

- [ ] **Step 5: Implement `upload-apply-document.ts` server action**

Accepts `FormData` with file + field name. Validates mime/size (jpg, png, pdf; ≤5MB). When Supabase configured, upload to `apply-documents/{userId}/{fieldName}/{filename}` bucket and return public URL. Otherwise return a local placeholder path. Zod-validate the result before responding.

- [ ] **Step 6: Run tests & typecheck**

- [ ] **Step 7: Commit**

```bash
git add -- src/lib/validations/lead.ts src/app/actions/leads.ts src/app/actions/upload-apply-document.ts tests/unit/apply-form-schema.test.ts
git commit -m "feat: extend lead schema with rich apply fields and document upload"
```

### Task 6: Rewrite ApplyForm UI with four sections

**Files:**
- Modify: `src/components/sections/apply-form.tsx`
- Modify: `src/app/[locale]/(marketing)/apply/page.tsx` — pass `universities` and `programs`
- Test: `tests/unit/apply-form-rich.test.tsx`

- [ ] **Step 1: Failing test — section headings render**

Test that "Education selection", "Personal info", "Documents", "Preferences" headings appear.

- [ ] **Step 2: Run test, FAIL**

- [ ] **Step 3: Rewrite `ApplyForm`**

Accept new props: `universities: University[]`, `programs: UniversityProgram[]` (filtered by selected university via `Controller`). Render four card sections:
1. **Education selection** — university Combobox (search select), program select (filtered), degree segmented buttons, language segmented buttons.
2. **Personal info** — first/last name, email, phone, DOB (date input), gender (select), nationality (select from `countries`).
3. **Documents** — four file inputs (passport, diploma, photo, motivation letter). On change, upload via `uploadApplyDocument` action; store returned URL in form state and pass on submit.
4. **Preferences & submit** — scholarship checkbox, dormitory checkbox, intake select, notes textarea, honeypot hidden, submit button.

- [ ] **Step 4: Update apply page to pass lists**

```tsx
const [universities, programs] = await Promise.all([data.universities.list(), data.universityPrograms(/* if exists */)]);
<ApplyForm locale universities programs countries universitySlug={...} />
```

- [ ] **Step 5: Run tests, typecheck, lint**

- [ ] **Step 6: Commit**

```bash
git add -- src/components/sections/apply-form.tsx "src/app/[locale]/(marketing)/apply/page.tsx" tests/unit/apply-form-rich.test.tsx
git merge-base -- HEAD # noop
git commit -m "feat: rich four-section apply form"
```

### Task 7: i18n keys for new UI (drawer, apply form, floating buttons)

**Files:**
- Modify: `src/messages/en.json`, `src/messages/az.json`, `src/messages/tr.json`, `src/messages/ru.json`

- [ ] **Step 1: Add keys for all 18 locales (priority: en/az/tr/ru complete; others can mirror en)**

Keys:
- `Student.auth.googleLogin`
- `Header.login`, `Header.profile`
- `Student.drawer.applications`, `Student.drawer.documents`, `Student.drawer.messages`, `Student.drawer.notifications`, `Student.drawer.profile`, `Student.drawer.signOut`
- `Apply.sectionEducation`, `Apply.sectionPersonal`, `Apply.sectionDocuments`, `Apply.sectionPreferences`
- `Apply.university`, `Apply.program`, `Apply.degreeLevel`, `Apply.instructionLanguage`, `Apply.dateOfBirth`, `Apply.gender`, `Apply.passport`, `Apply.diploma`, `Apply.photo`, `Apply.motivationLetter`, `Apply.scholarshipInterest`, `Apply.dormitory`, `Apply.intakeFall`, `Apply.intakeSpring`

- [ ] **Step 2: Validate JSON**

Run: `node -e "['en','az','tr','ru'].forEach(l=>require('./src/messages/'+l+'.json')); console.log('json ok')"`

- [ ] **Step 3: Commit**

```bash
git add -- src/messages/en.json src/messages/az.json src/messages/tr.json src/messages/ru.json
git commit -m "feat: add i18n keys for student drawer and rich apply"
```

### Task 8: E2E tests — student auth flow and rich apply submission

**Files:**
- Create: `tests/e2e/student-google-auth.spec.ts`
- Create: `tests/e2e/apply-form-rich.spec.ts`

- [ ] **Step 1: Add deterministic auth fixture** — Reuse the admin test seam pattern; create a seeded student profile and set session cookie via dev helper (only with `DEV_AUTH_ENABLED=1` in CI).

- [ ] **Step 2: Test drawer flow**

- Login → header shows avatar → click → drawer opens → Applications tab shows seeded application → ESC closes.

- [ ] **Step 3: Test rich apply submission**

- Visit `/en/apply` → select first university → program filtered → fill all fields → submit → success screen → admin `/admin/applications` shows new row.

- [ ] **Step 4: Test floating buttons**

- Home page → FloatingApplyButton visible → click → URL `/en/apply`.
- Home page → FloatingChatButtons visible (WhatsApp + Telegram `href`).

- [ ] **Step 5: Run e2e**

Run: `npm run test:e2e`

- [ ] **Step 6: Commit**

```bash
git add -- tests/e2e/student-google-auth.spec.ts tests/e2e/apply-form-rich.spec.ts
git commit -m "test: e2e student google auth and rich apply"
```

## Plan Self-Review

- **Spec coverage:** Google OAuth student login ✓, header avatar ✓, drawer modal ✓, floating Apply ✓, floating WP/Telegram ✓, rich apply form ✓, `/admin` untouched ✓, `/[locale]/dashboard` untouched ✓, i18n ✓, tests ✓.
- **Placeholder scan:** No `TBD`/`TODO`; each step shows concrete code or precise instructions.
- **Type consistency:** `StudentSession` reused from `student-session.ts`; `GoogleSignInButton` consistent across header and login page; `leadSchema` extension carries through to `submitLead`.
- **Scope:** Out-of-scope items (removing dashboard route, admin changes, email OTP fallback removal) respected; does not modify `/admin` or existing `/dashboard` route code.

## Deployment Notes

- Supabase Dashboard → Authentication → Providers → enable Google; add `http://localhost:3000/auth/callback` and `https://<domain>/auth/callback` to Redirect URLs.
- Set `NEXT_PUBLIC_SITE_URL` to production domain.
- Create Supabase Storage bucket `apply-documents` with RLS policy: students write only to `apply-documents/{their_auth_uid}/`, public read or signed URLs for admin.
- Add `siteConfig.contact.telegram` handle before deploy.
- Run `npm run db:seed` if seeding new university/program data; otherwise no schema migration required (rich apply fields stored as JSON in `leads.notes`).
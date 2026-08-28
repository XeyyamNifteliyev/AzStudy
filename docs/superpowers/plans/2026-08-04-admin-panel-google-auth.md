# Admin Panel Google Auth and CRM Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace development admin login with allowlisted Supabase Google OAuth and complete a bilingual, role-secured CRM admin panel for applications, leads, staff access, notifications, and audit history.

**Architecture:** Keep the existing Next.js App Router and CRM repository boundary. Add a Supabase-backed repository and migrations for staff access and admin notifications, resolve staff sessions only through Supabase Auth in production, and enforce admin/consultant scope in server actions plus database policies. Keep anonymous student Apply submissions and the local PostgreSQL/Docker path for development.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Supabase Auth/Storage/Postgres, `@supabase/ssr`, `@supabase/supabase-js`, Zod, Tailwind CSS, Vitest, Playwright.

---

## Scope and File Map

### Database and domain types

- Create: `supabase/migrations/0013_staff_access_notifications.sql` — staff allowlist, admin notifications, constraints, indexes, RLS policies, and helper functions.
- Modify: `src/types/crm.ts` — staff access, admin notification, and approved status types.
- Modify: `src/lib/validations/crm.ts` — access, role, notification, lead, and application action schemas.

### Supabase auth and repository

- Modify: `src/lib/crm/supabase-repository.ts` — replace the stub with the RLS-aware Supabase CRM implementation.
- Modify: `src/lib/crm/repositories.ts` — expose staff access, notifications, assignment, and authorization operations.
- Modify: `src/lib/crm/index.ts` — keep the Supabase implementation behind `SUPABASE_ENABLED=true` and preserve the local PostgreSQL implementation for development.
- Create: `src/lib/crm/staff-access.ts` — normalize emails, bootstrap the initial admin, and enforce last-admin protection.
- Modify: `src/lib/crm/session.ts` — use Supabase staff profiles and remove production fallback to the legacy dev cookie.
- Modify: `src/app/auth/callback/route.ts` — reject non-allowlisted Google users, handle `/admin` redirects, and preserve safe relative redirects.
- Modify: `src/app/admin/login/page.tsx` — replace OTP/dev profile buttons with a Google login CTA and bilingual access-denied/error states.
- Modify: `src/app/actions/admin-auth.ts` — add Google sign-in, staff sign-out, and server-side session invalidation.

### Admin actions and UI

- Modify: `src/app/actions/crm.ts` — require role-aware staff sessions for all CRM mutations and create notifications/audit entries.
- Modify: `src/app/actions/leads.ts` — preserve anonymous Apply submission, add notification creation, and keep rate limiting.
- Create: `src/app/actions/staff-access.ts` — admin-only add/update/deactivate staff operations.
- Create: `src/app/actions/notifications.ts` — list, mark-read, and mark-all-read operations.
- Modify: `src/components/admin/AdminSidebar.tsx` — bilingual navigation and role-aware visibility.
- Modify: `src/components/admin/AdminTopbar.tsx` — bilingual labels, notification count, and profile menu.
- Create: `src/components/admin/NotificationBell.tsx` — unread count and notification popover.
- Create: `src/components/admin/NotificationsPanel.tsx` — full notification list and read-state controls.
- Create: `src/components/admin/StaffAccessTable.tsx` — allowlist table, role controls, active state, and last-admin protection messaging.
- Create: `src/components/admin/StaffAccessForm.tsx` — add approved email and role.
- Modify: `src/app/admin/(dashboard)/users/page.tsx` — replace read-only staff list with access management.
- Modify: `src/app/admin/(dashboard)/page.tsx` — dashboard metrics, queue summaries, workload, recent activity, and quick actions.
- Modify: `src/app/admin/(dashboard)/leads/page.tsx` — enforce server-side consultant filtering and retain list/Kanban views.
- Modify: `src/app/admin/(dashboard)/applications/[id]/page.tsx` — show assignment, status, notes, history, and role-specific controls.
- Create: `src/app/admin/(dashboard)/notifications/page.tsx` — full in-app notification center.

### Localization and tests

- Modify: `src/messages/en.json` — admin auth, access, navigation, notifications, errors, and status labels.
- Modify: `src/messages/az.json` — Azerbaijani equivalents for all new admin strings.
- Modify: `tests/e2e/admin.spec.ts` — remove dev-login assumptions and cover the deterministic auth test seam plus protected admin flows.
- Create: `tests/unit/staff-access.test.ts` — email normalization, bootstrap, and last-admin rules.
- Create: `tests/unit/notifications.test.ts` — notification creation/read behavior.
- Create: `tests/unit/crm-repository.test.ts` — Supabase repository authorization and filtering.
- Create: `tests/unit/admin-auth-callback.test.ts` — pure OAuth callback decision tests.
- Create: `tests/unit/staff-access-actions.test.ts` — admin-only access action tests.
- Create: `tests/e2e/admin-access.spec.ts` — approved/rejected staff, access management, consultant scoping, and bilingual UI.
- Modify: `.env.example` — document `INITIAL_ADMIN_EMAIL`, Google OAuth, Supabase keys, and production settings without secrets.

## Implementation Tasks

### Task 1: Add the database contract

**Files:**
- Create: `supabase/migrations/0013_staff_access_notifications.sql`
- Modify: `src/types/crm.ts`
- Modify: `src/lib/validations/crm.ts`
- Test: `tests/unit/staff-access.test.ts`

- [ ] **Step 1: Write the failing domain tests**

Add tests for normalized emails, valid staff roles, rejecting an empty email, and refusing to deactivate the last active admin:

```ts
import { describe, expect, it } from 'vitest';
import { normalizeStaffEmail, canChangeStaffAccess } from '@/lib/crm/staff-access';

describe('staff access rules', () => {
  it('normalizes an email before lookup', () => {
    expect(normalizeStaffEmail('  ADMIN@Example.COM ')).toBe('admin@example.com');
  });

  it('protects the last active admin', () => {
    expect(canChangeStaffAccess({ role: 'admin', active: true }, { role: 'consultant', active: true }, 1)).toBe(false);
  });

  it('allows changing an admin when another active admin exists', () => {
    expect(canChangeStaffAccess({ role: 'admin', active: true }, { role: 'consultant', active: true }, 2)).toBe(true);
  });
});
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `npm test -- tests/unit/staff-access.test.ts`

Expected: FAIL because the staff-access helpers do not exist yet.

- [ ] **Step 3: Add the migration**

Create `staff_access` with a lowercase unique email, `admin`/`consultant` role check, active flag, creator, and timestamps. Create `admin_notifications` with recipient, type, title, body, read state, optional lead/application references, and timestamps. Add indexes for active email lookup, notification recipient/read state, and notification creation time.

Add database functions/policies that:

- allow authenticated staff to read their own active access record;
- allow admins to manage all staff access records;
- allow admins to read all admin notifications;
- allow a user to read and update only their own notification read state;
- allow consultants to read only leads/applications assigned to their profile id;
- prevent non-admin role changes and access changes;
- preserve existing student Apply insert behavior.

The migration must not remove the existing `editor` enum value, but the new staff UI must only create and manage `admin` and `consultant` access records.

- [ ] **Step 4: Add domain types and validation schemas**

Add types matching the migration, including `StaffAccess`, `AdminNotification`, `StaffRole = 'admin' | 'consultant'`, notification type unions, and the approved application/lead status values. Add schemas that normalize input only after parsing and reject roles outside `admin` and `consultant`.

- [ ] **Step 5: Run the focused tests**

Run: `npm test -- tests/unit/staff-access.test.ts`

Expected: PASS.

- [ ] **Step 6: Apply the migration locally and verify tables**

Run:

```bash
npm run db:migrate
docker exec study_crm_db psql -U study -d study_crm -c "\dt staff_access"
docker exec study_crm_db psql -U study -d study_crm -c "\dt admin_notifications"
```

Expected: both tables exist and the migration exits successfully.

- [ ] **Step 7: Commit**

```bash
git add supabase/migrations/0013_staff_access_notifications.sql src/types/crm.ts src/lib/validations/crm.ts tests/unit/staff-access.test.ts
git commit -m "feat: add staff access and admin notification schema"
```

### Task 2: Implement the Supabase CRM repository boundary

**Files:**
- Modify: `src/lib/crm/repositories.ts`
- Modify: `src/lib/crm/supabase-repository.ts`
- Modify: `src/lib/crm/index.ts`
- Modify: `src/lib/crm/staff-access.ts`
- Test: `tests/unit/notifications.test.ts`

- [ ] **Step 1: Extend the repository interface and write failing tests**

Add repository methods for staff access, notifications, role-aware lead/application listing, and current-user profile lookup. Write tests that expect `listNotifications`, `markNotificationRead`, `listStaffAccess`, `addStaffAccess`, and `deactivateStaffAccess` to exist and return typed results.

- [ ] **Step 2: Run the focused tests**

Run: `npm test -- tests/unit/notifications.test.ts`

Expected: FAIL because the methods are not implemented.

- [ ] **Step 3: Implement the Supabase repository using the server client**

Use the authenticated `getSupabaseSessionClient()` for normal user-scoped reads and mutations so Supabase RLS evaluates the current user. Use `getSupabaseServer()` only for server-only bootstrap, allowlist checks before a profile exists, and narrowly scoped administrative operations that cannot be safely performed with the user session. Implement queries with explicit column lists and typed row mapping. Keep the existing `CrmRepository` methods intact. Add methods with these signatures:

```ts
listStaffAccess(): Promise<StaffAccess[]>;
addStaffAccess(input: NewStaffAccessInput, actorId: string): Promise<StaffAccess>;
updateStaffAccess(id: string, input: UpdateStaffAccessInput, actorId: string): Promise<StaffAccess>;
deactivateStaffAccess(id: string, actorId: string): Promise<void>;
listAdminNotifications(userId: string, limit?: number): Promise<AdminNotification[]>;
countUnreadAdminNotifications(userId: string): Promise<number>;
markAdminNotificationRead(id: string, userId: string): Promise<void>;
markAllAdminNotificationsRead(userId: string): Promise<void>;
createAdminNotification(input: NewAdminNotificationInput): Promise<AdminNotification>;
```

Map database snake_case fields to the existing camelCase domain types in one place. Do not silently fall back to the local repository when `SUPABASE_ENABLED=true`; configuration errors must be visible.

- [ ] **Step 4: Implement staff access invariants**

In `src/lib/crm/staff-access.ts`:

- normalize email with trim/lowercase;
- read `INITIAL_ADMIN_EMAIL` only on the server;
- upsert the bootstrap record by normalized email;
- reject role changes/deactivation when the target is the only active admin;
- write an audit entry for add, role change, and deactivation;
- return typed domain errors for unauthorized and last-admin operations.

- [ ] **Step 5: Run tests and typecheck**

Run:

```bash
npm test -- tests/unit/notifications.test.ts tests/unit/staff-access.test.ts
npm run typecheck
```

Expected: PASS with no TypeScript errors.

- [ ] **Step 6: Commit**

```bash
git add src/lib/crm/repositories.ts src/lib/crm/supabase-repository.ts src/lib/crm/index.ts src/lib/crm/staff-access.ts tests/unit/notifications.test.ts
git commit -m "feat: implement supabase crm access repository"
```

### Task 3: Replace development admin login with allowlisted Google OAuth

**Files:**
- Modify: `src/app/admin/login/page.tsx`
- Modify: `src/app/auth/callback/route.ts`
- Modify: `src/app/actions/admin-auth.ts`
- Modify: `src/lib/crm/session.ts`
- Modify: `src/lib/supabase/server-session.ts`
- Modify: `.env.example`
- Test: `tests/e2e/admin-access.spec.ts`

- [ ] **Step 1: Add a deterministic OAuth test seam**

Extract a pure callback decision function from the route. It must accept `{ email, activeAccess, next }` and return either `{ allowed: true, next }` or `{ allowed: false, reason: 'not_allowed' | 'inactive' }`. Add unit tests for allowed staff, unknown email, inactive email, and unsafe redirects before touching the route.

- [ ] **Step 2: Run the callback tests and verify failure**

Run: `npm test -- tests/unit/admin-auth-callback.test.ts`

Expected: FAIL because the pure decision function is not present.

- [ ] **Step 3: Implement the Google login action**

Add a server action that calls the Supabase session client:

```ts
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: { redirectTo: `${siteUrl}/auth/callback?next=/admin` },
});
if (error || !data.url) return { ok: false, error: 'google_login_failed' };
redirect(data.url);
```

The login page must expose only this CTA in production. The existing dev profile selector and OTP form must not render when production auth is configured. Keep a local-only developer path only if it is explicitly gated by `DEV_AUTH_ENABLED` and cannot be enabled in production.

- [ ] **Step 4: Enforce the allowlist in the callback**

Exchange the OAuth code, load the authenticated user, normalize the email, bootstrap the initial admin when appropriate, and query active staff access. If no active record exists, sign out and redirect to `/admin/login?error=not_allowed`. Preserve the existing relative-path validation and never redirect to an external origin.

- [ ] **Step 5: Make the staff session strict**

Update `getStaffSession` to require an active `admin` or `consultant` profile. Remove `editor` from new production staff access decisions. Do not catch Supabase configuration failures and silently turn them into a valid staff session. Legacy cookie fallback must be disabled unless `DEV_AUTH_ENABLED=1` and `NODE_ENV !== 'production'`.

- [ ] **Step 6: Update environment documentation**

Document `INITIAL_ADMIN_EMAIL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ENABLED=true`, `NEXT_PUBLIC_SITE_URL`, and the Google provider redirect URL. Keep all real values empty or placeholder-only.

- [ ] **Step 7: Run callback tests and typecheck**

Run:

```bash
npm test -- tests/unit/admin-auth-callback.test.ts
npm run typecheck
```

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add src/app/admin/login/page.tsx src/app/auth/callback/route.ts src/app/actions/admin-auth.ts src/lib/crm/session.ts src/lib/supabase/server-session.ts .env.example tests/unit/admin-auth-callback.test.ts
git commit -m "feat: secure admin login with google allowlist"
```

### Task 4: Add admin-only staff access management

**Files:**
- Create: `src/app/actions/staff-access.ts`
- Modify: `src/app/admin/(dashboard)/users/page.tsx`
- Create: `src/components/admin/StaffAccessForm.tsx`
- Create: `src/components/admin/StaffAccessTable.tsx`
- Modify: `src/lib/validations/crm.ts`
- Test: `tests/unit/staff-access-actions.test.ts`

- [ ] **Step 1: Write failing action tests**

Cover these cases:

- consultant calling an access mutation receives `Not authorized`;
- admin can add a normalized consultant email;
- duplicate email returns a typed validation error;
- last active admin cannot be deactivated or demoted;
- successful changes revalidate `/admin/users` and `/admin`.

- [ ] **Step 2: Run the tests and verify failure**

Run: `npm test -- tests/unit/staff-access-actions.test.ts`

Expected: FAIL because the actions and UI do not exist.

- [ ] **Step 3: Implement admin-only server actions**

Every action must call `requireStaff()`, verify `session.role === 'admin'`, parse with Zod, normalize the email, call the repository, write the audit entry, and return `{ ok: true }` or `{ ok: false, error }`. Never trust a client-provided actor id or role.

- [ ] **Step 4: Build the access management UI**

The form collects email and role. The table shows email, role, active state, created date, last login, and actions. Deactivation uses a confirmation dialog and explains that history is preserved. The last active admin row disables destructive controls and displays why.

- [ ] **Step 5: Run focused tests and typecheck**

Run:

```bash
npm test -- tests/unit/staff-access-actions.test.ts
npm run typecheck
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add -- src/app/actions/staff-access.ts "src/app/admin/(dashboard)/users/page.tsx" src/components/admin/StaffAccessForm.tsx src/components/admin/StaffAccessTable.tsx src/lib/validations/crm.ts tests/unit/staff-access-actions.test.ts
git commit -m "feat: add admin staff access management"
```

### Task 5: Implement notifications and connect CRM events

**Files:**
- Create: `src/app/actions/notifications.ts`
- Create: `src/components/admin/NotificationBell.tsx`
- Create: `src/components/admin/NotificationsPanel.tsx`
- Create: `src/app/admin/(dashboard)/notifications/page.tsx`
- Modify: `src/components/admin/AdminTopbar.tsx`
- Modify: `src/app/actions/crm.ts`
- Modify: `src/app/actions/leads.ts`
- Test: `tests/unit/notifications.test.ts`

- [ ] **Step 1: Write failing notification behavior tests**

Test that a new Apply submission creates an admin notification, a consultant assignment notifies the assigned consultant, a status change creates the correct notification, unread count is scoped to the current user, and marking all read affects only that user.

- [ ] **Step 2: Run the tests and verify failure**

Run: `npm test -- tests/unit/notifications.test.ts`

Expected: FAIL for missing notification actions/event wiring.

- [ ] **Step 3: Implement notification actions**

Actions must resolve the authenticated staff user from the server session, never accept a recipient id from the browser, and revalidate `/admin` and `/admin/notifications`. `markAdminNotificationRead` must verify ownership through the repository query.

- [ ] **Step 4: Wire event creation**

Update `submitLead` to create a notification for all active admins after successful lead creation. Update assignment and status actions to notify the assigned consultant/admin viewers and write audit entries. Keep the public Apply response fail-open for transient CRM errors, but log notification failures separately so the lead itself remains visible.

- [ ] **Step 5: Build the bell and notification page**

The topbar bell shows the unread count and a short popover list. The full page supports unread/read filtering, mark-read, mark-all-read, and links to related records. Loading, empty, and error states must be explicit.

- [ ] **Step 6: Run tests and typecheck**

Run:

```bash
npm test -- tests/unit/notifications.test.ts
npm run typecheck
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add -- src/app/actions/notifications.ts src/components/admin/NotificationBell.tsx src/components/admin/NotificationsPanel.tsx "src/app/admin/(dashboard)/notifications/page.tsx" src/components/admin/AdminTopbar.tsx src/app/actions/crm.ts src/app/actions/leads.ts tests/unit/notifications.test.ts
git commit -m "feat: add admin notification center"
```

### Task 6: Enforce role scope across dashboard data and actions

**Files:**
- Modify: `src/lib/crm/supabase-repository.ts`
- Modify: `src/lib/crm/pg-repository.ts`
- Modify: `src/app/actions/crm.ts`
- Modify: `src/app/admin/(dashboard)/page.tsx`
- Modify: `src/app/admin/(dashboard)/leads/page.tsx`
- Modify: `src/app/admin/(dashboard)/applications/[id]/page.tsx`
- Test: `tests/unit/crm-repository.test.ts`

- [ ] **Step 1: Add failing consultant-scope tests**

Assert that consultant queries include `assigned_consultant_id = currentProfileId`, consultants cannot assign records, and admins can list/filter all records. Test both lead and application detail access.

- [ ] **Step 2: Run the tests and verify failure**

Run: `npm test -- tests/unit/crm-repository.test.ts`

Expected: FAIL for missing role-aware filtering.

- [ ] **Step 3: Implement role-aware repository methods**

Pass an authorization context containing `{ userId, role }` into admin-only repository reads. Apply the same scope in Supabase queries and the local PostgreSQL implementation so local tests match production behavior. Do not filter only in React components.

- [ ] **Step 4: Guard all mutations**

Allow consultants to update only assigned lead/application status and notes. Allow only admins to assign consultants, modify staff access, and view all records. Return a stable authorization error that UI actions can display.

- [ ] **Step 5: Update dashboard and detail pages**

Overview metrics must use the current role scope. Admin sees global totals and consultant workload; consultant sees assigned totals. Lead and application detail pages must return not-found/forbidden behavior without leaking another consultant’s record.

- [ ] **Step 6: Run tests and typecheck**

Run:

```bash
npm test -- tests/unit/crm-repository.test.ts
npm run typecheck
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add -- src/lib/crm/supabase-repository.ts src/lib/crm/pg-repository.ts src/app/actions/crm.ts "src/app/admin/(dashboard)/page.tsx" "src/app/admin/(dashboard)/leads/page.tsx" "src/app/admin/(dashboard)/applications/[id]/page.tsx" tests/unit/crm-repository.test.ts
git commit -m "feat: enforce consultant crm scope"
```

### Task 7: Finish the bilingual professional admin UI

**Files:**
- Modify: `src/components/admin/AdminSidebar.tsx`
- Modify: `src/components/admin/AdminTopbar.tsx`
- Modify: `src/app/admin/(dashboard)/page.tsx`
- Modify: `src/app/admin/(dashboard)/leads/page.tsx`
- Modify: `src/app/admin/(dashboard)/applications/[id]/page.tsx`
- Modify: `src/app/admin/(dashboard)/audit/page.tsx`
- Modify: `src/messages/en.json`
- Modify: `src/messages/az.json`
- Test: `tests/e2e/admin-access.spec.ts`

- [ ] **Step 1: Add all admin translation keys**

Add matching keys in English and Azerbaijani for navigation, auth states, role labels, access actions, notification states, application statuses, validation errors, confirmation dialogs, forbidden states, empty states, and dashboard metrics. Do not use hard-coded user-facing English strings in admin components.

- [ ] **Step 2: Update the shell**

Add language switching that persists the admin locale, active-route highlighting, mobile sidebar controls, notification bell, profile menu, and accessible labels. Preserve the existing responsive layout and `robots` metadata.

- [ ] **Step 3: Polish dashboard modules**

Use existing `KpiCard`, `KanbanBoard`, `LeadStatusBadge`, and `PipelineStepper` components where compatible. Add clear loading/error/empty states, keyboard-accessible controls, status color contrast, and mobile-safe tables. Keep the visual system consistent rather than introducing a second design language.

- [ ] **Step 4: Run lint, typecheck, and targeted UI tests**

Run:

```bash
npm run typecheck
npm run lint
npm run test:e2e -- tests/e2e/admin-access.spec.ts
```

Expected: all commands pass. If real Google credentials are unavailable in CI, use the approved deterministic OAuth seam for authorization tests and keep one manually documented real-provider smoke test for deployment verification.

- [ ] **Step 5: Commit**

```bash
git add -- src/components/admin src/app/admin src/messages/en.json src/messages/az.json tests/e2e/admin-access.spec.ts
git commit -m "feat: polish bilingual admin dashboard"
```

### Task 8: Add end-to-end access and CRM regression coverage

**Files:**
- Create: `tests/e2e/admin-access.spec.ts`
- Modify: `tests/e2e/admin.spec.ts`
- Modify: `playwright.config.*` if the existing test setup needs a deterministic auth fixture

- [ ] **Step 1: Create an auth fixture**

Provide deterministic seeded profiles for one admin, two consultants, an allowlisted inactive user, and an unapproved Google identity. The fixture must create sessions through the application’s test seam, not by exposing a service-role key to browser code.

- [ ] **Step 2: Add access tests**

Cover approved login, rejected login, inactive access, admin add/deactivate, last-admin protection, consultant route scoping, and sign-out.

- [ ] **Step 3: Add application workflow tests**

Submit the public Apply form, assert the record appears in the admin queue, assign a consultant, verify notification count, change status, and verify audit history.

- [ ] **Step 4: Add Azerbaijani/English and responsive checks**

Switch the admin locale and assert translated navigation/title content. Run the same shell test at desktop and mobile viewport sizes and verify sidebar open/close behavior.

- [ ] **Step 5: Run the complete verification set**

Run:

```bash
npm test
npm run typecheck
npm run lint
npm run test:e2e
npm run build
```

Expected: all tests pass and the production build completes without prerender/database connection errors when Supabase environment variables are configured.

- [ ] **Step 6: Commit**

```bash
git add tests/e2e/admin-access.spec.ts tests/e2e/admin.spec.ts playwright.config.*
git commit -m "test: cover admin access and crm workflows"
```

## Deployment Checklist

- [ ] Create/configure Google OAuth provider in Supabase Auth.
- [ ] Add production callback URL: `https://<production-domain>/auth/callback`.
- [ ] Set `SUPABASE_ENABLED=true`.
- [ ] Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- [ ] Set `SUPABASE_SERVICE_ROLE_KEY` only in server environment variables.
- [ ] Set `DATABASE_URL` to the Supabase PostgreSQL connection string.
- [ ] Set `INITIAL_ADMIN_EMAIL` to the one controlled bootstrap admin address.
- [ ] Run migration `0013_staff_access_notifications.sql` against Supabase.
- [ ] Run the seed/migration process without overwriting real CRM data.
- [ ] Verify approved Google login, rejected login, admin access management, consultant scoping, Apply submission, notifications, and audit logs in a staging deployment.
- [ ] Confirm no production build uses the local Docker PostgreSQL URL.

## Plan Self-Review

- Spec coverage: authentication, allowlist, initial admin, role management, last-admin protection, anonymous Apply, consultant scoping, bilingual UI, notifications, audit logs, security, testing, and Supabase deployment each have dedicated tasks.
- Placeholder scan: no `TBD`, `TODO`, or unspecified implementation step is used. All new interfaces and test commands are named.
- Type consistency: `StaffAccess`, `AdminNotification`, `StaffRole`, and repository method names are introduced in Task 1 and reused consistently in Tasks 2-8.
- Scope: the plan deliberately excludes content management and email notifications as agreed.

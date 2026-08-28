# Student Google Auth, Profile Modal, Floating Buttons, and Rich Apply Form Design

## Status

Approved through collaborative design review on 2026-08-06.

## Goal

Replace the current email-OTP student login with Google OAuth, add a header profile avatar that opens a full student dashboard in a modal drawer (StudyLeo-style), add floating Apply and WhatsApp/Telegram buttons, and enrich the Apply form with university/program selection, degree level, language, documents, and preferences. Keep the existing `/admin` panel and `/[locale]/dashboard` route intact.

## Reference

StudyLeo.com analyzed: header Login button → Google login; profile avatar in top-right → in-place dashboard (not separate route); floating Apply button bottom-right; floating WhatsApp/Telegram buttons bottom-left; apply form with university/program/specialization selection, degree level, language, personal info, document uploads, scholarship, dormitory, intake.

## Confirmed Requirements

- Students log in with any Google account; profile auto-created on first login (`role: 'student'`).
- Admin/consultant access stays restricted to the approved email allowlist (`staff_access`); students cannot reach `/admin`.
- Header right side shows "Login" when logged out, profile avatar when logged in.
- Clicking the avatar opens a right-side sliding drawer modal with the full student dashboard.
- Drawer tabs: Applications, Documents, Messages, Notifications, Profile, Sign out.
- `/[locale]/dashboard` route stays; same components reused inside the modal.
- `/admin` route untouched.
- Floating Apply button (bottom-right) links to `/[locale]/apply`; hidden on the apply page.
- Floating WhatsApp + Telegram buttons (bottom-left); `WhatsAppFloat` moves from right to left and gains a Telegram sibling.
- Both floating groups hidden on `/admin` routes.
- Apply form enriched with: university dropdown (searchable), program/specialization dropdown (filtered by university), degree level (Bachelor/Master/Associate/PhD), instruction language (English/Turkish), personal info (name, email, phone, DOB, gender, nationality), document uploads (passport, diploma, photo, optional motivation letter), preferences (scholarship, dormitory, intake, notes).
- Google OAuth: no email/link verification; Google verifies the account.
- Supabase Google provider must be enabled in Supabase dashboard.

## Architecture

### Authentication

- Supabase Auth Google OAuth for both students (unrestricted) and admins/consultants (allowlist).
- After OAuth callback: normalize email, resolve `staff_access` for admin/consultant; otherwise upsert student profile via existing `upsertStudentByAuthUid`.
- `/auth/callback` handles both `next=/admin` (staff check) and `next=/{locale}/dashboard` (student) destinations.
- Existing `EmailOtpForm` replaced by a `GoogleSignInButton` client component using `supabase.auth.signInWithOtp`→`signInWithOAuth({ provider: 'google' })`.
- Header "Login" button triggers Google OAuth with `redirectTo` back to current locale home.
- Middleware `getSession()` refreshes the Supabase session on every request (existing behavior).

### Header and Profile Modal

- `Header` (client component) gains a conditional right-side area:
  - logged out → `<GoogleSignInButton />` (compact)
  - logged in → profile avatar (initials) + name; click opens `<StudentProfileDrawer />`
- `StudentProfileDrawer` is a Radix `Dialog` (or `Sheet`) sliding from the right, full-height, scrollable, with a tab bar.
- Each tab reuses the existing dashboard page content components (Applications, Documents, Messages, Notifications, Profile) via lazy mount inside the drawer.
- Drawer is locale-aware (AZ/EN/RU/TR/etc.) using existing `next-intl` messages.

### Floating Buttons

- `FloatingApplyButton` — fixed bottom-right pill/round, brand color, "Apply Now" + arrow, links to `/[locale]/apply`, hidden when already on apply page or on `/admin`.
- `FloatingChatButtons` — fixed bottom-left, two stacked circular icon buttons (WhatsApp green, Telegram blue), `target="_blank"`, hidden on `/admin`.
- WhatsApp number from `siteConfig.contact.whatsapp`; Telegram handle from new `siteConfig.contact.telegram`.
- Both mounted once in `[locale]/(marketing)/layout.tsx` (or root locale layout), not in admin layout.

### Apply Form

- Route `/[locale]/apply` stays; `ApplyForm` component rewritten.
- Four sections in a single scrollable page with section cards (or optional stepper indicator):
  1. **Education selection**: university (Combobox/searchable, from `data.universities.list()`), program/specialization (cascaded, from `data.universityPrograms` filtered by university), degree level (segmented buttons), instruction language (segmented buttons).
  2. **Personal info**: first name, last name, email, phone (country code), DOB, gender, nationality (from `data.countries.list()`).
  3. **Documents**: passport (file), diploma/transcript (file), photo (file), optional motivation letter (file). Upload to Supabase Storage; local fallback stores URL placeholder.
  4. **Preferences & submit**: scholarship interest (checkbox), dormitory (checkbox), intake (Fall/Spring select), notes (textarea), submit.
- Zod validation: sub-schemas per section plus a combined schema for submission.
- `submitLead` server action extended to accept all new fields (university slug, program, degree, language, DOB, gender, document URLs, scholarship, dormitory, intake).
- Honeypot + rate-limit (5/min/IP) retained.
- File upload: client-side mime/size validation; Supabase Storage bucket with RLS; fallback path when Supabase not configured.

### Data Flow

- Student Google login → `/auth/callback` → upsert student profile → set session cookie → redirect to `next`.
- Header reads session server-side (layout) → passes `session` to `Header` client component → renders avatar or login button.
- Drawer tab content fetched server-side per tab (or pre-fetched in layout) using `crm.listMyLeads`, `listMyApplications`, `listMyDocuments`, `listMessages`, `listNotifications`.
- Apply submit → `submitLead` → `findOrCreateStudent` → `createLead`/`createPublicLead` with full fields → admin queue + notification.

## Security and Error Handling

- `/admin` route guard requires active `staff_access`; `/[locale]/dashboard` requires student profile (existing `requireStudentAny`).
- Drawer/modal only renders when logged in; no client-side gating for sensitive data.
- Apply rate-limit + honeypot retained.
- File upload: mime/size validation client and server; Supabase Storage RLS (student writes only to own folder).
- Google OAuth `redirectTo` validated as relative path (existing open-redirect protection).
- Existing `auth/callback` debug logging retained.
- Revoked staff signed out via existing session guard.

## Testing Strategy

### Unit
- Zod schemas for each apply form section and combined submission.
- Google sign-in button renders correct redirect URL.
- `StudentProfileDrawer` renders tabs and closes on ESC/overlay.
- Floating buttons visibility logic (hidden on `/admin`, hidden on `/apply` for Apply button).

### End-to-End
- Google login → header shows avatar → click → drawer opens → Applications tab shows data.
- Apply form: select university → program filters → fill personal info → upload a doc → submit → record appears in admin `/admin/applications`.
- Floating Apply click → navigates to `/apply`.
- Floating WhatsApp/Telegram open external links.
- Admin login → `/admin` accessible; student login → `/admin` redirect to `/admin/login`.
- Existing `/[locale]/dashboard` route still works.

## Out of Scope

- Removing `/[locale]/dashboard` route.
- Changing `/admin` panel UI or auth.
- Email OTP as primary auth (replaced by Google OAuth; could remain as fallback).
- Building a separate `/login` route (header button handles it).

## Deployment Notes

- Supabase Dashboard → Authentication → Providers → enable Google; add `https://<domain>/auth/callback` to Redirect URLs; for local: `http://localhost:3000/auth/callback`.
- `NEXT_PUBLIC_SITE_URL` set to production domain for correct OAuth redirect.
- Supabase Storage bucket created for student documents with RLS.
- `siteConfig.contact.telegram` added with the Telegram handle.
# Admin Panel Google Auth and CRM Design

## Status

Approved through collaborative design review on 2026-08-04.

## Goal

Replace the current admin development-login flow with production-ready Google OAuth through Supabase Auth and deliver a professional bilingual admin panel for managing staff access, student applications, leads, assignments, notifications, and audit history.

The first release focuses on CRM and access management. University, program, blog, and translation content management remain out of scope for this release.

## Confirmed Requirements

- Staff login uses Google OAuth.
- Only explicitly approved email addresses may enter the staff panel.
- The initial admin is bootstrapped from `INITIAL_ADMIN_EMAIL`.
- Admins can add approved staff emails and assign `admin` or `consultant` roles.
- The last active admin cannot be removed or demoted.
- Students can submit `Apply` without creating an account.
- Applications appear directly in the admin queue.
- Consultants can only access leads and applications assigned to them.
- Admins can access and manage all staff, leads, applications, notifications, and audit records.
- Revoked users are disabled and signed out; historical records remain intact.
- The admin interface supports Azerbaijani and English.
- The first release uses an in-app notification center, not email notifications.

## Architecture

### Authentication and Authorization

Supabase Auth is the identity provider and Google is the OAuth provider. Google verifies the account, so the application does not request a second Gmail confirmation email.

After OAuth callback:

1. Normalize the Google email to lowercase.
2. Check the active staff access record.
3. Reject and sign out users without an active approved record.
4. Create or update the linked `profiles` record for approved users.
5. Redirect approved users to the admin dashboard.

The initial admin email is bootstrapped from `INITIAL_ADMIN_EMAIL`. The bootstrap operation must be idempotent and must not create duplicate access records.

The existing role model remains the source of role values: `admin`, `consultant`, and `student`. Staff access is controlled separately from public student applications so an applicant cannot gain staff access by submitting a form.

Authorization is enforced in both server-side route/actions and Supabase Row Level Security. Hiding UI controls is not considered a security boundary.

### Staff Access Data

Add a staff access record with:

- normalized email
- role (`admin` or `consultant`)
- active flag
- creator admin
- created and updated timestamps

An access record may be revoked without deleting the associated profile or historical CRM records.

### Admin Information Architecture

The admin shell has a responsive sidebar and top bar.

Sidebar sections:

- Overview
- Applications
- Leads
- Consultants
- Users & Access
- Notifications
- Audit Log
- Settings

The top bar contains language switching, notification count, current profile, and sign out.

The interface preserves the existing premium/Kinetic Horizon visual language while using a compact data-management layout suitable for desktop, tablet, and mobile.

## Workflows

### Staff Login

1. User selects Google login.
2. Supabase completes Google OAuth.
3. The callback checks the active staff allowlist.
4. Approved users receive the role-specific dashboard.
5. Unapproved or inactive users are signed out and shown an access-denied message.

### Student Application

1. A student submits the public `Apply` form without an account.
2. The server validates the payload with Zod.
3. A new application/lead is created in `new` status.
4. An in-app admin notification is created.
5. An admin may assign the record to a consultant.
6. The assigned consultant can update the record within their scope.
7. Status changes append timeline and audit records.

### Staff Management

1. An admin adds an email and chooses `admin` or `consultant`.
2. The user can enter after authenticating with the matching Google account.
3. An admin can change the role or deactivate access.
4. Deactivation signs out active sessions and blocks future staff login.
5. Existing leads, applications, and audit records remain preserved.

### Application Statuses

The initial status flow is:

- New
- Contacted
- Under Review
- Documents Required
- Submitted
- Offer Received
- Accepted
- Rejected
- Completed

Each status change records the actor, timestamp, previous value, and new value.

## Admin Modules

### Overview

Show new applications, pending leads, active applications, consultant workload, recent activity, and quick actions.

### Applications

Provide a table with status, date, country, university, and consultant filters. Each record opens a detail view with student information, status controls, assignment, notes, and history.

### Leads

Provide list and Kanban views. Admins can assign consultants and update status. Consultants see only their assigned records.

### Users and Access

Show approved staff emails, roles, active state, and last login. Admins can add, update, or deactivate access. The last active admin is protected.

### Notifications

Show unread and read notifications with an unread counter. Notifications link to the relevant lead or application where applicable.

### Audit Log

Show who changed what and when, including access changes, assignments, status updates, and important administrative actions. Provide filtering and detail views. Audit entries are append-only from the application perspective.

## Data Model

Use the existing CRM tables and add or extend the following structures as needed:

### `staff_access`

- normalized email
- role
- active state
- created by admin
- timestamps

### `profiles`

Keep the Supabase `auth.users` relationship, role, profile information, and last-login information.

### `applications`

Keep student information, selected university/program, status, assigned consultant, notes, and timestamps.

### `notifications`

- recipient user
- notification type
- title and body
- read state
- related lead/application identifiers
- timestamp

### `audit_logs`

- actor user
- action type
- entity and entity identifier
- previous and new values when relevant
- timestamp

## Notifications

The first release creates in-app notifications for:

- new student application
- consultant assignment
- application status change
- new staff access
- role or access change
- system warnings

Email notifications are explicitly out of scope for this release.

## Security and Error Handling

- Protect all admin routes with server-side session and role checks.
- Enforce consultant scoping at the database policy layer.
- Normalize and uniquely index staff emails.
- Validate every public and administrative form with Zod.
- Add abuse/rate-limit protection to the public Apply action.
- Prevent the last active admin from being deactivated or demoted.
- Record access and CRM mutations in audit logs.
- Do not expose service-role credentials to the browser.
- Keep admin routes out of search indexing.
- Return a clear access-denied state for unauthorized Google accounts.
- Preserve historical data when access is revoked.

## Testing Strategy

### Unit and Repository Tests

- staff allowlist matching and email normalization
- initial admin bootstrap idempotency
- last-admin protection
- notification creation and read state
- consultant scoping queries
- audit record creation

### End-to-End Tests

- approved Google identity reaches the correct dashboard
- unapproved identity is rejected
- admin adds and deactivates staff access
- consultant cannot access another consultant's lead
- student submits Apply without an account
- new application appears in admin queue
- admin assignment creates a notification
- status changes appear in history and audit log
- bilingual admin navigation renders in Azerbaijani and English
- responsive admin navigation works on mobile viewport

## Out of Scope

- University/program/blog content editing
- Translation management for public content
- Email notifications
- Student account requirement for Apply
- Custom OAuth implementation outside Supabase Auth

## Deployment Notes

Production uses the Supabase project as the PostgreSQL and Auth backend. The production `DATABASE_URL`, Supabase URL, anon key, and Google OAuth configuration are deployment environment variables. The local Docker PostgreSQL container remains a development option and is not the production database.

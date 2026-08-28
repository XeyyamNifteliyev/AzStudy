// src/lib/crm/session.ts — admin/staff auth (Supabase session + dev fallback)
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { crm } from "./index";
import { getSessionUser } from "@/lib/supabase/server-session";
import { verifySessionPayload } from "./cookie-signature";
import { isDevAuthEnabled } from "./student-session";
import type { Profile, UserRole } from "@/types/crm";

export const SESSION_COOKIE = "admin_session";

const STAFF_ROLES: UserRole[] = ["admin", "consultant", "editor"];

export interface AdminSession {
  userId: string;
  role: string;
  fullName: string;
  profile: Profile;
}

/** Real Supabase session resolved to a staff profile (role check). */
async function getStaffSession(): Promise<AdminSession | null> {
  // Supabase can throw for transient reasons (network, bad cookie, env not yet
  // configured). The dev fallback below must still get a chance, so never let a
  // Supabase failure abort the whole session resolution — degrade to null.
  try {
    const user = await getSessionUser();
    if (!user) return null;
    const email = (user.email ?? "").trim().toLowerCase();
    // Bootstrap: on first login, promote the configured INITIAL_ADMIN_EMAIL to
    // admin (no-op for any other email — it returns null). This must run before
    // getStaffProfileByAuthUid, because that resolver returns ANY auth_uid-bound
    // profile (including a previously-linked student), which would otherwise
    // short-circuit the promotion.
    await crm.bootstrapInitialAdmin({
      authUid: user.id,
      email,
      fullName: (user.user_metadata?.full_name as string | undefined) ?? "",
    });
    // Hard gate: only allowlisted emails may resolve a staff session. This is
    // the single choke point that blocks any other Gmail from entering the
    // admin panel without an admin's explicit allowlisting.
    if (!(await crm.isAdminAllowlisted(email))) return null;
    const profile = await crm.getStaffProfileByAuthUid(user.id, email);
    if (!profile || !STAFF_ROLES.includes(profile.role)) return null;
    return {
      userId: profile.id,
      role: profile.role,
      fullName: profile.fullName,
      profile,
    };
  } catch {
    return null;
  }
}

/** Dev fallback (DEV_AUTH_ENABLED): seeded demo staff via signed cookie. */
async function getDevStaffSession(): Promise<AdminSession | null> {
  if (!isDevAuthEnabled()) return null;
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE)?.value;
  // verifySessionPayload rejects unsigned/forged cookies (HMAC check).
  const payload = verifySessionPayload<{ userId: string }>(raw);
  if (!payload) return null;
  const profile = await crm.getProfile(payload.userId);
  if (!profile || !STAFF_ROLES.includes(profile.role)) return null;
  return {
    userId: profile.id,
    role: profile.role,
    fullName: profile.fullName,
    profile,
  };
}

// PERF: React.cache dedupes within a single request — the admin layout and
// each page both call requireStaff → getSession; without caching that is
// 2× Supabase getUser() (network round-trip) + 2× allowlist/profile queries
// per admin pageview. cache() collapses them to one each (same pattern as
// getStudentSession).
export const getSession = cache(async (): Promise<AdminSession | null> => {
  return (await getStaffSession()) ?? (await getDevStaffSession());
});

export async function requireStaff(): Promise<AdminSession> {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}

export async function getActorProfile(): Promise<Profile | null> {
  const session = await getSession();
  return session?.profile ?? null;
}

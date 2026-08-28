"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { crm } from "@/lib/crm";
import {
  STUDENT_SESSION_COOKIE,
  isDevAuthEnabled,
} from "@/lib/crm/student-session";
import { signSessionPayload } from "@/lib/crm/cookie-signature";
import { devStudentLoginSchema } from "@/lib/validations/student";

export async function devStudentLogin(input: unknown) {
  if (!isDevAuthEnabled()) return { ok: false as const };
  const parsed = devStudentLoginSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const };
  const profile = await crm.getProfile(parsed.data.profileId);
  if (!profile || profile.role !== "student") return { ok: false as const };
  const store = await cookies();
  store.set(
    STUDENT_SESSION_COOKIE,
    signSessionPayload({ userId: profile.id, fullName: profile.fullName }),
    {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
      // 3.4: Secure flag on HTTPS (Vercel) so the cookie isn't sent over HTTP.
      // Local/CI e2e run `next start` against http://localhost — a Secure cookie
      // would silently never be sent back and login would appear broken.
      secure: process.env.VERCEL === "1",
    },
  );
  redirect(`/${parsed.data.locale}/dashboard`);
}

export async function signOutStudent(locale: string) {
  try {
    const { getSupabaseSessionClient } =
      await import("@/lib/supabase/server-session");
    const supabase = await getSupabaseSessionClient();
    await supabase.auth.signOut();
  } catch {
    // Supabase not configured — proceed with local cookie cleanup
  }
  const store = await cookies();
  store.delete(STUDENT_SESSION_COOKIE);
  redirect(`/${locale}`);
}

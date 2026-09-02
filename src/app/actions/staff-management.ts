// src/app/actions/staff-management.ts
"use server";

import { revalidatePath } from "next/cache";
import { crm } from "@/lib/crm";
import { requireStaff } from "@/lib/crm/session";
import { rateLimit } from "@/lib/rate-limit";
import {
  updateRoleSchema,
  changePasswordSchema,
  allowlistEmailSchema,
} from "@/lib/validations/crm";

export type ActionResult = { ok: true } | { ok: false; error: string };

// SEC: 5 password attempts per hour per staff account — slows credential
// stuffing on a session that already passed the allowlist gate.
const passwordLimiter = rateLimit({ windowMs: 60 * 60_000, max: 5 });

export async function updateRoleAction(input: unknown): Promise<ActionResult> {
  const session = await requireStaff();
  if (session.role !== "admin") return { ok: false, error: "Not authorized" };
  const parsed = updateRoleSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid input" };
  if (parsed.data.profileId === session.userId && parsed.data.role !== "admin")
    return { ok: false, error: "Cannot demote yourself" };
  try {
    await crm.updateProfileRole(
      parsed.data.profileId,
      parsed.data.role,
      session.userId,
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to update role";
    return { ok: false, error: msg };
  }
  revalidatePath("/admin/users");
  return { ok: true };
}

export async function changePasswordAction(
  input: unknown,
): Promise<ActionResult> {
  const session = await requireStaff();
  if (!(await passwordLimiter.check(`pwd:${session.userId}`)))
    return {
      ok: false,
      error: "Too many attempts. Please try again in an hour.",
    };
  const parsed = changePasswordSchema.safeParse(input);
  if (!parsed.success) {
    const firstError = parsed.error.errors[0];
    return { ok: false, error: firstError?.message ?? "Invalid input" };
  }
  const { currentPassword, newPassword } = parsed.data;
  try {
    const { getSupabaseSessionClient } =
      await import("@/lib/supabase/server-session");
    const supabase = await getSupabaseSessionClient();
    // C4: Verify current password before updating — prevents session hijack
    // from silently changing the password without knowing the old one.
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: session.profile.email,
      password: currentPassword,
    });
    if (verifyError)
      return { ok: false, error: "Current password is incorrect" };
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (updateError) {
      // L1: log details server-side; keep the client message generic.
      console.error("[change-password] update failed:", updateError.message);
      return {
        ok: false,
        error: "Failed to update password. Please try again.",
      };
    }
    return { ok: true };
  } catch (err) {
    console.error("[change-password] error:", err);
    return { ok: false, error: "Failed to update password. Please try again." };
  }
}

export async function addAllowlistEmailAction(
  input: unknown,
): Promise<ActionResult> {
  const session = await requireStaff();
  if (session.role !== "admin") return { ok: false, error: "Not authorized" };
  const parsed = allowlistEmailSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid email" };
  try {
    await crm.addAdminAllowlist(parsed.data.email);
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to add email",
    };
  }
  revalidatePath("/admin/users");
  return { ok: true };
}

export async function removeAllowlistEmailAction(
  input: unknown,
): Promise<ActionResult> {
  const session = await requireStaff();
  if (session.role !== "admin") return { ok: false, error: "Not authorized" };
  const parsed = allowlistEmailSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid email" };
  try {
    await crm.removeAdminAllowlist(parsed.data.email);
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to remove email",
    };
  }
  revalidatePath("/admin/users");
  return { ok: true };
}

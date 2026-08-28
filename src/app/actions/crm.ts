// src/app/actions/crm.ts
'use server';

import { revalidatePath } from 'next/cache';
import { crm } from '@/lib/crm';
import { getActorProfile } from '@/lib/crm/session';
import {
  assignConsultantSchema,
  createApplicationSchema,
  sendMessageSchema,
  updateLeadStatusSchema,
} from '@/lib/validations/crm';
import type { LeadStatus, Profile, UserRole } from '@/types/crm';

export type ActionResult = { ok: true } | { ok: false; error: string };

/** Roles allowed to touch CRM objects (editors manage content, not leads). */
const CRM_ROLES: readonly UserRole[] = ['admin', 'consultant'];

/**
 * Action-level authorization (defense-in-depth on top of requireStaff):
 * - role gate (admin/consultant only; assignConsultant is admin-only)
 * - object-level scope: a consultant may only act on leads that are
 *   unassigned or assigned to them.
 */
async function guardLeadAccess(
  actor: Profile | null,
  leadId: string,
  roles: readonly UserRole[] = CRM_ROLES,
): Promise<ActionResult> {
  if (!actor) return { ok: false, error: 'Not authenticated' };
  if (!roles.includes(actor.role)) return { ok: false, error: 'Forbidden' };
  if (actor.role !== 'admin') {
    const lead = await crm.getLead(leadId);
    if (!lead) return { ok: false, error: 'Not found' };
    if (lead.assignedConsultantId && lead.assignedConsultantId !== actor.id) {
      return { ok: false, error: 'Forbidden' };
    }
  }
  return { ok: true };
}

export async function updateLeadStatusAction(input: unknown): Promise<ActionResult> {
  const parsed = updateLeadStatusSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Invalid input' };
  const actor = await getActorProfile();
  const guard = await guardLeadAccess(actor, parsed.data.leadId);
  if (!guard.ok) return guard;
  await crm.updateLeadStatus(parsed.data.leadId, parsed.data.status as LeadStatus, actor!.id);
  revalidatePath('/admin/leads');
  revalidatePath(`/admin/leads/${parsed.data.leadId}`);
  revalidatePath('/admin');
  return { ok: true };
}

export async function assignConsultantAction(input: unknown): Promise<ActionResult> {
  const parsed = assignConsultantSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Invalid input' };
  const actor = await getActorProfile();
  // Re-assigning consultants across the team is an admin decision.
  const guard = await guardLeadAccess(actor, parsed.data.leadId, ['admin']);
  if (!guard.ok) return guard;
  await crm.assignConsultant(parsed.data.leadId, parsed.data.consultantId, actor!.id);
  revalidatePath('/admin/leads');
  revalidatePath(`/admin/leads/${parsed.data.leadId}`);
  return { ok: true };
}

export async function createApplicationAction(input: unknown): Promise<ActionResult> {
  const parsed = createApplicationSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Invalid input' };
  const actor = await getActorProfile();
  const guard = await guardLeadAccess(actor, parsed.data.leadId);
  if (!guard.ok) return guard;
  await crm.createApplication(
    { leadId: parsed.data.leadId, universityId: parsed.data.universityId, programId: parsed.data.programId },
    actor!.id,
  );
  revalidatePath('/admin/leads');
  revalidatePath(`/admin/leads/${parsed.data.leadId}`);
  return { ok: true };
}

export async function sendAdminMessageAction(input: unknown): Promise<ActionResult> {
  const parsed = sendMessageSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' };
  const actor = await getActorProfile();
  const guard = await guardLeadAccess(actor, parsed.data.leadId);
  if (!guard.ok) return guard;
  await crm.sendMessage({ leadId: parsed.data.leadId, senderId: actor!.id, body: parsed.data.body });
  revalidatePath(`/admin/leads/${parsed.data.leadId}`);
  return { ok: true };
}

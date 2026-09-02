'use server';

import { revalidateTag } from 'next/cache';
import { crm } from '@/lib/crm';
import { getStudentSessionAny } from '@/lib/crm/student-session';
import { uploadDocumentObject } from '@/lib/storage';
import { sniffMime } from '@/lib/security/mime-sniff';
import { rateLimit } from '@/lib/rate-limit';
import { sendMessageSchema } from '@/lib/validations/student';

export type ActionResult = { ok: true } | { ok: false; error: string };

// SEC: authenticated actions get per-user limits (keyed by profile id, not IP
// — a student behind a shared NAT shouldn't throttle classmates, and a
// compromised session shouldn't be able to flood the CRM).
const messageLimiter = rateLimit({ windowMs: 60_000, max: 30 });
const uploadLimiter = rateLimit({ windowMs: 60_000, max: 20 });
const readLimiter = rateLimit({ windowMs: 60_000, max: 60 });

export async function sendStudentMessage(input: unknown): Promise<ActionResult> {
  const parsed = sendMessageSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Invalid input' };
  const session = await getStudentSessionAny();
  if (!session) return { ok: false, error: 'Not authenticated' };
  if (!(await messageLimiter.check(`msg:${session.userId}`)))
    return { ok: false, error: 'Too many messages. Please slow down.' };
  const lead = await crm.getLead(parsed.data.leadId);
  if (!lead || lead.userId !== session.userId) return { ok: false, error: 'Not allowed' };
  await crm.sendMessage({ leadId: parsed.data.leadId, senderId: session.userId, body: parsed.data.body });
  return { ok: true };
}

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED_MIME = ['application/pdf', 'image/png', 'image/jpeg'];

export async function uploadStudentDocument(formData: FormData): Promise<ActionResult> {
  const session = await getStudentSessionAny();
  if (!session) return { ok: false, error: 'Not authenticated' };
  if (!(await uploadLimiter.check(`upload:${session.userId}`)))
    return { ok: false, error: 'Too many uploads. Please wait a minute.' };

  const applicationId = String(formData.get('applicationId') ?? '');
  const file = formData.get('file');
  if (!(file instanceof File)) return { ok: false, error: 'No file provided' };
  if (!applicationId) return { ok: false, error: 'Missing application' };
  if (file.size === 0 || file.size > MAX_BYTES) return { ok: false, error: 'Invalid file size' };

  const apps = await crm.listMyApplications(session.userId);
  if (!apps.some((a) => a.id === applicationId)) return { ok: false, error: 'Not allowed' };

  const buffer = Buffer.from(await file.arrayBuffer());
  // Client `file.type` is spoofable — the sniffed type is the source of truth
  // (same policy as the public apply-document upload).
  const sniffed = sniffMime(buffer);
  if (!sniffed || !ALLOWED_MIME.includes(sniffed)) return { ok: false, error: 'Unsupported file type' };

  const ext = sniffed === 'application/pdf' ? 'pdf' : sniffed === 'image/png' ? 'png' : 'jpg';
  const path = `${session.userId}/${crypto.randomUUID()}.${ext}`;
  try {
    await uploadDocumentObject(path, buffer, sniffed);
  } catch (err) {
    // L1: Supabase unconfigured or storage down — log server-side and return a
    // generic error instead of throwing a 500 (mirrors upload-apply-document).
    console.error('[student-upload] storage error:', err);
    return { ok: false, error: 'Upload failed. Please try again.' };
  }
  await crm.addStudentDocument({
    applicationId,
    fileName: file.name,
    filePath: path,
    mimeType: sniffed,
    sizeBytes: file.size,
    uploadedBy: session.userId,
  });
  revalidateTag('student-documents');
  return { ok: true };
}

export async function markThreadReadAction(leadId: string): Promise<ActionResult> {
  const session = await getStudentSessionAny();
  if (!session) return { ok: false, error: 'Not authenticated' };
  if (!(await readLimiter.check(`read:${session.userId}`)))
    return { ok: false, error: 'Too many requests' };
  const lead = await crm.getLead(leadId);
  if (!lead || lead.userId !== session.userId) return { ok: false, error: 'Not allowed' };
  await crm.markThreadRead(leadId, session.userId);
  return { ok: true };
}

"use server";

import { headers } from "next/headers";
import { leadSchema, type LeadInput } from "@/lib/validations/lead";
import { crm } from "@/lib/crm";
import { rateLimit, getIpFromHeaders } from "@/lib/rate-limit";
import { isAllowedOrigin } from "@/lib/security/origin";
import { logger } from "@/lib/logger";

export type LeadResult =
  { ok: true } | { ok: false; errors: Record<string, string[]> };

// 5 lead submissions per minute per IP — enough for an honest applicant who
// retries after a typo, but blocks a script flooding the CRM with spam leads.
const leadLimiter = rateLimit({ windowMs: 60_000, max: 5 });

export async function submitLead(input: unknown): Promise<LeadResult> {
  // Reject cross-origin browser calls (spam bots often post from other sites).
  const h = await headers();
  if (!isAllowedOrigin(h.get("origin"))) {
    return { ok: false, errors: { _form: ["Request rejected."] } };
  }

  const parsed = leadSchema.safeParse(input);

  if (!parsed.success) {
    const errors: Record<string, string[]> = {};
    for (const [key, value] of Object.entries(
      parsed.error.flatten().fieldErrors,
    )) {
      if (Array.isArray(value) && value.length) errors[key] = value;
    }
    return { ok: false, errors };
  }

  const data = parsed.data as LeadInput;

  // Honeypot caught a bot.
  if (data.website) {
    return { ok: true };
  }

  // Rate limit per IP before touching the DB so spam can't fill the leads table.
  const ip = getIpFromHeaders((name) => h.get(name));
  if (!(await leadLimiter.check(ip))) {
    return {
      ok: false,
      errors: {
        _form: ["Too many submissions. Please wait a minute and try again."],
      },
    };
  }

  // Persist the lead into the CRM. We fail open on the *student-facing* result:
  // a transient DB error must not break the public "Apply Now" UX. BUT the
  // failure is now durably recorded (SEC-1) — written to the leads_dl
  // dead-letter table so it can be replayed/alerted on, instead of silently
  // vanishing into an ephemeral console log.
  try {
    const profile = await crm.findOrCreateStudent({
      email: data.email,
      fullName: `${data.firstName} ${data.lastName}`.trim(),
      phone: data.phone,
      whatsapp: data.whatsapp || null,
      countryCode: data.country,
    });

    await crm.createLead({
      userId: profile.id,
      // university_id is NOT NULL + a soft-ref to seed content; a general
      // application with no specific university page is tagged 'direct'.
      universityId: data.universityId || data.universitySlug || "direct",
      programId: data.programId || data.programInterest || null,
      source: "website",
      // Store the free-text message plus the rich apply metadata as a JSON
      // blob so consultants see everything in one place without a migration.
      notes: JSON.stringify(buildLeadNotes(data)),
    });
  } catch (err) {
    // QA-1: structured log (no PII — the full payload is persisted to the
    // leads_dl dead-letter table by recordFailedLead). error.name is enough
    // to triage; email/phone stay out of logs.
    logger.error("lead capture failed", { ip }, err);
    // SEC-1: persist the raw payload + error so no paying-intent lead is ever
    // silently lost. recordFailedLead swallows its own errors (best-effort).
    await crm.recordFailedLead(
      { input: data, ip },
      err instanceof Error ? `${err.name}: ${err.message}` : String(err),
    );
  }

  return { ok: true };
}

/**
 * Collapses the rich apply payload into a single JSON-serialisable notes
 * object. Empty/optional values are dropped so consultants only see fields the
 * student actually filled in.
 */
function buildLeadNotes(data: LeadInput): Record<string, unknown> {
  const notes: Record<string, unknown> = {
    message: data.message || undefined,
    degreeLevel: normalize(data.degreeLevel),
    instructionLanguage: normalize(data.instructionLanguage),
    intake: normalize(data.intake),
    scholarshipInterest: data.scholarshipInterest || undefined,
    dormitory: data.dormitory || undefined,
    dateOfBirth: normalize(data.dateOfBirth),
    gender: normalize(data.gender),
    nationality: normalize(data.nationality),
    passportUrl: normalize(data.passportUrl),
    diplomaUrl: normalize(data.diplomaUrl),
    photoUrl: normalize(data.photoUrl),
    motivationLetterUrl: normalize(data.motivationLetterUrl),
  };
  // Strip undefined keys for a clean JSON blob.
  for (const key of Object.keys(notes)) {
    if (notes[key] === undefined) delete notes[key];
  }
  return notes;
}

/** Treat empty strings as absent. */
function normalize(value: string | undefined): string | undefined {
  return value ? value : undefined;
}

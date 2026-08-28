"use server";

import { headers } from "next/headers";
import { getSupabaseServer } from "@/lib/supabase/server";
import { isAllowedOrigin } from "@/lib/security/origin";
import { rateLimit, getIpFromHeaders } from "@/lib/rate-limit";
import { sniffMime } from "@/lib/security/mime-sniff";

export type UploadResult =
  { ok: true; url: string } | { ok: false; error: string };

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME = ["image/jpeg", "image/png", "application/pdf"];
// Server-side allowlist for the storage path segment — the client may not
// dictate arbitrary prefixes into the bucket.
const ALLOWED_FIELDNAMES = new Set([
  "passport",
  "diploma",
  "photo",
  "motivationLetter",
  "motivation-letter",
]);
const BUCKET = "apply-documents";

// SEC-3: 20 uploads per minute per IP. The Apply form submits several
// documents per applicant; this allows a normal flow but blocks flooding.
const uploadLimiter = rateLimit({ windowMs: 60_000, max: 20 });

/**
 * Handles a single document upload from the public Apply form. This runs
 * BEFORE a lead/student profile exists, so it is intentionally unauthenticated
 * — protection comes from origin check, per-IP rate limiting, size cap,
 * magic-byte MIME verification, and a server-side fieldname allowlist. When
 * Supabase Storage is configured the file is pushed (service-role, server-side)
 * to the private `apply-documents` bucket; otherwise a deterministic local
 * placeholder path is returned so the form keeps working in dev.
 */
export async function uploadApplyDocument(
  formData: FormData,
): Promise<UploadResult> {
  // Reject cross-origin browser calls (unauth storage abuse vector).
  const h = await headers();
  if (!isAllowedOrigin(h.get("origin")))
    return { ok: false, error: "Request rejected" };

  // SEC-3: per-IP rate limit before any storage work.
  const ip = getIpFromHeaders((name) => h.get(name));
  if (!(await uploadLimiter.check(ip))) {
    return {
      ok: false,
      error: "Too many uploads. Please wait a minute and try again.",
    };
  }

  const file = formData.get("file");
  const fieldname = String(formData.get("fieldname") ?? "document");
  if (!(file instanceof File)) return { ok: false, error: "No file provided" };
  if (file.size === 0 || file.size > MAX_BYTES)
    return { ok: false, error: "Invalid file size" };
  // M12: don't let the client pick an arbitrary storage prefix.
  if (!ALLOWED_FIELDNAMES.has(fieldname))
    return { ok: false, error: "Invalid field name" };

  // SEC-3: read the buffer once and verify the real MIME via magic bytes. The
  // client `file.type` is spoofable; the sniffed type is the source of truth
  // and is also what gets stored as the object's content-type.
  let buffer: Buffer;
  try {
    buffer = Buffer.from(await file.arrayBuffer());
  } catch {
    return { ok: false, error: "Upload failed. Please try again." };
  }
  const sniffed = sniffMime(buffer);
  if (!sniffed || !ALLOWED_MIME.includes(sniffed)) {
    return { ok: false, error: "Unsupported file type" };
  }

  // Dev/preview path — no Supabase storage configured. Return a stable placeholder URL
  // so the rest of the submit flow (leadSchema + submitLead) keeps working.
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const ext =
      sniffed === "application/pdf"
        ? "pdf"
        : sniffed === "image/png"
          ? "png"
          : "jpg";
    const url = `/uploads/placeholder-${fieldname}-${Date.now()}.${ext}`;
    return { ok: true, url };
  }

  try {
    const ext =
      sniffed === "application/pdf"
        ? "pdf"
        : sniffed === "image/png"
          ? "png"
          : "jpg";
    const path = `apply/${fieldname}-${crypto.randomUUID()}.${ext}`;
    const supabase = getSupabaseServer();
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, buffer, { contentType: sniffed, upsert: false });
    if (error) {
      // L1: don't leak Supabase internals to the client — log and return generic.
      console.error("[upload-apply-document] storage error:", error.message);
      return { ok: false, error: "Upload failed. Please try again." };
    }
    return { ok: true, url: path };
  } catch (err) {
    // L1: log the real error server-side; return a generic message.
    console.error("[upload-apply-document] error:", err);
    return { ok: false, error: "Upload failed. Please try again." };
  }
}

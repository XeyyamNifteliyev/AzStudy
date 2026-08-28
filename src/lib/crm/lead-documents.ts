/**
 * Lead notes parsing (admin lead detail).
 *
 * `submitLead` collapses the rich apply-form payload into a JSON blob stored
 * in `leads.notes` (see buildLeadNotes in src/app/actions/leads.ts). Until the
 * lead is converted to an application, this blob is the ONLY place the
 * student's message and uploaded document paths live — so the admin lead page
 * parses it back into a typed, renderable structure here.
 */

export interface LeadNotes {
  message?: string;
  degreeLevel?: string;
  instructionLanguage?: string;
  intake?: string;
  scholarshipInterest?: boolean;
  dormitory?: boolean;
  dateOfBirth?: string;
  gender?: string;
  nationality?: string;
  passportUrl?: string;
  diplomaUrl?: string;
  photoUrl?: string;
  motivationLetterUrl?: string;
}

export interface LeadDocument {
  /** Storage path inside the `apply-documents` bucket (or a dev placeholder). */
  path: string;
  label: string;
  /** Dev-mode placeholder path (`/uploads/placeholder-*`) — not a real object. */
  isPlaceholder: boolean;
}

const DOCUMENT_FIELDS: { key: keyof LeadNotes; label: string }[] = [
  { key: "passportUrl", label: "Passport" },
  { key: "diplomaUrl", label: "Diploma" },
  { key: "photoUrl", label: "Photo" },
  { key: "motivationLetterUrl", label: "Motivation letter" },
];

/** Parse `leads.notes` defensively — legacy/empty/invalid values yield null. */
export function parseLeadNotes(
  notes: string | null | undefined,
): LeadNotes | null {
  if (!notes || !notes.trim()) return null;
  try {
    const parsed = JSON.parse(notes) as LeadNotes;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    // Legacy leads stored free text, not JSON.
    return null;
  }
}

/** Extract uploaded document entries from parsed lead notes (in stable order). */
export function extractLeadDocuments(notes: LeadNotes | null): LeadDocument[] {
  if (!notes) return [];
  const out: LeadDocument[] = [];
  for (const { key, label } of DOCUMENT_FIELDS) {
    const path = notes[key];
    if (typeof path === "string" && path) {
      out.push({
        path,
        label,
        isPlaceholder: path.startsWith("/uploads/"),
      });
    }
  }
  return out;
}

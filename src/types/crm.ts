// src/types/crm.ts
export type UserRole = "student" | "consultant" | "admin" | "editor";

export type LeadStatus =
  | "new"
  | "contacted"
  | "document_collection"
  | "application_submitted"
  | "offer_received"
  | "accepted"
  | "visa_processing"
  | "arrived"
  | "completed"
  | "lost";

export type ApplicationStatus =
  "draft" | "submitted" | "under_review" | "offer" | "rejected" | "enrolled";

export interface Profile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone: string | null;
  whatsapp: string | null;
  countryCode: string | null;
  avatarUrl: string | null;
  authUid: string | null;
  createdAt: string;
}

export interface Lead {
  id: string;
  userId: string;
  universityId: string;
  programId: string | null;
  status: LeadStatus;
  source: string;
  assignedConsultantId: string | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadWithRelations extends Lead {
  student: Pick<Profile, "id" | "fullName" | "email" | "countryCode"> | null;
  consultant: Pick<Profile, "id" | "fullName"> | null;
}

export interface LeadDetail extends LeadWithRelations {
  applications: Application[];
  timeline: AuditLog[];
}

export interface Application {
  id: string;
  leadId: string;
  universityId: string;
  programId: string | null;
  status: ApplicationStatus;
  assignedConsultantId: string | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationDocument {
  id: string;
  applicationId: string;
  fileName: string;
  fileUrl: string;
  mimeType: string | null;
  sizeBytes: number | null;
  verified: boolean;
  uploadedBy: string | null;
  createdAt: string;
}

export interface ApplicationDetail extends Application {
  documents: ApplicationDocument[];
  consultant: Pick<Profile, "id" | "fullName"> | null;
}

export interface AuditLog {
  id: string;
  userId: string | null;
  action: string;
  entity: string;
  entityId: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
  actorName: string | null;
}

export interface LeadFilter {
  status?: LeadStatus;
  consultantId?: string;
  search?: string;
  /** Max rows per page (default 200). Pass with offset for pagination. */
  limit?: number;
  /** Rows to skip (offset). */
  offset?: number;
}

export interface AuditFilter {
  entity?: string;
  entityId?: string;
  userId?: string;
  limit?: number;
}

export interface NewLeadInput {
  userId: string;
  universityId: string;
  programId?: string | null;
  source?: string;
  assignedConsultantId?: string | null;
  notes?: string;
}

export interface StudentProfileInput {
  email: string;
  fullName: string;
  phone?: string | null;
  whatsapp?: string | null;
  countryCode?: string | null;
}

export interface NewDocumentInput {
  applicationId: string;
  fileName: string;
  fileUrl: string;
  mimeType?: string | null;
  sizeBytes?: number | null;
  uploadedBy?: string | null;
}

export interface AuditEntryInput {
  userId: string;
  action: string;
  entity: string;
  entityId?: string | null;
  metadata?: Record<string, unknown>;
}

export interface Message {
  id: string;
  leadId: string;
  senderId: string;
  body: string;
  createdAt: string;
  readAt: string | null;
}

export interface MessageWithSender extends Message {
  senderName: string;
  senderRole: UserRole;
}

export type StudentNotificationType = "status_change" | "assigned" | "message";

export interface StudentNotification {
  id: string;
  type: StudentNotificationType;
  leadId: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
  read: boolean;
}

export interface NewMessageInput {
  leadId: string;
  senderId: string;
  body: string;
}

export interface NewDocumentUploadInput {
  applicationId: string;
  fileName: string;
  filePath: string;
  mimeType: string;
  sizeBytes: number;
  uploadedBy: string;
}

// Ordered pipeline for UI steppers/Kanban columns.
export const LEAD_PIPELINE: LeadStatus[] = [
  "new",
  "contacted",
  "document_collection",
  "application_submitted",
  "offer_received",
  "accepted",
  "visa_processing",
  "arrived",
  "completed",
  "lost",
];

export type LeadStatusLabels = Record<LeadStatus, string>;

/** English fallback used by admin components when no localized map is passed. */
export const LEAD_STATUS_LABELS: LeadStatusLabels = {
  new: "New",
  contacted: "Contacted",
  document_collection: "Documents",
  application_submitted: "Submitted",
  offer_received: "Offer",
  accepted: "Accepted",
  visa_processing: "Visa",
  arrived: "Arrived",
  completed: "Completed",
  lost: "Lost",
};

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  under_review: "Under Review",
  offer: "Offer",
  rejected: "Rejected",
  enrolled: "Enrolled",
};

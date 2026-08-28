// src/lib/crm/repositories.ts
import type {
  Application,
  ApplicationDetail,
  ApplicationDocument,
  ApplicationStatus,
  AuditEntryInput,
  AuditFilter,
  AuditLog,
  Lead,
  LeadDetail,
  LeadFilter,
  LeadStatus,
  LeadWithRelations,
  Message,
  MessageWithSender,
  NewDocumentInput,
  NewDocumentUploadInput,
  NewLeadInput,
  NewMessageInput,
  Profile,
  StudentNotification,
  StudentProfileInput,
} from "@/types/crm";

/** Thrown by write methods when the target row does not exist. */
export class NotFoundError extends Error {
  constructor(
    public readonly entity: string,
    id: string,
  ) {
    super(`${entity} not found: ${id}`);
    this.name = "NotFoundError";
  }
}

export interface CrmRepository {
  // leads
  listLeads(filter?: LeadFilter): Promise<LeadWithRelations[]>;
  getLead(id: string): Promise<LeadDetail | null>;
  createLead(input: NewLeadInput, actorId?: string): Promise<Lead>;
  updateLeadStatus(
    id: string,
    status: LeadStatus,
    actorId: string,
  ): Promise<Lead>;
  assignConsultant(
    leadId: string,
    consultantId: string | null,
    actorId: string,
  ): Promise<Lead>;
  /** SEC-1: durably record a lead that failed to capture (dead-letter). */
  recordFailedLead(payload: unknown, error: string): Promise<void>;
  // applications
  createApplication(input: { leadId: string; universityId: string; programId?: string }, actorId?: string): Promise<Application>;
  listApplications(leadId: string): Promise<Application[]>;
  getApplication(id: string): Promise<ApplicationDetail | null>;
  updateApplicationStatus(
    id: string,
    status: ApplicationStatus,
    actorId: string,
  ): Promise<Application>;
  // documents
  listDocuments(applicationId: string): Promise<ApplicationDocument[]>;
  addDocument(
    input: NewDocumentInput,
    actorId?: string,
  ): Promise<ApplicationDocument>;
  // users
  listStaff(): Promise<Profile[]>;
  getProfile(id: string): Promise<Profile | null>;
  findOrCreateStudent(input: StudentProfileInput): Promise<Profile>;
  getProfileByAuthUid(authUid: string): Promise<Profile | null>;
  upsertStudentByAuthUid(input: {
    authUid: string;
    email: string;
    fullName: string;
  }): Promise<Profile | null>;
  getStaffProfileByAuthUid(
    authUid: string,
    email: string,
  ): Promise<Profile | null>;
  /** Promote the configured INITIAL_ADMIN_EMAIL to admin on first login. */
  bootstrapInitialAdmin(input: {
    authUid: string;
    email: string;
    fullName: string;
  }): Promise<Profile | null>;
  /** Is this email allowed to resolve a staff/admin session? */
  isAdminAllowlisted(email: string): Promise<boolean>;
  /** List allowlisted emails (admin management UI). */
  listAdminAllowlist(): Promise<string[]>;
  /** Add an email to the allowlist (returns the new list). */
  addAdminAllowlist(email: string): Promise<string[]>;
  /** Remove an email from the allowlist (returns the new list). */
  removeAdminAllowlist(email: string): Promise<string[]>;
  updateProfileRole(
    id: string,
    role: "admin" | "consultant",
    actorId: string,
  ): Promise<Profile>;
  // stats
  countByStatus(): Promise<Record<string, number>>;
  // audit
  writeAudit(entry: AuditEntryInput): Promise<void>;
  listAudit(filter?: AuditFilter): Promise<AuditLog[]>;
  // student-scoped (Phase 2C)
  listStudents(): Promise<Profile[]>;
  listMyLeads(userId: string): Promise<LeadWithRelations[]>;
  listMyApplications(userId: string): Promise<Application[]>;
  listMyDocuments(userId: string): Promise<ApplicationDocument[]>;
  listMessages(leadId: string): Promise<MessageWithSender[]>;
  sendMessage(input: NewMessageInput): Promise<Message>;
  markThreadRead(leadId: string, readerId: string): Promise<void>;
  unreadMessageCount(userId: string): Promise<number>;
  listNotifications(
    userId: string,
    limit?: number,
  ): Promise<StudentNotification[]>;
  addStudentDocument(
    input: NewDocumentUploadInput,
  ): Promise<ApplicationDocument>;
}

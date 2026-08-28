// src/lib/crm/pg-repository.ts
import type { Pool, QueryResult, QueryResultRow } from "pg";
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
import { NotFoundError, type CrmRepository } from "./repositories";

function rowToProfile(r: QueryResultRow): Profile {
  return {
    id: r.id,
    email: r.email,
    fullName: r.full_name,
    role: r.role,
    phone: r.phone,
    whatsapp: r.whatsapp,
    countryCode: r.country_code,
    avatarUrl: r.avatar_url,
    authUid: r.auth_uid ?? null,
    createdAt: r.created_at,
  };
}

function rowToLead(r: QueryResultRow): Lead {
  return {
    id: r.id,
    userId: r.user_id,
    universityId: r.university_id,
    programId: r.program_id,
    status: r.status,
    source: r.source,
    assignedConsultantId: r.assigned_consultant_id,
    notes: r.notes,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export function createPgCrm(getPool: () => Pool): CrmRepository {
  const q = async <T extends QueryResultRow = QueryResultRow>(
    text: string,
    params: unknown[] = [],
  ): Promise<QueryResult<T>> => getPool().query<T>(text, params as never[]);

  const audit = async (entry: AuditEntryInput): Promise<void> => {
    await q(
      `insert into public.audit_logs (user_id, action, entity, entity_id, metadata)
       values ($1, $2, $3, $4, $5::jsonb)`,
      [
        entry.userId,
        entry.action,
        entry.entity,
        entry.entityId ?? null,
        JSON.stringify(entry.metadata ?? {}),
      ],
    );
  };

  return {
    async listLeads(filter: LeadFilter = {}): Promise<LeadWithRelations[]> {
      const where: string[] = [];
      const params: unknown[] = [];
      if (filter.status) {
        params.push(filter.status);
        where.push(`l.status = $${params.length}`);
      }
      if (filter.consultantId) {
        params.push(filter.consultantId);
        where.push(`l.assigned_consultant_id = $${params.length}`);
      }
      if (filter.search) {
        params.push(`%${filter.search}%`);
        where.push(
          `(s.full_name ilike $${params.length} or s.email ilike $${params.length} or l.university_id ilike $${params.length})`,
        );
      }
      const clause = where.length ? `where ${where.join(" and ")}` : "";
      const limit = Math.min(Math.max(filter.limit ?? 200, 1), 500);
      const offset = Math.max(filter.offset ?? 0, 0);
      params.push(limit, offset);
      const res = await q(
        `select l.*, s.id s_id, s.full_name s_name, s.email s_email, s.country_code s_country,
                c.id c_id, c.full_name c_name
         from public.leads l
         join public.profiles s on s.id = l.user_id
         left join public.profiles c on c.id = l.assigned_consultant_id
         ${clause}
         order by l.created_at desc
         limit $${params.length - 1} offset $${params.length}`,
        params,
      );
      return res.rows.map((r) => ({
        ...rowToLead(r),
        student: r.s_id
          ? {
              id: r.s_id,
              fullName: r.s_name,
              email: r.s_email,
              countryCode: r.s_country,
            }
          : null,
        consultant: r.c_id ? { id: r.c_id, fullName: r.c_name } : null,
      }));
    },

    async getLead(id: string): Promise<LeadDetail | null> {
      const res = await q(
        `select l.*, s.id s_id, s.full_name s_name, s.email s_email, s.country_code s_country,
                c.id c_id, c.full_name c_name
         from public.leads l
         join public.profiles s on s.id = l.user_id
         left join public.profiles c on c.id = l.assigned_consultant_id
         where l.id = $1`,
        [id],
      );
      if (res.rowCount === 0) return null;
      const r = res.rows[0];
      const [apps, timeline] = await Promise.all([
        this.listApplications(id),
        this.listAudit({ entity: "lead", entityId: id, limit: 50 }),
      ]);
      return {
        ...rowToLead(r),
        student: {
          id: r.s_id,
          fullName: r.s_name,
          email: r.s_email,
          countryCode: r.s_country,
        },
        consultant: r.c_id ? { id: r.c_id, fullName: r.c_name } : null,
        applications: apps,
        timeline,
      };
    },

    async createLead(input: NewLeadInput, actorId?: string): Promise<Lead> {
      // BE-8: wrap insert + audit in a transaction so a partial failure can't
      // create a lead with no audit trail.
      const client = await getPool().connect();
      try {
        await client.query("BEGIN");
        const res = await client.query(
          `insert into public.leads (user_id, university_id, program_id, source, assigned_consultant_id, notes)
           values ($1,$2,$3,$4,$5,$6) returning *`,
          [
            input.userId,
            input.universityId,
            input.programId ?? null,
            input.source ?? "website",
            input.assignedConsultantId ?? null,
            input.notes ?? "",
          ],
        );
        const lead = rowToLead(res.rows[0]);
        if (actorId) {
          await client.query(
            `insert into public.audit_logs (user_id, action, entity, entity_id)
             values ($1, 'lead.create', 'lead', $2)`,
            [actorId, lead.id],
          );
        }
        await client.query("COMMIT");
        return lead;
      } catch (err) {
        await client.query("ROLLBACK");
        throw err;
      } finally {
        client.release();
      }
    },

    async updateLeadStatus(
      id: string,
      status: LeadStatus,
      actorId: string,
    ): Promise<Lead> {
      // 4.2: Wrap status update + audit log in a transaction so a partial
      // failure can't leave the status changed without an audit trail.
      const client = await getPool().connect();
      try {
        await client.query("BEGIN");
        const prev = await client.query(
          "select status from public.leads where id = $1",
          [id],
        );
        if (prev.rowCount === 0) throw new NotFoundError("lead", id);
        const from = prev.rows[0].status;
        const res = await client.query(
          "update public.leads set status = $1 where id = $2 returning *",
          [status, id],
        );
        await client.query(
          `insert into public.audit_logs (user_id, action, entity, entity_id, metadata)
           values ($1, 'lead.update_status', 'lead', $2, $3)`,
          [actorId, id, JSON.stringify({ from, to: status })],
        );
        await client.query("COMMIT");
        return rowToLead(res.rows[0]);
      } catch (err) {
        await client.query("ROLLBACK");
        throw err;
      } finally {
        client.release();
      }
    },

    async assignConsultant(
      leadId: string,
      consultantId: string | null,
      actorId: string,
    ): Promise<Lead> {
      // B5: wrap assign + audit in a transaction so a partial failure can't
      // leave the lead assigned without an audit trail.
      const client = await getPool().connect();
      try {
        await client.query("BEGIN");
        const res = await client.query(
          "update public.leads set assigned_consultant_id = $1 where id = $2 returning *",
          [consultantId, leadId],
        );
        if (res.rowCount === 0) throw new NotFoundError("lead", leadId);
        await client.query(
          `insert into public.audit_logs (user_id, action, entity, entity_id, metadata)
           values ($1, 'lead.assign', 'lead', $2, $3)`,
          [actorId, leadId, JSON.stringify({ consultantId })],
        );
        await client.query("COMMIT");
        return rowToLead(res.rows[0]);
      } catch (err) {
        await client.query("ROLLBACK");
        throw err;
      } finally {
        client.release();
      }
    },

    async recordFailedLead(payload: unknown, error: string): Promise<void> {
      // SEC-1: best-effort dead-letter write. If even this fails (DB fully
      // down), the caller's console.error is the only trace — but the common
      // case (constraint violation / transient error with DB reachable) is
      // now durably recoverable.
      try {
        await q(
          "insert into public.leads_dl (payload, error) values ($1::jsonb, $2)",
          [JSON.stringify(payload ?? null), error],
        );
      } catch {
        // Swallow — dead-letter must never throw back into submitLead's catch.
      }
    },

    async createApplication(
      input: { leadId: string; universityId: string; programId?: string },
      actorId?: string,
    ): Promise<Application> {
      const id = crypto.randomUUID();
      const res = await q(
        `INSERT INTO public.applications (id, lead_id, university_id, program_id, status)
         VALUES ($1, $2, $3, $4, 'submitted')
         RETURNING *`,
        [id, input.leadId, input.universityId, input.programId ?? null],
      );
      const r = res.rows[0];
      // Audit log
      if (actorId) {
        await q(
          `INSERT INTO public.audit_logs (user_id, action, entity, entity_id, metadata)
           VALUES ($1, 'application.create', 'application', $2, $3)`,
          [actorId, id, JSON.stringify({ leadId: input.leadId, universityId: input.universityId })],
        );
      }
      return {
        id: r.id,
        leadId: r.lead_id,
        universityId: r.university_id,
        programId: r.program_id,
        status: r.status,
        assignedConsultantId: r.assigned_consultant_id,
        notes: r.notes ?? '',
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      };
    },

    async listApplications(leadId: string): Promise<Application[]> {
      const res = await q(
        "select * from public.applications where lead_id = $1 order by created_at",
        [leadId],
      );
      return res.rows.map((r) => ({
        id: r.id,
        leadId: r.lead_id,
        universityId: r.university_id,
        programId: r.program_id,
        status: r.status,
        assignedConsultantId: r.assigned_consultant_id,
        notes: r.notes,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      }));
    },

    async getApplication(id: string): Promise<ApplicationDetail | null> {
      const res = await q(
        `select a.*, c.id c_id, c.full_name c_name
         from public.applications a
         left join public.profiles c on c.id = a.assigned_consultant_id
         where a.id = $1`,
        [id],
      );
      if (res.rowCount === 0) return null;
      const r = res.rows[0];
      const docs = await this.listDocuments(id);
      return {
        id: r.id,
        leadId: r.lead_id,
        universityId: r.university_id,
        programId: r.program_id,
        status: r.status,
        assignedConsultantId: r.assigned_consultant_id,
        notes: r.notes,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
        consultant: r.c_id ? { id: r.c_id, fullName: r.c_name } : null,
        documents: docs,
      };
    },

    async updateApplicationStatus(
      id: string,
      status: ApplicationStatus,
      actorId: string,
    ): Promise<Application> {
      // BE-8: wrap status update + audit in a transaction.
      const client = await getPool().connect();
      try {
        await client.query("BEGIN");
        const res = await client.query(
          "update public.applications set status = $1 where id = $2 returning *",
          [status, id],
        );
        if (res.rowCount === 0) throw new NotFoundError("application", id);
        await client.query(
          `insert into public.audit_logs (user_id, action, entity, entity_id, metadata)
           values ($1, 'application.update_status', 'application', $2, $3)`,
          [actorId, id, JSON.stringify({ to: status })],
        );
        await client.query("COMMIT");
        const r = res.rows[0];
        return {
          id: r.id,
          leadId: r.lead_id,
          universityId: r.university_id,
          programId: r.program_id,
          status: r.status,
          assignedConsultantId: r.assigned_consultant_id,
          notes: r.notes,
          createdAt: r.created_at,
          updatedAt: r.updated_at,
        };
      } catch (err) {
        await client.query("ROLLBACK");
        throw err;
      } finally {
        client.release();
      }
    },

    async listDocuments(applicationId: string): Promise<ApplicationDocument[]> {
      const res = await q(
        "select * from public.application_documents where application_id = $1 order by created_at",
        [applicationId],
      );
      return res.rows.map((r) => ({
        id: r.id,
        applicationId: r.application_id,
        fileName: r.file_name,
        fileUrl: r.file_url,
        mimeType: r.mime_type,
        sizeBytes: r.size_bytes,
        verified: r.verified,
        uploadedBy: r.uploaded_by,
        createdAt: r.created_at,
      }));
    },

    async addDocument(
      input: NewDocumentInput,
      actorId?: string,
    ): Promise<ApplicationDocument> {
      const res = await q(
        `insert into public.application_documents (application_id, file_name, file_url, mime_type, size_bytes, uploaded_by)
         values ($1,$2,$3,$4,$5,$6) returning *`,
        [
          input.applicationId,
          input.fileName,
          input.fileUrl,
          input.mimeType ?? null,
          input.sizeBytes ?? null,
          input.uploadedBy ?? actorId ?? null,
        ],
      );
      const r = res.rows[0];
      return {
        id: r.id,
        applicationId: r.application_id,
        fileName: r.file_name,
        fileUrl: r.file_url,
        mimeType: r.mime_type,
        sizeBytes: r.size_bytes,
        verified: r.verified,
        uploadedBy: r.uploaded_by,
        createdAt: r.created_at,
      };
    },

    async listStaff(): Promise<Profile[]> {
      const res = await q(
        `select * from public.profiles where role in ('admin','consultant','editor') order by full_name`,
      );
      return res.rows.map(rowToProfile);
    },

    async getProfile(id: string): Promise<Profile | null> {
      const res = await q("select * from public.profiles where id = $1", [id]);
      return res.rowCount ? rowToProfile(res.rows[0]) : null;
    },

    async updateProfileRole(
      id: string,
      role: "admin" | "consultant",
      actorId: string,
    ): Promise<Profile> {
      // Last active admin protection: count remaining active admins if demoting an admin.
      if (role !== "admin") {
        const current = await q(
          "select role from public.profiles where id = $1",
          [id],
        );
        if (current.rowCount && current.rows[0].role === "admin") {
          const adminCount = await q(
            `select count(*)::int as n from public.profiles where role = 'admin'`,
          );
          if (adminCount.rows[0].n <= 1) {
            throw new Error("Cannot demote the last active admin");
          }
        }
      }
      const res = await q(
        "update public.profiles set role = $1, updated_at = now() where id = $2 returning *",
        [role, id],
      );
      if (!res.rowCount) throw new NotFoundError("Profile", id);
      await audit({
        userId: actorId,
        action: "role_change",
        entity: "profile",
        entityId: id,
        metadata: { newRole: role },
      });
      return rowToProfile(res.rows[0]);
    },

    async listStudents(): Promise<Profile[]> {
      const res = await q(
        `select * from public.profiles where role = 'student' order by full_name`,
      );
      return res.rows.map(rowToProfile);
    },

    async listMyLeads(userId: string): Promise<LeadWithRelations[]> {
      const res = await q(
        `select l.*, s.id s_id, s.full_name s_name, s.email s_email, s.country_code s_country,
                c.id c_id, c.full_name c_name
         from public.leads l
         join public.profiles s on s.id = l.user_id
         left join public.profiles c on c.id = l.assigned_consultant_id
         where l.user_id = $1
         order by l.created_at desc`,
        [userId],
      );
      return res.rows.map((r) => ({
        ...rowToLead(r),
        student: {
          id: r.s_id,
          fullName: r.s_name,
          email: r.s_email,
          countryCode: r.s_country,
        },
        consultant: r.c_id ? { id: r.c_id, fullName: r.c_name } : null,
      }));
    },

    async listMyApplications(userId: string): Promise<Application[]> {
      const res = await q(
        `select a.* from public.applications a
         join public.leads l on l.id = a.lead_id
         where l.user_id = $1
         order by a.created_at desc`,
        [userId],
      );
      return res.rows.map((r) => ({
        id: r.id,
        leadId: r.lead_id,
        universityId: r.university_id,
        programId: r.program_id,
        status: r.status,
        assignedConsultantId: r.assigned_consultant_id,
        notes: r.notes,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      }));
    },

    async listMyDocuments(userId: string): Promise<ApplicationDocument[]> {
      const res = await q(
        `select d.* from public.application_documents d
         join public.applications a on a.id = d.application_id
         join public.leads l on l.id = a.lead_id
         where l.user_id = $1
         order by d.created_at desc`,
        [userId],
      );
      return res.rows.map((r) => ({
        id: r.id,
        applicationId: r.application_id,
        fileName: r.file_name,
        fileUrl: r.file_url,
        mimeType: r.mime_type,
        sizeBytes: r.size_bytes,
        verified: r.verified,
        uploadedBy: r.uploaded_by,
        createdAt: r.created_at,
      }));
    },

    async listMessages(leadId: string): Promise<MessageWithSender[]> {
      const res = await q(
        `select m.*, p.full_name sender_name, p.role sender_role
         from public.messages m
         join public.profiles p on p.id = m.sender_id
         where m.lead_id = $1
         order by m.created_at asc`,
        [leadId],
      );
      return res.rows.map((r) => ({
        id: r.id,
        leadId: r.lead_id,
        senderId: r.sender_id,
        body: r.body,
        createdAt: r.created_at,
        readAt: r.read_at,
        senderName: r.sender_name,
        senderRole: r.sender_role,
      }));
    },

    async sendMessage(input: NewMessageInput): Promise<Message> {
      const res = await q(
        `insert into public.messages (lead_id, sender_id, body) values ($1, $2, $3) returning *`,
        [input.leadId, input.senderId, input.body],
      );
      const r = res.rows[0];
      return {
        id: r.id,
        leadId: r.lead_id,
        senderId: r.sender_id,
        body: r.body,
        createdAt: r.created_at,
        readAt: r.read_at,
      };
    },

    async markThreadRead(leadId: string, readerId: string): Promise<void> {
      await q(
        `update public.messages set read_at = now()
         where lead_id = $1 and sender_id <> $2 and read_at is null`,
        [leadId, readerId],
      );
    },

    async unreadMessageCount(userId: string): Promise<number> {
      const res = await q(
        `select count(*)::int c from public.messages m
         join public.leads l on l.id = m.lead_id
         where l.user_id = $1 and m.sender_id <> $1 and m.read_at is null`,
        [userId],
      );
      return res.rows[0]?.c ?? 0;
    },

    async listNotifications(
      userId: string,
      limit = 20,
    ): Promise<StudentNotification[]> {
      // PERF: single UNION ALL query instead of two round-trips + JS sort. The
      // outer ORDER BY/LIMIT applies after the union, so the top-N newest rows
      // across both sources come back without fetching extra rows or sorting
      // in JS. Rows carry a `kind` discriminator; audit-only columns (action,
      // metadata) are coalesced to null for message rows and vice versa.
      const res = await q(
        `select kind, id, lead_id, created_at, action, metadata,
                sender_name, body
         from (
           select 'audit' kind, a.id, l.id lead_id, a.created_at, a.action,
                  a.metadata, null::text sender_name, null::text body
           from public.audit_logs a
           join public.leads l on l.id = a.entity_id
           where l.user_id = $1 and a.entity = 'lead'
             and a.action in ('lead.create', 'lead.update_status', 'lead.assign')
           union all
           select 'message' kind, m.id, m.lead_id, m.created_at, null::text action,
                  null::jsonb metadata, p.full_name sender_name, m.body
           from public.messages m
           join public.leads l on l.id = m.lead_id
           join public.profiles p on p.id = m.sender_id
           where l.user_id = $1 and m.sender_id <> $1 and m.read_at is null
         ) n
         order by created_at desc
         limit $2`,
        [userId, limit],
      );
      return res.rows.map((r): StudentNotification => {
        if (r.kind === "audit") {
          return {
            id: `audit-${r.id}`,
            type: r.action === "lead.assign" ? "assigned" : "status_change",
            leadId: r.lead_id,
            metadata: r.metadata ?? {},
            createdAt: r.created_at,
            read: false,
          };
        }
        return {
          id: `msg-${r.id}`,
          type: "message",
          leadId: r.lead_id,
          metadata: { senderName: r.sender_name, body: r.body },
          createdAt: r.created_at,
          read: false,
        };
      });
    },

    async addStudentDocument(
      input: NewDocumentUploadInput,
    ): Promise<ApplicationDocument> {
      const res = await q(
        `insert into public.application_documents
           (application_id, file_name, file_url, mime_type, size_bytes, uploaded_by)
         values ($1, $2, $3, $4, $5, $6) returning *`,
        [
          input.applicationId,
          input.fileName,
          input.filePath,
          input.mimeType,
          input.sizeBytes,
          input.uploadedBy,
        ],
      );
      const r = res.rows[0];
      await audit({
        userId: input.uploadedBy,
        action: "document.create",
        entity: "application",
        entityId: input.applicationId,
      });
      return {
        id: r.id,
        applicationId: r.application_id,
        fileName: r.file_name,
        fileUrl: r.file_url,
        mimeType: r.mime_type,
        sizeBytes: r.size_bytes,
        verified: r.verified,
        uploadedBy: r.uploaded_by,
        createdAt: r.created_at,
      };
    },

    async findOrCreateStudent(input: StudentProfileInput): Promise<Profile> {
      // 4.4: Use INSERT ... ON CONFLICT to avoid the check-then-insert race
      // condition where two parallel requests with the same email both insert.
      const res = await q(
        `insert into public.profiles (email, full_name, phone, whatsapp, country_code, role)
         values ($1, $2, $3, $4, $5, 'student')
         on conflict (email) do nothing
         returning *`,
        [
          input.email,
          input.fullName,
          input.phone ?? null,
          input.whatsapp ?? null,
          input.countryCode ?? null,
        ],
      );
      if (res.rowCount) return rowToProfile(res.rows[0]);
      // Row already existed — fetch it.
      const found = await q("select * from public.profiles where email = $1", [
        input.email,
      ]);
      return rowToProfile(found.rows[0]);
    },

    async getProfileByAuthUid(authUid: string): Promise<Profile | null> {
      const res = await q("select * from public.profiles where auth_uid = $1", [
        authUid,
      ]);
      return res.rowCount ? rowToProfile(res.rows[0]) : null;
    },

    async upsertStudentByAuthUid(input: {
      authUid: string;
      email: string;
      fullName: string;
    }): Promise<Profile | null> {
      // Fast path: auth_uid already bound (repeat login). Read is race-free
      // enough here because binding happens once per auth_uid; the UPDATE below
      // re-binds atomically with a guard, and the final INSERT uses
      // `on conflict (email) do nothing` for the rare concurrent-signup race.
      const byUid = await q(
        "select * from public.profiles where auth_uid = $1",
        [input.authUid],
      );
      if (byUid.rowCount) return rowToProfile(byUid.rows[0]);
      // Merge an existing profile by email ONLY if it is a student. Linking to a
      // staff/admin profile here would let an attacker who controls that email
      // bind their auth_uid to a privileged profile and then resolve it via the
      // staff session path (privilege escalation). The `(auth_uid is null or
      // auth_uid = $1)` guard keeps a concurrent double-signup from stealing the
      // row out from under the first caller.
      const linked = await q(
        "update public.profiles set auth_uid = $1 where email = $2 and role = $3 and (auth_uid is null or auth_uid = $1) returning *",
        [input.authUid, input.email, "student"],
      );
      if (linked.rowCount) return rowToProfile(linked.rows[0]);
      // Email already belongs to a staff profile (or another student): do not
      // create a duplicate. Return null so the caller treats signup as taken.
      const created = await q(
        `insert into public.profiles (email, full_name, role, auth_uid)
         values ($1, $2, 'student', $3)
         on conflict (email) do nothing
         returning *`,
        [input.email, input.fullName || "", input.authUid],
      );
      return created.rowCount ? rowToProfile(created.rows[0]) : null;
    },

    async getStaffProfileByAuthUid(
      authUid: string,
      _email: string,
    ): Promise<Profile | null> {
      // Staff must be pre-provisioned with an auth_uid (set by an admin). Resolve
      // by auth_uid ONLY — never auto-link by email, otherwise an attacker who
      // signs up under a staff member's email would gain staff access.
      const byUid = await q(
        "select * from public.profiles where auth_uid = $1",
        [authUid],
      );
      return byUid.rowCount ? rowToProfile(byUid.rows[0]) : null;
    },

    async bootstrapInitialAdmin(input: {
      authUid: string;
      email: string;
      fullName: string;
    }): Promise<Profile | null> {
      // Bootstrap guard: only the configured INITIAL_ADMIN_EMAIL may ever be
      // promoted here. Any other email is ignored so this can never become a
      // privilege-escalation vector.
      const initialEmail =
        process.env.INITIAL_ADMIN_EMAIL?.trim().toLowerCase();
      if (!initialEmail || input.email.trim().toLowerCase() !== initialEmail) {
        return null;
      }
      // Ensure the initial admin email is allowlisted so it can resolve staff
      // sessions on subsequent logins.
      await q(
        `insert into public.admin_allowlist (email) values ($1)
         on conflict (email) do nothing`,
        [initialEmail],
      );
      // Link the auth_uid to an existing profile (any role) or create one,
      // then force role='admin' and bind auth_uid atomically.
      const res = await q(
        `insert into public.profiles (email, full_name, role, auth_uid)
         values ($1, $2, 'admin', $3)
         on conflict (email) do update
           set auth_uid = excluded.auth_uid, role = 'admin'
         returning *`,
        [input.email, input.fullName || input.email, input.authUid],
      );
      return res.rowCount ? rowToProfile(res.rows[0]) : null;
    },

    async isAdminAllowlisted(email: string): Promise<boolean> {
      const normalized = email.trim().toLowerCase();
      if (!normalized) return false;
      const res = await q(
        "select 1 from public.admin_allowlist where email = $1",
        [normalized],
      );
      return (res.rowCount ?? 0) > 0;
    },

    async listAdminAllowlist(): Promise<string[]> {
      const res = await q(
        "select email from public.admin_allowlist order by email",
      );
      return res.rows.map((r) => r.email as string);
    },

    async addAdminAllowlist(email: string): Promise<string[]> {
      const normalized = email.trim().toLowerCase();
      if (normalized) {
        await q(
          `insert into public.admin_allowlist (email) values ($1)
           on conflict (email) do nothing`,
          [normalized],
        );
      }
      return this.listAdminAllowlist();
    },

    async removeAdminAllowlist(email: string): Promise<string[]> {
      const normalized = email.trim().toLowerCase();
      if (normalized) {
        await q("delete from public.admin_allowlist where email = $1", [
          normalized,
        ]);
      }
      return this.listAdminAllowlist();
    },

    async countByStatus(): Promise<Record<string, number>> {
      const res = await q(
        "select status, count(*)::int c from public.leads group by status",
      );
      const out: Record<string, number> = {};
      for (const r of res.rows) out[r.status] = r.c;
      return out;
    },

    async writeAudit(entry: AuditEntryInput): Promise<void> {
      await audit(entry);
    },

    async listAudit(filter: AuditFilter = {}): Promise<AuditLog[]> {
      const where: string[] = [];
      const params: unknown[] = [];
      if (filter.entity) {
        params.push(filter.entity);
        where.push(`a.entity = $${params.length}`);
      }
      if (filter.entityId) {
        params.push(filter.entityId);
        where.push(`a.entity_id = $${params.length}`);
      }
      if (filter.userId) {
        params.push(filter.userId);
        where.push(`a.user_id = $${params.length}`);
      }
      const limit = filter.limit ?? 100;
      params.push(limit);
      const res = await q(
        `select a.*, p.full_name actor_name
         from public.audit_logs a
         left join public.profiles p on p.id = a.user_id
         ${where.length ? `where ${where.join(" and ")}` : ""}
         order by a.created_at desc
         limit $${params.length}`,
        params,
      );
      return res.rows.map((r) => ({
        id: r.id,
        userId: r.user_id,
        action: r.action,
        entity: r.entity,
        entityId: r.entity_id,
        metadata: r.metadata ?? {},
        createdAt: r.created_at,
        actorName: r.actor_name,
      }));
    },
  };
}

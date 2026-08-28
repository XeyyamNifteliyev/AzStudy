import { randomUUID } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { Pool } from "pg";
import { createPgCrm } from "@/lib/crm/pg-repository";
import type { CrmRepository } from "@/lib/crm/repositories";

const STUDENT = "44444444-4444-4444-4444-444444444444"; // Ali Veli (seed)
let pool: Pool;
let crm: CrmRepository;

beforeEach(async () => {
  pool = new Pool({ connectionString: process.env.DATABASE_URL!, max: 3 });
  crm = createPgCrm(() => pool);
});

afterEach(async () => {
  await pool.end();
});

describe("student-scoped reads", () => {
  it("lists students only", async () => {
    const students = await crm.listStudents();
    expect(students.length).toBeGreaterThan(0);
    expect(students.every((s) => s.role === "student")).toBe(true);
  });

  it("lists the student own leads", async () => {
    const leads = await crm.listMyLeads(STUDENT);
    expect(leads.length).toBeGreaterThan(0);
    expect(leads.every((l) => l.userId === STUDENT)).toBe(true);
  });

  it("lists the student own applications (via leads)", async () => {
    const apps = await crm.listMyApplications(STUDENT);
    expect(Array.isArray(apps)).toBe(true);
  });

  it("lists the student own documents (via leads)", async () => {
    const docs = await crm.listMyDocuments(STUDENT);
    expect(Array.isArray(docs)).toBe(true);
  });
});

describe("student messaging", () => {
  const CONSULTANT = "22222222-2222-2222-2222-222222222222"; // Ayşe (seed)

  it("sends and lists messages in a lead thread", async () => {
    const [lead] = await crm.listMyLeads(STUDENT);
    const sent = await crm.sendMessage({
      leadId: lead.id,
      senderId: STUDENT,
      body: "Hello consultant",
    });
    expect(sent.body).toBe("Hello consultant");
    const thread = await crm.listMessages(lead.id);
    expect(thread.some((m) => m.id === sent.id)).toBe(true);
    expect(thread[0].senderName).toBeTruthy();
  });

  it("counts unread messages sent to the student, then marks them read", async () => {
    const [lead] = await crm.listMyLeads(STUDENT);
    await crm.sendMessage({
      leadId: lead.id,
      senderId: CONSULTANT,
      body: "Reply",
    });
    const before = await crm.unreadMessageCount(STUDENT);
    expect(before).toBeGreaterThanOrEqual(1);
    await crm.markThreadRead(lead.id, STUDENT);
    const after = await crm.unreadMessageCount(STUDENT);
    expect(after).toBeLessThan(before);
  });
});

describe("notifications + student document", () => {
  it("lists notifications composed from audit + unread messages", async () => {
    const notes = await crm.listNotifications(STUDENT, 20);
    expect(Array.isArray(notes)).toBe(true);
    for (const n of notes) {
      expect(["status_change", "assigned", "message"]).toContain(n.type);
    }
  });

  it("adds a student document row", async () => {
    const apps = await crm.listMyApplications(STUDENT);
    if (apps.length === 0) return;
    const [app] = apps;
    const before = await crm.listMyDocuments(STUDENT);
    await crm.addStudentDocument({
      applicationId: app.id,
      fileName: "test.pdf",
      filePath: `${STUDENT}/test-uuid.pdf`,
      mimeType: "application/pdf",
      sizeBytes: 1234,
      uploadedBy: STUDENT,
    });
    const after = await crm.listMyDocuments(STUDENT);
    expect(after.length).toBeGreaterThan(before.length);
  });
});

describe("auth_uid profile linking", () => {
  it("creates a new student profile keyed by auth_uid", async () => {
    const uid = randomUUID();
    const email = `otp-${uid.slice(0, 8)}@example.com`;
    const p = await crm.upsertStudentByAuthUid({
      authUid: uid,
      email,
      fullName: "OTP User",
    });
    expect(p).not.toBeNull();
    expect(p!.role).toBe("student");
    expect(p!.email).toBe(email);
    const byUid = await crm.getProfileByAuthUid(uid);
    expect(byUid?.id).toBe(p!.id);
  });

  it("merges an existing email profile by setting its auth_uid", async () => {
    const STUDENT2 = "55555555-5555-5555-5555-555555555555";
    // Idempotent: clear any auth_uid bound by a previous run so the merge
    // always has a clean row to attach to.
    await pool.query(
      "update public.profiles set auth_uid = null where id = $1",
      [STUDENT2],
    );
    const before = await crm.getProfile(STUDENT2);
    expect(before).not.toBeNull();
    const uid = randomUUID();
    const merged = await crm.upsertStudentByAuthUid({
      authUid: uid,
      email: before!.email,
      fullName: before!.fullName,
    });
    expect(merged).not.toBeNull();
    expect(merged!.id).toBe(STUDENT2);
    const byUid = await crm.getProfileByAuthUid(uid);
    expect(byUid?.id).toBe(STUDENT2);
  });

  it("resolves a staff profile by auth_uid only (never by email)", async () => {
    const CONSULTANT = "22222222-2222-2222-2222-222222222222"; // Ayşe (seed)
    const before = await crm.getProfile(CONSULTANT);
    expect(before).not.toBeNull();
    // Pre-provision: an admin sets the staff member's auth_uid explicitly.
    const uid = randomUUID();
    await pool.query("update public.profiles set auth_uid = $1 where id = $2", [
      uid,
      CONSULTANT,
    ]);
    const resolved = await crm.getStaffProfileByAuthUid(uid, before!.email);
    expect(resolved?.id).toBe(CONSULTANT);
    expect(["admin", "consultant", "editor"]).toContain(resolved?.role);
    // SECURITY: an unknown auth_uid with a known staff email must NOT link —
    // otherwise an attacker who controls that email escalates to staff.
    const attacker = await crm.getStaffProfileByAuthUid(
      randomUUID(),
      before!.email,
    );
    expect(attacker).toBeNull();
  });

  it("does not link a student auth_uid onto a staff profile by email", async () => {
    const CONSULTANT = "22222222-2222-2222-2222-222222222222"; // Ayşe (seed)
    const before = await crm.getProfile(CONSULTANT);
    expect(before).not.toBeNull();
    // An attacker signs up under the consultant's email — must NOT bind to the
    // staff profile (role guard in upsertStudentByAuthUid) and must NOT create
    // a duplicate student profile under the staff email (unique constraint).
    const poisoned = await crm.upsertStudentByAuthUid({
      authUid: randomUUID(),
      email: before!.email,
      fullName: "Attacker",
    });
    expect(poisoned).toBeNull();
  });
});

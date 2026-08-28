// tests/unit/crm-repository.test.ts
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Pool } from 'pg';
import { createPgCrm } from '@/lib/crm/pg-repository';
import type { CrmRepository } from '@/lib/crm/repositories';

const url = process.env.DATABASE_URL!;
let pool: Pool;
let crm: CrmRepository;

// Use the study_crm db (seeded). Reset+seed before suite via `npm run db:reset`.

beforeEach(async () => {
  pool = new Pool({ connectionString: url, max: 3 });
  crm = createPgCrm(() => pool);
});

afterEach(async () => {
  await pool.end();
});

describe('PgCrmRepository', () => {
  it('lists staff (admin + consultants, not students)', async () => {
    const staff = await crm.listStaff();
    const roles = staff.map((s) => s.role).sort();
    expect(roles).toContain('admin');
    expect(roles).toContain('consultant');
    expect(roles).not.toContain('student');
  });

  it('lists leads and includes relations', async () => {
    const leads = await crm.listLeads();
    expect(leads.length).toBeGreaterThanOrEqual(10);
    expect(leads[0].student).not.toBeNull();
  });

  it('filters leads by status', async () => {
    const leads = await crm.listLeads({ status: 'new' });
    expect(leads.length).toBeGreaterThan(0);
    expect(leads.every((l) => l.status === 'new')).toBe(true);
  });

  it('updates lead status and writes audit', async () => {
    const before = await crm.listLeads({ status: 'new' });
    const target = before[0];
    const adminId = '11111111-1111-1111-1111-111111111111';
    await crm.updateLeadStatus(target.id, 'contacted', adminId);
    const after = await crm.getLead(target.id);
    expect(after?.status).toBe('contacted');
    const audit = await crm.listAudit({ entity: 'lead', userId: adminId });
    expect(audit.some((a) => a.entityId === target.id && a.action === 'lead.update_status')).toBe(true);
    // restore
    await crm.updateLeadStatus(target.id, 'new', adminId);
  });

  it('assigns a consultant', async () => {
    const leads = await crm.listLeads({ status: 'new' });
    const target = leads.find((l) => !l.assignedConsultantId) ?? leads[0];
    const consultantId = '22222222-2222-2222-2222-222222222222';
    const adminId = '11111111-1111-1111-1111-111111111111';
    const updated = await crm.assignConsultant(target.id, consultantId, adminId);
    expect(updated.assignedConsultantId).toBe(consultantId);
    // Restore so repeated runs stay idempotent.
    await crm.assignConsultant(target.id, null, adminId);
  });

  it('counts leads by status', async () => {
    const counts = await crm.countByStatus();
    expect(counts['new']).not.toBeUndefined();
    expect(typeof counts['new']).toBe('number');
  });

  it('gets lead detail with applications + timeline', async () => {
    const leads = await crm.listLeads({ status: 'application_submitted' });
    const lead = await crm.getLead(leads[0].id);
    expect(lead).not.toBeNull();
    expect(Array.isArray(lead!.applications)).toBe(true);
    expect(Array.isArray(lead!.timeline)).toBe(true);
  });
});

// src/components/admin/AssignConsultant.tsx
'use client';

import { assignConsultantAction, updateLeadStatusAction } from '@/app/actions/crm';
import { LEAD_PIPELINE, LEAD_STATUS_LABELS, type LeadStatus, type LeadStatusLabels, type Profile } from '@/types/crm';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function LeadActions({
  leadId,
  status,
  consultants,
  labels = LEAD_STATUS_LABELS,
}: {
  leadId: string;
  status: LeadStatus;
  consultants: Profile[];
  labels?: LeadStatusLabels;
}) {
  async function onStatus(value: string) {
    await updateLeadStatusAction({ leadId, status: value });
  }
  async function onAssign(value: string) {
    await assignConsultantAction({ leadId, consultantId: value === 'none' ? null : value });
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">
          Move to status
        </label>
        <Select defaultValue={status} onValueChange={onStatus}>
          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            {LEAD_PIPELINE.map((s) => (
              <SelectItem key={s} value={s}>{labels[s]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">
          Assigned consultant
        </label>
        <Select onValueChange={onAssign}>
          <SelectTrigger className="w-full"><SelectValue placeholder="Assign…" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Unassigned</SelectItem>
            {consultants.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.fullName}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

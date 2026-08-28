// src/components/admin/KanbanBoard.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { updateLeadStatusAction } from '@/app/actions/crm';
import { LEAD_PIPELINE, LEAD_STATUS_LABELS, type LeadStatus, type LeadStatusLabels, type LeadWithRelations } from '@/types/crm';
import { LeadStatusBadge } from './LeadStatusBadge';
import { cn } from '@/lib/utils';

export function KanbanBoard({
  leads,
  labels = LEAD_STATUS_LABELS,
}: {
  leads: LeadWithRelations[];
  labels?: LeadStatusLabels;
}) {
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<LeadStatus | null>(null);

  const grouped = LEAD_PIPELINE.reduce<Record<string, LeadWithRelations[]>>((acc, s) => {
    acc[s] = leads.filter((l) => l.status === s);
    return acc;
  }, {});

  async function drop(status: LeadStatus) {
    setDragOver(null);
    if (!dragId) return;
    const id = dragId;
    setDragId(null);
    await updateLeadStatusAction({ leadId: id, status });
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {LEAD_PIPELINE.map((status) => (
        <section
          key={status}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(status);
          }}
          onDragLeave={() => setDragOver((s) => (s === status ? null : s))}
          onDrop={() => drop(status)}
          className={cn(
            'flex w-72 shrink-0 flex-col rounded-lg border border-border bg-bg-subtle',
            dragOver === status && 'ring-2 ring-primary',
          )}
        >
          <header className="flex items-center justify-between px-3 py-2">
            <span className="text-sm font-semibold text-foreground">{labels[status]}</span>
            <span className="text-xs tabular-nums text-muted-foreground">{grouped[status].length}</span>
          </header>
          <div className="flex flex-1 flex-col gap-2 p-2">
            {grouped[status].map((lead) => (
              <Link
                key={lead.id}
                href={`/admin/leads/${lead.id}`}
                draggable
                onDragStart={() => setDragId(lead.id)}
                onDragEnd={() => setDragId(null)}
                className={cn(
                  'block rounded border border-border bg-card p-3 shadow-flat-plus transition hover:shadow-flat-hover',
                  dragId === lead.id && 'opacity-50',
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-medium text-foreground">
                    {lead.student?.fullName ?? 'Unknown'}
                  </span>
                </div>
                <p className="mt-1 truncate text-xs text-muted-foreground">{lead.universityId}</p>
                <div className="mt-2 flex items-center justify-between">
                  <LeadStatusBadge status={lead.status} labels={labels} />
                  <span className="text-xs text-muted-foreground">
                    {lead.consultant?.fullName ?? 'Unassigned'}
                  </span>
                </div>
              </Link>
            ))}
            {grouped[status].length === 0 && (
              <p className="px-1 py-4 text-center text-xs text-muted-foreground">Empty</p>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}

// src/app/admin/(dashboard)/leads/page.tsx
import Link from 'next/link';
import { crm } from '@/lib/crm';
import { getAdminT, leadStatusLabels } from '@/lib/admin-i18n';
import { KanbanBoard } from '@/components/admin/KanbanBoard';
import { LeadStatusBadge } from '@/components/admin/LeadStatusBadge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export const dynamic = 'force-dynamic';

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; status?: string }>;
}) {
  const sp = await searchParams;
  const view = sp.view === 'table' ? 'table' : 'kanban';
  const [{ t }, leads] = await Promise.all([
    getAdminT(),
    crm.listLeads(sp.status ? { status: sp.status as never } : undefined),
  ]);
  const labels = leadStatusLabels(t);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-headline-lg text-foreground">Leads (CRM)</h1>
          <p className="text-sm text-muted-foreground">{leads.length} leads</p>
        </div>
        <div className="flex gap-1 rounded border border-border bg-card p-1 text-sm">
          <Link
            href="/admin/leads?view=kanban"
            className="rounded px-3 py-1 data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
            data-active={view === 'kanban'}
          >
            Kanban
          </Link>
          <Link
            href="/admin/leads?view=table"
            className="rounded px-3 py-1 data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
            data-active={view === 'table'}
          >
            Table
          </Link>
        </div>
      </div>

      {view === 'kanban' ? (
        <KanbanBoard leads={leads} labels={labels} />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>University</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Consultant</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>
                  <Link href={`/admin/leads/${lead.id}`} className="font-medium text-primary hover:underline">
                    {lead.student?.fullName ?? 'Unknown'}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">{lead.universityId}</TableCell>
                <TableCell><LeadStatusBadge status={lead.status} labels={labels} /></TableCell>
                <TableCell className="text-muted-foreground">{lead.consultant?.fullName ?? '—'}</TableCell>
                <TableCell className="tabular-nums text-muted-foreground">
                  {new Date(lead.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

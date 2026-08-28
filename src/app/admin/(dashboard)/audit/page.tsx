// src/app/admin/(dashboard)/audit/page.tsx
import { crm } from '@/lib/crm';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export const dynamic = 'force-dynamic';

export default async function AuditPage() {
  const logs = await crm.listAudit({ limit: 100 });
  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-headline-lg text-foreground">Audit Log</h1>
        <p className="text-sm text-muted-foreground">Last 100 events</p>
      </div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>When</TableHead>
              <TableHead>Actor</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Entity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="tabular-nums text-muted-foreground">
                  {new Date(a.createdAt).toLocaleString()}
                </TableCell>
                <TableCell className="font-medium">{a.actorName ?? 'System'}</TableCell>
                <TableCell className="text-muted-foreground">{a.action}</TableCell>
                <TableCell className="text-muted-foreground">{a.entity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

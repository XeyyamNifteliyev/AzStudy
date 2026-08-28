// src/app/admin/(dashboard)/applications/[id]/page.tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { crm } from '@/lib/crm';
import { APPLICATION_STATUS_LABELS } from '@/types/crm';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export const dynamic = 'force-dynamic';

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const app = await crm.getApplication(id);
  if (!app) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href={`/admin/leads/${app.leadId}`} className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to lead
        </Link>
        <div className="mt-2 flex items-center gap-3">
          <h1 className="font-display text-headline-lg text-foreground">Application</h1>
          <Badge>{APPLICATION_STATUS_LABELS[app.status]}</Badge>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{app.universityId}</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Documents</CardTitle></CardHeader>
        <CardContent>
          {app.documents.length === 0 ? (
            <p className="text-sm text-muted-foreground">No documents uploaded.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Verified</TableHead>
                  <TableHead>Uploaded</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {app.documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <a href={doc.fileUrl} className="font-medium text-primary hover:underline">
                        {doc.fileName}
                      </a>
                    </TableCell>
                    <TableCell className="tabular-nums text-muted-foreground">
                      {doc.sizeBytes ? `${Math.round(doc.sizeBytes / 1024)} KB` : '—'}
                    </TableCell>
                    <TableCell>
                      {doc.verified ? <Badge variant="verified">Verified</Badge> : <Badge variant="outline">Pending</Badge>}
                    </TableCell>
                    <TableCell className="tabular-nums text-muted-foreground">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

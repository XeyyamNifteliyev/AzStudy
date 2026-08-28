import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { crm } from '@/lib/crm';
import { requireStudentAny } from '@/lib/crm/student-session';
import type { AppLocale } from '@/i18n/routing';
import { PipelineStepper } from '@/components/admin/PipelineStepper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const session = await requireStudentAny(locale as AppLocale);
  const t = await getTranslations({ locale, namespace: 'Student.detail' });
  const lead = await crm.getLead(id);
  if (!lead || lead.userId !== session.userId) notFound();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-headline-lg text-foreground">{lead.universityId}</h1>
      <PipelineStepper current={lead.status} />
      <Card>
        <CardHeader><CardTitle>{t('consultant')}</CardTitle></CardHeader>
        <CardContent><p className="text-sm">{lead.consultant?.fullName ?? '—'}</p></CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>{t('timeline')}</CardTitle></CardHeader>
        <CardContent>
          <ul className="divide-y divide-border">
            {lead.timeline.map((e) => (
              <li key={e.id} className="py-2 text-sm">
                <span className="font-medium text-foreground">{e.action}</span>{' '}
                <span className="text-muted-foreground">{new Date(e.createdAt).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

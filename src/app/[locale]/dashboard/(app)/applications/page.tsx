import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { crm } from '@/lib/crm';
import { requireStudentAny } from '@/lib/crm/student-session';
import type { AppLocale } from '@/i18n/routing';
import { LeadStatusBadge } from '@/components/admin/LeadStatusBadge';
import { Card, CardContent } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function ApplicationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await requireStudentAny(locale as AppLocale);
  const t = await getTranslations({ locale, namespace: 'Student.applications' });
  const leads = await crm.listMyLeads(session.userId);

  return (
    <div className="space-y-4">
      <h1 className="font-display text-headline-lg text-foreground">{t('title')}</h1>
      {leads.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t('empty')}</p>
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => (
            <Card key={lead.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div>
                  <p className="font-medium text-foreground">{lead.universityId}</p>
                  <p className="text-xs text-muted-foreground">{lead.consultant?.fullName ?? '—'}</p>
                </div>
                <div className="flex items-center gap-3">
                  <LeadStatusBadge status={lead.status} />
                  <Link href={`/${locale}/dashboard/applications/${lead.id}`} className="text-sm font-medium text-primary hover:underline">
                    {t('viewDetail')}
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

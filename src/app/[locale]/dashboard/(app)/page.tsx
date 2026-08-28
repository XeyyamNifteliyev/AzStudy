import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { crm } from '@/lib/crm';
import { requireStudentAny } from '@/lib/crm/student-session';
import { LEAD_STATUS_LABELS } from '@/types/crm';
import type { AppLocale } from '@/i18n/routing';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function StudentOverviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await requireStudentAny(locale as AppLocale);
  const t = await getTranslations({ locale, namespace: 'Student.overview' });

  const [leads, unread, notifications] = await Promise.all([
    crm.listMyLeads(session.userId),
    crm.unreadMessageCount(session.userId),
    crm.listNotifications(session.userId, 5),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-headline-lg text-foreground">{t('title')}</h1>
        <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">{t('applications')}</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-semibold tabular-nums">{leads.length}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">{t('unreadMessages')}</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-semibold tabular-nums">{unread}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">{t('status')}</CardTitle></CardHeader>
          <CardContent><p className="text-sm">{leads[0] ? LEAD_STATUS_LABELS[leads[0].status] : t('noApplications')}</p></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>{t('recentNotifications')}</CardTitle></CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('noApplications')}</p>
          ) : (
            <ul className="divide-y divide-border">
              {notifications.map((n) => (
                <li key={n.id} className="py-2 text-sm">
                  <span className="font-medium text-foreground">{n.type}</span>{' '}
                  <span className="text-muted-foreground">{new Date(n.createdAt).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
          <Link href={`/${locale}/dashboard/notifications`} className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
            {t('recentNotifications')} →
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

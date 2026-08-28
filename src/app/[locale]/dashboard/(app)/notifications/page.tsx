import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { crm } from '@/lib/crm';
import { requireStudentAny } from '@/lib/crm/student-session';
import type { AppLocale } from '@/i18n/routing';
import { Card, CardContent } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function NotificationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await requireStudentAny(locale as AppLocale);
  const t = await getTranslations({ locale, namespace: 'Student.notifications' });
  const notifications = await crm.listNotifications(session.userId, 30);

  return (
    <div className="space-y-4">
      <h1 className="font-display text-headline-lg text-foreground">{t('title')}</h1>
      {notifications.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t('empty')}</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => {
            const label =
              n.type === 'message'
                ? t('message', { name: String((n.metadata as { senderName?: string }).senderName ?? '') })
                : n.type === 'assigned'
                  ? t('assigned')
                  : t('statusChange');
            return (
              <Card key={n.id}>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-foreground">{label}</p>
                    <span className="text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleString()}</span>
                  </div>
                  {n.leadId && (
                    <Link href={`/${locale}/dashboard/applications/${n.leadId}`} className="text-xs text-primary hover:underline">
                      {t('viewDetail')}
                    </Link>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

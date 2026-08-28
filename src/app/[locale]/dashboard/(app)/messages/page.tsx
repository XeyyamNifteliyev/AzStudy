import { getTranslations } from 'next-intl/server';
import { crm } from '@/lib/crm';
import { requireStudentAny } from '@/lib/crm/student-session';
import { markThreadReadAction } from '@/app/actions/student';
import type { AppLocale } from '@/i18n/routing';
import { MessageComposer } from '@/components/student/MessageComposer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function MessagesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await requireStudentAny(locale as AppLocale);
  const t = await getTranslations({ locale, namespace: 'Student.messages' });

  const leads = await crm.listMyLeads(session.userId);
  const lead = leads[0];
  if (!lead) {
    return (
      <div className="space-y-4">
        <h1 className="font-display text-headline-lg text-foreground">{t('title')}</h1>
        <p className="text-sm text-muted-foreground">{t('empty')}</p>
      </div>
    );
  }

  const messages = await crm.listMessages(lead.id);
  await markThreadReadAction(lead.id).catch(() => {});

  return (
    <div className="space-y-6">
      <h1 className="font-display text-headline-lg text-foreground">{t('title')}</h1>
      <Card>
        <CardHeader><CardTitle>{lead.consultant?.fullName ?? t('consultant')}</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {messages.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('empty')}</p>
          ) : (
            <ul className="space-y-2">
              {messages.map((m) => {
                const mine = m.senderId === session.userId;
                return (
                  <li key={m.id} className={cn('max-w-[80%] rounded-lg border border-border p-3 text-sm', mine ? 'ml-auto bg-primary/5' : 'bg-card')}>
                    <p className="mb-1 text-xs text-muted-foreground">{mine ? t('you') : m.senderName}</p>
                    <p className="text-foreground">{m.body}</p>
                  </li>
                );
              })}
            </ul>
          )}
          <MessageComposer leadId={lead.id} />
        </CardContent>
      </Card>
    </div>
  );
}

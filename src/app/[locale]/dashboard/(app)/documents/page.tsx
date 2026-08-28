import { getTranslations } from 'next-intl/server';
import { crm } from '@/lib/crm';
import { requireStudentAny } from '@/lib/crm/student-session';
import { getSignedDocumentUrl } from '@/lib/storage';
import type { AppLocale } from '@/i18n/routing';
import { DocumentUploadForm } from '@/components/student/DocumentUploadForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const dynamic = 'force-dynamic';

export default async function DocumentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await requireStudentAny(locale as AppLocale);
  const t = await getTranslations({ locale, namespace: 'Student.documents' });

  const [docs, apps] = await Promise.all([
    crm.listMyDocuments(session.userId),
    crm.listMyApplications(session.userId),
  ]);

  const items = await Promise.all(
    docs.map(async (d) => {
      const url = await getSignedDocumentUrl(d.fileUrl).catch(() => null);
      return (
        <Card key={d.id}>
          <CardContent className="flex items-center justify-between py-4">
            <div>
              <p className="font-medium text-foreground">{d.fileName}</p>
              <p className="text-xs text-muted-foreground">{new Date(d.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={d.verified ? 'default' : 'secondary'}>
                {d.verified ? t('verified') : t('pending')}
              </Badge>
              {url && <a href={url} download className="text-sm font-medium text-primary hover:underline">{t('download')}</a>}
            </div>
          </CardContent>
        </Card>
      );
    }),
  );

  return (
    <div className="space-y-6">
      <h1 className="font-display text-headline-lg text-foreground">{t('title')}</h1>
      <Card>
        <CardHeader><CardTitle>{t('upload')}</CardTitle></CardHeader>
        <CardContent><DocumentUploadForm applications={apps} /></CardContent>
      </Card>
      <div className="space-y-3">
        {docs.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('empty')}</p>
        ) : (
          items
        )}
      </div>
    </div>
  );
}

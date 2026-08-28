// src/app/admin/(dashboard)/page.tsx
import Link from 'next/link';
import { crm } from '@/lib/crm';
import { getAdminT } from '@/lib/admin-i18n';
import { LEAD_PIPELINE } from '@/types/crm';
import { KpiCard } from '@/components/admin/KpiCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function AdminOverviewPage() {
  const { t } = await getAdminT();
  const [leads, counts, audit] = await Promise.all([
    crm.listLeads(),
    crm.countByStatus(),
    crm.listAudit({ limit: 8 }),
  ]);

  const newCount = counts['new'] ?? 0;
  const unassigned = leads.filter((l) => !l.assignedConsultantId).length;
  const active = LEAD_PIPELINE.filter((s) => s !== 'completed').reduce(
    (sum, s) => sum + (counts[s] ?? 0),
    0,
  );
  const completed = counts['completed'] ?? 0;
  const conversion = active + completed > 0 ? Math.round((completed / (active + completed)) * 100) : 0;
  const maxCount = Math.max(1, ...LEAD_PIPELINE.map((s) => counts[s] ?? 0));

  const statusLabels: Record<string, string> = {
    new: t('status.new'),
    contacted: t('status.contacted'),
    document_collection: t('status.document_collection'),
    application_submitted: t('status.application_submitted'),
    offer_received: t('status.offer_received'),
    accepted: t('status.accepted'),
    visa_processing: t('status.visa_processing'),
    arrived: t('status.arrived'),
    completed: t('status.completed'),
    lost: t('status.lost'),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-headline-lg text-foreground">{t('overview.title')}</h1>
        <p className="text-sm text-muted-foreground">{t('overview.subtitle')}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label={t('overview.totalLeads')} value={leads.length} tone="default" />
        <KpiCard label={t('overview.new')} value={newCount} tone="tertiary" />
        <KpiCard label={t('overview.unassigned')} value={unassigned} tone="cta" hint={t('overview.unassigned.hint')} />
        <KpiCard label={t('overview.conversion')} value={`${conversion}%`} tone="verified" hint={t('overview.conversion.hint')} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('overview.pipeline')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {LEAD_PIPELINE.map((status) => {
            const c = counts[status] ?? 0;
            return (
              <div key={status} className="flex items-center gap-3">
                <span className="w-40 shrink-0 text-sm text-muted-foreground">
                  {statusLabels[status] ?? status}
                </span>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(c / maxCount) * 100}%` }}
                  />
                </div>
                <span className="w-8 text-right text-sm font-semibold tabular-nums">{c}</span>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('overview.recentActivity')}</CardTitle>
        </CardHeader>
        <CardContent>
          {audit.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('overview.noActivity')}</p>
          ) : (
            <ul className="divide-y divide-border">
              {audit.map((a) => (
                <li key={a.id} className="flex items-center justify-between py-2 text-sm">
                  <span>
                    <span className="font-medium text-foreground">{a.actorName ?? 'System'}</span>{' '}
                    <span className="text-muted-foreground">{a.action}</span>
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(a.createdAt).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <Link href="/admin/applications" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
            {t('overview.viewApplications')}
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

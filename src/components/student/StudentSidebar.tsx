import Link from 'next/link';
import { LayoutDashboard, FileText, MessageSquare, Bell, GraduationCap } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export async function StudentSidebar({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'Student.nav' });
  const items = [
    { href: `/${locale}/dashboard`, icon: LayoutDashboard, label: t('overview') },
    { href: `/${locale}/dashboard/applications`, icon: GraduationCap, label: t('applications') },
    { href: `/${locale}/dashboard/documents`, icon: FileText, label: t('documents') },
    { href: `/${locale}/dashboard/messages`, icon: MessageSquare, label: t('messages') },
    { href: `/${locale}/dashboard/notifications`, icon: Bell, label: t('notifications') },
  ];
  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-card lg:block">
      <nav className="space-y-1 p-4">
        {items.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-bg-subtle hover:text-foreground"
          >
            <it.icon className="h-4 w-4" />
            {it.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

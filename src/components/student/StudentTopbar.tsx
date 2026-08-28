import { getTranslations } from 'next-intl/server';
import { signOutStudent } from '@/app/actions/student-auth';
import type { StudentSession } from '@/lib/crm/student-session';

export async function StudentTopbar({
  session,
  locale,
}: {
  session: StudentSession;
  locale: string;
}) {
  const t = await getTranslations({ locale, namespace: 'Student.nav' });
  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 lg:px-6">
      <div className="text-sm font-semibold text-foreground">{session.profile.fullName}</div>
      <form action={signOutStudent.bind(null, locale)}>
        <button type="submit" className="text-sm text-muted-foreground hover:text-foreground">
          {t('logout')}
        </button>
      </form>
    </header>
  );
}

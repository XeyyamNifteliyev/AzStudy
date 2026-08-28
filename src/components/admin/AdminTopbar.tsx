// src/components/admin/AdminTopbar.tsx
import { setAdminLocale } from '@/components/admin/LanguageSwitcher';
import { signOutAdmin } from '@/app/actions/admin-auth';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config/site';
import type { AdminSession } from '@/lib/crm/session';
import type { AdminLocale } from '@/lib/admin-i18n';

export function AdminTopbar({ session, locale }: { session: AdminSession; locale: AdminLocale }) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4 lg:px-6">
      <p className="font-display text-sm font-semibold text-foreground">
        {siteConfig.name} Admin
      </p>
      <div className="flex items-center gap-3">
        <div className="flex gap-1 rounded border border-border bg-background p-0.5 text-xs">
          {(['az', 'en'] as const).map((l) => (
            <form key={l} action={setAdminLocale}>
              <input type="hidden" name="locale" value={l} />
              <button
                type="submit"
                className={
                  'rounded px-2 py-0.5 font-semibold uppercase transition-colors ' +
                  (locale === l
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground')
                }
              >
                {l}
              </button>
            </form>
          ))}
        </div>
        <span className="text-sm text-muted-foreground">{session.fullName}</span>
        <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold uppercase text-secondary-foreground">
          {session.role}
        </span>
        <form action={signOutAdmin}>
          <Button type="submit" variant="ghost" size="sm">
            Sign out
          </Button>
        </form>
      </div>
    </header>
  );
}

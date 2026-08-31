import { getTranslations } from 'next-intl/server';
import { data } from '@/lib/data';
import { formatNumber } from '@/lib/utils';
import type { AppLocale } from '@/i18n/routing';
import { FadeIn } from '@/components/motion/fade-in';
import { Building2, BookOpen, Globe, Users } from 'lucide-react';

interface StatsSectionProps {
  locale: AppLocale;
}

export async function StatsSection({ locale }: StatsSectionProps) {
  const t = await getTranslations('HomePage.stats');
  const [universities, programs, countries] = await Promise.all([
    data.universities.list(),
    data.programs.list(),
    data.countries.list(),
  ]);
  const studentsPlaced = universities.reduce(
    (acc, u) => acc + u.studentCount,
    0,
  );

  const stats = [
    { value: universities.length, suffix: '+', label: t('universities'), icon: Building2 },
    { value: programs.length, suffix: '+', label: t('programs'), icon: BookOpen },
    { value: countries.length, suffix: '+', label: t('countries'), icon: Globe },
    { value: studentsPlaced, suffix: '', label: t('students'), icon: Users },
  ];

  return (
    <section className="border-y border-border/60 bg-card">
      <FadeIn className="container-page grid grid-cols-2 gap-x-6 gap-y-10 py-16 md:grid-cols-4 md:py-20">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className={
                'group flex flex-col items-center text-center md:border-s md:border-border/60 md:ps-6 ' +
                (i === 0 ? 'md:border-s-0 md:ps-0' : '')
              }
            >
              <span className="mb-3 inline-flex rounded-full bg-accent p-2.5 text-primary transition-transform duration-300 ease-fluid group-hover:scale-105">
                <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
              </span>
              <p className="font-display text-4xl font-bold tabular-nums tracking-tight text-foreground sm:text-[2.75rem]">
                {formatNumber(s.value, locale)}
                {s.suffix}
              </p>
              <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {s.label}
              </p>
            </div>
          );
        })}
      </FadeIn>
    </section>
  );
}

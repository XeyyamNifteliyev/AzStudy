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
    { value: universities.length, suffix: '+', label: t('universities'), icon: Building2, gradient: 'from-primary/10 to-primary/5' },
    { value: programs.length, suffix: '+', label: t('programs'), icon: BookOpen, gradient: 'from-cta/10 to-cta/5' },
    { value: countries.length, suffix: '+', label: t('countries'), icon: Globe, gradient: 'from-emerald-500/10 to-emerald-500/5' },
    { value: studentsPlaced, suffix: '', label: t('students'), icon: Users, gradient: 'from-violet-500/10 to-violet-500/5' },
  ];

  return (
    <section className="border-b border-border bg-card">
      <FadeIn className="container-page grid grid-cols-2 gap-4 py-12 md:grid-cols-4 md:gap-6">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-flat-hover">
              <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
              <div className="relative">
                <div className={`mx-auto mb-3 inline-flex rounded-xl bg-gradient-to-br ${s.gradient} p-3`}>
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <p className="font-display text-3xl font-bold text-foreground sm:text-4xl tabular-nums">
                  {formatNumber(s.value, locale)}
                  {s.suffix}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
              </div>
            </div>
          );
        })}
      </FadeIn>
    </section>
  );
}

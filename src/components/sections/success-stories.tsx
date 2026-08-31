import { getTranslations } from 'next-intl/server';
import { Star, BadgeCheck } from 'lucide-react';
import { data } from '@/lib/data';
import type { AppLocale } from '@/i18n/routing';
import { lx } from '@/lib/i18n/lx';
import { FadeIn } from '@/components/motion/fade-in';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

interface SuccessStoriesProps {
  locale: AppLocale;
}

export async function SuccessStories({ locale }: SuccessStoriesProps) {
  const t = await getTranslations('HomePage.stories');
  // Single query (reviews.list) + in-memory dedupe by university — avoids the
  // old N+1 (one byUniversity query per university) and guarantees 6 stories
  // regardless of which universities happen to sit at the top of the list.
  const all = await data.reviews.list();
  const seen = new Set<string>();
  const reviews = all
    .filter((r) => (seen.has(r.universityId) ? false : seen.add(r.universityId)))
    .slice(0, 6);

  if (!reviews.length) return null;

  return (
    <section className="section-padding bg-surface-low">
      <FadeIn className="container-page">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="font-display text-sm font-semibold uppercase tracking-wide text-cta">
            {t('eyebrow')}
          </p>
          <h2 className="mt-2 font-display text-headline-xl text-foreground">
            {t('title')}
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <Card key={review.id} className="transition-shadow duration-300 ease-fluid hover:shadow-flat-hover">
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={
                        i < review.rating
                          ? 'h-4 w-4 fill-cta text-cta'
                          : 'h-4 w-4 text-border'
                      }
                    />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-foreground">
                  “{lx(review.text, locale)}”
                </p>
                <div className="flex items-center gap-3 border-t border-border pt-4">
                  <Avatar>
                    <AvatarFallback>{review.authorInitials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="flex items-center gap-1 text-sm font-semibold text-foreground">
                      {review.authorName}
                      {review.verified && (
                        <BadgeCheck className="h-4 w-4 text-verified" />
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {review.authorCountry} · {lx(review.programStudied, locale)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </FadeIn>
    </section>
  );
}

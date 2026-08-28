import { getTranslations } from 'next-intl/server';
import { HelpCircle } from 'lucide-react';
import { data } from '@/lib/data';
import type { AppLocale } from '@/i18n/routing';
import { FadeIn } from '@/components/motion/fade-in';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { JsonLd } from '@/components/seo/json-ld';
import { faqPageJsonLd } from '@/lib/seo/json-ld';

interface FaqSectionProps {
  locale: AppLocale;
  items?: Awaited<ReturnType<typeof data.faqs.general>>;
}

export async function FaqSection({ locale, items }: FaqSectionProps) {
  const t = await getTranslations('HomePage.faq');
  const faqs = items ?? (await data.faqs.general());

  return (
    <section className="section-padding">
      <FadeIn className="container-page grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="font-display text-sm font-semibold uppercase tracking-wide text-cta">
            {t('eyebrow')}
          </p>
          <h2 className="mt-2 font-display text-headline-xl text-foreground">
            {t('title')}
          </h2>
          <p className="mt-3 flex items-start gap-2 text-muted-foreground">
            <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            {t('subtitle')}
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger>{faq.question[locale]}</AccordionTrigger>
              <AccordionContent>{faq.answer[locale]}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </FadeIn>

      <JsonLd data={faqPageJsonLd(faqs, locale)} />
    </section>
  );
}

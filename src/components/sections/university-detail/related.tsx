import type { AppLocale } from "@/i18n/routing";
import type { University } from "@/types";
import type { UniversityListingMetadata } from "@/lib/data/repositories";
import { UniversityCard } from "@/components/sections/university-card";
import { Section } from "./section";

export function RelatedUniversities({
  title,
  locale,
  universities,
  listingMetadata,
}: {
  title: string;
  locale: AppLocale;
  universities: University[];
  listingMetadata: ReadonlyMap<string, UniversityListingMetadata>;
}) {
  if (universities.length === 0) return null;
  return (
    <Section title={title}>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {universities.map((u) => (
          <UniversityCard
            key={u.id}
            university={u}
            locale={locale}
            listingMetadata={listingMetadata.get(u.id)}
          />
        ))}
      </div>
    </Section>
  );
}

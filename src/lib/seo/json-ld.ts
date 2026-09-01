import { siteConfig } from "@/config/site";
import { lx } from "@/lib/i18n/lx";
import type {
  BlogPost,
  Faq,
  Review as UniversityReview,
  UniversityDetail,
} from "@/types";
import type { AppLocale } from "@/i18n/routing";

type JsonLd = Record<string, unknown>;

/** Brand logo as a schema.org ImageObject with explicit dimensions. */
const LOGO_IMAGE = {
  "@type": "ImageObject",
  url: `${siteConfig.url}/icon.svg`,
  width: 512,
  height: 512,
} as const;

function L(key: string, value: unknown) {
  return { "@type": key, ...((value as object) ?? {}) };
}

export function organizationJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: LOGO_IMAGE,
    description: siteConfig.description.en,
    sameAs: Object.values(siteConfig.social),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: siteConfig.contact.email,
      telephone: siteConfig.contact.phone,
      availableLanguage: ["English", "Azerbaijani", "Russian", "Turkish"],
    },
  };
}

export function websiteJsonLd(locale: AppLocale): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/${locale}/#website`,
    name: siteConfig.name,
    url: `${siteConfig.url}/${locale}`,
    inLanguage: locale,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/${locale}/universities?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    publisher: { "@type": "Organization", name: siteConfig.name },
  };
}

export function collegeOrUniversityJsonLd(
  university: UniversityDetail,
  locale: AppLocale,
  // Rating is intentionally unused: Google's structured-data guidelines
  // prohibit self-serving aggregate ratings (the site rates itself), which
  // risks a manual action. Kept in the signature so callers don't have to
  // change; remove when a third-party source (e.g. Trustpilot) is wired up.
  _rating: { rating: number; count: number },
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": ["CollegeOrUniversity", "EducationalOrganization"],
    "@id": `${siteConfig.url}/${locale}/universities/${university.slug}#collegeoruniversity`,
    name: lx(university.nameI18n, locale),
    url: `${siteConfig.url}/${locale}/universities/${university.slug}`,
    image: university.heroImage,
    logo: LOGO_IMAGE,
    foundingDate: String(university.foundedYear),
    award: university.accreditation,
    description: university.description[locale],
    inLanguage: university.languages,
    // SE-10: use the university's own city when available; fall back to the
    // site-level address only as a last resort.
    address: {
      "@type": "PostalAddress",
      addressCountry: "AZ",
      addressLocality:
        university.city?.name[locale] ??
        (siteConfig.contact.address as Record<string, string>)[locale] ??
        siteConfig.contact.address.en,
    },
    telephone: siteConfig.contact.phone,
  };
}

export function faqPageJsonLd(
  faqs: Faq[],
  locale: AppLocale,
  pageUrl?: string,
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    ...(pageUrl ? { "@id": `${pageUrl}#faq` } : {}),
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question[locale] ?? f.question.en,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer[locale] ?? f.answer.en,
      },
    })),
  };
}

export function articleJsonLd(post: BlogPost, locale: AppLocale): JsonLd {
  const url = `${siteConfig.url}/${locale}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: post.title[locale],
    description: post.excerpt[locale],
    image: {
      "@type": "ImageObject",
      url: post.coverImage,
      width: 1200,
      height: 630,
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    mainEntityOfPage: url,
    // AEO: Person author with URL for E-E-A-T; Google's Rich Results
    // guide recommends Person (not Organization) for article authors.
    author: {
      "@type": "Person",
      name: post.author,
      url: `${siteConfig.url}/${locale}/about`,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: LOGO_IMAGE,
    },
    inLanguage: locale,
  };
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; url: string }>,
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    ...(items[0] ? { "@id": `${items[items.length - 1].url}#breadcrumb` } : {}),
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function courseListJsonLd(
  items: Array<{ name: string; url: string; fee: number }>,
  pageUrl?: string,
): JsonLd {
  // S4: drop zero-price rows — a 0-fee Course in structured data is a
  // data-quality signal to Google.
  const priced = items.filter((i) => i.fee > 0);
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    ...(pageUrl ? { "@id": `${pageUrl}#programs` } : {}),
    itemListElement: priced.map((item, i) =>
      L("ListItem", {
        position: i + 1,
        item: {
          "@type": "Course",
          name: item.name,
          url: item.url,
          provider: { "@type": "Organization", name: siteConfig.name },
          offers: { "@type": "Offer", price: item.fee, priceCurrency: "USD" },
        },
      }),
    ),
  };
}

/**
 * Generic ItemList of universities — for the universities listing page and
 * any page that shows a ranked/curated set of universities.
 */
export function itemListJsonLd(
  items: Array<{ name: string; url: string; description?: string }>,
  pageUrl?: string,
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    ...(pageUrl ? { "@id": `${pageUrl}#universities` } : {}),
    itemListElement: items.map((item, i) =>
      L("ListItem", {
        position: i + 1,
        item: {
          "@type": "CollegeOrUniversity",
          name: item.name,
          url: item.url,
          ...(item.description ? { description: item.description } : {}),
        },
      }),
    ),
  };
}

/**
 * ItemList of universities with side-by-side comparison facts — for the
 * /compare page. Comparison content is the most-cited content type in AI
 * answers, so every row the page displays (name, city, tuition, ranking,
 * founding year, student count) is emitted as structured data an AI engine
 * can extract without parsing the interactive table.
 */
export interface ComparisonItem {
  name: string;
  url: string;
  city?: string;
  tuitionUSD?: number;
  ranking?: number;
  foundedYear?: number;
  studentCount?: number;
  isState?: boolean;
}

export function comparisonJsonLd(
  items: ComparisonItem[],
  pageUrl: string,
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${pageUrl}#comparison`,
    name: "Azerbaijani universities compared",
    itemListElement: items.map((item, i) =>
      L("ListItem", {
        position: i + 1,
        item: {
          "@type": "CollegeOrUniversity",
          name: item.name,
          url: item.url,
          ...(item.city
            ? {
                address: {
                  "@type": "PostalAddress",
                  addressLocality: item.city,
                  addressCountry: "AZ",
                },
              }
            : {}),
          // Real tuition from the listing metadata — the same number the page
          // displays, so the structured data never invents facts.
          ...(item.tuitionUSD
            ? {
                offers: {
                  "@type": "Offer",
                  price: item.tuitionUSD,
                  priceCurrency: "USD",
                },
              }
            : {}),
          ...(item.ranking ? { ranking: item.ranking } : {}),
          ...(item.foundedYear
            ? { foundingDate: String(item.foundedYear) }
            : {}),
          ...(item.studentCount ? { numberOfStudents: item.studentCount } : {}),
        },
      }),
    ),
  };
}

/**
 * HowTo schema — step-by-step guide (e.g. "How to apply to a Turkish university").
 * AEO core: Google AI Overview sources HowTo schemas for answer extraction.
 */
export function howToJsonLd(
  steps: Array<{ name: string; text: string }>,
  opts?: { name?: string; description?: string; pageUrl?: string },
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    ...(opts?.pageUrl ? { "@id": `${opts.pageUrl}#howto` } : {}),
    name: opts?.name ?? "How to study in Azerbaijan",
    description: opts?.description ?? "",
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

/**
 * Individual Review schema — emitted alongside AggregateRating on university
 * detail pages so review snippets appear in search results.
 */
export function reviewJsonLd(
  reviews: UniversityReview[],
  locale: AppLocale,
  universitySlug: string,
): JsonLd[] {
  return reviews.map((r) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "CollegeOrUniversity",
      name: universitySlug,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: r.rating,
      bestRating: 5,
      worstRating: 1,
    },
    author: { "@type": "Person", name: r.authorName },
    reviewBody: r.text[locale],
    datePublished: String(r.year),
  }));
}

/**
 * AboutPage schema — for the /about route.
 */
export function aboutPageJsonLd(locale: AppLocale): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: `About ${siteConfig.name}`,
    url: `${siteConfig.url}/${locale}/about`,
    mainEntity: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      description: siteConfig.description.en,
    },
  };
}

/**
 * ContactPage schema — for the /contact route.
 */
export function contactPageJsonLd(locale: AppLocale): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    url: `${siteConfig.url}/${locale}/contact`,
    mainEntity: {
      "@type": "Organization",
      name: siteConfig.name,
      email: siteConfig.contact.email,
      telephone: siteConfig.contact.phone,
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: siteConfig.contact.email,
        telephone: siteConfig.contact.phone,
        availableLanguage: ["English", "Azerbaijani", "Russian", "Turkish"],
      },
    },
  };
}

/**
 * CollectionPage schema — for listing/index pages (blog list, universities list).
 */
export function collectionPageJsonLd(
  name: string,
  url: string,
  items: Array<{ name: string; url: string }>,
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    url,
    hasPart: items.map((item) => ({
      "@type": "WebPage",
      name: item.name,
      url: item.url,
    })),
  };
}

/**
 * Service schema — for the /apply page (free consultation/application support).
 */
export function serviceJsonLd(locale: AppLocale): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "University Application Support",
    serviceType: "Education consulting",
    provider: { "@type": "Organization", name: siteConfig.name },
    areaServed: "AZ",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free application support and consultation",
    },
    url: `${siteConfig.url}/${locale}/apply`,
  };
}

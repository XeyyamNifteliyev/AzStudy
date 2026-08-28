import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";

// PERF: only ship the namespaces client components actually use (useTranslations
// calls verified across src/). Everything else (Meta, Geo, CountryHub, …) is
// consumed server-side via getTranslations, which reads the full request-scoped
// messages — not this provider. Keeping them out of the provider shrinks the
// RSC payload serialized to the browser on every page.
const CLIENT_NAMESPACES = [
  "Auth",
  "Student",
  "Chatbot",
  "Common",
  "Nav",
  "Apply",
  "HomePage",
  "Compare",
  "Search",
  "Errors",
  "UniversitiesPage",
] as const;

function pickClientMessages(
  messages: AbstractIntlMessages,
): AbstractIntlMessages {
  return Object.fromEntries(
    CLIENT_NAMESPACES.map((ns) => [ns, messages[ns]]).filter(
      ([, value]) => value != null,
    ),
  );
}
import { routing, isRtl, isLocale, type AppLocale } from "@/i18n/routing";
import { siteConfig, isIncompleteLocale } from "@/config/site";
import { JsonLd } from "@/components/seo/json-ld";
import { Analytics } from "@/components/seo/analytics";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/json-ld";
import "../globals.css";

// PERF: single font family — Geist is the brand font for both body (font-sans)
// and headings (font-display). Inter is intentionally not loaded; see
// tailwind.config.ts fontFamily.

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });

  return {
    title: {
      default: t("title"),
      template: `%s | ${siteConfig.name}`,
    },
    description: t("description"),
    metadataBase: new URL(siteConfig.url),
    alternates: {
      types: {
        "application/rss+xml": [
          { title: "AzStudy Blog RSS", url: `${siteConfig.url}/rss.xml` },
        ],
      },
    },
    // A locale flagged as incomplete (see INCOMPLETE_LOCALES in config/site.ts)
    // renders if visited directly but stays noindex so thin translations are
    // not flagged by search engines. Currently the set is empty — all 18
    // locales ship complete message files.
    ...(isIncompleteLocale(locale)
      ? { robots: { index: false, follow: false } }
      : {}),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();
  const clientMessages = pickClientMessages(messages);
  const tCommon = await getTranslations({ locale, namespace: "Common" });
  const direction = isRtl(locale) ? "rtl" : "ltr";
  const appLocale = locale as AppLocale;

  return (
    <html
      lang={locale}
      dir={direction}
      className={GeistSans.variable}
      suppressHydrationWarning
    >
      <body>
        {/* PERF: preconnect to cross-origin analytics/tag hosts so the DNS/TLS
            handshake overlaps with first paint instead of serializing. */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.clarity.ms" />
        <JsonLd data={[organizationJsonLd(), websiteJsonLd(appLocale)]} />
        <NextIntlClientProvider messages={clientMessages}>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-flat-hover"
          >
            {tCommon("skipToContent")}
          </a>
          {children}
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}

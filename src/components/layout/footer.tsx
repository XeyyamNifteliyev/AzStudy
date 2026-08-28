import { getLocale, getTranslations } from "next-intl/server";
import {
  GraduationCap,
  Instagram,
  Youtube,
  Send,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/config/site";
import { data } from "@/lib/data";

// Country-landing pages (/study-in-azerbaijan-from/{slug}) are high-intent SEO
// funnels. They are in the sitemap but had zero internal links (orphans) —
// surface the top student-origin countries in the footer so every page links
// to them and crawlers/AI can follow the funnel.
const TOP_COUNTRY_SLUGS = [
  "azerbaijan",
  "uzbekistan",
  "kazakhstan",
  "turkmenistan",
  "kyrgyzstan",
  "russia",
  "iran",
  "iraq",
  "pakistan",
  "nigeria",
  "germany",
  "france",
  "united-kingdom",
  "bulgaria",
  "greece",
];

const studentLinks = [
  { key: "universities", href: "/universities" },
  { key: "programs", href: "/programs" },
  { key: "apply", href: "/apply" },
  { key: "blog", href: "/blog" },
] as const;

export async function Footer() {
  const t = await getTranslations("Footer");
  const tNav = await getTranslations("Nav");
  const locale = await getLocale();
  const year = new Date().getFullYear();

  // Localized country names from the data layer, in the curated priority order.
  const countries = await data.countries.list();
  const bySlug = new Map(countries.map((c) => [c.slug, c]));
  const countryLinks = TOP_COUNTRY_SLUGS.map((slug) => bySlug.get(slug)).filter(
    (c): c is NonNullable<typeof c> => Boolean(c),
  );

  return (
    <footer className="mt-section-lg border-t border-border bg-card">
      <div className="container-page grid gap-10 py-section-md md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Link
            href="/"
            className="flex items-center gap-2 font-display text-lg font-bold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" aria-hidden />
            </span>
            {siteConfig.name}
          </Link>
          <p className="max-w-xs text-sm text-muted-foreground">
            {t("tagline")}
          </p>
          <div className="flex items-center gap-3">
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-muted-foreground transition-colors duration-200 hover:text-pink-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href={siteConfig.social.youtube}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="text-muted-foreground transition-colors duration-200 hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <Youtube className="h-5 w-5" />
            </a>
            <a
              href={siteConfig.social.telegram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram"
              className="text-muted-foreground transition-colors duration-200 hover:text-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <Send className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {t("quickLinks")}
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link
                href="/about"
                className="text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                {tNav("about")}
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                {tNav("contact")}
              </Link>
            </li>
            <li>
              <Link
                href="/compare"
                className="text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                {tNav("compare")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {t("forStudents")}
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {studentLinks.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className="text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  {tNav(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {t("contact")}
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="flex items-center gap-2 text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <Mail className="h-4 w-4 text-muted-foreground" aria-hidden />
                {siteConfig.contact.email}
              </a>
            </li>
            <li>
              <a
                href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-2 text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <Phone className="h-4 w-4 text-muted-foreground" aria-hidden />
                {siteConfig.contact.phone}
              </a>
            </li>
            <li className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" aria-hidden />
              {t("address")}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-page py-6">
          <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {t("studyFrom")}
          </h3>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {countryLinks.map((c) => (
              <li key={c.slug}>              <Link
                href={`/study-in-azerbaijan-from/${c.slug}`}
                  className="text-foreground transition-colors duration-200 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  {(c.name as Record<string, string>)[locale] ??
                    (c.name as Record<string, string>).en}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/study-in-azerbaijan-from"
                className="font-semibold text-primary transition-colors duration-200 hover:text-cta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                {t("viewAllCountries")} →
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name}. {t("rights")}
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <Link
              href="/privacy"
              className="hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              {t("privacy")}
            </Link>
            <Link
              href="/terms"
              className="hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              {t("terms")}
            </Link>
            <p className="max-w-md sm:text-right">{t("disclaimer")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

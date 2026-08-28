import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

// Localized 404 for every route under /[locale] (unknown URLs, unknown
// university/blog/country slugs). Renders inside the [locale] root layout so
// it returns a proper 404 (a layout-less global not-found made every 404 a
// 500). Non-locale 404s use src/app/(root)/not-found.tsx.
export default function LocaleNotFound() {
  const t = useTranslations("NotFound");

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-surface-low px-8 text-center">
      <p className="font-display text-6xl font-bold text-primary">404</p>
      <h1 className="mt-4 font-display text-headline-md text-foreground">
        {t("title")}
      </h1>
      <p className="mt-3 max-w-md text-body-md text-muted-foreground">
        {t("body")}
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-lg bg-cta px-6 py-3 font-semibold text-cta-foreground shadow-flat-plus transition-colors hover:bg-cta/90"
      >
        {t("home")}
      </Link>
    </div>
  );
}

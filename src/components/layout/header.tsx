import { getTranslations } from "next-intl/server";
import { GraduationCap } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/config/site";
import { LocaleSwitcher } from "./locale-switcher";
import { HeaderSearch } from "./header-search";
// F2: Interactive parts (mobile menu, auth, drawer) are split into a client
// component so the static parts (logo, desktop nav, apply button) render as
// Server Components — no client JS for the static shell.
import { HeaderInteractive } from "./header-interactive";

const navItems = [
  { key: "universities", href: "/universities" },
  { key: "programs", href: "/programs" },
  { key: "compare", href: "/compare" },
  { key: "about", href: "/about" },
  { key: "blog", href: "/blog" },
  { key: "contact", href: "/contact" },
] as const;

export async function Header() {
  const t = await getTranslations("Nav");

  return (
    // Fluid Island Nav (skill §5A): detached floating glass pill, not a
    // glued edge-to-edge bar. backdrop-blur is allowed here (sticky element).
    <header className="sticky top-3 z-40 px-3 sm:px-5">
      <div className="container-page">
        <div className="flex h-14 items-center justify-between gap-3 rounded-full bg-card/80 ps-4 pe-2 shadow-ambient ring-1 ring-foreground/[0.06] backdrop-blur-xl">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-display text-lg font-bold text-primary"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-flat-plus">
              <GraduationCap className="h-5 w-5" aria-hidden />
            </span>
            <span>{siteConfig.name}</span>
          </Link>

          <nav className="hidden items-center gap-0.5 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors duration-300 ease-fluid hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            {/* Site search — icon expands into an input (2026-08-17 spec);
                sits next to the locale switcher on every breakpoint. */}
            <HeaderSearch />
            {/* Locale switcher always visible in the header bar — on mobile it
                sits next to the hamburger (not inside the menu), on desktop
                next to the auth control. */}
            <LocaleSwitcher />
            {/* F2: Only this part ships client JS */}
            <HeaderInteractive />
          </div>
        </div>
      </div>
    </header>
  );
}

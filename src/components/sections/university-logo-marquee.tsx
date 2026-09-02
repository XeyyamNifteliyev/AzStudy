import type { CSSProperties } from "react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { data } from "@/lib/data";
import { lx } from "@/lib/i18n/lx";
import { isSvgUrl } from "@/lib/images/is-svg";
import type { AppLocale } from "@/i18n/routing";

interface UniversityLogoMarqueeProps {
  locale: AppLocale;
}

/**
 * Logo strip: all university logos with an image scroll
 * infinitely (LTR). The track is rendered twice and translated by -50% so the
 * loop is seamless. `prefers-reduced-motion` is respected via globals.css.
 */
export async function UniversityLogoMarquee({
  locale,
}: UniversityLogoMarqueeProps) {
  const t = await getTranslations({ locale, namespace: "HomePage.featured" });

  const all = await data.universities.list();
  const withLogo = all.filter((u): u is typeof u & { logoImage: string } =>
    Boolean(u.logoImage),
  );

  // All universities now have real logos from sec.az — show all of them
  const filtered = withLogo;

  if (filtered.length === 0) return null;

  return (
    <section className="bg-surface-low pb-4 md:pb-6">
      <div className="container-page">
        <p className="mb-4 text-center font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {t("trustedBy")}
        </p>
        <div
          className="relative overflow-hidden rounded-2xl border border-border-low py-2.5 md:py-4"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 20%, black 80%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 20%, black 80%, transparent)",
          }}
        >
          <ul
            className="flex w-max min-w-full shrink-0 flex-nowrap items-center gap-6 md:gap-10 animate-marquee"
            style={{ "--marquee-duration": "80s" } as CSSProperties}
          >
            {[...filtered, ...filtered].map((u, i) => (
              <li
                key={`${u.slug}-${i}`}
                className="relative flex h-16 w-32 shrink-0 items-center justify-center rounded-lg border border-border-low bg-white px-3 py-2 shadow-sm md:h-20 md:w-40 md:px-4 md:py-3"
              >
                <Image
                  src={u.logoImage}
                  alt={`${lx(u.nameI18n, locale)} logo`}
                  width={160}
                  height={80}
                  // PERF/BUG: marquee items move via a GPU-composited transform —
                  // the lazy-loader's IntersectionObserver never fires during the
                  // animation, leaving logos blank until a mouse move/scroll
                  // forces an IO pass. Eager + low fetch priority loads them
                  // immediately without competing with the LCP.
                  loading="eager"
                  fetchPriority="low"
                  decoding="async"
                  unoptimized={isSvgUrl(u.logoImage)}
                  className="h-10 w-auto max-w-full object-contain md:h-12"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

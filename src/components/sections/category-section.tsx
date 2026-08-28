import { getTranslations } from "next-intl/server";
import {
  Stethoscope,
  Cog,
  Code2,
  Briefcase,
  Scale,
  Compass,
  Smile,
  Palette,
  Users,
  HeartPulse,
  Atom,
  BookOpen,
  Radio,
  MapPin,
  Leaf,
  ArrowRight,
} from "lucide-react";
import { data } from "@/lib/data";
import { seedUniversityPrograms } from "@/lib/seed";
import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { FadeIn } from "@/components/motion/fade-in";
import { formatCurrency } from "@/lib/utils";

const iconMap = {
  stethoscope: Stethoscope,
  cog: Cog,
  code: Code2,
  briefcase: Briefcase,
  scale: Scale,
  compass: Compass,
  smile: Smile,
  palette: Palette,
  users: Users,
  "heart-pulse": HeartPulse,
  atom: Atom,
  "book-open": BookOpen,
  radio: Radio,
  "map-pin": MapPin,
  leaf: Leaf,
} as const;

// Distinct premium gradients for each category icon tile — rotated per index
// so adjacent cards never repeat the same color.
const TILE_GRADIENTS = [
  "from-sky-500 to-blue-600",
  "from-emerald-500 to-teal-600",
  "from-violet-500 to-purple-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-cyan-500 to-sky-600",
  "from-fuchsia-500 to-pink-600",
  "from-lime-500 to-green-600",
  "from-indigo-500 to-blue-600",
  "from-red-500 to-rose-600",
  "from-teal-500 to-emerald-600",
  "from-orange-500 to-amber-600",
  "from-purple-500 to-violet-600",
  "from-blue-500 to-indigo-600",
  "from-green-500 to-emerald-600",
];

interface CategorySectionProps {
  locale: AppLocale;
}

// Fallback minimum fees (USD) for categories whose programs have no USD
// price in the seed data — keeps every card visually consistent.
const FALLBACK_MIN_FEE: Record<string, number> = {
  "social-sciences": 1500,
  "natural-sciences": 1800,
  communication: 2000,
  medicine: 1000,
  engineering: 800,
  "computer-science": 800,
  business: 800,
  law: 1200,
  architecture: 1500,
  dentistry: 2500,
  arts: 1000,
  "health-sciences": 1500,
  humanities: 1000,
  tourism: 1000,
  agriculture: 800,
};

export async function CategorySection({ locale }: CategorySectionProps) {
  const t = await getTranslations("HomePage.categories");
  const [categories, programs] = await Promise.all([
    data.programs.getCategories(),
    data.programs.list(),
  ]);

  const programById = new Map(programs.map((p) => [p.id, p]));
  const minFeeByCategory: Record<string, number> = {};
  for (const up of seedUniversityPrograms) {
    if (up.currency !== "USD") continue;
    const p = programById.get(up.programId);
    if (!p) continue;
    const cur = minFeeByCategory[p.categorySlug];
    if (cur === undefined || up.tuitionFee < cur)
      minFeeByCategory[p.categorySlug] = up.tuitionFee;
  }
  // Fill categories that have no computed price with the fallback.
  for (const [slug, fee] of Object.entries(FALLBACK_MIN_FEE)) {
    if (minFeeByCategory[slug] === undefined) minFeeByCategory[slug] = fee;
  }

  return (
    <section className="section-padding relative overflow-hidden">
      {/* Soft ambient glow behind the grid for a modern, premium feel. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-primary/5 to-transparent"
      />
      <FadeIn className="container-page relative">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-wide text-cta">
              {t("eyebrow")}
            </p>
            <h2 className="mt-2 font-display text-headline-xl text-foreground">
              {t("title")}
            </h2>
          </div>
          <Link
            href="/programs"
            className="group inline-flex items-center gap-1 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-primary shadow-flat-plus transition-all hover:border-primary/40 hover:shadow-flat-hover"
          >
            {t("viewAll")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {categories.map((cat, idx) => {
            const Icon = iconMap[cat.icon as keyof typeof iconMap] ?? Code2;
            const count = programs.filter(
              (p) => p.categorySlug === cat.slug,
            ).length;
            const minFee = minFeeByCategory[cat.slug];
            const gradient = TILE_GRADIENTS[idx % TILE_GRADIENTS.length];

            return (
              <Link
                key={cat.slug}
                href={`/programs/${cat.slug}`}
                className="group relative flex flex-col items-center overflow-hidden rounded-2xl border border-border bg-card p-5 text-center shadow-flat-plus transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-flat-hover"
              >
                {/* Gradient glow that fades in on hover. */}
                <div
                  aria-hidden
                  className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-[0.06]`}
                />

                {/* Ghost index number behind the icon for depth. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -top-1 end-2 font-display text-4xl font-bold text-foreground/5 transition-colors duration-300 group-hover:text-foreground/10"
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>

                <div
                  className={`relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
                >
                  <Icon className="h-7 w-7" />
                </div>

                <h3 className="relative mt-4 font-display text-base font-semibold leading-snug text-foreground">
                  {cat.name[locale]}
                </h3>
                <p className="relative mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {count} {count === 1 ? t("program") : t("programs")}
                </p>
                <p className="relative mt-3 inline-flex items-center gap-1 rounded-full bg-surface-low px-2.5 py-1 text-xs font-semibold text-foreground">
                  {t("from")} {minFee != null ? formatCurrency(minFee, "USD", locale) : "—"}
                </p>
              </Link>
            );
          })}
        </div>
      </FadeIn>
    </section>
  );
}

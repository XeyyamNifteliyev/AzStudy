import Image from "next/image";
import { MapPin, BadgeCheck, Star } from "lucide-react";
import type { City, University } from "@/types";
import type { AppLocale } from "@/i18n/routing";
import { cn, formatCurrency } from "@/lib/utils";
import { isSvgUrl } from "@/lib/images/is-svg";
import { lx } from "@/lib/i18n/lx";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface UniversityCardLabels {
  verified: string;
  state: string;
  private: string;
  azerbaijan: string;
  from: string;
  tuition: string;
  rank: string;
  founded: string;
}

export const DEFAULT_CARD_LABELS: UniversityCardLabels = {
  verified: "Ministry",
  state: "State",
  private: "Private",
  azerbaijan: "Azerbaijan",
  from: "from",
  tuition: "Tuition",
  rank: "Rank",
  founded: "Founded",
};

export interface UniversityCardViewProps {
  university: University;
  locale: AppLocale;
  priority?: boolean;
  /** Resolved city (from listing metadata) — falls back to a generic label. */
  city: City | null;
  minTuition?: number;
  /** List price — when > minTuition, render it strikethrough next to the fee. */
  originalFee?: number;
  rating: number;
  count: number;
  labels?: UniversityCardLabels;
  footer?: React.ReactNode;
}

/**
 * Pure presentational university card. No data fetching, no server-only
 * imports — safe to render from both server components and client components
 * (the Phase 2 explorer). Callers resolve `city`/tuition/rating from listing
 * metadata before rendering.
 */
export function UniversityCardView({
  university,
  locale,
  priority,
  city,
  minTuition,
  originalFee,
  rating,
  count,
  labels = DEFAULT_CARD_LABELS,
  footer,
}: UniversityCardViewProps) {
  return (
    <Link
      href={`/universities/${university.slug}`}
      className="group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <Card className="overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-flat-hover">
        <div className="relative aspect-[16/9] overflow-hidden bg-surface-low">            <Image
              src={university.heroImage}
              alt={lx(university.nameI18n, locale) || university.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              priority={priority}
            />
          <div className="absolute end-3 top-3">
            <Badge
              variant="verified"
              className="gap-1 bg-card/90 backdrop-blur"
            >
              <BadgeCheck className="h-3.5 w-3.5" />
              {labels.verified}
            </Badge>
          </div>
          <div className="absolute start-3 top-3 flex h-10 w-10 items-center justify-center overflow-hidden rounded-md bg-card/90 backdrop-blur">
            {university.logoImage ? (
              <Image
                src={university.logoImage}
                alt={`${lx(university.nameI18n, locale) || university.name} logo`}
                width={40}
                height={40}
                unoptimized={isSvgUrl(university.logoImage)}
                className="object-contain"
              />
            ) : (
              <span className="font-display text-sm font-bold text-primary">
                {university.logoText}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2.5 p-3.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-base font-semibold leading-snug text-foreground transition-colors duration-200 group-hover:text-primary">
              {lx(university.nameI18n, locale) || university.name}
            </h3>
            <Badge variant={university.isState ? "tertiary" : "cta"}>
              {university.isState ? labels.state : labels.private}
            </Badge>
          </div>

          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" aria-hidden />
            {city?.name[locale] ?? labels.azerbaijan}
          </p>

          {count > 0 && (
            <p className="flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 fill-cta text-cta" aria-hidden />
              <span className="font-semibold tabular-nums">
                {rating.toFixed(1)}
              </span>
              <span className="text-muted-foreground">({count})</span>
            </p>
          )}

          <div className="grid grid-cols-3 gap-2 border-t border-border pt-3 text-center">
            <Stat
              label={labels.tuition}
              value={
                minTuition
                  ? `${labels.from} ${formatCurrency(minTuition, "USD", locale)}`
                  : "—"
              }
              sub={
                originalFee && minTuition && originalFee > minTuition
                  ? formatCurrency(originalFee, "USD", locale)
                  : undefined
              }
            />
            <Stat label={labels.rank} value={`#${university.ranking}`} />
            <Stat
              label={labels.founded}
              value={String(university.foundedYear)}
            />
          </div>

          {footer}
        </div>
      </Card>
    </Link>
  );
}

function Stat({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className={cn("space-y-0.5")}>
      <div className="truncate text-xs font-semibold text-foreground">
        {value}
        {sub && (
          <span className="ms-1 text-xs font-normal text-muted-foreground line-through">
            {sub}
          </span>
        )}
      </div>
      <div className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

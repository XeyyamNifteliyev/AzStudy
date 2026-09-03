import Image from "next/image";
import { MapPin, BadgeCheck, Star } from "lucide-react";
import type { AppLocale } from "@/i18n/routing";
import { cn, formatCurrency } from "@/lib/utils";
import { isSvgUrl } from "@/lib/images/is-svg";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { UniversityCardVM } from "@/lib/universities/view-model";

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
  /** Projected per-locale view-model — see view-model.ts (PERF §6.1). */
  vm: UniversityCardVM;
  /** Request locale — needed for currency formatting only. */
  locale: AppLocale;
  priority?: boolean;
  labels?: UniversityCardLabels;
  footer?: React.ReactNode;
}

/**
 * Pure presentational university card rendered from the projected view-model.
 * No data fetching, no locale resolution at render time — the server passes
 * only the fields this card draws, keeping the RSC payload minimal.
 */
export function UniversityCardView({
  vm,
  locale,
  priority,
  labels = DEFAULT_CARD_LABELS,
  footer,
}: UniversityCardViewProps) {
  const displayName = vm.localName || vm.name;
  return (
    <Link
      href={`/universities/${vm.slug}`}
      className="group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <Card className="overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-flat-hover">
        <div className="relative aspect-[16/9] overflow-hidden bg-surface-low">
          {" "}
          <Image
            src={vm.heroImage}
            alt={displayName}
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
            {vm.logoImage ? (
              <Image
                src={vm.logoImage}
                alt={`${displayName} logo`}
                width={40}
                height={40}
                unoptimized={isSvgUrl(vm.logoImage)}
                className="object-contain"
              />
            ) : (
              <span className="font-display text-sm font-bold text-primary">
                {vm.logoText}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2.5 p-3.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-base font-semibold leading-snug text-foreground transition-colors duration-200 group-hover:text-primary">
              {displayName}
            </h3>
            <Badge variant={vm.isState ? "tertiary" : "cta"}>
              {vm.isState ? labels.state : labels.private}
            </Badge>
          </div>

          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" aria-hidden />
            {vm.cityName ?? labels.azerbaijan}
          </p>

          {vm.count > 0 && (
            <p className="flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 fill-cta text-cta" aria-hidden />
              <span className="font-semibold tabular-nums">
                {vm.rating.toFixed(1)}
              </span>
              <span className="text-muted-foreground">({vm.count})</span>
            </p>
          )}

          <div className="grid grid-cols-3 gap-2 border-t border-border pt-3 text-center">
            <Stat
              label={labels.tuition}
              value={
                vm.minTuitionUSD
                  ? `${labels.from} ${formatCurrency(vm.minTuitionUSD, "USD", locale)}`
                  : "—"
              }
              sub={
                vm.originalFeeUSD &&
                vm.minTuitionUSD &&
                vm.originalFeeUSD > vm.minTuitionUSD
                  ? formatCurrency(vm.originalFeeUSD, "USD", locale)
                  : undefined
              }
            />
            <Stat label={labels.rank} value={`#${vm.ranking}`} />
            <Stat label={labels.founded} value={String(vm.foundedYear)} />
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

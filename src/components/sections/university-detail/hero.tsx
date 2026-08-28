import Image from "next/image";
import { MapPin, Star, BadgeCheck } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { isSvgUrl } from "@/lib/images/is-svg";

export interface HeroProps {
  name: string;
  heroImage: string;
  logoImage?: string;
  logoText?: string;
  isState: boolean;
  accreditation: string;
  cityName?: string;
  rating: { rating: number; count: number };
  typeState: string;
  typePrivate: string;
  reviewsLabel: string;
  homeLabel: string;
  universitiesLabel: string;
}

export function UniversityHero({
  name,
  heroImage,
  logoImage,
  logoText,
  isState,
  accreditation,
  cityName,
  rating,
  typeState,
  typePrivate,
  reviewsLabel,
  homeLabel,
  universitiesLabel,
}: HeroProps) {
  return (
    <section className="relative">
      <div className="relative h-[320px] w-full overflow-hidden bg-surface-dim sm:h-[420px]">
        <Image
          src={heroImage}
          alt={name}
          fill
          priority
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSIxNCIgdmlld0JveD0iMCAwIDQwIDE0Ij48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTNlOGY4Ii8+PC9zdmc+"
          sizes="(max-width: 768px) 100vw, 1200px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/40 to-foreground/10" />
      </div>
      <div className="container-page relative -mt-28 pb-8">
        <div className="flex flex-wrap items-center gap-2 text-xs text-white/80">
          <Link href="/" className="hover:underline">
            {homeLabel}
          </Link>
          <span>/</span>
          <Link href="/universities" className="hover:underline">
            {universitiesLabel}
          </Link>
        </div>
        <div className="mt-3 flex items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-card shadow-flat-plus sm:h-20 sm:w-20">
            {logoImage ? (
              <Image
                src={logoImage}
                alt={`${name} logo`}
                width={80}
                height={80}
                unoptimized={isSvgUrl(logoImage)}
                className="object-contain"
              />
            ) : (
              <span className="font-display text-xl font-bold text-primary">
                {logoText}
              </span>
            )}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={isState ? "tertiary" : "cta"}>
                {isState ? typeState : typePrivate}
              </Badge>
              <Badge variant="verified" className="gap-1">
                <BadgeCheck className="h-3.5 w-3.5" /> {accreditation}
              </Badge>
            </div>
            <h1 className="mt-2 font-display text-2xl font-bold text-white sm:text-4xl">
              {name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-white/90">
              {cityName && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> {cityName}
                </span>
              )}
              {rating.count > 0 && (
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-cta text-cta" />
                  <span className="font-semibold">
                    {rating.rating.toFixed(1)}
                  </span>
                  <span className="text-white/70">
                    ({rating.count} {reviewsLabel})
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

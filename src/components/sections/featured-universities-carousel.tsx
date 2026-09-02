"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Calendar,
  MapPin,
  Star,
  Users,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { lx } from "@/lib/i18n/lx";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatNumber } from "@/lib/utils";

export interface FeaturedUniversityCardData {
  id: string;
  slug: string;
  name: string;
  nameI18n?: Record<string, string>;
  logoText: string;
  heroImage: string;
  cityName: string;
  rating: number;
  reviewCount: number;
  foundedYear: number;
  studentCount: number;
  isState: boolean;
}

interface FeaturedUniversitiesCarouselProps {
  cards: FeaturedUniversityCardData[];
  labels: {
    applyNow: string;
    state: string;
    private: string;
    verified: string;
    prev: string;
    next: string;
    azerbaijan: string;
    students: string;
  };
}

/** How many cards fit per page at each container width. */
const PAGE_BREAKPOINTS = [
  { min: 1024, perPage: 5 },
  { min: 768, perPage: 4 },
  { min: 640, perPage: 2 },
  { min: 0, perPage: 1 },
];

const TRACK_GAP = 16; // gap-4

/**
 * "Popular Universities" carousel. Each card is a full-width
 * image with name/location/rating overlaid and an "Apply Now" button below.
 * Cards are fluid (exactly `perPage` fit the viewport — no half card visible)
 * and every click on the arrows moves the track by exactly one card.
 */
export function FeaturedUniversitiesCarousel({
  cards,
  labels,
}: FeaturedUniversitiesCarouselProps) {
  const locale = useLocale();
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);
  const [perPage, setPerPage] = useState(5);
  const [cardWidth, setCardWidth] = useState(240);
  const total = Math.max(1, cards.length);
  const cardStep = cardWidth + TRACK_GAP;
  const trackCards = [...cards, ...cards, ...cards];
  // Virtual card index into a track that repeats the cards 3x. We always start
  // in the middle copy so prev/next can scroll in either direction endlessly
  // — at the edges we snap back to the middle copy without a
  // visible jump, because both positions show the same cards.
  const [vp, setVp] = useState(() => total);

  const go = useCallback((next: number) => setVp(next), []);

  // Measure the viewport to decide how many cards fit and their fluid width.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const compute = () => {
      const match = PAGE_BREAKPOINTS.find((b) => el.clientWidth >= b.min);
      const per = match ? match.perPage : 1;
      setPerPage(per);
      setCardWidth((el.clientWidth - (per - 1) * TRACK_GAP) / per);
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Re-center on the middle copy when the layout changes (resize).
  useEffect(() => {
    setVp(total);
    el_scrollTo(trackRef.current, total * cardStep, false);
  }, [total, perPage, cardWidth, cardStep]);

  // Slide the track; at either edge, invisibly snap back to the middle copy.
  useEffect(() => {
    if (vp >= 2 * total) {
      el_scrollTo(trackRef.current, total * cardStep, false);
      setVp(total);
    } else if (vp < total) {
      el_scrollTo(trackRef.current, (2 * total - 1) * cardStep, false);
      setVp(2 * total - 1);
    } else {
      el_scrollTo(trackRef.current, vp * cardStep, true);
    }
  }, [vp, total, cardStep]);

  return (
    <div className="relative">
      {/* Infinite loop: arrows never disable; left always moves left, right
          always moves right (no teleport between first/last). */}
      {total > 1 && (
        <>
          <div className="absolute -start-6 top-1/2 z-30 hidden -translate-y-1/2 lg:flex">
            <ArrowButton onClick={() => go(vp - 1)} ariaLabel={labels.prev}>
              <ArrowLeft className="h-5 w-5" />
            </ArrowButton>
          </div>
          <div className="absolute -end-6 top-1/2 z-30 hidden -translate-y-1/2 lg:flex">
            <ArrowButton onClick={() => go(vp + 1)} ariaLabel={labels.next}>
              <ArrowRight className="h-5 w-5" />
            </ArrowButton>
          </div>
        </>
      )}

      <div ref={viewportRef} className="relative overflow-hidden px-1">
        <div
          ref={trackRef}
          className="flex touch-pan-y gap-4 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onPointerDown={(e) => {
            touchX.current = e.clientX;
          }}
          onPointerUp={(e) => {
            if (touchX.current == null) return;
            const dx = e.clientX - touchX.current;
            if (Math.abs(dx) > 48) go(vp + (dx < 0 ? 1 : -1));
            touchX.current = null;
          }}
          onPointerCancel={() => {
            touchX.current = null;
          }}
          onPointerLeave={() => {
            touchX.current = null;
          }}
        >
          {trackCards.map((card, i) => (
            <div
              key={`${card.id}-${i}`}
              className="shrink-0 snap-start"
              style={{ width: cardWidth }}
            >
              <CarouselCard
                card={card}
                labels={labels}
                priority={i < perPage}
                locale={locale}
              />
            </div>
          ))}
        </div>
      </div>

      {total > 1 && (
        <div className="mt-5 flex items-center justify-center gap-2">
          {Array.from({ length: total }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => go(total + i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === vp % total}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === vp % total
                  ? "w-6 bg-primary"
                  : "w-2 bg-border hover:bg-muted-foreground/40",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CarouselCard({
  card,
  labels,
  priority,
  locale,
}: {
  card: FeaturedUniversityCardData;
  labels: FeaturedUniversitiesCarouselProps["labels"];
  priority: boolean;
  locale: string;
}) {
  return (
    <article className="flex w-full flex-col gap-2">
      <Link
        href={`/universities/${card.slug}`}
        aria-label={lx(card.nameI18n, locale) || card.name}
        className="group relative block aspect-[4/3] w-full overflow-hidden rounded-lg transition-transform duration-300 ease-out hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <Image
          src={card.heroImage}
          alt={lx(card.nameI18n, locale) || card.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
          priority={priority}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

        <Badge
          variant="verified"
          className="absolute start-2 top-2 gap-1 bg-card/90 backdrop-blur"
        >
          <BadgeCheck className="h-3.5 w-3.5" />
          {labels.verified}
        </Badge>

        <div className="absolute inset-x-0 bottom-0 rounded-lg p-3">
          <h3 className="line-clamp-2 text-base font-medium text-white">
            {lx(card.nameI18n, locale) || card.name}
          </h3>
          <p className="line-clamp-2 text-sm text-white/80">
            <MapPin className="me-1 inline h-3.5 w-3.5" aria-hidden />
            {card.cityName}, {labels.azerbaijan}
          </p>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="flex items-center gap-1 text-xs font-medium text-white">
              <Star className="h-3.5 w-3.5 fill-cta text-cta" aria-hidden />
              {card.reviewCount > 0 ? card.rating.toFixed(1) : "—"}
            </span>
            {card.reviewCount > 0 && (
              <span className="text-xs text-white/80">
                ({card.reviewCount})
              </span>
            )}
            <span className="ms-auto">
              <Badge
                variant={card.isState ? "secondary" : "cta"}
                className="text-xs"
              >
                {card.isState ? labels.state : labels.private}
              </Badge>
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm font-medium text-white/80">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" aria-hidden />
              {card.foundedYear}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" aria-hidden />
              {formatNumber(card.studentCount, "en")}+
            </span>
          </div>
        </div>
      </Link>

      <Button asChild variant="cta" className="w-full">
        <Link href={`/apply?university=${card.slug}`}>{labels.applyNow}</Link>
      </Button>
    </article>
  );
}

/** Immediate (non-smooth) scroll to a pixel offset — used for edge re-centering. */
function el_scrollTo(el: HTMLDivElement | null, left: number, smooth: boolean) {
  if (el) el.scrollTo({ left, behavior: smooth ? "smooth" : "auto" });
}

function ArrowButton({
  children,
  onClick,
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-flat-plus transition-colors hover:bg-accent"
    >
      {children}
    </button>
  );
}

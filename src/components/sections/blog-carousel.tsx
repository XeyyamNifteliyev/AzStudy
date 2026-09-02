"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AppLocale } from "@/i18n/routing";
import { lx } from "@/lib/i18n/lx";

export interface BlogCarouselItem {
  id: string;
  slug: string;
  title: Record<string, string>;
  excerpt: Record<string, string>;
  category: Record<string, string>;
  coverImage: string;
  readingMinutes: number;
}

interface BlogCarouselProps {
  items: BlogCarouselItem[];
  locale: AppLocale;
  labels: {
    readMore: string;
    prev: string;
    next: string;
  };
}

/** How many cards fit per page at each container width. */
const BLOG_PAGE_BREAKPOINTS = [
  { min: 1024, perPage: 5 },
  { min: 768, perPage: 2 },
  { min: 0, perPage: 1 },
];

const TRACK_GAP = 16; // gap-4

/**
 * Directional infinite blog carousel: cards repeat 3x, arrows
 * never disable and always scroll in their direction; the edge snap-back to
 * the middle copy is invisible. Cards are fluid (exactly `perPage` fit the
 * viewport — no half card visible) and every click moves by one card.
 */
export function BlogCarousel({ items, locale, labels }: BlogCarouselProps) {
  // minRead is an ICU message (`{min} min read`) — read it here with the
  // variable provided. The server-side section previously called
  // `t("minRead")` without `{ min }`, which threw a FORMATTING_ERROR on every
  // homepage render.
  const tBlog = useTranslations("HomePage.blog");
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);
  const [perPage, setPerPage] = useState(5);
  const [cardWidth, setCardWidth] = useState(230);
  const total = Math.max(1, items.length);
  const cardStep = cardWidth + TRACK_GAP;
  const trackItems = [...items, ...items, ...items];
  const [vp, setVp] = useState(() => total);

  const go = useCallback((next: number) => setVp(next), []);

  // Measure the viewport to decide how many cards fit and their fluid width.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const compute = () => {
      const match = BLOG_PAGE_BREAKPOINTS.find((b) => el.clientWidth >= b.min);
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
    elScrollTo(trackRef.current, total * cardStep, false);
  }, [total, perPage, cardWidth, cardStep]);

  // Slide the track; at either edge, invisibly snap back to the middle copy.
  useEffect(() => {
    if (vp >= 2 * total) {
      elScrollTo(trackRef.current, total * cardStep, false);
      setVp(total);
    } else if (vp < total) {
      elScrollTo(trackRef.current, (2 * total - 1) * cardStep, false);
      setVp(2 * total - 1);
    } else {
      elScrollTo(trackRef.current, vp * cardStep, true);
    }
  }, [vp, total, cardStep]);

  return (
    <div className="relative">
      {total > 1 && (
        <>
          <div className="absolute -start-5 top-1/2 z-30 hidden -translate-y-1/2 lg:flex">
            <button
              type="button"
              onClick={() => go(vp - 1)}
              aria-label={labels.prev}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-flat-plus transition-colors hover:bg-accent"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          </div>
          <div className="absolute -end-5 top-1/2 z-30 hidden -translate-y-1/2 lg:flex">
            <button
              type="button"
              onClick={() => go(vp + 1)}
              aria-label={labels.next}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-flat-plus transition-colors hover:bg-accent"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </>
      )}

      <div ref={viewportRef} className="relative overflow-hidden">
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
          {trackItems.map((item, i) => (
            <div
              key={`${item.id}-${i}`}
              className="shrink-0"
              style={{ width: cardWidth }}
            >
              <Link href={`/blog/${item.slug}`} className="group block h-full">
                <Card className="h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-flat-hover">
                  <div className="relative aspect-[16/9] overflow-hidden bg-surface-low">
                    <Image
                      src={item.coverImage}
                      alt={lx(item.title, locale)}
                      fill
                      sizes="(max-width: 768px) 90vw, 240px"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>
                  <CardContent className="space-y-2.5 p-4">
                    <Badge variant="tertiary">
                      {lx(item.category, locale)}
                    </Badge>
                    <h3 className="line-clamp-2 font-display text-base font-semibold leading-snug text-foreground transition-colors duration-200 group-hover:text-primary">
                      {lx(item.title, locale)}
                    </h3>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {lx(item.excerpt, locale)}
                    </p>
                    <div className="flex items-center gap-1 pt-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {tBlog("minRead", { min: item.readingMinutes })}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function elScrollTo(el: HTMLDivElement | null, left: number, smooth: boolean) {
  if (el) el.scrollTo({ left, behavior: smooth ? "smooth" : "auto" });
}

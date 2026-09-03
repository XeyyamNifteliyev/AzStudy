"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Search, SearchX, ArrowRight } from "lucide-react";
import { universityHeroImages } from "@/lib/seed/university-images";
import { Link } from "@/i18n/navigation";
import { lx } from "@/lib/i18n/lx";
import {
  useSearchSuggest,
  searchHitRoute,
  type SearchHit,
} from "@/lib/hooks/use-search-suggest";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const SEARCH_LIMIT = 12;

/**
 * Live search page: as the user types, an autocomplete
 * dropdown mirrors the hero search (keyboard-navigable suggestions under the
 * input), and full results appear below grouped into Universities (hero-image
 * cards), Programs (list) and Cities (chips), each with a "View All" link.
 * Empty queries show nothing; no matches show a friendly empty state.
 */
export function SearchClient({ initialQuery }: { initialQuery: string }) {
  const t = useTranslations("Search");
  const locale = useLocale();
  const boxRef = useRef<HTMLDivElement>(null);
  const {
    query,
    setQuery,
    hits,
    open,
    setOpen,
    activeIndex,
    setActiveIndex,
    onInputKeyDown,
    enterHit,
  } = useSearchSuggest({ limit: SEARCH_LIMIT });

  // Seed the live query from the URL ?q= on first mount.
  useEffect(() => {
    if (initialQuery) setQuery(initialQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close the autocomplete dropdown when clicking outside.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [setOpen]);

  const q = query.trim();
  const universities = hits.filter((h) => h.type === "university");
  const programs = hits.filter((h) => h.type === "program");
  const cities = hits.filter((h) => h.type === "city");

  function hitLabel(hit: SearchHit) {
    if (hit.nameI18n) return lx(hit.nameI18n, locale) || hit.label;
    return hit.label;
  }

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      const hit = enterHit();
      if (hit) window.location.href = searchHitRoute(hit);
      return;
    }
    onInputKeyDown(e);
  }

  return (
    <div className="container-page py-section-md">
      <header className="mb-8">
        <h1 className="font-display text-headline-xl text-foreground">
          {t("title")}
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">{t("subtitle")}</p>
      </header>

      {/* Search box — autocomplete dropdown under the input (hero-style) +
          live results appear below as you type */}
      <div className="relative mx-auto max-w-2xl" ref={boxRef}>
        <Search className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKey}
          onFocus={() => hits.length && setOpen(true)}
          placeholder={t("placeholder")}
          aria-label={t("placeholder")}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls="search-suggest-listbox"
          aria-activedescendant={
            open && hits.length ? `search-option-${activeIndex}` : undefined
          }
          className="h-14 w-full rounded-2xl border border-border bg-card ps-12 pe-32 text-base shadow-flat-plus focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <span className="pointer-events-none absolute end-5 top-1/2 hidden -translate-y-1/2 text-sm text-muted-foreground sm:block">
          {t("search")}
        </span>

        {/* Autocomplete dropdown — mirrors the hero search (same hook,
            same keyboard model: ↑/↓ move, Enter opens, Esc closes). */}
        {open && hits.length > 0 && (
          <ul
            id="search-suggest-listbox"
            role="listbox"
            className="absolute z-40 mt-1 w-full overflow-hidden rounded-xl border border-border bg-card shadow-flat-hover"
          >
            {hits.map((h, i) => (
              <li
                key={`${h.type}-${h.id}`}
                id={`search-option-${i}`}
                role="option"
                aria-selected={i === activeIndex}
              >
                <button
                  type="button"
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => {
                    setOpen(false);
                    window.location.href = searchHitRoute(h);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm",
                    i === activeIndex ? "bg-surface-low" : "",
                  )}
                >
                  <span className="truncate font-medium text-foreground">
                    {hitLabel(h)}
                  </span>
                  <span className="shrink-0 text-xs uppercase text-muted-foreground">
                    {h.type}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Live results */}
      {q.length >= 2 && (
        <div className="mt-10 space-y-10">
          <p className="text-sm text-muted-foreground">
            {t("results", { count: hits.length, query: q })}
          </p>

          {hits.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
              <SearchX className="h-12 w-12 text-muted-foreground" />
              <h2 className="mt-4 font-display text-headline-md text-foreground">
                {t("emptyTitle")}
              </h2>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                {t("emptySubtitle")}
              </p>
              <Button asChild variant="outline" className="mt-6">
                <Link href="/universities">{t("viewAllUniversities")}</Link>
              </Button>
            </div>
          ) : (
            <>
              {/* Universities */}
              {universities.length > 0 && (
                <section>
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <h2 className="font-display text-headline-md text-foreground">
                      {t("universities")}
                    </h2>
                    <Link
                      href="/universities"
                      className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                    >
                      {t("viewAllUniversities")}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {universities.map((u, i) => (
                      <Link
                        key={u.id}
                        href={`/universities/${u.slug}`}
                        onMouseEnter={() => setActiveIndex(i)}
                        className="group block"
                      >
                        <Card className="h-full overflow-hidden transition-shadow hover:shadow-flat-hover">
                          <div className="relative aspect-[16/9] bg-surface-low">
                            <Image
                              src={
                                universityHeroImages[u.slug] ??
                                "/images/hero-graduation.webp"
                              }
                              alt={lx(u.nameI18n, locale) || u.label}
                              fill
                              sizes="(max-width: 768px) 100vw, 33vw"
                              className="object-cover"
                            />
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-display font-semibold text-foreground">
                              {lx(u.nameI18n, locale) || u.label}
                            </h3>
                            {/* Text result: localized short description/tagline */}
                            {(lx(u.descriptionI18n, locale) ||
                              lx(u.taglineI18n, locale)) && (
                              <p className="mt-1 line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {lx(u.descriptionI18n, locale) ||
                                  lx(u.taglineI18n, locale)}
                              </p>
                            )}
                            {u.hint && (
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                {u.hint}
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Programs */}
              {programs.length > 0 && (
                <section>
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <h2 className="font-display text-headline-md text-foreground">
                      {t("programs")}
                    </h2>
                    <Link
                      href="/programs"
                      className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                    >
                      {t("viewAllPrograms")}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                  <div className="overflow-hidden rounded-2xl border border-border">
                    {programs.map((p) => (
                      <Link
                        key={p.id}
                        href="/programs"
                        className="flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-3 last:border-0 hover:bg-surface-low"
                      >
                        <span className="font-medium text-foreground">
                          {hitLabel(p)}
                        </span>
                        {p.hint && <Badge variant="secondary">{p.hint}</Badge>}
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Cities */}
              {cities.length > 0 && (
                <section>
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <h2 className="font-display text-headline-md text-foreground">
                      {t("cities")}
                    </h2>
                    <Link
                      href="/universities"
                      className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                    >
                      {t("viewAllUniversities")}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {cities.map((c) => (
                      <Link
                        key={c.id}
                        href={`/universities?search=${encodeURIComponent(c.slug)}`}
                        className={cn(
                          "rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-low",
                          activeIndex >= 0 &&
                            hits.indexOf(c) === activeIndex &&
                            "bg-surface-low",
                        )}
                      >
                        {hitLabel(c)}
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

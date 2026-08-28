"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Shared autocomplete state/logic for site search (header + hero).
 *
 * Extracted from the hero section: debounced (150 ms) queries to
 * `/api/search`, a bounded per-query cache so backspacing never re-fetches,
 * AbortController cleanup, and combobox keyboard semantics (↑/↓ wrap-around,
 * Enter picks the active hit — defaulting to the first, Escape closes).
 *
 * UI-free: consumers render their own input/dropdown and decide navigation.
 */

export type SearchHit = {
  type: "university" | "program" | "city";
  id: string;
  slug: string;
  label: string;
  hint?: string;
  nameI18n?: Record<string, string>;
  taglineI18n?: Record<string, string>;
  descriptionI18n?: Record<string, string>;
};

const DEBOUNCE_MS = 150;
const MIN_QUERY = 2;
const DEFAULT_LIMIT = 8;
const CACHE_BOUND = 100;

export function useSearchSuggest({
  limit = DEFAULT_LIMIT,
}: { limit?: number } = {}) {
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  // P3: cache results per query so retyping/backspacing doesn't re-hit the API.
  const cacheRef = useRef(new Map<string, SearchHit[]>());

  // Debounced autocomplete.
  useEffect(() => {
    const q = query.trim();
    if (q.length < MIN_QUERY) {
      setHits([]);
      return;
    }
    const cached = cacheRef.current.get(q);
    if (cached) {
      setHits(cached);
      setOpen(true);
      return;
    }
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(q)}&limit=${limit}`,
          { signal: ctrl.signal },
        );
        if (!res.ok) return;
        const data = await res.json();
        const results = (data.results ?? []) as SearchHit[];
        // Bound the cache so it can't grow unbounded during a long session.
        if (cacheRef.current.size > CACHE_BOUND) cacheRef.current.clear();
        cacheRef.current.set(q, results);
        setHits(results);
        setOpen(true);
      } catch {
        /* aborted or network — ignore */
      }
    }, DEBOUNCE_MS);
    return () => {
      ctrl.abort();
      clearTimeout(t);
    };
  }, [query, limit]);

  /** ↑/↓ move the active row (wrapping); Escape closes. Attach to input onKeyDown. */
  function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (!hits.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % hits.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + hits.length) % hits.length);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  /**
   * The hit Enter should navigate to: the explicitly active one, else the
   * first result (StudyLeo-style default). Null when there is nothing to pick.
   */
  function enterHit(): SearchHit | null {
    if (activeIndex >= 0 && hits[activeIndex]) return hits[activeIndex];
    return hits[0] ?? null;
  }

  /** Reset everything (after navigation / manual close). */
  function reset(): void {
    setQuery("");
    setHits([]);
    setActiveIndex(-1);
    setOpen(false);
  }

  return {
    query,
    setQuery,
    hits,
    open,
    setOpen,
    activeIndex,
    setActiveIndex,
    onInputKeyDown,
    enterHit,
    reset,
  };
}

/**
 * Route for a search hit — the single source of mapping used by both the hero
 * and the header search (universities detail / programs listing filtered by
 * the hit slug / universities listing filtered by city slug).
 */
export function searchHitRoute(hit: SearchHit): string {
  if (hit.type === "university") return `/universities/${hit.slug}`;
  if (hit.type === "program") return `/programs`;
  return `/universities?search=${encodeURIComponent(hit.slug)}`;
}

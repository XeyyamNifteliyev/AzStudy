'use client';

import { useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Search, ArrowRight } from 'lucide-react';
import { useRouter } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { lx } from '@/lib/i18n/lx';
import {
  useSearchSuggest,
  searchHitRoute,
  type SearchHit,
} from '@/lib/hooks/use-search-suggest';

export function HeroSearchForm() {
  const t = useTranslations('HomePage.hero');
  const locale = useLocale();
  const router = useRouter();
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
  } = useSearchSuggest();

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [setOpen]);

  function go(hit: SearchHit) {
    setOpen(false);
    router.push(searchHitRoute(hit));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const hit = enterHit();
    if (hit) {
      go(hit);
      return;
    }
    router.push(
      `/universities${query ? `?search=${encodeURIComponent(query)}` : ''}`,
    );
  }

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    onInputKeyDown(e);
  }

  function hitLabel(hit: SearchHit) {
    if (hit.nameI18n) return lx(hit.nameI18n, locale) || hit.label;
    return hit.label;
  }

  return (
    <form
      onSubmit={onSubmit}
      className="relative mt-7 flex max-w-lg flex-col gap-2 sm:flex-row"
    >
      <div className="relative flex-1" ref={boxRef}>
        <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKey}
          onFocus={() => hits.length && setOpen(true)}
          placeholder={t('searchPlaceholder')}
          aria-label={t('searchPlaceholder')}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls="hero-search-listbox"
          aria-activedescendant={
            open && hits.length ? `hero-option-${activeIndex}` : undefined
          }
          className="h-12 w-full rounded border border-input bg-card ps-10 pe-3 text-sm shadow-flat-plus focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        {open && hits.length > 0 && (
          <ul
            id="hero-search-listbox"
            role="listbox"
            className="absolute z-40 mt-1 w-full overflow-hidden rounded border border-border bg-card shadow-flat-hover"
          >
            {hits.map((h, i) => (
              <li
                key={`${h.type}-${h.id}`}
                id={`hero-option-${i}`}
                role="option"
                aria-selected={i === activeIndex}
              >
                <button
                  type="button"
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => go(h)}
                  className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm ${
                    i === activeIndex ? 'bg-surface-low' : ''
                  }`}
                >
                  <span className="font-medium text-foreground">
                    {hitLabel(h)}
                  </span>
                  <span className="text-xs uppercase text-muted-foreground">
                    {h.type}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Button type="submit" size="lg" className="gap-2">
        {t('search')}
        <ArrowRight className="h-4 w-4" />
      </Button>
    </form>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type { AppLocale } from "@/i18n/routing";
import type { City, ProgramCategory } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateProgramQuery } from "@/lib/programs/listing-query";

interface ProgramFiltersProps {
  locale: AppLocale;
  categories: ProgramCategory[];
  cities: City[];
  labels: {
    filtersTitle: string;
    search: string;
    category: string;
    allCategories: string;
    city: string;
    allCities: string;
    reset: string;
    close: string;
    activeFilters: string;
  };
}

const FILTER_KEYS = ["search", "category", "city", "sort"];

export function ProgramFilters({
  locale,
  categories,
  cities,
  labels,
}: ProgramFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") ?? "",
  );
  const searchEditedLocally = useRef(false);
  const timeout = useRef<number | null>(null);

  const update = useCallback(
    (key: string, value: string | null) => {
      const params = updateProgramQuery(searchParams, key, value);
      const query = params.toString();
      router.push(`/${locale}/programs${query ? `?${query}` : ""}`, {
        scroll: false,
      });
    },
    [locale, router, searchParams],
  );

  const clearFilters = useCallback(() => {
    if (timeout.current !== null) window.clearTimeout(timeout.current);
    searchEditedLocally.current = false;
    setSearchValue("");
    const query = updateProgramQuery(searchParams, null, null).toString();
    router.replace(`/${locale}/programs${query ? `?${query}` : ""}`, {
      scroll: false,
    });
  }, [locale, router, searchParams]);

  useEffect(() => {
    const urlSearch = searchParams.get("search") ?? "";
    if (!searchEditedLocally.current) setSearchValue(urlSearch);
    searchEditedLocally.current = false;
  }, [searchParams]);

  useEffect(() => {
    const urlSearch = searchParams.get("search") ?? "";
    if (!searchEditedLocally.current || searchValue === urlSearch) return;
    timeout.current = window.setTimeout(() => {
      searchEditedLocally.current = false;
      timeout.current = null;
      update("search", searchValue || null);
    }, 300);
    return () => {
      if (timeout.current !== null) window.clearTimeout(timeout.current);
    };
  }, [searchParams, searchValue, update]);

  const activeFilterCount = FILTER_KEYS.filter((key) =>
    searchParams.get(key),
  ).length;
  const controls = (
    <div className="space-y-4">
      <div className="relative">
        <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={searchValue}
          onChange={(event) => {
            searchEditedLocally.current = true;
            setSearchValue(event.target.value);
          }}
          placeholder={labels.search}
          aria-label={labels.search}
          className="ps-9"
        />
      </div>
      <SelectField
        label={labels.category}
        value={searchParams.get("category") ?? "all"}
        onChange={(value) => update("category", value)}
      >
        <SelectItem value="all">{labels.allCategories}</SelectItem>
        {categories.map((category) => (
          <SelectItem key={category.slug} value={category.slug}>
            {category.name[locale]}
          </SelectItem>
        ))}
      </SelectField>
      <SelectField
        label={labels.city}
        value={searchParams.get("city") ?? "all"}
        onChange={(value) => update("city", value)}
      >
        <SelectItem value="all">{labels.allCities}</SelectItem>
        {cities.map((city) => (
          <SelectItem key={city.slug} value={city.slug}>
            {city.name[locale]}
          </SelectItem>
        ))}
      </SelectField>
      {activeFilterCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-1 px-0 text-muted-foreground"
          onClick={clearFilters}
        >
          <X className="h-4 w-4" />
          {labels.reset}
        </Button>
      )}
    </div>
  );

  return (
    <>
      <aside
        aria-label={labels.filtersTitle}
        className="hidden h-fit rounded-lg border border-border bg-card p-5 shadow-sm lg:sticky lg:top-24 lg:block"
      >
        <FilterHeading labels={labels} count={activeFilterCount} />
        {controls}
      </aside>
      <div className="lg:hidden">
        <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full justify-between gap-2">
              <span className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
                {labels.filtersTitle}
              </span>
              {activeFilterCount > 0 && (
                <span
                  className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground"
                  aria-label={`${labels.activeFilters}: ${activeFilterCount}`}
                >
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent
            closeLabel={labels.close}
            className="start-auto end-0 top-0 h-full max-h-none w-[min(22rem,calc(100%-1rem))] translate-x-0 translate-y-0 overflow-y-auto rounded-none p-5 sm:rounded-s-lg"
          >
            <DialogHeader className="pe-8">
              <DialogTitle>{labels.filtersTitle}</DialogTitle>
              <DialogDescription className="sr-only">
                {labels.filtersTitle}
              </DialogDescription>
            </DialogHeader>
            {controls}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

function FilterHeading({
  labels,
  count,
}: {
  labels: ProgramFiltersProps["labels"];
  count: number;
}) {
  return (
    <div className="mb-5 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <SlidersHorizontal className="h-4 w-4 text-primary" />
        {labels.filtersTitle}
      </div>
      {count > 0 && (
        <span
          className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
          aria-label={`${labels.activeFilters}: ${count}`}
        >
          {count}
        </span>
      )}
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger aria-label={label} className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
    </div>
  );
}

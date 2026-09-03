"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type { DegreeLevel } from "@/types";
import type { AppLocale } from "@/i18n/routing";
import type { CityOptionVM } from "@/lib/universities/view-model";
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

interface UniversityFiltersProps {
  locale: AppLocale;
  cities: CityOptionVM[];
  labels: {
    filtersTitle: string;
    search: string;
    city: string;
    allCities: string;
    degree: string;
    allDegrees: string;
    language: string;
    allLanguages: string;
    english?: string;
    azerbaijani?: string;
    russian?: string;
    turkish?: string;
    type: string;
    allTypes: string;
    state: string;
    private: string;
    bachelor: string;
    master: string;
    phd: string;
    associate: string;
    reset: string;
    close?: string;
    clearAll?: string;
    maxTuition?: string;
    activeFilters?: string;
  };
}

const DEGREES: DegreeLevel[] = ["bachelor", "master", "phd", "associate"];
const LISTING_FILTER_KEYS = [
  "city",
  "degree",
  "language",
  "type",
  "search",
  "maxTuition",
  "sort",
];

export function UniversityFilters({
  locale,
  cities,
  labels,
}: UniversityFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") ?? "",
  );
  const lastUrlSearch = useRef(searchParams.get("search") ?? "");
  const searchEditedLocally = useRef(false);
  const searchTimeout = useRef<number | null>(null);
  // maxTuition is debounced like search — pushing a URL update on every
  // keystroke would spam history and re-render the whole explorer per digit.
  const [maxTuitionValue, setMaxTuitionValue] = useState(
    searchParams.get("maxTuition") ?? "",
  );
  const lastUrlMaxTuition = useRef(searchParams.get("maxTuition") ?? "");
  const maxTuitionEditedLocally = useRef(false);
  const maxTuitionTimeout = useRef<number | null>(null);

  const update = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "all") params.set(key, value);
      else params.delete(key);
      const qs = params.toString();
      router.push(`/${locale}/universities${qs ? `?${qs}` : ""}`, {
        scroll: false,
      });
    },
    [locale, router, searchParams],
  );

  function clearFilters() {
    if (searchTimeout.current !== null) {
      window.clearTimeout(searchTimeout.current);
      searchTimeout.current = null;
    }
    if (maxTuitionTimeout.current !== null) {
      window.clearTimeout(maxTuitionTimeout.current);
      maxTuitionTimeout.current = null;
    }
    searchEditedLocally.current = false;
    maxTuitionEditedLocally.current = false;
    setSearchValue("");
    setMaxTuitionValue("");
    const params = new URLSearchParams(searchParams.toString());
    LISTING_FILTER_KEYS.forEach((key) => params.delete(key));
    const qs = params.toString();
    router.replace(`/${locale}/universities${qs ? `?${qs}` : ""}`, {
      scroll: false,
    });
  }

  useEffect(() => {
    const urlSearch = searchParams.get("search") ?? "";
    if (urlSearch === lastUrlSearch.current) return;

    lastUrlSearch.current = urlSearch;
    searchEditedLocally.current = false;
    setSearchValue(urlSearch);
  }, [searchParams]);

  useEffect(() => {
    const urlSearch = searchParams.get("search") ?? "";
    if (!searchEditedLocally.current || searchValue === urlSearch) return;

    searchTimeout.current = window.setTimeout(() => {
      searchEditedLocally.current = false;
      searchTimeout.current = null;
      update("search", searchValue || null);
    }, 300);

    return () => {
      if (searchTimeout.current !== null) {
        window.clearTimeout(searchTimeout.current);
        searchTimeout.current = null;
      }
    };
  }, [searchParams, searchValue, update]);

  useEffect(() => {
    const urlMaxTuition = searchParams.get("maxTuition") ?? "";
    if (urlMaxTuition === lastUrlMaxTuition.current) return;

    lastUrlMaxTuition.current = urlMaxTuition;
    maxTuitionEditedLocally.current = false;
    setMaxTuitionValue(urlMaxTuition);
  }, [searchParams]);

  useEffect(() => {
    const urlMaxTuition = searchParams.get("maxTuition") ?? "";
    if (!maxTuitionEditedLocally.current || maxTuitionValue === urlMaxTuition)
      return;

    maxTuitionTimeout.current = window.setTimeout(() => {
      maxTuitionEditedLocally.current = false;
      maxTuitionTimeout.current = null;
      update("maxTuition", maxTuitionValue || null);
    }, 400);

    return () => {
      if (maxTuitionTimeout.current !== null) {
        window.clearTimeout(maxTuitionTimeout.current);
        maxTuitionTimeout.current = null;
      }
    };
  }, [searchParams, maxTuitionValue, update]);

  const activeFilterCount = LISTING_FILTER_KEYS.filter((key) =>
    searchParams.get(key),
  ).length;
  const filterProps = {
    cities,
    labels,
    locale,
    searchParams,
    searchValue,
    setSearchValue: (value: string) => {
      searchEditedLocally.current = true;
      setSearchValue(value);
    },
    maxTuitionValue,
    setMaxTuitionValue: (value: string) => {
      maxTuitionEditedLocally.current = true;
      setMaxTuitionValue(value);
    },
    update,
    clearFilters,
  };

  return (
    <>
      <aside
        aria-label={labels.filtersTitle}
        className="hidden h-fit rounded-lg border border-border bg-card p-5 shadow-sm lg:sticky lg:top-24 lg:block"
      >
        <FilterHeading labels={labels} activeFilterCount={activeFilterCount} />
        <FilterControls {...filterProps} />
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
                <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  <span
                    aria-label={`${labels.activeFilters ?? labels.filtersTitle}: ${activeFilterCount}`}
                  >
                    {activeFilterCount}
                  </span>
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
            <FilterControls {...filterProps} />
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

function FilterHeading({
  labels,
  activeFilterCount,
}: {
  labels: UniversityFiltersProps["labels"];
  activeFilterCount: number;
}) {
  return (
    <div className="mb-5 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <SlidersHorizontal className="h-4 w-4 text-primary" />
        {labels.filtersTitle}
      </div>
      {activeFilterCount > 0 && (
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
          <span
            aria-label={`${labels.activeFilters ?? labels.filtersTitle}: ${activeFilterCount}`}
          >
            {activeFilterCount}
          </span>
        </span>
      )}
    </div>
  );
}

function FilterControls({
  cities,
  labels,
  searchParams,
  searchValue,
  setSearchValue,
  maxTuitionValue,
  setMaxTuitionValue,
  update,
  clearFilters,
}: {
  cities: CityOptionVM[];
  labels: UniversityFiltersProps["labels"];
  searchParams: ReturnType<typeof useSearchParams>;
  searchValue: string;
  setSearchValue: (value: string) => void;
  maxTuitionValue: string;
  setMaxTuitionValue: (value: string) => void;
  update: (key: string, value: string | null) => void;
  clearFilters: () => void;
}) {
  const change = (key: string, value: string | null) => update(key, value);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          placeholder={labels.search}
          aria-label={labels.search}
          className="ps-9"
        />
      </div>

      <SelectField
        label={labels.city}
        value={searchParams.get("city") ?? "all"}
        onChange={(value) => change("city", value)}
      >
        <SelectItem value="all">{labels.allCities}</SelectItem>
        {cities.map((city) => (
          <SelectItem key={city.id} value={city.slug}>
            {city.name}
          </SelectItem>
        ))}
      </SelectField>

      <SelectField
        label={labels.degree}
        value={searchParams.get("degree") ?? "all"}
        onChange={(value) => change("degree", value)}
      >
        <SelectItem value="all">{labels.allDegrees}</SelectItem>
        {DEGREES.map((degree) => (
          <SelectItem key={degree} value={degree}>
            {labels[degree]}
          </SelectItem>
        ))}
      </SelectField>

      <SelectField
        label={labels.language}
        value={searchParams.get("language") ?? "all"}
        onChange={(value) => change("language", value)}
      >
        <SelectItem value="all">{labels.allLanguages}</SelectItem>
        <SelectItem value="en">{labels.english ?? "English"}</SelectItem>
        <SelectItem value="az">
          {labels.azerbaijani ?? "Azerbaijani"}
        </SelectItem>
        <SelectItem value="ru">{labels.russian ?? "Russian"}</SelectItem>
        <SelectItem value="tr">{labels.turkish ?? "Turkish"}</SelectItem>
      </SelectField>

      <SelectField
        label={labels.type}
        value={searchParams.get("type") ?? "all"}
        onChange={(value) => change("type", value)}
      >
        <SelectItem value="all">{labels.allTypes}</SelectItem>
        <SelectItem value="state">{labels.state}</SelectItem>
        <SelectItem value="private">{labels.private}</SelectItem>
      </SelectField>

      <label className="block space-y-1.5">
        <span className="text-xs font-medium text-muted-foreground">
          {labels.maxTuition ?? "Maximum tuition (USD)"}
        </span>
        <Input
          type="number"
          min="0"
          inputMode="decimal"
          value={maxTuitionValue}
          onChange={(event) => setMaxTuitionValue(event.target.value)}
          placeholder="25000"
          aria-label={labels.maxTuition ?? "Maximum tuition (USD)"}
        />
      </label>

      {LISTING_FILTER_KEYS.some((key) => searchParams.get(key)) && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-1 px-0 text-muted-foreground"
          onClick={clearFilters}
        >
          <X className="h-4 w-4" />
          {labels.clearAll ?? labels.reset}
        </Button>
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

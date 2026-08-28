"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { isSvgUrl } from "@/lib/images/is-svg";
import { lx } from "@/lib/i18n/lx";

export interface CompareItem {
  id: string;
  name: string;
  nameI18n?: Record<string, string>;
  logoText: string;
  logoImage?: string;
  cityName: string;
  tuition: string;
  ranking: number;
  studentCount: number;
  isState: boolean;
  languages: string[];
  foundedYear: number;
}

const MAX = 3;

export function CompareTool({ items }: { items: CompareItem[] }) {
  const t = useTranslations("Compare");
  const locale = useLocale();
  // F8: Persist selection in URL query params (?u=id1,id2) so back-button
  // and shareable links work.
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const urlIds = (searchParams.get("u") ?? "")
    .split(",")
    .filter((id) => items.some((i) => i.id === id));
  const [selected, setSelected] = useState<string[]>(urlIds);
  const [query, setQuery] = useState("");

  // Sync selection changes back to URL.
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (selected.length) params.set("u", selected.join(","));
    else params.delete("u");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [selected, pathname, router, searchParams]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return items.filter(
      (i) =>
        !q ||
        lx(i.nameI18n, locale).toLowerCase().includes(q) ||
        i.name.toLowerCase().includes(q),
    );
  }, [items, query, locale]);

  const selectedItems = selected
    .map((id) => items.find((i) => i.id === id))
    .filter((i): i is CompareItem => Boolean(i));

  function toggle(id: string) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX) return prev;
      return [...prev, id];
    });
  }

  const rows: Array<{
    label: string;
    render: (i: CompareItem) => React.ReactNode;
  }> = [
    { label: t("tuition"), render: (i) => i.tuition },
    { label: t("ranking"), render: (i) => `#${i.ranking}` },
    { label: t("city"), render: (i) => i.cityName },
    { label: t("students"), render: (i) => i.studentCount.toLocaleString() },
    {
      label: t("type"),
      render: (i) => (i.isState ? t("typeState") : t("typePrivate")),
    },
    {
      label: t("languages"),
      render: (i) => i.languages.join(" / ").toUpperCase(),
    },
    { label: t("founded"), render: (i) => String(i.foundedYear) },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
      <div>
        <p className="mb-2 text-sm font-semibold text-foreground">
          {t("select")} ({selected.length}/{MAX})
        </p>
        <div className="relative mb-3">
          <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            aria-label={t("searchPlaceholder")}
            className="h-10 w-full rounded border border-input bg-card ps-9 pe-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <ul className="max-h-[420px] space-y-1 overflow-y-auto pe-1">
          {filtered.map((i) => {
            const checked = selected.includes(i.id);
            const disabled = !checked && selected.length >= MAX;
            return (
              <li key={i.id}>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => toggle(i.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded border px-3 py-2 text-left text-sm transition-colors",
                    checked
                      ? "border-primary bg-secondary text-foreground"
                      : "border-border bg-card hover:bg-accent",
                    disabled && "cursor-not-allowed opacity-50",
                  )}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded bg-primary/10">
                    {i.logoImage ? (
                      <Image
                        src={i.logoImage}
                        alt={`${lx(i.nameI18n, locale)} logo`}
                        width={32}
                        height={32}
                        unoptimized={isSvgUrl(i.logoImage)}
                        className="object-contain"
                      />
                    ) : (
                      <span className="font-display text-xs font-bold text-primary">
                        {i.logoText}
                      </span>
                    )}
                  </span>
                  <span className="flex-1 truncate">{lx(i.nameI18n, locale)}</span>
                  {checked && <X className="h-4 w-4 text-muted-foreground" />}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        {selectedItems.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-low">
                  <th className="p-4 text-left font-display text-xs uppercase tracking-wide text-muted-foreground">
                    {t("attribute")}
                  </th>
                  {selectedItems.map((i) => (
                    <th key={i.id} className="p-4 text-left align-top">
                      <div className="flex items-center gap-2">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded bg-primary/10">
                          {i.logoImage ? (
                            <Image
                              src={i.logoImage}
                              alt={`${lx(i.nameI18n, locale)} logo`}
                              width={32}
                              height={32}
                              unoptimized={isSvgUrl(i.logoImage)}
                              className="object-contain"
                            />
                          ) : (
                            <span className="font-display text-xs font-bold text-primary">
                              {i.logoText}
                            </span>
                          )}
                        </span>
                        <span className="font-display font-semibold text-foreground">
                          {lx(i.nameI18n, locale)}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr
                    key={row.label}
                    className={cn(
                      "border-b border-border",
                      idx % 2 === 1 && "bg-surface-low/50",
                    )}
                  >
                    <td className="p-4 text-muted-foreground">{row.label}</td>
                    {selectedItems.map((i) => (
                      <td
                        key={i.id}
                        className="p-4 font-medium text-foreground tabular-nums"
                      >
                        {row.render(i)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed border-border text-center">
            <Badge variant="secondary">{t("select")}</Badge>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              {t("empty")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

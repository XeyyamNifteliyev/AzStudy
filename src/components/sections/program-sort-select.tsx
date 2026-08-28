"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { AppLocale } from "@/i18n/routing";
import type { ProgramSort } from "@/lib/programs/listing-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ProgramSortSelect({
  locale,
  value,
  labels,
}: {
  locale: AppLocale;
  value: ProgramSort;
  labels: { sort: string; relevance: string; name: string; tuition: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  function update(nextValue: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (nextValue === "relevance") params.delete("sort");
    else params.set("sort", nextValue);
    const query = params.toString();
    router.push(`/${locale}/programs${query ? `?${query}` : ""}`, {
      scroll: false,
    });
  }
  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="program-sort"
        className="text-xs font-medium text-muted-foreground"
      >
        {labels.sort}
      </label>
      <Select value={value} onValueChange={update}>
        <SelectTrigger
          id="program-sort"
          aria-label={labels.sort}
          className="w-40"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="relevance">{labels.relevance}</SelectItem>
          <SelectItem value="name">{labels.name}</SelectItem>
          <SelectItem value="tuition">{labels.tuition}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

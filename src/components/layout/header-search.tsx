"use client";

import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

/**
 * Header site search — a single icon that navigates to the dedicated
 * `/search` page (StudyLeo-style), where results are grouped by
 * university/program/city. Kept as its own component so the header stays
 * server-rendered apart from this client button.
 */
export function HeaderSearch() {
  const t = useTranslations("Nav");
  const router = useRouter();

  return (
    <Button
      variant="outline"
      size="sm"
      aria-label={t("search")}
      onClick={() => router.push("/search")}
      className="shrink-0 px-2.5"
    >
      <Search className="h-4 w-4" aria-hidden />
    </Button>
  );
}

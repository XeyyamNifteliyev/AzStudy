"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Calculator } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Tier = "state" | "mid" | "premium";
type CityTier = "baku" | "gence" | "sumqayit" | "naxcivan" | "other";
type Lifestyle = "modest" | "balanced" | "comfortable";

const tuitionByTier: Record<Tier, number> = {
  state: 1500,
  mid: 6000,
  premium: 12000,
};

const rentByCity: Record<CityTier, number> = {
  baku: 380,
  gence: 220,
  sumqayit: 250,
  naxcivan: 200,
  other: 220,
};

const livingByLifestyle: Record<Lifestyle, number> = {
  modest: 200,
  balanced: 300,
  comfortable: 450,
};

export function CostCalculator() {
  const t = useTranslations("HomePage.calculator");
  const locale = useLocale();
  const [tier, setTier] = useState<Tier>("mid");
  const [city, setCity] = useState<CityTier>("baku");
  const [lifestyle, setLifestyle] = useState<Lifestyle>("balanced");

  const { tuition, rentYear, livingYear, total } = useMemo(() => {
    const tuition = tuitionByTier[tier];
    const rentYear = rentByCity[city] * 12;
    const livingYear = livingByLifestyle[lifestyle] * 12;
    return {
      tuition,
      rentYear,
      livingYear,
      total: tuition + rentYear + livingYear,
    };
  }, [tier, city, lifestyle]);

  return (
    <section className="section-padding">
      <div className="container-page grid items-start gap-8 lg:grid-cols-2">
        <div>
          <p className="font-display text-sm font-semibold uppercase tracking-wide text-cta">
            {t("eyebrow")}
          </p>
          <h2 className="mt-2 font-display text-headline-xl text-foreground">
            {t("title")}
          </h2>
          <p className="mt-3 max-w-md text-muted-foreground">{t("subtitle")}</p>

          <div className="mt-8 space-y-5">
            <Field label={t("tier")}>
              <Select value={tier} onValueChange={(v) => setTier(v as Tier)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="state">{t("tierState")}</SelectItem>
                  <SelectItem value="mid">{t("tierMid")}</SelectItem>
                  <SelectItem value="premium">{t("tierPremium")}</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field label={t("city")}>
              <Select
                value={city}
                onValueChange={(v) => setCity(v as CityTier)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baku">{t("cityBaku")}</SelectItem>
                  <SelectItem value="gence">{t("cityGance")}</SelectItem>
                  <SelectItem value="sumqayit">{t("citySumqayit")}</SelectItem>
                  <SelectItem value="naxcivan">{t("cityNaxcivan")}</SelectItem>
                  <SelectItem value="other">{t("cityOther")}</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field label={t("lifestyle")}>
              <Select
                value={lifestyle}
                onValueChange={(v) => setLifestyle(v as Lifestyle)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modest">{t("lifestyleModest")}</SelectItem>
                  <SelectItem value="balanced">
                    {t("lifestyleBalanced")}
                  </SelectItem>
                  <SelectItem value="comfortable">
                    {t("lifestyleComfortable")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
        </div>

        <Card className="lg:sticky lg:top-24">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              {t("result")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Row label={t("tuition")} value={formatCurrency(tuition, locale)} />
            <Row
              label={t("accommodation")}
              value={formatCurrency(rentYear, locale)}
            />
            <Row
              label={t("living")}
              value={formatCurrency(livingYear, locale)}
            />
            <div className="border-t border-border pt-4">
              <div className="flex items-center justify-between">
                <span className="font-display font-semibold text-foreground">
                  {t("yearlyTotal")}
                </span>
                <span className="font-display text-2xl font-bold text-primary tabular-nums">
                  {formatCurrency(total, locale)}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {t("disclaimer")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="font-display text-sm font-semibold text-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums text-foreground">{value}</span>
    </div>
  );
}

function formatCurrency(amount: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

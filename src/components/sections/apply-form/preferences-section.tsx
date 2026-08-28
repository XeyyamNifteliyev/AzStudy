"use client";

import { useController, type Control } from "react-hook-form";
import { Loader2, Send, SlidersHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { LeadInput } from "@/lib/validations/lead";
import { Link } from "@/i18n/navigation";
import { CheckboxField, Field } from "./primitives";

export function PreferencesSection({
  t,
  control,
  formError,
  isSubmitting,
}: {
  t: (key: string) => string;
  control: Control<LeadInput>;
  formError: string | null;
  isSubmitting: boolean;
}) {
  const scholarship = useController({ control, name: "scholarshipInterest" });
  const dormitory = useController({ control, name: "dormitory" });
  const intake = useController({ control, name: "intake" });
  const message = useController({ control, name: "message" });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-headline-sm">
          <SlidersHorizontal className="h-5 w-5 text-primary" />
          {t("sectionPreferences")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <CheckboxField
          label={t("scholarshipInterest")}
          checked={!!scholarship.field.value}
          onChange={scholarship.field.onChange}
        />
        <CheckboxField
          label={t("dormitory")}
          checked={!!dormitory.field.value}
          onChange={dormitory.field.onChange}
        />

        <Field id="intake" label={t("intake")}>
          <Select
            value={intake.field.value || undefined}
            onValueChange={intake.field.onChange}
          >
            <SelectTrigger id="intake">
              <SelectValue placeholder={t("intakePlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fall">{t("intakeFall")}</SelectItem>
              <SelectItem value="spring">{t("intakeSpring")}</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field label={t("message")} hint={t("optional")}>
          <Textarea
            rows={4}
            value={message.field.value ?? ""}
            onChange={message.field.onChange}
            placeholder={t("messagePlaceholder")}
          />
        </Field>

        {formError && (
          <p role="alert" className="text-sm text-destructive">
            {formError}
          </p>
        )}

        <Button
          type="submit"
          variant="cta"
          size="lg"
          className="w-full gap-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          {t("submit")}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          {t("privacy")}{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-2 hover:text-primary"
          >
            {t("privacyPolicy")}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

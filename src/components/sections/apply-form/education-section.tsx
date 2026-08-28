"use client";

import { useController, type Control } from "react-hook-form";
import { GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { LeadInput } from "@/lib/validations/lead";
import type { AppLocale } from "@/i18n/routing";
import { lx } from "@/lib/i18n/lx";
import {
  Field,
  Segmented,
  type UniversityOption,
  type ProgramOption,
} from "./primitives";

export type { UniversityOption, ProgramOption } from "./primitives";

export function EducationSection({
  t,
  control,
  universities,
  programs,
  locale,
  onUniversityChange,
}: {
  t: (key: string) => string;
  control: Control<LeadInput>;
  universities: UniversityOption[];
  programs: ProgramOption[];
  locale: AppLocale;
  /** Keeps universitySlug in sync and clears programId when the uni changes. */
  onUniversityChange: (universityId: string, universitySlug: string) => void;
}) {
  const degreeOptions = [
    { value: "bachelor", label: t("degreeBachelor") },
    { value: "master", label: t("degreeMaster") },
    { value: "associate", label: t("degreeAssociate") },
    { value: "phd", label: t("degreePhd") },
  ] as const;

  const languageOptions = [
    { value: "english", label: t("langEnglish") },
    { value: "azerbaijani", label: t("langAzerbaijani") },
    { value: "russian", label: t("langRussian") },
    { value: "turkish", label: t("langTurkish") },
  ] as const;

  const university = useController({ control, name: "universityId" });
  const program = useController({ control, name: "programId" });
  const degree = useController({ control, name: "degreeLevel" });
  const language = useController({ control, name: "instructionLanguage" });

  function resolveProgramName(p: ProgramOption): string {
    return p.name[locale] ?? p.name.en ?? p.slug;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-headline-sm">
          <GraduationCap className="h-5 w-5 text-primary" />
          {t("sectionEducation")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Field
          id="universityId"
          label={t("university")}
          error={university.fieldState.error?.message}
        >
          <Select
            value={university.field.value || undefined}
            onValueChange={(v) => {
              university.field.onChange(v);
              const u = universities.find((x) => x.id === v);
              onUniversityChange(v, u?.slug ?? "");
            }}
          >
            <SelectTrigger
              id="universityId"
              aria-invalid={!!university.fieldState.error}
            >
              <SelectValue placeholder={t("universityPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {universities.map((u) => (
                <SelectItem key={u.id} value={u.id}>
                  {lx(u.nameI18n, locale) || u.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field id="programId" label={t("program")}>
          <Select
            value={program.field.value || undefined}
            onValueChange={program.field.onChange}
          >
            <SelectTrigger id="programId">
              <SelectValue placeholder={t("programPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {programs.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {resolveProgramName(p)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label={t("degreeLevel")}>
          <Segmented
            label={t("degreeLevel")}
            value={degree.field.value ?? ""}
            options={degreeOptions}
            onSelect={(v) => degree.field.onChange(v)}
          />
        </Field>

        <Field label={t("instructionLanguage")}>
          <Segmented
            label={t("instructionLanguage")}
            value={language.field.value ?? ""}
            options={languageOptions}
            onSelect={(v) => language.field.onChange(v)}
          />
        </Field>
      </CardContent>
    </Card>
  );
}

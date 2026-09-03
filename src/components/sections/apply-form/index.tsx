"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { leadSchema, type LeadInput } from "@/lib/validations/lead";
import { submitLead } from "@/app/actions/leads";
import { uploadApplyDocument } from "@/app/actions/upload-apply-document";
import type { Country } from "@/types";
import type { AppLocale } from "@/i18n/routing";
import {
  EducationSection,
  type UniversityOption,
  type ProgramOption,
} from "./education-section";
import { PersonalSection } from "./personal-section";
import { MAX_FILE_BYTES, type DocField, type UploadStatus } from "./primitives";

// PERF §6.3: everything below the first screen is code-split out of the apply
// page's First Load JS (195 kB → target <130 kB). The sections mount
// client-side after hydration; their shells render as skeletons meanwhile.
const DocumentsSection = dynamic(
  () => import("./documents-section").then((m) => m.DocumentsSection),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 animate-pulse rounded-lg border border-border bg-card" />
    ),
  },
);
const PreferencesSection = dynamic(
  () => import("./preferences-section").then((m) => m.PreferencesSection),
  {
    ssr: false,
    loading: () => (
      <div className="h-80 animate-pulse rounded-lg border border-border bg-card" />
    ),
  },
);

interface ApplyFormProps {
  locale: AppLocale;
  countries: Country[];
  universities: UniversityOption[];
  programs: ProgramOption[];
  universitySlug?: string;
}

/**
 * FE-1: sectioned apply form. The form logic (react-hook-form + zod + uploads)
 * lives here; each UI section is a small presentational component in this
 * folder. All selects use Radix Select for consistent behaviour/accessibility.
 */
export function ApplyForm({
  locale,
  countries,
  universities,
  programs,
  universitySlug,
}: ApplyFormProps) {
  const t = useTranslations("Apply");
  const [done, setDone] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [uploads, setUploads] = useState<Record<DocField, UploadStatus>>({
    passportUrl: "idle",
    diplomaUrl: "idle",
    photoUrl: "idle",
    motivationLetterUrl: "idle",
  });

  // Pre-select the university when the form is reached from a university page.
  const preselected = universitySlug
    ? universities.find((u) => u.slug === universitySlug)
    : undefined;

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { isSubmitting },
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      locale,
      universityId: preselected?.id ?? "",
      universitySlug: universitySlug ?? "",
      programId: "",
      degreeLevel: "",
      instructionLanguage: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      whatsapp: "",
      country: "",
      nationality: "",
      dateOfBirth: "",
      gender: "",
      passportUrl: "",
      diplomaUrl: "",
      photoUrl: "",
      motivationLetterUrl: "",
      scholarshipInterest: false,
      dormitory: false,
      intake: "",
      message: "",
      website: "",
    },
  });

  function handleUniversityChange(
    universityId: string,
    universitySlug: string,
  ) {
    setValue("universitySlug", universitySlug);
    // Clear the program whenever the university changes.
    setValue("programId", "");
  }

  // A11y/conversion: on a failed validation, move keyboard/AT focus to the
  // first invalid field so the user finds the error instantly. RHF re-renders
  // the error attributes, so wait a frame before querying the DOM.
  function handleInvalid() {
    requestAnimationFrame(() => {
      document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    });
  }

  async function onSubmit(values: LeadInput) {
    setFormError(null);
    const res = await submitLead(values);
    if (res.ok) {
      setDone(true);
      // Conversion tracking — fire only if GA is loaded.
      if (typeof window !== "undefined" && typeof window.gtag === "function") {
        window.gtag("event", "lead_submitted", {
          event_category: "engagement",
          event_label: universitySlug
            ? `university:${universitySlug}`
            : "apply_page",
        });
      }
    } else if (res.errors._form?.length) {
      setFormError(res.errors._form[0]);
    }
  }

  async function handleUpload(field: DocField, fieldname: string, file?: File) {
    if (!file) return;
    if (file.size > MAX_FILE_BYTES) {
      setUploads((s) => ({ ...s, [field]: "error" }));
      return;
    }
    setUploads((s) => ({ ...s, [field]: "uploading" }));
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fieldname", fieldname);
    const res = await uploadApplyDocument(formData);
    if (res.ok) {
      setValue(field, res.url);
      setUploads((s) => ({ ...s, [field]: "done" }));
    } else {
      setUploads((s) => ({ ...s, [field]: "error" }));
    }
  }

  if (done) {
    return (
      <div className="flex flex-col items-center rounded-lg border border-verified/30 bg-verified/5 p-8 text-center">
        <CheckCircle2 className="h-12 w-12 text-verified" />
        <h3 className="mt-4 font-display text-headline-md text-foreground">
          {t("successTitle")}
        </h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          {t("successBody")}
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => setDone(false)}
        >
          {t("successAnother")}
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, handleInvalid)}
      className="space-y-6"
      noValidate
    >
      {/* Honeypot — must stay empty. */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        {...register("website")}
      />

      {/* Track uploaded document URLs so they submit with the lead. */}
      <input type="hidden" {...register("passportUrl")} />
      <input type="hidden" {...register("diplomaUrl")} />
      <input type="hidden" {...register("photoUrl")} />
      <input type="hidden" {...register("motivationLetterUrl")} />

      <EducationSection
        t={t}
        control={control}
        universities={universities}
        programs={programs}
        locale={locale}
        onUniversityChange={handleUniversityChange}
      />

      <PersonalSection
        t={t}
        control={control}
        countries={countries}
        locale={locale}
      />

      <DocumentsSection t={t} uploads={uploads} onUpload={handleUpload} />

      <PreferencesSection
        t={t}
        control={control}
        formError={formError}
        isSubmitting={isSubmitting}
      />
    </form>
  );
}

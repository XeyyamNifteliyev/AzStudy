"use client";

import { useTranslations } from "next-intl";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { DegreeLevel, LocalizedString } from "@/types";

/** Minimal university shape passed from the server. */
export type UniversityOption = {
  id: string;
  slug: string;
  name: string;
  nameI18n?: LocalizedString;
};

/** Programs carry the fields the select needs. */
export type ProgramOption = {
  id: string;
  slug: string;
  name: LocalizedString;
  degreeLevel?: DegreeLevel;
};

/** Document URL fields that double as upload-status keys. */
export type DocField =
  "passportUrl" | "diplomaUrl" | "photoUrl" | "motivationLetterUrl";

export type UploadStatus = "idle" | "uploading" | "done" | "error";

export const MAX_FILE_BYTES = 5 * 1024 * 1024;
export const FILE_ACCEPT = ".pdf,.jpg,.jpeg,.png";

/* ── Shared form primitives ─────────────────────────────────────── */

export function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id?: string;
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between">
        <Label htmlFor={id}>{label}</Label>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

/** Segmented button group used for degree level & instruction language. */
export function Segmented<T extends string>({
  value,
  options,
  onSelect,
  label,
}: {
  value: string;
  options: ReadonlyArray<{ value: T; label: string }>;
  onSelect: (value: T) => void;
  label: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="grid auto-cols-fr grid-flow-col gap-1 rounded-md border border-input bg-accent/30 p-1"
    >
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onSelect(opt.value)}
            className={cn(
              "flex items-center justify-center rounded px-3 py-2 text-sm font-medium transition-colors",
              selected
                ? "bg-card text-foreground shadow-flat-plus"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function DocumentField({
  label,
  hint,
  status,
  onChange,
}: {
  label: string;
  hint?: string;
  status: UploadStatus;
  onChange: (file: File | undefined) => void;
}) {
  const t = useTranslations("Apply");
  const statusLabel =
    status === "done"
      ? t("uploadDone")
      : status === "uploading"
        ? t("uploading")
        : status === "error"
          ? t("uploadError")
          : "";
  const statusClass =
    status === "done"
      ? "text-verified"
      : status === "error"
        ? "text-destructive"
        : "text-muted-foreground";
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <Label>{label}</Label>
        {statusLabel && (
          <span className={cn("flex items-center gap-1 text-xs", statusClass)}>
            {status === "uploading" && (
              <Loader2 className="h-3 w-3 animate-spin" />
            )}
            {status === "done" && <CheckCircle2 className="h-3 w-3" />}
            {status === "error" && <AlertCircle className="h-3 w-3" />}
            {statusLabel}
          </span>
        )}
      </div>
      <Input
        type="file"
        accept={FILE_ACCEPT}
        onChange={(e) => onChange(e.target.files?.[0])}
      />
      {hint && (
        <span className="block text-xs text-muted-foreground">{hint}</span>
      )}
    </div>
  );
}

export function CheckboxField({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-md border border-border bg-card p-3 text-sm">
      <input
        type="checkbox"
        className="mt-0.5 h-4 w-4 rounded border-input accent-primary"
        {...props}
      />
      <span className="text-foreground">{label}</span>
    </label>
  );
}

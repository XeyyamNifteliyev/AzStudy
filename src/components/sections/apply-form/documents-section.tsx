"use client";

import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DocumentField, type DocField, type UploadStatus } from "./primitives";

export function DocumentsSection({
  t,
  uploads,
  onUpload,
}: {
  t: (key: string) => string;
  uploads: Record<DocField, UploadStatus>;
  onUpload: (
    field: DocField,
    fieldname: string,
    file: File | undefined,
  ) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-headline-sm">
          <FileText className="h-5 w-5 text-primary" />
          {t("sectionDocuments")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DocumentField
          label={t("passport")}
          hint={t("fileHint")}
          status={uploads.passportUrl}
          onChange={(file) => onUpload("passportUrl", "passport", file)}
        />
        <DocumentField
          label={t("diploma")}
          hint={t("fileHint")}
          status={uploads.diplomaUrl}
          onChange={(file) => onUpload("diplomaUrl", "diploma", file)}
        />
        <DocumentField
          label={t("photo")}
          hint={t("fileHint")}
          status={uploads.photoUrl}
          onChange={(file) => onUpload("photoUrl", "photo", file)}
        />
        <DocumentField
          label={t("motivationLetter")}
          hint={`${t("optional")} · ${t("fileHint")}`}
          status={uploads.motivationLetterUrl}
          onChange={(file) =>
            onUpload("motivationLetterUrl", "motivation-letter", file)
          }
        />
      </CardContent>
    </Card>
  );
}

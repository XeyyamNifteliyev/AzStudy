// src/app/admin/(dashboard)/applications/page.tsx
import Link from "next/link";
import { crm } from "@/lib/crm";
import { getAdminT, leadStatusLabels } from "@/lib/admin-i18n";
import { LeadStatusBadge } from "@/components/admin/LeadStatusBadge";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText, Mail, Phone } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const sp = await searchParams;
  // PERF: translations, leads and staff are independent — fetch concurrently.
  const [{ t }, leads, staff] = await Promise.all([
    getAdminT(),
    crm.listLeads(sp.status ? { status: sp.status as never } : undefined),
    crm.listStaff(),
  ]);
  const consultantMap = new Map(staff.map((s) => [s.id, s.fullName]));
  const newCount = leads.filter((l) => l.status === "new").length;
  const labels = leadStatusLabels(t);

  const statusKeys = [
    "new",
    "contacted",
    "document_collection",
    "application_submitted",
    "offer_received",
    "accepted",
    "visa_processing",
    "arrived",
    "completed",
    "lost",
  ] as const;
  const statusLabelMap: Record<string, string> = {
    new: t("status.new"),
    contacted: t("status.contacted"),
    document_collection: t("status.document_collection"),
    application_submitted: t("status.application_submitted"),
    offer_received: t("status.offer_received"),
    accepted: t("status.accepted"),
    visa_processing: t("status.visa_processing"),
    arrived: t("status.arrived"),
    completed: t("status.completed"),
    lost: t("status.lost"),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-headline-lg text-foreground">
          {t("applications.title")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("applications.subtitle", { count: leads.length, new: newCount })}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {statusKeys.map((value) => {
          const active = sp.status === value;
          const count =
            value === "new"
              ? newCount
              : leads.filter((l) => l.status === value).length;
          return (
            <Link
              key={value}
              href={`/admin/applications?status=${value}`}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-foreground/20 hover:text-foreground"
              }`}
            >
              {statusLabelMap[value]}
              {count > 0 && (
                <span className="rounded bg-foreground/10 px-1.5 tabular-nums">
                  {count}
                </span>
              )}
            </Link>
          );
        })}
        {(sp.status ?? "") && (
          <Link
            href="/admin/applications"
            className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            {t("applications.all")}
          </Link>
        )}
      </div>

      {leads.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-20 text-center">
          <FileText className="h-10 w-10 text-muted-foreground/50" />
          <p className="mt-4 text-sm text-muted-foreground">
            {t("applications.empty")}
          </p>
          <p className="text-xs text-muted-foreground/70">
            {t("applications.emptyHint")}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>{t("applications.student")}</TableHead>
                <TableHead>{t("applications.contact")}</TableHead>
                <TableHead>{t("applications.university")}</TableHead>
                <TableHead>{t("applications.status")}</TableHead>
                <TableHead>{t("applications.consultant")}</TableHead>
                <TableHead>{t("applications.date")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id} className="hover:bg-muted/30">
                  <TableCell>
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {lead.student?.fullName ?? t("applications.unknown")}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
                      {lead.student?.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {lead.student.email}
                        </span>
                      )}
                      {lead.student?.countryCode && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {lead.student.countryCode}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {lead.universityId === "direct"
                      ? t("applications.general")
                      : lead.universityId}
                    {lead.programId && (
                      <Badge variant="outline" className="ms-2 text-xs">
                        {lead.programId}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <LeadStatusBadge status={lead.status} labels={labels} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {lead.consultant?.fullName ??
                      consultantMap.get(lead.assignedConsultantId ?? "") ??
                      "—"}
                  </TableCell>
                  <TableCell className="tabular-nums text-muted-foreground">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

// src/app/admin/(dashboard)/leads/[id]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, FileText, MessageSquare } from "lucide-react";
import { crm } from "@/lib/crm";
import { data } from "@/lib/data";
import { getAdminT, leadStatusLabels } from "@/lib/admin-i18n";
import { APPLICATION_STATUS_LABELS } from "@/types/crm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LeadStatusBadge } from "@/components/admin/LeadStatusBadge";
import { PipelineStepper } from "@/components/admin/PipelineStepper";
import { LeadActions } from "@/components/admin/AssignConsultant";
import { parseLeadNotes, extractLeadDocuments } from "@/lib/crm/lead-documents";
import { getSignedApplyDocumentUrl } from "@/lib/storage";
import { AdminMessageComposer } from "@/components/admin/AdminMessageComposer";
import { CreateApplicationButton } from "@/components/admin/CreateApplicationButton";

export const dynamic = "force-dynamic";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [{ t }, lead, consultants, messages] = await Promise.all([
    getAdminT(),
    crm.getLead(id),
    crm.listStaff(),
    crm.listMessages(id),
  ]);
  if (!lead) notFound();
  const labels = leadStatusLabels(t);

  // The apply-form payload (student's message + uploaded document paths) lives
  // in leads.notes as JSON until the lead is converted to an application.
  const notes = parseLeadNotes(lead.notes);
  const documents = extractLeadDocuments(notes);
  // Signed URLs are generated server-side (service role); failures render as
  // disabled chips rather than breaking the page.
  const documentLinks = await Promise.all(
    documents.map(async (doc) => ({
      ...doc,
      url: doc.isPlaceholder
        ? null
        : await getSignedApplyDocumentUrl(doc.path).catch(() => null),
    })),
  );

  // Resolve application university slugs to display names
  const appUniSlugs = [...new Set(lead.applications.map((a) => a.universityId))];
  const appUnis = await Promise.all(appUniSlugs.map((s) => data.universities.getBySlug(s)));
  const uniNameMap = new Map(appUniSlugs.map((slug, i) => [slug, appUnis[i]?.name ?? slug]));

  const details: { label: string; value: string }[] = [
    { label: "Degree", value: notes?.degreeLevel ?? "" },
    { label: "Language", value: notes?.instructionLanguage ?? "" },
    { label: "Intake", value: notes?.intake ?? "" },
    { label: "Date of birth", value: notes?.dateOfBirth ?? "" },
    { label: "Gender", value: notes?.gender ?? "" },
    { label: "Nationality", value: notes?.nationality ?? "" },
    {
      label: "Scholarship interest",
      value:
        notes?.scholarshipInterest === undefined
          ? ""
          : notes.scholarshipInterest
            ? "Yes"
            : "No",
    },
    {
      label: "Dormitory",
      value:
        notes?.dormitory === undefined ? "" : notes.dormitory ? "Yes" : "No",
    },
  ].filter((d) => d.value !== "");

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/leads"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to leads
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="font-display text-headline-lg text-foreground">
            {lead.student?.fullName ?? "Unknown"}
          </h1>
          <LeadStatusBadge status={lead.status} labels={labels} />
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {lead.student?.email} · {lead.student?.countryCode ?? "—"}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <PipelineStepper current={lead.status} labels={labels} />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {(notes?.message || details.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle>Application details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {notes?.message && (
                  <p className="whitespace-pre-line rounded border border-border bg-surface-low p-3 text-sm text-foreground">
                    {notes.message}
                  </p>
                )}
                {details.length > 0 && (
                  <dl className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
                    {details.map((d) => (
                      <div key={d.label}>
                        <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                          {d.label}
                        </dt>
                        <dd className="text-sm font-medium text-foreground">
                          {d.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              {documentLinks.length === 0 ? (
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" aria-hidden /> No documents
                  uploaded with this lead.
                </p>
              ) : (
                <ul className="space-y-2">
                  {documentLinks.map((doc) => (
                    <li key={doc.path}>
                      {doc.url ? (
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between rounded border border-border p-3 hover:bg-accent"
                        >
                          <span className="flex items-center gap-2 text-sm font-medium">
                            <FileText
                              className="h-4 w-4 text-primary"
                              aria-hidden
                            />
                            {doc.label}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            View{" "}
                            <ExternalLink className="h-3 w-3" aria-hidden />
                          </span>
                        </a>
                      ) : (
                        <span className="flex items-center justify-between rounded border border-dashed border-border p-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-2">
                            <FileText className="h-4 w-4" aria-hidden />
                            {doc.label}
                          </span>
                          <span className="text-xs">
                            {doc.isPlaceholder
                              ? "Dev placeholder"
                              : "Unavailable"}
                          </span>
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-3 text-xs text-muted-foreground">
                Links expire after 10 minutes — reload the page for fresh ones.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Applications</CardTitle>
              <CreateApplicationButton
                leadId={lead.id}
                universityId={lead.universityId}
              />
            </CardHeader>
            <CardContent className="space-y-2">
              {lead.applications.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No applications yet.
                </p>
              ) : (
                lead.applications.map((app) => (
                  <Link
                    key={app.id}
                    href={`/admin/applications/${app.id}`}
                    className="flex items-center justify-between rounded border border-border p-3 hover:bg-accent"
                  >
                    <span className="text-sm font-medium">
                      {uniNameMap.get(app.universityId) ?? app.universityId}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {APPLICATION_STATUS_LABELS[app.status]}
                    </span>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Messages
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {messages.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No messages yet.
                </p>
              ) : (
                <div className="max-h-64 space-y-2 overflow-y-auto">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`rounded border p-2 text-sm ${msg.senderId === lead.userId ? 'border-blue-200 bg-blue-50' : 'border-border bg-surface-low'}`}
                    >
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span className="font-medium">
                          {msg.senderName ?? (msg.senderId === lead.userId ? lead.student?.fullName : 'Admin')}
                        </span>
                        <span>{new Date(msg.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="mt-1 whitespace-pre-line text-foreground">
                        {msg.body}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              <AdminMessageComposer leadId={lead.id} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              {lead.timeline.length === 0 ? (
                <p className="text-sm text-muted-foreground">No events.</p>
              ) : (
                <ul className="space-y-3">
                  {lead.timeline.map((a) => (
                    <li key={a.id} className="flex justify-between text-sm">
                      <span>
                        <span className="font-medium">
                          {a.actorName ?? "System"}
                        </span>{" "}
                        <span className="text-muted-foreground">
                          {a.action}
                        </span>
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(a.createdAt).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <LeadActions
              leadId={lead.id}
              status={lead.status}
              consultants={consultants.filter((c) => c.role === "consultant")}
              labels={labels}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

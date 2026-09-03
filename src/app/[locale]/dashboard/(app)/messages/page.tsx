import { getTranslations } from "next-intl/server";
import { crm } from "@/lib/crm";
import { requireStudentAny } from "@/lib/crm/student-session";
import type { AppLocale } from "@/i18n/routing";
import { MessageComposer } from "@/components/student/MessageComposer";
import { MarkThreadRead } from "@/components/student/MarkThreadRead";
import { Link } from "@/i18n/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface MessagesPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ lead?: string }>;
}

export default async function MessagesPage({
  params,
  searchParams,
}: MessagesPageProps) {
  const { locale } = await params;
  const session = await requireStudentAny(locale as AppLocale);
  const t = await getTranslations({ locale, namespace: "Student.messages" });

  const leads = await crm.listMyLeads(session.userId);
  if (leads.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="font-display text-headline-lg text-foreground">
          {t("title")}
        </h1>
        <p className="text-sm text-muted-foreground">{t("empty")}</p>
      </div>
    );
  }

  // Which thread is open? Defaults to the first; `?lead=` overrides it but
  // only when the id actually belongs to the student (no guessing).
  const { lead: requested } = await searchParams;
  const validIds = new Set(leads.map((l) => l.id));
  const activeId =
    requested && validIds.has(requested) ? requested : leads[0].id;
  const activeLead = leads.find((l) => l.id === activeId)!;

  const dateFmt = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // Sidebar rows need an unread hint; fetch each thread's messages (a student
  // has a handful of leads, so N+1 here is bounded and read-only).
  const threadMeta = await Promise.all(
    leads.map(async (lead) => {
      const msgs = await crm.listMessages(lead.id);
      const unread = msgs.some(
        (m) => m.senderId !== session.userId && !m.readAt,
      );
      const last = msgs[msgs.length - 1];
      return { lead, unread, lastAt: last?.createdAt ?? lead.createdAt };
    }),
  );

  const activeMessages = await crm.listMessages(activeLead.id);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-headline-lg text-foreground">
        {t("title")}
      </h1>

      {leads.length === 1 ? (
        <ThreadCard
          lead={leads[0]}
          messages={activeMessages}
          mineUserId={session.userId}
          t={t}
          dateFmt={dateFmt}
          consultantName={leads[0].consultant?.fullName ?? null}
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          {/* Conversation picker */}
          <nav aria-label={t("title")} className="space-y-2">
            <p className="px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t("consultant")}
            </p>
            <ul className="space-y-1.5">
              {threadMeta.map(({ lead, unread, lastAt }) => {
                const isActive = lead.id === activeId;
                return (
                  <li key={lead.id}>
                    <Link
                      href={`/messages?lead=${encodeURIComponent(lead.id)}`}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "flex items-start justify-between gap-2 rounded-lg border p-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        isActive
                          ? "border-primary/40 bg-primary/5"
                          : "border-border bg-card hover:bg-surface-low",
                      )}
                    >
                      <span className="min-w-0">
                        <span
                          className={cn(
                            "block truncate font-medium",
                            isActive ? "text-primary" : "text-foreground",
                          )}
                        >
                          {lead.consultant?.fullName ?? t("consultant")}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          {dateFmt.format(new Date(lastAt))}
                        </span>
                      </span>
                      {unread && (
                        <span
                          aria-label={t("consultant")}
                          className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary"
                          title={t("consultant")}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <ThreadCard
            lead={activeLead}
            messages={activeMessages}
            mineUserId={session.userId}
            t={t}
            dateFmt={dateFmt}
            consultantName={activeLead.consultant?.fullName ?? null}
          />
        </div>
      )}

      {/* Read receipt moves to a client effect so we never write to the DB
          during server rendering (render-time writes can double-fire in
          streaming and violate React's purity rules). */}
      <MarkThreadRead leadId={activeLead.id} />
    </div>
  );
}

function ThreadCard({
  lead,
  messages,
  mineUserId,
  t,
  dateFmt,
  consultantName,
}: {
  lead: { id: string };
  messages: Array<{
    id: string;
    senderId: string;
    senderName: string;
    body: string;
    createdAt: string;
  }>;
  mineUserId: string;
  t: (key: string) => string;
  dateFmt: Intl.DateTimeFormat;
  consultantName: string | null;
}) {
  return (
    <Card className="min-w-0">
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle className="text-base">
          {consultantName ?? t("consultant")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {messages.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("empty")}</p>
        ) : (
          <ul className="space-y-2">
            {messages.map((m) => {
              const mine = m.senderId === mineUserId;
              return (
                <li
                  key={m.id}
                  className={cn(
                    "max-w-[80%] rounded-lg border border-border p-3 text-sm",
                    mine ? "ml-auto bg-primary/5" : "bg-card",
                  )}
                >
                  <p className="mb-1 flex items-baseline justify-between gap-2 text-xs text-muted-foreground">
                    <span>{mine ? t("you") : m.senderName}</span>
                    <time dateTime={m.createdAt}>
                      {dateFmt.format(new Date(m.createdAt))}
                    </time>
                  </p>
                  <p className="text-foreground">{m.body}</p>
                </li>
              );
            })}
          </ul>
        )}
        <MessageComposer leadId={lead.id} />
      </CardContent>
    </Card>
  );
}

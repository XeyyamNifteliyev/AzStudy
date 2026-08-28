import type { Metadata } from "next";
import { requireStaff } from "@/lib/crm/session";
import { crm } from "@/lib/crm";
import { getAdminLocale } from "@/lib/admin-i18n";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";

// Never index admin pages. robots.txt disallow alone is insufficient —
// Google may still surface discovered URLs without a snippet. The meta tag
// makes the intent explicit at the document level.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // PERF: session, locale and the sidebar badge count are independent — run
  // them concurrently instead of a serial waterfall on every admin pageview.
  const [session, locale, counts] = await Promise.all([
    requireStaff(),
    getAdminLocale(),
    crm.countByStatus(),
  ]);
  const newApplicationsCount = counts["new"] ?? 0;
  return (
    <div className="flex min-h-screen">
      <AdminSidebar
        newApplicationsCount={newApplicationsCount}
        locale={locale}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar session={session} locale={locale} />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}

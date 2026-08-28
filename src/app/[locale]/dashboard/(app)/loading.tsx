// Instant skeleton on every student-dashboard navigation. The segment wraps
// all (app) pages (overview, applications, documents, messages, notifications),
// so a click in the sidebar shows feedback immediately while the server
// renders the target page.
import { DashboardPageSkeleton } from "@/components/dashboard/skeletons";

export default function StudentDashboardLoading() {
  return <DashboardPageSkeleton cards={4} />;
}

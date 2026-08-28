// Instant skeleton on every admin-panel navigation (overview, applications,
// leads, users, audit, settings). Shown while the (dashboard) layout resolves
// the staff session and the target page loads its data.
import { DashboardStatsSkeleton } from "@/components/dashboard/skeletons";

export default function AdminDashboardLoading() {
  return <DashboardStatsSkeleton />;
}

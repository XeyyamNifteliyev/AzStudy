// src/app/admin/(dashboard)/settings/page.tsx
import { getAdminT } from "@/lib/admin-i18n";
import { requireStaff } from "@/lib/crm/session";
import { PasswordChangeForm } from "@/components/admin/PasswordChangeForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  // PERF: independent — fetch concurrently (requireStaff is request-deduped
  // via React cache in lib/crm/session).
  const [{ locale }, session] = await Promise.all([
    getAdminT(),
    requireStaff(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-headline-lg text-foreground">
          {locale === "az" ? "Tənzimləmələr" : "Settings"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {locale === "az" ? "Hesab tənzimləmələri" : "Account settings"}
        </p>
      </div>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>
            {locale === "az" ? "Parol dəyişdir" : "Change Password"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PasswordChangeForm session={session} />
        </CardContent>
      </Card>
    </div>
  );
}

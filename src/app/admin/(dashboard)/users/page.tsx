// src/app/admin/(dashboard)/users/page.tsx
import { crm } from "@/lib/crm";
import { getAdminT } from "@/lib/admin-i18n";
import { requireStaff } from "@/lib/crm/session";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RoleChangeForm } from "@/components/admin/RoleChangeForm";
import { AdminAllowlistManager } from "@/components/admin/AdminAllowlistManager";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  // PERF: translations, session, staff and leads are independent — fetch
  // concurrently; only the allowlist depends on the resolved role.
  const [{ t, locale }, session, staff, leads] = await Promise.all([
    getAdminT(),
    requireStaff(),
    crm.listStaff(),
    crm.listLeads(),
  ]);
  const adminCount = staff.filter((s) => s.role === "admin").length;
  const allowlist =
    session.role === "admin" ? await crm.listAdminAllowlist() : [];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-headline-lg text-foreground">
          {t("users.title")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {locale === "az" ? "Staff və konsultantlar" : "Staff & consultants"}
        </p>
      </div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{locale === "az" ? "Ad" : "Name"}</TableHead>
              <TableHead>{locale === "az" ? "E-poçt" : "Email"}</TableHead>
              <TableHead>{locale === "az" ? "Rol" : "Role"}</TableHead>
              <TableHead>
                {locale === "az" ? "Aktiv lead" : "Active leads"}
              </TableHead>
              {session.role === "admin" && (
                <TableHead>
                  {locale === "az" ? "Rol dəyiş" : "Change role"}
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {staff.map((p) => {
              const active = leads.filter(
                (l) =>
                  l.assignedConsultantId === p.id && l.status !== "completed",
              ).length;
              const isLastAdmin = p.role === "admin" && adminCount <= 1;
              return (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.fullName}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {p.email}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={p.role === "admin" ? "default" : "secondary"}
                    >
                      {t(`role.${p.role}` as never)}
                    </Badge>
                  </TableCell>
                  <TableCell className="tabular-nums">{active}</TableCell>
                  {session.role === "admin" && (
                    <TableCell>
                      {isLastAdmin ? (
                        <span className="text-xs text-muted-foreground">
                          {locale === "az"
                            ? "Son admin — dəyişdirilə bilməz"
                            : "Last admin — cannot change"}
                        </span>
                      ) : p.id === session.userId ? (
                        <span className="text-xs text-muted-foreground">
                          {locale === "az" ? "Siz" : "You"}
                        </span>
                      ) : (
                        <RoleChangeForm
                          profileId={p.id}
                          currentRole={
                            p.role as "admin" | "consultant" | "editor"
                          }
                          locale={locale}
                        />
                      )}
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      {session.role === "admin" && (
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-headline-md text-foreground">
              {locale === "az" ? "Admin icazəli email-lər" : "Admin allowlist"}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {locale === "az"
                ? "Yalnız burada olan Gmail hesabları admin panelə daxil ola bilər."
                : "Only these email addresses can sign into the admin panel."}
            </p>
          </CardHeader>
          <CardContent>
            <AdminAllowlistManager emails={allowlist} locale={locale} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

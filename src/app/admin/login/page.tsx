// src/app/admin/login/page.tsx
import { crm } from "@/lib/crm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmailOtpForm } from "@/components/auth/EmailOtpForm";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { isDevAuthEnabled } from "@/lib/crm/student-session";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const showDev = isDevAuthEnabled();
  const staff = showDev ? await crm.listStaff() : [];

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin sign in</CardTitle>
          <CardDescription>
            Sign in with your work email. Staff access requires an
            admin/consultant/editor profile.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Google sign-in for admin/consultant/editor accounts: the auth
              callback routes allowlisted emails straight to /admin, so an
              admin Gmail lands directly in the panel. The OTP form below is
              the password-based path for non-Google staff mailboxes (requires
              the email provider to be enabled in Supabase). */}
          <GoogleSignInButton next="/admin" />
          <div className="flex items-center gap-3" aria-hidden="true">
            <span className="h-px flex-1 bg-border" />
            <span className="text-xs uppercase text-muted-foreground">or</span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <EmailOtpForm next="/admin" />
          {showDev && staff.length > 0 && (
            <div className="space-y-2 border-t border-border pt-4">
              <p className="text-xs uppercase text-muted-foreground">
                Dev login
              </p>
              {staff.map((p) => (
                <form key={p.id} action={devLoginAction} className="block">
                  <input type="hidden" name="profileId" value={p.id} />
                  <Button
                    type="submit"
                    variant="outline"
                    size="sm"
                    className="w-full justify-between"
                  >
                    <span>{p.fullName}</span>
                    <span className="text-xs uppercase text-muted-foreground">
                      {p.role}
                    </span>
                  </Button>
                </form>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

async function devLoginAction(formData: FormData) {
  "use server";
  const { devLogin } = await import("@/app/actions/admin-auth");
  await devLogin({ profileId: String(formData.get("profileId")) });
}
